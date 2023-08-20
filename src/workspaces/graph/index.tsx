import { useEffect, useRef, useState } from "react";
import { Box, Grid, HStack } from "@chakra-ui/react";
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
import { CUSTOM_COMMON_WHILE_TRUE } from "../../config/blockly.blocks";
import {
  CUSTOM_GRAPH_COLOUR_CHANGE,
  CUSTOM_GRAPH_STACK_PUSH,
  CUSTOM_GRAPH_STACK_POP,
  CUSTOM_GRAPH_INITIALIZE,
  CUSTOM_GRAPH_QUEUE_ENQUE,
  CUSTOM_GRAPH_QUEUE_DEQUE,
} from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import { StackRenderer } from "./components/StackRenderer";
import { TreeRenderer } from "./components/TreeRenderer";
import { type Node } from "./components/common/types";
import { QueueRenderer } from "./components/QueueRenderer";
import { allNodeIsVisited } from "./components/common/utils";
import dfsPreorderTraversalNode from "./components/common/DfsPreorderTraversalTree";
import bfsTraversalNode from "./components/common/BfsTraversalTree";

const toolboxDefinition: BlocklyToolboxDefinition = {
  type: "flyout",
  blockTypes: [
    // 共有のブロック
    CUSTOM_COMMON_WHILE_TRUE,
    // CUSTOM_COMMON_WHILE,
    // CUSTOM_COMMON_IF,
    // CUSTOM_COMMON_IF_ELSE,
    // ワークスペースごとに定義したブロック
    CUSTOM_GRAPH_COLOUR_CHANGE,
    CUSTOM_GRAPH_STACK_PUSH,
    CUSTOM_GRAPH_STACK_POP,
    CUSTOM_GRAPH_QUEUE_ENQUE,
    CUSTOM_GRAPH_QUEUE_DEQUE,
    CUSTOM_GRAPH_INITIALIZE,
  ],
};

export function GraphWorkspace(): JSX.Element {
  type AllState = {
    rootNode: Node;
    currentNode: Node | null;
    stack: Node[];
    queue: Node[];
    index: number;
  };

  const initialBfsTraversalNode = _.cloneDeep(bfsTraversalNode);
  const initialDfsPreorderTraversalNode = _.cloneDeep(dfsPreorderTraversalNode);

  const clonedBfsTraversalRootNode = _.cloneDeep(initialBfsTraversalNode);

  // interpreter に渡す関数は実行開始時に決定されるため、通常の state だと最新の情報が参照できません
  // このため、反則ですが内部的に ref を用いて状態管理をしている react-use の [useGetSet](https://github.com/streamich/react-use/blob/master/docs/useGetSet.md) を用いています。
  const [getState, setState] = useGetSet<AllState>({
    rootNode: clonedBfsTraversalRootNode,
    currentNode: null,
    stack: [clonedBfsTraversalRootNode],
    queue: [clonedBfsTraversalRootNode],
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
      if (!currentNode)
        throw new BlocklyEditorMessage("nodeが選択されていません!");
      currentNode.visited = true;
      const newState = { ...getState(), currentNode };
      setState(newState);
      // // GlobalFunction 内で BlocklyEditorMessage オブジェクトをスローすると「情報」スナックバーが表示され、実行が停止されます
      // if (newState >= 10) throw new BlocklyEditorMessage("10 になりました！");
      // // GlobalFunction 内で Error オブジェクトをスローすると「エラー」スナックバーが表示され、実行が停止されます
      // if (newState < 0) throw new Error("残念！ゼロを下回ってしまいました...");
    },
    [CUSTOM_GRAPH_STACK_PUSH]: (direction: "left" | "right" | "self") => {
      const { stack, currentNode } = getState();
      if (direction === "left" && currentNode) {
        if (currentNode.leftChild) {
          stack.push(currentNode.leftChild);
          const newState = {
            ...getState(),
            stack,
          };
          setState(newState);
        }
      } else if (direction === "right" && currentNode) {
        if (currentNode.rightChild) {
          stack.push(currentNode.rightChild);
          const newState = {
            ...getState(),
            stack,
          };
          setState(newState);
        }
      } else if (currentNode) {
        stack.push(currentNode);
        const newState = {
          ...getState(),
          stack,
        };
        setState(newState);
      }
    },
    [CUSTOM_GRAPH_STACK_POP]: () => {
      const { rootNode, stack, index } = getState();
      const currentNode = stack.pop();
      if (allNodeIsVisited({ node: rootNode }))
        throw new BlocklyEditorMessage("すべての探索をクリアしました！");
      if (!currentNode) {
        throw new BlocklyEditorMessage("Stackが空になりました！");
      }
      currentNode.value = index.toString();

      const newState = {
        ...getState(),
        stack,
        currentNode,
        index: index + 1,
      };
      setState(newState);
    },
    [CUSTOM_GRAPH_QUEUE_ENQUE]: (direction: "left" | "right" | "self") => {
      const { queue, currentNode } = getState();
      if (direction === "left" && currentNode) {
        if (currentNode.leftChild) {
          queue.push(currentNode.leftChild);
          const newState = {
            ...getState(),
            queue,
          };
          setState(newState);
        }
      } else if (direction === "right" && currentNode) {
        if (currentNode.rightChild) {
          queue.push(currentNode.rightChild);
        } else if (currentNode) {
          queue.push(currentNode);
          const newState = {
            ...getState(),
            queue,
          };
          setState(newState);
        }
      }
    },
    [CUSTOM_GRAPH_QUEUE_DEQUE]: () => {
      const { rootNode, queue, index } = getState();
      const currentNode = queue.shift();
      if (allNodeIsVisited({ node: rootNode }))
        throw new BlocklyEditorMessage("すべての探索をクリアしました！");
      if (!currentNode) {
        throw new BlocklyEditorMessage("Queueが空になりました！");
      }
      currentNode.value = index.toString();

      const newState = {
        ...getState(),
        queue,
        currentNode,
        index: index + 1,
      };
      setState(newState);
    },
    [CUSTOM_GRAPH_INITIALIZE]: (
      problem: "DfsPreorderTraversal" | "BfsTraversal"
    ) => {
      let clonedRootNode: Node;
      if (problem === "DfsPreorderTraversal") {
        clonedRootNode = _.cloneDeep(initialDfsPreorderTraversalNode);
        const newState = {
          rootNode: clonedRootNode,
          stack: [clonedRootNode],
          queue: [clonedRootNode],
          currentNode: null,
          index: 1,
        };
        setState(newState);
      } else if (problem === "BfsTraversal") {
        clonedRootNode = _.cloneDeep(initialBfsTraversalNode);
        const newState = {
          rootNode: clonedRootNode,
          stack: [clonedRootNode],
          queue: [clonedRootNode],
          currentNode: null,
          index: 1,
          index: 1,
        };
        setState(newState);
      }
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
            currentNodeId={getState().currentNode?.id || "_"}
          />
        )}
        <HStack marginLeft={5} marginTop={360} spacing={20}>
          <Draggable>
            <div>
              <StackRenderer stack={getState().stack} />
            </div>
          </Draggable>
          <Draggable>
            <div>
              <QueueRenderer queue={getState().queue} />
            </div>
          </Draggable>
        </HStack>
      </Box>
    </Grid>
  );
}
