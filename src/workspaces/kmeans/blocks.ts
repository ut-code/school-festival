import Blockly /* , { FieldNumber } */ from "blockly";
import { javascriptGenerator } from "../../config/blockly";

const VALUE = "value";

// k-means
export type data = {
  x: number;
  y: number;
};
export type cluster = {
  datas: data[];
  n: number;
};

export const CUSTOM_KM_ADD_DATA_TO_ARRAY = "add_data_to_array";
export const CUSTOM_KM_DELETE_DATA_FROM_ARRAY = "delete_data_from_array";
export const CUSTOM_KM_X_OF_DATA_IN_ARRAY = "x_of_data_in_array";
export const CUSTOM_KM_Y_OF_DATA_IN_ARRAY = "y_of_data_in_array";
export const CUSTOM_KM_LENGTH_OF_ARRAY = "length_of_array";
export const CUSTOM_KM_Y_IS_SMALLER_THAN_X = "y_is_smaller_than_x";
export const CUSTOM_KM_DATA_A_IS_DATA_B = "data_a_is_data_b";
export const CUSTOM_KM_DEFINE_A_IS_B = "define_a_is_b";
export const CUSTOM_KM_A_PLUS_B = "a_plus_b";
export const CUSTOM_KM_A_POWER_B = "a_power_b";

