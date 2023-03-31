import Blockly from "blockly";
import { MazeDirectionMap } from "../../commons/maze";
import { javascriptGenerator } from "../../config/blockly";

export const CUSTOM_MAZE_STEPFORWARD = "custom_maze_stepForward";
Blockly.Blocks[CUSTOM_MAZE_STEPFORWARD] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("前へ進む");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  },
};
javascriptGenerator[CUSTOM_MAZE_STEPFORWARD] = () =>
  `${CUSTOM_MAZE_STEPFORWARD}();`;

export const CUSTOM_MAZE_TURN = "custom_maze_turn";
export const CUSTOM_MAZE_FIELD_DIRECTION = "DIRECTION";
Blockly.Blocks[CUSTOM_MAZE_TURN] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["左", MazeDirectionMap.LEFT],
          ["右", MazeDirectionMap.RIGHT],
        ]),
        CUSTOM_MAZE_FIELD_DIRECTION
      )
      .appendField("を向く");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("迷路内の自機を指定した方向に回転させます。");
  },
};
javascriptGenerator[CUSTOM_MAZE_TURN] = (block) =>
  `${CUSTOM_MAZE_TURN}('${block.getFieldValue(CUSTOM_MAZE_FIELD_DIRECTION)}');`;

export const CUSTOM_MAZE_CHECKWALL = "custom_maze_checkWall";
Blockly.Blocks[CUSTOM_MAZE_CHECKWALL] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["前", MazeDirectionMap.TOP],
          ["左", MazeDirectionMap.LEFT],
          ["右", MazeDirectionMap.RIGHT],
          ["後", MazeDirectionMap.BOTTOM],
        ]),
        CUSTOM_MAZE_FIELD_DIRECTION
      )
      .appendField("に壁がある");
    this.setOutput(true, "Boolean");
    this.setColour(0);
    this.setTooltip("自機の指定された方向に壁があるかどうか確認します。");
  },
};
javascriptGenerator[CUSTOM_MAZE_CHECKWALL] = (block) => [
  `${CUSTOM_MAZE_CHECKWALL}('${block.getFieldValue(
    CUSTOM_MAZE_FIELD_DIRECTION
  )}')`,
  0,
];
