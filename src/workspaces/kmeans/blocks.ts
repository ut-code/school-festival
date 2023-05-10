import Blockly /* , { FieldNumber } */ from "blockly";
import { javascriptGenerator } from "../../config/blockly";

const VALUE = "value";

export const CUSTOM_KM_CLUSTER_I = "cluster_i";
export const CUSTOM_KM_SET_CENTER_OF_CLUSTER = "set_center_of_cluster";
export const CUSTOM_KM_CENTER_OF_CLUSTER = "center_of_cluster";
export const CUSTOM_KM_CALCULATE_CENTER_OF_CLUSTER =
  "calculate_center_of_cluster";
export const CUSTOM_KM_ADD_DATA_TO_ARRAY = "add_data_to_array";
export const CUSTOM_KM_DELETE_DATA_FROM_ARRAY = "delete_data_from_array";
export const CUSTOM_KM_DISTANCE_BETWEEN_X_AND_Y = "distance_between_x_and_y";
export const CUSTOM_KM_X_OF_DATA_IN_ARRAY = "x_of_data_in_array";
export const CUSTOM_KM_Y_OF_DATA_IN_ARRAY = "y_of_data_in_array";
export const CUSTOM_KM_DATA_X_Y = "data_x_y";
export const CUSTOM_KM_DATA_IN_ARRAY = "data_in_array";
export const CUSTOM_KM_LENGTH_OF_ARRAY = "length_of_array";

export const CUSTOM_KM_NUMBER = "custom_km_number";
export const CUSTOM_KM_DATA = "custom_km_data";
export const CUSTOM_KM_DATA_1 = "custom_km_data_1";
export const CUSTOM_KM_DATA_2 = "custom_km_data_2";
export const CUSTOM_KM_CLUSTER = "custom_km_cluster";
export const CUSTOM_KM_NUMBER_X = "custom_km_number_x";
export const CUSTOM_KM_NUMBER_Y = "custom_km_number_y";

