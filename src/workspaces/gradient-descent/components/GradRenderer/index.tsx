import { useEffect } from "react";
import * as THREE from "three";
import { objectiveFunction } from "../../objective";
import { GradGraph } from "./graph";

const width = 350;
const height = 350;

let gradGraph: GradGraph;

export function GradResetCamera() {
  gradGraph.camera.position.set(500, 500, 500);
  gradGraph.camera.lookAt(new THREE.Vector3(0, 0, 0));
}

export function GradCreateGraph(xAnswer: number, yAnswer: number) {
  gradGraph = new GradGraph({
    xAnswer,
    yAnswer,
    width,
    height,
  });
}

export function createMeshOfPoints(
  color: number,
  size: number,
  points: number[],
  transparent: boolean,
  opacity: number
) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points, 3)
  );
  const material = new THREE.PointsMaterial({
    size,
    color,
    transparent,
    opacity,
  });
  const mesh = new THREE.Points(geometry, material);
  return mesh;
}

export function GradRenderer(props: {
  x: number;
  y: number;
  xAnswer: number;
  yAnswer: number;
}) {
  const updateGraph = () => {
    // 現在の位置を更新
    const point = [
      props.x,
      objectiveFunction(props.x, props.y, props.xAnswer, props.yAnswer),
      props.y,
    ];
    gradGraph.updatePointPosition(point);

    // 目標地点を更新
    const goal = [
      props.xAnswer,
      objectiveFunction(
        props.xAnswer,
        props.yAnswer,
        props.xAnswer,
        props.yAnswer
      ),
      props.yAnswer,
    ];
    gradGraph.updateGoalPosition(goal);

    // 毎フレーム時に実行
    function tick() {
      gradGraph.controlsUpdate();
      gradGraph.render();
      requestAnimationFrame(tick);
    }
    tick();
  };
  // didMountで描画しないと、Cannot read property 'width' of nullというエラーが出る
  useEffect(() => {
    if (!gradGraph && document.querySelector("#graph")) {
      GradCreateGraph(props.xAnswer, props.yAnswer);
    }
    if (gradGraph) {
      updateGraph();
    }
  });
  return (
    <canvas
      id="graph"
      style={{ backgroundImage: "radial-gradient(#000000, #c0c0c0)" }}
    />
  );
}
