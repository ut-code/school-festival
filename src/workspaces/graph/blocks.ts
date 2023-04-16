import Blockly from "blockly";
import { javascriptGenerator } from "../../config/blockly";

// まずはブロックに名前を付けます。この名前はグローバルにユニークである必要があります。
// ユーザー定義のコンポーネントには CUSTOM プレフィックスをつけ、続けて各 Workspace 毎のプレフィックスをつけています。
// export const CUSTOM_TEMPLATE_INCREMENT = "custom_template_increment";
export const CUSTOM_GRAPH_COLOUR_CHANGE = "CUSTOM_GRAPH_COLOUR_CHANGE";
export const CUSTOM_GRAPH_DIRECTION_PUSH = "CUSTOM_GRAPH_DIRECTION_PUSH";
export const CUSTOM_GRAPH_DIRECTION_POP = "CUSTOM_GRAPH_DIRECTION_POP";
// ブロックのフィールドにも名前が必要です。こちらはブロック毎にユニークで構いません。
// export const CUSTOM_TEMPLATE_INCREMENT_VALUE = "value";
export const CUSTOM_GRAPH_COLOUR = "MYCOLOUR";
export const CUSTOM_GRAPH_DIRECTION = "MYDIRECTION";

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
    this.appendDummyInput().appendField("青色にする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("6DA9E4");
    this.setTooltip("色を変えます");
  },
};

javascriptGenerator[CUSTOM_GRAPH_COLOUR_CHANGE] = (block) =>
  `${CUSTOM_GRAPH_COLOUR_CHANGE}();`;

Blockly.Blocks[CUSTOM_GRAPH_DIRECTION_PUSH] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["左", "left"],
          ["右", "right"],
        ]),
        CUSTOM_GRAPH_DIRECTION
      )
      .appendField("のnodeをstackにpushする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("B7B7B7");
    this.setTooltip("stackに追加するnodeを決めます");
  },
};

javascriptGenerator[CUSTOM_GRAPH_DIRECTION_PUSH] = (block) =>
  `${CUSTOM_GRAPH_DIRECTION_PUSH}('${block.getFieldValue(
    CUSTOM_GRAPH_DIRECTION
  )}');`;

Blockly.Blocks[CUSTOM_GRAPH_DIRECTION_POP] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("nodeをstackからpopする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#B7B7B7");
    this.setTooltip("stackからnodeをpopします");
  },
};

javascriptGenerator[CUSTOM_GRAPH_DIRECTION_POP] = (block) =>
  `${CUSTOM_GRAPH_DIRECTION_POP}();`;