Blockly.Blocks[CUSTOM_KM_ADD_DATA_TO_ARRAY] = {
  init() {
    this.appendValueInput("ARRAY").setCheck("Array");
    this.appendDummyInput().appendField("（配列）に(");
    this.appendValueInput("NUMBER_X").setCheck("Number");
    this.appendDummyInput().appendField(",");
    this.appendValueInput("NUMBER_Y").setCheck("Number");
    this.appendDummyInput().appendField(")（点）を加える");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_ADD_DATA_TO_ARRAY] = (block) =>
  `${CUSTOM_KM_ADD_DATA_TO_ARRAY}(
    ${block.getFieldValue("ARRAY")},
    ${block.getFieldValue("NUMBER_X")},
    ${block.getFieldValue("NUMBER_Y")}
    );`;

Blockly.Blocks[CUSTOM_KM_DELETE_DATA_FROM_ARRAY] = {
  init() {
    this.appendValueInput("ARRAY").setCheck("Array");
    this.appendDummyInput().appendField("（配列）から");
    this.appendValueInput("NUMBER").setCheck("Number");
    this.appendDummyInput().appendField("番目の要素を削除する");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_DELETE_DATA_FROM_ARRAY] = (block) =>
  `${CUSTOM_KM_DELETE_DATA_FROM_ARRAY}(
    ${block.getFieldValue("ARRAY")},
    ${block.getFieldValue("NUMBER")}
    );`;

Blockly.Blocks[CUSTOM_KM_X_OF_DATA_IN_ARRAY] = {
  init() {
    this.appendValueInput("ARRAY").setCheck("Array");
    this.appendDummyInput().appendField("（配列）の");
    this.appendValueInput("NUMBER").setCheck("Number");
    this.appendDummyInput().appendField("番目の要素のx座標");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_X_OF_DATA_IN_ARRAY] = (block) =>
  `${CUSTOM_KM_X_OF_DATA_IN_ARRAY}(
    ${block.getFieldValue("ARRAY")},
    ${block.getFieldValue("NUMBER")}
    );`;

Blockly.Blocks[CUSTOM_KM_Y_OF_DATA_IN_ARRAY] = {
  init() {
    this.appendValueInput("ARRAY").setCheck("Array");
    this.appendDummyInput().appendField("（配列）の");
    this.appendValueInput("NUMBER").setCheck("Number");
    this.appendDummyInput().appendField("番目の要素のy座標");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_Y_OF_DATA_IN_ARRAY] = (block) =>
  `${CUSTOM_KM_Y_OF_DATA_IN_ARRAY}(
    ${block.getFieldValue("ARRAY")},
    ${block.getFieldValue("NUMBER")}
    );`;

Blockly.Blocks[CUSTOM_KM_LENGTH_OF_ARRAY] = {
  init() {
    this.appendValueInput("ARRAY").setCheck("Array");
    this.appendDummyInput().appendField("（配列）の要素数");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_LENGTH_OF_ARRAY] = (block) =>
  `${CUSTOM_KM_Y_OF_DATA_IN_ARRAY}(
        ${block.getFieldValue("ARRAY")},
        );`;

Blockly.Blocks[CUSTOM_KM_Y_IS_SMALLER_THAN_X] = {
  init() {
    this.appendValueInput("NUMBER_X").setCheck("Number").appendField("");
    this.appendDummyInput().appendField("より");
    this.appendValueInput("NUMBER_Y").setCheck("Number").appendField("");
    this.appendDummyInput().appendField("が小さい");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_Y_IS_SMALLER_THAN_X] = (block) =>
  `${CUSTOM_KM_Y_IS_SMALLER_THAN_X}(
    ${block.getFieldValue("NUMBER_X")},
    ${block.getFieldValue("NUMBER_Y")}
    );`;

Blockly.Blocks[CUSTOM_KM_DATA_A_IS_DATA_B] = {
  init() {
    this.appendValueInput("NUMBER_X_1").setCheck("Number").appendField("点(");
    this.appendDummyInput().appendField(",");
    this.appendValueInput("NUMBER_Y_1").setCheck("Number").appendField("");
    this.appendDummyInput().appendField(")と点(");
    this.appendValueInput("NUMBER_X_2").setCheck("Number").appendField("");
    this.appendDummyInput().appendField(",");
    this.appendValueInput("NUMBER_Y_2").setCheck("Number").appendField("");
    this.appendDummyInput().appendField(")が等しいなら");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_DATA_A_IS_DATA_B] = (block) =>
  `${CUSTOM_KM_DATA_A_IS_DATA_B}(
    ${block.getFieldValue("NUMBER_X_1")},
    ${block.getFieldValue("NUMBER_Y_1")},
    ${block.getFieldValue("NUMBER_X_2")},
    ${block.getFieldValue("NUMBER_Y_2")},
  );`;

Blockly.Blocks[CUSTOM_KM_DEFINE_A_IS_B] = {
  init() {
    this.appendValueInput("NUMBER_A").setCheck("Number");
    this.appendDummyInput().appendField("の値を");
    this.appendValueInput("NUMBER_B").setCheck("Number");
    this.appendDummyInput().appendField("の値とする");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_DEFINE_A_IS_B] = (block) =>
  `${CUSTOM_KM_DEFINE_A_IS_B}(
    ${block.getFieldValue("NUMBER_A")},
    ${block.getFieldValue("NUMBER_B")}
  );`;

Blockly.Blocks[CUSTOM_KM_A_PLUS_B] = {
  init() {
    this.appendValueInput("NUMBER_A").setCheck("Number");
    this.appendDummyInput().appendField("+");
    this.appendValueInput("NUMBER_B").setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_A_PLUS_B] = (block) =>
  `${CUSTOM_KM_A_PLUS_B}(
    ${block.getFieldValue("NUMBER_A")},
    ${block.getFieldValue("NUMBER_B")}
  );`;

Blockly.Blocks[CUSTOM_KM_A_POWER_B] = {
  init() {
    this.appendValueInput("NUMBER_A").setCheck("Number");
    this.appendDummyInput().appendField("^");
    this.appendValueInput("NUMBER_B").setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_A_POWER_B] = (block) =>
  `${CUSTOM_KM_A_POWER_B}(
    ${block.getFieldValue("NUMBER_A")},
    ${block.getFieldValue("NUMBER_B")}
  );`;

// デバッグ用
// eslint-disable-next-line import/prefer-default-export
export const CONSOLE_LOG = "console_log";
Blockly.Blocks[CONSOLE_LOG] = {
  init(this: Blockly.Block) {
    this.appendValueInput(VALUE).appendField("console.log");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  },
};
javascriptGenerator[CONSOLE_LOG] = (block: Blockly.Block) =>
  `console.log(${block.getFieldValue(VALUE)});`;

export const CUSTOM_TEXT_INPUT = "text_input";
Blockly.Blocks[CUSTOM_TEXT_INPUT] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField(
      new Blockly.FieldTextInput("default"),
      "NAME"
    );
    this.setOutput(true, "Text");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
