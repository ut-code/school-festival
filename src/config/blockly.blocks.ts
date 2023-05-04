import Blockly from "blockly";
import { javascriptGenerator } from "./blockly";

export const BUILTIN_MATH_NUMBER = "math_number";
export const BUILTIN_MATH_ARITHMETIC = "math_arithmetic";
export const BUILTIN_LOGIC_COMPARE = "logic_compare";
export const BUILTIN_LOGIC_OPERATION = "logic_operation";
export const BUILTIN_LOGIC_NEGATE = "logic_negate";

export const CUSTOM_COMMON_FIELD_EXPRESSION = "EXPRESSION";
export const CUSTOM_COMMON_FIELD_TRUE_STATEMENTS = "TRUE_STATEMENTS";
export const CUSTOM_COMMON_FIELD_FALSE_STATEMENTS = "FALSE_STATEMENTS";
export const CUSTOM_COMMON_FIELD_STATEMENTS = "STATEMENTS";
export const CUSTOM_COMMON_IF = "custom_common_if";
Blockly.Blocks[CUSTOM_COMMON_IF] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("もし");
    this.appendValueInput(CUSTOM_COMMON_FIELD_EXPRESSION).setCheck("Boolean");
    this.appendDummyInput().appendField("ならば");
    this.appendStatementInput(CUSTOM_COMMON_FIELD_TRUE_STATEMENTS).setCheck(
      null
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("条件が満たされた場合のみ、内部の文を実行します。");
  },
};
javascriptGenerator[CUSTOM_COMMON_IF] = (block) => {
  const expression =
    javascriptGenerator.valueToCode(block, CUSTOM_COMMON_FIELD_EXPRESSION, 0) ||
    "false";
  const trueStatements = javascriptGenerator.statementToCode(
    block,
    CUSTOM_COMMON_FIELD_TRUE_STATEMENTS
  );
  return `if(${expression}){${trueStatements}}`;
};

export const CUSTOM_COMMON_IF_ELSE = "custom_common_if_else";
Blockly.Blocks[CUSTOM_COMMON_IF_ELSE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("もし");
    this.appendValueInput(CUSTOM_COMMON_FIELD_EXPRESSION).setCheck(null);
    this.appendDummyInput().appendField("ならば");
    this.appendStatementInput(CUSTOM_COMMON_FIELD_TRUE_STATEMENTS).setCheck(
      null
    );
    this.appendDummyInput().appendField("違えば");
    this.appendStatementInput(CUSTOM_COMMON_FIELD_FALSE_STATEMENTS).setCheck(
      null
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip(
      "条件が満たされた場合は1番目の文を、満たされない場合は2番目の文を実行します。"
    );
  },
};
javascriptGenerator[CUSTOM_COMMON_IF_ELSE] = (block) => {
  const expression =
    javascriptGenerator.valueToCode(block, CUSTOM_COMMON_FIELD_EXPRESSION, 0) ||
    "false";
  const trueStatements = javascriptGenerator.statementToCode(
    block,
    CUSTOM_COMMON_FIELD_TRUE_STATEMENTS
  );
  const falseStatements = javascriptGenerator.statementToCode(
    block,
    CUSTOM_COMMON_FIELD_FALSE_STATEMENTS
  );
  return `if(${expression}){${trueStatements}}else{${falseStatements}}`;
};

export const CUSTOM_COMMON_WHILE_TRUE = "custom_while_true";
Blockly.Blocks[CUSTOM_COMMON_WHILE_TRUE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("ずっと");
    this.appendStatementInput(CUSTOM_COMMON_FIELD_STATEMENTS).setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("文を繰り返し実行します。");
  },
};
javascriptGenerator[CUSTOM_COMMON_WHILE_TRUE] = (block) => {
  const statements = javascriptGenerator.statementToCode(
    block,
    CUSTOM_COMMON_FIELD_STATEMENTS
  );
  return `while(true){${statements}}`;
};

export const CUSTOM_COMMON_WHILE = "custom_while";
Blockly.Blocks[CUSTOM_COMMON_WHILE] = {
  init(this: Blockly.Block) {
    this.appendValueInput(CUSTOM_COMMON_FIELD_EXPRESSION).setCheck("Boolean");
    this.appendDummyInput().appendField("の間ずっと");
    this.appendStatementInput(CUSTOM_COMMON_FIELD_STATEMENTS).setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("条件が満たされている間、文を繰り返し実行します。");
  },
};
javascriptGenerator[CUSTOM_COMMON_WHILE] = (block) => {
  const expression =
    javascriptGenerator.valueToCode(block, CUSTOM_COMMON_FIELD_EXPRESSION, 0) ||
    "false";
  const statements = javascriptGenerator.statementToCode(
    block,
    CUSTOM_COMMON_FIELD_STATEMENTS
  );
  return `while(${expression}){${statements}}`;
};

export const CUSTOM_COMMON_DO_UNTIL = "custom_do_until";
Blockly.Blocks[CUSTOM_COMMON_DO_UNTIL] = {
  init(this: Blockly.Block) {
    this.appendValueInput(CUSTOM_COMMON_FIELD_EXPRESSION).setCheck("Boolean");
    this.appendDummyInput().appendField("になるまで");
    this.appendStatementInput(CUSTOM_COMMON_FIELD_STATEMENTS).setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("条件が満たされるまで、文を繰り返し実行します。");
  },
};
javascriptGenerator[CUSTOM_COMMON_DO_UNTIL] = (block) => {
  const expression =
    javascriptGenerator.valueToCode(block, CUSTOM_COMMON_FIELD_EXPRESSION, 0) ||
    "false";
  const statements = javascriptGenerator.statementToCode(
    block,
    CUSTOM_COMMON_FIELD_STATEMENTS
  );
  return `while(!(${expression})){${statements}}`;
};

export const CUSTOM_COMMON_TIMES = "custom_times";
Blockly.Blocks[CUSTOM_COMMON_TIMES] = {
  init(this: Blockly.Block) {
    this.appendValueInput(CUSTOM_COMMON_FIELD_EXPRESSION).setCheck("Number");
    this.appendDummyInput().appendField("回繰り返す");
    this.appendStatementInput(CUSTOM_COMMON_FIELD_STATEMENTS).setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("指定された回数、文を繰り返し実行します。");
  },
};
let tempVariableIndex = 0;
javascriptGenerator[CUSTOM_COMMON_TIMES] = (block) => {
  const tempVariableName = `blocklyTempVariable${CUSTOM_COMMON_TIMES}${tempVariableIndex}`;
  tempVariableIndex += 1;
  const expression =
    javascriptGenerator.valueToCode(block, CUSTOM_COMMON_FIELD_EXPRESSION, 0) ||
    "0";
  const statements = javascriptGenerator.statementToCode(
    block,
    CUSTOM_COMMON_FIELD_STATEMENTS
  );
  return `for (var ${tempVariableName} = 0; ${tempVariableName} < (${expression}); ${tempVariableName}++) {${statements}}`;
};
