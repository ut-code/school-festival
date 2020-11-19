import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

export const firestore = window.firebase?.default.firestore();

export type FirestoreData = {
  [P in string]?: { workspace: string; clientId: number };
};

export type FirestoreContext = {
  data: FirestoreData;
  persist(key: string, workspace: string, clientId: number): void;
};

export const firestoreContext = React.createContext<FirestoreContext>({
  data: {},
  persist() {},
});

export function FirestoreProvider(
  props: React.PropsWithChildren<Record<never, never>>,
) {
  const location = useLocation();
  const params = new window.URLSearchParams(location.search);
  const id = params.get('id');

  const [firestoreData, setFirestoreData] = useState<FirestoreData>({});

  useEffect(() => {
    if (!id) return undefined;
    return firestore
      ?.collection('data')
      .doc(id)
      .onSnapshot((newDoc) => {
        const newData = newDoc.data();
        if (newData) setFirestoreData(newData);
      });
  }, [location.search, id]);

  const persistFirestoreData = useCallback(
    (key: string, text: string, clientId: number) => {
      if (!id) return;
      const newData: FirestoreData = {
        [key]: { workspace: text, clientId },
      };
      firestore?.collection('data').doc(id).set(newData, { merge: true });
    },
    [id],
  );

  return (
    <firestoreContext.Provider
      value={{ data: firestoreData, persist: persistFirestoreData }}
    >
      {props.children}
    </firestoreContext.Provider>
  );
}
