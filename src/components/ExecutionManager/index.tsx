import {
  Button,
  Grid,
  Icon,
  Text,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Flex,
  Box,
  VStack,
} from "@chakra-ui/react";
import { RiPauseFill, RiPlayFill, RiPlayLine } from "react-icons/ri";
import { UseBlocklyInterpreterReturnValue } from "../../commons/interpreter";

export type ExecutionManagerProps = {
  interval: number;
  setInterval(interval: number): void;
  interpreter: UseBlocklyInterpreterReturnValue;
  onStart(): void;
  onReset(): void;
};

export function ExecutionManager(props: ExecutionManagerProps): JSX.Element {
  return (
    <VStack align="stretch" spacing={3}>
      <Box>
        <Text fontSize="xl" mb={2}>
          実行
        </Text>
        <Grid autoFlow="column" autoColumns="1fr" gap={2}>
          <Button
            colorScheme="blue"
            variant="outline"
            disabled={props.interpreter.executionState !== "stopped"}
            leftIcon={<Icon as={RiPlayFill} />}
            onClick={props.onStart}
          >
            実行
          </Button>
          {props.interpreter.executionState !== "paused" ? (
            <Button
              variant="outline"
              disabled={props.interpreter.executionState !== "running"}
              leftIcon={<Icon as={RiPauseFill} />}
              onClick={props.interpreter.pauseExecution}
            >
              一時停止
            </Button>
          ) : (
            <Button
              variant="outline"
              leftIcon={<Icon as={RiPlayLine} />}
              onClick={props.interpreter.resumeExecution}
            >
              再開
            </Button>
          )}
          <Button
            variant="outline"
            icon={<Icon as={RiPauseFill} />}
            disabled={props.interpreter.executionState === "stopped"}
            onClick={() => {
              props.onReset();
              props.interpreter.stopExecution();
            }}
          >
            リセット
          </Button>
        </Grid>
      </Box>
      <Box>
        <Text fontSize="xl" mb={2}>
          実行速度
        </Text>
        <Flex align="center">
          <Text>遅い</Text>
          <Box flexGrow={1} px={4}>
            <Slider
              min={200}
              max={2000}
              value={2000 - props.interval}
              onChange={(value) => {
                props.setInterval(2000 - value);
              }}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
          <Text>速い</Text>
        </Flex>
      </Box>
    </VStack>
  );
}
