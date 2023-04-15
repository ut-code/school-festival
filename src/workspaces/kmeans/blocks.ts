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
export const CUSTOM_KM_DATA_IN_ARRAY = "data_in_array";
export const CUSTOM_KM_LENGTH_OF_ARRAY = "length_of_array";

Blockly.Blocks[CUSTOM_KM_CLUSTER_I] = {
  init() {
    this.appendValueInput("NUMBER").setCheck("Number").appendField("");
    this.appendDummyInput().appendField("番目のクラスター");
    this.setInputsInline(true);
    this.setOutput(true, "Cluster");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_CLUSTER_I] = (block: Blockly.Block) => [
  `${CUSTOM_KM_CLUSTER_I}(${block.getFieldValue("NUMBER")});`,
  0,
];

Blockly.Blocks[CUSTOM_KM_SET_CENTER_OF_CLUSTER] = {
  init() {
    this.appendValueInput("NUMBER").setCheck("Number").appendField("");
    this.appendDummyInput().appendField("番目のクラスターの中心を");
    this.appendValueInput("DATA").setCheck("Data").appendField("");
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
    ${block.getFieldValue("NUMBER")},
    ${block.getFieldValue("DATA")}
  );`;

Blockly.Blocks[CUSTOM_KM_CENTER_OF_CLUSTER] = {
  init() {
    this.appendValueInput("CLUSTER")
      .setCheck("Cluster")
      .appendField("クラスター");
    this.appendDummyInput().appendField("の中心");
    this.setInputsInline(true);
    this.setOutput(true, "Data");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_CENTER_OF_CLUSTER] = (block: Blockly.Block) => [
  `${CUSTOM_KM_CENTER_OF_CLUSTER}(${block.getFieldValue("CLUSTER")});`,
  0,
];

Blockly.Blocks[CUSTOM_KM_CALCULATE_CENTER_OF_CLUSTER] = {
  init() {
    this.appendDummyInput().appendField("クラスターの中心を計算する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_CALCULATE_CENTER_OF_CLUSTER] = () =>
  `${CUSTOM_KM_CALCULATE_CENTER_OF_CLUSTER}();`;

Blockly.Blocks[CUSTOM_KM_ADD_DATA_TO_ARRAY] = {
  init() {
    this.appendValueInput("ARRAY").setCheck("Cluster");
    this.appendDummyInput().appendField("（配列）に");
    this.appendValueInput("DATA").setCheck("Data");
    this.appendDummyInput().appendField("（点）を加える");
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
    ${block.getFieldValue("DATA")}
    );`;

Blockly.Blocks[CUSTOM_KM_DELETE_DATA_FROM_ARRAY] = {
  init() {
    this.appendValueInput("ARRAY").setCheck("Cluster");
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

Blockly.Blocks[CUSTOM_KM_DISTANCE_BETWEEN_X_AND_Y] = {
  init() {
    this.appendValueInput("DATA1").setCheck("Data").appendField("点");
    this.appendDummyInput().appendField("から");
    this.appendValueInput("DATA2").setCheck("Data").appendField("点");
    this.appendDummyInput().appendField("までの距離");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_DISTANCE_BETWEEN_X_AND_Y] = (block) => [
  `${CUSTOM_KM_DISTANCE_BETWEEN_X_AND_Y}(
    ${block.getFieldValue("DATA1")},
    ${block.getFieldValue("DATA2")}
    );`,
  0,
];

Blockly.Blocks[CUSTOM_KM_X_OF_DATA_IN_ARRAY] = {
  init() {
    this.appendValueInput("ARRAY").setCheck("Cluster");
    this.appendDummyInput().appendField("（配列）の");
    this.appendValueInput("NUMBER").setCheck("Number");
    this.appendDummyInput().appendField("番目の要素のx座標");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_X_OF_DATA_IN_ARRAY] = (block) => [
  `${CUSTOM_KM_X_OF_DATA_IN_ARRAY}(
        ${block.getFieldValue("ARRAY")},
        ${block.getFieldValue("NUMBER")}
        );`,
  0,
];

Blockly.Blocks[CUSTOM_KM_Y_OF_DATA_IN_ARRAY] = {
  init() {
    this.appendValueInput("ARRAY").setCheck("Cluster");
    this.appendDummyInput().appendField("（配列）の");
    this.appendValueInput("NUMBER").setCheck("Number");
    this.appendDummyInput().appendField("番目の要素のy座標");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_Y_OF_DATA_IN_ARRAY] = (block) => [
  `${CUSTOM_KM_Y_OF_DATA_IN_ARRAY}(
        ${block.getFieldValue("ARRAY")},
        ${block.getFieldValue("NUMBER")}
        );`,
  0,
];

Blockly.Blocks[CUSTOM_KM_DATA_IN_ARRAY] = {
  init() {
    this.appendValueInput("ARRAY").setCheck("Cluster");
    this.appendDummyInput().appendField("（配列）の");
    this.appendValueInput("NUMBER").setCheck("Number");
    this.appendDummyInput().appendField("番目のデータ");
    this.setInputsInline(true);
    this.setOutput(true, "Data");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_DATA_IN_ARRAY] = (block) => [
  `${CUSTOM_KM_DATA_IN_ARRAY}(
    ${block.getFieldValue("ARRAY")},
    ${block.getFieldValue("NUMBER")}
    );`,
  0,
];

Blockly.Blocks[CUSTOM_KM_LENGTH_OF_ARRAY] = {
  init() {
    this.appendValueInput("ARRAY").setCheck("Cluster");
    this.appendDummyInput().appendField("（配列）の要素数");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
  },
};
javascriptGenerator[CUSTOM_KM_LENGTH_OF_ARRAY] = (block) => [
  `${CUSTOM_KM_LENGTH_OF_ARRAY}(
        ${block.getFieldValue("ARRAY")},
        );`,
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
  `${CONSOLE_LOG}(${block.getFieldValue(VALUE)});`;
