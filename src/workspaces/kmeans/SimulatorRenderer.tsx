import { data, cluster } from "./blocks";
import styles from "./SimulatorRenderer.module.css";

const ColorList = ["red", "blue", "green"];

export function SimulatorRenderer(props: {
  clusters: cluster[];
  lines: { data1: data; data2: data }[];
  centers: { datas: data[] };
}): JSX.Element {
  return (
    <svg width="100%" viewBox="-50 -50 205 205">
      {props.clusters.map((cluster_, index1) =>
        cluster_.datas.map((data_) => (
          <circle
            className={styles.rerender}
            cx={`${data_.x}`}
            cy={`${data_.y}`}
            r="1.2"
            fill={`${ColorList[cluster_.n]}`}
            // eslint-disable-next-line react/no-array-index-key
            key={`${index1},${data_.x},${data_.y}`}
          />
        ))
      )}
      {props.lines.map((line) => (
        <path
          className={styles.rerender}
          d={`M${line.data1.x},${line.data1.y} L${line.data2.x},${line.data2.y}`}
          key={`${line.data1.x},${line.data1.y},${line.data2.x},${line.data2.y}`}
        />
      ))}
      {props.centers.datas.map((center: data, index: number) => (
        <circle
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
