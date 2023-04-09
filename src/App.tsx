import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Flex, chakra, Icon, Link } from "@chakra-ui/react";
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
          <Box display="flex" alignItems="stretch">
            {routes.map((route) => (
              <ChakraLink
                key={route.path}
                px={4}
                py={3}
                transition="color 0.2s"
                _hover={{ color: "blue.300" }}
                backgroundColor={
                  location.pathname === route.path ? "blue.100" : "transparent"
                }
                to={route.path + location.search}
              >
                {route.label}
              </ChakraLink>
            ))}
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
    </>
  );
}
