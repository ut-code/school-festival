import { useRef, useState } from "react";
import { Box, Grid, Text } from "@chakra-ui/react";
import { useGetSet } from "react-use";
import {
  // BlocklyEditorMessage,
  useBlocklyInterpreter,
} from "../../commons/interpreter";
import { useBlocklyWorkspace } from "../../commons/blockly";
import {
  CUSTOM_COMMON_WHILE_TRUE,
  CUSTOM_COMMON_DO_UNTIL,
  CUSTOM_COMMON_IF,
  CUSTOM_COMMON_IF_ELSE,
  BUILTIN_LOGIC_COMPARE,
  BUILTIN_LOGIC_NEGATE,
  BUILTIN_LOGIC_OPERATION,
  BUILTIN_MATH_ARITHMETIC,
  BUILTIN_MATH_NUMBER,
} from "../../config/blockly.blocks";
import {
  CONSOLE_LOG,
  data,
  cluster,
  CUSTOM_KM_CLUSTER_I,
  CUSTOM_KM_SET_CENTER_OF_CLUSTER,
  CUSTOM_KM_CENTER_OF_CLUSTER,
  CUSTOM_KM_CALCULATE_CENTER_OF_CLUSTER,
  CUSTOM_KM_ADD_DATA_TO_ARRAY,
  CUSTOM_KM_DELETE_DATA_FROM_ARRAY,
  CUSTOM_KM_DISTANCE_BETWEEN_X_AND_Y,
  CUSTOM_KM_X_OF_DATA_IN_ARRAY,
  CUSTOM_KM_Y_OF_DATA_IN_ARRAY,
  CUSTOM_KM_DATA_IN_ARRAY,
  CUSTOM_KM_LENGTH_OF_ARRAY,
} from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import { SimulatorRenderer } from "./SimulatorRenderer";

const toolboxBlocks = [
  // 共有のブロック
  CUSTOM_COMMON_WHILE_TRUE,
  CUSTOM_COMMON_DO_UNTIL,
  CUSTOM_COMMON_IF,
  CUSTOM_COMMON_IF_ELSE,
  BUILTIN_LOGIC_COMPARE,
  BUILTIN_LOGIC_NEGATE,
  BUILTIN_LOGIC_OPERATION,
  BUILTIN_MATH_ARITHMETIC,
  BUILTIN_MATH_NUMBER,
  CONSOLE_LOG,
  // ワークスペースごとに定義したブロック
  CUSTOM_KM_CLUSTER_I,
  CUSTOM_KM_SET_CENTER_OF_CLUSTER,
  CUSTOM_KM_CENTER_OF_CLUSTER,
  CUSTOM_KM_CALCULATE_CENTER_OF_CLUSTER,
  CUSTOM_KM_ADD_DATA_TO_ARRAY,
  CUSTOM_KM_DELETE_DATA_FROM_ARRAY,
  CUSTOM_KM_DISTANCE_BETWEEN_X_AND_Y,
  CUSTOM_KM_X_OF_DATA_IN_ARRAY,
  CUSTOM_KM_Y_OF_DATA_IN_ARRAY,
  CUSTOM_KM_DATA_IN_ARRAY,
  CUSTOM_KM_LENGTH_OF_ARRAY,
];

type KmeansWorkspaceState = {
  listOfClusters: cluster[];
  centerOfClusters: { datas: data[] };
};

