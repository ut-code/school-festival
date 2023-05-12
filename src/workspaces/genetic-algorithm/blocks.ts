import Blockly from "blockly";
import { javascriptGenerator } from "../../config/blockly";
import { gaPlaceCountInRoute } from "./types";

export const CUSTOM_GA_RANDOM_INT = "custom_ga_random_int";
Blockly.Blocks[CUSTOM_GA_RANDOM_INT] = {
  init(this: Blockly.Block) {
    this.appendValueInput("a").setCheck("Number");
    this.appendDummyInput().appendField("以上");
    this.appendValueInput("b").setCheck("Number");
    this.appendDummyInput().appendField("以下のランダムな整数");
    this.setOutput(true, "Number");
    this.setColour(180);
  },
};
javascriptGenerator[CUSTOM_GA_RANDOM_INT] = (block) => {
  const a = javascriptGenerator.valueToCode(block, "a", 0);
  const b = javascriptGenerator.valueToCode(block, "b", 0);
  return [`Math.floor(Math.random() * (${b} - ${a} + 1) + ${a})`, 0];
};

export const CUSTOM_GA_ROUTE_COUNT = "custom_ga_route_count";
Blockly.Blocks[CUSTOM_GA_ROUTE_COUNT] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("現在のルートの数");
    this.setOutput(true, "Number");
    this.setColour(0);
  },
};
javascriptGenerator[CUSTOM_GA_ROUTE_COUNT] = () => {
  return [`${CUSTOM_GA_ROUTE_COUNT}()`, 0];
};

export const CUSTOM_GA_PLACE_COUNT = "custom_ga_place_count";
Blockly.Blocks[CUSTOM_GA_PLACE_COUNT] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("地点の数");
    this.setOutput(true, "Number");
    this.setColour(0);
  },
};
javascriptGenerator[CUSTOM_GA_PLACE_COUNT] = () => {
  return [`${gaPlaceCountInRoute}`, 0];
};

