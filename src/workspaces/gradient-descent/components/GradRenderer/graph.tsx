import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { objectiveFunction } from "../../objective";

export class GradGraph {
  camera: THREE.PerspectiveCamera;

  renderer: THREE.WebGLRenderer;

  controls: OrbitControls;

  scene: THREE.Scene;

  constructor(props: {
    xAnswer: number;
    yAnswer: number;
    width: number;
    height: number;
  }) {
    // レンダラを作成
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#graph") as HTMLCanvasElement,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(props.width, props.height);

    this.camera = new THREE.PerspectiveCamera(60, props.width / props.height);
    this.camera.position.set(500, 500, 500);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // シーンを作成
    this.scene = new THREE.Scene();

    // 座標軸を作成
    const maxes = [300, 300, 300];
    const directions = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1),
    ];
    const colors = [0xff0000, 0x00ff00, 0x0000ff];

    for (let i = 0; i < 3; i += 1) {
      const axis = GradGraph.createAxis(maxes[i], directions[i], colors[i]);
      this.scene.add(axis);
    }

    // カメラをカーソルで操作できるようにする
    this.controls = new OrbitControls(
      this.camera,
      document.querySelector("#graph") as HTMLElement
    );

    const interval = 30.0;
    for (let x = -1.5 * maxes[0]; x <= 1.5 * maxes[0]; x += interval) {
      for (let z = -1.5 * maxes[2]; z <= 1.5 * maxes[2]; z += interval) {
        const vertices = [];
        const y0 = objectiveFunction(x, z, props.xAnswer, props.yAnswer);
        const y1 = objectiveFunction(
          x + interval,
          z,
          props.xAnswer,
          props.yAnswer
        );
        const y2 = objectiveFunction(
          x + interval,
          z + interval,
          props.xAnswer,
          props.yAnswer
        );
        const y3 = objectiveFunction(
          x,
          z + interval,
          props.xAnswer,
          props.yAnswer
        );
        vertices.push(new THREE.Vector3(x, y0, z));
        vertices.push(new THREE.Vector3(x + interval, y1, z));
        vertices.push(new THREE.Vector3(x + interval, y2, z + interval));
        vertices.push(new THREE.Vector3(x, y3, z + interval));

        const mesh = GradGraph.createTriangle(vertices, 0xffffff);
        this.scene.add(mesh);
      }
    }
  }

  static createAxis(max: number, direction: THREE.Vector3, color: number) {
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

  static createMeshOfPoints(
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

  static createTriangle(vertices: THREE.Vector3[], color: number) {
    // ポリゴン面を構成する頂点のインデックス (Face3の代替となる情報)
    const faces = [0, 1, 2, 0, 2, 3];

    const geometry = new THREE.BufferGeometry();

    // 頂点情報をBufferGeometryにセット
    // BufferAttributeを生成する代わりに、setFromPointsを呼ぶと内部でいいようにやってくれる
    geometry.setFromPoints(vertices);

    // ポリゴン面を構成する頂点のインデックスをセット
    geometry.setIndex(faces);

    const material = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true,
    });

    const triangleMesh = new THREE.Mesh(geometry, material);

    return triangleMesh;
  }

  addToScene(mesh: THREE.Points) {
    this.scene.add(mesh);
  }

  controlsUpdate() {
    this.controls.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
