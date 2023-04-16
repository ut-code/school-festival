import Blockly from "blockly";
import { javascriptGenerator } from "../../config/blockly";

// まずはブロックに名前を付けます。この名前はグローバルにユニークである必要があります。
// ユーザー定義のコンポーネントには CUSTOM プレフィックスをつけ、続けて各 Workspace 毎のプレフィックスをつけています。
// export const CUSTOM_TEMPLATE_INCREMENT = "custom_template_increment";
export const CUSTOM_GRAPH_COLOUR_CHANGE = "CUSTOM_GRAPH_COLOUR_CHANGE";
export const CUSTOM_GRAPH_DIRECTION_CHECK = "CUSTOM_GRAPH_DIRECTION_CHECK";
// ブロックのフィールドにも名前が必要です。こちらはブロック毎にユニークで構いません。
// export const CUSTOM_TEMPLATE_INCREMENT_VALUE = "value";
export const CUSTOM_GRAPH_COLOUR = "MYCOLOUR";
export const CUSTOM_GRAPH_DIRECTION = "MYCHECK";
// Blockly.Blocks のプロパティでブロックを定義します。
// 詳細は https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks を参照してください。
// Blockly.Blocks[CUSTOM_TEMPLATE_INCREMENT] = {
//   init(this: Blockly.Block) {
//     this.appendDummyInput()
//       .appendField(new FieldNumber(), CUSTOM_TEMPLATE_INCREMENT_VALUE)
//       .appendField("増やす");
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(0);
//     this.setTooltip("増やします");
//   },
// };

// javascriptGenerator のプロパティにはブロックがどのように JavaScript に変換されるのかを定義します。
// [JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter) の仕様により ES5 までの文法しか使えません。
// javascriptGenerator[CUSTOM_TEMPLATE_INCREMENT] = (block) =>
//   `${CUSTOM_TEMPLATE_INCREMENT}(${block.getFieldValue(
//     CUSTOM_TEMPLATE_INCREMENT_VALUE
//   )});`;

Blockly.Blocks[CUSTOM_GRAPH_COLOUR_CHANGE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["赤", "red"],
          ["青", "blue"],
        ]),
        CUSTOM_GRAPH_COLOUR
      )
      .appendField("の色にする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("gray");
    this.setTooltip("色を変えます");
  },
};

javascriptGenerator[CUSTOM_GRAPH_COLOUR_CHANGE] = (block) =>
  `${CUSTOM_GRAPH_COLOUR_CHANGE}('${block.getFieldValue(
    CUSTOM_GRAPH_COLOUR
  )}');`;

// Blockly.Blocks[CUSTOM_GRAPH_DIRECTION_CHECK] = {
//   init(this: Blockly.Block) {
//     this.appendDummyInput()
//       .appendField(
//         new Blockly.FieldDropdown([
//           ["左", "left"],
//           ["右", "right"],
//         ]),
//         CUSTOM_GRAPH_DIRECTION
//       )
//       .appendField("のノードへ移動する");
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour("green");
//     this.setTooltip("移動するノードを決めます");
//   },
// };

// javascriptGenerator[CUSTOM_GRAPH_DIRECTION_CHECK] = (block) =>
//   `${CUSTOM_GRAPH_DIRECTION_CHECK}('${block.getFieldValue(
//     CUSTOM_GRAPH_DIRECTION
//   )}');`;
