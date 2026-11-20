import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronDown, ChevronUp, Flame } from 'lucide-react';
import { initThreeStudio, makeLabBench } from './threeHelpers';

const FRACTIONS = [
  { temp: 20, name: 'غازات نفطية (وقود منزلي)', y: 2.85, color: '#38bdf8' },
  { temp: 100, name: 'الجازولين (البنزين)', y: 2.3, color: '#22c55e' },
  { temp: 200, name: 'الكيروسين (وقود الطائرات)', y: 1.75, color: '#eab308' },
  { temp: 300, name: 'الديزل (السولار)', y: 1.2, color: '#f97316' },
  { temp: 380, name: 'الزيوت الثقيلة والأسفلت (الزفت)', y: 0.65, color: '#64748b' },
];

export interface OilDistillationCO2Lab3DProps {
  initialStation?: 'distillation' | 'co2';
  locked?: boolean;
  onLevelInteract?: (level: number) => void;
}

export const OilDistillationCO2Lab3D: React.FC<OilDistillationCO2Lab3DProps> = ({
  initialStation = 'distillation',
  locked = false,
  onLevelInteract,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [station, setStation] = useState<'distillation' | 'co2'>(initialStation);
  const [furnaceTemp, setFurnaceTemp] = useState<number>(200);
  const [pourCO2, setPourCO2] = useState<boolean>(false);
  const [dockOpen, setDockOpen] = useState<boolean>(true);

  const stateRef = useRef({ station, furnaceTemp, pourCO2 });
  useEffect(() => {
    setStation(initialStation);
  }, [initialStation]);

  useEffect(() => {
    stateRef.current = { station, furnaceTemp, pourCO2 };
  }, [station, furnaceTemp, pourCO2]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = initThreeStudio(el, {
      backgroundHex: 0x0b1322,
      cameraPos: [0, 3.2, 7.4],
      target: [0, 1.35, 0],
    });
    studio.scene.add(makeLabBench(9.2, 5.0));

    // 1. Fractional Distillation Tower
    const distGroup = new THREE.Group();
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.75, roughness: 0.35 });
    const towerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.72, 3.1, 24), towerMat);
    towerBody.position.set(0.4, 1.55, 0);
    const towerDome = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), towerMat);
    towerDome.position.set(0.4, 3.1, 0);
    distGroup.add(towerBody, towerDome);

    // Furnace on the left
    const furnace = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 1.1, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 })
    );
    furnace.position.set(-1.7, 0.55, 0);
    const furnaceGlow = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.45, 0.1),
      new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 1.5 })
    );
    furnaceGlow.position.set(-1.7, 0.45, 0.56);
    const feedPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.7, 12),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
    );
    feedPipe.rotation.z = Math.PI / 2;
    feedPipe.position.set(-0.7, 0.6, 0);
    distGroup.add(furnace, furnaceGlow, feedPipe);

    // Output tray rings at 5 heights
    const ringMats: THREE.MeshStandardMaterial[] = [];
    FRACTIONS.forEach((f) => {
      const mat = new THREE.MeshStandardMaterial({ color: f.color, emissive: f.color, emissiveIntensity: 0.2, roughness: 0.3 });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.69, 0.05, 10, 28), mat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0.4, f.y, 0);
      const outlet = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 10), mat);
      outlet.rotation.z = Math.PI / 2;
      outlet.position.set(1.45, f.y, 0);
      distGroup.add(ring, outlet);
      ringMats.push(mat);
    });
    studio.scene.add(distGroup);

    // 2. CO2 Staircase Candles Experiment
    const co2Group = new THREE.Group();
    const tankGlass = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 2.4, 1.4),
      new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.26,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
    tankGlass.position.set(0, 1.2, 0);
    tankGlass.renderOrder = 3;
    co2Group.add(tankGlass);

    const candleFlames: THREE.Mesh[] = [];
    const candleHeights = [0.45, 0.85, 1.25, 1.65];
    candleHeights.forEach((h, i) => {
      const x = -1.0 + i * 0.68;
      const wax = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, h, 14),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 })
      );
      wax.position.set(x, h / 2, 0);
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.065, 0.2, 10),
        new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xf97316, emissiveIntensity: 1.8 })
      );
      flame.position.set(x, h + 0.12, 0);
      co2Group.add(wax, flame);
      candleFlames.push(flame);
    });

    const co2GasLayer = new THREE.Mesh(
      new THREE.BoxGeometry(3.3, 1.0, 1.3),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.28, depthWrite: false })
    );
    co2GasLayer.position.set(0, 0.5, 0);
    co2Group.add(co2GasLayer);
    studio.scene.add(co2Group);

    const clock = new THREE.Clock();
    let co2Level = 0;

    const tick = () => {
      const dt = Math.min(0.05, clock.getDelta());
      const elapsed = clock.getElapsedTime();
      const s = stateRef.current;

      distGroup.visible = s.station === 'distillation';
      co2Group.visible = s.station === 'co2';

      if (s.station === 'distillation') {
        furnaceGlow.material.emissiveIntensity = 0.6 + (s.furnaceTemp / 400) * 1.8;
        FRACTIONS.forEach((f, idx) => {
          const active = s.furnaceTemp >= f.temp;
          ringMats[idx].emissiveIntensity = active ? 1.1 : 0.1;
        });
      }

      if (s.station === 'co2') {
        co2Level = THREE.MathUtils.damp(co2Level, s.pourCO2 ? 2.1 : 0.0, 1.4, dt);
        co2GasLayer.visible = co2Level > 0.05;
        co2GasLayer.scale.y = Math.max(0.05, co2Level);
        co2GasLayer.position.y = co2Level / 2;

        // Candles extinguish from bottom up as heavy CO2 gas rises
        candleFlames.forEach((fl, idx) => {
          const extinguished = co2Level > candleHeights[idx] + 0.05;
          fl.visible = !extinguished;
          if (!extinguished) {
            fl.scale.y = 0.9 + Math.sin(elapsed * 12 + idx) * 0.15;
          }
        });
      }

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
      if (studio.isSoftwareGl) studio.afterDraw(tick);
      else studio.setActiveFrameId(requestAnimationFrame(tick));
    };

    if (studio.isSoftwareGl) {
      studio.renderer.render(studio.scene, studio.camera);
      studio.afterDraw(tick);
    } else {
      studio.setActiveFrameId(requestAnimationFrame(tick));
    }

    return () => studio.dispose();
  }, []);

  const activeFraction = [...FRACTIONS].reverse().find((f) => furnaceTemp >= f.temp) ?? FRACTIONS[4];

  return (
    <div className="flex flex-col gap-3">
      {!locked && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setStation('distillation');
              onLevelInteract?.(1);
            }}
            className={`rounded-lg px-3 py-2 text-xs font-bold cursor-pointer ${
              station === 'distillation' ? 'bg-teal-700 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            1. برج التقطير التجزيئي للنفط
          </button>
          <button
            type="button"
            onClick={() => {
              setStation('co2');
              onLevelInteract?.(2);
            }}
            className={`rounded-lg px-3 py-2 text-xs font-bold cursor-pointer ${
              station === 'co2' ? 'bg-teal-700 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            2. سكب غاز CO2 لإطفاء الشموع المتدرجة
          </button>
        </div>
      )}

      <div className="relative w-full h-[350px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-300/80 dark:border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        <div className="pointer-events-none absolute top-3 right-3 rounded-lg bg-slate-900/90 border border-slate-700 px-3 py-1.5 text-xs text-slate-200">
          {station === 'distillation' ? (
            <>
              <div className="font-bold text-amber-300">درجة التسخين: {furnaceTemp} °م</div>
              <div className="text-[11px] text-slate-300">المشتق النشط: {activeFraction.name}</div>
            </>
          ) : (
            <>
              <div className="font-bold text-teal-300">خصائص غاز ثاني أكسيد الكربون</div>
              <div className="text-[11px] text-slate-300">أثقل من الهواء ولا يساعد على الاشتعال (تنطفئ الشمعة السفلى أولاً)</div>
            </>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/70 dark:bg-slate-900/75 backdrop-blur-md p-3.5 space-y-2.5">
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
          <div className="text-xs text-slate-800 dark:text-slate-100">
            {station === 'distillation' ? (
              <div>
                <div className="flex justify-between font-bold text-slate-600 dark:text-slate-300 mb-1">
                  <span>ضبط حرارة فرن التقطير (20°م - 400°م)</span>
                  <span className="font-mono-num text-amber-700 dark:text-amber-300">{furnaceTemp} °م</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={400}
                  step={10}
                  value={furnaceTemp}
                  onChange={(e) => setFurnaceTemp(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-slate-700 dark:text-slate-300">اسكب غاز CO2 الثقيل داخل الحوض وشاهد ترتيب انطفاء الشموع:</span>
                <button
                  type="button"
                  onClick={() => setPourCO2((v) => !v)}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-bold cursor-pointer ${
                    pourCO2 ? 'bg-amber-600 text-white' : 'bg-teal-700 text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{pourCO2 ? 'تفريغ الحوض وإعادة إشعال الشموع' : 'سكب غاز CO2 الآن'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
