import { useCallback, useEffect, useRef } from "react";
import Blockly from "blockly";
import { javascriptGenerator } from "../config/blockly";

export type UseBlocklyWorkspaceProps = {
  toolboxBlocks: string[];
  onCodeChange?: (code: string) => void;
};

export type UseBlocklyWorkspaceReturnValue = {
  workspaceAreaRef: React.MutableRefObject<HTMLDivElement | null>;
  highlightBlock(id: string): void;
  getCode(): string;
};

export function useBlocklyWorkspace({
  toolboxBlocks,
  onCodeChange,
}: UseBlocklyWorkspaceProps): UseBlocklyWorkspaceReturnValue {
  const workspaceAreaRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg>();

  const highlightBlock = useCallback((id: string) => {
    workspaceRef.current?.highlightBlock(id);
  }, []);

  const getCode = useCallback(
    () => javascriptGenerator.workspaceToCode(workspaceRef.current),
    []
  );

  useEffect(() => {
    const workspaceArea = workspaceAreaRef.current;
    if (!workspaceArea) return undefined;
    const workspace = Blockly.inject(workspaceArea, {
      toolbox: [
        "<xml>",
        ...toolboxBlocks.map(
          (toolboxBlock) => `<block type="${toolboxBlock}"></block>`
        ),
        "</xml>",
      ].join(""),
      grid: { spacing: 20, length: 3, colour: "#ccc", snap: true },
      trashcan: true,
      renderer: "thrasos",
      move: { drag: true, scrollbars: true, wheel: true },
    });
    if (onCodeChange) {
      let previousCode = "";
      workspace.addChangeListener(() => {
        const latestCode = getCode();
        if (previousCode !== latestCode) {
          previousCode = latestCode;
          onCodeChange(latestCode);
        }
      });
    }
    workspaceRef.current = workspace;

    return () => {
      workspace.dispose();
    };
  }, [toolboxBlocks, onCodeChange, getCode]);

  return {
    workspaceAreaRef,
    highlightBlock,
    getCode,
  };
}
