import { useRef, useState } from "react";
import { Box, Grid } from "@chakra-ui/react";
import { useGetSet } from "react-use";
import { useBlocklyInterpreter } from "../../commons/interpreter";
import {
  BlocklyToolboxDefinition,
  useBlocklyWorkspace,
} from "../../commons/blockly";
import { CUSTOM_COMMON_WHILE_TRUE } from "../../config/blockly.blocks";
import { CUSTOM_GRAPH_COLOUR_CHANGE } from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import { TreeRenderer } from "./components/TreeRenderer";
import { StackRenderer } from "./components/StackRenderer";

const toolboxDefinition: BlocklyToolboxDefinition = {
  type: "flyout",
  blockTypes: [
    // 共有のブロック
    CUSTOM_COMMON_WHILE_TRUE,
    // ワークスペースごとに定義したブロック
    CUSTOM_GRAPH_COLOUR_CHANGE,
  ],
};

export function GraphWorkspace(): JSX.Element {
  type tNode = {
    value: string;
    leftChild: tNode | null;
    rightChild: tNode | null;
    colour?: string;
  };

  const tNode7: tNode = {
    value: "seven",
    leftChild: null,
    rightChild: null,
  };

  const tNode6: tNode = {
    value: "six",
    leftChild: null,
    rightChild: null,
  };

  const tNode5: tNode = {
    value: "five",
    leftChild: null,
    rightChild: null,
  };

  const tNode4: tNode = {
    value: "four",
    leftChild: null,
    rightChild: null,
  };

  const tNode3: tNode = {
    value: "three",
    leftChild: tNode6,
    rightChild: tNode7,
  };

  const tNode2: tNode = {
    value: "two",
    leftChild: tNode4,
    rightChild: tNode5,
  };

  const tNode1: tNode = {
    value: "one",
    leftChild: tNode2,
    rightChild: tNode3,
  };

  // interpreter に渡す関数は実行開始時に決定されるため、通常の state だと最新の情報が参照できません
  // このため、反則ですが内部的に ref を用いて状態管理をしている react-use の [useGetSet](https://github.com/streamich/react-use/blob/master/docs/useGetSet.md) を用いています。
  const [getState, setState] = useGetSet<tNode>(tNode1);
  // setState(tNode1);

  // javascriptGenerator により生成されたコードから呼ばれる関数を定義します
  const globalFunctions = useRef({
    // [CUSTOM_TEMPLATE_INCREMENT]: (value: number) => {
    //   const currentState = getState();
    //   const newState = currentState + value;
    //   setState(newState);
    //   // GlobalFunction 内で BlocklyEditorMessage オブジェクトをスローすると「情報」スナックバーが表示され、実行が停止されます
    //   if (newState >= 10) throw new BlocklyEditorMessage("10 になりました！");
    //   // GlobalFunction 内で Error オブジェクトをスローすると「エラー」スナックバーが表示され、実行が停止されます
    //   if (newState < 0) throw new Error("残念！ゼロを下回ってしまいました...");
    // },
    [CUSTOM_GRAPH_COLOUR_CHANGE]: (colour: "red" | "blue") => {
      const currentState = getState();
      const newState = { ...currentState, colour };
      setState(newState);
      // // GlobalFunction 内で BlocklyEditorMessage オブジェクトをスローすると「情報」スナックバーが表示され、実行が停止されます
      // if (newState >= 10) throw new BlocklyEditorMessage("10 になりました！");
      // // GlobalFunction 内で Error オブジェクトをスローすると「エラー」スナックバーが表示され、実行が停止されます
      // if (newState < 0) throw new Error("残念！ゼロを下回ってしまいました...");
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

  const stack: string[] = ["a", "b", "c"];

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
            setState({ ...getState() });
          }}
        />
        <StackRenderer stack={stack} />
        <TreeRenderer key={tNode1.colour} node={getState()} />
      </Box>
    </Grid>
  );
}
