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
  CUSTOM_QL_DIRECTION,
  CUSTOM_QL_IS_GOAL,
  CUSTOM_QL_IS_WALL,
  CUSTOM_QL_MOVE,
  CUSTOM_QL_MOVE_RANDOM,
  CUSTOM_QL_MOVE_TO_START,
  CUSTOM_QL_PRESENT_COL,
  CUSTOM_QL_PRESENT_ROW,
  CUSTOM_QL_QVALUE,
  CUSTOM_QL_QVALUE_UPDATE,
  CUSTOM_TEMPLATE_INCREMENT,
} from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import {
  BUILTIN_LOGIC_COMPARE,
  BUILTIN_LOGIC_NEGATE,
  BUILTIN_MATH_NUMBER,
  CUSTOM_COMMON_WHILE_TRUE,
  BUILTIN_MATH_ARITHMETIC,
  BUILTIN_LOGIC_OPERATION,
  CUSTOM_COMMON_IF_ELSE,
  CUSTOM_COMMON_IF,
  CUSTOM_COMMON_DO_UNTIL,
} from "../../config/blockly.blocks";

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
        CUSTOM_COMMON_IF,
        CUSTOM_COMMON_IF_ELSE,
        CUSTOM_COMMON_DO_UNTIL,
      ],
    },
    {
      name: "迷路探索",
      blockTypes: [
        CUSTOM_QL_DIRECTION,
        CUSTOM_QL_IS_WALL,
        CUSTOM_QL_PRESENT_ROW,
        CUSTOM_QL_PRESENT_COL,
        CUSTOM_QL_IS_GOAL,
        CUSTOM_QL_MOVE,
        CUSTOM_QL_MOVE_RANDOM,
        CUSTOM_QL_MOVE_TO_START,
        CUSTOM_QL_QVALUE,
        CUSTOM_QL_QVALUE_UPDATE,
      ],
    },
  ],
  enableVariables: true,
};

export function QlearningWorkspace(): JSX.Element {
  // interpreter に渡す関数は実行開始時に決定されるため、通常の state だと最新の情報が参照できません
  // このため、反則ですが内部的に ref を用いて状態管理をしている react-use の [useGetSet](https://github.com/streamich/react-use/blob/master/docs/useGetSet.md) を用いています。
  const [getState, setState] = useGetSet(0);

  // javascriptGenerator により生成されたコードから呼ばれる関数を定義します
  const globalFunctions = useRef({
    [CUSTOM_TEMPLATE_INCREMENT]: (value: number) => {
      const currentState = getState();
      const newState = currentState + value;
      setState(newState);
      // GlobalFunction 内で BlocklyEditorMessage オブジェクトをスローすると「情報」スナックバーが表示され、実行が停止されます
      if (newState >= 10) throw new BlocklyEditorMessage("10 になりました！");
      // GlobalFunction 内で Error オブジェクトをスローすると「エラー」スナックバーが表示され、実行が停止されます
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
