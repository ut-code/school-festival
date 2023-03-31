import {
  Grid,
  Box,
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
  Tooltip,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RiPlayFill,
  RiShuffleFill,
  RiSkipForwardFill,
  RiStopFill,
} from "react-icons/ri";
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
      () => Math.random() < 0.3
    )
  );
}

const presets = {
  glider: Array.from({ length: CELLULAR_AUTOMATON_WORLD_SIZE }, (_1, y) =>
    Array.from({ length: CELLULAR_AUTOMATON_WORLD_SIZE }, (_2, x) =>
      [
        [2, 1],
        [3, 2],
        [3, 3],
        [2, 3],
        [1, 3],
      ].some(([X, Y]) => X === x && Y === y)
    )
  ),
  spaceship: Array.from({ length: CELLULAR_AUTOMATON_WORLD_SIZE }, (_1, y) =>
    Array.from({ length: CELLULAR_AUTOMATON_WORLD_SIZE }, (_2, x) =>
      [
        [5, 1],
        [6, 2],
        [1, 3],
        [6, 3],
        [2, 4],
        [3, 4],
        [4, 4],
        [5, 4],
        [6, 4],
      ].some(([X, Y]) => X === x && Y === y)
    )
  ),
};

export function CellularAutomatonWorkspace(): JSX.Element {
  const worker = useMemo(
    () => new Worker(new URL("worker.ts", import.meta.url), { type: "module" }),
    []
  );
  const [isComputing, setIsComputing] = useState(false);
  const [cells, setCells] = useState(createRandomCells);
  const [code, setCode] = useState("");
  const [nextCells, setNextCells] = useState(cells);

  const { workspaceAreaRef } = useBlocklyWorkspace({
    toolboxBlocks,
    onCodeChange: setCode,
  });

  useEffect(() => {
    const formattedCode = `
      var previous = ${JSON.stringify(cells)};
      var next = ${JSON.stringify(cells)};
      for (var y = 0; y < ${CELLULAR_AUTOMATON_WORLD_SIZE}; y++) {
        for (var x = 0; x < ${CELLULAR_AUTOMATON_WORLD_SIZE}; x++) {
          ${code}
        }
      }
      return next;
    `;
    worker.postMessage(formattedCode);
    setIsComputing(true);
  }, [worker, code, cells]);

  useEffect(() => {
    worker.onmessage = (e) => {
      setNextCells(e.data);
      setIsComputing(false);
    };
    return () => {
      worker.terminate();
    };
  }, [worker]);

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
      window.clearTimeout(timerId);
    };
  }, [isPlaying, nextTick]);

  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Grid height="100%" templateColumns="1fr 20rem">
      <div ref={workspaceAreaRef} />
      <Box p={4} overflow="auto">
        <Grid gap={3} justifyContent="center" autoFlow="column" mb={4}>
          {!isPlaying ? (
            <Tooltip label="再生">
              <IconButton
                aria-label="再生"
                colorScheme="blue"
                icon={<Icon as={RiPlayFill} />}
                onClick={() => {
                  setIsPlaying(true);
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip label="停止">
              <IconButton
                aria-label="停止"
                colorScheme="blue"
                icon={<Icon as={RiStopFill} />}
                onClick={() => {
                  setIsPlaying(false);
                }}
              />
            </Tooltip>
          )}
          <Tooltip label="次のフレームへ">
            <IconButton
              aria-label="次へ"
              colorScheme="blue"
              isDisabled={isComputing || isPlaying}
              onClick={nextTick}
              icon={<Icon as={RiSkipForwardFill} />}
            />
          </Tooltip>
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
                  <Button
                    onClick={() => {
                      setCells(presets.glider);
                      onClose();
                    }}
                  >
                    グライダー
                  </Button>
                  <Button
                    onClick={() => {
                      setCells(presets.spaceship);
                      onClose();
                    }}
                  >
                    宇宙船
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
                        currentX === x ? !cell : cell
                      )
                    : row
                )
              );
            }}
            cells={cells}
          />
        </Box>
        <Text fontSize="xl" mb={2}>
          次世代
        </Text>
        <Box mb={4}>
          <CellularAutomatonWorkspaceWorldRenderer cells={nextCells} />
        </Box>
      </Box>
    </Grid>
  );
}
