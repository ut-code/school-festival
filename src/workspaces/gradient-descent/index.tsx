import { useRef, useState } from "react";
import { Box, Grid, Text } from "@chakra-ui/react";
import { useGetSet } from "react-use";
import { useBlocklyInterpreter } from "../../commons/interpreter";
import { useBlocklyWorkspace } from "../../commons/blockly";
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
  CUSTOM_GRAD_CONSOLE_LOG,
  CUSTOM_GRAD_OBJECTIVE,
  CUSTOM_GRAD_SET_X,
  CUSTOM_GRAD_SET_Y,
} from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import { GradRenderer } from "./components/GradRenderer";

import { objectiveFunction } from "./objective";

const toolboxBlocks = [
  // 共有のブロック
  BUILTIN_MATH_NUMBER,
  BUILTIN_MATH_ARITHMETIC,
  BUILTIN_LOGIC_COMPARE,
  BUILTIN_LOGIC_OPERATION,
  BUILTIN_LOGIC_NEGATE,
  CUSTOM_COMMON_WHILE_TRUE,
  CUSTOM_COMMON_WHILE,
  // ワークスペースごとに定義したブロック
  CUSTOM_GRAD_CONSOLE_LOG,
  CUSTOM_GRAD_OBJECTIVE,
  CUSTOM_GRAD_SET_X,
  CUSTOM_GRAD_SET_Y,
];

export type GradWorkspaceState = {
  x: number;
  y: number;
};

function createDefaultState() {
  return {
    x: 0,
    y: 0,
  };
}

export function GradWorkspace(): JSX.Element {
  // interpreter に渡す関数は実行開始時に決定されるため、通常の state だと最新の情報が参照できません
  // このため、反則ですが内部的に ref を用いて状態管理をしている react-use の [useGetSet](https://github.com/streamich/react-use/blob/master/docs/useGetSet.md) を用いています。
  const [getState, setState] = useGetSet(createDefaultState());

  // javascriptGenerator により生成されたコードから呼ばれる関数を定義します
  const globalFunctions = useRef({
    [CUSTOM_GRAD_OBJECTIVE]: (x: number, y: number) => {
      // console.log(objectiveFunction(x, y));
      return objectiveFunction(x, y);
    },
    [CUSTOM_GRAD_SET_X]: (newX: number) => {
      const state = getState();
      setState({ x: newX, y: state.y });
    },
    [CUSTOM_GRAD_SET_Y]: (newY: number) => {
      const state = getState();
      setState({ x: state.x, y: newY });
    },
  }).current;

  const [interval, setInterval] = useState(500);
  const { workspaceAreaRef, highlightBlock, getCode } = useBlocklyWorkspace({
    toolboxDefinition: { type: "flyout", blockTypes: toolboxBlocks },
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
            setState({ x: 0, y: 0 });
          }}
        />
        <Text mt={2}>x: {getState().x}</Text>
        <Text mt={2}>y: {getState().y}</Text>
        <GradRenderer x={getState().x} y={getState().y} />
      </Box>
    </Grid>
  );
}
