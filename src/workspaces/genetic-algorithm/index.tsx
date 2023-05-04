import { useCallback, useRef, useState } from "react";
import { Grid, Stack } from "@chakra-ui/react";
import { useGetSet } from "react-use";
import invariant from "tiny-invariant";
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
  CUSTOM_COMMON_IF,
  CUSTOM_COMMON_IF_ELSE,
  CUSTOM_COMMON_TIMES,
  CUSTOM_COMMON_WHILE,
  CUSTOM_COMMON_WHILE_TRUE,
} from "../../config/blockly.blocks";
import {
  CUSTOM_GA_RANDOM_INT,
  CUSTOM_GA_ADD_PLACE,
  CUSTOM_GA_CREATE_ROUTE,
  CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE,
  CUSTOM_GA_DISTANCE,
  CUSTOM_GA_DUPLICATE_ROUTE,
  CUSTOM_GA_SWAP_PLACE,
  CUSTOM_GA_SWAP_ROUTES,
  CUSTOM_GA_ROUTE_COUNT,
  CUSTOM_GA_PLACE_COUNT,
} from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import GARenderer from "./GARenderer";
import { createInitialGAState, createRouteReducer } from "./types";
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
        CUSTOM_COMMON_IF,
        CUSTOM_COMMON_IF_ELSE,
        CUSTOM_COMMON_WHILE_TRUE,
        CUSTOM_COMMON_WHILE,
        CUSTOM_COMMON_TIMES,
        CUSTOM_GA_RANDOM_INT,
      ],
    },
    {
      name: "経路",
      blockTypes: [
        CUSTOM_GA_ROUTE_COUNT,
        CUSTOM_GA_PLACE_COUNT,
        CUSTOM_GA_CREATE_ROUTE,
        CUSTOM_GA_DUPLICATE_ROUTE,
        CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE,
        CUSTOM_GA_SWAP_ROUTES,
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
    [CUSTOM_GA_ROUTE_COUNT]: () => {
      return getState().routes.length;
    },
    [CUSTOM_GA_CREATE_ROUTE]: () => {
      const [newState] = createRouteReducer(getState());
      setState(newState);
    },
    [CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE]: (i: number) => {
      const currentState = getState();
      setState({
        ...currentState,
        routes: currentState.routes.slice(0, i - 1),
      });
    },
    [CUSTOM_GA_DUPLICATE_ROUTE]: (i: number) => {
      const currentState = getState();
      if (!currentState.routes[i - 1])
        throw new Error(`${i} 番目の経路は存在しません。`);
      const [newState, newRoute] = createRouteReducer(getState());
      newRoute.placeLabels = currentState.routes[i - 1].placeLabels;
      setState(newState);
    },
    [CUSTOM_GA_SWAP_ROUTES]: (a: number, b: number) => {
      const currentState = getState();
      if (!currentState.routes[a - 1] || !currentState.routes[b - 1])
        throw new Error(`${a} 番目または ${b} 番目の経路は存在しません。`);
      const newRoutes = [...currentState.routes];
      [newRoutes[a - 1], newRoutes[b - 1]] = [
        newRoutes[b - 1],
        newRoutes[a - 1],
      ];
      setState({
        ...currentState,
        routes: newRoutes,
      });
    },
    [CUSTOM_GA_DISTANCE]: (
      routeIndex: number,
      placeIndex1: number,
      placeIndex2: number
    ) => {
      const currentState = getState();
      const route = currentState.routes[routeIndex - 1];
      if (!route) throw new Error(`${routeIndex} 番目の経路はありません。`);
      const placeLabel1 = route.placeLabels[placeIndex1 - 1];
      const placeLabel2 = route.placeLabels[placeIndex2 - 1];
      if (!placeLabel1 || !placeLabel2) {
        const unknownPlaceIndices: number[] = [];
        if (!placeLabel1) unknownPlaceIndices.push(placeIndex1);
        if (!placeLabel2) unknownPlaceIndices.push(placeIndex2);
        throw new Error(
          `${unknownPlaceIndices
            .map((index) => `${index} 番目`)
            .join("、")} 番目の地点は ${routeIndex} 番目の経路にありません。`
        );
      }
      const place1 = currentState.places.find(
        (place) => place.label === placeLabel1
      );
      const place2 = currentState.places.find(
        (place) => place.label === placeLabel2
      );
      invariant(
        place1 && place2,
        `${placeLabel1} または ${placeLabel2} 地点は存在しません。`
      );
      return Math.sqrt((place1.x - place2.x) ** 2 + (place1.y - place2.y) ** 2);
    },
    [CUSTOM_GA_ADD_PLACE]: (
      routeIndexTo: number,
      routeIndexFrom: number,
      placeIndex: number
    ) => {
      const currentState = getState();
      const routeTo = currentState.routes[routeIndexTo - 1];
      if (!routeTo) throw new Error(`${routeIndexTo} 番目の経路はありません。`);
      const routeFrom = currentState.routes[routeIndexFrom - 1];
      if (!routeFrom)
        throw new Error(`${routeIndexFrom} 番目の経路はありません。`);
      const newPlaceLabel = routeFrom.placeLabels[placeIndex - 1];
      if (!newPlaceLabel)
        throw new Error(
          `${routeIndexFrom} 番目の経路に ${placeIndex} 番目の地点はありません。`
        );
      if (routeTo.placeLabels.includes(newPlaceLabel))
        throw new Error(
          `${routeIndexTo} 番目の経路では ${newPlaceLabel} 地点 (${routeIndexFrom} 番目の経路の ${placeIndex} 番目の地点) を既に訪れています。`
        );
      setState({
        ...currentState,
        routes: currentState.routes.map((route) =>
          route.label === routeTo.label
            ? {
                ...route,
                placeLabels: [...route.placeLabels, newPlaceLabel],
              }
            : route
        ),
      });
    },
    [CUSTOM_GA_SWAP_PLACE]: (i: number, a: number, b: number) => {
      const currentState = getState();
      const targetRoute = currentState.routes[i - 1];
      if (!targetRoute) throw new Error(`${i} 番目の経路はありません。`);
      setState({
        ...currentState,
        routes: currentState.routes.map((route) =>
          route.label === targetRoute.label
            ? {
                ...route,
                placeLabels: route.placeLabels.map((label, k) => {
                  if (k === a - 1) {
                    const newLabel = route.placeLabels[b - 1];
                    if (!newLabel)
                      throw new Error(
                        `${i} 番目の経路に ${b} 番目の地点はありません。`
                      );
                    return newLabel;
                  }
                  if (k === b - 1) {
                    const newLabel = route.placeLabels[a - 1];
                    if (!newLabel)
                      throw new Error(
                        `${i} 番目の経路に ${a} 番目の地点はありません。`
                      );
                    return newLabel;
                  }
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
        <VariableList interpreter={interpreter} variableNames={variableNames} />
        <GARenderer state={getState()} />
      </Stack>
    </Grid>
  );
}
