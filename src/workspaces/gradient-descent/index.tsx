import { useRef, useState } from "react";
import { Box, Grid, Text, Button } from "@chakra-ui/react";
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
  CUSTOM_GRAD_OBJECTIVE,
  CUSTOM_GRAD_SET_X,
  CUSTOM_GRAD_SET_Y,
  CUSTOM_GRAD_X_VALUE,
  CUSTOM_GRAD_Y_VALUE,
} from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import { GradRenderer, GradResetCamera } from "./components/GradRenderer";

import { objectiveFunction } from "./objective";

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
      ],
    },
    {
      name: "座標",
      blockTypes: [
        CUSTOM_GRAD_X_VALUE,
        CUSTOM_GRAD_Y_VALUE,
        CUSTOM_GRAD_OBJECTIVE,
        CUSTOM_GRAD_SET_X,
        CUSTOM_GRAD_SET_Y,
      ],
    },
  ],
  enableVariables: true,
};

export type GradWorkspaceState = {
  x: number;
  y: number;
  x_answer: number;
  y_answer: number;
};

const initialX = -100;
const initialY = -100;
const answerRange = 600;

function createDefaultState() {
  return {
    x: initialX,
    y: initialY,
    x_answer: (Math.random() - 0.5) * answerRange,
    y_answer: (Math.random() - 0.5) * answerRange,
  };
}

export function GradWorkspace(): JSX.Element {
  // interpreter に渡す関数は実行開始時に決定されるため、通常の state だと最新の情報が参照できません
  // このため、反則ですが内部的に ref を用いて状態管理をしている react-use の [useGetSet](https://github.com/streamich/react-use/blob/master/docs/useGetSet.md) を用いています。
  const [getState, setState] = useGetSet(createDefaultState());

  // javascriptGenerator により生成されたコードから呼ばれる関数を定義します
  const globalFunctions = useRef({
    [CUSTOM_GRAD_OBJECTIVE]: (x: number, y: number) => {
      const state = getState();
      return objectiveFunction(x, y, state.x_answer, state.y_answer);
    },
    [CUSTOM_GRAD_SET_X]: (newX: number) => {
      const state = getState();
      setState({ ...state, x: newX });
    },
    [CUSTOM_GRAD_SET_Y]: (newY: number) => {
      const state = getState();
      setState({ ...state, y: newY });
    },
    [CUSTOM_GRAD_X_VALUE]: () => {
      const state = getState();
      return state.x;
    },
    [CUSTOM_GRAD_Y_VALUE]: () => {
      const state = getState();
      return state.y;
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
            setState({ ...getState(), x: initialX, y: initialY });
          }}
        />
        <Text mt={2}>x: {getState().x}</Text>
        <Text mt={2}>y: {getState().y}</Text>
        <GradRenderer
          x={getState().x}
          y={getState().y}
          xAnswer={getState().x_answer}
          yAnswer={getState().y_answer}
        />
        <Button
          onClick={() => {
            GradResetCamera();
          }}
        >
          カメラの位置をリセットする
        </Button>
        <Button
          onClick={() => {
            setState({
              ...getState(),
              x_answer: (Math.random() - 0.5) * answerRange,
              y_answer: (Math.random() - 0.5) * answerRange,
            });
            GradResetCamera();
          }}
        >
          新しいグラフにする
        </Button>
      </Box>
    </Grid>
  );
}
