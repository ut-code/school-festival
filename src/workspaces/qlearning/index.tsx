import { useRef, useState } from "react";
import { Box, Button, Grid, Icon } from "@chakra-ui/react";
import { useGetSet } from "react-use";
import { RiRestartLine } from "react-icons/ri";
import { useBlocklyInterpreter } from "../../commons/interpreter";
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
  CUSTOM_QL_PROBABLE,
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
import { MazeRenderer } from "./MazeRenderer";
import {
  Maze,
  MazeDirection,
  createMaze,
  moveInMaze,
} from "../../commons/maze";
import { randInt } from "../../commons/random";
import { QValueShow } from "./qvalueShow";

const toolboxDefinition: BlocklyToolboxDefinition = {
  type: "category",
  categories: [
    {
      name: "基本",
      blockTypes: [
        BUILTIN_MATH_NUMBER,
        BUILTIN_MATH_ARITHMETIC,
        CUSTOM_QL_PROBABLE,
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

const mazeSize = 5;

type MazeWorkspaceState = {
  maze: Maze;
  location: { x: number; y: number };
  q_value: Record<MazeDirection, number>[];
};

function createDefaultState(): MazeWorkspaceState {
  return {
    maze: createMaze(mazeSize, mazeSize),
    location: { x: 0, y: 0 },
    q_value: Array(mazeSize * mazeSize).fill({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
  };
}

export function QlearningWorkspace(): JSX.Element {
  // interpreter に渡す関数は実行開始時に決定されるため、通常の state だと最新の情報が参照できません
  // このため、反則ですが内部的に ref を用いて状態管理をしている react-use の [useGetSet](https://github.com/streamich/react-use/blob/master/docs/useGetSet.md) を用いています。
  const [getState, setState] = useGetSet(createDefaultState());

  // javascriptGenerator により生成されたコードから呼ばれる関数を定義します
  const globalFunctions = useRef({
    [CUSTOM_QL_IS_WALL]: (direction: MazeDirection) => {
      const state = getState();
      const currentCell = state.maze[state.location.y][state.location.x];
      return currentCell.walls[direction];
    },
    [CUSTOM_QL_PRESENT_ROW]: () => {
      const state = getState();
      return state.location.y;
    },
    [CUSTOM_QL_PRESENT_COL]: () => {
      const state = getState();
      return state.location.x;
    },
    [CUSTOM_QL_IS_GOAL]: () => {
      const state = getState();
      if (
        state.location.x === mazeSize - 1 &&
        state.location.y === mazeSize - 1
      ) {
        return true;
      }
      return false;
    },
    [CUSTOM_QL_PROBABLE]: (num: number) => {
      const random = Math.random();
      if (random < num) {
        return true;
      }
      return false;
    },
    [CUSTOM_QL_MOVE]: (direction: MazeDirection) => {
      const state = getState();
      const currentCell = state.maze[state.location.y][state.location.x];
      const nextCell = moveInMaze(state.maze, currentCell, direction);
      if (!nextCell || currentCell.walls[direction])
        throw new Error("壁があるため、進むことができません。");
      setState({
        ...state,
        location: nextCell.location,
      });
    },
    [CUSTOM_QL_MOVE_RANDOM]: () => {
      const rand = randInt(4);
      if (rand === 0) {
        return "top";
      }
      if (rand === 1) {
        return "bottom";
      }
      if (rand === 2) {
        return "right";
      }
      return "left";
    },
    [CUSTOM_QL_MOVE_TO_START]: () => {
      const state = getState();
      setState({
        ...state,
        location: { x: 0, y: 0 },
      });
    },
    [CUSTOM_QL_QVALUE]: (state: number, direction: MazeDirection) => {
      const mazeState = getState();
      if (state < 0 || state > mazeSize * mazeSize - 1)
        throw new Error(
          `状態は0から${mazeSize * mazeSize - 1}までの範囲である必要があります`
        );

      return mazeState.q_value[state][direction];
    },
    [CUSTOM_QL_QVALUE_UPDATE]: (
      state: number,
      direction: MazeDirection,
      update: number
    ) => {
      const mazeState = getState();
      if (state < 0 || state > mazeSize * mazeSize - 1)
        throw new Error(
          `状態は0から${mazeSize * mazeSize - 1}までの範囲である必要があります`
        );
      setState({
        ...mazeState,
        q_value: mazeState.q_value.map((value, i) =>
          i === state
            ? {
                ...mazeState.q_value[state],
                [direction]: update,
              }
            : value
        ),
      });
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
            console.log(getCode());
            interpreter.start(getCode());
          }}
          onReset={() => {
            setState({
              ...getState(),
              location: { x: 0, y: 0 },
              q_value: Array(mazeSize * mazeSize).fill({
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }),
            });
          }}
        />
        <MazeRenderer maze={getState().maze} location={getState().location} />
        <Button
          leftIcon={<Icon as={RiRestartLine} />}
          onClick={() => {
            setState(createDefaultState());
          }}
        >
          新しい迷路にする
        </Button>
        <QValueShow
          props={
            getState().q_value[
              getState().location.y * mazeSize + getState().location.x
            ]
          }
        />
      </Box>
    </Grid>
  );
}
