import { cluster } from "./blocks";

const ColorList = ["red", "blue", "green"];

export function SimulatorRenderer(props: { clusters: cluster[] }): JSX.Element {
  return (
    <svg width="100%" viewBox="-5 -5 110 110">
      {props.clusters.map((cluster_) =>
        cluster_.datas.map((data) => (
          <circle
            cx={`${data.x}`}
            cy={`${data.y}`}
            r="1"
            fill={`${ColorList[cluster_.n]}`}
            key={data.x}
          />
        ))
      )}
    </svg>
  );
}
