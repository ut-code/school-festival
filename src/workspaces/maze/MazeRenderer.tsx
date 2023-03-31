import { useEffect, useState } from "react";
import {
  Maze,
  MazeDirection,
  MazeDirectionMap,
  MazeDirections,
} from "../../commons/maze";

const MAZE_CELL_SIZE = 10;
const MAZE_PADDING = 1;

export function MazeRenderer(props: {
  maze: Maze;
  location: { x: number; y: number };
  direction: MazeDirection;
}): JSX.Element {
  const mazeWidth = props.maze[0].length;
  const mazeHeight = props.maze.length;

  const [rotation, setRotation] = useState(
    MazeDirections.indexOf(props.direction)
  );
  useEffect(() => {
    const rotationDiff =
      (MazeDirections.indexOf(props.direction) - rotation) % 4;
    setRotation(
      rotation +
        [
          rotationDiff - MazeDirections.length,
          rotationDiff,
          rotationDiff + MazeDirections.length,
        ].reduce((previous, current) =>
          Math.abs(previous) > Math.abs(current) ? current : previous
        )
    );
  }, [props.direction, rotation]);

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
          <g
            key={`${cell.location.x},${cell.location.y}`}
            stroke="#000"
            strokeWidth={0.6}
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
        fill="#ccc"
      />
      <path
        style={{ transition: "0.1s ease" }}
        transform={[
          "translate(",
          (props.location.x + 0.5) * MAZE_CELL_SIZE,
          ",",
          (props.location.y + 0.5) * MAZE_CELL_SIZE,
          ")",
          `rotate(${rotation * 90})`,
        ].join("")}
        d={[
          `M 0,-${MAZE_CELL_SIZE * 0.3}`,
          `L ${MAZE_CELL_SIZE * 0.2},${MAZE_CELL_SIZE * 0.3}`,
          `L 0,${MAZE_CELL_SIZE * 0.15}`,
          `L -${MAZE_CELL_SIZE * 0.2},${MAZE_CELL_SIZE * 0.3}`,
          "Z",
        ].join(" ")}
        fill="#f00"
      />
    </svg>
  );
}
