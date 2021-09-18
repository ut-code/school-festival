import Blockly from "blockly";

declare module "blockly" {
  const JavaScript: Blockly.Generator &
    Record<string, (block: Blockly.Block) => string | [string, number]>;
}
