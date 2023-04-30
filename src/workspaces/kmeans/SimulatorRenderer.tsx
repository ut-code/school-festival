import { chakra, keyframes } from "@chakra-ui/react";
import { Vector2D, Cluster } from "./types";

const ColorList = ["red", "blue", "green"];

const highlight = keyframes({
  "0%": {
    strokeOpacity: "1",
  },
  "100%": {
    strokeOpacity: "0",
  },
});

export function SimulatorRenderer(props: {
  clusters: Cluster[];
  lines: { vector1: Vector2D; vector2: Vector2D }[];
  centers: { vectors: Vector2D[] };
}): JSX.Element {
  return (
    <svg width="100%" viewBox="-50 -50 205 205">
      {props.clusters.map((cluster_, index1) =>
        cluster_.vectors.map((vector_) => (
          <chakra.circle
            animation={`${highlight} 1s ease-in-out`}
            cx={`${vector_.x}`}
            cy={`${vector_.y}`}
            r="1.2"
            fill={`${ColorList[cluster_.clusterNumber]}`}
            stroke="orange"
            strokeOpacity={0}
            strokeWidth={7}
            // eslint-disable-next-line react/no-array-index-key
            key={`${index1},${vector_.x},${vector_.y}`}
          />
        ))
      )}
      {props.lines.map((line) => (
        <chakra.path
          animation={`${highlight} 1s linear`}
          stroke="black"
          strokeOpacity={0}
          strokeWidth={2}
          d={`M${line.vector1.x},${line.vector1.y} L${line.vector2.x},${line.vector2.y}`}
          key={`${line.vector1.x},${line.vector1.y},${line.vector2.x},${line.vector2.y}`}
        />
      ))}
      {props.centers.vectors.map((center: Vector2D, index: number) => (
        <chakra.circle
          cx={`${center.x}`}
          cy={`${center.y}`}
          r="2"
          fill={`${ColorList[index]}`}
          stroke="black"
          // eslint-disable-next-line react/no-array-index-key
          key={`${index},${center.x},${center.y}`}
        />
      ))}
    </svg>
  );
}
