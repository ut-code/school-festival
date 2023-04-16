import { cluster } from "./blocks";

const ColorList = ["red", "blue", "green"];

export function SimulatorRenderer(props: { clusters: cluster[] }): JSX.Element {
  return (
    <svg width="100%" viewBox="-5 -5 110 110">
      {props.clusters.map((cluster_, index1) =>
        cluster_.datas.map((data, index2) => (
          <circle
            cx={`${data.x}`}
            cy={`${data.y}`}
            r="1"
            fill={`${ColorList[cluster_.n]}`}
            // eslint-disable-next-line react/no-array-index-key
            key={`${index1},${index2}`}
          />
        ))
      )}
    </svg>
  );
}
