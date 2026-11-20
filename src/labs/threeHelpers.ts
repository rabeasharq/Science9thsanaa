import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export interface ThreeStudioContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  isSoftwareGl: boolean;
  afterDraw: (cb: () => void) => void;
  setActiveFrameId: (id: number) => void;
  dispose: () => void;
}

export function initThreeStudio(
  mountEl: HTMLElement,
  options?: {
    backgroundHex?: number;
    cameraPos?: [number, number, number];
    target?: [number, number, number];
    fov?: number;
  }
): ThreeStudioContext {
  const isSoftwareGl = detectSoftwareGl();
  const width = Math.max(300, mountEl.clientWidth || 640);
  const height = Math.max(260, mountEl.clientHeight || 420);

  const scene = new THREE.Scene();
  const bgHex = options?.backgroundHex ?? 0x0f172a;
  scene.background = new THREE.Color(bgHex);
  scene.fog = new THREE.FogExp2(bgHex, 0.025);

  const camera = new THREE.PerspectiveCamera(options?.fov ?? 45, width / height, 0.1, 100);
  const [cx, cy, cz] = options?.cameraPos ?? [0, 3.6, 7.2];
  camera.position.set(cx, cy, cz);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isSoftwareGl,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  mountEl.innerHTML = '';
  mountEl.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  // Studio environment reflection on every device
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const roomEnv = new RoomEnvironment();
  const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
  scene.environment = envRT.texture;
  roomEnv.dispose();
  pmremGenerator.dispose();

  // Warm/Cool 3-point studio lighting
  const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.75);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.5);
  keyLight.position.set(5, 8, 6);
  keyLight.castShadow = !isSoftwareGl;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.left = -6;
  keyLight.shadow.camera.right = 6;
  keyLight.shadow.camera.top = 6;
  keyLight.shadow.camera.bottom = -6;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.normalBias = 0.02;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.55);
  rimLight.position.set(-5, 4, -5);
  scene.add(rimLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !isSoftwareGl;
  controls.dampingFactor = 0.06;
  controls.minDistance = 2.5;
  controls.maxDistance = 16;
  controls.maxPolarAngle = Math.PI / 2 - 0.04;
  const [tx, ty, tz] = options?.target ?? [0, 0.8, 0];
  controls.target.set(tx, ty, tz);
  controls.update();

  let currentFrameId = 0;
  let disposed = false;

  const afterDraw = (cb: () => void) => {
    if (disposed) return;
    const gl = renderer.getContext() as WebGL2RenderingContext;
    if (!gl || typeof gl.fenceSync !== 'function') {
      currentFrameId = window.setTimeout(cb, 80);
      return;
    }
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (disposed) {
        if (sync) gl.deleteSync(sync);
        return;
      }
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        currentFrameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        currentFrameId = window.setTimeout(cb, 80);
      }
    };
    currentFrameId = window.setTimeout(poll, 5);
  };

  const onResize = () => {
    if (disposed) return;
    const w = Math.max(300, mountEl.clientWidth);
    const h = Math.max(260, mountEl.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(mountEl);

  const handleContextLost = (e: Event) => {
    e.preventDefault();
  };
  renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(currentFrameId);
    clearTimeout(currentFrameId);
    resizeObserver.disconnect();
    renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
    controls.dispose();
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      if (mesh.material) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const std = m as THREE.MeshStandardMaterial;
          std.map?.dispose();
          m.dispose();
        });
      }
    });
    envRT.dispose();
    renderer.dispose();
  };

  return {
    scene,
    camera,
    renderer,
    controls,
    isSoftwareGl,
    afterDraw,
    setActiveFrameId: (id: number) => {
      currentFrameId = id;
    },
    dispose,
  };
}

export function makeLabBench(width = 9, depth = 5): THREE.Group {
  const group = new THREE.Group();

  // Slate bench top with subtle procedural grid texture
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);

  const topGeo = new THREE.BoxGeometry(width, 0.24, depth);
  const topMat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.55,
    metalness: 0.15,
  });
  const topMesh = new THREE.Mesh(topGeo, topMat);
  topMesh.position.y = -0.12;
  topMesh.receiveShadow = true;
  group.add(topMesh);

  // Brushed aluminum trim rail
  const trimGeo = new THREE.BoxGeometry(width + 0.08, 0.08, depth + 0.08);
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.3,
    metalness: 0.85,
  });
  const trimMesh = new THREE.Mesh(trimGeo, trimMat);
  trimMesh.position.y = -0.26;
  group.add(trimMesh);

  return group;
}
