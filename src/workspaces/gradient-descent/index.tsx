import { useRef, useState } from "react";
import { Box, Grid, Text, Button, Icon } from "@chakra-ui/react";
import { useGetSet } from "react-use";
import { RiRestartLine } from "react-icons/ri";
import {
  useBlocklyInterpreter,
  BlocklyEditorMessage,
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
  CUSTOM_GRAD_OBJECTIVE,
  CUSTOM_GRAD_SET_X,
  CUSTOM_GRAD_SET_Y,
  CUSTOM_GRAD_X_VALUE,
  CUSTOM_GRAD_Y_VALUE,
} from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import { GradRenderer } from "./components/GradRenderer";

import { maxHeight, objectiveFunction } from "./objective";

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
  xAnswer: number;
  yAnswer: number;
};

const initialX = 0;
const initialY = 0;
const answerRange = 500;

function createDefaultState() {
  return {
    x: initialX,
    y: initialY,
    xAnswer: (Math.random() - 0.5) * answerRange,
    yAnswer: (Math.random() - 0.5) * answerRange,
  };
}

function isConvergence(state: GradWorkspaceState) {
  const threshold = maxHeight - 1;
  if (
    objectiveFunction(state.x, state.y, state.xAnswer, state.yAnswer) >
    threshold
  ) {
    throw new BlocklyEditorMessage("最も高い点に到達しました！");
  }
}

export function GradWorkspace(): JSX.Element {
  // interpreter に渡す関数は実行開始時に決定されるため、通常の state だと最新の情報が参照できません
  // このため、反則ですが内部的に ref を用いて状態管理をしている react-use の [useGetSet](https://github.com/streamich/react-use/blob/master/docs/useGetSet.md) を用いています。
  const [getState, setState] = useGetSet(createDefaultState());

  // javascriptGenerator により生成されたコードから呼ばれる関数を定義します
  const globalFunctions = useRef({
    [CUSTOM_GRAD_OBJECTIVE]: (x: number, y: number) => {
      const state = getState();
      return objectiveFunction(x, y, state.xAnswer, state.yAnswer);
    },
    [CUSTOM_GRAD_SET_X]: (newX: number) => {
      const state = getState();
      if (objectiveFunction(newX, state.y, state.xAnswer, state.yAnswer) < 0) {
        throw new Error("山から下りてしまいました。");
      }
      setState({ ...state, x: newX });
      isConvergence(getState());
    },
    [CUSTOM_GRAD_SET_Y]: (newY: number) => {
      const state = getState();
      if (objectiveFunction(state.x, newY, state.xAnswer, state.yAnswer) < 0) {
        throw new Error("山から下りてしまいました。");
      }
      setState({ ...state, y: newY });
      isConvergence(getState());
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
        <Box mb={3}>
          <GradRenderer
            x={getState().x}
            y={getState().y}
            xAnswer={getState().xAnswer}
            yAnswer={getState().yAnswer}
          />
        </Box>
        <Button
          leftIcon={<Icon as={RiRestartLine} />}
          onClick={() => {
            setState({
              ...getState(),
              xAnswer: (Math.random() - 0.5) * answerRange,
              yAnswer: (Math.random() - 0.5) * answerRange,
            });
          }}
        >
          新しい山にする
        </Button>
      </Box>
    </Grid>
  );
}
