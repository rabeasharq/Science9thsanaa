import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronDown, ChevronUp, Droplets } from 'lucide-react';
import { initThreeStudio, makeLabBench } from './threeHelpers';

export interface CapillarySurfaceLab3DProps {
  initialFocus?: 'surface' | 'capillary' | 'both';
  locked?: boolean;
  onLevelInteract?: (level: number) => void;
}

export const CapillarySurfaceLab3D: React.FC<CapillarySurfaceLab3DProps> = ({
  initialFocus = 'both',
  locked = false,
  onLevelInteract,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [focus, setFocus] = useState<'surface' | 'capillary' | 'both'>(initialFocus);
  const [liquid, setLiquid] = useState<'water' | 'mercury'>('water');
  const [soapAdded, setSoapAdded] = useState<boolean>(false);
  const [dockOpen, setDockOpen] = useState<boolean>(true);

  useEffect(() => {
    setFocus(initialFocus);
    if (initialFocus === 'surface') {
      setLiquid('water');
    }
  }, [initialFocus]);

  const stateRef = useRef({ focus, liquid, soapAdded });
  useEffect(() => {
    stateRef.current = { focus, liquid, soapAdded };
  }, [focus, liquid, soapAdded]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = initThreeStudio(el, {
      backgroundHex: 0x0b1322,
      cameraPos: [0, 2.9, 7.2],
      target: [0, 1.1, 0],
    });
    studio.scene.add(makeLabBench(9.0, 4.8));

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.1,
      transmission: studio.isSoftwareGl ? 0 : 0.78,
      transparent: true,
      opacity: 0.36,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    // Left Station: Capillary Basin + 4 Capillary Tubes
    const capillaryGroup = new THREE.Group();
    const basinWall = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.9, 1.8), glassMat);
    basinWall.position.set(-0.9, 0.45, 0);
    basinWall.renderOrder = 3;
    capillaryGroup.add(basinWall);

    const basinFluidMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.8,
    });
    const basinFluid = new THREE.Mesh(new THREE.BoxGeometry(3.68, 0.65, 1.68), basinFluidMat);
    basinFluid.position.set(-0.9, 0.34, 0);
    capillaryGroup.add(basinFluid);

    const radii = [0.22, 0.15, 0.10, 0.06];
    const tubeColumns: THREE.Mesh[] = [];
    const colMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.18, metalness: 0.1 });

    radii.forEach((r, idx) => {
      const x = -2.1 + idx * 0.78;
      const outer = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.03, r + 0.03, 2.6, 20, 1, true), glassMat);
      outer.position.set(x, 1.55, 0);
      outer.renderOrder = 3;
      capillaryGroup.add(outer);

      const innerCol = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.9, r * 0.9, 1.0, 16), colMat);
      innerCol.position.set(x, 0.85, 0);
      capillaryGroup.add(innerCol);
      tubeColumns.push(innerCol);
    });
    studio.scene.add(capillaryGroup);

    // Right station: Surface Tension Bowl + Floating Sewing Needle
    const surfaceGroup = new THREE.Group();
    const bowlWall = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.95, 0.95, 28, 1, true), glassMat);
    bowlWall.position.set(2.2, 0.48, 0);
    bowlWall.renderOrder = 3;
    const bowlWater = new THREE.Mesh(new THREE.CylinderGeometry(1.04, 0.9, 0.72, 28), basinFluidMat);
    bowlWater.position.set(2.2, 0.38, 0);

    const needleMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.01, 1.05, 12),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 })
    );
    needleMesh.rotation.z = Math.PI / 2;
    needleMesh.position.set(2.2, 0.75, 0);
    surfaceGroup.add(bowlWall, bowlWater, needleMesh);
    studio.scene.add(surfaceGroup);

    const clock = new THREE.Clock();
    const targetColor = new THREE.Color();

    const tick = () => {
      const dt = Math.min(0.05, clock.getDelta());
      const s = stateRef.current;

      capillaryGroup.visible = s.focus === 'both' || s.focus === 'capillary';
      surfaceGroup.visible = s.focus === 'both' || s.focus === 'surface';

      capillaryGroup.position.x = s.focus === 'capillary' ? 0.9 : 0;
      surfaceGroup.position.x = s.focus === 'surface' ? -2.2 : 0;

      const isMercury = s.liquid === 'mercury' && s.focus !== 'surface';
      targetColor.setHex(isMercury ? 0xcbd5e1 : 0x0ea5e9);
      basinFluidMat.color.lerp(targetColor, Math.min(1, dt * 6));
      colMat.color.copy(basinFluidMat.color);
      basinFluidMat.metalness = isMercury ? 0.92 : 0.1;
      colMat.metalness = isMercury ? 0.92 : 0.1;

      const heights = isMercury ? [0.55, 0.45, 0.35, 0.25] : [0.9, 1.25, 1.75, 2.25];
      tubeColumns.forEach((col, i) => {
        const targetH = heights[i] * (s.soapAdded && !isMercury ? 0.65 : 1);
        col.scale.y = THREE.MathUtils.damp(col.scale.y, targetH, 6, dt);
        col.position.y = 0.25 + col.scale.y / 2;
      });

      const targetNeedleY = s.soapAdded ? 0.12 : 0.75;
      needleMesh.position.y = THREE.MathUtils.damp(needleMesh.position.y, targetNeedleY, 5, dt);

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

  const showCapillaryControls = focus === 'both' || focus === 'capillary';
  const showSurfaceControls = focus === 'both' || focus === 'surface';

  return (
    <div className="flex flex-col gap-3">
      {!locked && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFocus('both')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
              focus === 'both'
                ? 'bg-teal-700 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            عرض المحطتين معاً
          </button>
          <button
            type="button"
            onClick={() => {
              setFocus('surface');
              setLiquid('water');
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
              focus === 'surface'
                ? 'bg-teal-700 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            1. الشد السطحي وطفو الإبرة
          </button>
          <button
            type="button"
            onClick={() => setFocus('capillary')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
              focus === 'capillary'
                ? 'bg-teal-700 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            2. التماسك والتلاصق والخاصية الشعرية
          </button>
        </div>
      )}

      <div className="relative w-full h-[350px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-300/80 dark:border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        <div className="pointer-events-none absolute top-3 right-3 rounded-lg bg-slate-900/90 border border-slate-700 px-3 py-1.5 text-xs text-slate-200">
          <div className="font-bold text-teal-300">
            {focus === 'surface'
              ? 'تجربة الشد السطحي وطفو الإبرة (الوحدة 11)'
              : focus === 'capillary'
              ? 'تجربة التماسك والتلاصق والخاصية الشعرية (الوحدة 11)'
              : 'الخاصية الشعرية والشد السطحي (الوحدة 11)'}
          </div>
          <div className="text-[11px] text-slate-400">
            {focus === 'surface'
              ? soapAdded
                ? 'قطرة الصابون/الزيت كسرت الشد السطحي فغاصت الإبرة'
                : 'الغشاء المشدود لسطح الماء يحمل الإبرة الفولاذية أفقياً'
              : liquid === 'water'
              ? 'الماء: التلاصق > التماسك (يرتفع أكثر في الأنبوب الأضيق)'
              : 'الزئبق: التماسك > التلاصق (ينخفض داخل الأنابيب الضيقة)'}
          </div>
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
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {showCapillaryControls && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLiquid('water');
                    onLevelInteract?.(1);
                  }}
                  className={`rounded-xl px-3.5 py-2 font-bold cursor-pointer ${
                    liquid === 'water'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  تعبئة بالماء (تقعر لأعلى)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLiquid('mercury');
                    onLevelInteract?.(2);
                  }}
                  className={`rounded-xl px-3.5 py-2 font-bold cursor-pointer ${
                    liquid === 'mercury'
                      ? 'bg-slate-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  تعبئة بالزئبق (تحدب وانخفاض)
                </button>
              </div>
            )}
            {showSurfaceControls && (
              <button
                type="button"
                onClick={() => {
                  setSoapAdded((v) => !v);
                  onLevelInteract?.(3);
                }}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-bold cursor-pointer ${
                  soapAdded ? 'bg-rose-600 text-white' : 'bg-teal-700 text-white'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>{soapAdded ? 'إعادة الإبرة للطفو (ماء نقي)' : 'إضافة قطرة صابون/زيت (كسر الشد السطحي)'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
