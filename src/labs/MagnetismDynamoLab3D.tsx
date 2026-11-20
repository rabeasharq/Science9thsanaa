import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronDown, ChevronUp, Compass, Zap } from 'lucide-react';
import { initThreeStudio, makeLabBench } from './threeHelpers';

export interface MagnetismDynamoLab3DProps {
  initialStation?: 'compass' | 'dynamo';
  onLevelInteract?: (level: number) => void;
}

export const MagnetismDynamoLab3D: React.FC<MagnetismDynamoLab3DProps> = ({
  initialStation = 'compass',
  onLevelInteract,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const waveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [station, setStation] = useState<'compass' | 'dynamo'>(initialStation);
  const [magnetAngleDeg, setMagnetAngleDeg] = useState<number>(0);
  const [dynamoRpm, setDynamoRpm] = useState<number>(40);
  const [showFluxLines, setShowFluxLines] = useState<boolean>(true);
  const [dockOpen, setDockOpen] = useState<boolean>(true);

  const stateRef = useRef({ station, magnetAngleDeg, dynamoRpm, showFluxLines });
  useEffect(() => {
    setStation(initialStation);
  }, [initialStation]);

  useEffect(() => {
    stateRef.current = { station, magnetAngleDeg, dynamoRpm, showFluxLines };
  }, [station, magnetAngleDeg, dynamoRpm, showFluxLines]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = initThreeStudio(el, {
      backgroundHex: 0x0b1322,
      cameraPos: [0, 3.3, 7.2],
      target: [0.1, 0.9, 0],
    });
    studio.scene.add(makeLabBench(9.2, 5.0));

    // Station 1: Bar Magnet + Flux Loops + Compass
    const compassStation = new THREE.Group();

    const magnetGroup = new THREE.Group();
    magnetGroup.position.set(-1.3, 0.45, 0);
    const northHalf = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.42, 0.55),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4, metalness: 0.3 })
    );
    northHalf.position.x = 0.55;
    const southHalf = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.42, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4, metalness: 0.3 })
    );
    southHalf.position.x = -0.55;
    magnetGroup.add(northHalf, southHalf);

    // Procedural Flux Field Loops (TubeGeometry around magnet)
    const fluxGroup = new THREE.Group();
    const fluxMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55 });
    [0.55, 0.95, 1.35].forEach((arcH) => {
      const topCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.05, 0, 0),
        new THREE.Vector3(0.55, arcH, 0),
        new THREE.Vector3(-0.55, arcH, 0),
        new THREE.Vector3(-1.05, 0, 0),
      ]);
      const sideCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.05, 0, 0),
        new THREE.Vector3(0.55, 0, arcH),
        new THREE.Vector3(-0.55, 0, arcH),
        new THREE.Vector3(-1.05, 0, 0),
      ]);
      fluxGroup.add(new THREE.Mesh(new THREE.TubeGeometry(topCurve, 24, 0.015, 6, false), fluxMat));
      fluxGroup.add(new THREE.Mesh(new THREE.TubeGeometry(sideCurve, 24, 0.015, 6, false), fluxMat));
    });
    magnetGroup.add(fluxGroup);

    // Compass Assembly
    const compassGroup = new THREE.Group();
    compassGroup.position.set(1.6, 0.15, 0);
    const compassCase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.72, 0.22, 28),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 })
    );
    const compassFace = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.24, 28),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 })
    );
    const needleGroup = new THREE.Group();
    needleGroup.position.y = 0.18;
    const needleRed = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.45, 4),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 })
    );
    needleRed.rotation.z = -Math.PI / 2;
    needleRed.position.x = 0.22;
    const needleBlue = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.45, 4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
    );
    needleBlue.rotation.z = Math.PI / 2;
    needleBlue.position.x = -0.22;
    needleGroup.add(needleRed, needleBlue);
    compassGroup.add(compassCase, compassFace, needleGroup);

    compassStation.add(magnetGroup, compassGroup);
    studio.scene.add(compassStation);

    // Station 2: AC Dynamo (U-Shaped Magnet Poles + Rotating Copper Coil + Galvanometer Needle)
    const dynamoStation = new THREE.Group();
    const poleN = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 1.5, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45 })
    );
    poleN.position.set(-1.6, 1.0, 0);
    const poleS = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 1.5, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.45 })
    );
    poleS.position.set(0.4, 1.0, 0);

    const coilPivot = new THREE.Group();
    coilPivot.position.set(-0.6, 1.0, 0);
    const coilMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });
    const coilLoop = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.045, 12, 4), coilMat);
    coilLoop.rotation.z = Math.PI / 4;
    const axle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.6, 12),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
    );
    axle.rotation.x = Math.PI / 2;
    coilPivot.add(coilLoop, axle);

    // Galvanometer Stand
    const galvBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.2, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
    );
    galvBox.position.set(2.0, 0.6, 0);
    const galvDial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.06, 24),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
    );
    galvDial.rotation.x = Math.PI / 2;
    galvDial.position.set(2.0, 0.82, 0.26);
    const galvNeedle = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.34, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xef4444 })
    );
    galvNeedle.position.set(2.0, 0.82, 0.31);
    dynamoStation.add(poleN, poleS, coilPivot, galvBox, galvDial, galvNeedle);
    studio.scene.add(dynamoStation);

    const clock = new THREE.Clock();
    let coilTheta = 0;

    const tick = () => {
      const dt = Math.min(0.05, clock.getDelta());
      const s = stateRef.current;

      compassStation.visible = s.station === 'compass';
      dynamoStation.visible = s.station === 'dynamo';

      if (s.station === 'compass') {
        fluxGroup.visible = s.showFluxLines;
        const magRad = THREE.MathUtils.degToRad(s.magnetAngleDeg);
        magnetGroup.rotation.y = THREE.MathUtils.damp(magnetGroup.rotation.y, magRad, 8, dt);
        // Compass aligns opposite/along magnetic field vector
        needleGroup.rotation.y = THREE.MathUtils.damp(needleGroup.rotation.y, magRad, 7, dt);
      }

      if (s.station === 'dynamo') {
        const omega = (s.dynamoRpm / 60) * Math.PI * 2;
        coilTheta += omega * dt;
        coilPivot.rotation.z = coilTheta;
        const induced = Math.sin(coilTheta) * (s.dynamoRpm / 100);
        galvNeedle.rotation.z = -induced * 0.9;

        // Draw live AC sine wave on 2D canvas
        const wCanvas = waveCanvasRef.current;
        if (wCanvas) {
          const ctx = wCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, wCanvas.width, wCanvas.height);
            ctx.strokeStyle = '#334155';
            ctx.beginPath();
            ctx.moveTo(0, wCanvas.height / 2);
            ctx.lineTo(wCanvas.width, wCanvas.height / 2);
            ctx.stroke();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            const amp = (s.dynamoRpm / 100) * (wCanvas.height * 0.38);
            for (let x = 0; x < wCanvas.width; x++) {
              const y = wCanvas.height / 2 - Math.sin(coilTheta + x * 0.05) * amp;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
        }
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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setStation('compass');
            onLevelInteract?.(1);
          }}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold cursor-pointer ${
            station === 'compass' ? 'bg-teal-700 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>1. المغناطيس وخطوط الفيض والبوصلة</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setStation('dynamo');
            onLevelInteract?.(3);
          }}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold cursor-pointer ${
            station === 'dynamo' ? 'bg-teal-700 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>2. الدينامو والحث الكهرومغناطيسي</span>
        </button>
      </div>

      <div className="relative w-full h-[350px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-300/80 dark:border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {station === 'dynamo' && (
          <div className="absolute top-3 left-3 rounded-lg border border-slate-700 bg-slate-900/95 p-2 text-slate-200">
            <div className="text-[10px] text-slate-400 mb-1">موجة التيار المتردد المستحث</div>
            <canvas ref={waveCanvasRef} width={180} height={58} className="rounded border border-slate-800" />
          </div>
        )}
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
            {station === 'compass' ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex justify-between font-bold text-slate-600 dark:text-slate-300 mb-1">
                    <span>تدوير القضيب المغناطيسي</span>
                    <span className="font-mono-num text-teal-700 dark:text-teal-300">{magnetAngleDeg}°</span>
                  </div>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    value={magnetAngleDeg}
                    onChange={(e) => setMagnetAngleDeg(Number(e.target.value))}
                    className="w-full accent-teal-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowFluxLines((v) => !v)}
                  className={`rounded-xl px-3.5 py-2 font-bold cursor-pointer ${
                    showFluxLines
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {showFluxLines ? 'إخفاء خطوط الفيض' : 'إظهار خطوط الفيض'}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between font-bold text-slate-600 dark:text-slate-300 mb-1">
                  <span>سرعة دوران ملف الدينامو (المولد)</span>
                  <span className="font-mono-num text-amber-700 dark:text-amber-300">{dynamoRpm} دورة/دقيقة</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={dynamoRpm}
                  onChange={(e) => setDynamoRpm(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
