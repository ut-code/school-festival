import { Box, Flex, HStack, Text } from "@chakra-ui/react";

type TNode = {
  value: string;
  leftChild: TNode | null;
  rightChild: TNode | null;
  colour?: string;
};

type TreeRendererProps = {
  node: TNode;
};

export function TreeRenderer({ node }: TreeRendererProps) {
  let colour;
  if (node.colour === "red") {
    colour = "red.400";
  } else if (node.colour === "blue") {
    colour = "blue.400";
  } else {
    colour = "green.400";
  }
  return (
    <Flex flexDirection="column">
      <Box>
        <HStack>
          <Box w="15px" h="15px" borderRadius="50%" bg={colour} />
          <Text>{node.value}</Text>
          {/* <Text>{colour}</Text> */}
        </HStack>
      </Box>
      <HStack>
        {node.leftChild && (
          <TreeRenderer key={node.leftChild.value} node={node.leftChild} />
        )}
        {node.rightChild && (
          <TreeRenderer key={node.rightChild.value} node={node.rightChild} />
        )}
      </HStack>
    </Flex>
  );
}
