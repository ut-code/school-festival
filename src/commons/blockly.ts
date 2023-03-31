import { useCallback, useEffect, useRef } from "react";
import Blockly from "blockly";

export type UseBlocklyWorkspaceProps = {
  type: string;
  toolboxBlocks: string[];
};

export type UseBlocklyWorkspaceReturnValue = {
  workspaceAreaRef: React.MutableRefObject<HTMLDivElement | null>;
  code: string;
  highlightBlock(id: string): void;
};

export function useBlocklyWorkspace(
  props: UseBlocklyWorkspaceProps
): UseBlocklyWorkspaceReturnValue {
  const workspaceAreaRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg>();
  const codeRef = useRef("");

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
          (toolboxBlock) => `<block type="${toolboxBlock}"></block>`
        ),
        "</xml>",
      ].join(""),
      grid: { spacing: 20, length: 3, colour: "#ccc", snap: true },
      trashcan: true,
      renderer: "thrasos",
      move: { drag: true, scrollbars: true, wheel: true },
    });
    workspaceRef.current = workspace;

    return () => {
      workspace.dispose();
    };
  }, [props.type, props.toolboxBlocks]);

  return {
    workspaceAreaRef,
    code: codeRef.current,
    highlightBlock,
  };
}
