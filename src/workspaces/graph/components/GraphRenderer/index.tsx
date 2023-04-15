import { Box, Flex, HStack, Text } from "@chakra-ui/react";

type MyNode = {
  value: string;
  children: MyNode[] | null;
  level: number;
};

type GraphRendererProps = {
  node: MyNode;
  level: number;
};

export function GraphRenderer({ node, level }: GraphRendererProps) {
  if (!node.children) {
    return (
      <Box ml={`${level * 20}px`}>
        <HStack>
          <Box w="10px" h="10px" borderRadius="50%" bg="green.400" />
          <Text>{node.value}</Text>
        </HStack>
      </Box>
    );
  }
  return (
    <Flex flexDirection="column">
      <Box ml={`${level * 20}px`}>
        <HStack>
          <Box w="10px" h="10px" borderRadius="50%" bg="green.400" />
          <Text>{node.value}</Text>
        </HStack>
      </Box>
      {node.children.map((child) => (
        <GraphRenderer key={child.value} node={child} level={level + 1} />
      ))}
    </Flex>
  );
}
