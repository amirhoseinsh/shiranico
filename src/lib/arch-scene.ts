import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { ARCH, ARC_SAMPLES, circleCenter, outerRadius, innerRadius, leftPeakAngle, rightPeakAngle, innerPeakAngle, progress, smooth, easeOut, mix } from "./arch-model";

export interface ArchScene {
  ready: Promise<unknown>;
  renderAt: (time: number) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}

export function createArchScene(canvas: HTMLCanvasElement, pixelRatio = Math.min(window.devicePixelRatio || 1, 2)): ArchScene {
  const context = canvas.getContext("webgl2", { alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: "low-power" });
  if (!context) throw new Error("WebGL2 unavailable");
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3.6, 3.6, 3.6, -3.6, .1, 50);
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0, 0);

  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromScene(environment, .06);
  scene.environment = environmentTarget.texture;
  environment.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xe8ebe9, 0x111a16, 1.2));
  const key = new THREE.DirectionalLight(0xf5f5f2, 3.8);
  key.position.set(-3.5, 5, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xbec6c2, 1.0);
  fill.position.set(4, 1, 3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0x00a693, 1.1);
  rim.position.set(3, 2, -3);
  scene.add(rim);

  const assembly = new THREE.Group();
  scene.add(assembly);
  const shape = new THREE.Shape();
  shape.moveTo(-ARCH.halfWidth, ARCH.bottom);
  shape.lineTo(-ARCH.halfWidth, 0);
  shape.absarc(circleCenter, 0, outerRadius, Math.PI, leftPeakAngle, true);
  shape.absarc(-circleCenter, 0, outerRadius, rightPeakAngle, 0, true);
  shape.lineTo(ARCH.halfWidth, ARCH.bottom);
  shape.lineTo(ARCH.halfWidth - ARCH.thickness, ARCH.bottom);
  shape.lineTo(ARCH.halfWidth - ARCH.thickness, 0);
  shape.absarc(-circleCenter, 0, innerRadius, 0, innerPeakAngle, false);
  shape.absarc(circleCenter, 0, innerRadius, Math.PI - innerPeakAngle, Math.PI, false);
  shape.lineTo(-ARCH.halfWidth + ARCH.thickness, ARCH.bottom);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, { depth: ARCH.depth, steps: 1, bevelEnabled: true, bevelThickness: ARCH.bevel, bevelSize: ARCH.bevel, bevelSegments: 5, curveSegments: 64 });
  geometry.translate(0, 0, -ARCH.depth / 2);
  const front = new THREE.MeshStandardMaterial({ color: 0x515754, roughness: .53, metalness: .32, envMapIntensity: .72, transparent: true, opacity: 0 });
  const sides = new THREE.MeshStandardMaterial({ color: 0x333c37, roughness: .45, metalness: .4, envMapIntensity: .8, transparent: true, opacity: 0 });
  const solid = new THREE.Mesh(geometry, [front, sides]);
  assembly.add(solid);

  const lineMaterials = [0, 1].map(() => new THREE.LineBasicMaterial({ color: 0xb8c8be, transparent: true, opacity: .65, toneMapped: false, depthTest: false }));
  const arcArrays = [new Float32Array((ARC_SAMPLES + 1) * 3), new Float32Array((ARC_SAMPLES + 1) * 3)];
  const arcGeometries = arcArrays.map(array => new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(array, 3).setUsage(THREE.DynamicDrawUsage)));
  const arcs = arcGeometries.map((geometry, index) => new THREE.Line(geometry, lineMaterials[index]));
  for (const arc of arcs) { arc.frustumCulled = false; arc.renderOrder = 2; assembly.add(arc); }

  const guideMaterial = new THREE.LineBasicMaterial({ color: 0x8ba597, transparent: true, opacity: .25, toneMapped: false, depthTest: false });
  const guideGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-3.3, 0, 0), new THREE.Vector3(3.3, 0, 0),
    new THREE.Vector3(-circleCenter, -.1, 0), new THREE.Vector3(-circleCenter, .1, 0),
    new THREE.Vector3(circleCenter, -.1, 0), new THREE.Vector3(circleCenter, .1, 0),
  ]);
  const guides = new THREE.LineSegments(guideGeometry, guideMaterial);
  assembly.add(guides);

  const legMaterial = new THREE.LineBasicMaterial({ color: 0xd4dfd8, transparent: true, opacity: 0, toneMapped: false, depthTest: false });
  const legArray = new Float32Array(12);
  const legGeometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(legArray, 3).setUsage(THREE.DynamicDrawUsage));
  const legs = new THREE.LineSegments(legGeometry, legMaterial);
  legs.frustumCulled = false;
  legs.renderOrder = 2;
  assembly.add(legs);

  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = 128; shadowCanvas.height = 128;
  const brush = shadowCanvas.getContext("2d")!;
  const gradient = brush.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(0,0,0,.45)"); gradient.addColorStop(.4, "rgba(0,0,0,.2)"); gradient.addColorStop(1, "rgba(0,0,0,0)");
  brush.fillStyle = gradient; brush.fillRect(0, 0, 128, 128);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
  const shadowGeometry = new THREE.PlaneGeometry(5, 2.7);
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, ARCH.bottom - .035, .1);
  assembly.add(shadow);

  let currentTime = 0;
  let disposed = false;
  function renderAt(time: number) {
    if (disposed) return;
    currentTime = time;
    const reveal = easeOut(progress(time, 2650, 3250));
    const settle = easeOut(progress(time, 3250, 4600));
    assembly.rotation.set(mix(0, .075, reveal) + .03 * settle, mix(0, -.34, reveal) - .079 * settle, 0);
    assembly.position.y = .08;
    solid.scale.z = mix(.001, 1, reveal);
    const opacity = smooth(progress(time, 2750, 3070));
    front.opacity = opacity; sides.opacity = opacity;
    solid.visible = opacity > 0;
    shadowMaterial.opacity = smooth(progress(time, 2850, 3650));
    guideMaterial.opacity = .23 * smooth(progress(time, 80, 750)) * (1 - smooth(progress(time, 2650, 3050)));

    for (let side = 0; side < 2; side++) {
      const array = arcArrays[side];
      const sourceCenter = side === 0 ? circleCenter : -circleCenter;
      const startAngle = side === 0 ? leftPeakAngle : 0;
      const endAngle = mix(startAngle + Math.PI * 2, side === 0 ? Math.PI : rightPeakAngle, reveal);
      for (let i = 0; i <= ARC_SAMPLES; i++) {
        const u = i / ARC_SAMPLES;
        const angle = mix(startAngle, endAngle, u);
        array[i * 3] = sourceCenter + Math.cos(angle) * outerRadius;
        array[i * 3 + 1] = Math.sin(angle) * outerRadius;
        array[i * 3 + 2] = ARCH.depth / 2 * reveal + .035;
      }
      arcGeometries[side].attributes.position.needsUpdate = true;
      const drawn = smooth(progress(time, side === 0 ? 60 : 390, side === 0 ? 1900 : 2200));
      arcGeometries[side].setDrawRange(0, Math.floor(drawn * (ARC_SAMPLES + 1)));
      lineMaterials[side].opacity = .62 * (1 - smooth(progress(time, 2750, 3100)));
      arcs[side].visible = time < 3100;
    }
    const legDepth = ARCH.depth / 2 * reveal + .035;
    legArray.set([-ARCH.halfWidth, 0, legDepth, -ARCH.halfWidth, ARCH.bottom * reveal, legDepth, ARCH.halfWidth, 0, legDepth, ARCH.halfWidth, ARCH.bottom * reveal, legDepth]);
    legGeometry.attributes.position.needsUpdate = true;
    legMaterial.opacity = .65 * smooth(progress(time, 2650, 2800)) * (1 - smooth(progress(time, 2920, 3300)));
    rim.intensity = .65 + .45 * settle;
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
    renderAt(currentTime);
  }

  resize(canvas.clientWidth || 720, canvas.clientHeight || 720);
  solid.visible = true;
  const ready = renderer.compileAsync(scene, camera);
  return {
    ready,
    renderAt,
    resize,
    dispose() {
      if (disposed) return;
      disposed = true;
      geometry.dispose(); front.dispose(); sides.dispose();
      for (const geometry of arcGeometries) geometry.dispose();
      for (const material of lineMaterials) material.dispose();
      guideGeometry.dispose(); guideMaterial.dispose(); legGeometry.dispose(); legMaterial.dispose();
      shadowGeometry.dispose(); shadowMaterial.dispose(); shadowTexture.dispose(); environmentTarget.dispose();
      renderer.dispose();
    },
  };
}