export const CUSTOM_GA_CREATE_ROUTE = "custom_ga_create_route";
Blockly.Blocks[CUSTOM_GA_CREATE_ROUTE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("新しいルートを作成する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  },
};
javascriptGenerator[CUSTOM_GA_CREATE_ROUTE] = () =>
  `${CUSTOM_GA_CREATE_ROUTE}();`;

export const CUSTOM_GA_DUPLICATE_ROUTE = "custom_ga_duplicate_route";
Blockly.Blocks[CUSTOM_GA_DUPLICATE_ROUTE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("i").setCheck("Number");
    this.appendDummyInput().appendField("番目のルートをコピーする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  },
};
javascriptGenerator[CUSTOM_GA_DUPLICATE_ROUTE] = (block) => {
  const i = javascriptGenerator.valueToCode(block, "i", 0);
  return `${CUSTOM_GA_DUPLICATE_ROUTE}(${i});`;
};

export const CUSTOM_GA_DISCARD_ROUTE = "custom_ga_discard_route";
Blockly.Blocks[CUSTOM_GA_DISCARD_ROUTE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("routeIndex").setCheck("Number");
    this.appendDummyInput().appendField("番目のルートを削除する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  },
};
javascriptGenerator[CUSTOM_GA_DISCARD_ROUTE] = (block) => {
  const routeIndex = javascriptGenerator.valueToCode(block, "routeIndex", 0);
  return `${CUSTOM_GA_DISCARD_ROUTE}(${routeIndex});`;
};

export const CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE =
  "custom_ga_discard_after_nth_route";
Blockly.Blocks[CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("i").setCheck("Number");
    this.appendDummyInput().appendField("番目以降のルートを削除する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  },
};
javascriptGenerator[CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE] = (block) => {
  const i = javascriptGenerator.valueToCode(block, "i", 0);
  return `${CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE}(${i});`;
};

export const CUSTOM_GA_SWAP_ROUTES = "custom_ga_swap_routes";
Blockly.Blocks[CUSTOM_GA_SWAP_ROUTES] = {
  init(this: Blockly.Block) {
    this.appendValueInput("routeIndex1").setCheck("Number");
    this.appendDummyInput().appendField("番目と");
    this.appendValueInput("routeIndex2").setCheck("Number");
    this.appendDummyInput().appendField("番目のルートを入れ替える");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  },
};
javascriptGenerator[CUSTOM_GA_SWAP_ROUTES] = (block) => {
  const routeIndex1 = javascriptGenerator.valueToCode(block, "routeIndex1", 0);
  const routeIndex2 = javascriptGenerator.valueToCode(block, "routeIndex2", 0);
  return `${CUSTOM_GA_SWAP_ROUTES}(${routeIndex1}, ${routeIndex2});`;
};

export const CUSTOM_GA_DISTANCE = "custom_ga_distance";
Blockly.Blocks[CUSTOM_GA_DISTANCE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("routeIndex").setCheck("Number");
    this.appendDummyInput().appendField("番目のルートの");
    this.appendValueInput("placeIndex1").setCheck("Number");
    this.appendDummyInput().appendField("番目と");
    this.appendValueInput("placeIndex2").setCheck("Number");
    this.appendDummyInput().appendField("番目の地点間の距離");
    this.setOutput(true, "Number");
    this.setColour(0);
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

export const CUSTOM_GA_SWAP_PLACE = "custom_ga_swap_place";
Blockly.Blocks[CUSTOM_GA_SWAP_PLACE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("routeIndex").setCheck("Number");
    this.appendDummyInput().appendField("番目のルートの");
    this.appendValueInput("placeIndex1").setCheck("Number");
    this.appendDummyInput().appendField("番目と");
    this.appendValueInput("placeIndex2").setCheck("Number");
    this.appendDummyInput().appendField("番目の地点を入れ替える");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  },
};
javascriptGenerator[CUSTOM_GA_SWAP_PLACE] = (block) => {
  const routeIndex = javascriptGenerator.valueToCode(block, "routeIndex", 0);
  const placeIndex1 = javascriptGenerator.valueToCode(block, "placeIndex1", 0);
  const placeIndex2 = javascriptGenerator.valueToCode(block, "placeIndex2", 0);
  return `${CUSTOM_GA_SWAP_PLACE}(${routeIndex}, ${placeIndex1}, ${placeIndex2});`;
};

export const CUSTOM_GA_NTH_PLACE = "custom_ga_nth_place";
Blockly.Blocks[CUSTOM_GA_NTH_PLACE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("routeIndex").setCheck("Number");
    this.appendDummyInput().appendField("番目のルートの");
    this.appendValueInput("placeIndex").setCheck("Number");
    this.appendDummyInput().appendField("番目の地点");
    this.setOutput(true, "Place");
    this.setColour(0);
  },
};
javascriptGenerator[CUSTOM_GA_NTH_PLACE] = (block) => {
  const routeIndex = javascriptGenerator.valueToCode(block, "routeIndex", 0);
  const placeIndex = javascriptGenerator.valueToCode(block, "placeIndex", 0);
  return [`${CUSTOM_GA_NTH_PLACE}(${routeIndex}, ${placeIndex})`, 0];
};

export const CUSTOM_GA_PLACE_EXISTS_IN_ROUTE =
  "custom_ga_place_exists_in_route";
Blockly.Blocks[CUSTOM_GA_PLACE_EXISTS_IN_ROUTE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("routeIndex").setCheck("Number");
    this.appendDummyInput().appendField("番目のルートに");
    this.appendValueInput("place").setCheck("Place");
    this.appendDummyInput().appendField("が含まれる");
    this.setOutput(true, "Boolean");
    this.setColour(0);
  },
};
javascriptGenerator[CUSTOM_GA_PLACE_EXISTS_IN_ROUTE] = (block) => {
  const routeIndex = javascriptGenerator.valueToCode(block, "routeIndex", 0);
  const place = javascriptGenerator.valueToCode(block, "place", 0);
  return [`${CUSTOM_GA_PLACE_EXISTS_IN_ROUTE}(${routeIndex}, ${place})`, 0];
};

export const CUSTOM_GA_ADD_PLACE = "custom_ga_add_place";
Blockly.Blocks[CUSTOM_GA_ADD_PLACE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("routeIndex").setCheck("Number");
    this.appendDummyInput().appendField("番目のルートに");
    this.appendValueInput("place").setCheck("Place");
    this.appendDummyInput().appendField("を追加する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  },
};
javascriptGenerator[CUSTOM_GA_ADD_PLACE] = (block) => {
  const routeIndex = javascriptGenerator.valueToCode(block, "routeIndex", 0);
  const place = javascriptGenerator.valueToCode(block, "place", 0);
  return `${CUSTOM_GA_ADD_PLACE}(${routeIndex}, ${place});`;
};
