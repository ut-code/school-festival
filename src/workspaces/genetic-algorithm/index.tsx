import { useCallback, useRef, useState } from "react";
import { Grid, Stack, Tag } from "@chakra-ui/react";
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
  CUSTOM_GA_NTH_PLACE,
  CUSTOM_GA_PLACE_EXISTS_IN_ROUTE,
  CUSTOM_GA_DISCARD_ROUTE,
} from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import GARenderer from "./GARenderer";
import { GAPlace, createInitialGAState, isGAPlace } from "./types";
import VariableList from "../../components/VariableList";
import {
  addPlace,
  createRoute,
  discardRoute,
  discardRoutesAfter,
  duplicateRoute,
  getDistance,
  getPlaceInRoute,
  getRoute,
  swapPlaces,
  swapRoutes,
} from "./reducer";

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
      name: "ルート",
      blockTypes: [
        CUSTOM_GA_ROUTE_COUNT,
        CUSTOM_GA_PLACE_COUNT,
        CUSTOM_GA_CREATE_ROUTE,
        CUSTOM_GA_DUPLICATE_ROUTE,
        CUSTOM_GA_DISCARD_ROUTE,
        CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE,
        CUSTOM_GA_SWAP_ROUTES,
        CUSTOM_GA_DISTANCE,
        CUSTOM_GA_SWAP_PLACE,
        CUSTOM_GA_NTH_PLACE,
        CUSTOM_GA_PLACE_EXISTS_IN_ROUTE,
        CUSTOM_GA_ADD_PLACE,
      ],
    },
  ],
  enableVariables: true,
};

type TypeMap = {
  int: number;
  number: number;
  string: string;
  GAPlace: GAPlace;
};
const typeNameMap = {
  int: "整数",
  number: "数値",
  string: "文字列",
  GAPlace: "地点",
};
function assertType<K extends keyof TypeMap>(type: K, value: TypeMap[K]): void {
  const valueInfo: { type: keyof TypeMap; stringRepresentation: string } =
    (() => {
      if (typeof value === "number") {
        if (Number.isInteger(value))
          return { type: "int", stringRepresentation: value.toString() };
        return { type: "number", stringRepresentation: value.toString() };
      }
      if (typeof value === "string")
        return { type: "string", stringRepresentation: value };
      if (isGAPlace(value))
        return {
          type: "GAPlace",
          stringRepresentation: `[地点 ${value.label}]`,
        };
      if (value === undefined) throw new Error("値がありません");
      throw new Error(`不明な値です: ${value}`);
    })();
  if (type !== valueInfo.type)
    throw new Error(
      `${typeNameMap[type]} が必要ですが、${valueInfo.stringRepresentation} (${
        typeNameMap[valueInfo.type]
      }) が指定されました。`
    );
}

export function GeneticAlgorithmWorkspace(): JSX.Element {
  const initialState = useState(createInitialGAState)[0];
  const [getState, setState] = useGetSet(initialState);

  const globalFunctions = useRef({
    [CUSTOM_GA_ROUTE_COUNT]: () => {
      return getState().routes.length;
    },
    [CUSTOM_GA_CREATE_ROUTE]: () => {
      setState(createRoute(getState()));
    },
    [CUSTOM_GA_DUPLICATE_ROUTE]: (index: number) => {
      assertType("int", index);
      setState(duplicateRoute(getState(), index));
    },
    [CUSTOM_GA_DISCARD_ROUTE]: (index: number) => {
      assertType("int", index);
      setState(discardRoute(getState(), index));
    },
    [CUSTOM_GA_DISCARD_AFTER_NTH_ROUTE]: (index: number) => {
      assertType("int", index);
      setState(discardRoutesAfter(getState(), index));
    },
    [CUSTOM_GA_SWAP_ROUTES]: (index1: number, index2: number) => {
      assertType("int", index1);
      assertType("int", index2);
      setState(swapRoutes(getState(), index1, index2));
    },
    [CUSTOM_GA_DISTANCE]: (
      routeIndex: number,
      placeIndex1: number,
      placeIndex2: number
    ) => {
      assertType("int", routeIndex);
      assertType("int", placeIndex1);
      assertType("int", placeIndex2);
      return getDistance(getState(), routeIndex, placeIndex1, placeIndex2);
    },
    [CUSTOM_GA_SWAP_PLACE]: (
      routeIndex: number,
      placeIndex1: number,
      placeIndex2: number
    ) => {
      assertType("int", routeIndex);
      assertType("int", placeIndex1);
      assertType("int", placeIndex2);
      setState(swapPlaces(getState(), routeIndex, placeIndex1, placeIndex2));
    },
    [CUSTOM_GA_NTH_PLACE]: (
      routeIndex: number,
      placeIndex: number
    ): GAPlace => {
      assertType("int", routeIndex);
      assertType("int", placeIndex);
      return getPlaceInRoute(getState(), routeIndex, placeIndex);
    },
    [CUSTOM_GA_PLACE_EXISTS_IN_ROUTE]: (
      routeIndex: number,
      place: GAPlace
    ): boolean => {
      assertType("int", routeIndex);
      assertType("GAPlace", place);
      return getRoute(getState(), routeIndex).placeLabels.includes(place.label);
    },
    [CUSTOM_GA_ADD_PLACE]: (routeIndex: number, place: GAPlace) => {
      assertType("int", routeIndex);
      assertType("GAPlace", place);
      setState(addPlace(getState(), routeIndex, place));
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
            if (isGAPlace(value)) return <Tag>地点 {value.label}</Tag>;
            return undefined;
          }}
        />
        <GARenderer state={getState()} />
      </Stack>
    </Grid>
  );
}
