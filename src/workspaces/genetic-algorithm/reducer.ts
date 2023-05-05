import invariant from "tiny-invariant";
import { GAPlace, GARoute, GARouteLabel, GAState } from "./types";

// Selectors
export function getRoute(state: GAState, index: number): GARoute {
  const route = state.routes[index - 1];
  if (!route) throw new Error(`${index} 番目の経路は存在しません。`);
  return route;
}

export function getPlaceInRoute(
  state: GAState,
  routeIndex: number,
  placeIndex: number
): GAPlace {
  const route = getRoute(state, routeIndex);
  const placeLabel = route.placeLabels[placeIndex - 1];
  if (!placeLabel)
    throw new Error(
      `${placeIndex} 番目の地点は ${routeIndex} 番目の経路にありません。`
    );
  const place = state.places.find(({ label }) => label === placeLabel);
  invariant(place, `${placeLabel} は存在しません。`);
  return place;
}

export function getDistance(
  state: GAState,
  routeIndex: number,
  placeIndex1: number,
  placeIndex2: number
): number {
  const place1 = getPlaceInRoute(state, routeIndex, placeIndex1);
  const place2 = getPlaceInRoute(state, routeIndex, placeIndex2);
  return Math.sqrt((place1.x - place2.x) ** 2 + (place1.y - place2.y) ** 2);
}

// Reducers
export function createRoute(state: GAState): GAState {
  const newRoute: GARoute = {
    label: state.nextRouteLabel,
    placeLabels: [],
  };
  const newState: GAState = {
    ...state,
    nextRouteLabel: ((state.nextRouteLabel as number) + 1) as GARouteLabel,
    routes: [...state.routes, newRoute],
  };
  return newState;
}

export function duplicateRoute(state: GAState, index: number): GAState {
  const newRoute: GARoute = {
    label: state.nextRouteLabel,
    placeLabels: getRoute(state, index).placeLabels,
  };
  const newState: GAState = {
    ...state,
    nextRouteLabel: ((state.nextRouteLabel as number) + 1) as GARouteLabel,
    routes: [...state.routes, newRoute],
  };
  return newState;
}

export function discardRoute(state: GAState, index: number): GAState {
  const newRoutes = state.routes.filter((_, i) => i !== index - 1);
  const newState: GAState = {
    ...state,
    routes: newRoutes,
  };
  return newState;
}

export function discardRoutesAfter(state: GAState, index: number): GAState {
  const newRoutes = state.routes.slice(0, index - 1);
  const newState: GAState = {
    ...state,
    routes: newRoutes,
  };
  return newState;
}

export function swapRoutes(
  state: GAState,
  index1: number,
  index2: number
): GAState {
  const newRoutes = [...state.routes];
  [newRoutes[index1 - 1], newRoutes[index2 - 1]] = [
    getRoute(state, index2),
    getRoute(state, index1),
  ];
  return {
    ...state,
    routes: newRoutes,
  };
}

export function swapPlaces(
  state: GAState,
  routeIndex: number,
  placeIndex1: number,
  placeIndex2: number
): GAState {
  const oldRoute = getRoute(state, routeIndex);
  const place1 = getPlaceInRoute(state, routeIndex, placeIndex1);
  const place2 = getPlaceInRoute(state, routeIndex, placeIndex2);
  const newRoute: GARoute = {
    ...oldRoute,
    placeLabels: oldRoute.placeLabels.map((label) => {
      if (label === place1.label) return place2.label;
      if (label === place2.label) return place1.label;
      return label;
    }),
  };
  return {
    ...state,
    routes: state.routes.map((route) =>
      route.label === oldRoute.label ? newRoute : route
    ),
  };
}

export function addPlace(
  state: GAState,
  routeIndex: number,
  place: GAPlace
): GAState {
  const oldRoute = getRoute(state, routeIndex);
  const newRoute: GARoute = {
    ...oldRoute,
    placeLabels: [...oldRoute.placeLabels, place.label],
  };
  return {
    ...state,
    routes: state.routes.map((route) =>
      route.label === oldRoute.label ? newRoute : route
    ),
  };
}
