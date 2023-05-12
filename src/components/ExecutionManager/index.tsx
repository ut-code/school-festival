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
import { BlocklyInterpreter } from "../../commons/interpreter";

export type ExecutionManagerProps = {
  interval: number;
  setInterval(interval: number): void;
  interpreter: BlocklyInterpreter;
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
            isDisabled={props.interpreter.state !== "stopped"}
            leftIcon={<Icon as={RiPlayFill} />}
            onClick={props.onStart}
          >
            実行
          </Button>
          {props.interpreter.state !== "paused" ? (
            <Button
              variant="outline"
              isDisabled={props.interpreter.state !== "running"}
              leftIcon={<Icon as={RiPauseFill} />}
              onClick={props.interpreter.pause}
            >
              一時停止
            </Button>
          ) : (
            <Button
              variant="outline"
              leftIcon={<Icon as={RiPlayLine} />}
              onClick={props.interpreter.resume}
            >
              再開
            </Button>
          )}
          <Button
            variant="outline"
            leftIcon={<Icon as={RiPauseFill} />}
            isDisabled={props.interpreter.state === "stopped"}
            onClick={() => {
              props.onReset();
              props.interpreter.stop();
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
              min={0}
              max={1000}
              value={
                1000 -
                (Math.log((props.interval + 100) / 100) / Math.log(20)) * 1000
              }
              onChange={(value) => {
                props.setInterval(20 ** ((1000 - value) / 1000) * 100 - 100);
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
