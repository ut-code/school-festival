import { useToast } from "@chakra-ui/react";
import Interpreter from "js-interpreter";
import { useCallback, useEffect, useRef, useState } from "react";
import { STATEMENT_PREFIX_FUNCTION } from "../config/blockly";

export class BlocklyEditorMessage {
  public message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export type UseBlocklyInterpreterProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalFunctions: Record<string, (...args: any[]) => any>;
  executionInterval?: number;
  onStep?(blockId: string | null): void;
};

export type BlocklyExecutionState =
  | "stopped"
  | "running"
  | "paused"
  | "finished";

export type UseBlocklyInterpreterReturnValue = {
  executionState: BlocklyExecutionState;
  startExecution(code: string): void;
  stepExecution(): void;
  pauseExecution(): void;
  resumeExecution(): void;
  stopExecution(): void;
};

export function useBlocklyInterpreter({
  globalFunctions,
  executionInterval,
  onStep,
}: UseBlocklyInterpreterProps): UseBlocklyInterpreterReturnValue {
  const toast = useToast();
  const interpreterRef = useRef<Interpreter>();
  const highlightedBlockIdRef = useRef<string>();

  const [executionState, setExecutionState] =
    useState<BlocklyExecutionState>("stopped");

  const prepareExecution = useCallback(
    (code: string) => {
      interpreterRef.current = new Interpreter(
        code,
        (newInterpreter, globalScope) => {
          Object.entries(globalFunctions).forEach(
            ([functionName, globalFunction]) => {
              newInterpreter.setProperty(
                globalScope,
                functionName,
                newInterpreter.createNativeFunction(globalFunction),
              );
            },
          );
          newInterpreter.setProperty(
            globalScope,
            STATEMENT_PREFIX_FUNCTION,
            newInterpreter.createNativeFunction((blockId: string) => {
              highlightedBlockIdRef.current = blockId;
              onStep?.(blockId);
            }),
          );
        },
      );
    },
    [globalFunctions, onStep],
  );

  const startExecution = useCallback(
    (code: string) => {
      prepareExecution(code);
      setExecutionState("running");
    },
    [prepareExecution],
  );
  const pauseExecution = useCallback(() => {
    setExecutionState("paused");
  }, []);
  const resumeExecution = useCallback(() => {
    setExecutionState("running");
  }, []);
  const stopExecution = useCallback(() => {
    setExecutionState("stopped");
  }, []);

  const stepExecution = useCallback(() => {
    const interpreter = interpreterRef.current;
    if (!interpreter) return;
    try {
      let loopTrap = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (!interpreter.step()) {
          setExecutionState("finished");
          return;
        }
        if (highlightedBlockIdRef.current) {
          onStep?.(null);
          highlightedBlockIdRef.current = undefined;
          loopTrap = 0;
          return;
        }
        loopTrap += 1;
        if (loopTrap > 100) {
          throw new Error("無限ループに入ってしまったようです。");
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: "エラーが発生しました",
          status: "error",
          description: e.message,
        });
      }
      if (e instanceof BlocklyEditorMessage) {
        toast({
          title: "メッセージ",
          status: "info",
          description: e.message,
        });
      }
      setExecutionState("finished");
    }
  }, [onStep, toast]);

  useEffect(() => {
    if (executionState !== "running") return undefined;
    let timerId = NaN;
    const loopFunction = () => {
      stepExecution();
      timerId = window.setTimeout(loopFunction, executionInterval);
    };
    timerId = window.setTimeout(loopFunction, executionInterval);
    return () => {
      clearTimeout(timerId);
    };
  }, [executionInterval, executionState, stepExecution]);

  return {
    executionState,
    startExecution,
    stepExecution,
    pauseExecution,
    resumeExecution,
    stopExecution,
  };
}

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
      throw new Error("無限ループに入ってしまったようです。");
    }
  }
}
