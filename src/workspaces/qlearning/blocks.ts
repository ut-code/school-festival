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

export const CUSTOM_QL_DIRECTION = "direction";
Blockly.Blocks[CUSTOM_QL_DIRECTION] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["左", "left"],
        ["右", "right"],
        ["下", "down"],
        ["上", "up"],
      ]),
      "direction"
    );
    this.setOutput(true, "direction");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

javascriptGenerator[CUSTOM_QL_DIRECTION] = (block) => [
  `"${block.getFieldValue("direction")}"`,
  0,
];

export const CUSTOM_QL_IS_WALL = "is_wall";
Blockly.Blocks[CUSTOM_QL_IS_WALL] = {
  init(this: Blockly.Block) {
    this.appendValueInput("direction").setCheck("direction");
    this.appendDummyInput().appendField("に壁がある");
    this.setOutput(true, "Boolean");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

javascriptGenerator[CUSTOM_QL_IS_WALL] = (block) => {
  const arg =
    javascriptGenerator.valueToCode(block, "direction", 0) || `"left"`;
  return [`${CUSTOM_QL_IS_WALL}(${arg})`, 0];
};

export const CUSTOM_QL_PRESENT_ROW = "present_row";
Blockly.Blocks[CUSTOM_QL_PRESENT_ROW] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("現在位置の行");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

javascriptGenerator[CUSTOM_QL_PRESENT_ROW] = () => [
  `${CUSTOM_QL_PRESENT_ROW}()`,
  0,
];

export const CUSTOM_QL_PRESENT_COL = "present_col";
Blockly.Blocks[CUSTOM_QL_PRESENT_COL] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("現在位置の列");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

javascriptGenerator[CUSTOM_QL_PRESENT_COL] = () => [
  `${CUSTOM_QL_PRESENT_COL}()`,
  0,
];

export const CUSTOM_QL_IS_GOAL = "is_goal";
Blockly.Blocks[CUSTOM_QL_IS_GOAL] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("現在位置がゴールである");
    this.setOutput(true, "Boolean");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

javascriptGenerator[CUSTOM_QL_IS_GOAL] = () => [`${CUSTOM_QL_IS_GOAL}()`, 0];

export const CUSTOM_QL_PROBABLE = "random_int";
Blockly.Blocks[CUSTOM_QL_PROBABLE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("probability").setCheck("Number");
    this.appendDummyInput().appendField("の確率で当たった");
    this.setOutput(true, "Boolean");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

javascriptGenerator[CUSTOM_QL_PROBABLE] = (block) => {
  const arg = javascriptGenerator.valueToCode(block, "probability", 0) || "0";
  return [`${CUSTOM_QL_PROBABLE}(${arg})`, 0];
};

export const CUSTOM_QL_MOVE = "move";
Blockly.Blocks[CUSTOM_QL_MOVE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("direction").setCheck("direction");
    this.appendDummyInput().appendField("に移動する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

javascriptGenerator[CUSTOM_QL_MOVE] = (block) => {
  const arg =
    javascriptGenerator.valueToCode(block, "direction", 0) || `"left"`;
  return `${CUSTOM_QL_MOVE}(${arg})`;
};

export const CUSTOM_QL_MOVE_RANDOM = "move_random";
Blockly.Blocks[CUSTOM_QL_MOVE_RANDOM] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("ランダムに選んだ移動方向");
    this.setOutput(true, "direction");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

javascriptGenerator[CUSTOM_QL_MOVE_RANDOM] = () => [
  `${CUSTOM_QL_MOVE_RANDOM}()`,
  0,
];

export const CUSTOM_QL_MOVE_TO_START = "move_to_start";
Blockly.Blocks[CUSTOM_QL_MOVE_TO_START] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("スタートに移動する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

javascriptGenerator[CUSTOM_QL_MOVE_TO_START] = () =>
  `${CUSTOM_QL_MOVE_TO_START}()`;

export const CUSTOM_QL_QVALUE = "Q_value";
Blockly.Blocks[CUSTOM_QL_QVALUE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("state").setCheck("Number");
    this.appendDummyInput().appendField("から");
    this.appendValueInput("direction").setCheck("direction");
    this.appendDummyInput().appendField("に動く時の評価値");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

javascriptGenerator[CUSTOM_QL_QVALUE] = (block) => {
  const arg1 = javascriptGenerator.valueToCode(block, "state", 0) || 0;
  const arg2 =
    javascriptGenerator.valueToCode(block, "direction", 0) || `"left"`;
  return [`${CUSTOM_QL_QVALUE}(${arg1}, ${arg2})`, 0];
};

export const CUSTOM_QL_QVALUE_UPDATE = "Q_value_update";
Blockly.Blocks[CUSTOM_QL_QVALUE_UPDATE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("state").setCheck("Number");
    this.appendDummyInput().appendField("から");
    this.appendValueInput("direction").setCheck("direction");
    this.appendDummyInput().appendField("に動く時の評価値を");
    this.appendValueInput("value").setCheck("Number");
    this.appendDummyInput().appendField("に更新");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

javascriptGenerator[CUSTOM_QL_QVALUE_UPDATE] = (block) => {
  const arg1 = javascriptGenerator.valueToCode(block, "state", 0) || 0;
  const arg2 =
    javascriptGenerator.valueToCode(block, "direction", 0) || `"left"`;
  const arg3 = javascriptGenerator.valueToCode(block, "value", 0) || 0;
  return `${CUSTOM_QL_QVALUE_UPDATE}(${arg1}, ${arg2}, ${arg3})`;
};
