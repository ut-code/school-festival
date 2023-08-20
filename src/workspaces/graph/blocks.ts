import Blockly from "blockly";
import { javascriptGenerator } from "../../config/blockly";

// まずはブロックに名前を付けます。この名前はグローバルにユニークである必要があります。
// ユーザー定義のコンポーネントには CUSTOM プレフィックスをつけ、続けて各 Workspace 毎のプレフィックスをつけています。
export const CUSTOM_GRAPH_COLOUR_CHANGE = "CUSTOM_GRAPH_COLOUR_CHANGE";
export const CUSTOM_GRAPH_STACK_PUSH = "CUSTOM_GRAPH_STACK_PUSH";
export const CUSTOM_GRAPH_STACK_POP = "CUSTOM_GRAPH_STACK_POP";
export const CUSTOM_GRAPH_QUEUE_ENQUE = "CUSTOM_GRAPH_QUEUE_ENQUE";
export const CUSTOM_GRAPH_QUEUE_DEQUE = "CUSTOM_GRAPH_QUEUE_DEQUE";
export const CUSTOM_GRAPH_INITIALIZE = "CUSTOM_GRAPH_INITIALIZE";
// ブロックのフィールドにも名前が必要です。こちらはブロック毎にユニークで構いません。
export const CUSTOM_GRAPH_STACK_PUSH_FIELD = "CUSTOM_GRAPH_STACK_PUSH_FIELD";
export const CUSTOM_GRAPH_QUEUE_ENQUE_FIELD = "CUSTOM_GRAPH_QUEUE_ENQUE_FIELD";
export const CUSTOM_GRAPH_INITIALIZE_FIELD = "CUSTOM_GRAPH_INITIALIZE_FIELD";

Blockly.Blocks[CUSTOM_GRAPH_COLOUR_CHANGE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("青色にする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9AC5F4");
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
        CUSTOM_GRAPH_STACK_PUSH_FIELD
      )
      .appendField("のnodeをstackにpushする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#B2B2B2");
    this.setTooltip("stackに追加するnodeを決めます");
  },
};

javascriptGenerator[CUSTOM_GRAPH_STACK_PUSH] = (block) =>
  `${CUSTOM_GRAPH_STACK_PUSH}('${block.getFieldValue(
    CUSTOM_GRAPH_STACK_PUSH_FIELD
  )}');`;

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

Blockly.Blocks[CUSTOM_GRAPH_QUEUE_ENQUE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["左", "left"],
          ["右", "right"],
          ["この", "self"],
        ]),
        CUSTOM_GRAPH_QUEUE_ENQUE_FIELD
      )
      .appendField("のnodeをqueueにenqueする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#B2B2B2");
    this.setTooltip("queueにenqueするnodeを決めます");
  },
};

javascriptGenerator[CUSTOM_GRAPH_QUEUE_ENQUE] = (block) =>
  `${CUSTOM_GRAPH_QUEUE_ENQUE}('${block.getFieldValue(
    CUSTOM_GRAPH_QUEUE_ENQUE_FIELD
  )}');`;

Blockly.Blocks[CUSTOM_GRAPH_QUEUE_DEQUE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("nodeをqueueからdequeする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FFA500");
    this.setTooltip("queueからnodeをdequeします");
  },
};

javascriptGenerator[CUSTOM_GRAPH_QUEUE_DEQUE] = () =>
  `${CUSTOM_GRAPH_QUEUE_DEQUE}();`;

Blockly.Blocks[CUSTOM_GRAPH_INITIALIZE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["問題1", "BfsTraversal"],
          ["問題2", "DfsPreorderTraversal"],
        ]),
        CUSTOM_GRAPH_INITIALIZE_FIELD
      )
      .appendField("に状態を初期化する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#61677A");
    this.setTooltip("状態を初期化します");
  },
};

javascriptGenerator[CUSTOM_GRAPH_INITIALIZE] = (block) =>
  `${CUSTOM_GRAPH_INITIALIZE}('${block.getFieldValue(
    CUSTOM_GRAPH_INITIALIZE_FIELD
  )}');`;
