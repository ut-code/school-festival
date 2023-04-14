import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { objectiveFunction } from "../../objective";

export function GradRenderer(props: { x: number; y: number }) {
  /** case1 */
  const graph = () => {
    // サイズを指定
    const width = 350;
    const height = 350;
    // レンダラを作成
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#mycanvas") as HTMLCanvasElement,
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
      document.querySelector("#mycanvas")
    );

    const maxX = 300;
    const axisXLength = maxX * 2; // 矢印の長さ
    const axisXHeadLength = axisXLength * 0.05; // 矢印の頭の長さ
    const axisXHeadWidth = axisXHeadLength * 0.5; // 矢印の頭の太さ
    const directionX = new THREE.Vector3(1, 0, 0); // 矢印の向き(X方向)
    const startX = new THREE.Vector3(-maxX, 0, 0); // 矢印の始点
    const colorX = 0xff0000;
    const axisX = new THREE.ArrowHelper(
      directionX,
      startX,
      axisXLength + axisXHeadLength * 2,
      colorX,
      axisXHeadLength,
      axisXHeadWidth
    );
    scene.add(axisX);

    const maxY = 300;
    const axisYLength = maxY * 2; // 矢印の長さ
    const axisYHeadLength = axisYLength * 0.05; // 矢印の頭の長さ
    const axisYHeadWidth = axisYHeadLength * 0.5; // 矢印の頭の太さ
    const directionY = new THREE.Vector3(0, 1, 0); // 矢印の向き(Y方向)
    const startY = new THREE.Vector3(0, -maxY, 0); // 矢印の始点
    const colorY = 0x00ff00;
    const axisY = new THREE.ArrowHelper(
      directionY,
      startY,
      axisYLength + axisYHeadLength * 2,
      colorY,
      axisYHeadLength,
      axisYHeadWidth
    );
    scene.add(axisY);

    const maxZ = 300;
    const axisZLength = maxY * 2; // 矢印の長さ
    const axisZHeadLength = axisZLength * 0.05; // 矢印の頭の長さ
    const axisZHeadWidth = axisZHeadLength * 0.5; // 矢印の頭の太さ
    const directionZ = new THREE.Vector3(0, 0, 1); // 矢印の向き(Y方向)
    const startZ = new THREE.Vector3(0, 0, -maxZ); // 矢印の始点
    const colorZ = 0x0000ff;
    const axisZ = new THREE.ArrowHelper(
      directionZ,
      startZ,
      axisZLength + axisZHeadLength * 2,
      colorZ,
      axisZHeadLength,
      axisZHeadWidth
    );
    scene.add(axisZ);

    const vertices = [];
    vertices.push(props.x, objectiveFunction(props.x, props.y), props.y);
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
    // マテリアルを作成
    const material = new THREE.PointsMaterial({
      size: 10,
      color: 0xffffff,
    });

    // 物体を作成
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh); // シーンは任意の THREE.Scene インスタンス

    const point = [];
    point.push(
      props.x,
      0.002 * ((props.x - 200) ** 2 + (props.y - 100) ** 2),
      props.y
    );

    const geometryPoint = new THREE.BufferGeometry();
    geometryPoint.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(point, 3)
    );
    // マテリアルを作成
    const materialPoint = new THREE.PointsMaterial({
      size: 30,
      color: 0x00ffff,
    });

    // 物体を作成
    const meshPoint = new THREE.Points(geometryPoint, materialPoint);
    scene.add(meshPoint); // シーンは任意の THREE.Scene インスタンス

    // 毎フレーム時に実行されるループイベント
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
  return <canvas id="mycanvas" />;
}
