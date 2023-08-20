import Blockly, { Block, CodeGenerator } from "blockly";
import { javascriptGenerator as originalJavascriptGenerator } from "blockly/javascript";
import Ja from "blockly/msg/ja";

/**
 * blockly/javascript からエクスポートされる javascriptGenerator が現状 any なので再エクスポートで型を付ける
 * オリジナルの型定義が正しくつくようになればこの行がエラーになって検知できる
 */
export const javascriptGenerator: CodeGenerator & {
  /**
   * @see https://developers.google.com/blockly/guides/create-custom-blocks/generating-code
   * @see https://github.com/google/blockly/blob/cf850d5f782d61f34d8a89da1814d96c966d0453/core/generator.ts#L272
   */
  [key: string]: (this: Block, block: Block) => string | [string, number];
} = originalJavascriptGenerator;

// https://developers.google.com/blockly/reference/js/blockly.codegenerator_class.statement_prefix_property.md
export const STATEMENT_PREFIX_FUNCTION = "beforeStatement";
javascriptGenerator.STATEMENT_PREFIX = `typeof ${STATEMENT_PREFIX_FUNCTION} === "function" && ${STATEMENT_PREFIX_FUNCTION}(%1);\n`;
javascriptGenerator.addReservedWords(STATEMENT_PREFIX_FUNCTION);

function initBlockly() {
  Blockly.setLocale(Ja);
  // https://developers.google.com/blockly/guides/create-custom-blocks/block-colour#defining_the_block_colour
  Object.assign(Blockly, {
    HSV_SATURATION: 0.6,
    HSV_VALUE: 1,
  });
}

initBlockly();
