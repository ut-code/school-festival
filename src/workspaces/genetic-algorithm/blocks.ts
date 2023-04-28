import Blockly from "blockly";
import { javascriptGenerator } from "../../config/blockly";

/** Place 型 */
export const CUSTOM_GA_TYPE_PLACE = "Place";

export const CUSTOM_GA_RANDOM_INT = "custom_ga_random_int";
Blockly.Blocks[CUSTOM_GA_RANDOM_INT] = {
  init(this: Blockly.Block) {
    this.appendValueInput("a").setCheck("Number");
    this.appendDummyInput().appendField("以上");
    this.appendValueInput("b").setCheck("Number");
    this.appendDummyInput().appendField("未満の整数");
    this.setOutput(true, "Number");
    this.setColour(180);
    this.setTooltip("乱数");
  },
};
javascriptGenerator[CUSTOM_GA_RANDOM_INT] = (block) => {
  const a = javascriptGenerator.valueToCode(block, "a", 0);
  const b = javascriptGenerator.valueToCode(block, "b", 0);
  return [`Math.floor(Math.random() * (${b} - ${a}) + ${a})`, 0];
};

export const CUSTOM_GA_CREATE_ROUTE = "custom_ga_create_route";
Blockly.Blocks[CUSTOM_GA_CREATE_ROUTE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("新しい経路を作成する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("経路");
  },
};
javascriptGenerator[CUSTOM_GA_CREATE_ROUTE] = () =>
  `${CUSTOM_GA_CREATE_ROUTE}();`;

export const CUSTOM_GA_DUPLICATE_ROUTE = "custom_ga_duplicate_route";
Blockly.Blocks[CUSTOM_GA_DUPLICATE_ROUTE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("i").setCheck("Number");
    this.appendDummyInput().appendField("番目の経路をコピーする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("経路");
  },
};
javascriptGenerator[CUSTOM_GA_DUPLICATE_ROUTE] = (block) => {
  const i = javascriptGenerator.valueToCode(block, "i", 0);
  return `${CUSTOM_GA_DUPLICATE_ROUTE}(${i});`;
};

export const CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE =
  "custom_ga_discard_after_nth_route";
Blockly.Blocks[CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("i").setCheck("Number");
    this.appendDummyInput().appendField("番目以降の経路を削除する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("経路");
  },
};
javascriptGenerator[CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE] = (block) => {
  const i = javascriptGenerator.valueToCode(block, "i", 0);
  return `${CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE}(${i});`;
};

export const CUSTOM_GA_SWAP_ROUTES = "custom_ga_swap_routes";
Blockly.Blocks[CUSTOM_GA_SWAP_ROUTES] = {
  init(this: Blockly.Block) {
    this.appendValueInput("a").setCheck("Number");
    this.appendDummyInput().appendField("番目と");
    this.appendValueInput("b").setCheck("Number");
    this.appendDummyInput().appendField("番目の経路を入れ替える");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("経路");
  },
};
javascriptGenerator[CUSTOM_GA_SWAP_ROUTES] = (block) => {
  const a = javascriptGenerator.valueToCode(block, "a", 0);
  const b = javascriptGenerator.valueToCode(block, "a", 0);
  return `${CUSTOM_GA_SWAP_ROUTES}(${a}, ${b});`;
};

export const CUSTOM_GA_NTH_PLACE = "custom_ga_nth_place";
Blockly.Blocks[CUSTOM_GA_NTH_PLACE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("routeIndex").setCheck("Number");
    this.appendDummyInput().appendField("番目の経路で");
    this.appendValueInput("placeIndex").setCheck("Number");
    this.appendDummyInput().appendField("番目に訪れる地点");
    this.setOutput(true, CUSTOM_GA_TYPE_PLACE);
    this.setColour(0);
    this.setTooltip("経路");
  },
};
javascriptGenerator[CUSTOM_GA_NTH_PLACE] = (block) => {
  const routeIndex = javascriptGenerator.valueToCode(block, "routeIndex", 0);
  const placeIndex = javascriptGenerator.valueToCode(block, "placeIndex", 0);
  return [`${CUSTOM_GA_NTH_PLACE}(${routeIndex}, ${placeIndex})`, 0];
};

export const CUSTOM_GA_DISTANCE = "custom_ga_distance";
Blockly.Blocks[CUSTOM_GA_DISTANCE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("routeIndex").setCheck("Number");
    this.appendDummyInput().appendField("番目の経路の");
    this.appendValueInput("placeIndex1").setCheck("Number");
    this.appendDummyInput().appendField("番目と");
    this.appendValueInput("placeIndex2").setCheck("Number");
    this.appendDummyInput().appendField("番目の地点間の距離");
    this.setOutput(true, "Number");
    this.setColour(0);
    this.setTooltip("経路");
  },
};
javascriptGenerator[CUSTOM_GA_DISTANCE] = (block) => {
  const routeIndex = javascriptGenerator.valueToCode(block, "routeIndex", 0);
  const placeIndex1 = javascriptGenerator.valueToCode(block, "placeIndex1", 0);
  const placeIndex2 = javascriptGenerator.valueToCode(block, "placeIndex2", 0);
  return [
    `${CUSTOM_GA_DISTANCE}(${routeIndex}, ${placeIndex1}, ${placeIndex2})`,
    0,
  ];
};

export const CUSTOM_GA_ADD_PLACE = "custom_ga_add_place";
Blockly.Blocks[CUSTOM_GA_ADD_PLACE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("i").setCheck("Number");
    this.appendDummyInput().appendField("番目の経路に 地点");
    this.appendValueInput("place").setCheck(CUSTOM_GA_TYPE_PLACE);
    this.appendDummyInput().appendField("を追加する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("[経路] に [地点] を追加する");
  },
};
javascriptGenerator[CUSTOM_GA_ADD_PLACE] = (block) => {
  const i = javascriptGenerator.valueToCode(block, "i", 0);
  const place = javascriptGenerator.valueToCode(block, "place", 0);
  return `${CUSTOM_GA_ADD_PLACE}(${i}, ${place});`;
};

export const CUSTOM_GA_SWAP_PLACE = "custom_ga_swap_place";
Blockly.Blocks[CUSTOM_GA_SWAP_PLACE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("i").setCheck("Number");
    this.appendDummyInput().appendField("番目の経路の");
    this.appendValueInput("a").setCheck("Number");
    this.appendDummyInput().appendField("番目と");
    this.appendValueInput("b").setCheck("Number");
    this.appendDummyInput().appendField("番目の地点を入れ替える");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("経路");
  },
};
javascriptGenerator[CUSTOM_GA_SWAP_PLACE] = (block) => {
  const i = javascriptGenerator.valueToCode(block, "i", 0);
  const a = javascriptGenerator.valueToCode(block, "a", 0);
  const b = javascriptGenerator.valueToCode(block, "b", 0);
  return `${CUSTOM_GA_SWAP_PLACE}(${i}, ${a}, ${b});`;
};
