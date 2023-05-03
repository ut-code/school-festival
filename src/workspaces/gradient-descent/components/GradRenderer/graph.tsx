import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { objectiveFunction } from "../../objective";

const maxes = [500, 500, 500];

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

export class GradGraph {
  camera: THREE.PerspectiveCamera;

  renderer: THREE.WebGLRenderer;

  controls: OrbitControls;

  directionalLight: THREE.DirectionalLight;

  scene: THREE.Scene;

  point = createMeshOfPoints(0x00ffff, 30, [0, 0, 0], false, 1.0);

  goal = createMeshOfPoints(0xff0000, 30, [0, 0, 0], false, 1.0);

  constructor(props: {
    xAnswer: number;
    yAnswer: number;
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
  }) {
    // レンダラを作成
    this.renderer = new THREE.WebGLRenderer({
      canvas: props.canvas,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(props.width, props.height);

    this.camera = new THREE.PerspectiveCamera(60, props.width / props.height);
    this.camera.position.set(500, 500, 500);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.near = 0;

    // カメラをカーソルで操作できるようにする
    this.controls = new OrbitControls(this.camera, props.canvas);

    // シーンを作成
    this.scene = new THREE.Scene();

    this.scene.add(this.point);
    this.scene.add(this.goal);

    // 座標軸を作成
    const directions = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1),
    ];
    const axesColors = [0xff0000, 0x00ff00, 0x0000ff];

    for (let i = 0; i < 3; i += 1) {
      const axis = GradGraph.createAxis(maxes[i], directions[i], axesColors[i]);
      this.scene.add(axis);
    }

    this.createGraph(props.xAnswer, props.yAnswer);

    this.scene.add(
      GradGraph.createPlane(
        0x00ff00,
        3.0 * maxes[0],
        3.0 * maxes[2],
        64,
        64,
        true,
        1.0,
        0
      )
    );

    this.scene.add(
      GradGraph.createCube(0x00ff00, 3.0 * maxes[0], 100, 3.0 * maxes[2], -60)
    );

    this.directionalLight = new THREE.DirectionalLight(0x00ff00, 1);
    this.directionalLight.position.x = 100;
    this.directionalLight.position.y = 300;
    this.directionalLight.position.z = 0;
    this.scene.add(this.directionalLight);
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

  static createPlane(
    color: number,
    width: number,
    height: number,
    widthSegments: number,
    heightSegments: number,
    transparent: boolean,
    opacity: number,
    positionY: number
  ) {
    const geometry = new THREE.PlaneGeometry(
      width,
      height,
      widthSegments,
      heightSegments
    );
    const positionAttribute = geometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i += 1) {
      positionAttribute.setXYZ(
        i,
        positionAttribute.array[3 * i],
        positionAttribute.array[3 * i + 1],
        Math.random() * 10
      );
    }
    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      opacity,
      transparent,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.set(Math.PI / 2, 0, 0);
    plane.position.set(0, positionY, 0);
    return plane;
  }

  static createCube(
    color: number,
    lengthX: number,
    lengthY: number,
    lengthZ: number,
    positionY: number
  ) {
    const geometry = new THREE.BoxGeometry(lengthX, lengthY, lengthZ);
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      clippingPlanes: [clippingPlane],
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = positionY;
    return cube;
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
    const faces = [0, 1, 2, 3, 4, 5];

    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    const geometry = new THREE.BufferGeometry();

    // 頂点情報をBufferGeometryにセット
    // BufferAttributeを生成する代わりに、setFromPointsを呼ぶと内部でいいようにやってくれる
    geometry.setFromPoints(vertices);

    geometry.computeVertexNormals();

    // ポリゴン面を構成する頂点のインデックスをセット
    geometry.setIndex(faces);

    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      opacity: 1.0,
      transparent: true,
      clippingPlanes: [clippingPlane],
    });

    const triangleMesh = new THREE.Mesh(geometry, material);

    return triangleMesh;
  }

  createGraph(xAnswer: number, yAnswer: number) {
    const interval = 30.0;
    for (let x = -2.0 * maxes[0]; x <= 2.0 * maxes[0]; x += interval) {
      for (let z = -2.0 * maxes[2]; z <= 2.0 * maxes[2]; z += interval) {
        const vertices = [];
        const y0 = objectiveFunction(x, z, xAnswer, yAnswer);
        const y1 = objectiveFunction(x + interval, z, xAnswer, yAnswer);
        const y2 = objectiveFunction(
          x + interval,
          z + interval,
          xAnswer,
          yAnswer
        );
        const y3 = objectiveFunction(x, z + interval, xAnswer, yAnswer);

        if (y1 > -200 && y2 > -200 && y3 > -200) {
          vertices.push(new THREE.Vector3(x, y0, z));
          vertices.push(new THREE.Vector3(x + interval, y1, z));
          vertices.push(new THREE.Vector3(x + interval, y2, z + interval));
          vertices.push(new THREE.Vector3(x, y0, z));
          vertices.push(new THREE.Vector3(x + interval, y2, z + interval));
          vertices.push(new THREE.Vector3(x, y3, z + interval));

          const mesh = GradGraph.createTriangle(vertices, 0x00ff00);
          this.scene.add(mesh);
        }
      }
    }
  }

  addToScene(mesh: THREE.Points) {
    this.scene.add(mesh);
  }

  updatePointPosition(position: number[]) {
    [this.point.position.x, this.point.position.y, this.point.position.z] =
      position;
  }

  updateGoalPosition(position: number[]) {
    [this.goal.position.x, this.goal.position.y, this.goal.position.z] =
      position;
  }

  controlsUpdate() {
    this.controls.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  resetCamera() {
    this.camera.position.set(500, 500, 500);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  update(x: number, y: number, xAnswer: number, yAnswer: number) {
    const point = [x, objectiveFunction(x, y, xAnswer, yAnswer) + 10, y];
    this.updatePointPosition(point);

    // 目標地点を更新
    const goal = [
      xAnswer,
      objectiveFunction(xAnswer, yAnswer, xAnswer, yAnswer) + 10,
      yAnswer,
    ];
    this.updateGoalPosition(goal);
  }
}
