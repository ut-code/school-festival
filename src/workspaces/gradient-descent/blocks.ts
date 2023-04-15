import Blockly from "blockly";
import { javascriptGenerator } from "../../config/blockly";

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
    this.setTooltip("入力された点の高さを求めます。");
  },
};

javascriptGenerator[CUSTOM_GRAD_OBJECTIVE] = (block) => [
  `${CUSTOM_GRAD_OBJECTIVE}(${javascriptGenerator.valueToCode(
    block,
    CUSTOM_GRAD_X,
    0
  )}, ${javascriptGenerator.valueToCode(block, CUSTOM_GRAD_Y, 0)})`,
  0,
];

export const CUSTOM_GRAD_SET_X = "custom_grad_set_x";
export const CUSTOM_GRAD_NEW_X = "custom_grad_new_x";
Blockly.Blocks[CUSTOM_GRAD_SET_X] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("x に");
    this.appendValueInput(CUSTOM_GRAD_NEW_X).setCheck("Number");
    this.appendDummyInput().appendField("をセット");
    this.setColour(350);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("この入力を x と等しくなるように設定します。");
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
    this.setColour(350);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("この入力を y と等しくなるように設定します。");
  },
};

javascriptGenerator[CUSTOM_GRAD_SET_Y] = (block) =>
  `${CUSTOM_GRAD_SET_Y}(${javascriptGenerator.valueToCode(
    block,
    CUSTOM_GRAD_NEW_Y,
    0
  )});`;

export const CUSTOM_GRAD_X_VALUE = "custom_grad_x_value";
Blockly.Blocks[CUSTOM_GRAD_X_VALUE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("x");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("x の値を返します。");
  },
};

javascriptGenerator[CUSTOM_GRAD_X_VALUE] = () => [
  `${CUSTOM_GRAD_X_VALUE}()`,
  0,
];

export const CUSTOM_GRAD_Y_VALUE = "custom_grad_y_value";
Blockly.Blocks[CUSTOM_GRAD_Y_VALUE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("y");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("y の値を返します。");
  },
};

javascriptGenerator[CUSTOM_GRAD_Y_VALUE] = () => [
  `${CUSTOM_GRAD_Y_VALUE}()`,
  0,
];
