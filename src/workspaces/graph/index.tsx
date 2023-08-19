import { useRef, useState } from "react";
import { Box, Grid } from "@chakra-ui/react";
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
  CUSTOM_COMMON_IF,
  CUSTOM_COMMON_IF_ELSE,
  CUSTOM_COMMON_WHILE,
  CUSTOM_COMMON_WHILE_TRUE,
} from "../../config/blockly.blocks";
import {
  CUSTOM_GRAPH_COLOUR_CHANGE,
  CUSTOM_GRAPH_STACK_PUSH,
  CUSTOM_GRAPH_STACK_POP,
  CUSTOM_GRAPH_NODE_CHILD_EXISTS,
  CUSTOM_GRAPH_STACK_INITIALIZE,
} from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import { TreeRenderer } from "./components/TreeRenderer";
import { StackRenderer } from "./components/StackRenderer";

const toolboxDefinition: BlocklyToolboxDefinition = {
  type: "flyout",
  blockTypes: [
    // 共有のブロック
    CUSTOM_COMMON_WHILE_TRUE,
    CUSTOM_COMMON_WHILE,
    CUSTOM_COMMON_IF,
    CUSTOM_COMMON_IF_ELSE,
    // ワークスペースごとに定義したブロック
    CUSTOM_GRAPH_COLOUR_CHANGE,
    CUSTOM_GRAPH_STACK_PUSH,
    CUSTOM_GRAPH_STACK_POP,
    CUSTOM_GRAPH_NODE_CHILD_EXISTS,
    CUSTOM_GRAPH_STACK_INITIALIZE,
  ],
};

export function GraphWorkspace(): JSX.Element {
  type Node = {
    id: string;
    value: string;
    leftChild: Node | null;
    rightChild: Node | null;
    visited: boolean;
  };

  type AllState = {
    rootNode: Node;
    currentNode: Node;
    stack: Node[];
  };

  const Node7: Node = {
    id: "7",
    value: "seven",
    leftChild: null,
    rightChild: null,
    visited: false,
  };

  const Node6: Node = {
    id: "6",
    value: "six",
    leftChild: null,
    rightChild: null,
    visited: false,
  };

  const Node5: Node = {
    id: "5",
    value: "five",
    leftChild: null,
    rightChild: null,
    visited: false,
  };

  const Node4: Node = {
    id: "4",
    value: "four",
    leftChild: null,
    rightChild: null,
    visited: false,
  };

  const Node3: Node = {
    id: "3",
    value: "three",
    leftChild: Node6,
    rightChild: Node7,
    visited: false,
  };

  const Node2: Node = {
    id: "2",
    value: "two",
    leftChild: Node4,
    rightChild: Node5,
    visited: false,
  };

  const Node1: Node = {
    id: "1",
    value: "one",
    leftChild: Node2,
    rightChild: Node3,
    visited: false,
  };

  // interpreter に渡す関数は実行開始時に決定されるため、通常の state だと最新の情報が参照できません
  // このため、反則ですが内部的に ref を用いて状態管理をしている react-use の [useGetSet](https://github.com/streamich/react-use/blob/master/docs/useGetSet.md) を用いています。
  const [getState, setState] = useGetSet<AllState>({
    rootNode: Node1,
    currentNode: Node1,
    stack: [Node1],
  });
  // setState(Node1);

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
    [CUSTOM_GRAPH_COLOUR_CHANGE]: () => {
      const { currentNode } = getState();
      currentNode.visited = true;
      const newState = { ...getState(), currentNode };
      setState(newState);
      // // GlobalFunction 内で BlocklyEditorMessage オブジェクトをスローすると「情報」スナックバーが表示され、実行が停止されます
      // if (newState >= 10) throw new BlocklyEditorMessage("10 になりました！");
      // // GlobalFunction 内で Error オブジェクトをスローすると「エラー」スナックバーが表示され、実行が停止されます
      // if (newState < 0) throw new Error("残念！ゼロを下回ってしまいました...");
    },
    [CUSTOM_GRAPH_STACK_PUSH]: (direction: "left" | "right") => {
      const { stack, currentNode } = getState();
      if (direction === "left") {
        if (currentNode.leftChild) {
          stack.push(currentNode.leftChild);
          const newState = {
            ...getState(),
            stack,
          };
          setState(newState);
        }
      } else if (direction === "right") {
        if (currentNode.rightChild) {
          stack.push(currentNode.rightChild);
          const newState = {
            ...getState(),
            stack,
          };
          setState(newState);
        }
      }
    },
    [CUSTOM_GRAPH_STACK_POP]: () => {
      const { stack } = getState();
      const currentNode = stack.pop();
      if (!currentNode)
        throw new BlocklyEditorMessage("すべての探索をクリアしました！");

      const newState: AllState = {
        ...getState(),
        stack,
        currentNode,
      };
      setState(newState);
    },
    [CUSTOM_GRAPH_STACK_INITIALIZE]: () => {
      const newState: AllState = {
        ...getState(),
        stack: [getState().rootNode],
      };
      setState(newState);
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
            setState({ ...getState() });
          }}
        />
        <TreeRenderer
          key={Node1.id}
          rootNode={getState().rootNode}
          currentNode={getState().currentNode}
        />
        <StackRenderer stack={getState().stack} />
      </Box>
    </Grid>
  );
}
