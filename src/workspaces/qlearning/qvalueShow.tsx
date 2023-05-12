import { VStack, Text, HStack } from "@chakra-ui/react";
import { MazeDirection } from "../../commons/maze";

export function QValueShow({
  props,
}: {
  props: Record<MazeDirection, number>;
}): JSX.Element {
  const propArray = Object.entries(props)
    .map(([k, v]) => ({
      direction: k,
      qvalue: v,
    }))
    .sort((a, b) => (a.qvalue < b.qvalue ? 1 : -1));
  const round = (n: number) => Math.round(n * 10) / 10;
  const color = (direction: MazeDirection) =>
    propArray.map((x) => x.direction).indexOf(direction) === 0
      ? "#f00"
      : "#00f";
  return (
    <VStack padding={8}>
      <VStack>
        <svg width={50} height={50}>
          <path
            d="M25 0 L50 25 L40 25 L40 50 L10 50 L10 25 L0 25 Z"
            style={{ fill: color("top") }}
          />
        </svg>
        <Text fontSize="3xl">{round(props.top)}</Text>
      </VStack>
      <HStack spacing={20}>
        <HStack spacing={4}>
          <svg width={50} height={50}>
            <path
              d="M25 0 L0 25 L25 50 L25 40 L50 40 L50 10 L25 10 Z"
              style={{ fill: color("left") }}
            />
          </svg>
          <Text fontSize="3xl">{round(props.left)}</Text>
        </HStack>
        <HStack spacing={4}>
          <Text fontSize="3xl">{round(props.right)}</Text>
          <svg width={50} height={50}>
            <path
              d="M25 0 L50 25 L25 50 L25 40 L0 40 L0 10 L25 10 Z"
              style={{ fill: color("right") }}
            />
          </svg>
        </HStack>
      </HStack>
      <VStack>
        <Text fontSize="3xl">{round(props.bottom)}</Text>
        <svg width={50} height={50}>
          <path
            d="M10 0 L40 0 L40 25 L50 25 L25 50 L0 25 L10 25 Z"
            style={{ fill: color("bottom") }}
          />
        </svg>
      </VStack>
    </VStack>
  );
}
