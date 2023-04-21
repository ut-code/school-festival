import Blockly from "blockly";
import { javascriptGenerator } from "../../config/blockly";

/** Route 型 */
export const CUSTOM_GA_TYPE_ROUTE = "Route";

/** Place 型 */
export const CUSTOM_GA_TYPE_PLACE = "Place";

/** value 引数 */
export const CUSTOM_GA_FIELD_VALUE = "value";

export const CUSTOM_GA_RANDOM_INT = "custom_ga_random_int";
Blockly.Blocks[CUSTOM_GA_RANDOM_INT] = {
  init(this: Blockly.Block) {
    this.appendValueInput("a").setCheck("Number");
    this.appendDummyInput().appendField("以上");
    this.appendValueInput("b").setCheck("Number");
    this.appendDummyInput().appendField("未満の整数");
    this.setOutput(true, "Number");
    this.setColour(0);
    this.setTooltip("乱数");
  },
};
javascriptGenerator[CUSTOM_GA_RANDOM_INT] = (block) => {
  const a = block.getFieldValue("a");
  const b = block.getFieldValue("b");
  return [`Math.floor(Math.random() * (${b} - ${a}) + ${a})`, 0];
};

export const CUSTOM_GA_NTH_ROUTE = "custom_ga_nth_route";
Blockly.Blocks[CUSTOM_GA_NTH_ROUTE] = {
  init(this: Blockly.Block) {
    this.appendValueInput(CUSTOM_GA_FIELD_VALUE).setCheck("Number");
    this.appendDummyInput().appendField("番目の経路");
    this.setOutput(true, CUSTOM_GA_TYPE_ROUTE);
    this.setColour(0);
    this.setTooltip("経路");
  },
};
javascriptGenerator[CUSTOM_GA_NTH_ROUTE] = (block) =>
  `${CUSTOM_GA_NTH_ROUTE}(${block.getFieldValue(CUSTOM_GA_FIELD_VALUE)});`;

export const CUSTOM_GA_CREATE_ROUTE = "custom_ga_create_route";
Blockly.Blocks[CUSTOM_GA_CREATE_ROUTE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("新しい経路");
    this.setOutput(true, CUSTOM_GA_TYPE_ROUTE);
    this.setColour(0);
    this.setTooltip("経路");
  },
};
javascriptGenerator[CUSTOM_GA_CREATE_ROUTE] = () => [
  `${CUSTOM_GA_CREATE_ROUTE}()`,
  0,
];

export const CUSTOM_GA_DUPLICATE_ROUTE = "custom_ga_duplicate_route";
Blockly.Blocks[CUSTOM_GA_DUPLICATE_ROUTE] = {
  init(this: Blockly.Block) {
    this.appendValueInput(CUSTOM_GA_FIELD_VALUE).setCheck("Number");
    this.appendDummyInput().appendField("番目の経路をコピーする");
    this.setOutput(true, CUSTOM_GA_TYPE_ROUTE);
    this.setColour(0);
    this.setTooltip("経路");
  },
};

export const CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE =
  "custom_ga_discard_after_nth_route";
Blockly.Blocks[CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE] = {
  init(this: Blockly.Block) {
    this.appendValueInput(CUSTOM_GA_FIELD_VALUE).setCheck("Number");
    this.appendDummyInput().appendField("番目以降の経路を削除する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("経路");
  },
};

export const CUSTOM_GA_SWAP_ROUTES = "custom_ga_swap_routes";
Blockly.Blocks[CUSTOM_GA_SWAP_ROUTES] = {
  init(this: Blockly.Block) {
    this.appendValueInput(CUSTOM_GA_FIELD_VALUE).setCheck("Number");
    this.appendDummyInput().appendField("番目と");
    this.appendValueInput(CUSTOM_GA_FIELD_VALUE).setCheck("Number");
    this.appendDummyInput().appendField("番目の経路を入れ替える");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("経路");
  },
};

export const CUSTOM_GA_NTH_PLACE = "custom_ga_nth_place";
Blockly.Blocks[CUSTOM_GA_NTH_PLACE] = {
  init(this: Blockly.Block) {
    this.appendValueInput(CUSTOM_GA_FIELD_VALUE).setCheck(CUSTOM_GA_TYPE_ROUTE);
    this.appendDummyInput().appendField("で");
    this.appendValueInput(CUSTOM_GA_FIELD_VALUE).setCheck("Number");
    this.appendDummyInput().appendField("番目に訪れる地点");
    this.setOutput(true, CUSTOM_GA_TYPE_PLACE);
    this.setColour(0);
    this.setTooltip("経路");
  },
};

export const CUSTOM_GA_DISTANCE = "custom_ga_distance";
Blockly.Blocks[CUSTOM_GA_DISTANCE] = {
  init(this: Blockly.Block) {
    this.appendValueInput(CUSTOM_GA_FIELD_VALUE).setCheck(CUSTOM_GA_TYPE_PLACE);
    this.appendDummyInput().appendField("と");
    this.appendValueInput(CUSTOM_GA_FIELD_VALUE).setCheck(CUSTOM_GA_TYPE_PLACE);
    this.appendDummyInput().appendField("の距離");
    this.setOutput(true, "Number");
    this.setColour(0);
    this.setTooltip("経路");
  },
};

export const CUSTOM_GA_ADD_PLACE = "custom_ga_add_place";
Blockly.Blocks[CUSTOM_GA_ADD_PLACE] = {
  init(this: Blockly.Block) {
    this.appendValueInput(CUSTOM_GA_FIELD_VALUE).setCheck(CUSTOM_GA_TYPE_ROUTE);
    this.appendDummyInput().appendField("に");
    this.appendValueInput(CUSTOM_GA_FIELD_VALUE).setCheck(CUSTOM_GA_TYPE_PLACE);
    this.appendDummyInput().appendField("を追加する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("[経路] に [地点] を追加する");
  },
};

export const CUSTOM_GA_SWAP_PLACE = "custom_ga_swap_place";
Blockly.Blocks[CUSTOM_GA_SWAP_PLACE] = {
  init(this: Blockly.Block) {
    this.appendValueInput(CUSTOM_GA_FIELD_VALUE).setCheck(CUSTOM_GA_TYPE_ROUTE);
    this.appendDummyInput().appendField("の");
    this.appendValueInput(CUSTOM_GA_FIELD_VALUE).setCheck("Number");
    this.appendDummyInput().appendField("番目と");
    this.appendValueInput(CUSTOM_GA_FIELD_VALUE).setCheck("Number");
    this.appendDummyInput().appendField("番目の地点を入れ替える");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("経路");
  },
};
