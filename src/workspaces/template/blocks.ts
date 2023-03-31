import Blockly, { FieldNumber } from "blockly";
import { javascriptGenerator } from "../../config/blockly";

// まずはブロックに名前を付けます。この名前はグローバルにユニークである必要があります。
// ユーザー定義のコンポーネントには CUSTOM プレフィックスをつけ、続けて各 Workspace 毎のプレフィックスをつけています。
export const CUSTOM_TEMPLATE_INCREMENT = "custom_template_increment";

// ブロックのフィールドにも名前が必要です。こちらはブロック毎にユニークで構いません。
export const CUSTOM_TEMPLATE_INCREMENT_VALUE = "value";

// Blockly.Blocks のプロパティでブロックを定義します。
// 詳細は https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks を参照してください。
Blockly.Blocks[CUSTOM_TEMPLATE_INCREMENT] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new FieldNumber(), CUSTOM_TEMPLATE_INCREMENT_VALUE)
      .appendField("増やす");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("増やします");
  },
};

// javascriptGenerator のプロパティにはブロックがどのように JavaScript に変換されるのかを定義します。
// [JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter) の仕様により ES5 までの文法しか使えません。
javascriptGenerator[CUSTOM_TEMPLATE_INCREMENT] = (block) =>
  `${CUSTOM_TEMPLATE_INCREMENT}(${block.getFieldValue(
    CUSTOM_TEMPLATE_INCREMENT_VALUE
  )});`;
