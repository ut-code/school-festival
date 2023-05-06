import { Button, Container, Text, SimpleGrid } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../routes";

export function TopPage(): JSX.Element {
  const location = useLocation();

  return (
    <Container maxW="container.md" py={10}>
      <Text mb={8}>
        取り組む課題を選択してください。右上のボタンからいつでも切り替えることができます。
      </Text>
      <SimpleGrid columns={2} spacing={4}>
        {routes.map((route) => (
          <Button
            as={Link}
            key={route.path}
            to={route.path + location.search}
            variant="outline"
            colorScheme="blue"
            display="block"
            h="auto"
            p={6}
          >
            <Text mb={4} fontSize="xl">
              {route.label}
            </Text>
            <Text fontWeight="normal">{route.description}</Text>
          </Button>
        ))}
      </SimpleGrid>
    </Container>
  );
}
