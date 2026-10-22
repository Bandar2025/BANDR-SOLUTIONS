import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Language, UI_TRANSLATIONS } from '../data/portfolioData';
import { HeroStaticEmblem } from './HeroStaticEmblem';

interface HeroScene3DProps {
  lang: Language;
  onSwitchToStatic: () => void;
}

type FinishPreset = 'cobalt' | 'titanium' | 'gold';
type CameraPreset = 'isometric' | 'front' | 'top';

// Pre-allocated module-scope math helpers (Zero GC in the render loop)
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3(0, 0.15, 0);
const _tempMatrix = new THREE.Matrix4();
const _tempPos = new THREE.Vector3();
const _tempQuat = new THREE.Quaternion();
const _tempScale = new THREE.Vector3();
const _tempColor = new THREE.Color();

function createChapterDialTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);
    const cx = 256;
    const cy = 256;

    // Outer calibration ring
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.75)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 230, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 186, 0, Math.PI * 2);
    ctx.stroke();

    // Tick marks around the dial
    for (let i = 0; i < 72; i++) {
      const angle = (i / 72) * Math.PI * 2;
      const isMajor = i % 6 === 0;
      const rInner = isMajor ? 196 : 210;
      const rOuter = 226;
      ctx.strokeStyle = isMajor ? 'rgba(248, 250, 252, 0.9)' : 'rgba(96, 165, 250, 0.45)';
      ctx.lineWidth = isMajor ? 3 : 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner);
      ctx.lineTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
    grad.addColorStop(0.55, 'rgba(37, 99, 235, 0.22)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({ lang, onSwitchToStatic }) => {
  const t = UI_TRANSLATIONS[lang].hero;
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const [webglFailed, setWebglFailed] = useState(false);
  const [finish, setFinish] = useState<FinishPreset>('cobalt');
  const [explodeRatio, setExplodeRatio] = useState<number>(0.15);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('isometric');
  const [controlsCollapsed, setControlsCollapsed] = useState(false);

  // Store interactive state in refs so UI updates never recreate the WebGL context
  const stateRef = useRef({
    finish: 'cobalt' as FinishPreset,
    explodeTarget: 0.15,
    explodeCurrent: 0.15,
    cameraPreset: 'isometric' as CameraPreset,
    pointerX: 0,
    pointerY: 0,
  });

  useEffect(() => {
    stateRef.current.finish = finish;
  }, [finish]);

  useEffect(() => {
    stateRef.current.explodeTarget = explodeRatio;
  }, [explodeRatio]);

  useEffect(() => {
    stateRef.current.cameraPreset = cameraPreset;
  }, [cameraPreset]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Detect software WebGL from GPU renderer string
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 460;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    // 2. Scene, Horizon Fog & Studio Environment Reflection (RoomEnvironment)
    const scene = new THREE.Scene();
    const bgHex = 0x080d1a;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.065);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 3. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    camera.position.set(3.2, 2.1, 4.2);
    camera.lookAt(0, 0.15, 0);

    // 4. Balanced 3-Point Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x0f172a, 0.85);
    hemiLight.position.set(0, 8, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(4.5, 6.5, 4.0);
    keyLight.castShadow = !isSoftwareGl;
    const d = 3.2;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7c3aed, 1.35);
    rimLight.position.set(-4.5, 3.0, -3.5);
    scene.add(rimLight);

    // 5. PBR Materials with varied roughness/metalness (>= 0.25 contrast across adjacent parts)
    const primaryMetalMat = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      metalness: 0.9,
      roughness: 0.18,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
    });

    const secondaryChassisMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.75,
      roughness: 0.48,
    });

    const accentTrimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.15,
    });

    const opticalCrystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      metalness: 0.05,
      roughness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.92,
      transparent: true,
      opacity: isSoftwareGl ? 0.42 : 1.0,
      ior: 1.58,
      thickness: 1.2,
      clearcoat: 1.0,
      depthWrite: false,
    });

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const dialTexture = createChapterDialTexture(maxAniso);
    const dialMat = new THREE.MeshBasicMaterial({
      map: dialTexture,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    // 6. Assemble 8-Part Composite Procedural Model (THREE.Group) pivoted at bottom-center
    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, -1.15, 0); // Ground plane sits at Y = -1.15
    scene.add(rootGroup);

    // Contact Shadow Grounding Plane + Subtle Studio Plinth at Y = 0 local (world -1.15)
    const shadowTex = createContactShadowTexture();
    const shadowPlaneGeo = new THREE.PlaneGeometry(4.2, 4.2);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.6,
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    rootGroup.add(shadowPlane);

    // Part 1: Grounded Architectural Plinth Base (pivoted flush on ground)
    const plinthGeo = new THREE.CylinderGeometry(1.15, 1.32, 0.18, 8);
    plinthGeo.translate(0, 0.09, 0);
    const plinthMesh = new THREE.Mesh(plinthGeo, secondaryChassisMat);
    plinthMesh.receiveShadow = true;
    plinthMesh.castShadow = true;
    rootGroup.add(plinthMesh);

    // Floating assembly group centered at Y = 1.35 above plinth
    const emblemAssembly = new THREE.Group();
    emblemAssembly.position.set(0, 1.35, 0);
    rootGroup.add(emblemAssembly);

    // Part 2 (Primary Silhouette): Beveled Octagonal Core using ExtrudeGeometry
    const octagonShape = new THREE.Shape();
    const octRadius = 0.56;
    for (let i = 0; i < 8; i++) {
      const theta = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const x = Math.cos(theta) * octRadius;
      const y = Math.sin(theta) * octRadius;
      if (i === 0) octagonShape.moveTo(x, y);
      else octagonShape.lineTo(x, y);
    }
    octagonShape.closePath();

    const coreGeo = new THREE.ExtrudeGeometry(octagonShape, {
      depth: 0.36,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    });
    coreGeo.center();
    const coreMesh = new THREE.Mesh(coreGeo, primaryMetalMat);
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    emblemAssembly.add(coreMesh);

    // Part 3 (Secondary Read): Outer Calibration Gimbal Ring
    const outerRingGeo = new THREE.TorusGeometry(1.18, 0.065, 20, 64);
    const outerRingMesh = new THREE.Mesh(outerRingGeo, primaryMetalMat);
    outerRingMesh.castShadow = true;
    outerRingMesh.receiveShadow = true;
    emblemAssembly.add(outerRingMesh);

    // Part 4 (Secondary Read): Inner Gyroscopic Lattice Ring
    const innerRingGeo = new THREE.TorusGeometry(0.88, 0.045, 16, 48);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, secondaryChassisMat);
    innerRingMesh.rotation.y = Math.PI / 4;
    innerRingMesh.castShadow = true;
    emblemAssembly.add(innerRingMesh);

    // Part 5 (Secondary Read): 4 Radial Structural Struts
    const strutsGroup = new THREE.Group();
    const strutGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.62, 12);
    for (let i = 0; i < 4; i++) {
      const strut = new THREE.Mesh(strutGeo, accentTrimMat);
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      strut.position.set(Math.cos(angle) * 0.82, Math.sin(angle) * 0.82, 0);
      strut.rotation.z = angle + Math.PI / 2;
      strut.castShadow = true;
      strutsGroup.add(strut);
    }
    emblemAssembly.add(strutsGroup);

    // Part 6 (Accent Detail): Front & Rear Optical Crystal Lenses
    const lensGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.08, 32);
    lensGeo.rotateX(Math.PI / 2);
    const frontLens = new THREE.Mesh(lensGeo, opticalCrystalMat);
    frontLens.renderOrder = 2;
    const backLens = new THREE.Mesh(lensGeo, opticalCrystalMat);
    backLens.renderOrder = 2;
    emblemAssembly.add(frontLens, backLens);

    // Part 7 (Accent Detail): Precision Chapter Ring Plane (front & back)
    const dialGeo = new THREE.PlaneGeometry(1.9, 1.9);
    const frontDial = new THREE.Mesh(dialGeo, dialMat);
    frontDial.renderOrder = 3;
    const backDial = new THREE.Mesh(dialGeo, dialMat);
    backDial.rotation.y = Math.PI;
    backDial.renderOrder = 3;
    emblemAssembly.add(frontDial, backDial);

    // Part 8 (Accent Detail): InstancedMesh of 24 Orbital Telemetry Nodes (>20 repeated items)
    const nodeCount = 24;
    const nodeGeo = new THREE.OctahedronGeometry(0.045, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.85,
      roughness: 0.2,
    });
    const orbitalNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
    orbitalNodes.frustumCulled = false;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 1.42 + (i % 2 === 0 ? 0.08 : -0.06);
      const zOffset = ((i % 3) - 1) * 0.14;
      _tempPos.set(Math.cos(angle) * radius, Math.sin(angle) * radius, zOffset);
      _tempQuat.setFromEuler(new THREE.Euler(angle, angle * 0.5, 0));
      const scaleFactor = 0.85 + (i % 4) * 0.1; // ±15% subtle scale variation
      _tempScale.set(scaleFactor, scaleFactor, scaleFactor);
      _tempMatrix.compose(_tempPos, _tempQuat, _tempScale);
      orbitalNodes.setMatrixAt(i, _tempMatrix);

      _tempColor.setHex(i % 3 === 0 ? 0x60a5fa : i % 3 === 1 ? 0x818cf8 : 0xe2e8f0);
      orbitalNodes.setColorAt(i, _tempColor);
    }
    orbitalNodes.instanceMatrix.needsUpdate = true;
    if (orbitalNodes.instanceColor) orbitalNodes.instanceColor.needsUpdate = true;
    orbitalNodes.computeBoundingSphere();
    emblemAssembly.add(orbitalNodes);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer interaction handlers
    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      stateRef.current.pointerX = THREE.MathUtils.clamp(nx, -1, 1);
      stateRef.current.pointerY = THREE.MathUtils.clamp(ny, -1, 1);
    };
    renderer.domElement.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 7. Render Loop with Software-WebGL Fence Sync & Smooth Exponential Damping
    const clock = new THREE.Clock();
    let frameId = 0;
    let isDisposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isDisposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const st = stateRef.current;

      // Update Material Finish smoothly
      if (st.finish === 'cobalt') {
        _tempColor.setHex(0x2563eb);
      } else if (st.finish === 'titanium') {
        _tempColor.setHex(0x64748b);
      } else {
        _tempColor.setHex(0xd97706);
      }
      primaryMetalMat.color.lerp(_tempColor, 1 - Math.exp(-6 * dt));

      // Exponential damping for exploded-view separation
      st.explodeCurrent = THREE.MathUtils.damp(st.explodeCurrent, st.explodeTarget, 6, dt);
      const exp = st.explodeCurrent;

      frontLens.position.z = 0.28 + exp * 0.65;
      backLens.position.z = -0.28 - exp * 0.65;
      frontDial.position.z = 0.36 + exp * 0.95;
      backDial.position.z = -0.36 - exp * 0.95;
      innerRingMesh.position.z = exp * 0.32;
      outerRingMesh.position.z = -exp * 0.25;

      // Subtle gyroscopic rotation
      outerRingMesh.rotation.z = elapsed * 0.18;
      innerRingMesh.rotation.x = Math.sin(elapsed * 0.5) * 0.35;
      innerRingMesh.rotation.y = elapsed * 0.28;
      orbitalNodes.rotation.z = -elapsed * 0.12;

      // Damped pointer parallax on assembly
      emblemAssembly.rotation.y = THREE.MathUtils.damp(
        emblemAssembly.rotation.y,
        st.pointerX * 0.45 + elapsed * 0.1,
        4,
        dt
      );
      emblemAssembly.rotation.x = THREE.MathUtils.damp(
        emblemAssembly.rotation.x,
        -st.pointerY * 0.25,
        4,
        dt
      );

      // Camera Preset Damping
      if (st.cameraPreset === 'isometric') {
        _targetCamPos.set(3.1, 2.0, 4.1);
      } else if (st.cameraPreset === 'front') {
        _targetCamPos.set(0.0, 0.35, 4.8);
      } else {
        _targetCamPos.set(0.0, 4.4, 2.2);
      }
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCamPos.x, 5, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCamPos.y, 5, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCamPos.z, 5, dt);
      camera.lookAt(_targetLookAt);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

      // Dispose geometries, materials, and textures
      shadowPlaneGeo.dispose();
      shadowPlaneMat.dispose();
      shadowTex.dispose();
      plinthGeo.dispose();
      coreGeo.dispose();
      outerRingGeo.dispose();
      innerRingGeo.dispose();
      strutGeo.dispose();
      lensGeo.dispose();
      dialGeo.dispose();
      nodeGeo.dispose();
      dialTexture.dispose();
      envTexture.dispose();

      primaryMetalMat.dispose();
      secondaryChassisMat.dispose();
      accentTrimMat.dispose();
      opticalCrystalMat.dispose();
      dialMat.dispose();
      nodeMat.dispose();
      renderer.dispose();
    };
  }, []);

  if (webglFailed) {
    return (
      <HeroStaticEmblem
        lang={lang}
        canEnable3D={false}
        reasonNote={
          lang === 'ar'
            ? 'تم التبديل تلقائياً إلى العرض الثابت لعدم توفر WebGL'
            : 'Automatically switched to static SVG emblem (WebGL unavailable)'
        }
      />
    );
  }

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[500px] rounded-2xl bg-[#080D1A] border border-slate-800/90 overflow-hidden select-none">
      {/* Top-Left Minimal Spec Header */}
      <div className="absolute top-3.5 inset-x-4 flex items-center justify-between gap-2 z-10 pointer-events-none">
        <span className="px-2.5 py-1 rounded bg-[#070B14]/90 border border-slate-800 text-[11px] font-mono-tabular text-slate-300">
          {t.sceneLabel}
        </span>
        <button
          type="button"
          onClick={onSwitchToStatic}
          className="pointer-events-auto px-2.5 py-1 rounded bg-[#070B14]/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-300 transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 cursor-pointer whitespace-nowrap shrink-0"
        >
          {t.disable3D}
        </button>
      </div>

      {/* Isolated WebGL Canvas Mount Ref */}
      <div ref={canvasMountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Unified Collapsible Bottom Control Dock (Solid rgba surface, zero backdrop-filter over WebGL) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-[520px] z-10">
        <div className="flex justify-center mb-1">
          <button
            type="button"
            onClick={() => setControlsCollapsed((prev) => !prev)}
            className="px-3 py-1 rounded-t-lg bg-[#070B14]/95 border border-b-0 border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            {controlsCollapsed ? `▴ ${t.showControls}` : `▾ ${t.hideControls}`}
          </button>
        </div>

        {!controlsCollapsed && (
          <div className="p-3 rounded-xl bg-[#070B14]/95 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Material Finish Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px] whitespace-nowrap">{t.finishLabel}:</span>
              {(['cobalt', 'titanium', 'gold'] as FinishPreset[]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFinish(preset)}
                  className={`px-2 py-1 rounded text-[11px] font-medium capitalize transition-colors cursor-pointer whitespace-nowrap ${
                    finish === preset
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Exploded View Slider */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="hero-explode-slider"
                className="text-slate-400 text-[11px] whitespace-nowrap"
              >
                {t.explodeLabel}:
              </label>
              <input
                id="hero-explode-slider"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={explodeRatio}
                onChange={(e) => setExplodeRatio(parseFloat(e.target.value))}
                className="w-20 accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Camera Angle Presets */}
            <div className="flex items-center gap-1">
              {(['isometric', 'front', 'top'] as CameraPreset[]).map((cam) => (
                <button
                  key={cam}
                  type="button"
                  onClick={() => setCameraPreset(cam)}
                  className={`px-2 py-1 rounded text-[11px] font-medium capitalize transition-colors cursor-pointer whitespace-nowrap ${
                    cameraPreset === cam
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cam}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroScene3D;
