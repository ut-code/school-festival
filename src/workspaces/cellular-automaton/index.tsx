import {
  Grid,
  Box,
  CircularProgress,
  Icon,
  Text,
  Button,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import Interpreter from "js-interpreter";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RiPlayFill,
  RiShuffleFill,
  RiSkipForwardFill,
  RiStopFill,
} from "react-icons/ri";
import { useDebounce } from "use-debounce";
import { useBlocklyWorkspace } from "../../commons/blockly";
import {
  BUILTIN_LOGIC_COMPARE,
  BUILTIN_LOGIC_NEGATE,
  BUILTIN_LOGIC_OPERATION,
  BUILTIN_MATH_ARITHMETIC,
  BUILTIN_MATH_NUMBER,
  CUSTOM_COMMON_IF,
  CUSTOM_COMMON_IF_ELSE,
} from "../../config/blockly.blocks";
import {
  CELLULAR_AUTOMATON_WORLD_SIZE,
  CUSTOM_CELLULAR_AUTOMATON_FILL,
  CUSTOM_CELLULAR_AUTOMATON_SELF_IS_BLACK,
  CUSTOM_CELLULAR_AUTOMATON_SURROUNDINGS_COUNT,
} from "./blocks";
import { CellularAutomatonWorkspaceWorldRenderer } from "./WorldRenderer";

const toolboxBlocks: string[] = [
  BUILTIN_MATH_NUMBER,
  BUILTIN_MATH_ARITHMETIC,
  BUILTIN_LOGIC_COMPARE,
  BUILTIN_LOGIC_OPERATION,
  BUILTIN_LOGIC_NEGATE,
  CUSTOM_COMMON_IF,
  CUSTOM_COMMON_IF_ELSE,
  CUSTOM_CELLULAR_AUTOMATON_FILL,
  CUSTOM_CELLULAR_AUTOMATON_SELF_IS_BLACK,
  CUSTOM_CELLULAR_AUTOMATON_SURROUNDINGS_COUNT,
];

function createRandomCells(): boolean[][] {
  return Array.from({ length: CELLULAR_AUTOMATON_WORLD_SIZE }, () =>
    Array.from(
      { length: CELLULAR_AUTOMATON_WORLD_SIZE },
      () => Math.random() > 0.5,
    ),
  );
}

export function CellularAutomatonWorkspace(): JSX.Element {
  const [cells, setCells] = useState(createRandomCells);

  const { code, workspaceAreaRef } = useBlocklyWorkspace({
    type: "cellular-automaton",
    toolboxBlocks,
  });

  const [{ throttledCode, throttledCells }, { isPending }] = useDebounce(
    useMemo(
      () => ({ throttledCode: code, throttledCells: cells }),
      [code, cells],
    ),
    200,
  );
  const nextCells = useMemo(() => {
    let result: boolean[][] = [];
    const formattedCode = `
      var previous = ${JSON.stringify(throttledCells)};
      var next = ${JSON.stringify(throttledCells)};
      for (var y = 0; y < ${CELLULAR_AUTOMATON_WORLD_SIZE}; y++) {
        for (var x = 0; x < ${CELLULAR_AUTOMATON_WORLD_SIZE}; x++) {
          ${throttledCode}
        }
      }
      result(JSON.stringify(next));
    `;
    const interpreter = new Interpreter(
      formattedCode,
      (newInterpreter, globalScope) => {
        newInterpreter.setProperty(
          globalScope,
          "result",
          newInterpreter.createNativeFunction((json: string) => {
            result = JSON.parse(json);
          }),
        );
      },
    );
    interpreter.run();
    return result;
  }, [throttledCode, throttledCells]);

  const nextTick = useCallback(() => {
    setCells(nextCells);
  }, [nextCells]);

  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    if (!isPlaying) return undefined;
    let timerId: number;
    const timerCallback = () => {
      nextTick();
      timerId = window.setTimeout(timerCallback, 500);
    };
    timerId = window.setTimeout(timerCallback, 500);
    return () => {
      clearTimeout(timerId);
    };
  }, [isPlaying, nextTick]);

  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Grid height="100%" templateColumns="1fr 20rem">
      <div ref={workspaceAreaRef} />
      <Box p={4} overflow="auto">
        <Grid gap={3} justifyContent="center" autoFlow="column" mb={4}>
          {!isPlaying ? (
            <IconButton
              aria-label="再生"
              colorScheme="blue"
              icon={<Icon as={RiPlayFill} />}
              onClick={() => {
                setIsPlaying(true);
              }}
            />
          ) : (
            <IconButton
              aria-label="停止"
              colorScheme="blue"
              icon={<Icon as={RiStopFill} />}
              onClick={() => {
                setIsPlaying(false);
              }}
            />
          )}
          <IconButton
            aria-label="次へ"
            colorScheme="blue"
            disabled={isPending() || isPlaying}
            onClick={nextTick}
            icon={<Icon as={RiSkipForwardFill} />}
          />
          <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
              <IconButton
                aria-label="リセット"
                colorScheme="blue"
                icon={<Icon as={RiShuffleFill} />}
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>リセット</PopoverHeader>
              <PopoverBody>
                <Text mb={2}>データをリセットします。</Text>
                <VStack align="stretch">
                  <Button
                    onClick={() => {
                      setCells(createRandomCells);
                      onClose();
                    }}
                  >
                    ランダム
                  </Button>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Grid>
        <Text fontSize="xl" mb={1}>
          現世代
        </Text>
        <Text mb={2}>セルをクリックすると色が変わります。</Text>
        <Box mb={4}>
          <CellularAutomatonWorkspaceWorldRenderer
            onCellClicked={({ x, y }) => {
              setCells(
                cells.map((row, currentY) =>
                  currentY === y
                    ? row.map((cell, currentX) =>
                        currentX === x ? !cell : cell,
                      )
                    : row,
                ),
              );
            }}
            cells={cells}
          />
        </Box>
        <Text fontSize="xl" mb={2}>
          次世代
        </Text>
        <Box position="relative" mb={4}>
          <CellularAutomatonWorkspaceWorldRenderer cells={nextCells} />
          {isPending() && (
            <CircularProgress
              position="absolute"
              top={5}
              right={5}
              isIndeterminate
            />
          )}
        </Box>
      </Box>
    </Grid>
  );
}
