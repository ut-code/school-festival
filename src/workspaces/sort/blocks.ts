import Blockly from "blockly";
import { javascriptGenerator } from "../../config/blockly";

export const SortDirectionMap = { LEFT: "left", RIGHT: "right" } as const;
export type SortDirection =
  (typeof SortDirectionMap)[keyof typeof SortDirectionMap];
export const SortDirectionDiffMap = {
  [SortDirectionMap.LEFT]: -1,
  [SortDirectionMap.RIGHT]: 1,
} as const;

export const CUSTOM_SORT_FIELD_DIRECTION = "DIRECTION";

export const CUSTOM_SORT_MOVE = "custom_sort_move";
Blockly.Blocks[CUSTOM_SORT_MOVE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["左", SortDirectionMap.LEFT],
          ["右", SortDirectionMap.RIGHT],
        ]),
        CUSTOM_SORT_FIELD_DIRECTION
      )
      .appendField("へ動く");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("左か右に1歩動きます。");
  },
};
javascriptGenerator[CUSTOM_SORT_MOVE] = (block) =>
  `${CUSTOM_SORT_MOVE}('${block.getFieldValue(CUSTOM_SORT_FIELD_DIRECTION)}');`;

export const CUSTOM_SORT_MOVETOEND = "custom_sort_moveToEnd";
Blockly.Blocks[CUSTOM_SORT_MOVETOEND] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("いちばん")
      .appendField(
        new Blockly.FieldDropdown([
          ["左", SortDirectionMap.LEFT],
          ["右", SortDirectionMap.RIGHT],
        ]),
        CUSTOM_SORT_FIELD_DIRECTION
      )
      .appendField("まで動く");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("左か右の端まで動きます。");
  },
};
javascriptGenerator[CUSTOM_SORT_MOVETOEND] = (block) =>
  `${CUSTOM_SORT_MOVETOEND}('${block.getFieldValue(
    CUSTOM_SORT_FIELD_DIRECTION
  )}');`;

export const CUSTOM_SORT_SWAP = "custom_sort_swap";
Blockly.Blocks[CUSTOM_SORT_SWAP] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["左", SortDirectionMap.LEFT],
          ["右", SortDirectionMap.RIGHT],
        ]),
        CUSTOM_SORT_FIELD_DIRECTION
      )
      .appendField("の人と入れ替える");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("左か右の生徒と目の前の生徒を入れ替えます。");
  },
};
javascriptGenerator[CUSTOM_SORT_SWAP] = (block) =>
  `${CUSTOM_SORT_SWAP}('${block.getFieldValue(CUSTOM_SORT_FIELD_DIRECTION)}');`;

export const CUSTOM_SORT_CHECKTALLER = "custom_maze_checkTaller";
Blockly.Blocks[CUSTOM_SORT_CHECKTALLER] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["左", SortDirectionMap.LEFT],
          ["右", SortDirectionMap.RIGHT],
        ]),
        CUSTOM_SORT_FIELD_DIRECTION
      )
      .appendField("の人のほうが大きい");
    this.setOutput(true, "Boolean");
    this.setColour(0);
    this.setTooltip("左か右の生徒と身長を比べます。");
  },
};
javascriptGenerator[CUSTOM_SORT_CHECKTALLER] = (block) => [
  `${CUSTOM_SORT_CHECKTALLER}('${block.getFieldValue(
    CUSTOM_SORT_FIELD_DIRECTION
  )}')`,
  0,
];

export const CUSTOM_SORT_CHECKEXISTENCE = "custom_maze_checkExistence";
Blockly.Blocks[CUSTOM_SORT_CHECKEXISTENCE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["左", SortDirectionMap.LEFT],
          ["右", SortDirectionMap.RIGHT],
        ]),
        CUSTOM_SORT_FIELD_DIRECTION
      )
      .appendField("に誰かいる");
    this.setOutput(true, "Boolean");
    this.setColour(0);
    this.setTooltip("左か右に生徒がいるかどうか調べます。");
  },
};
javascriptGenerator[CUSTOM_SORT_CHECKEXISTENCE] = (block) => [
  `${CUSTOM_SORT_CHECKEXISTENCE}('${block.getFieldValue(
    CUSTOM_SORT_FIELD_DIRECTION
  )}')`,
  0,
];
