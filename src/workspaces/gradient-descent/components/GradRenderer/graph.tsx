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
    this.renderer = new THREE.WebGLRenderer({
      canvas: props.canvas,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(props.width, props.height);
    this.renderer.localClippingEnabled = true;

    this.camera = new THREE.PerspectiveCamera(60, props.width / props.height);
    this.camera.position.set(500, 500, 500);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.controls = new OrbitControls(this.camera, props.canvas);

    this.scene = new THREE.Scene();

    this.scene.add(this.point);
    this.scene.add(this.goal);

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

    this.scene.add(
      GradGraph.createPlane(0x00ff00, 3.0 * maxes[0], 3.0 * maxes[2], 64, 64, 0)
    );

    this.scene.add(
      GradGraph.createCube(0x00ff00, 3.0 * maxes[0], 100, 3.0 * maxes[2], -60)
    );

    this.createGraph(props.xAnswer, props.yAnswer);

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
    positionY: number
  ) {
    const geometry = new THREE.PlaneGeometry(
      width,
      height,
      widthSegments,
      heightSegments
    );
    const positionAttribute = geometry.attributes
      .position as THREE.BufferAttribute;
    for (let i = 0; i < positionAttribute.count; i += 1) {
      positionAttribute.setZ(i, Math.random() * 10);
    }
    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
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
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
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

  static createTwoTriangles(
    vertices: THREE.Vector3[],
    color: number,
    clippingPlane: THREE.Plane
  ) {
    const faces = [0, 1, 2, 3, 4, 5];

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(vertices);
    geometry.computeVertexNormals();

    geometry.setIndex(faces);

    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      clippingPlanes: [clippingPlane],
    });

    const twoTrianglesMesh = new THREE.Mesh(geometry, material);

    return twoTrianglesMesh;
  }

  createGraph(xAnswer: number, yAnswer: number) {
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1);
    const interval = 20.0;
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
        if (y0 > -50 && y1 > -50 && y2 > -50 && y3 > -50) {
          vertices.push(new THREE.Vector3(x, y0, z));
          vertices.push(new THREE.Vector3(x + interval, y1, z));
          vertices.push(new THREE.Vector3(x + interval, y2, z + interval));
          vertices.push(new THREE.Vector3(x, y0, z));
          vertices.push(new THREE.Vector3(x + interval, y2, z + interval));
          vertices.push(new THREE.Vector3(x, y3, z + interval));

          const mesh = GradGraph.createTwoTriangles(
            vertices,
            0x00ff00,
            clippingPlane
          );
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

    const goal = [
      xAnswer,
      objectiveFunction(xAnswer, yAnswer, xAnswer, yAnswer) + 10,
      yAnswer,
    ];
    this.updateGoalPosition(goal);
  }
}
