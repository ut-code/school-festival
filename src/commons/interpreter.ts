import Interpreter from 'js-interpreter';
import { STATEMENT_PREFIX_FUNCTION } from '../config/blockly';

export function* executeBlocklyCode(
  code: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  globalFunctions: Record<string, Function>,
): Generator<string, null> {
  let highlightedBlockId: string | null = null;
  const interpreter = new Interpreter(code, (newInterpreter, globalScope) => {
    Object.entries(globalFunctions).forEach(
      ([functionName, nativeFunction]) => {
        newInterpreter.setProperty(
          globalScope,
          functionName,
          newInterpreter.createNativeFunction(nativeFunction),
        );
      },
    );
    newInterpreter.setProperty(
      globalScope,
      STATEMENT_PREFIX_FUNCTION,
      newInterpreter.createNativeFunction((blockId: string) => {
        highlightedBlockId = blockId;
      }),
    );
  });
  let loopTrap = 0;
  while (true) {
    if (!interpreter.step()) {
      return null;
    }
    if (highlightedBlockId) {
      yield highlightedBlockId;
      highlightedBlockId = null;
      loopTrap = 0;
    }
    loopTrap += 1;
    if (loopTrap > 100) {
      throw new Error('無限ループに入ってしまったようです。');
    }
  }
}
