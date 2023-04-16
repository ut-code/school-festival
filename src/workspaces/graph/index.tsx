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
  type TNode = {
    value: string;
    leftChild: TNode | null;
    rightChild: TNode | null;
    colour?: string;
  };

  type AllState = {
    rootNode: TNode;
    currentTNode: TNode;
  };

  const TNode7: TNode = {
    value: "seven",
    leftChild: null,
    rightChild: null,
  };

  const TNode6: TNode = {
    value: "six",
    leftChild: null,
    rightChild: null,
  };

  const TNode5: TNode = {
    value: "five",
    leftChild: null,
    rightChild: null,
  };

  const TNode4: TNode = {
    value: "four",
    leftChild: null,
    rightChild: null,
  };

  const TNode3: TNode = {
    value: "three",
    leftChild: TNode6,
    rightChild: TNode7,
  };

  const TNode2: TNode = {
    value: "two",
    leftChild: TNode4,
    rightChild: TNode5,
  };

  const TNode1: TNode = {
    value: "one",
    leftChild: TNode2,
    rightChild: TNode3,
  };

  // interpreter に渡す関数は実行開始時に決定されるため、通常の state だと最新の情報が参照できません
  // このため、反則ですが内部的に ref を用いて状態管理をしている react-use の [useGetSet](https://github.com/streamich/react-use/blob/master/docs/useGetSet.md) を用いています。
  const [getState, setState] = useGetSet<AllState>({
    rootNode: TNode1,
    currentTNode: TNode1,
  });
  // setState(TNode1);

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
      const { currentTNode } = getState();
      currentTNode.colour = colour;
      const newState = { ...getState(), currentTNode };
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
        <TreeRenderer key={TNode1.colour} node={getState().rootNode} />
      </Box>
    </Grid>
  );
}
