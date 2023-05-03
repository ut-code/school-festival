import { useCallback, useRef, useState } from "react";
import { Grid, Stack } from "@chakra-ui/react";
import { useGetSet } from "react-use";
import { useBlocklyInterpreter } from "../../commons/interpreter";
import {
  BlocklyToolboxDefinition,
  useBlocklyWorkspace,
} from "../../commons/blockly";
import {
  BUILTIN_LOGIC_COMPARE,
  BUILTIN_LOGIC_NEGATE,
  BUILTIN_LOGIC_OPERATION,
  BUILTIN_MATH_ARITHMETIC,
  BUILTIN_MATH_NUMBER,
  CUSTOM_COMMON_WHILE,
  CUSTOM_COMMON_WHILE_TRUE,
} from "../../config/blockly.blocks";
import {
  CUSTOM_GA_ADD_PLACE,
  CUSTOM_GA_CREATE_ROUTE,
  CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE,
  CUSTOM_GA_DISTANCE,
  CUSTOM_GA_DUPLICATE_ROUTE,
  CUSTOM_GA_NTH_PLACE,
  CUSTOM_GA_RANDOM_INT,
  CUSTOM_GA_SWAP_PLACE,
  CUSTOM_GA_SWAP_ROUTES,
} from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import GARenderer from "./GARenderer";
import {
  createInitialGAState,
  createRouteReducer,
  isGARoute,
  GAPlace,
} from "./types";
import VariableList from "../../components/VariableList";

const toolboxDefinition: BlocklyToolboxDefinition = {
  type: "category",
  categories: [
    {
      name: "基本",
      blockTypes: [
        BUILTIN_MATH_NUMBER,
        BUILTIN_MATH_ARITHMETIC,
        BUILTIN_LOGIC_COMPARE,
        BUILTIN_LOGIC_OPERATION,
        BUILTIN_LOGIC_NEGATE,
        CUSTOM_COMMON_WHILE_TRUE,
        CUSTOM_COMMON_WHILE,
        CUSTOM_GA_RANDOM_INT,
      ],
    },
    {
      name: "経路",
      blockTypes: [
        CUSTOM_GA_CREATE_ROUTE,
        CUSTOM_GA_DUPLICATE_ROUTE,
        CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE,
        CUSTOM_GA_SWAP_ROUTES,
        CUSTOM_GA_NTH_PLACE,
        CUSTOM_GA_DISTANCE,
        CUSTOM_GA_ADD_PLACE,
        CUSTOM_GA_SWAP_PLACE,
      ],
    },
  ],
  enableVariables: true,
};

export function GeneticAlgorithmWorkspace(): JSX.Element {
  const initialState = useState(createInitialGAState)[0];
  const [getState, setState] = useGetSet(initialState);

  const globalFunctions = useRef({
    [CUSTOM_GA_CREATE_ROUTE]: () => {
      const [newState] = createRouteReducer(getState());
      setState(newState);
    },
    [CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE]: (i: number) => {
      const currentState = getState();
      setState({
        ...currentState,
        routes: currentState.routes.slice(0, i),
      });
    },
    [CUSTOM_GA_DUPLICATE_ROUTE]: (i: number) => {
      const currentState = getState();
      const [newState, newRoute] = createRouteReducer(getState());
      newRoute.placeLabels = currentState.routes[i].placeLabels;
      setState(newState);
    },
    [CUSTOM_GA_SWAP_ROUTES]: (a: number, b: number) => {
      const currentState = getState();
      const newRoutes = [...currentState.routes];
      [newRoutes[a], newRoutes[b]] = [newRoutes[b], newRoutes[a]];
      setState({
        ...currentState,
        routes: newRoutes,
      });
    },
    [CUSTOM_GA_NTH_PLACE]: (routeIndex: number, placeIndex: number) => {
      return getState().routes[routeIndex].placeLabels[placeIndex];
    },
    [CUSTOM_GA_DISTANCE]: (
      routeIndex: number,
      placeIndex1: number,
      placeIndex2: number
    ) => {
      const currentState = getState();
      const place1 = currentState.places[placeIndex1];
      const place2 = currentState.places[placeIndex2];
      if (!place1 || !place2) throw new Error();
      return Math.sqrt((place1.x - place2.x) ** 2 + (place1.y - place2.y) ** 2);
    },
    [CUSTOM_GA_ADD_PLACE]: (i: number, place: GAPlace) => {
      const currentState = getState();
      setState({
        ...currentState,
        routes: currentState.routes.map((route, j) =>
          j === i
            ? {
                ...route,
                placeLabels: [...route.placeLabels, place.label],
              }
            : route
        ),
      });
    },
    [CUSTOM_GA_SWAP_PLACE]: (i: number, a: number, b: number) => {
      const currentState = getState();
      setState({
        ...currentState,
        routes: currentState.routes.map((route, j) =>
          j === i
            ? {
                ...route,
                placeLabels: route.placeLabels.map((label, k) => {
                  if (k === a) return route.placeLabels[b];
                  if (k === b) return route.placeLabels[a];
                  return label;
                }),
              }
            : route
        ),
      });
    },
  }).current;

  const [interval, setInterval] = useState(500);
  const [variableNames, setVariableNames] = useState<string[]>([]);
  const { workspaceAreaRef, highlightBlock, getCode } = useBlocklyWorkspace({
    toolboxDefinition,
    onCodeChange: useCallback((_: unknown, newVariableNames: string[]) => {
      setVariableNames(newVariableNames);
    }, []),
  });
  const interpreter = useBlocklyInterpreter({
    globalFunctions,
    executionInterval: interval,
    onStep: highlightBlock,
  });

  return (
    <Grid h="100%" templateColumns="1fr 25rem">
      <div ref={workspaceAreaRef} />
      <Stack p={4} spacing={2} overflow="auto">
        <ExecutionManager
          interpreter={interpreter}
          interval={interval}
          setInterval={setInterval}
          onStart={() => {
            interpreter.start(getCode());
          }}
          onReset={() => {
            setState(initialState);
          }}
        />
        <VariableList
          interpreter={interpreter}
          variableNames={variableNames}
          renderVariable={(value) => {
            if (isGARoute(value)) return <>経路 #{value.label}</>;
            return undefined;
          }}
        />
        <GARenderer state={getState()} />
      </Stack>
    </Grid>
  );
}
