import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { objectiveFunction } from "../../objective";

// カメラを作成
const width = 350;
const height = 350;
const camera = new THREE.PerspectiveCamera(60, width / height);
camera.position.set(500, 500, 500);
camera.lookAt(new THREE.Vector3(0, 0, 0));

export function GradResetCamera() {
  camera.position.set(500, 500, 500);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

export function GradRenderer(props: { x: number; y: number }) {
  function createAxis(max: number, direction: THREE.Vector3, color: number) {
    const axisLength = max * 2;
    const axisHeadLength = axisLength * 0.05;
    const axisHeadWidth = axisHeadLength * 0.5;
    const start = new THREE.Vector3(
      -max * direction.x,
      -max * direction.y,
      -max * direction.z
    );
    const axis = new THREE.ArrowHelper(
      direction,
      start,
      axisLength + axisHeadLength * 2,
      color,
      axisHeadLength,
      axisHeadWidth
    );
    return axis;
  }
  function createMeshOfPoints(color: number, size: number, points: number[]) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );
    const material = new THREE.PointsMaterial({
      size,
      color,
    });
    const mesh = new THREE.Points(geometry, material);
    return mesh;
  }

  const graph = () => {
    // レンダラを作成
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#graph") as HTMLCanvasElement,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // シーンを作成
    const scene = new THREE.Scene();

    // 座標軸を作成
    const maxes = [300, 300, 300];
    const directions = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1),
    ];
    const colors = [0xff0000, 0x00ff00, 0x0000ff];

    for (let i = 0; i < 3; i += 1) {
      const axis = createAxis(maxes[i], directions[i], colors[i]);
      scene.add(axis);
    }

    // カメラをカーソルで操作できるようにする
    const controls = new OrbitControls(
      camera,
      document.querySelector("#graph") as HTMLElement
    );

    // 3次元グラフを点群で表示
    const vertices = [];
    for (let x = -1.5 * maxes[0]; x <= 1.5 * maxes[0]; x += 10) {
      for (let z = -1.5 * maxes[2]; z <= 1.5 * maxes[2]; z += 10) {
        const y = objectiveFunction(x, z);
        vertices.push(x, y, z);
      }
    }
    const meshOfGraph = createMeshOfPoints(0xffffff, 10, vertices);
    scene.add(meshOfGraph);

    // 現在の位置を表示
    const point = [props.x, objectiveFunction(props.x, props.y), props.y];
    const meshOfPoint = createMeshOfPoints(0x00ffff, 30, point);
    scene.add(meshOfPoint);

    // 目標地点を表示
    const goal = [200, objectiveFunction(200, 100), 100];
    const meshOfGoal = createMeshOfPoints(0xff0000, 30, goal);
    scene.add(meshOfGoal);

    // 毎フレーム時に実行
    function tick() {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();
  };
  // didMountで描画しないと、Cannot read property 'width' of nullというエラーが出る
  useEffect(() => {
    graph();
  });
  return <canvas id="graph" />;
}
