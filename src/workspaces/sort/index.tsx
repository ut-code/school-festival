import { useRef, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Grid,
  Divider,
} from "@chakra-ui/react";
import { useGetSet } from "react-use";
import {
  SortDirection,
  SortDirectionDiffMap,
  SortDirectionMap,
  CUSTOM_SORT_CHECKEXISTENCE,
  CUSTOM_SORT_CHECKTALLER,
  CUSTOM_SORT_MOVE,
  CUSTOM_SORT_MOVETOEND,
  CUSTOM_SORT_SWAP,
} from "./blocks";
import { SortRenderer } from "./components/SortRenderer";
import {
  BlocklyEditorMessage,
  useBlocklyInterpreter,
} from "../../commons/interpreter";
import { useBlocklyWorkspace } from "../../commons/blockly";
import {
  CUSTOM_COMMON_DO_UNTIL,
  CUSTOM_COMMON_IF,
  CUSTOM_COMMON_IF_ELSE,
  CUSTOM_COMMON_WHILE,
  CUSTOM_COMMON_WHILE_TRUE,
} from "../../config/blockly.blocks";
import { ExecutionManager } from "../../components/ExecutionManager";

const SORT_COUNT = 10;

export type SortWorkspaceState = {
  heights: number[];
  teachersLocation: number;
};

function createDefaultState() {
  return {
    heights: Array.from(Array(SORT_COUNT).keys(), (v) => v + 1).sort(
      () => Math.random() - 0.5
    ),
    teachersLocation: 0,
  };
}

const toolboxBlocks = [
  CUSTOM_SORT_MOVE,
  CUSTOM_SORT_MOVETOEND,
  CUSTOM_SORT_SWAP,
  CUSTOM_SORT_CHECKTALLER,
  CUSTOM_SORT_CHECKEXISTENCE,
  CUSTOM_COMMON_IF,
  CUSTOM_COMMON_IF_ELSE,
  CUSTOM_COMMON_WHILE_TRUE,
  CUSTOM_COMMON_WHILE,
  CUSTOM_COMMON_DO_UNTIL,
];

export function SortWorkspace(): JSX.Element {
  const [getState, setState] = useGetSet(createDefaultState());

  const globalFunctions = useRef({
    [CUSTOM_SORT_MOVE]: (direction: SortDirection) => {
      const currentState = getState();
      const newTeachersLocation =
        currentState.teachersLocation + SortDirectionDiffMap[direction];
      if (newTeachersLocation < 0 || newTeachersLocation >= SORT_COUNT)
        throw new Error("これ以上進むことはできません。");
      setState({ ...currentState, teachersLocation: newTeachersLocation });
    },
    [CUSTOM_SORT_MOVETOEND]: (direction: SortDirection) => {
      setState({
        ...getState(),
        teachersLocation: {
          [SortDirectionMap.LEFT]: 0,
          [SortDirectionMap.RIGHT]: SORT_COUNT - 1,
        }[direction],
      });
    },
    [CUSTOM_SORT_SWAP]: (direction: SortDirection) => {
      const currentState = getState();
      const targetLocation =
        getState().teachersLocation + SortDirectionDiffMap[direction];
      if (targetLocation < 0 || targetLocation >= SORT_COUNT)
        throw new Error("入れ替える方向に人がいません。");
      const newHeights = currentState.heights.map(
        (_, index) =>
          currentState.heights[
            {
              [currentState.teachersLocation]: targetLocation,
              [targetLocation]: currentState.teachersLocation,
            }[index] ?? index
          ]
      );
      setState({ ...currentState, heights: newHeights });
      if (
        newHeights.reduce((previous, current) =>
          previous > current ? current : 0
        )
      )
        throw new BlocklyEditorMessage("並び替えに成功しました！");
    },
    [CUSTOM_SORT_CHECKTALLER]: (direction: SortDirection) => {
      const currentState = getState();
      const targetLocation =
        currentState.teachersLocation + SortDirectionDiffMap[direction];
      if (targetLocation < 0 || targetLocation >= SORT_COUNT)
        throw new Error("入れ替える方向に人がいません。");
      return (
        currentState.heights[targetLocation] >
        currentState.heights[currentState.teachersLocation]
      );
    },
    [CUSTOM_SORT_CHECKEXISTENCE]: (direction: SortDirection) => {
      const targetLocation =
        getState().teachersLocation + SortDirectionDiffMap[direction];
      return targetLocation >= 0 && targetLocation < SORT_COUNT;
    },
  }).current;

  const [interval, setInterval] = useState(500);

  const { workspaceAreaRef, highlightBlock, getCode } = useBlocklyWorkspace({
    toolboxBlocks,
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
              setState(createDefaultState());
            }}
          />
        </Box>
        <Divider my={3} />
        <Box p={4}>
          <Alert mb={5}>
            <AlertIcon />
            <AlertDescription>
              並んでいる生徒たちを左から背の高い順に並べましょう。あなたは、黄色いホイッスルがついている場所に立っています。
            </AlertDescription>
          </Alert>
          <SortRenderer
            heights={getState().heights}
            teachersLocation={getState().teachersLocation}
          />
        </Box>
      </Box>
    </Grid>
  );
}
