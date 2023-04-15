import { useRef, useState } from "react";
import { Box, Grid, Text } from "@chakra-ui/react";
import { useGetSet } from "react-use";
import {
  BlocklyEditorMessage,
  useBlocklyInterpreter,
} from "../../commons/interpreter";
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
  const [getState, setState] = useGetSet(0);

  const globalFunctions = useRef({
    [CUSTOM_GA_NTH_ROUTE]: (value: number) => {
      const currentState = getState();
      const newState = currentState + value;
      setState(newState);
      if (newState >= 10) throw new BlocklyEditorMessage("10 になりました！");
      if (newState < 0) throw new Error("残念！ゼロを下回ってしまいました...");
    },
  }).current;

  const [interval, setInterval] = useState(500);
  const { workspaceAreaRef, highlightBlock, getCode } = useBlocklyWorkspace({
    toolboxDefinition,
  });
  const interpreter = useBlocklyInterpreter({
    globalFunctions,
    executionInterval: interval,
    onStep: highlightBlock,
  });

  return (
    <Grid h="100%" templateColumns="1fr 25rem">
      <div ref={workspaceAreaRef} />
      <Box p={4}>
        <ExecutionManager
          interpreter={interpreter}
          interval={interval}
          setInterval={setInterval}
          onStart={() => {
            interpreter.start(getCode());
          }}
          onReset={() => {
            setState(0);
          }}
        />
        <Text mt={2}>{getState()}</Text>
      </Box>
    </Grid>
  );
}
