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
import { CUSTOM_COMMON_WHILE_TRUE } from "../../config/blockly.blocks";
import { CUSTOM_TEMPLATE_INCREMENT } from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import { GraphRenderer } from "./components/GraphRenderer/index";

export type MyNode = { value: string; children: [MyNode] | null };

const toolboxDefinition: BlocklyToolboxDefinition = {
  type: "flyout",
  blockTypes: [
    // 共有のブロック
    CUSTOM_COMMON_WHILE_TRUE,
    // ワークスペースごとに定義したブロック
    CUSTOM_TEMPLATE_INCREMENT,
  ],
};

export function GraphWorkspace(): JSX.Element {
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

  const node7: MyNode = { value: "seven", children: null };
  const node6: MyNode = { value: "six", children: null };
  const node5: MyNode = { value: "five", children: null };
  const node4: MyNode = { value: "four", children: null };
  const node3: MyNode = { value: "three", children: [node6, node7] };
  const node2: MyNode = { value: "two", children: [node3, node4] };
  const node1: MyNode = { value: "one", children: [node2, node3] };

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
        {/* write code to show tree structured node */}
        <GraphRenderer node={node1} level={0} />
      </Box>
    </Grid>
  );
}
