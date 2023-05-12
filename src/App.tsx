import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Text,
  Box,
  Flex,
  chakra,
  Icon,
  Link,
  Button,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spacer,
} from "@chakra-ui/react";
import { RiQuestionFill, RiGithubFill } from "react-icons/ri";
import { Logo } from "./components/Logo";
import { HelpDialog } from "./components/HelpDialog";
import { TutorialDialog } from "./components/TutorialDialog";
import { routes } from "./routes";
import { TopPage } from "./components/TopPage";
import { ChakraLink } from "./components/Wrappers";

export function App(): JSX.Element {
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const [isHelpDialogVisible, setIsHelpDialogVisible] = useState(isRoot);
  const currentRoute = routes.find((route) => route.path === location.pathname);
  const [tutorialFinishedRoutePathSet, setTutorialFinishedRoutePathSet] =
    useState(new Set<string>());
  const [isTutorialDialogOpenedByUser, setIsTutorialDialogOpenedByUser] =
    useState(false);
  const [isTaskChangeDialogOpen, setIsTaskChangeDialogOpen] = useState(false);

  return (
    <>
      <Flex direction="column" height="100%">
        <Flex
          align="center"
          justify="space-between"
          shadow="md"
          backgroundColor="gray.50"
          px={3}
        >
          <Logo />
          <Box display={{ base: "none", lg: "block" }} fontSize="xl">
            はじめてのプログラミング
          </Box>
          <Spacer />
          <Button
            colorScheme="blue"
            variant="outline"
            onClick={() => setIsTaskChangeDialogOpen(true)}
            px={3}
            py={2}
            m={3}
          >
            課題を選択
          </Button>

          <Box display="flex" alignItems="stretch">
            {!isRoot && (
              <chakra.button
                px={4}
                type="button"
                transition="color 0.2s"
                _hover={{ color: "blue.300" }}
                onClick={() => {
                  setIsTutorialDialogOpenedByUser(true);
                }}
              >
                ヒント
              </chakra.button>
            )}
            <chakra.button
              px={2}
              type="button"
              transition="color 0.2s"
              _hover={{ color: "blue.300" }}
              onClick={() => {
                setIsHelpDialogVisible(true);
              }}
            >
              <Icon w={6} h={6} as={RiQuestionFill} />
            </chakra.button>
            <Link
              display="flex"
              alignItems="center"
              transition="color 0.2s"
              _hover={{ color: "blue.300" }}
              px={2}
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/ut-code/may-fes-93-algorithm"
            >
              <Icon w={6} h={6} as={RiGithubFill} />
            </Link>
          </Box>
        </Flex>
        <Box position="relative" flexGrow={1}>
          {[...routes, { path: "/", Component: TopPage }].map((route) => (
            <Box
              key={route.path}
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              visibility={
                location.pathname === route.path ? "visible" : "hidden"
              }
              backgroundColor="white"
            >
              <route.Component />
            </Box>
          ))}
        </Box>
      </Flex>
      <HelpDialog
        onClose={() => {
          setIsHelpDialogVisible(false);
        }}
        visible={isHelpDialogVisible}
      />
      {currentRoute &&
        (isTutorialDialogOpenedByUser ||
          !tutorialFinishedRoutePathSet.has(currentRoute.path)) && (
          <TutorialDialog
            isFirstView={!tutorialFinishedRoutePathSet.has(currentRoute.path)}
            onClose={() => {
              setIsTutorialDialogOpenedByUser(false);
              setTutorialFinishedRoutePathSet(
                new Set(tutorialFinishedRoutePathSet).add(currentRoute.path)
              );
            }}
            title={currentRoute.label}
            steps={currentRoute.tutorialSteps}
          />
        )}
      <Modal
        isOpen={isTaskChangeDialogOpen}
        onClose={() => setIsTaskChangeDialogOpen(false)}
        size="4xl"
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>課題を選択</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <SimpleGrid columns={2} spacing={4}>
                {routes.map((route) => (
                  <ChakraLink
                    key={route.path}
                    px={4}
                    py={3}
                    transition="color 0.2s"
                    _hover={{ color: "blue.300" }}
                    backgroundColor={
                      location.pathname === route.path ? "blue.100" : "white"
                    }
                    to={route.path + location.search}
                    borderWidth="1px"
                    borderRadius="10px"
                    borderColor="blue.500"
                    onClick={() => setIsTaskChangeDialogOpen(false)}
                  >
                    {route.label}
                    <Text fontSize="xs" color="gray">
                      {route.description}
                    </Text>
                  </ChakraLink>
                ))}
              </SimpleGrid>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
