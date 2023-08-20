import Blockly from "blockly";
import { javascriptGenerator } from "../../config/blockly";

// まずはブロックに名前を付けます。この名前はグローバルにユニークである必要があります。
// ユーザー定義のコンポーネントには CUSTOM プレフィックスをつけ、続けて各 Workspace 毎のプレフィックスをつけています。
export const CUSTOM_GRAPH_COLOUR_CHANGE = "CUSTOM_GRAPH_COLOUR_CHANGE";
export const CUSTOM_GRAPH_STACK_PUSH = "CUSTOM_GRAPH_STACK_PUSH";
export const CUSTOM_GRAPH_STACK_POP = "CUSTOM_GRAPH_STACK_POP";
export const CUSTOM_GRAPH_NODE_CHILD_EXISTS = "CUSTOM_GRAPH_NODE_CHILD_EXISTS";
export const CUSTOM_GRAPH_STACK_INITIALIZE = "CUSTOM_GRAPH_STACK_INITIALIZE";
// ブロックのフィールドにも名前が必要です。こちらはブロック毎にユニークで構いません。
export const CUSTOM_GRAPH_NODE = "CUSTOM_GRAPH_NODE";
export const CUSTOM_GRAPH_CHILD = "CUSTOM_GRAPH_CHILD";

Blockly.Blocks[CUSTOM_GRAPH_COLOUR_CHANGE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("青色にする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#add8e6");
    this.setTooltip("色を変えます");
  },
};

javascriptGenerator[CUSTOM_GRAPH_COLOUR_CHANGE] = () =>
  `${CUSTOM_GRAPH_COLOUR_CHANGE}();`;

Blockly.Blocks[CUSTOM_GRAPH_STACK_PUSH] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["左", "left"],
          ["右", "right"],
          ["この", "self"],
        ]),
        CUSTOM_GRAPH_NODE
      )
      .appendField("のnodeをstackにpushする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#d3d3d3");
    this.setTooltip("stackに追加するnodeを決めます");
  },
};

javascriptGenerator[CUSTOM_GRAPH_STACK_PUSH] = (block) =>
  `${CUSTOM_GRAPH_STACK_PUSH}('${block.getFieldValue(CUSTOM_GRAPH_NODE)}');`;

Blockly.Blocks[CUSTOM_GRAPH_STACK_POP] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("nodeをstackからpopする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FFA500");
    this.setTooltip("stackからnodeをpopします");
  },
};

javascriptGenerator[CUSTOM_GRAPH_STACK_POP] = () =>
  `${CUSTOM_GRAPH_STACK_POP}();`;

Blockly.Blocks[CUSTOM_GRAPH_NODE_CHILD_EXISTS] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["左", "left"],
          ["右", "right"],
          ["この", "self"],
        ]),
        CUSTOM_GRAPH_CHILD
      )
      .appendField("のchildNodeが存在する");
    this.setOutput(true, "Boolean");
    this.setColour("#F16767");
    this.setTooltip("~のnodeがあるかどうかを返します");
  },
};

javascriptGenerator[CUSTOM_GRAPH_NODE_CHILD_EXISTS] = (block) => [
  `${CUSTOM_GRAPH_NODE_CHILD_EXISTS}('${block.getFieldValue(
    CUSTOM_GRAPH_CHILD
  )}')`,
  0,
];

Blockly.Blocks[CUSTOM_GRAPH_STACK_INITIALIZE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("状態を初期化する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("white");
    this.setTooltip("状態を初期化します");
  },
};

javascriptGenerator[CUSTOM_GRAPH_STACK_INITIALIZE] = () =>
  `${CUSTOM_GRAPH_STACK_INITIALIZE}();`;
