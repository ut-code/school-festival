import { useToast } from "@chakra-ui/react";
import JSInterpreter from "js-interpreter";
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

export type BlocklyInterpreterState =
  | "stopped"
  | "running"
  | "paused"
  | "finished";

export type BlocklyInterpreter = {
  state: BlocklyInterpreterState;
  start(code: string): void;
  step(): void;
  pause(): void;
  resume(): void;
  stop(): void;
};

export function useBlocklyInterpreter({
  globalFunctions,
  executionInterval,
  onStep,
}: UseBlocklyInterpreterProps): BlocklyInterpreter {
  const toast = useToast();
  const jsInterpreterRef = useRef<JSInterpreter>();
  const highlightedBlockIdRef = useRef<string>();

  const [executionState, setExecutionState] =
    useState<BlocklyInterpreterState>("stopped");

  const prepareExecution = useCallback(
    (code: string) => {
      jsInterpreterRef.current = new JSInterpreter(
        code,
        (newInterpreter, globalScope) => {
          Object.entries(globalFunctions).forEach(
            ([functionName, globalFunction]) => {
              newInterpreter.setProperty(
                globalScope,
                functionName,
                newInterpreter.createNativeFunction(globalFunction)
              );
            }
          );
          newInterpreter.setProperty(
            globalScope,
            STATEMENT_PREFIX_FUNCTION,
            newInterpreter.createNativeFunction((blockId: string) => {
              highlightedBlockIdRef.current = blockId;
              onStep?.(blockId);
            })
          );
        }
      );
    },
    [globalFunctions, onStep]
  );

  const startExecution = useCallback(
    (code: string) => {
      prepareExecution(code);
      setExecutionState("running");
    },
    [prepareExecution]
  );
  const pauseExecution = useCallback(() => {
    setExecutionState("paused");
  }, []);
  const resumeExecution = useCallback(() => {
    setExecutionState("running");
  }, []);
  const finishExecution = useCallback(() => {
    onStep?.(null);
    highlightedBlockIdRef.current = undefined;
    setExecutionState("finished");
  }, [onStep]);
  const stopExecution = useCallback(() => {
    onStep?.(null);
    highlightedBlockIdRef.current = undefined;
    setExecutionState("stopped");
  }, [onStep]);

  const stepExecution = useCallback(() => {
    const jsInterpreter = jsInterpreterRef.current;
    if (!jsInterpreter) return;
    try {
      let loopTrap = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (!jsInterpreter.step()) {
          finishExecution();
          return;
        }
        if (highlightedBlockIdRef.current) {
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
        finishExecution();
        return;
      }
      if (e instanceof BlocklyEditorMessage) {
        toast({
          title: "メッセージ",
          status: "info",
          description: e.message,
        });
        finishExecution();
        return;
      }
      toast({
        title: "原因不明のエラーが発生しました",
        status: "error",
      });
      finishExecution();
    }
  }, [toast, finishExecution]);

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
    state: executionState,
    start: startExecution,
    step: stepExecution,
    pause: pauseExecution,
    resume: resumeExecution,
    stop: stopExecution,
  };
}
