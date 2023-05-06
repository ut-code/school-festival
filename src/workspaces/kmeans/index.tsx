import { useCallback, useRef, useState } from "react";
import { Box, Grid, Text } from "@chakra-ui/react";
import { useGetSet } from "react-use";
import { Vector2D, Cluster } from "./types";
import {
  // BlocklyEditorMessage,
  useBlocklyInterpreter,
} from "../../commons/interpreter";
import {
  BlocklyToolboxDefinition,
  useBlocklyWorkspace,
} from "../../commons/blockly";
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
  CUSTOM_KM_CLUSTER_I,
  CUSTOM_KM_SET_CENTER_OF_CLUSTER,
  CUSTOM_KM_CENTER_OF_CLUSTER,
  CUSTOM_KM_CALCULATE_CENTER_OF_CLUSTER,
  CUSTOM_KM_ADD_DATA_TO_ARRAY,
  CUSTOM_KM_DELETE_DATA_FROM_ARRAY,
  CUSTOM_KM_DISTANCE_BETWEEN_X_AND_Y,
  CUSTOM_KM_X_OF_DATA_IN_ARRAY,
  CUSTOM_KM_Y_OF_DATA_IN_ARRAY,
  CUSTOM_KM_DATA_X_Y,
  CUSTOM_KM_DATA_IN_ARRAY,
  CUSTOM_KM_LENGTH_OF_ARRAY,
} from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import { SimulatorRenderer } from "./SimulatorRenderer";
import VariableList from "../../components/VariableList";

const toolboxDefinition: BlocklyToolboxDefinition = {
  type: "category",
  categories: [
    {
      name: "基本",
      blockTypes: [
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
        // ワークスペースごとに定義したブロック
        CUSTOM_KM_CLUSTER_I,
        CUSTOM_KM_CENTER_OF_CLUSTER,
        CUSTOM_KM_ADD_DATA_TO_ARRAY,
        CUSTOM_KM_DELETE_DATA_FROM_ARRAY,
        CUSTOM_KM_DATA_IN_ARRAY,
        CUSTOM_KM_LENGTH_OF_ARRAY,
        CUSTOM_KM_SET_CENTER_OF_CLUSTER,
        CUSTOM_KM_X_OF_DATA_IN_ARRAY,
        CUSTOM_KM_Y_OF_DATA_IN_ARRAY,
        CUSTOM_KM_DATA_X_Y,
      ],
    },
    {
      name: "お助け",
      blockTypes: [
        CUSTOM_KM_CALCULATE_CENTER_OF_CLUSTER,
        CUSTOM_KM_DISTANCE_BETWEEN_X_AND_Y,
      ],
    },
  ],
  enableVariables: true,
};

type KmeansWorkspaceState = {
  clusterList: Cluster[];
  centerList: { vectors: Vector2D[] };
  distanceCalculated: { vector1: Vector2D; vector2: Vector2D }[];
};