export function KmeansWorkspace(): JSX.Element {
  const N = 100;
  const K = 3;

  const clusters: cluster[] = [];

  for (let i = 0; i < K; i += 1) {
    clusters.push({
      datas: [],
      n: i,
    });
  }
  function RandomDatas(n: number): KmeansWorkspaceState {
    for (let i = 0; i < n; i += 1) {
      const x: number = Math.random() * N;
      const y: number = Math.random() * N;
      const c: number = Math.floor(Math.random() * K);
      clusters[c].datas.push({ x, y });
    }
    return {
      listOfClusters: clusters,
      centerOfClusters: { datas: [] },
    };
  }

  // interpreter に渡す関数は実行開始時に決定されるため、通常の state だと最新の情報が参照できません
  // このため、反則ですが内部的に ref を用いて状態管理をしている react-use の [useGetSet](https://github.com/streamich/react-use/blob/master/docs/useGetSet.md) を用いています。
  const [getState, setState] = useGetSet(RandomDatas(N));

  /* eslint-disable no-var */
  /* eslint-disable vars-on-top */
  // javascriptGenerator により生成されたコードから呼ばれる関数を定義します
  const globalFunctions = useRef({
    [CUSTOM_KM_CLUSTER_I]: (i: number) => {
      var currentState = getState();
      return currentState.listOfClusters[i];
    },
    [CUSTOM_KM_SET_CENTER_OF_CLUSTER]: (i: number, x: data) => {
      var currentState = getState();
      var newCenterOfClustersDatas = currentState.centerOfClusters.datas.map(
        (data_, index) => (index === i ? x : data_)
      );
      setState({
        ...currentState,
        centerOfClusters: { datas: newCenterOfClustersDatas },
      });
    },
    [CUSTOM_KM_CALCULATE_CENTER_OF_CLUSTER]: () => {
      for (let i = 0; i < K; i += 1) {
        var currentState = getState();
        var CLUSTER_X: number[] = currentState.listOfClusters[i].datas.map(
          (data_) => data_.x
        );
        var CLUSTER_Y: number[] = currentState.listOfClusters[i].datas.map(
          (data_) => data_.y
        );
        var avgX = 0;
        var avgY = 0;
        for (
          var j = 0;
          j < currentState.listOfClusters[i].datas.length;
          j += 1
        ) {
          avgX += CLUSTER_X[j];
          avgY += CLUSTER_Y[j];
        }
        avgX /= currentState.listOfClusters[i].datas.length;
        avgY /= currentState.listOfClusters[i].datas.length;
        setState({
          ...currentState,
          centerOfClusters: {
            datas: currentState.centerOfClusters.datas.concat({
              x: avgX,
              y: avgY,
            }),
          },
        });
      }
    },
    [CUSTOM_KM_CENTER_OF_CLUSTER]: (cluster_: cluster) => {
      var currentState = getState();
      return currentState.centerOfClusters.datas[cluster_.n];
    },
    [CUSTOM_KM_ADD_DATA_TO_ARRAY]: (a: cluster, x: data) => {
      var currentState = getState();
      var newListOfClusters = currentState.listOfClusters.map((cluster_) =>
        cluster_.n === a.n
          ? { datas: cluster_.datas.concat(x), n: cluster_.n }
          : cluster_
      );
      setState({
        ...currentState,
        listOfClusters: newListOfClusters,
      });
    },
    [CUSTOM_KM_DELETE_DATA_FROM_ARRAY]: (a: cluster, i: number) => {
      var currentState = getState();
      var newListOfClusters = currentState.listOfClusters.map((cluster_) =>
        cluster_.n === a.n
          ? {
              datas: cluster_.datas
                .slice(0, i)
                .concat(cluster_.datas.slice(i + 1)),
              n: cluster_.n,
            }
          : cluster_
      );
      setState({
        ...currentState,
        listOfClusters: newListOfClusters,
      });
    },
    [CUSTOM_KM_DATA_IN_ARRAY]: (a: cluster, i: number) => {
      return a.datas[i];
    },
    [CUSTOM_KM_DISTANCE_BETWEEN_X_AND_Y]: (data1: data, data2: data) => {
      return Math.sqrt((data1.x - data2.x) ** 2 + (data1.y - data2.y) ** 2);
    },
    [CUSTOM_KM_X_OF_DATA_IN_ARRAY]: (a: cluster, i: number) => {
      return a.datas[i].x;
    },
    [CUSTOM_KM_Y_OF_DATA_IN_ARRAY]: (a: cluster, i: number) => {
      return a.datas[i].y;
    },
    [CUSTOM_KM_LENGTH_OF_ARRAY]: (a: cluster) => {
      return a.datas.length;
    },
  }).current;

  const [interval, setInterval] = useState(500);
  const { workspaceAreaRef, highlightBlock, getCode } = useBlocklyWorkspace({
    toolboxDefinition: {
      type: "category",
      categories: [{ name: "基本", blockTypes: toolboxBlocks }],
      enableVariables: true,
    },
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
            setState(RandomDatas(N));
          }}
        />
        <button
          type="button"
          onClick={() => {
            setState(RandomDatas(N));
          }}
        >
          (再配置)
        </button>
        <SimulatorRenderer clusters={getState().listOfClusters} />

        <Text>
          0x{" "}
          {getState().centerOfClusters.datas[0]
            ? getState().centerOfClusters.datas[0].x
            : 0}
        </Text>
        <Text>
          0y{" "}
          {getState().centerOfClusters.datas[0]
            ? getState().centerOfClusters.datas[0].y
            : 0}
        </Text>
        <Text>
          1x{" "}
          {getState().centerOfClusters.datas[1]
            ? getState().centerOfClusters.datas[1].x
            : 0}
        </Text>
        <Text>
          1y{" "}
          {getState().centerOfClusters.datas[1]
            ? getState().centerOfClusters.datas[1].y
            : 0}
        </Text>
        <Text>
          2x{" "}
          {getState().centerOfClusters.datas[2]
            ? getState().centerOfClusters.datas[2].x
            : 0}
        </Text>
        <Text>
          2y{" "}
          {getState().centerOfClusters.datas[2]
            ? getState().centerOfClusters.datas[2].y
            : 0}
        </Text>
      </Box>
    </Grid>
  );
}
