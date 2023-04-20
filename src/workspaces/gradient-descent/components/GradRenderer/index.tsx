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

function createMeshOfPoints(
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
    // 現在の位置を表示
    const point = [
      props.x,
      objectiveFunction(props.x, props.y, props.xAnswer, props.yAnswer),
      props.y,
    ];
    const meshOfPoint = createMeshOfPoints(0x00ffff, 30, point, false, 1.0);
    gradGraph.addToScene(meshOfPoint);

    // 目標地点を表示
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
    const meshOfGoal = createMeshOfPoints(0xff0000, 30, goal, false, 1.0);
    gradGraph.addToScene(meshOfGoal);

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
  return <canvas id="graph" />;
}
