// 遺伝的アルゴリズムの型定義。
// ユーザーに露出するオブジェクトには __typename タグをつけることにより JSON シリアライズしても型情報が維持されるようする。

import nullthrows from "nullthrows";

export type GAPlaceLabel = string & { __GAPlaceLabel: never };
export const gaPlaceLabels = [..."ABCDEFGH"] as GAPlaceLabel[];
export const gaPlaceCountInRoute = gaPlaceLabels.length;
export const gaInitialRouteCount = 5;

export const gaMapSize = { width: (1 + Math.sqrt(5)) / 2, height: 1 };
export const gaMinSpaceBetweenPlaces = 0.4;

export type GARouteLabel = number & { __GARouteLabel: never };

/** 地点オブジェクト。GAState の初期化時に生成される。 */
export type GAPlace = {
  __typename: "GAPlace";
  /** すべての地点でユニーク */
  label: GAPlaceLabel;
  x: number;
  y: number;
};

export function isGAPlace(obj: unknown): obj is GAPlace {
  // eslint-disable-next-line no-underscore-dangle
  return Boolean(obj && (obj as GAPlace).__typename === "GAPlace");
}

/** 経路オブジェクト。「新しい経路を作成する」などのブロックで生成される。 */
export type GARoute = {
  __typename: "GARoute";
  /** すべての経路でユニーク。1 からの連番 */
  label: GARouteLabel;
  /** {@link gaPlaceCountInRoute}要素のタプル。index = 訪れる順番 */
  placeLabels: (GAPlaceLabel | null)[];
};

export function isGARoute(obj: unknown): obj is GAPlace {
  // eslint-disable-next-line no-underscore-dangle
  return Boolean(obj && (obj as GARoute).__typename === "GARoute");
}

export type GAState = {
  /** マップ中の経路 */
  places: GAPlace[];
  /** 最後に作成された経路の番号 */
  nextRouteLabel: GARouteLabel;
  /** ユーザーが作成している経路一覧 */
  routes: GARoute[];
};

export function createInitialGAState(): GAState {
  const positions: { x: number; y: number }[] = [];

  // 互いに gaMinSpaceBetweenPlaces 以上離れた位置に地点を配置する
  while (positions.length < gaPlaceCountInRoute) {
    const x = Math.random() * gaMapSize.width;
    const y = Math.random() * gaMapSize.height;
    if (
      positions.every(
        (p) => (p.x - x) ** 2 + (p.y - y) ** 2 > gaMinSpaceBetweenPlaces ** 2
      )
    ) {
      positions.push({ x, y });
    }
  }

  // 視認性の都合上、x 座標でソートする
  positions.sort((a, b) => a.x - b.x);

  const places: GAPlace[] = positions.map((p, i) => ({
    __typename: "GAPlace",
    label: nullthrows(gaPlaceLabels[i]),
    x: p.x,
    y: p.y,
  }));

  const routes: GARoute[] = [];

  while (routes.length < gaInitialRouteCount) {
    const newRoute: GARoute = {
      __typename: "GARoute",
      label: (routes.length + 1) as GARouteLabel,
      placeLabels: gaPlaceLabels.slice().sort(() => Math.random() - 0.5),
    };

    // 重複する経路は追加しない
    if (
      routes.every(
        (route) => route.placeLabels.join() !== newRoute.placeLabels.join()
      )
    )
      routes.push(newRoute);
  }

  return {
    places,
    nextRouteLabel: (gaInitialRouteCount + 1) as GARouteLabel,
    routes,
  };
}

export function createRouteReducer(state: GAState): [GAState, GARoute] {
  const newRoute: GARoute = {
    __typename: "GARoute",
    label: state.nextRouteLabel,
    placeLabels: [],
  };
  const newState: GAState = {
    ...state,
    nextRouteLabel: ((state.nextRouteLabel as number) + 1) as GARouteLabel,
    routes: [...state.routes, newRoute],
  };
  return [newState, newRoute];
}
