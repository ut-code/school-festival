import Blockly, { FieldNumber } from "blockly";
import { javascriptGenerator } from "../../config/blockly";

// まずはブロックに名前を付けます。この名前はグローバルにユニークである必要があります。
// ユーザー定義のコンポーネントには CUSTOM プレフィックスをつけ、続けて各 Workspace 毎のプレフィックスをつけています。
export const CUSTOM_TEMPLATE_INCREMENT = "custom_template_increment";

// ブロックのフィールドにも名前が必要です。こちらはブロック毎にユニークで構いません。
export const CUSTOM_TEMPLATE_INCREMENT_VALUE = "value";

// Blockly.Blocks のプロパティでブロックを定義します。
// 詳細は https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks を参照してください。
Blockly.Blocks[CUSTOM_TEMPLATE_INCREMENT] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new FieldNumber(), CUSTOM_TEMPLATE_INCREMENT_VALUE)
      .appendField("増やす");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("増やします");
  },
};

// javascriptGenerator のプロパティにはブロックがどのように JavaScript に変換されるのかを定義します。
// [JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter) の仕様により ES5 までの文法しか使えません。
javascriptGenerator[CUSTOM_TEMPLATE_INCREMENT] = (block) =>
  `${CUSTOM_TEMPLATE_INCREMENT}(${block.getFieldValue(
    CUSTOM_TEMPLATE_INCREMENT_VALUE
  )});`;

export const CUSTOM_GRAD_CONSOLE_LOG = "custom_grad_console_log";
export const CUSTOM_GRAD_CONSOLE_LOG_VALUE = "value";

Blockly.Blocks[CUSTOM_GRAD_CONSOLE_LOG] = {
  init(this: Blockly.Block) {
    this.appendValueInput(CUSTOM_GRAD_CONSOLE_LOG_VALUE).appendField(
      "console.log"
    );
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  },
};
javascriptGenerator[CUSTOM_GRAD_CONSOLE_LOG] = (block) =>
  `console.log(${javascriptGenerator.valueToCode(
    block,
    CUSTOM_GRAD_CONSOLE_LOG_VALUE,
    0
  )});`;

export const CUSTOM_GRAD_OBJECTIVE = "custom_grad_objective";
export const CUSTOM_GRAD_X = "x";
export const CUSTOM_GRAD_Y = "y";
Blockly.Blocks[CUSTOM_GRAD_OBJECTIVE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("点(");
    this.appendValueInput(CUSTOM_GRAD_X).setCheck("Number");
    this.appendDummyInput().appendField(", ");
    this.appendValueInput(CUSTOM_GRAD_Y).setCheck("Number");
    this.appendDummyInput().appendField(")の高さ");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("関数を適用します。");
  },
};

javascriptGenerator[CUSTOM_GRAD_OBJECTIVE] = (block) =>
  `${CUSTOM_GRAD_OBJECTIVE}(${javascriptGenerator.valueToCode(
    block,
    CUSTOM_GRAD_X,
    0
  )}, ${javascriptGenerator.valueToCode(block, CUSTOM_GRAD_Y, 0)});`;

export const CUSTOM_GRAD_SET_X = "custom_grad_set_x";
export const CUSTOM_GRAD_NEW_X = "custom_grad_new_x";
Blockly.Blocks[CUSTOM_GRAD_SET_X] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("x に");
    this.appendValueInput(CUSTOM_GRAD_NEW_X).setCheck("Number");
    this.appendDummyInput().appendField("をセット");
    this.setColour(230);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("x の値をセットします。");
  },
};

javascriptGenerator[CUSTOM_GRAD_SET_X] = (block) =>
  `${CUSTOM_GRAD_SET_X}(${javascriptGenerator.valueToCode(
    block,
    CUSTOM_GRAD_NEW_X,
    0
  )});`;

export const CUSTOM_GRAD_SET_Y = "custom_grad_set_y";
export const CUSTOM_GRAD_NEW_Y = "custom_grad_new_y";
Blockly.Blocks[CUSTOM_GRAD_SET_Y] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("y に");
    this.appendValueInput(CUSTOM_GRAD_NEW_Y).setCheck("Number");
    this.appendDummyInput().appendField("をセット");
    this.setColour(230);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("y の値をセットします。");
  },
};

javascriptGenerator[CUSTOM_GRAD_SET_Y] = (block) =>
  `${CUSTOM_GRAD_SET_Y}(${javascriptGenerator.valueToCode(
    block,
    CUSTOM_GRAD_NEW_Y,
    0
  )});`;
