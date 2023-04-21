import { useCallback, useRef, useState } from "react";
import { Grid, Stack } from "@chakra-ui/react";
import { useGetSet } from "react-use";
import { useBlocklyInterpreter } from "../../commons/interpreter";
import {
  BlocklyToolboxDefinition,
  useBlocklyWorkspace,
} from "../../commons/blockly";
import {
  BUILTIN_LOGIC_COMPARE,
  BUILTIN_LOGIC_NEGATE,
  BUILTIN_LOGIC_OPERATION,
  BUILTIN_MATH_ARITHMETIC,
  BUILTIN_MATH_NUMBER,
  CUSTOM_COMMON_WHILE,
  CUSTOM_COMMON_WHILE_TRUE,
} from "../../config/blockly.blocks";
import {
  CUSTOM_GA_ADD_PLACE,
  CUSTOM_GA_CREATE_ROUTE,
  CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE,
  CUSTOM_GA_DISTANCE,
  CUSTOM_GA_DUPLICATE_ROUTE,
  CUSTOM_GA_NTH_PLACE,
  CUSTOM_GA_NTH_ROUTE,
  CUSTOM_GA_RANDOM_INT,
  CUSTOM_GA_SWAP_PLACE,
  CUSTOM_GA_SWAP_ROUTES,
} from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import GARenderer from "./GARenderer";
import { createInitialGAState, createRouteReducer, isGARoute } from "./types";
import VariableList from "../../components/VariableList";

const toolboxDefinition: BlocklyToolboxDefinition = {
  type: "category",
  categories: [
    {
      name: "基本",
      blockTypes: [
        BUILTIN_MATH_NUMBER,
        BUILTIN_MATH_ARITHMETIC,
        BUILTIN_LOGIC_COMPARE,
        BUILTIN_LOGIC_OPERATION,
        BUILTIN_LOGIC_NEGATE,
        CUSTOM_COMMON_WHILE_TRUE,
        CUSTOM_COMMON_WHILE,
        CUSTOM_GA_RANDOM_INT,
        CUSTOM_GA_NTH_ROUTE,
        CUSTOM_GA_CREATE_ROUTE,
        CUSTOM_GA_DUPLICATE_ROUTE,
        CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE,
        CUSTOM_GA_SWAP_ROUTES,
        CUSTOM_GA_NTH_PLACE,
        CUSTOM_GA_DISTANCE,
        CUSTOM_GA_ADD_PLACE,
        CUSTOM_GA_SWAP_PLACE,
      ],
    },
  ],
  enableVariables: true,
};

export function GeneticAlgorithmWorkspace(): JSX.Element {
  const initialState = useState(createInitialGAState)[0];
  const [getState, setState] = useGetSet(initialState);

  const globalFunctions = useRef({
    [CUSTOM_GA_CREATE_ROUTE]: () => {
      const [newState, newRoute] = createRouteReducer(getState());
      setState(newState);
      return newRoute;
    },
  }).current;

  const [interval, setInterval] = useState(500);
  const [variableNames, setVariableNames] = useState<string[]>([]);
  const { workspaceAreaRef, highlightBlock, getCode } = useBlocklyWorkspace({
    toolboxDefinition,
    onCodeChange: useCallback((_: unknown, newVariableNames: string[]) => {
      setVariableNames(newVariableNames);
    }, []),
  });
  const interpreter = useBlocklyInterpreter({
    globalFunctions,
    executionInterval: interval,
    onStep: highlightBlock,
  });

  return (
    <Grid h="100%" templateColumns="1fr 25rem">
      <div ref={workspaceAreaRef} />
      <Stack p={4} spacing={2}>
        <ExecutionManager
          interpreter={interpreter}
          interval={interval}
          setInterval={setInterval}
          onStart={() => {
            interpreter.start(getCode());
          }}
          onReset={() => {
            setState(initialState);
          }}
        />
        <VariableList
          interpreter={interpreter}
          variableNames={variableNames}
          renderVariable={(value) => {
            if (isGARoute(value)) return <>経路 #{value.label}</>;
            return undefined;
          }}
        />
        <GARenderer state={getState()} />
      </Stack>
    </Grid>
  );
}