Blockly.Blocks[CUSTOM_KM_CLUSTER_I] = {
  init() {
    this.appendValueInput(CUSTOM_KM_NUMBER).setCheck("Number").appendField("");
    this.appendDummyInput().appendField("番目のグループ");
    this.setInputsInline(true);
    this.setOutput(true, "Cluster");
    this.setColour(0);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_CLUSTER_I] = (block: Blockly.Block) => [
  `${CUSTOM_KM_CLUSTER_I}(${javascriptGenerator.valueToCode(
    block,
    CUSTOM_KM_NUMBER,
    0
  )})`,
  0,
];

Blockly.Blocks[CUSTOM_KM_SET_CENTER_OF_CLUSTER] = {
  init() {
    this.appendValueInput(CUSTOM_KM_NUMBER).setCheck("Number").appendField("");
    this.appendDummyInput().appendField("番目のグループの中心を");
    this.appendValueInput(CUSTOM_KM_DATA).setCheck("Vector").appendField("");
    this.appendDummyInput().appendField("とする");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_SET_CENTER_OF_CLUSTER] = (block: Blockly.Block) =>
  `${CUSTOM_KM_SET_CENTER_OF_CLUSTER}(
    ${javascriptGenerator.valueToCode(block, CUSTOM_KM_NUMBER, 0)},
    ${javascriptGenerator.valueToCode(block, CUSTOM_KM_DATA, 0)}
  );`;

Blockly.Blocks[CUSTOM_KM_CENTER_OF_CLUSTER] = {
  init() {
    this.appendValueInput(CUSTOM_KM_CLUSTER)
      .setCheck("Cluster")
      .appendField("");
    this.appendDummyInput().appendField("(グループ)の中心");
    this.setInputsInline(true);
    this.setOutput(true, "Vector");
    this.setColour(0);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_CENTER_OF_CLUSTER] = (block: Blockly.Block) => [
  `${CUSTOM_KM_CENTER_OF_CLUSTER}(${javascriptGenerator.valueToCode(
    block,
    CUSTOM_KM_CLUSTER,
    0
  )})`,
  0,
];

Blockly.Blocks[CUSTOM_KM_CALCULATE_CENTER_OF_CLUSTER] = {
  init() {
    this.appendDummyInput().appendField("各グループの中心を計算する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_CALCULATE_CENTER_OF_CLUSTER] = () =>
  `${CUSTOM_KM_CALCULATE_CENTER_OF_CLUSTER}();`;

Blockly.Blocks[CUSTOM_KM_ADD_DATA_TO_ARRAY] = {
  init() {
    this.appendValueInput(CUSTOM_KM_CLUSTER).setCheck("Cluster");
    this.appendDummyInput().appendField("（グループ）に");
    this.appendValueInput(CUSTOM_KM_DATA).setCheck("Vector");
    this.appendDummyInput().appendField("（点）を加える");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_ADD_DATA_TO_ARRAY] = (block) =>
  `${CUSTOM_KM_ADD_DATA_TO_ARRAY}(
    ${javascriptGenerator.valueToCode(block, CUSTOM_KM_CLUSTER, 0)},
    ${javascriptGenerator.valueToCode(block, CUSTOM_KM_DATA, 0)}
    );`;

Blockly.Blocks[CUSTOM_KM_DELETE_DATA_FROM_ARRAY] = {
  init() {
    this.appendValueInput(CUSTOM_KM_CLUSTER).setCheck("Cluster");
    this.appendDummyInput().appendField("（グループ）から");
    this.appendValueInput(CUSTOM_KM_NUMBER).setCheck("Number");
    this.appendDummyInput().appendField("番目の点を削除する");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_DELETE_DATA_FROM_ARRAY] = (block) =>
  `${CUSTOM_KM_DELETE_DATA_FROM_ARRAY}(
    ${javascriptGenerator.valueToCode(block, CUSTOM_KM_CLUSTER, 0)},
    ${javascriptGenerator.valueToCode(block, CUSTOM_KM_NUMBER, 0)}
    );`;

Blockly.Blocks[CUSTOM_KM_DISTANCE_BETWEEN_X_AND_Y] = {
  init() {
    this.appendValueInput(CUSTOM_KM_DATA_1)
      .setCheck("Vector")
      .appendField("点");
    this.appendDummyInput().appendField("から");
    this.appendValueInput(CUSTOM_KM_DATA_2)
      .setCheck("Vector")
      .appendField("点");
    this.appendDummyInput().appendField("までの距離");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(60);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_DISTANCE_BETWEEN_X_AND_Y] = (block) => [
  `${CUSTOM_KM_DISTANCE_BETWEEN_X_AND_Y}(
    ${javascriptGenerator.valueToCode(block, CUSTOM_KM_DATA_1, 0)},
    ${javascriptGenerator.valueToCode(block, CUSTOM_KM_DATA_2, 0)}
    )`,
  0,
];

Blockly.Blocks[CUSTOM_KM_X_OF_DATA_IN_ARRAY] = {
  init() {
    this.appendValueInput(CUSTOM_KM_CLUSTER).setCheck("Cluster");
    this.appendDummyInput().appendField("（グループ）の");
    this.appendValueInput(CUSTOM_KM_NUMBER).setCheck("Number");
    this.appendDummyInput().appendField("番目の点のx座標");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_X_OF_DATA_IN_ARRAY] = (block) => [
  `${CUSTOM_KM_X_OF_DATA_IN_ARRAY}(
        ${javascriptGenerator.valueToCode(block, CUSTOM_KM_CLUSTER, 0)},
        ${javascriptGenerator.valueToCode(block, CUSTOM_KM_NUMBER, 0)}
        )`,
  0,
];

Blockly.Blocks[CUSTOM_KM_Y_OF_DATA_IN_ARRAY] = {
  init() {
    this.appendValueInput(CUSTOM_KM_CLUSTER).setCheck("Cluster");
    this.appendDummyInput().appendField("（グループ）の");
    this.appendValueInput(CUSTOM_KM_NUMBER).setCheck("Number");
    this.appendDummyInput().appendField("番目の点のy座標");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_Y_OF_DATA_IN_ARRAY] = (block) => [
  `${CUSTOM_KM_Y_OF_DATA_IN_ARRAY}(
        ${javascriptGenerator.valueToCode(block, CUSTOM_KM_CLUSTER, 0)},
        ${javascriptGenerator.valueToCode(block, CUSTOM_KM_NUMBER, 0)}
        )`,
  0,
];

Blockly.Blocks[CUSTOM_KM_DATA_X_Y] = {
  init() {
    this.appendDummyInput().appendField("点(");
    this.appendValueInput(CUSTOM_KM_NUMBER_X).setCheck("Number");
    this.appendDummyInput().appendField(",");
    this.appendValueInput(CUSTOM_KM_NUMBER_Y).setCheck("Number");
    this.appendDummyInput().appendField(")");
    this.setInputsInline(true);
    this.setOutput(true, "Vector");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_DATA_X_Y] = (block) => [
  `${CUSTOM_KM_DATA_X_Y}(
        ${javascriptGenerator.valueToCode(block, CUSTOM_KM_NUMBER_X, 0)},
        ${javascriptGenerator.valueToCode(block, CUSTOM_KM_NUMBER_Y, 0)}
        )`,
  0,
];

Blockly.Blocks[CUSTOM_KM_DATA_IN_ARRAY] = {
  init() {
    this.appendValueInput(CUSTOM_KM_CLUSTER).setCheck("Cluster");
    this.appendDummyInput().appendField("（グループ）の");
    this.appendValueInput(CUSTOM_KM_NUMBER).setCheck("Number");
    this.appendDummyInput().appendField("番目の点");
    this.setInputsInline(true);
    this.setOutput(true, "Vector");
    this.setColour(0);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_DATA_IN_ARRAY] = (block) => [
  `${CUSTOM_KM_DATA_IN_ARRAY}(
    ${javascriptGenerator.valueToCode(block, CUSTOM_KM_CLUSTER, 0)},
    ${javascriptGenerator.valueToCode(block, CUSTOM_KM_NUMBER, 0)}
    )`,
  0,
];

Blockly.Blocks[CUSTOM_KM_LENGTH_OF_ARRAY] = {
  init() {
    this.appendValueInput(CUSTOM_KM_CLUSTER).setCheck("Cluster");
    this.appendDummyInput().appendField("（グループ）の点の数");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(0);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_LENGTH_OF_ARRAY] = (block) => [
  `${CUSTOM_KM_LENGTH_OF_ARRAY}(
        ${javascriptGenerator.valueToCode(block, CUSTOM_KM_CLUSTER, 0)}
        )`,
  0,
];

// デバッグ用
// eslint-disable-next-line import/prefer-default-export
export const CONSOLE_LOG = "console_log";
Blockly.Blocks[CONSOLE_LOG] = {
  init() {
    this.appendValueInput(VALUE).appendField("console.log");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  },
};
javascriptGenerator[CONSOLE_LOG] = (block) =>
  `console.log(${javascriptGenerator.valueToCode(block, VALUE, 0)});`;
