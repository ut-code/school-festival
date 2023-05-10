import { useCallback, useRef, useState } from "react";
import {
  chakra,
  Stack,
  Box,
  Flex,
  Grid,
  Text,
  Button,
  Icon,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
} from "@chakra-ui/react";
import { RiRefreshLine } from "react-icons/ri";
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

function checkUndefined(value: number | Cluster | Vector2D) {
  if (value === undefined) {
    throw new Error(`値が定義されたブロックを当てはめてください。`);
  }
}

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
      [Math.random() + 1, Math.random()],
      [Math.random() + 1, Math.random()],
      [Math.random() + 1, Math.random()],
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
      checkUndefined(i);
      const currentState = getState();
      if (i >= CLUSTER_COUNT) {
        throw new Error(`${i}番目のグループは存在しません。`);
      } else {
        return currentState.clusterList[i];
      }
    },
    [CUSTOM_KM_SET_CENTER_OF_CLUSTER]: (index_: number, x: Vector2D) => {
      checkUndefined(index_);
      checkUndefined(x);
      const currentState = getState();
      if (index_ >= CLUSTER_COUNT) {
        throw new Error(`${index_}番目のグループは存在しません。`);
      } else {
        const newCenterOfClustersDatas = currentState.centerList.vectors.map(
          (vector_, index) => (index === index_ ? x : vector_)
        );
        setState({
          ...currentState,
          centerList: { vectors: newCenterOfClustersDatas },
        });
      }
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
      checkUndefined(cluster_);
      const currentState = getState();
      return currentState.centerList.vectors[cluster_.clusterNumber];
    },
    [CUSTOM_KM_ADD_DATA_TO_ARRAY]: (array: Cluster, vector_: Vector2D) => {
      checkUndefined(array);
      checkUndefined(vector_);
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
      checkUndefined(array);
      checkUndefined(index_);
      const currentState = getState();
      if (index_ >= array.vectors.length) {
        throw new Error(
          `${array.clusterNumber}番目のグループには${array.vectors.length}個の要素しかありません。`
        );
      } else {
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
      }
    },
    [CUSTOM_KM_DATA_IN_ARRAY]: (array: Cluster, i: number) => {
      checkUndefined(array);
      checkUndefined(i);
      if (i >= array.vectors.length) {
        throw new Error(
          `${array.clusterNumber}番目のグループには${array.vectors.length}個の要素しかありません。`
        );
      } else {
        return array.vectors[i];
      }
    },
    [CUSTOM_KM_DISTANCE_BETWEEN_X_AND_Y]: (
      vector1: Vector2D,
      vector2: Vector2D
    ) => {
      checkUndefined(vector1);
      checkUndefined(vector2);
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
      checkUndefined(array);
      checkUndefined(i);
      if (i >= array.vectors.length) {
        throw new Error(
          `${array.clusterNumber}番目のグループには${array.vectors.length}個の要素しかありません。`
        );
      } else {
        return array.vectors[i].x;
      }
    },
    [CUSTOM_KM_Y_OF_DATA_IN_ARRAY]: (array: Cluster, i: number) => {
      checkUndefined(array);
      checkUndefined(i);
      if (i >= array.vectors.length) {
        throw new Error(
          `${array.clusterNumber}番目のグループには${array.vectors.length}個の要素しかありません。`
        );
      } else {
        return array.vectors[i].y;
      }
    },
    [CUSTOM_KM_DATA_X_Y]: (x: number, y: number) => {
      checkUndefined(x);
      checkUndefined(y);
      return { x, y };
    },
    [CUSTOM_KM_LENGTH_OF_ARRAY]: (array: Cluster) => {
      checkUndefined(array);
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
      <Stack p={4} spacing={2} overflow="auto">
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
        <Button
          width="100%"
          colorScheme="blue"
          variant="outline"
          leftIcon={<Icon as={RiRefreshLine} />}
          onClick={() => {
            setState(RandomDatas(DATA_COUNT));
          }}
        >
          再配置
        </Button>
        <Box>
          <Text fontSize="xl" mb={2}>
            グループ
          </Text>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>番号</Th>
                  <Th>色</Th>
                  <Th>中心地点</Th>
                  <Th>点の数</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>0</Td>
                  <Td>
                    <svg width="40%" viewBox="-2 -2 4 4">
                      <chakra.circle cx="0" cy="0" r="1.2" fill="red" />
                    </svg>
                  </Td>
                  <Td>
                    <Flex>
                      <svg width="20%" viewBox="-4 -4 8 8">
                        <chakra.circle
                          cx="0"
                          cy="0"
                          r="2"
                          fill="red"
                          stroke="black"
                        />
                      </svg>
                      (
                      {getState().centerList.vectors[0]
                        ? getState().centerList.vectors[0].x.toPrecision(3)
                        : 0}
                      ,
                      {getState().centerList.vectors[0]
                        ? getState().centerList.vectors[0].y.toPrecision(3)
                        : 0}
                      )
                    </Flex>
                  </Td>
                  <Td>
                    {getState().clusterList[0]
                      ? getState().clusterList[0].vectors.length
                      : 0}
                  </Td>
                </Tr>
                <Tr>
                  <Td>1</Td>
                  <Td>
                    <svg width="40%" viewBox="-2 -2 4 4">
                      <chakra.circle cx="0" cy="0" r="1.2" fill="blue" />
                    </svg>
                  </Td>
                  <Td>
                    <Flex>
                      <svg width="20%" viewBox="-4 -4 8 8">
                        <chakra.circle
                          cx="0"
                          cy="0"
                          r="2"
                          fill="blue"
                          stroke="black"
                        />
                      </svg>
                      (
                      {getState().centerList.vectors[1]
                        ? getState().centerList.vectors[1].x.toPrecision(3)
                        : 0}
                      ,
                      {getState().centerList.vectors[1]
                        ? getState().centerList.vectors[1].y.toPrecision(3)
                        : 0}
                      )
                    </Flex>
                  </Td>
                  <Td>
                    {getState().clusterList[1]
                      ? getState().clusterList[1].vectors.length
                      : 0}
                  </Td>
                </Tr>
                <Tr>
                  <Td>2</Td>
                  <Td>
                    <svg width="40%" viewBox="-2 -2 4 4">
                      <chakra.circle cx="0" cy="0" r="1.2" fill="green" />
                    </svg>
                  </Td>
                  <Td>
                    <Flex>
                      <svg width="20%" viewBox="-4 -4 8 8">
                        <chakra.circle
                          cx="0"
                          cy="0"
                          r="2"
                          fill="green"
                          stroke="black"
                        />
                      </svg>
                      (
                      {getState().centerList.vectors[2]
                        ? getState().centerList.vectors[2].x.toPrecision(3)
                        : 0}
                      ,
                      {getState().centerList.vectors[2]
                        ? getState().centerList.vectors[2].y.toPrecision(3)
                        : 0}
                      )
                    </Flex>
                  </Td>
                  <Td>
                    {getState().clusterList[2]
                      ? getState().clusterList[2].vectors.length
                      : 0}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>
    </Grid>
  );
}
