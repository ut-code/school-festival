import { Box, Flex, HStack, Text } from "@chakra-ui/react";

type TNode = {
  id: string;
  value: string;
  leftChild: TNode | null;
  rightChild: TNode | null;
  visited: boolean;
};

type TreeRendererProps = {
  rootTNode: TNode;
  currentTNode: TNode;
};

export function TreeRenderer({ rootTNode, currentTNode }: TreeRendererProps) {
  let colour;
  if (rootTNode.visited) {
    colour = "blue.400";
  } else {
    colour = "gray.400";
  }
  return (
    <Flex flexDirection="column">
      <Box>
        <HStack>
          <Box w="15px" h="15px" borderRadius="50%" bg={colour} />
          {rootTNode.id === currentTNode.id && (
            <Text textDecoration="underline">{rootTNode.value}</Text>
          )}
          {rootTNode.id !== currentTNode.id && <Text>{rootTNode.value}</Text>}{" "}
          {/* <Text>{colour}</Text> */}
        </HStack>
      </Box>
      <HStack>
        {rootTNode.leftChild && (
          <TreeRenderer
            key={rootTNode.leftChild.value}
            rootTNode={rootTNode.leftChild}
            currentTNode={currentTNode}
          />
        )}
        {rootTNode.rightChild && (
          <TreeRenderer
            key={rootTNode.rightChild.value}
            rootTNode={rootTNode.rightChild}
            currentTNode={currentTNode}
          />
        )}
      </HStack>
    </Flex>
  );
}
