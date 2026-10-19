import * as THREE from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { ARCH, ARC_SAMPLES, circleCenter, outerRadius, innerRadius, innerPeak, leftPeakAngle, rightPeakAngle, progress, smooth, easeOut, mix } from "./arch-model";

export interface ArchScene {
  ready: Promise<unknown>;
  renderAt: (time: number) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}

/** Explicit architectural contours: no filled faces or triangulated wireframe. */
export function createArchScene(canvas: HTMLCanvasElement, pixelRatio = Math.min(window.devicePixelRatio || 1, 2)): ArchScene {
  const context = canvas.getContext("webgl2", { alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: "low-power" });
  if (!context) throw new Error("WebGL2 unavailable");
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3.6, 3.6, 3.6, -3.6, .1, 50);
  camera.position.set(0, 0, 14);
  const assembly = new THREE.Group();
  scene.add(assembly);
  const materials: LineMaterial[] = [];
  const geometries: LineGeometry[] = [];

  function line(points: number[], color: number, width: number) {
    const geometry = new LineGeometry().setPositions(points);
    const material = new LineMaterial({ color, linewidth: width, transparent: true, opacity: 0, depthTest: false, depthWrite: false, toneMapped: false });
    const object = new Line2(geometry, material);
    object.frustumCulled = false;
    assembly.add(object);
    materials.push(material);
    geometries.push(geometry);
    return object;
  }

  function curve(side: number, radius: number, start: number, end: number, z: number, samples = ARC_SAMPLES) {
    const points: number[] = [];
    for (let i = 0; i <= samples; i++) {
      const angle = mix(start, end, i / samples);
      points.push((side === 0 ? circleCenter : -circleCenter) + Math.cos(angle) * radius, Math.sin(angle) * radius, z);
    }
    return points;
  }

  function contour(radius: number, z: number) {
    const halfWidth = radius - circleCenter;
    const peakAngle = Math.acos(circleCenter / radius);
    return [
      -halfWidth, ARCH.bottom, z,
      ...curve(0, radius, Math.PI, Math.PI - peakAngle, z),
      ...curve(1, radius, peakAngle, 0, z).slice(3),
      halfWidth, ARCH.bottom, z,
    ];
  }

  const frontZ = ARCH.depth / 2;
  const rearZ = -frontZ;
  // The two circles become the principal front curves; they never disappear.
  const arcs = [0, 1].map(side => line(curve(side, outerRadius, 0, Math.PI * 2, frontZ), 0xd4d4d4, 1.05));
  const constructionEchoes = [0, 1].map(side => line(curve(side, outerRadius, 0, Math.PI * 2, 0), 0x9b9b9b, .6));
  const legs = [-1, 1].map(side => line([side * ARCH.halfWidth, 0, frontZ, side * ARCH.halfWidth, ARCH.bottom, frontZ], 0xd4d4d4, 1.05));
  const innerFront = line(contour(innerRadius, frontZ), 0x00a693, .9);
  const outerRear = line(contour(outerRadius, rearZ), 0x00a693, .8);
  const innerRear = line(contour(innerRadius, rearZ), 0x00a693, .7);

  // Six depth connections: four foot corners and the two pointed crowns.
  const anchors = [
    [-ARCH.halfWidth, ARCH.bottom], [ARCH.halfWidth, ARCH.bottom],
    [-ARCH.halfWidth + ARCH.thickness, ARCH.bottom], [ARCH.halfWidth - ARCH.thickness, ARCH.bottom],
    [0, ARCH.peak], [0, innerPeak],
  ];
  const connections = anchors.map(([x, y]) => line([x, y, frontZ, x, y, rearZ], 0x00a693, .75));
  const caps = [-1, 1].flatMap(side => [frontZ, rearZ].map(z => line([
    side * ARCH.halfWidth, ARCH.bottom, z, side * (ARCH.halfWidth - ARCH.thickness), ARCH.bottom, z,
  ], 0xa8a8a8, .7)));

  // A localized, low-opacity blue trace behind the rear crown, never a surface.
  const haloPoints = curve(0, outerRadius, Math.PI - .14, leftPeakAngle, rearZ, 48);
  const halos = [12, 7, 3].map(width => line(haloPoints, 0x1c39bb, width));
  halos.forEach(halo => { halo.renderOrder = -1; });

  const guides = [
    line([-3.3, 0, 0, 3.3, 0, 0], 0x9b9b9b, .6),
    ...[-circleCenter, circleCenter].map(x => line([x, -.1, 0, x, .1, 0], 0x9b9b9b, .6)),
  ];

  // Update the existing interleaved buffer rather than allocating GPU buffers per frame.
  function updatePoints(object: Line2, points: number[]) {
    const start = object.geometry.attributes.instanceStart as THREE.InterleavedBufferAttribute;
    const end = object.geometry.attributes.instanceEnd as THREE.InterleavedBufferAttribute;
    for (let i = 0; i < points.length / 3 - 1; i++) {
      start.setXYZ(i, points[i * 3], points[i * 3 + 1], points[i * 3 + 2]);
      end.setXYZ(i, points[i * 3 + 3], points[i * 3 + 4], points[i * 3 + 5]);
    }
    start.data.needsUpdate = true;
  }

  let currentTime = 0;
  let disposed = false;
  function renderAt(time: number) {
    if (disposed) return;
    currentTime = time;
    const reveal = easeOut(progress(time, 2650, 3250));
    const settle = easeOut(progress(time, 3250, 4600));
    const detail = smooth(progress(time, 2710, 3300));
    const rear = smooth(progress(time, 2820, 3500));
    assembly.rotation.set(.075 * reveal + .03 * settle, -.34 * reveal - .079 * settle, 0);
    assembly.position.y = .08;
    assembly.scale.z = mix(.001, 1, reveal);

    for (let side = 0; side < 2; side++) {
      const start = side === 0 ? leftPeakAngle : 0;
      const end = mix(start + Math.PI * 2, side === 0 ? Math.PI : rightPeakAngle, reveal);
      updatePoints(arcs[side], curve(side, outerRadius, start, end, frontZ));
      arcs[side].geometry.instanceCount = Math.floor(ARC_SAMPLES * smooth(progress(time, side === 0 ? 60 : 390, side === 0 ? 1900 : 2200)));
      arcs[side].material.opacity = .62 + .22 * reveal;
      const x = (side === 0 ? -1 : 1) * ARCH.halfWidth;
      updatePoints(legs[side], [x, 0, frontZ, x, ARCH.bottom * reveal, frontZ]);
      legs[side].material.opacity = .84 * smooth(progress(time, 2650, 2850));
    }
    innerFront.material.opacity = .8 * detail;
    outerRear.material.opacity = .44 * rear;
    innerRear.material.opacity = .28 * rear;
    connections.forEach(edge => { edge.material.opacity = .43 * rear; });
    caps.forEach(edge => { edge.material.opacity = .44 * detail; });
    halos.forEach((halo, index) => { halo.material.opacity = (.006 + .003 * index) * rear; });
    constructionEchoes.forEach(echo => { echo.material.opacity = .12 * reveal * (1 - smooth(progress(time, 3250, 3650))); });
    guides.forEach(guide => { guide.material.opacity = .23 * smooth(progress(time, 80, 750)) * (1 - smooth(progress(time, 3250, 3650))); });
    renderer.render(scene, camera);
  }

  function resize(width: number, height: number) {
    if (disposed || width <= 0 || height <= 0) return;
    const aspect = width / height;
    const viewHeight = Math.max(ARCH.viewSize, ARCH.viewSize / aspect);
    camera.left = -viewHeight * aspect / 2;
    camera.right = viewHeight * aspect / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    materials.forEach(material => material.resolution.set(width, height));
    renderAt(currentTime);
  }

  resize(canvas.clientWidth || 720, canvas.clientHeight || 720);
  return {
    ready: renderer.compileAsync(scene, camera),
    renderAt,
    resize,
    dispose() {
      if (disposed) return;
      disposed = true;
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      renderer.dispose();
    },
  };
}
