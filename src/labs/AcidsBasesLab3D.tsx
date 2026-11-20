import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Eye,
  Flame,
  RotateCcw,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  computeEffectivePh,
  evaluateIndicator,
  getIonicCounts,
  IndicatorId,
  phColorHex,
  SolutionId,
  SOLUTIONS_CATALOG,
} from '../engines/chemistryEngine';
import { initThreeStudio, makeLabBench } from './threeHelpers';
import { ChemText } from '../components/common/ChemText';

interface AcidsBasesLab3DProps {
  initialFocus?: 'indicators' | 'strength' | 'all';
  onLevelInteract?: (level: number) => void;
}

const INDICATOR_OPTIONS: { id: IndicatorId; label: string }[] = [
  { id: 'universal', label: 'الكاشف العام (pH)' },
  { id: 'litmus-blue', label: 'دوار الشمس الأزرق' },
  { id: 'litmus-red', label: 'دوار الشمس الأحمر' },
  { id: 'methyl-orange', label: 'الميثيل البرتقالي' },
  { id: 'phenolphthalein', label: 'الفينولفثالين' },
  { id: 'tea', label: 'الشاي الأحمر' },
];

export const AcidsBasesLab3D: React.FC<AcidsBasesLab3DProps> = ({
  initialFocus = 'all',
  onLevelInteract,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [solutionId, setSolutionId] = useState<SolutionId>('hcl');
  const [indicatorId, setIndicatorId] = useState<IndicatorId>(
    initialFocus === 'strength' ? 'universal' : 'methyl-orange'
  );
  const [dilution, setDilution] = useState<number>(0);
  const [xrayMode, setXrayMode] = useState<boolean>(true);
  const [circuitOn, setCircuitOn] = useState<boolean>(true);
  const [safetyEvent, setSafetyEvent] = useState<'none' | 'danger-water-to-acid' | 'safe-acid-to-water'>('none');
  const [dockOpen, setDockOpen] = useState<boolean>(true);

  useEffect(() => {
    setIndicatorId(initialFocus === 'strength' ? 'universal' : 'methyl-orange');
  }, [initialFocus]);

  const spec = SOLUTIONS_CATALOG[solutionId];
  const effectivePh = computeEffectivePh(solutionId, dilution);
  const indicatorRes = evaluateIndicator(indicatorId, effectivePh);
  const ionic = getIonicCounts(solutionId, dilution);

  const stateRef = useRef({
    liquidColor: new THREE.Color(indicatorRes.colorHex),
    xrayMode,
    circuitOn,
    conductivity: ionic.effectiveConductivity,
    hCount: ionic.hPlusCount,
    ohCount: ionic.ohMinusCount,
    intactCount: ionic.intactMoleculeCount,
    safetyEvent,
    dropPulse: 0,
  });

  useEffect(() => {
    stateRef.current.liquidColor.set(indicatorRes.colorHex);
    stateRef.current.xrayMode = xrayMode;
    stateRef.current.circuitOn = circuitOn;
    stateRef.current.conductivity = ionic.effectiveConductivity;
    stateRef.current.hCount = ionic.hPlusCount;
    stateRef.current.ohCount = ionic.ohMinusCount;
    stateRef.current.intactCount = ionic.intactMoleculeCount;
    stateRef.current.safetyEvent = safetyEvent;
  }, [indicatorRes.colorHex, xrayMode, circuitOn, ionic, safetyEvent]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = initThreeStudio(el, {
      backgroundHex: 0x0b1322,
      cameraPos: [0.3, 3.1, 7.2],
      target: [0.2, 1.0, 0],
    });

    const bench = makeLabBench(9.5, 5.2);
    studio.scene.add(bench);

    // 1. Central Conductivity Beaker Assembly (Composite Group)
    const beakerGroup = new THREE.Group();
    beakerGroup.position.set(-1.1, 0, 0);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.08,
      metalness: 0.0,
      transmission: studio.isSoftwareGl ? 0 : 0.78,
      transparent: true,
      opacity: studio.isSoftwareGl ? 0.3 : 0.45,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const beakerWall = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.0, 2.0, 32, 1, true), glassMat);
    beakerWall.position.y = 1.02;
    beakerWall.renderOrder = 3;
    beakerGroup.add(beakerWall);

    const beakerBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.02, 1.04, 0.08, 32),
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.65 })
    );
    beakerBase.position.y = 0.04;
    beakerGroup.add(beakerBase);

    const beakerRim = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.035, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.1 })
    );
    beakerRim.rotation.x = Math.PI / 2;
    beakerRim.position.y = 2.02;
    beakerGroup.add(beakerRim);

    // Liquid Cylinder inside beaker
    const liquidMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(indicatorRes.colorHex),
      roughness: 0.25,
      metalness: 0.05,
      transparent: true,
      opacity: 0.78,
    });
    const liquidMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.92, 1.35, 32), liquidMat);
    liquidMesh.position.y = 0.72;
    liquidMesh.renderOrder = 1;
    beakerGroup.add(liquidMesh);

    // Graphite Electrodes (Anode + / Cathode -)
    const electrodeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.35 });
    const cathodeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.65, 16), electrodeMat);
    cathodeMesh.position.set(-0.48, 1.25, 0);
    beakerGroup.add(cathodeMesh);

    const anodeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.65, 16), electrodeMat);
    anodeMesh.position.set(0.48, 1.25, 0);
    beakerGroup.add(anodeMesh);

    // Polarity Caps (- Blue Cathode, + Red Anode)
    const negCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.16, 16),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 })
    );
    negCap.position.set(-0.48, 2.12, 0);
    beakerGroup.add(negCap);

    const posCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.16, 16),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 })
    );
    posCap.position.set(0.48, 2.12, 0);
    beakerGroup.add(posCap);

    // 2. Conductivity Circuit: Battery + Wires + Bulb Stand
    const circuitGroup = new THREE.Group();
    circuitGroup.position.set(-1.1, 0, -1.35);

    const batteryBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.65, 0.42),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.4 })
    );
    batteryBody.position.set(-0.6, 0.325, 0);
    batteryBody.castShadow = true;
    circuitGroup.add(batteryBody);

    const bulbSocket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.26, 20),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.85 })
    );
    bulbSocket.position.set(0.55, 0.13, 0);
    circuitGroup.add(bulbSocket);

    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 1.5,
      roughness: 0.2,
      transparent: true,
      opacity: 0.92,
    });
    const bulbGlass = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), bulbMat);
    bulbGlass.position.set(0.55, 0.45, 0);
    circuitGroup.add(bulbGlass);

    const bulbPointLight = new THREE.PointLight(0xfde047, 1.5, 5);
    bulbPointLight.position.set(0.55, 0.55, 0.2);
    circuitGroup.add(bulbPointLight);

    // Copper connecting wire curves
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.8 });
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.48, 2.18, 1.35),
      new THREE.Vector3(-0.6, 2.35, 0.55),
      new THREE.Vector3(-0.6, 0.66, 0),
    ]);
    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.48, 2.18, 1.35),
      new THREE.Vector3(0.55, 2.35, 0.55),
      new THREE.Vector3(0.55, 0.22, 0),
    ]);
    circuitGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve1, 16, 0.022, 8, false), wireMat));
    circuitGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve2, 16, 0.022, 8, false), wireMat));

    studio.scene.add(beakerGroup);
    studio.scene.add(circuitGroup);

    // 3. Test Tube Rack (4 Indicator Test Tubes on the right)
    const rackGroup = new THREE.Group();
    rackGroup.position.set(1.85, 0, 0.1);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.75, metalness: 0.05 });
    const rackBase = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.14, 0.72), woodMat);
    rackBase.position.y = 0.07;
    rackBase.castShadow = true;
    rackGroup.add(rackBase);

    const rackTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 0.66), woodMat);
    rackTop.position.y = 1.1;
    rackGroup.add(rackTop);

    [-1.15, 1.15].forEach((px) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.05, 12), woodMat);
      post.position.set(px, 0.58, 0);
      rackGroup.add(post);
    });

    const tubeLiquidMats: { id: IndicatorId; mat: THREE.MeshStandardMaterial }[] = [];
    const tubeIndicators: IndicatorId[] = ['litmus-blue', 'methyl-orange', 'phenolphthalein', 'tea'];
    tubeIndicators.forEach((ind, idx) => {
      const x = -0.82 + idx * 0.55;
      const tubeGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.45, 20, 1, true), glassMat);
      tubeGlass.position.set(x, 0.92, 0);
      tubeGlass.renderOrder = 3;
      rackGroup.add(tubeGlass);

      const tubeCap = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), glassMat);
      tubeCap.position.set(x, 0.2, 0);
      rackGroup.add(tubeCap);

      const tMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.25, transparent: true, opacity: 0.85 });
      const tLiq = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.82, 16), tMat);
      tLiq.position.set(x, 0.62, 0);
      rackGroup.add(tLiq);
      tubeLiquidMats.push({ id: ind, mat: tMat });
    });
    studio.scene.add(rackGroup);

    // 4. X-Ray Ions Particle Pool inside Main Beaker (Zero-GC Instanced-style Group)
    const ionsGroup = new THREE.Group();
    ionsGroup.position.copy(beakerGroup.position);
    const hGeo = new THREE.SphereGeometry(0.055, 12, 12);
    const ohGeo = new THREE.SphereGeometry(0.065, 12, 12);
    const intactGeo = new THREE.SphereGeometry(0.075, 12, 12);

    const hMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x7f1d1d, emissiveIntensity: 0.5, roughness: 0.3 });
    const ohMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1e3a8a, emissiveIntensity: 0.5, roughness: 0.3 });
    const intactMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });

    const hParticles: { mesh: THREE.Mesh; phase: number; speed: number; y: number; z: number }[] = [];
    const ohParticles: { mesh: THREE.Mesh; phase: number; speed: number; y: number; z: number }[] = [];
    const intactParticles: { mesh: THREE.Mesh; x: number; y: number; z: number; phase: number }[] = [];

    for (let i = 0; i < 20; i++) {
      const hm = new THREE.Mesh(hGeo, hMat);
      const yp = 0.22 + (i % 5) * 0.22;
      const zp = ((i % 4) - 1.5) * 0.28;
      ionsGroup.add(hm);
      hParticles.push({ mesh: hm, phase: i * 0.47, speed: 0.45 + (i % 3) * 0.14, y: yp, z: zp });

      const om = new THREE.Mesh(ohGeo, ohMat);
      ionsGroup.add(om);
      ohParticles.push({ mesh: om, phase: i * 0.61, speed: 0.42 + (i % 3) * 0.12, y: yp + 0.06, z: -zp });

      const im = new THREE.Mesh(intactGeo, intactMat);
      ionsGroup.add(im);
      intactParticles.push({
        mesh: im,
        x: ((i % 5) - 2) * 0.28,
        y: 0.26 + Math.floor(i / 5) * 0.24,
        z: (((i + 1) % 3) - 1) * 0.3,
        phase: i * 0.8,
      });
    }
    studio.scene.add(ionsGroup);

    // 5. Thermal Splash/Warning Particles (hidden unless safetyEvent === 'danger-water-to-acid')
    const splashGroup = new THREE.Group();
    splashGroup.position.set(-1.1, 1.45, 0);
    const splashMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.8 });
    const splashParticles: { mesh: THREE.Mesh; vx: number; vy: number; vz: number; phase: number }[] = [];
    for (let i = 0; i < 18; i++) {
      const sm = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), splashMat);
      splashGroup.add(sm);
      const angle = (i / 18) * Math.PI * 2;
      splashParticles.push({
        mesh: sm,
        vx: Math.cos(angle) * 0.65,
        vy: 0.9 + (i % 3) * 0.35,
        vz: Math.sin(angle) * 0.65,
        phase: i * 0.2,
      });
    }
    splashGroup.visible = false;
    studio.scene.add(splashGroup);

    const clock = new THREE.Clock();
    const targetColor = new THREE.Color();

    const tick = () => {
      const dt = Math.min(0.05, clock.getDelta());
      const elapsed = clock.getElapsedTime();
      const s = stateRef.current;

      // Liquid color smooth interpolation
      if (s.safetyEvent === 'danger-water-to-acid') {
        targetColor.setHex(0xea580c);
      } else {
        targetColor.copy(s.liquidColor);
      }
      liquidMat.color.lerp(targetColor, Math.min(1, dt * 6));

      // Update indicator test tubes colors based on current pH
      const curPh = computeEffectivePh(solutionId, dilution);
      tubeLiquidMats.forEach((entry) => {
        const res = evaluateIndicator(entry.id, curPh);
        entry.mat.color.lerp(new THREE.Color(res.colorHex), Math.min(1, dt * 6));
      });

      // Bulb brightness from conductivity engine
      const power = s.circuitOn ? s.conductivity : 0;
      bulbMat.emissiveIntensity = power * 2.4;
      bulbPointLight.intensity = power * 2.2;

      // Ions X-Ray animation
      ionsGroup.visible = s.xrayMode;
      if (s.xrayMode) {
        for (let i = 0; i < hParticles.length; i++) {
          const p = hParticles[i];
          p.mesh.visible = i < s.hCount;
          if (p.mesh.visible) {
            // H+ migrates toward cathode (-X = -0.48) when circuitOn
            const drift = s.circuitOn ? ((elapsed * p.speed + p.phase) % 1) : 0.5;
            p.mesh.position.set(0.35 - drift * 0.8, p.y + Math.sin(elapsed * 2 + p.phase) * 0.04, p.z);
          }
        }
        for (let i = 0; i < ohParticles.length; i++) {
          const p = ohParticles[i];
          p.mesh.visible = i < s.ohCount;
          if (p.mesh.visible) {
            // OH- migrates toward anode (+X = +0.48) when circuitOn
            const drift = s.circuitOn ? ((elapsed * p.speed + p.phase) % 1) : 0.5;
            p.mesh.position.set(-0.35 + drift * 0.8, p.y + Math.cos(elapsed * 2 + p.phase) * 0.04, p.z);
          }
        }
        for (let i = 0; i < intactParticles.length; i++) {
          const p = intactParticles[i];
          p.mesh.visible = i < s.intactCount;
          if (p.mesh.visible) {
            p.mesh.position.set(p.x + Math.sin(elapsed + p.phase) * 0.05, p.y + Math.cos(elapsed + p.phase) * 0.04, p.z);
          }
        }
      }

      // Splash safety animation
      splashGroup.visible = s.safetyEvent === 'danger-water-to-acid';
      if (splashGroup.visible) {
        splashParticles.forEach((sp) => {
          const t = (elapsed * 1.4 + sp.phase) % 1;
          sp.mesh.position.set(sp.vx * t, sp.vy * t - 1.2 * t * t, sp.vz * t);
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
  }, [solutionId, dilution]);

  const handleTriggerSafety = (mode: 'danger-water-to-acid' | 'safe-acid-to-water') => {
    setSafetyEvent(mode);
    onLevelInteract?.(4);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Live telemetry bar above stage */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">المحلول المختار</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>{spec.nameAr}</span>
            <span dir="ltr" className="inline-block [unicode-bidi:isolate] font-mono-num text-xs text-teal-600 dark:text-teal-400">
              {spec.formula}
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">درجة الحموضة pH</div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-mono-num" style={{ color: phColorHex(effectivePh) }}>
              {effectivePh}
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{spec.category}</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">نتيجة الكاشف النشط</div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
            <span className="w-3 h-3 rounded-sm border border-slate-400 inline-block shrink-0" style={{ backgroundColor: indicatorRes.colorHex }} />
            <span className="truncate">{indicatorRes.colorLabel}</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">شدة التوصيل والتأين</div>
          <div className="text-sm font-bold font-mono-num text-amber-600 dark:text-amber-400">
            {circuitOn ? `${Math.round(ionic.effectiveConductivity * 100)}% (${spec.ionizationPercent}% تأين)` : 'الدائرة مفتوحة'}
          </div>
        </div>
      </div>

      {/* Safety Alert Banner when triggered */}
      {safetyEvent === 'danger-water-to-acid' && (
        <div className="rounded-xl border border-rose-500/50 bg-rose-950/90 text-rose-50 p-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <strong>تحذير سلامة مخبرية:</strong> إضافة الماء مباشرة فوق حمض مركز يولد حرارة فورية شديدة تؤدي لغليان الماء وتطاير رذاذ الحمض الكاوي نحو الوجه! التصرف الصحيح: <strong>أضف الحمض إلى الماء تدريجياً مع التحريك</strong>.
          </div>
        </div>
      )}
      {safetyEvent === 'safe-acid-to-water' && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/85 text-emerald-50 p-3 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <strong>إجراء تخفيف آمن:</strong> عند سكب الحمض ببطء إلى كمية أكبر من الماء مع التحريك، يمتص الماء الحرارة المنطلقة بأمان دون تطاير.
          </div>
        </div>
      )}

      {/* 3D Viewport Stage (Unobstructed 100%) */}
      <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-300/80 dark:border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        <div className="pointer-events-none absolute top-3 right-3 rounded-lg bg-slate-900/90 border border-slate-700 px-3 py-1.5 text-[11px] text-slate-200 space-y-1">
          <div className="font-bold text-teal-300">المعمل الافتراضي 3D — الحموض والقواعد</div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> أيون <span dir="ltr">H+</span> (يتجه للمهبط -)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> أيون <span dir="ltr">OH-</span> (يتجه للمصعد +)
            </span>
          </div>
          {!spec.solubleInWater && (
            <div className="text-amber-300 font-semibold">تنبيه: Cu(OH)2 قاعدة لا تذوب في الماء</div>
          )}
        </div>
      </div>

      {/* Control Panel placed cleanly BELOW the 3D canvas (never hides 3D objects) */}
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
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">1. اختر المحلول المخفف</label>
                <select
                  value={solutionId}
                  onChange={(e) => {
                    setSolutionId(e.target.value as SolutionId);
                    setSafetyEvent('none');
                    onLevelInteract?.(1);
                  }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/85 dark:bg-slate-800 px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                >
                  {Object.values(SOLUTIONS_CATALOG).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nameAr} ({item.formula})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">2. اختر الكاشف في الكأس الرئيسي</label>
                <select
                  value={indicatorId}
                  onChange={(e) => {
                    setIndicatorId(e.target.value as IndicatorId);
                    onLevelInteract?.(1);
                  }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/85 dark:bg-slate-800 px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                >
                  {INDICATOR_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  <span>3. نسبة التخفيف بالماء المقطر</span>
                  <span className="font-mono-num text-teal-700 dark:text-teal-300">{Math.round(dilution * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.9}
                  step={0.05}
                  value={dilution}
                  onChange={(e) => {
                    setDilution(Number(e.target.value));
                    onLevelInteract?.(2);
                  }}
                  className="w-full accent-teal-600"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setXrayMode((v) => !v);
                    onLevelInteract?.(2);
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
                    xrayMode ? 'bg-teal-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>الرؤية الأيونية (X-Ray)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCircuitOn((v) => !v);
                    onLevelInteract?.(2);
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
                    circuitOn ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{circuitOn ? 'إغلاق دائرة التوصيل' : 'تشغيل دائرة التوصيل'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTriggerSafety('danger-water-to-acid')}
                  className="flex items-center gap-1 rounded-xl bg-rose-700 hover:bg-rose-800 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>اختبار خطأ: سكب ماء على حمض</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerSafety('safe-acid-to-water')}
                  className="flex items-center gap-1 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>الطريقة الآمنة: حمض على ماء</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDilution(0);
                    setSafetyEvent('none');
                  }}
                  className="flex items-center gap-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Equation & Explanation Footer */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200">معادلة التأين: </span>
          <span dir="ltr" className="inline-block [unicode-bidi:isolate] font-mono-num font-bold text-teal-700 dark:text-teal-300 mx-1">
            {spec.dissociationEquation}
          </span>
        </div>
        <div className="text-slate-600 dark:text-slate-300">
          <ChemText text={`${indicatorRes.mediumDescription} — المصدر اليومي: ${spec.everydaySource}`} />
        </div>
      </div>
    </div>
  );
};
