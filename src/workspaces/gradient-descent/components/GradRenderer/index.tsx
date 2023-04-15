import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { objectiveFunction } from "../../objective";

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

  const graph = () => {
    // サイズを指定
    const width = 350;
    const height = 350;
    // レンダラを作成
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#graph") as HTMLCanvasElement,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    // シーンを作成
    const scene = new THREE.Scene();
    // カメラを作成
    const camera = new THREE.PerspectiveCamera(60, width / height);
    camera.position.set(500, 500, 500);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    const controls = new OrbitControls(
      camera,
      document.querySelector("#graph") as HTMLElement
    );

    const maxX = 300;
    const directionX = new THREE.Vector3(1, 0, 0);
    const colorX = 0xff0000;
    const axisX = createAxis(maxX, directionX, colorX);
    scene.add(axisX);

    const maxY = 300;
    const directionY = new THREE.Vector3(0, 1, 0);
    const colorY = 0x00ff00;
    const axisY = createAxis(maxY, directionY, colorY);
    scene.add(axisY);

    const maxZ = 300;
    const directionZ = new THREE.Vector3(0, 0, 1);
    const colorZ = 0x0000ff;
    const axisZ = createAxis(maxZ, directionZ, colorZ);
    scene.add(axisZ);

    // 3次元グラフを点群で表現
    const vertices = [];
    for (let x = -1.5 * maxX; x <= 1.5 * maxX; x += 10) {
      for (let z = -1.5 * maxZ; z <= 1.5 * maxZ; z += 10) {
        const y = objectiveFunction(x, z);
        vertices.push(x, y, z);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    const material = new THREE.PointsMaterial({
      size: 10,
      color: 0xffffff,
    });
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);

    // 現在の位置
    const point = [];
    point.push(props.x, objectiveFunction(props.x, props.y), props.y);
    const geometryPoint = new THREE.BufferGeometry();
    geometryPoint.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(point, 3)
    );
    const materialPoint = new THREE.PointsMaterial({
      size: 30,
      color: 0x00ffff,
    });
    const meshPoint = new THREE.Points(geometryPoint, materialPoint);
    scene.add(meshPoint);

    // 目標地点
    const goal = [];
    goal.push(200, objectiveFunction(200, 100), 100);
    const geometryGoal = new THREE.BufferGeometry();
    geometryGoal.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(goal, 3)
    );
    const materialGoal = new THREE.PointsMaterial({
      size: 30,
      color: 0xff0000,
    });
    const meshGoal = new THREE.Points(geometryGoal, materialGoal);
    scene.add(meshGoal);

    // 毎フレーム時に実行
    function tick() {
      controls.update();
      renderer.render(scene, camera);
      // レンダリング
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
