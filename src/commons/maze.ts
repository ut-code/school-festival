import { randInt } from "./random";

export type MazeCell = {
  location: { x: number; y: number };
  walls: Record<MazeDirection, boolean>;
};
export type Maze = MazeCell[][];

export const MazeDirectionMap = {
  TOP: "top",
  RIGHT: "right",
  BOTTOM: "bottom",
  LEFT: "left",
} as const;
export type MazeDirection = typeof MazeDirectionMap extends Record<
  string,
  infer U
>
  ? U
  : never;
export const MazeDirections: MazeDirection[] = Object.values(MazeDirectionMap);
export const MazeDirectionVectorMap: Record<
  MazeDirection,
  { x: number; y: number }
> = {
  [MazeDirectionMap.TOP]: { x: 0, y: -1 },
  [MazeDirectionMap.RIGHT]: { x: 1, y: 0 },
  [MazeDirectionMap.BOTTOM]: { x: 0, y: 1 },
  [MazeDirectionMap.LEFT]: { x: -1, y: 0 },
};
export const ReversedMazeDirectionMap: Record<MazeDirection, MazeDirection> = {
  [MazeDirectionMap.TOP]: MazeDirectionMap.BOTTOM,
  [MazeDirectionMap.RIGHT]: MazeDirectionMap.LEFT,
  [MazeDirectionMap.BOTTOM]: MazeDirectionMap.TOP,
  [MazeDirectionMap.LEFT]: MazeDirectionMap.RIGHT,
};

export function moveInMaze(
  maze: Maze,
  cell: MazeCell,
  direction: MazeDirection
): MazeCell | undefined {
  return maze[cell.location.y + MazeDirectionVectorMap[direction].y]?.[
    cell.location.x + MazeDirectionVectorMap[direction].x
  ];
}

export function rotateDirection(
  direction1: MazeDirection,
  direction2: MazeDirection
): MazeDirection {
  return MazeDirections[
    (MazeDirections.indexOf(direction1) + MazeDirections.indexOf(direction2)) %
      MazeDirections.length
  ];
}

export function createMaze(width: number, height: number): Maze {
  const maze: Maze = Array.from(Array(height), (_y, y) =>
    Array.from(Array(width), (_x, x) => ({
      location: { x, y },
      visited: false,
      walls: Object.fromEntries(
        MazeDirections.map((direction) => [direction, true])
      ) as Record<MazeDirection, boolean>,
    }))
  );
  const visitedCells = new Set<MazeCell>();

  while (visitedCells.size < width * height) {
    const firstCellOptions = Array.from(visitedCells.values()).filter((cell) =>
      MazeDirections.some((direction) => {
        const nextCell = moveInMaze(maze, cell, direction);
        return nextCell && !visitedCells.has(nextCell);
      })
    );
    let currentCell =
      firstCellOptions[randInt(firstCellOptions.length)] ??
      maze[randInt(height)][randInt(width)];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      visitedCells.add(currentCell);
      const nextOptions = MazeDirections.flatMap(
        // eslint-disable-next-line no-loop-func
        (direction) => {
          const nextCell = moveInMaze(maze, currentCell, direction);
          return nextCell && !visitedCells.has(nextCell)
            ? { nextCell, direction }
            : [];
        }
      );
      if (!nextOptions.length) break;
      const nextOption = nextOptions[randInt(nextOptions.length)];
      currentCell.walls[nextOption.direction] = false;
      nextOption.nextCell.walls[
        ReversedMazeDirectionMap[nextOption.direction]
      ] = false;
      currentCell = nextOption.nextCell;
    }
  }
  return maze;
}
