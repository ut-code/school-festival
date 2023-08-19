import { Box, Stack } from "@chakra-ui/react";

type Node = {
  value: string;
  leftChild: Node | null;
  rightChild: Node | null;
  colour?: string;
};

type StackRendererProps = {
  stack: Node[];
};

export function StackRenderer({ stack }: StackRendererProps) {
  const reversedStack = stack.slice().reverse();
  return (
    <Stack
      maxW="100px"
      spacing="0"
      borderBottomRadius="md"
      borderTopWidth="0"
      marginX={10}
      marginY={10}
    >
      {reversedStack.map((Node, index) => (
        <Box
          borderWidth="1px"
          borderColor="gray.500"
          textAlign="center"
          py="2"
          borderBottomWidth={index === reversedStack.length - 1 ? "1px" : "0"}
          bg="gray.100"
          _last={{ borderBottomRadius: "md" }}
        >
          {Node.value}
        </Box>
      ))}
    </Stack>
  );
}
