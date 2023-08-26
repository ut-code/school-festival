import { Fragment } from "react";
import { Maze, MazeDirectionMap } from "../../commons/maze";

const MAZE_CELL_SIZE = 5;
const MAZE_PADDING = 1;

export function MazeRenderer(props: {
  maze: Maze;
  location: { x: number; y: number };
}): JSX.Element {
  const mazeWidth = props.maze[0].length;
  const mazeHeight = props.maze.length;

  return (
    <svg
      width="100%"
      viewBox={[
        -MAZE_PADDING,
        -MAZE_PADDING,
        MAZE_CELL_SIZE * mazeWidth + MAZE_PADDING * 2,
        MAZE_CELL_SIZE * mazeHeight + MAZE_PADDING * 2,
      ].join(" ")}
    >
      {props.maze.map((row, y) =>
        row.map((cell, x) => (
          <Fragment key={`${cell.location.x},${cell.location.y}`}>
            <g
              stroke="#000"
              strokeWidth={0.3}
              strokeLinecap="round"
              transform={`translate(${x * MAZE_CELL_SIZE}, ${
                y * MAZE_CELL_SIZE
              })`}
            >
              {cell.walls[MazeDirectionMap.TOP] && (
                <line x1={0} y1={0} x2={MAZE_CELL_SIZE} y2={0} />
              )}
              {cell.walls[MazeDirectionMap.RIGHT] && (
                <line
                  x1={MAZE_CELL_SIZE}
                  y1={0}
                  x2={MAZE_CELL_SIZE}
                  y2={MAZE_CELL_SIZE}
                />
              )}
              {cell.walls[MazeDirectionMap.BOTTOM] && (
                <line
                  x1={0}
                  y1={MAZE_CELL_SIZE}
                  x2={MAZE_CELL_SIZE}
                  y2={MAZE_CELL_SIZE}
                />
              )}
              {cell.walls[MazeDirectionMap.LEFT] && (
                <line x1={0} y1={0} x2={0} y2={MAZE_CELL_SIZE} />
              )}
            </g>
            <text
              x={(x + 0.3) * MAZE_CELL_SIZE}
              y={(y + 0.7) * MAZE_CELL_SIZE}
              fontSize={MAZE_CELL_SIZE / 2}
              fill="#D8D8D8"
            >
              {y * MAZE_CELL_SIZE + x}
            </text>
          </Fragment>
        ))
      )}
      <path
        transform={[
          "translate(",
          MAZE_CELL_SIZE * (mazeWidth - 1),
          ",",
          MAZE_CELL_SIZE * (mazeHeight - 1),
          ")",
        ].join("")}
        d={[
          `M ${MAZE_CELL_SIZE * 0.35},${MAZE_CELL_SIZE * 0.2}`,
          `V ${MAZE_CELL_SIZE * 0.8}`,
          `H ${MAZE_CELL_SIZE * 0.4}`,
          `V ${MAZE_CELL_SIZE * 0.5}`,
          `L ${MAZE_CELL_SIZE * 0.7},${MAZE_CELL_SIZE * 0.35}`,
          `Z`,
        ].join(" ")}
        fill="#ACDBDA"
      />
      <circle
        r={MAZE_CELL_SIZE * 0.25}
        transform={[
          "translate(",
          (props.location.x + 0.5) * MAZE_CELL_SIZE,
          ",",
          (props.location.y + 0.5) * MAZE_CELL_SIZE,
          ")",
        ].join("")}
        fill="#f00"
      />
    </svg>
  );
}
