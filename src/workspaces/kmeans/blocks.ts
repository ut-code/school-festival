import Blockly, { FieldNumber } from "blockly";
import { javascriptGenerator } from "../../config/blockly";

const VALUE = "value";

//k-means

export type data = {
  x:number;
  y:number;
  n:number;
}
export type cluster = {
  datas:data[];
  n:number;
}

export const CUSTOM_CENTER_OF_CLUSTER = "center_of_cluster";
export const CUSTOM_CALCULATE_CENTER_OF_CLUSTER = "calculate_center_of_cluster"
export const CUSTOM_ASSIGN_CLUSTER = "assign_cluster";
export const CUSTOM_DISTANCE_BETWEEN_X_AND_Y = 'distance_between_x_and_y';
export const CUSTOM_CLUSTER_OF_X = 'cluster_of_x';
export const CUSTOM_Y_IS_SMALLER_THAN_X = 'y_is_smaller_than_x';
export const CUSTOM_FOR_ALL_DATAS = 'for_all_blocks';
export const CUSTOM_DATA_PROCESSING = 'data_processing';
export const CUSTOM_FOR_ALL_CLUSTERS = 'for_all_clusters';
export const CUSTOM_CLUSTER_PROCESSING = 'cluster_processing';

const STATEMENTS = "STATEMENTS";
const DATA = "data";
const CLUSTER = "cluster";

Blockly.Blocks[CUSTOM_CENTER_OF_CLUSTER] = {
  init: function() {
    this.appendValueInput("CLUSTER")
        .setCheck("Cluster")
        .appendField("クラスター");
    this.appendDummyInput()
        .appendField("の中心");
    this.setInputsInline(true);
    this.setOutput(true, "Data");
    this.setColour(230);
    this.setTooltip("");
  }
};
javascriptGenerator[CUSTOM_CENTER_OF_CLUSTER] = (block:Blockly.Block) => 
  `${CUSTOM_CENTER_OF_CLUSTER}(${block.getFieldValue('CLUSTER')});`;

Blockly.Blocks[CUSTOM_CALCULATE_CENTER_OF_CLUSTER] = {
  init: function() {
    this.appendDummyInput()
        .appendField("クラスターの中心を計算する");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
  }
};
javascriptGenerator[CUSTOM_CALCULATE_CENTER_OF_CLUSTER] = (block: Blockly.Block) => 
  `${CUSTOM_CALCULATE_CENTER_OF_CLUSTER}();`;


Blockly.Blocks[CUSTOM_ASSIGN_CLUSTER] = {
  init: function() {
    this.appendValueInput("DATA")
        .setCheck("Data")
        .appendField("点");
    this.appendDummyInput()
        .appendField("に");
    this.appendValueInput("CLUSTER")
        .setCheck("Cluster")
        .appendField("クラスタ");
    this.appendDummyInput()
        .appendField("を割り当てる");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
  }
};
javascriptGenerator[CUSTOM_ASSIGN_CLUSTER] = (block: Blockly.Block) =>
  `${CUSTOM_ASSIGN_CLUSTER}(${block.getFieldValue("DATA")},${block.getFieldValue("CLUSTER")});`;

Blockly.Blocks[CUSTOM_DISTANCE_BETWEEN_X_AND_Y] = {
  init: function() {
    this.appendValueInput("DATA1")
        .setCheck("Data")
        .appendField("点");
    this.appendDummyInput()
        .appendField("から");
    this.appendValueInput("DATA2")
        .setCheck("Data")
        .appendField("点");
    this.appendDummyInput()
        .appendField("までの距離");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
  }
};
javascriptGenerator[CUSTOM_DISTANCE_BETWEEN_X_AND_Y] = (block: Blockly.Block) => 
  `${CUSTOM_DISTANCE_BETWEEN_X_AND_Y}(${block.getFieldValue("DATA1")},${block.getFieldValue("DATA2")})`

Blockly.Blocks[CUSTOM_CLUSTER_OF_X] = {
  init: function() {
    this.appendValueInput("DATA")
        .setCheck("Data")
        .appendField("点");
    this.appendDummyInput()
        .appendField("のクラスター");
    this.setInputsInline(true);
    this.setOutput(true, "Cluster");
    this.setColour(230);
    this.setTooltip("");
  }
};
javascriptGenerator[CUSTOM_CLUSTER_OF_X] = (block: Blockly.Block) => 
  `${CUSTOM_CLUSTER_OF_X}(${block.getFieldValue("DATA")});`;

