import { useCallback, useEffect, useRef } from "react";
import { useUpdate } from "react-use";
import Blockly from "blockly";
import { useFirestore } from "./firebase";

export type UseBlocklyWorkspaceProps = {
  type: string;
  toolboxBlocks: string[];
};

export type UseBlocklyWorkspaceReturnValue = {
  workspaceAreaRef: React.MutableRefObject<HTMLDivElement | null>;
  code: string;
  highlightBlock(id: string): void;
};

const clientId = Math.floor(Math.random() * 1000000);

export function useBlocklyWorkspace(
  props: UseBlocklyWorkspaceProps,
): UseBlocklyWorkspaceReturnValue {
  const workspaceAreaRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg>();
  const codeRef = useRef("");

  const firestoreContext = useFirestore();
  const firestoreSavedWorkspaceRef = useRef(
    firestoreContext.data[props.type]?.workspace,
  );
  const persistToFirestore = firestoreContext.persist;

  const update = useUpdate();

  const highlightBlock = useCallback((id: string) => {
    workspaceRef.current?.highlightBlock(id);
  }, []);

  useEffect(() => {
    const workspaceArea = workspaceAreaRef.current;
    if (!workspaceArea) return undefined;
    const workspace = Blockly.inject(workspaceArea, {
      toolbox: [
        "<xml>",
        ...props.toolboxBlocks.map(
          (toolboxBlock) => `<block type="${toolboxBlock}"></block>`,
        ),
        "</xml>",
      ].join(""),
      grid: { spacing: 20, length: 3, colour: "#ccc", snap: true },
      trashcan: true,
      renderer: "thrasos",
      move: { drag: true, scrollbars: true, wheel: true },
    });
    workspaceRef.current = workspace;

    let persistTimerId = NaN;
    let lastPersistTimestamp = Date.now();
    const workspaceChangeCallback = () => {
      const newCode = Blockly.JavaScript.workspaceToCode(workspaceRef.current);
      if (newCode !== codeRef.current) {
        codeRef.current = newCode;
        update();
      }

      // Firestoreへの保存処理
      window.clearTimeout(persistTimerId);
      persistTimerId = window.setTimeout(() => {
        const serializedWorkspace = Blockly.Xml.domToText(
          Blockly.Xml.workspaceToDom(workspace),
        );
        if (firestoreSavedWorkspaceRef.current !== serializedWorkspace)
          persistToFirestore(props.type, serializedWorkspace, clientId);
        lastPersistTimestamp = Date.now();
      }, Math.max(lastPersistTimestamp + 2000 - Date.now(), 0));
    };
    workspace.addChangeListener(workspaceChangeCallback);

    return () => {
      workspace.removeChangeListener(workspaceChangeCallback);
      workspace.dispose();
    };
  }, [props.type, props.toolboxBlocks, update, persistToFirestore]);

  useEffect(() => {
    const workspaceEntry = firestoreContext.data[props.type];
    if (
      workspaceRef.current &&
      workspaceEntry &&
      workspaceEntry.clientId !== clientId
    ) {
      workspaceRef.current.clear();
      Blockly.Xml.domToWorkspace(
        Blockly.Xml.textToDom(workspaceEntry.workspace),
        workspaceRef.current,
      );
      firestoreSavedWorkspaceRef.current = workspaceEntry.workspace;
    }
  }, [props.type, firestoreContext]);

  return {
    workspaceAreaRef,
    code: codeRef.current,
    highlightBlock,
  };
}
