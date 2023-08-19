import { Box, Flex, HStack, Text } from "@chakra-ui/react";

type Node = {
  id: string;
  value: string;
  leftChild: Node | null;
  rightChild: Node | null;
  visited: boolean;
};

type TreeRendererProps = {
  rootNode: Node;
  currentNode: Node;
};

export function TreeRenderer({ rootNode, currentNode }: TreeRendererProps) {
  let colour;
  if (rootNode.visited) {
    colour = "blue.400";
  } else {
    colour = "gray.400";
  }
  return (
    <Flex flexDirection="column">
      <Box>
        <HStack>
          <Box w="15px" h="15px" borderRadius="50%" bg={colour} />
          {rootNode.id === currentNode.id && (
            <Text textDecoration="underline">{rootNode.value}</Text>
          )}
          {rootNode.id !== currentNode.id && <Text>{rootNode.value}</Text>}{" "}
          {/* <Text>{colour}</Text> */}
        </HStack>
      </Box>
      <HStack>
        {rootNode.leftChild && (
          <TreeRenderer
            key={rootNode.leftChild.value}
            rootNode={rootNode.leftChild}
            currentNode={currentNode}
          />
        )}
        {rootNode.rightChild && (
          <TreeRenderer
            key={rootNode.rightChild.value}
            rootNode={rootNode.rightChild}
            currentNode={currentNode}
          />
        )}
      </HStack>
    </Flex>
  );
}
