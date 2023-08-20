import { useEffect, useRef, useState } from "react";
import { Box, Grid } from "@chakra-ui/react";
import { useGetSet } from "react-use";
import Draggable from "react-draggable";
import * as _ from "lodash";
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
import { StackRenderer } from "./components/StackRenderer";
import { TreeRenderer } from "./components/TreeRenderer";
import { type Node } from "./components/common/types";
import { QueueRenderer } from "./components/QueueRenderer";

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
    parent: Node | null;
    leftChild: Node | null;
    rightChild: Node | null;
    visited: boolean;
    current: boolean;
  };

  type AllState = {
    rootNode: Node;
    currentNode: Node;
    stack: Node[];
    index: number;
  };

  const Node8: Node = {
    id: "8",
    value: "4",
    parent: null,
    leftChild: null,
    rightChild: null,
    visited: false,
    current: false,
  };

  const Node7: Node = {
    id: "7",
    value: "8",
    parent: null,
    leftChild: null,
    rightChild: null,
    visited: false,
    current: false,
  };

  const Node6: Node = {
    id: "6",
    value: "7",
    parent: null,
    leftChild: null,
    rightChild: null,
    visited: false,
    current: false,
  };

  const Node5: Node = {
    id: "5",
    value: "5",
    parent: null,
    leftChild: null,
    rightChild: null,
    visited: false,
    current: false,
  };

  const Node4: Node = {
    id: "4",
    value: "3",
    parent: null,
    leftChild: null,
    rightChild: null,
    visited: false,
    current: false,
  };

  const Node3: Node = {
    id: "3",
    value: "6",
    parent: null,
    leftChild: null,
    rightChild: null,
    visited: false,
    current: false,
  };

  const Node2: Node = {
    id: "2",
    value: "2",
    parent: null,
    leftChild: null,
    rightChild: null,
    visited: false,
    current: false,
  };

  const Node1: Node = {
    id: "1",
    value: "1",
    parent: null,
    leftChild: null,
    rightChild: null,
    visited: false,
    current: false,
  };

  Node2.parent = Node1;
  Node3.parent = Node1;
  Node4.parent = Node2;
  Node5.parent = Node2;
  Node6.parent = Node3;
  Node7.parent = Node3;
  Node8.parent = Node4;

  Node1.leftChild = Node2;
  Node1.rightChild = Node3;
  Node2.leftChild = Node4;
  Node2.rightChild = Node5;
  Node3.leftChild = Node6;
  Node3.rightChild = Node7;
  Node4.leftChild = Node8;

  const clonedRootNode = _.cloneDeep(Node1);

  // interpreter に渡す関数は実行開始時に決定されるため、通常の state だと最新の情報が参照できません
  // このため、反則ですが内部的に ref を用いて状態管理をしている react-use の [useGetSet](https://github.com/streamich/react-use/blob/master/docs/useGetSet.md) を用いています。
  const [getState, setState] = useGetSet<AllState>({
    rootNode: clonedRootNode,
    currentNode: clonedRootNode,
    stack: [clonedRootNode],
    index: 1,
  });

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
      const { stack, index } = getState();
      const currentNode = stack.pop();
      if (!currentNode)
        throw new BlocklyEditorMessage("すべての探索をクリアしました！");
      currentNode.current = true;
      currentNode.value = index.toString();

      const newState: AllState = {
        ...getState(),
        stack,
        currentNode,
        index: index + 1,
      };
      setState(newState);
    },
    [CUSTOM_GRAPH_STACK_INITIALIZE]: () => {
      const newClonedRootNode = _.cloneDeep(clonedRootNode);
      const newState: AllState = {
        ...getState(),
        rootNode: newClonedRootNode,
        stack: [newClonedRootNode],
        currentNode: newClonedRootNode,
        index: 1,
      };
      setState(newState);
      // initializeNode({ node: getState().rootNode });
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

  const parentRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState<{
    x: number | null;
    y: number | null;
  }>({
    x: null,
    y: null,
  });

  useEffect(() => {
    function updateCoordinates() {
      if (parentRef.current) {
        const rect = parentRef.current.getBoundingClientRect();
        setCoordinates({ x: rect.x, y: rect.y });
      }
    }
    // 初期の座標を設定
    updateCoordinates();
    // resizeイベントのリスナーを設定
    // window.addEventListener("resize", updateCoordinates);
    // コンポーネントのアンマウント時にリスナーを削除
    // return () => {
    //   window.removeEventListener("resize", updateCoordinates);
    // };
  }, []);

  return (
    <Grid h="100%" templateColumns="1fr 25rem">
      <div ref={workspaceAreaRef} />
      <Box p={4} ref={parentRef}>
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
        {coordinates.x && coordinates.y && (
          <TreeRenderer
            coordinateX={coordinates.x}
            coordinateY={coordinates.y}
            rootNode={getState().rootNode}
          />
        )}
        <Draggable>
          <div>
            <StackRenderer stack={getState().stack} />
          </div>
        </Draggable>
      </Box>
    </Grid>
  );
}
