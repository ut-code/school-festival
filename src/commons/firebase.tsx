import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseApiKey = process.env.FIREBASE_API_KEY;
if (!firebaseApiKey) throw new Error("Firebase API key not found.");

initializeApp(JSON.parse(firebaseApiKey));
const db = getFirestore();

export type FirestoreData = {
  [P in string]?: { workspace: string; clientId: number };
};

export type FirestoreContextValue = {
  data: FirestoreData;
  persist(key: string, workspace: string, clientId: number): void;
};

export const FirestoreContext = createContext<FirestoreContextValue | null>(
  null,
);

export function FirestoreProvider(
  props: React.PropsWithChildren<Record<never, never>>,
): JSX.Element {
  const location = useLocation();
  const params = new window.URLSearchParams(location.search);
  const id = params.get("id");

  const [firestoreData, setFirestoreData] = useState<FirestoreData>({});

  useEffect(() => {
    if (!id) return undefined;
    return onSnapshot(doc(db, "data", id), (newDoc) => {
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
      setDoc(doc(db, "data", id), newData, { merge: true });
    },
    [id],
  );

  return (
    <FirestoreContext.Provider
      value={{ data: firestoreData, persist: persistFirestoreData }}
    >
      {props.children}
    </FirestoreContext.Provider>
  );
}

export function useFirestore(): FirestoreContextValue {
  const context = useContext(FirestoreContext);
  if (!context) throw new Error();
  return context;
}
