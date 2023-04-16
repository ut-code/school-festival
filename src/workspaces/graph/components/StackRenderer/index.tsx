import { Box, Stack } from "@chakra-ui/react";

type StackRendererProps = {
  stack: string[];
};

export function StackRenderer({ stack }: StackRendererProps) {
  const reversedStack = stack.slice().reverse();
  return (
    <Stack
      maxW="100px"
      spacing="0"
      borderWidth="4px"
      borderRadius="md"
      overflow="hidden"
      borderTopWidth="0"
    >
      {reversedStack.map((value, index) => (
        <Box
          borderWidth="1px"
          borderColor="gray.200"
          px="3"
          py="2"
          borderBottomWidth={index === reversedStack.length - 1 ? "1px" : "0"}
          bg={index % 2 === 0 ? "gray.50" : "white"}
          _last={{ borderBottomRadius: "md" }}
        >
          {value}
        </Box>
      ))}
    </Stack>
  );
}
