import Blockly from 'blockly';
import Ja from 'blockly/msg/ja';

export const STATEMENT_PREFIX_FUNCTION = 'beforeStatement';

Blockly.setLocale(Ja);

Blockly.HSV_SATURATION = 0.6;
Blockly.HSV_VALUE = 1;

Blockly.JavaScript.STATEMENT_PREFIX = `${STATEMENT_PREFIX_FUNCTION}(%1);\n`;
Blockly.JavaScript.addReservedWords(STATEMENT_PREFIX_FUNCTION);
