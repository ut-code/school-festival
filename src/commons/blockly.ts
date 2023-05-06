import { useCallback, useEffect, useRef } from "react";
import Blockly, { VariableModel } from "blockly";
import { javascriptGenerator } from "../config/blockly";

/** ブロックの数が少ない場合 */
export type BlocklyToolboxDefinitionFlyout = {
  type: "flyout";
  blockTypes: string[];
};

/** ブロックの数が多い場合、もしくは変数が必要な場合 */
export type BlocklyToolboxDefinitionCategory = {
  type: "category";
  categories: Array<{ name: string; blockTypes: string[] }>;
  enableVariables?: boolean;
};

export type BlocklyToolboxDefinition =
  | BlocklyToolboxDefinitionFlyout
  | BlocklyToolboxDefinitionCategory;

export type UseBlocklyWorkspaceProps = {
  toolboxDefinition: BlocklyToolboxDefinition;
  onCodeChange?: (code: string, variableNames: string[]) => void;
};

export type UseBlocklyWorkspaceReturnValue = {
  workspaceAreaRef: React.MutableRefObject<HTMLDivElement | null>;
  highlightBlock(id: string): void;
  getCode(): string;
};

export function useBlocklyWorkspace({
  toolboxDefinition,
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
      toolbox:
        toolboxDefinition.type === "flyout"
          ? {
              kind: "flyoutToolbox",
              contents: toolboxDefinition.blockTypes.map((type) => ({
                kind: "block",
                type,
              })),
            }
          : {
              kind: "categoryToolbox",
              contents: [
                ...toolboxDefinition.categories.map((category) => ({
                  kind: "category",
                  name: category.name,
                  contents: category.blockTypes.map((type) => ({
                    kind: "block",
                    type,
                  })),
                })),
                ...(toolboxDefinition.enableVariables
                  ? [{ kind: "category", name: "変数", custom: "VARIABLE" }]
                  : []),
              ],
            },
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
          // onCodeChange(latestCode, workspace.getAllVariableNames());
          onCodeChange(
            latestCode,
            Blockly.Variables.allUsedVarModels(workspace).map(
              (model: VariableModel) => model.name
            )
          );
        }
      });
    }
    workspaceRef.current = workspace;

    return () => {
      workspace.dispose();
    };
  }, [toolboxDefinition, onCodeChange, getCode]);

  return {
    workspaceAreaRef,
    highlightBlock,
    getCode,
  };
}