Blockly.Blocks[CUSTOM_Y_IS_SMALLER_THAN_X] = {
  init: function() {
    this.appendValueInput("NUMBERX")
        .setCheck("Number")
        .appendField("");
    this.appendDummyInput()
        .appendField("より");
    this.appendValueInput("NUMBERY")
        .setCheck("Number")
        .appendField("");
    this.appendDummyInput()
        .appendField("が小さい");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(230);
    this.setTooltip("");
  }
};
javascriptGenerator[CUSTOM_Y_IS_SMALLER_THAN_X] = (block) => 
  `${CUSTOM_Y_IS_SMALLER_THAN_X}(${block.getFieldValue("NUMBERX")},${block.getFieldValue("NUMBERY")});`;


Blockly.Blocks[CUSTOM_FOR_ALL_DATAS] = {
  init: function() {
    this.appendDummyInput()
        .appendField("すべての点について");
    this.appendStatementInput(STATEMENTS)
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
  }
};
javascriptGenerator[CUSTOM_FOR_ALL_DATAS] = (block:Blockly.Block) => {
  const statements = javascriptGenerator.statementToCode(
    block,
    STATEMENTS
  );
  return `const currentState = getState(); \n
          currentState.listOfClusters.forEach( \n
            (${CLUSTER}) => ( \n
              ${CLUSTER}.datas.forEach( \n
              (${DATA}) => (${statements}) \n
              )
            )
          )`;
}

Blockly.Blocks[CUSTOM_DATA_PROCESSING] = {
  init: function() {
    this.appendDummyInput()
        .appendField("現在処理している点");
    this.setOutput(true, "Data");
    this.setColour(230);
    this.setTooltip("");
  }
};
javascriptGenerator[CUSTOM_DATA_PROCESSING] = () => 
  `${DATA}`;
  
Blockly.Blocks[CUSTOM_FOR_ALL_CLUSTERS] = {
  init: function() {
    this.appendDummyInput()
        .appendField("すべてのクラスターについて");
    this.appendStatementInput(STATEMENTS)
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
  }
};
javascriptGenerator[CUSTOM_FOR_ALL_CLUSTERS] = (block:Blockly.Block) => {
  const statements = javascriptGenerator.statementToCode(
    block,
    STATEMENTS
  );
  return `const currentState = getState(); \n
          currentState.listOfClusters.forEach( \n
            (${CLUSTER}) => (${statements}) \n
          )`;
} 

Blockly.Blocks[CUSTOM_CLUSTER_PROCESSING] = {
  init: function() {
    this.appendDummyInput()
        .appendField("現在処理しているクラスター");
    this.setOutput(true, "Cluster");
    this.setColour(230);
    this.setTooltip("");
  }
};
javascriptGenerator[CUSTOM_CLUSTER_PROCESSING] = () => 
  `${CLUSTER}`;

// デバッグ用
// eslint-disable-next-line import/prefer-default-export
export const CONSOLE_LOG = "console_log";
Blockly.Blocks[CONSOLE_LOG] = {
  init(this: Blockly.Block) {
    this.appendValueInput(VALUE).appendField("console.log");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  },
};
javascriptGenerator[CONSOLE_LOG] = (block: Blockly.Block) =>
  `console.log(${block.getFieldValue(
    VALUE,
    
  )});`;

export const CUSTOM_TEXT_INPUT = "text_input";
  Blockly.Blocks[CUSTOM_TEXT_INPUT] = {
    init(this:Blockly.Block) {
      this.appendDummyInput()
          .appendField(new Blockly.FieldTextInput("default"), "NAME");
      this.setOutput(true, "Text");
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  javascriptGenerator[CUSTOM_TEXT_INPUT] = function(block:Blockly.Block) {
    var text_name:string = block.getFieldValue('NAME');
    // TODO: Assemble JavaScript into code variable.
    var code:string = text_name;
    // TODO: Change ORDER_NONE to the correct strength.
    return code;
  };
