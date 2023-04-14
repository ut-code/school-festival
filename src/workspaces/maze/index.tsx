import { useRef, useState } from "react";
import { useGetSet } from "react-use";
import {
  Box,
  Divider,
  Grid,
  Alert,
  AlertIcon,
  AlertDescription,
  Button,
  Icon,
} from "@chakra-ui/react";
import { RiRestartLine } from "react-icons/ri";
import {
  createMaze,
  Maze,
  MazeDirection,
  MazeDirectionMap,
  moveInMaze,
  rotateDirection,
} from "../../commons/maze";
import {
  CUSTOM_MAZE_STEPFORWARD,
  CUSTOM_MAZE_TURN,
  CUSTOM_MAZE_CHECKWALL,
} from "./blocks";
import {
  CUSTOM_COMMON_IF,
  CUSTOM_COMMON_IF_ELSE,
  CUSTOM_COMMON_WHILE_TRUE,
  CUSTOM_COMMON_WHILE,
  CUSTOM_COMMON_DO_UNTIL,
} from "../../config/blockly.blocks";
import { MazeRenderer } from "./MazeRenderer";
import {
  BlocklyEditorMessage,
  useBlocklyInterpreter,
} from "../../commons/interpreter";
import { ExecutionManager } from "../../components/ExecutionManager";
import { useBlocklyWorkspace } from "../../commons/blockly";

type MazeWorkspaceStateSelf = {
  location: { x: number; y: number };
  direction: MazeDirection;
};

type MazeWorkspaceState = {
  maze: Maze;
  self: MazeWorkspaceStateSelf;
};

const defaultSelf: MazeWorkspaceStateSelf = {
  location: { x: 0, y: 0 },
  direction: MazeDirectionMap.BOTTOM,
};

function createDefaultState(): MazeWorkspaceState {
  return {
    maze: createMaze(10, 10),
    self: defaultSelf,
  };
}

const toolboxBlocks = [
  CUSTOM_MAZE_STEPFORWARD,
  CUSTOM_MAZE_TURN,
  CUSTOM_MAZE_CHECKWALL,
  CUSTOM_COMMON_IF,
  CUSTOM_COMMON_IF_ELSE,
  CUSTOM_COMMON_WHILE_TRUE,
  CUSTOM_COMMON_WHILE,
  CUSTOM_COMMON_DO_UNTIL,
];

export function MazeWorkspace(): JSX.Element {
  const [getState, setState] = useGetSet(createDefaultState());

  const globalFunctions = useRef({
    [CUSTOM_MAZE_STEPFORWARD]: () => {
      const state = getState();
      const currentCell =
        state.maze[state.self.location.y][state.self.location.x];
      const nextCell = moveInMaze(
        state.maze,
        currentCell,
        state.self.direction
      );
      if (!nextCell || currentCell.walls[state.self.direction])
        throw new Error("壁があるため、進むことができません。");
      setState({
        ...state,
        self: { ...state.self, location: nextCell.location },
      });
      if (nextCell.location.x === 9 && nextCell.location.y === 9) {
        throw new BlocklyEditorMessage("迷路をクリアしました！");
      }
    },
    [CUSTOM_MAZE_CHECKWALL]: (direction: MazeDirection) => {
      const state = getState();
      return state.maze[state.self.location.y][state.self.location.x].walls[
        rotateDirection(state.self.direction, direction)
      ];
    },
    [CUSTOM_MAZE_TURN]: (to: MazeDirection) => {
      const state = getState();
      setState({
        ...state,
        self: {
          ...state.self,
          direction: rotateDirection(state.self.direction, to),
        },
      });
    },
  }).current;

  const [interval, setInterval] = useState(500);

  const { workspaceAreaRef, highlightBlock, getCode } = useBlocklyWorkspace({
    toolboxDefinition: { type: "flyout", blockTypes: toolboxBlocks },
  });
  const interpreter = useBlocklyInterpreter({
    globalFunctions,
    executionInterval: interval,
    onStep: highlightBlock,
  });

  return (
    <Grid h="100%" templateColumns="1fr 25rem">
      <div ref={workspaceAreaRef} />
      <Box overflow="auto">
        <Box p={4}>
          <ExecutionManager
            interpreter={interpreter}
            interval={interval}
            setInterval={setInterval}
            onStart={() => {
              interpreter.start(getCode());
            }}
            onReset={() => {
              setState({ ...getState(), self: defaultSelf });
            }}
          />
        </Box>
        <Divider my={3} />
        <Box p={4}>
          <Alert mb={5}>
            <AlertIcon />
            <AlertDescription>
              迷路の中のアイコンを、ゴールまで導きましょう。
            </AlertDescription>
          </Alert>
          <Box mb={5}>
            <MazeRenderer
              maze={getState().maze}
              location={getState().self.location}
              direction={getState().self.direction}
            />
          </Box>
          <Button
            leftIcon={<Icon as={RiRestartLine} />}
            onClick={() => {
              setState(createDefaultState());
            }}
          >
            新しい迷路にする
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}