export function KmeansWorkspace(): JSX.Element {
  const DATA_COUNT = 50;
  const CLUSTER_COUNT = 3;

  function normalDistribution() {
    const value =
      Math.sqrt(-2 * Math.log(1 - Math.random())) *
      Math.cos(2 * Math.PI * Math.random());
    return value;
  }

  function RandomDatas(n: number): KmeansWorkspaceState {
    const clusters: Cluster[] = [];
    for (let i = 0; i < CLUSTER_COUNT; i += 1) {
      clusters.push({
        vectors: [],
        clusterNumber: i,
      });
    }
    const randomMean = [
      [Math.random(), Math.random()],
      [Math.random(), Math.random()],
      [Math.random(), Math.random()],
    ];
    for (let i = 0; i < n; i += 1) {
      const clusterNum: number = Math.floor(Math.random() * CLUSTER_COUNT);
      const x = normalDistribution() * 20 + randomMean[clusterNum][0] * 100;
      const y = normalDistribution() * 20 + randomMean[clusterNum][1] * 100;
      clusters[clusterNum].vectors.push({ x, y });
    }
    const x: Vector2D = { x: 0, y: 0 };
    return {
      clusterList: clusters,
      centerList: { vectors: [x, x, x] },
      distanceCalculated: [],
    };
  }

  // interpreter に渡す関数は実行開始時に決定されるため、通常の state だと最新の情報が参照できません
  // このため、反則ですが内部的に ref を用いて状態管理をしている react-use の [useGetSet](https://github.com/streamich/react-use/blob/master/docs/useGetSet.md) を用いています。
  const [getState, setState] = useGetSet(RandomDatas(DATA_COUNT));
  const [variableNames, setVariableNames] = useState<string[]>([]);

  // javascriptGenerator により生成されたコードから呼ばれる関数を定義します
  const globalFunctions = useRef({
    [CUSTOM_KM_CLUSTER_I]: (i: number) => {
      const currentState = getState();
      return currentState.clusterList[i];
    },
    [CUSTOM_KM_SET_CENTER_OF_CLUSTER]: (index_: number, x: Vector2D) => {
      const currentState = getState();
      const newCenterOfClustersDatas = currentState.centerList.vectors.map(
        (vector_, index) => (index === index_ ? x : vector_)
      );
      setState({
        ...currentState,
        centerList: { vectors: newCenterOfClustersDatas },
      });
    },
    [CUSTOM_KM_CALCULATE_CENTER_OF_CLUSTER]: () => {
      const currentStateStart = getState();
      setState({
        ...currentStateStart,
        centerList: { vectors: [] },
      });
      for (let i = 0; i < CLUSTER_COUNT; i += 1) {
        const currentState = getState();
        const xInCluster: number[] = currentState.clusterList[i].vectors.map(
          (vector_) => vector_.x
        );
        const yInCluster: number[] = currentState.clusterList[i].vectors.map(
          (vector_) => vector_.y
        );
        let avgX = 0;
        let avgY = 0;
        for (
          let j = 0;
          j < currentState.clusterList[i].vectors.length;
          j += 1
        ) {
          avgX += xInCluster[j];
          avgY += yInCluster[j];
        }
        avgX /= currentState.clusterList[i].vectors.length;
        avgY /= currentState.clusterList[i].vectors.length;
        setState({
          ...currentState,
          centerList: {
            vectors: currentState.centerList.vectors.concat({
              x: avgX,
              y: avgY,
            }),
          },
        });
      }
    },
    [CUSTOM_KM_CENTER_OF_CLUSTER]: (cluster_: Cluster) => {
      const currentState = getState();
      return currentState.centerList.vectors[cluster_.clusterNumber];
    },
    [CUSTOM_KM_ADD_DATA_TO_ARRAY]: (array: Cluster, vector_: Vector2D) => {
      const currentState = getState();
      const newListOfClusters = currentState.clusterList.map((cluster_) =>
        cluster_.clusterNumber === array.clusterNumber
          ? {
              vectors: cluster_.vectors.concat(vector_),
              clusterNumber: cluster_.clusterNumber,
            }
          : cluster_
      );
      setState({
        ...currentState,
        clusterList: newListOfClusters,
      });
    },
    [CUSTOM_KM_DELETE_DATA_FROM_ARRAY]: (array: Cluster, index_: number) => {
      const currentState = getState();
      const newListOfClusters = currentState.clusterList.map((cluster_) =>
        cluster_.clusterNumber === array.clusterNumber
          ? {
              vectors: cluster_.vectors
                .slice(0, index_)
                .concat(cluster_.vectors.slice(index_ + 1)),
              clusterNumber: cluster_.clusterNumber,
            }
          : cluster_
      );
      setState({
        ...currentState,
        clusterList: newListOfClusters,
      });
    },
    [CUSTOM_KM_DATA_IN_ARRAY]: (array: Cluster, i: number) => {
      return array.vectors[i];
    },
    [CUSTOM_KM_DISTANCE_BETWEEN_X_AND_Y]: (
      vector1: Vector2D,
      vector2: Vector2D
    ) => {
      const currentState = getState();
      const newDistanceCalculated = currentState.distanceCalculated.concat({
        vector1,
        vector2,
      });
      setState({
        ...currentState,
        distanceCalculated: newDistanceCalculated,
      });
      return Math.sqrt(
        (vector1.x - vector2.x) ** 2 + (vector1.y - vector2.y) ** 2
      );
    },
    [CUSTOM_KM_X_OF_DATA_IN_ARRAY]: (array: Cluster, i: number) => {
      return array.vectors[i].x;
    },
    [CUSTOM_KM_Y_OF_DATA_IN_ARRAY]: (array: Cluster, i: number) => {
      return array.vectors[i].y;
    },
    [CUSTOM_KM_DATA_X_Y]: (x: number, y: number) => {
      return { x, y };
    },
    [CUSTOM_KM_LENGTH_OF_ARRAY]: (array: Cluster) => {
      return array.vectors.length;
    },
  }).current;

  const [interval, setInterval] = useState(500);
  const { workspaceAreaRef, highlightBlock, getCode } = useBlocklyWorkspace({
    toolboxDefinition,
    onCodeChange: useCallback((_: unknown, newVariableNames: string[]) => {
      setVariableNames(newVariableNames);
    }, []),
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
            setState(RandomDatas(DATA_COUNT));
          }}
        />
        <button
          type="button"
          onClick={() => {
            setState(RandomDatas(DATA_COUNT));
          }}
        >
          (再配置)
        </button>
        <VariableList
          interpreter={interpreter}
          variableNames={variableNames}
          renderVariable={() => {
            return undefined;
          }}
        />
        <SimulatorRenderer
          clusters={getState().clusterList}
          lines={getState().distanceCalculated}
          centers={getState().centerList}
        />

        <Text>
          0x{" "}
          {getState().centerList.vectors[0]
            ? getState().centerList.vectors[0].x
            : 0}
        </Text>
        <Text>
          0y{" "}
          {getState().centerList.vectors[0]
            ? getState().centerList.vectors[0].y
            : 0}
        </Text>
        <Text>
          1x{" "}
          {getState().centerList.vectors[1]
            ? getState().centerList.vectors[1].x
            : 0}
        </Text>
        <Text>
          1y{" "}
          {getState().centerList.vectors[1]
            ? getState().centerList.vectors[1].y
            : 0}
        </Text>
        <Text>
          2x{" "}
          {getState().centerList.vectors[2]
            ? getState().centerList.vectors[2].x
            : 0}
        </Text>
        <Text>
          2y{" "}
          {getState().centerList.vectors[2]
            ? getState().centerList.vectors[2].y
            : 0}
        </Text>
      </Box>
    </Grid>
  );
}
