import Blockly from "blockly";
import { javascriptGenerator } from "../../config/blockly";

export const CELLULAR_AUTOMATON_WORLD_SIZE = 30;

export const CellularAutomatonColourMap = {
  BLACK: "black",
  WHITE: "white",
} as const;
export type CellularAutomatonColour =
  typeof CellularAutomatonColourMap extends Record<string, infer U> ? U : never;

export const CUSTOM_CELLULAR_AUTOMATON_FIELD_COLOUR =
  "CUSTOM_SORT_FIELD_COLOUR";

export const CUSTOM_CELLULAR_AUTOMATON_FILL = "custom_cellular_automaton_fill";
Blockly.Blocks[CUSTOM_CELLULAR_AUTOMATON_FILL] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["黒", CellularAutomatonColourMap.BLACK],
          ["白", CellularAutomatonColourMap.WHITE],
        ]),
        CUSTOM_CELLULAR_AUTOMATON_FIELD_COLOUR
      )
      .appendField("で塗る");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("次の時点でのセルの色を決定します。");
  },
};
javascriptGenerator[CUSTOM_CELLULAR_AUTOMATON_FILL] = (block) =>
  `next[y][x] = ${String(
    block.getFieldValue(CUSTOM_CELLULAR_AUTOMATON_FIELD_COLOUR) === "black"
  )};`;

export const CUSTOM_CELLULAR_AUTOMATON_SELF_IS_BLACK =
  "custom_cellular_automaton_self_is_black";
Blockly.Blocks[CUSTOM_CELLULAR_AUTOMATON_SELF_IS_BLACK] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("このマスは黒い");
    this.setOutput(true, "Boolean");
    this.setColour(0);
    this.setTooltip("現在のセルが黒いかどうか");
  },
};
javascriptGenerator[CUSTOM_CELLULAR_AUTOMATON_SELF_IS_BLACK] = () => [
  `previous[y][x]`,
  0,
];

export const CUSTOM_CELLULAR_AUTOMATON_SURROUNDINGS_COUNT =
  "custom_cellular_automaton_surroundings_count";
Blockly.Blocks[CUSTOM_CELLULAR_AUTOMATON_SURROUNDINGS_COUNT] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("周囲の黒いマスの数");
    this.setOutput(true, "Number");
    this.setColour(0);
    this.setTooltip("周囲8マスの中で、黒色で塗られているマスの数");
  },
};
javascriptGenerator[CUSTOM_CELLULAR_AUTOMATON_SURROUNDINGS_COUNT] = () => [
  `
  (function () {
    var count = 0;
    for (var i = y - 1; i <= y + 1; i++) {
      for (var j = x - 1; j <= x + 1; j++) {
        if (
          (i != y || j != x) &&
          0 <= i && i < ${CELLULAR_AUTOMATON_WORLD_SIZE} &&
          0 <= j && j < ${CELLULAR_AUTOMATON_WORLD_SIZE} &&
          previous[i][j]
        )
          count += 1;
      }
    }
    return count;
  })()
  `,
  0,
];
