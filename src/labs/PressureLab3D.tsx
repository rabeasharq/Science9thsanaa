import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AlertCircle, ChevronDown, ChevronUp, Footprints, Layers, Wind } from 'lucide-react';
import {
  BrickFace,
  calculateAtmosphericPressure,
  calculateBernoulliLift,
  calculateLiquidPressure,
  calculateSolidPressure,
  getBrickFaceAreaM2,
  LIQUIDS_CATALOG,
  LiquidTypeId,
  YEMENI_CITIES_BAROMETER,
} from '../engines/physicsEngine';
import { initThreeStudio, makeLabBench } from './threeHelpers';

interface PressureLab3DProps {
  initialMode?: 'solid' | 'liquid' | 'atmosphere';
  onLevelInteract?: (level: number) => void;
}

export const PressureLab3D: React.FC<PressureLab3DProps> = ({ initialMode = 'solid', onLevelInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<'solid' | 'liquid' | 'atmosphere'>(initialMode);
  const [dockOpen, setDockOpen] = useState<boolean>(true);

  // Mode 1: Solid Pressure (Brick on sand + 1/2 feet demo)
  const [brickFace, setBrickFace] = useState<BrickFace>('largest');
  const [brickWeightKgf, setBrickWeightKgf] = useState<number>(3);
  const [useShoeDemo, setUseShoeDemo] = useState<boolean>(false);
  const [oneFoot, setOneFoot] = useState<boolean>(false);

  // Mode 2: Liquid Pressure
  const [liquidId, setLiquidId] = useState<LiquidTypeId>('pure-water');
  const [depthM, setDepthM] = useState<number>(2);

  // Mode 3: Atmospheric Pressure & Bernoulli
  const [altitudeM, setAltitudeM] = useState<number>(0);
  const [airTempC, setAirTempC] = useState<number>(20);
  const [bernoulliSpeed, setBernoulliSpeed] = useState<number>(0);

  const faceInfo = getBrickFaceAreaM2(brickFace);
  const solidResult = useShoeDemo
    ? calculateSolidPressure({ weightKgf: 70, areaM2: 0.35, standingOnOneFoot: oneFoot })
    : calculateSolidPressure({ weightKgf: brickWeightKgf * 10, areaM2: faceInfo.areaM2 });

  const liquidResult = calculateLiquidPressure(liquidId, depthM);
  const atmResult = calculateAtmosphericPressure(altitudeM, airTempC);
  const bernoulliResult = calculateBernoulliLift(bernoulliSpeed);

  const stateRef = useRef({
    mode,
    brickFace,
    sandDepth: solidResult.sandDepthCm,
    liquidColor: LIQUIDS_CATALOG[liquidId].colorHex,
    depthM,
    mercuryCm: atmResult.mercuryColumnCm,
    liftDeg: bernoulliResult.liftAngleDeg,
    airSpeed: bernoulliSpeed,
  });

  useEffect(() => {
    stateRef.current.mode = mode;
    stateRef.current.brickFace = brickFace;
    stateRef.current.sandDepth = solidResult.sandDepthCm;
    stateRef.current.liquidColor = LIQUIDS_CATALOG[liquidId].colorHex;
    stateRef.current.depthM = depthM;
    stateRef.current.mercuryCm = atmResult.mercuryColumnCm;
    stateRef.current.liftDeg = bernoulliResult.liftAngleDeg;
    stateRef.current.airSpeed = bernoulliSpeed;
  }, [mode, brickFace, solidResult.sandDepthCm, liquidId, depthM, atmResult.mercuryColumnCm, bernoulliResult.liftAngleDeg, bernoulliSpeed]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = initThreeStudio(el, {
      backgroundHex: 0x0b1322,
      cameraPos: [0.2, 3.1, 7.3],
      target: [0.1, 1.15, 0],
    });

    studio.scene.add(makeLabBench(9.5, 5.2));

    // ================= STATION 1: SOLID PRESSURE (BRICK ON SAND TRAY) =================
    const solidGroup = new THREE.Group();

    // Wooden Sand Tray
    const trayFrameMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.72 });
    const trayFloor = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.14, 2.8), trayFrameMat);
    trayFloor.position.y = 0.07;
    solidGroup.add(trayFloor);

    // Sand Bed (Deformable indentation simulation)
    const sandGeo = new THREE.BoxGeometry(3.9, 0.55, 2.5, 20, 2, 16);
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xe7c68e, roughness: 0.92, metalness: 0.0 });
    const sandMesh = new THREE.Mesh(sandGeo, sandMat);
    sandMesh.position.y = 0.41;
    sandMesh.receiveShadow = true;
    solidGroup.add(sandMesh);

    // Sand tray side walls
    const wallSideGeo = new THREE.BoxGeometry(4.2, 0.65, 0.14);
    const frontWall = new THREE.Mesh(wallSideGeo, trayFrameMat);
    frontWall.position.set(0, 0.36, 1.33);
    const backWall = new THREE.Mesh(wallSideGeo, trayFrameMat);
    backWall.position.set(0, 0.36, -1.33);
    solidGroup.add(frontWall, backWall);

    // Composite Brick (Primary clay block + inner recess groove + center mark)
    const brickPivot = new THREE.Group();
    const brickMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8, metalness: 0.05 });
    const brickTrimMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.85 });
    const brickBody = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.64, 0.96), brickMat);
    brickBody.castShadow = true;
    brickPivot.add(brickBody);
    const brickBand = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.66, 0.48), brickTrimMat);
    brickPivot.add(brickBand);

    // 3D Force Vector Arrows pointing downward
    const arrowGroup = new THREE.Group();
    const arrowMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.4 });
    [-0.5, 0, 0.5].forEach((ax) => {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 10), arrowMat);
      shaft.position.set(ax, 1.85, 0);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.2, 10), arrowMat);
      tip.rotation.x = Math.PI;
      tip.position.set(ax, 1.48, 0);
      arrowGroup.add(shaft, tip);
    });
    solidGroup.add(brickPivot, arrowGroup);
    studio.scene.add(solidGroup);

    // ================= STATION 2: LIQUID PRESSURE TANK =================
    const liquidGroup = new THREE.Group();
    const tankGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.08,
      transmission: studio.isSoftwareGl ? 0 : 0.78,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const tankWall = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 3.0, 32, 1, true), tankGlassMat);
    tankWall.position.set(-0.8, 1.52, 0);
    tankWall.renderOrder = 3;
    liquidGroup.add(tankWall);

    const tankFluidMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.72,
    });
    const tankFluid = new THREE.Mesh(new THREE.CylinderGeometry(1.28, 1.28, 2.75, 32), tankFluidMat);
    tankFluid.position.set(-0.8, 1.4, 0);
    liquidGroup.add(tankFluid);

    // Submersible pressure probe with flexing membrane
    const probeGroup = new THREE.Group();
    const probeBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.22, 20),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.35, metalness: 0.75 })
    );
    probeBody.rotation.z = Math.PI / 2;
    const membraneMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.5 });
    const membraneMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), membraneMat);
    membraneMesh.position.x = 0.08;
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 2.8, 10),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.25 })
    );
    rod.position.set(-0.1, 1.4, 0);
    probeGroup.add(probeBody, membraneMesh, rod);
    probeGroup.position.set(-0.8, 2.0, 0);
    liquidGroup.add(probeGroup);

    // Side Dam / Manometer U-tube visual on right
    const uTubeFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 2.8, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
    );
    uTubeFrame.position.set(1.85, 1.4, 0);
    const manometerLeftCol = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.2, 14),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    manometerLeftCol.position.set(1.55, 0.85, 0.12);
    const manometerRightCol = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.2, 14),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    manometerRightCol.position.set(2.15, 1.35, 0.12);
    liquidGroup.add(uTubeFrame, manometerLeftCol, manometerRightCol);
    studio.scene.add(liquidGroup);

    // ================= STATION 3: ATMOSPHERIC BAROMETER + BERNOULLI WING =================
    const atmGroup = new THREE.Group();

    // Mercury Dish
    const dishGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.78, 0.48, 28), tankGlassMat);
    dishGlass.position.set(-1.35, 0.26, 0);
    const hgMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.12, metalness: 0.94 });
    const dishHg = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.72, 0.32, 28), hgMat);
    dishHg.position.set(-1.35, 0.18, 0);

    // 100cm Glass Barometer Tube
    const baroTube = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 3.0, 20), tankGlassMat);
    baroTube.position.set(-1.35, 1.75, 0);
    baroTube.renderOrder = 3;

    // Mercury column inside tube (scale: 100 cm = 2.8 units)
    const hgColumnMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 1.0, 16), hgMat);
    hgColumnMesh.position.set(-1.35, 0.3, 0);
    atmGroup.add(dishGlass, dishHg, baroTube, hgColumnMesh);

    // Bernoulli Paper Strip & Airfoil Stand on right
    const bernoulliStand = new THREE.Group();
    bernoulliStand.position.set(1.55, 0, 0);
    const standPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.08, 1.8, 14),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 })
    );
    standPole.position.y = 0.9;
    const stripPivot = new THREE.Group();
    stripPivot.position.set(-0.4, 1.65, 0);
    const stripMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 0.03, 0.65),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 })
    );
    stripMesh.position.x = 0.85;
    stripPivot.add(stripMesh);

    // Airflow wind particles
    const windParticles: THREE.Mesh[] = [];
    const windMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.6 });
    for (let i = 0; i < 12; i++) {
      const wp = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.025, 0.025), windMat);
      wp.position.set(-0.8 + i * 0.25, 1.82 + (i % 3) * 0.1, ((i % 2) - 0.5) * 0.3);
      bernoulliStand.add(wp);
      windParticles.push(wp);
    }

    bernoulliStand.add(standPole, stripPivot);
    atmGroup.add(bernoulliStand);
    studio.scene.add(atmGroup);

    const clock = new THREE.Clock();
    let currentRotX = 0;
    let currentRotZ = 0;
    let currentBrickY = 0.98;
    let currentLiftRad = 0;

    const tick = () => {
      const dt = Math.min(0.05, clock.getDelta());
      const elapsed = clock.getElapsedTime();
      const s = stateRef.current;

      solidGroup.visible = s.mode === 'solid';
      liquidGroup.visible = s.mode === 'liquid';
      atmGroup.visible = s.mode === 'atmosphere';

      if (s.mode === 'solid') {
        let targetRotX = 0;
        let targetRotZ = 0;
        let halfH = 0.32;
        if (s.brickFace === 'medium') {
          targetRotX = Math.PI / 2;
          halfH = 0.48;
        } else if (s.brickFace === 'smallest') {
          targetRotZ = Math.PI / 2;
          halfH = 1.0;
        }
        currentRotX = THREE.MathUtils.damp(currentRotX, targetRotX, 8, dt);
        currentRotZ = THREE.MathUtils.damp(currentRotZ, targetRotZ, 8, dt);
        brickPivot.rotation.set(currentRotX, 0, currentRotZ);

        const sinkWorld = Math.min(0.32, s.sandDepth * 0.045);
        const targetY = 0.685 + halfH - sinkWorld;
        currentBrickY = THREE.MathUtils.damp(currentBrickY, targetY, 8, dt);
        brickPivot.position.y = currentBrickY;
        arrowGroup.position.y = currentBrickY + halfH - 1.1;
      }

      if (s.mode === 'liquid') {
        tankFluidMat.color.lerp(new THREE.Color(s.liquidColor), Math.min(1, dt * 6));
        const normDepth = Math.max(0, Math.min(1, s.depthM / 10));
        const probeY = 2.45 - normDepth * 2.05;
        probeGroup.position.y = THREE.MathUtils.damp(probeGroup.position.y, probeY, 8, dt);
        // Membrane bends inward proportionally to pressure
        const squeeze = 1 - normDepth * 0.45;
        membraneMesh.scale.set(squeeze, 1, 1);

        // Manometer column differential
        const diff = normDepth * 0.9;
        manometerRightCol.scale.y = 0.6 + diff;
        manometerRightCol.position.y = 0.95 + diff * 0.45;
        manometerLeftCol.scale.y = Math.max(0.25, 1.1 - diff * 0.5);
      }

      if (s.mode === 'atmosphere') {
        // 100 cm tube = 2.8 units height starting at y=0.35
        const hgHeight = (s.mercuryCm / 100) * 2.8;
        hgColumnMesh.scale.y = Math.max(0.05, hgHeight);
        hgColumnMesh.position.y = 0.35 + hgHeight / 2;

        // Bernoulli strip lift
        const targetLift = THREE.MathUtils.degToRad(s.liftDeg);
        currentLiftRad = THREE.MathUtils.damp(currentLiftRad, targetLift, 6, dt);
        stripPivot.rotation.z = currentLiftRad;

        const speedScale = s.airSpeed > 0 ? 1 + s.airSpeed * 0.12 : 0;
        windParticles.forEach((wp, idx) => {
          wp.visible = s.airSpeed > 0.5;
          if (wp.visible) {
            const x = -0.8 + ((elapsed * speedScale + idx * 0.3) % 2.8);
            wp.position.x = x;
          }
        });
      }

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);

      if (studio.isSoftwareGl) {
        studio.afterDraw(tick);
      } else {
        studio.setActiveFrameId(requestAnimationFrame(tick));
      }
    };

    if (studio.isSoftwareGl) {
      studio.renderer.render(studio.scene, studio.camera);
      studio.afterDraw(tick);
    } else {
      studio.setActiveFrameId(requestAnimationFrame(tick));
    }

    return () => {
      studio.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Station selector tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode('solid')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold cursor-pointer transition-colors ${
            mode === 'solid'
              ? 'bg-teal-700 text-white'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. الضغط في الأجسام الصلبة (الطوب والرمل)</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('liquid')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold cursor-pointer transition-colors ${
            mode === 'liquid'
              ? 'bg-teal-700 text-white'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <span>2. ضغط السوائل والغواصة</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('atmosphere')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold cursor-pointer transition-colors ${
            mode === 'atmosphere'
              ? 'bg-teal-700 text-white'
              : 'bg-white/65 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>3. البارومتر الزئبقي ومبدأ برنولي</span>
        </button>
      </div>

      {/* Live Telemetry Bar */}
      {mode === 'solid' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
            <div className="text-[11px] text-slate-500">القوة العمودية (ث.كجم × 10)</div>
            <div className="text-base font-bold font-mono-num text-slate-900 dark:text-white">
              {solidResult.forceNewtons} <span className="text-xs font-normal text-slate-400">نيوتن</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
            <div className="text-[11px] text-slate-500">مساحة التلامس الفعالة</div>
            <div className="text-base font-bold font-mono-num text-slate-900 dark:text-white">
              {solidResult.effectiveAreaM2} <span className="text-xs font-normal text-slate-400">م²</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
            <div className="text-[11px] text-slate-500">الضغط الناتج (ض = ق / م)</div>
            <div className="text-base font-bold font-mono-num text-teal-600 dark:text-teal-400">
              {solidResult.pressurePa} <span className="text-xs font-normal text-slate-400">باسكال</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
            <div className="text-[11px] text-slate-500">عمق الانغراس في الرمل</div>
            <div className="text-base font-bold font-mono-num text-amber-600 dark:text-amber-400">
              {solidResult.sandDepthCm} <span className="text-xs font-normal text-slate-400">سم</span>
            </div>
          </div>
        </div>
      )}

      {mode === 'liquid' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
            <div className="text-[11px] text-slate-500">نوع السائل وكثافته</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {LIQUIDS_CATALOG[liquidId].nameAr} ({LIQUIDS_CATALOG[liquidId].densityKgM3} كجم/م³)
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
            <div className="text-[11px] text-slate-500">العمق المحدد</div>
            <div className="text-base font-bold font-mono-num text-slate-900 dark:text-white">{depthM} م</div>
          </div>
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
            <div className="text-[11px] text-slate-500">ضغط السائل عند هذا العمق</div>
            <div className="text-base font-bold font-mono-num text-sky-600 dark:text-sky-400">
              {liquidResult.pressurePa.toLocaleString('en-US')} باسكال
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
            <div className="text-[11px] text-slate-500">تقعر الغشاء المطاطي</div>
            <div className="text-base font-bold font-mono-num text-rose-600 dark:text-rose-400">
              {liquidResult.membraneDeflectionMm} ملم
            </div>
          </div>
        </div>
      )}

      {mode === 'atmosphere' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
            <div className="text-[11px] text-slate-500">الضغط الجوي (مللي بار)</div>
            <div className="text-base font-bold font-mono-num text-teal-600 dark:text-teal-400">
              {atmResult.pressureMbar} مللي بار
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
            <div className="text-[11px] text-slate-500">طول عمود الزئبق / فراغ تورشللي</div>
            <div className="text-sm font-bold font-mono-num text-slate-900 dark:text-white">
              {atmResult.mercuryColumnCm} سم / فراغ {atmResult.torricelliVacuumCm} سم
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
            <div className="text-[11px] text-slate-500">المقارنة بمرجع 1013 مللي بار</div>
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400">{atmResult.relativeToSeaLevel}</div>
          </div>
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
            <div className="text-[11px] text-slate-500">برنولي: فرق الضغط أعلى الورقة</div>
            <div className="text-sm font-bold font-mono-num text-sky-600 dark:text-sky-400">
              -{bernoulliResult.pressureDiffPa} باسكال (رفع {bernoulliResult.liftAngleDeg}°)
            </div>
          </div>
        </div>
      )}

      {/* Ministerial Nuance Alert in Solid Pressure Mode */}
      {mode === 'solid' && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-50 dark:bg-amber-950/50 px-3 py-2.5 flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-100">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>تنبيه وزاري هام (مثال الكتاب ص 80):</strong> عند حساب الضغط، تضرب مفاتيح التصحيح الوزاري الوزن بوحدة{' '}
            <span className="font-bold">ث.كجم × 10</span> لتحويله إلى <span className="font-bold">نيوتن</span> قبل القسمة على المساحة (على عكس خطأ مطبعي في ص 80 لم يضرب في 10). هنا: {solidResult.forceNewtons} نيوتن ÷ {solidResult.effectiveAreaM2} م² = {solidResult.pressurePa} باسكال.
          </div>
        </div>
      )}

      {/* 3D Viewport (Unobstructed 100%) */}
      <div className="relative w-full h-[350px] sm:h-[410px] rounded-2xl overflow-hidden border border-slate-300/80 dark:border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        <div className="pointer-events-none absolute top-3 right-3 rounded-lg bg-slate-900/90 border border-slate-700 px-3 py-1.5 text-[11px] text-slate-200">
          <div className="font-bold text-teal-300">
            {mode === 'solid' && 'مختبر الضغط في الأجسام الصلبة 3D'}
            {mode === 'liquid' && 'مختبر ضغط السوائل 3D'}
            {mode === 'atmosphere' && 'مختبر البارومتر الزئبقي وبرنولي 3D'}
          </div>
          <div className="text-slate-400">اسحب بالماوس أو الإصبع لتدوير الكاميرا 360°</div>
        </div>
      </div>

      {/* Control Panel placed cleanly BELOW the 3D canvas */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/70 dark:bg-slate-900/75 backdrop-blur-md p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">أدوات التحكم في التجربة</span>
          <button
            type="button"
            onClick={() => setDockOpen((v) => !v)}
            className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/75 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {dockOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{dockOpen ? 'طيّ الأدوات' : 'عرض الأدوات'}</span>
          </button>
        </div>

        {dockOpen && (
          <div>
            {mode === 'solid' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div className="flex flex-wrap gap-1.5">
                  {(['largest', 'medium', 'smallest'] as BrickFace[]).map((f) => {
                    const info = getBrickFaceAreaM2(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => {
                          setUseShoeDemo(false);
                          setBrickFace(f);
                          onLevelInteract?.(1);
                        }}
                        className={`rounded-xl px-2.5 py-1.5 text-xs font-bold cursor-pointer ${
                          !useShoeDemo && brickFace === f
                            ? 'bg-teal-700 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {info.labelAr}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    <span>وزن القوالب ({brickWeightKgf * 10} ث.كجم)</span>
                    <span className="font-mono-num text-teal-700 dark:text-teal-300">{brickWeightKgf} قوالب</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    step={1}
                    value={brickWeightKgf}
                    onChange={(e) => {
                      setUseShoeDemo(false);
                      setBrickWeightKgf(Number(e.target.value));
                      onLevelInteract?.(2);
                    }}
                    className="w-full accent-teal-600"
                  />
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setUseShoeDemo(true);
                      setOneFoot((v) => !v);
                      onLevelInteract?.(3);
                    }}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer ${
                      useShoeDemo
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Footprints className="w-3.5 h-3.5" />
                    <span>
                      {useShoeDemo
                        ? oneFoot
                          ? 'حساب مسألة: قدم واحدة (0.175 م²)'
                          : 'حساب مسألة: قدمين (0.35 م²)'
                        : 'محاكاة مسألة الوقوف على قدم واحدة'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {mode === 'liquid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">اختر السائل</label>
                  <select
                    value={liquidId}
                    onChange={(e) => {
                      setLiquidId(e.target.value as LiquidTypeId);
                      onLevelInteract?.(2);
                    }}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/85 dark:bg-slate-800 px-2.5 py-2 text-xs text-slate-900 dark:text-white"
                  >
                    {Object.values(LIQUIDS_CATALOG).map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nameAr} (الكثافة: {l.densityKgM3} كجم/م³)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    <span>العمق داخل السائل</span>
                    <span className="font-mono-num text-sky-700 dark:text-sky-300">{depthM} متر</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={10}
                    step={0.5}
                    value={depthM}
                    onChange={(e) => {
                      setDepthM(Number(e.target.value));
                      onLevelInteract?.(1);
                    }}
                    className="w-full accent-sky-600"
                  />
                </div>
              </div>
            )}

            {mode === 'atmosphere' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">المدينة / الارتفاع عن سطح البحر</label>
                  <select
                    value={altitudeM}
                    onChange={(e) => {
                      setAltitudeM(Number(e.target.value));
                      onLevelInteract?.(2);
                    }}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/85 dark:bg-slate-800 px-2.5 py-2 text-xs text-slate-900 dark:text-white"
                  >
                    {YEMENI_CITIES_BAROMETER.map((c) => (
                      <option key={c.id} value={c.altitudeMeters}>
                        {c.nameAr} ({c.altitudeMeters} م)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    <span>درجة حرارة الهواء</span>
                    <span className="font-mono-num text-amber-700 dark:text-amber-300">{airTempC} °م</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={45}
                    step={1}
                    value={airTempC}
                    onChange={(e) => setAirTempC(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    <span>برنولي: سرعة الهواء فوق الورقة</span>
                    <span className="font-mono-num text-sky-700 dark:text-sky-300">{bernoulliSpeed} م/ث</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={32}
                    step={1}
                    value={bernoulliSpeed}
                    onChange={(e) => {
                      setBernoulliSpeed(Number(e.target.value));
                      onLevelInteract?.(4);
                    }}
                    className="w-full accent-sky-600"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
