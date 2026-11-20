import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronDown, ChevronUp, Eye, Layers, Sparkles } from 'lucide-react';
import { initThreeStudio, makeLabBench } from './threeHelpers';

interface PartMeta {
  id: string;
  nameAr: string;
  functionAr: string;
  examTip?: string;
}

const KIDNEY_PARTS: PartMeta[] = [
  {
    id: 'cortex',
    nameAr: 'القشرة الكلوية (الطبقة الخارجية)',
    functionAr: 'المنطقة الخارجية الداكنة من الكلية، وتحتوي على محفظة بومان وكبيبات الترشيح لبداية تنقية الدم.',
    examTip: 'يتم ترشيح الماء والأملاح والجلوكوز واليوريا داخل محفظة بومان في القشرة.',
  },
  {
    id: 'medulla',
    nameAr: 'النخاع الكلوي (الأهرامات الكلوية)',
    functionAr: 'الطبقة الوسطى وتظهر على شكل أهرامات مخططة تحتوي على التواء هنلي والأنابيب الجامعة لإعادة امتصاص المواد النافعة.',
    examTip: 'تُعاد في الأنابيب الملتوية والتواء هنلي 100% من الجلوكوز ومعظم الماء للدم.',
  },
  {
    id: 'pelvis',
    nameAr: 'حوض الكلية والكؤوس الكلوية',
    functionAr: 'تجويف قمعي في منتصف الكلية يستقبل البول من قمم الأهرامات الكلوية عبر الكؤوس قبل دفعه للحالب.',
    examTip: 'تتجمع فيه الحصوات الكلوية أحياناً مسببةً ألماً شديداً عند انسداد مخرجه.',
  },
  {
    id: 'ureter',
    nameAr: 'الحالب',
    functionAr: 'أنبوب عضلي رفيع ينقل البول من حوض الكلية بحركة دودية منتظمة إلى المثانة البولية.',
  },
  {
    id: 'vessels',
    nameAr: 'الشريان الكلوي والوريد الكلوي',
    functionAr: 'يدخل الشريان الكلوي دماً غير منقّى محملاً باليوريا والفضلات، ويخرج الوريد الكلوي دماً نقياً بعد الترشيح.',
    examTip: 'الدم الخارج في الوريد الكلوي أقل يوريا وأعلى نقاءً من الدم الداخل في الشريان الكلوي.',
  },
];

const FLOWER_PARTS: PartMeta[] = [
  {
    id: 'ovary',
    nameAr: 'المبيض والبويضات',
    functionAr: 'الجزء القاعدي المنتفخ في المتاع، يحتوي بداخله على البويضات، وبعد الإخصاب يتحول المبيض إلى ثمرة والبويضة إلى بذرة.',
    examTip: 'مصيدة وزارية: المبيض ← ثمرة، والبويضة ← بذرة.',
  },
  {
    id: 'stigma',
    nameAr: 'الميسم والقلم (أعلى المتاع)',
    functionAr: 'الميسم قمة لزجة لاستقبال حبوب اللقاح، والقلم أنبوب يصل الميسم بالمبيض ويمر عبره أنبوب اللقاح.',
  },
  {
    id: 'anther',
    nameAr: 'المتك والخيط (السداة - عضو التذكير)',
    functionAr: 'المتك يحمل أكياس اللقاح التي تُنتج حبوب اللقاح (الأمشاج المذكرة)، والخيط يحمل المتك ويرفعه.',
  },
  {
    id: 'petal',
    nameAr: 'البتلات (التويج)',
    functionAr: 'أوراق ملونة زاهية ذات رائحة تجذب الحشرات لإتمام التلقيح الخلطي وتحمي الأعضاء التكاثرية.',
  },
  {
    id: 'sepal',
    nameAr: 'السبلات (الكأس) والتخت',
    functionAr: 'أوراق خضراء تحمي البرعم الزهري قبل تفتحه، والتخت هو الجزء المنتفخ من الساق الذي يحمل أجزاء الزهرة.',
  },
];

export interface AnatomyKidneyFlowerLab3DProps {
  initialModel?: 'kidney' | 'flower';
  onLevelInteract?: (level: number) => void;
}

export const AnatomyKidneyFlowerLab3D: React.FC<AnatomyKidneyFlowerLab3DProps> = ({
  initialModel = 'kidney',
  onLevelInteract,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [model, setModel] = useState<'kidney' | 'flower'>(initialModel);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [explode, setExplode] = useState<number>(0);
  const [showFlow, setShowFlow] = useState<boolean>(true);
  const [selectedPart, setSelectedPart] = useState<PartMeta>(
    initialModel === 'flower' ? FLOWER_PARTS[0] : KIDNEY_PARTS[0]
  );
  const [dockOpen, setDockOpen] = useState<boolean>(true);

  const stateRef = useRef({ model, explode, viewMode });
  useEffect(() => {
    setModel(initialModel);
    setSelectedPart(initialModel === 'flower' ? FLOWER_PARTS[0] : KIDNEY_PARTS[0]);
  }, [initialModel]);

  useEffect(() => {
    stateRef.current = { model, explode, viewMode };
  }, [model, explode, viewMode]);

  useEffect(() => {
    if (viewMode !== '3d') return;
    const el = mountRef.current;
    if (!el) return;

    const studio = initThreeStudio(el, {
      backgroundHex: 0x0b1322,
      cameraPos: [0, 2.5, 6.2],
      target: [0, 1.35, 0],
    });
    studio.scene.add(makeLabBench(8.5, 4.6));

    // 1. Upgraded Procedural 3D Kidney Cross-Section (Bean shape + Pyramids + Pelvis + Vessels)
    const kidneyGroup = new THREE.Group();
    kidneyGroup.position.set(-0.2, 1.45, 0);

    const kidneyShape = new THREE.Shape();
    kidneyShape.moveTo(0.22, 0.85);
    kidneyShape.bezierCurveTo(-0.55, 1.15, -1.05, 0.55, -1.02, 0.0);
    kidneyShape.bezierCurveTo(-1.05, -0.58, -0.55, -1.15, 0.22, -0.85);
    kidneyShape.bezierCurveTo(0.55, -0.72, 0.45, -0.35, 0.24, -0.22);
    kidneyShape.bezierCurveTo(0.08, -0.1, 0.08, 0.1, 0.24, 0.22);
    kidneyShape.bezierCurveTo(0.45, 0.35, 0.55, 0.72, 0.22, 0.85);

    const cortexMesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(kidneyShape, {
        depth: 0.45,
        bevelEnabled: true,
        bevelThickness: 0.12,
        bevelSize: 0.08,
        bevelSegments: 5,
      }),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.52 })
    );
    cortexMesh.position.z = -0.22;
    cortexMesh.userData.part = KIDNEY_PARTS[0];

    // Triangular Renal Pyramids (Medulla)
    const medullaGroup = new THREE.Group();
    const pyramidAngles = [-1.1, -0.55, 0, 0.55, 1.1];
    pyramidAngles.forEach((ang) => {
      const pyr = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.42, 12),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.45 })
      );
      pyr.position.set(-0.36 + Math.cos(ang) * -0.16, Math.sin(ang) * 0.52, 0.26);
      pyr.rotation.z = ang - Math.PI / 2;
      pyr.userData.part = KIDNEY_PARTS[1];
      medullaGroup.add(pyr);
    });

    // Renal Pelvis funnel
    const pelvisMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 0.55, 16),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.35 })
    );
    pelvisMesh.rotation.z = -Math.PI / 2;
    pelvisMesh.position.set(0.16, 0, 0.24);
    pelvisMesh.userData.part = KIDNEY_PARTS[2];

    // Ureter descending tube
    const ureterCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.32, -0.04, 0.22),
      new THREE.Vector3(0.55, -0.55, 0.18),
      new THREE.Vector3(0.5, -1.18, 0.14),
    ]);
    const ureterMesh = new THREE.Mesh(
      new THREE.TubeGeometry(ureterCurve, 20, 0.07, 12, false),
      new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.4 })
    );
    ureterMesh.userData.part = KIDNEY_PARTS[3];

    // Renal Artery & Vein
    const vesselsGroup = new THREE.Group();
    const artery = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.9, 12),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 })
    );
    artery.rotation.z = Math.PI / 2;
    artery.position.set(0.65, 0.18, 0.18);
    artery.userData.part = KIDNEY_PARTS[4];

    const vein = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.9, 12),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 })
    );
    vein.rotation.z = Math.PI / 2;
    vein.position.set(0.65, 0.04, 0.05);
    vein.userData.part = KIDNEY_PARTS[4];
    vesselsGroup.add(artery, vein);

    kidneyGroup.add(cortexMesh, medullaGroup, pelvisMesh, ureterMesh, vesselsGroup);
    studio.scene.add(kidneyGroup);

    // 2. Procedural 3D Complete Flower Assembly
    const flowerGroup = new THREE.Group();
    flowerGroup.position.set(0, 0.78, 0);

    const sepalGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2;
      const sep = new THREE.Mesh(
        new THREE.ConeGeometry(0.14, 0.55, 10),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.55 })
      );
      sep.position.set(Math.cos(ang) * 0.34, 0.25, Math.sin(ang) * 0.34);
      sep.rotation.z = -Math.cos(ang) * 0.75;
      sep.rotation.x = Math.sin(ang) * 0.75;
      sep.userData.part = FLOWER_PARTS[4];
      sepalGroup.add(sep);
    }

    const ovaryMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.45 })
    );
    ovaryMesh.scale.set(0.95, 1.15, 0.95);
    ovaryMesh.position.y = 0.55;
    ovaryMesh.userData.part = FLOWER_PARTS[0];

    const styleStigmaGroup = new THREE.Group();
    const styleMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 0.9, 14),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4 })
    );
    styleMesh.position.y = 1.25;
    const stigmaMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 })
    );
    stigmaMesh.scale.set(1.25, 0.75, 1.25);
    stigmaMesh.position.y = 1.72;
    styleMesh.userData.part = FLOWER_PARTS[1];
    stigmaMesh.userData.part = FLOWER_PARTS[1];
    styleStigmaGroup.add(styleMesh, stigmaMesh);

    const stamensGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2;
      const fil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.85, 8),
        new THREE.MeshStandardMaterial({ color: 0x86efac })
      );
      fil.position.set(Math.cos(ang) * 0.42, 0.95, Math.sin(ang) * 0.42);
      const ant = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.07, 0.14, 8, 12),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 })
      );
      ant.position.set(Math.cos(ang) * 0.44, 1.4, Math.sin(ang) * 0.44);
      ant.userData.part = FLOWER_PARTS[2];
      fil.userData.part = FLOWER_PARTS[2];
      stamensGroup.add(fil, ant);
    }

    const petalsGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2;
      const p = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.5, side: THREE.DoubleSide })
      );
      p.scale.set(0.75, 1.25, 0.15);
      p.position.set(Math.cos(ang) * 0.72, 0.85, Math.sin(ang) * 0.72);
      p.rotation.y = -ang + Math.PI / 2;
      p.rotation.x = 0.42;
      p.userData.part = FLOWER_PARTS[3];
      petalsGroup.add(p);
    }

    flowerGroup.add(sepalGroup, ovaryMesh, styleStigmaGroup, stamensGroup, petalsGroup);
    studio.scene.add(flowerGroup);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onClick = (ev: MouseEvent) => {
      const rect = studio.renderer.domElement.getBoundingClientRect();
      mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, studio.camera);
      const targets = stateRef.current.model === 'kidney' ? kidneyGroup.children : flowerGroup.children;
      const hits = raycaster.intersectObjects(targets, true);
      if (hits.length > 0 && hits[0].object.userData.part) {
        setSelectedPart(hits[0].object.userData.part as PartMeta);
      }
    };
    studio.renderer.domElement.addEventListener('click', onClick);

    const clock = new THREE.Clock();
    let expVal = 0;

    const tick = () => {
      const dt = Math.min(0.05, clock.getDelta());
      const s = stateRef.current;
      expVal = THREE.MathUtils.damp(expVal, s.explode, 6, dt);

      kidneyGroup.visible = s.model === 'kidney';
      flowerGroup.visible = s.model === 'flower';

      if (s.model === 'kidney') {
        medullaGroup.position.z = expVal * 0.7;
        pelvisMesh.position.x = 0.16 + expVal * 0.55;
        ureterMesh.position.x = expVal * 0.55;
        vesselsGroup.position.x = expVal * 0.45;
      } else {
        styleStigmaGroup.position.y = expVal * 0.65;
        stamensGroup.scale.setScalar(1 + expVal * 0.45);
        petalsGroup.scale.setScalar(1 + expVal * 0.6);
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

    return () => {
      studio.renderer.domElement.removeEventListener('click', onClick);
      studio.dispose();
    };
  }, [viewMode]);

  const currentList = model === 'kidney' ? KIDNEY_PARTS : FLOWER_PARTS;
  const pickPart = (id: string) => {
    const found = currentList.find((p) => p.id === id);
    if (found) {
      setSelectedPart(found);
      onLevelInteract?.(model === 'kidney' ? 1 : 2);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setModel('kidney');
              setSelectedPart(KIDNEY_PARTS[0]);
              onLevelInteract?.(1);
            }}
            className={`rounded-xl px-3 py-2 text-xs font-bold cursor-pointer transition-colors ${
              model === 'kidney'
                ? 'bg-teal-700 text-white'
                : 'bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
            }`}
          >
            1. تشريح الكلية في الإنسان (الوحدة 6)
          </button>
          <button
            type="button"
            onClick={() => {
              setModel('flower');
              setSelectedPart(FLOWER_PARTS[0]);
              onLevelInteract?.(2);
            }}
            className={`rounded-xl px-3 py-2 text-xs font-bold cursor-pointer transition-colors ${
              model === 'flower'
                ? 'bg-teal-700 text-white'
                : 'bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
            }`}
          >
            2. تشريح الزهرة الكاملة (الوحدة 7)
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('2d')}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              viewMode === '2d'
                ? 'bg-emerald-700 text-white'
                : 'bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>مقطع تشريحي 2D واضح (مطابق للكتاب)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              viewMode === '3d'
                ? 'bg-slate-800 text-white'
                : 'bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>نموذج 3D مطوّر</span>
          </button>
        </div>
      </div>

      {/* Selected Part Info Card */}
      <div className="rounded-2xl border border-teal-400/50 bg-teal-50/80 dark:bg-teal-950/45 backdrop-blur-md px-4 py-3 space-y-1">
        <div className="text-xs sm:text-sm font-extrabold text-teal-800 dark:text-teal-300">{selectedPart.nameAr}</div>
        <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">{selectedPart.functionAr}</div>
        {selectedPart.examTip && (
          <div className="text-[11px] font-bold text-amber-700 dark:text-amber-300 pt-0.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{selectedPart.examTip}</span>
          </div>
        )}
      </div>

      {viewMode === '2d' ? (
        <div className="rounded-2xl border border-slate-200/85 dark:border-slate-700 bg-gradient-to-b from-slate-50/95 to-sky-50/75 dark:from-slate-950 dark:to-slate-900 p-3 sm:p-4">
          {model === 'kidney' ? (
            <svg viewBox="0 0 640 360" className="w-full h-auto max-h-[410px] select-none">
              <defs>
                <radialGradient id="kidneyCortexGrad" cx="40%" cy="45%" r="65%">
                  <stop offset="0%" stopColor="#b91c1c" />
                  <stop offset="70%" stopColor="#991b1b" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </radialGradient>
                <linearGradient id="kidneyMedullaGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#be123c" />
                </linearGradient>
                <linearGradient id="pelvisGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#facc15" />
                </linearGradient>
              </defs>

              {/* عنوان الرسم */}
              <text x="320" y="24" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f766e">
                قطاع طولي تشريحي للكلية اليمنى في الإنسان (انقر على أي جزء لعرض وظيفته)
              </text>

              {/* الغلاف الليفي الخارجي والقشرة الكلوية (شكل حبة الفاصولياء الحقيقي) */}
              <g onClick={() => pickPart('cortex')} className="cursor-pointer">
                {/* المحفظة الليفية الخارجية */}
                <path
                  d="M275 56 C165 44, 118 118, 120 185 C122 255, 168 320, 275 308 C330 302, 344 260, 326 225 C312 200, 312 168, 326 142 C344 106, 330 62, 275 56 Z"
                  fill="url(#kidneyCortexGrad)"
                  stroke={selectedPart.id === 'cortex' ? '#0d9488' : '#450a0a'}
                  strokeWidth={selectedPart.id === 'cortex' ? 4.5 : 2.8}
                />
                {/* منطقة النخاع الفاتحة نسبياً داخل القشرة */}
                <path
                  d="M268 78 C184 70, 146 126, 148 184 C150 242, 184 294, 268 286 C308 282, 316 244, 300 218 C288 196, 288 172, 300 148 C316 120, 308 82, 268 78 Z"
                  fill="#fca5a5"
                  opacity="0.34"
                />
              </g>

              {/* الأهرامات الكلوية المخططة (النخاع الكلوي) */}
              <g onClick={() => pickPart('medulla')} className="cursor-pointer">
                {[
                  'M240 88 L286 98 L266 138 Z',
                  'M184 114 L228 96 L246 146 Z',
                  'M158 164 L188 128 L232 168 Z',
                  'M158 206 L232 192 L188 236 Z',
                  'M186 254 L246 214 L230 268 Z',
                  'M242 276 L266 226 L288 264 Z',
                ].map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill="url(#kidneyMedullaGrad)"
                    stroke={selectedPart.id === 'medulla' ? '#0d9488' : '#881337'}
                    strokeWidth={selectedPart.id === 'medulla' ? 2.8 : 1.5}
                  />
                ))}
                {/* خطوط التواء هنلي والأنابيب المجمعة داخل الأهرامات */}
                <path
                  d="M258 96 L264 130 M205 110 L238 140 M174 164 L222 168 M174 206 L222 195 M208 252 L238 220"
                  stroke="#fecdd3"
                  strokeWidth="1.2"
                  opacity="0.7"
                />
              </g>

              {/* حوض الكلية والكؤوس الكلوية */}
              <g onClick={() => pickPart('pelvis')} className="cursor-pointer">
                <path
                  d="M236 144 Q256 154 274 152 L270 132 Q284 148 294 166 L326 174 L326 206 L292 204 Q282 224 270 236 L268 214 Q252 212 234 218 L244 196 L224 182 L244 170 Z"
                  fill="url(#pelvisGrad)"
                  stroke={selectedPart.id === 'pelvis' ? '#0d9488' : '#a16207'}
                  strokeWidth={selectedPart.id === 'pelvis' ? 3.5 : 2}
                  strokeLinejoin="round"
                />
              </g>

              {/* الحالب النازل للمثانة */}
              <g onClick={() => pickPart('ureter')} className="cursor-pointer">
                <path
                  d="M322 190 C346 196, 356 224, 354 272 L352 336"
                  fill="none"
                  stroke="#fde047"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M322 190 C346 196, 356 224, 354 272 L352 336"
                  fill="none"
                  stroke={selectedPart.id === 'ureter' ? '#0d9488' : '#ca8a04'}
                  strokeWidth={selectedPart.id === 'ureter' ? 3 : 1.5}
                  strokeDasharray={selectedPart.id === 'ureter' ? 'none' : '0'}
                />
                {showFlow && (
                  <g>
                    <circle r="4.5" fill="#f59e0b">
                      <animateMotion dur="2.6s" repeatCount="indefinite" path="M295,188 C342,196 355,224 352,332" />
                    </circle>
                    <circle r="4" fill="#d97706">
                      <animateMotion dur="2.6s" begin="1.3s" repeatCount="indefinite" path="M295,188 C342,196 355,224 352,332" />
                    </circle>
                  </g>
                )}
              </g>

              {/* الشريان الكلوي (أحمر) والوريد الكلوي (أزرق) عند السرة */}
              <g onClick={() => pickPart('vessels')} className="cursor-pointer">
                <path
                  d="M425 144 C382 146, 350 156, 314 162 L276 146 M314 162 L278 178"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M425 174 C382 174, 352 178, 316 178 L280 198"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                {selectedPart.id === 'vessels' && (
                  <rect x="336" y="132" width="94" height="58" rx="10" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeDasharray="4 3" />
                )}
                {showFlow && (
                  <>
                    <circle r="4" fill="#fecaca">
                      <animateMotion dur="2s" repeatCount="indefinite" path="M422,144 C382,146 350,156 280,148" />
                    </circle>
                    <circle r="4" fill="#bfdbfe">
                      <animateMotion dur="2s" repeatCount="indefinite" path="M282,196 C340,178 380,174 422,174" />
                    </circle>
                  </>
                )}
              </g>

              {/* خطوط الإشارة والتسميات العربية الواضحة */}
              <g fontSize="11.5" fontWeight="bold">
                {/* القشرة */}
                <line x1="138" y1="98" x2="72" y2="76" stroke="#7f1d1d" strokeWidth="1.6" />
                <circle cx="138" cy="98" r="3.5" fill="#7f1d1d" />
                <text x="66" y="72" textAnchor="end" fill="#7f1d1d" className="cursor-pointer" onClick={() => pickPart('cortex')}>
                  القشرة الكلوية
                </text>

                {/* النخاع والأهرامات */}
                <line x1="176" y1="184" x2="78" y2="184" stroke="#be123c" strokeWidth="1.6" />
                <circle cx="176" cy="184" r="3.5" fill="#be123c" />
                <text x="72" y="180" textAnchor="end" fill="#be123c" className="cursor-pointer" onClick={() => pickPart('medulla')}>
                  النخاع الكلوي
                </text>
                <text x="72" y="196" textAnchor="end" fontSize="10" fill="#9f1239">
                  (الأهرامات الكلوية)
                </text>

                {/* حوض الكلية */}
                <line x1="274" y1="242" x2="210" y2="334" stroke="#a16207" strokeWidth="1.6" />
                <circle cx="274" cy="242" r="3.5" fill="#a16207" />
                <text x="204" y="338" textAnchor="end" fill="#854d0e" className="cursor-pointer" onClick={() => pickPart('pelvis')}>
                  حوض الكلية والكؤوس
                </text>

                {/* الشريان والوريد */}
                <text x="434" y="146" textAnchor="start" fill="#dc2626" className="cursor-pointer" onClick={() => pickPart('vessels')}>
                  شريان كلوي (دم غير منقّى ←)
                </text>
                <text x="434" y="178" textAnchor="start" fill="#2563eb" className="cursor-pointer" onClick={() => pickPart('vessels')}>
                  وريد كلوي (← دم منقّى)
                </text>

                {/* الحالب */}
                <line x1="358" y1="278" x2="410" y2="278" stroke="#a16207" strokeWidth="1.6" />
                <circle cx="358" cy="278" r="3.5" fill="#a16207" />
                <text x="416" y="282" textAnchor="start" fill="#854d0e" className="cursor-pointer" onClick={() => pickPart('ureter')}>
                  الحالب (ينقل البول للمثانة ↓)
                </text>
              </g>

              {/* مربع توضيحي مكبّر لموقع النيفرون */}
              <g transform="translate(445, 48)">
                <rect x="0" y="0" width="175" height="68" rx="10" fill="#ffffff" fillOpacity="0.88" stroke="#0d9488" strokeWidth="1.5" />
                <text x="87" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f766e">
                  أين توجد النيفرونات؟
                </text>
                <text x="87" y="38" textAnchor="middle" fontSize="10" fill="#334155">
                  تبدأ محفظة بومان في القشرة
                </text>
                <text x="87" y="54" textAnchor="middle" fontSize="10" fill="#334155">
                  ويمتد التواء هنلي في النخاع (~مليون نيفرون)
                </text>
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 640 360" className="w-full h-auto max-h-[410px] select-none">
              <defs>
                <linearGradient id="petalGradL" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fbcfe8" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="ovaryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bbf7d0" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
              </defs>

              <text x="320" y="24" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f766e">
                قطاع طولي تشريحي للزهرة الكاملة (انقر على أي جزء لعرض وظيفته)
              </text>

              {/* الساق والتخت والسبلات */}
              <g onClick={() => pickPart('sepal')} className="cursor-pointer">
                <rect x="308" y="274" width="24" height="68" rx="6" fill="#15803d" />
                <ellipse cx="320" cy="272" rx="44" ry="16" fill="#22c55e" stroke="#14532d" strokeWidth="2" />
                {/* السبلتان */}
                <path d="M278 272 Q226 266 208 238 Q242 246 286 264 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1.8" />
                <path d="M362 272 Q414 266 432 238 Q398 246 354 264 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1.8" />
              </g>

              {/* البتلات (التويج) */}
              <g onClick={() => pickPart('petal')} className="cursor-pointer">
                <path
                  d="M286 258 C206 238, 160 156, 192 84 C228 96, 266 156, 294 242 Z"
                  fill="url(#petalGradL)"
                  stroke={selectedPart.id === 'petal' ? '#0d9488' : '#be185d'}
                  strokeWidth={selectedPart.id === 'petal' ? 3.5 : 2}
                />
                <path
                  d="M354 258 C434 238, 480 156, 448 84 C412 96, 374 156, 346 242 Z"
                  fill="url(#petalGradL)"
                  stroke={selectedPart.id === 'petal' ? '#0d9488' : '#be185d'}
                  strokeWidth={selectedPart.id === 'petal' ? 3.5 : 2}
                />
                <path
                  d="M272 248 C252 174, 264 96, 320 68 C376 96, 388 174, 368 248 Z"
                  fill="#fdf2f8"
                  opacity="0.55"
                  stroke="#f472b6"
                  strokeWidth="1.5"
                />
              </g>

              {/* الأسدية (الخيط + المتك) */}
              <g onClick={() => pickPart('anther')} className="cursor-pointer">
                {/* سداة يسرى */}
                <path d="M294 258 Q254 185 244 126" fill="none" stroke="#16a34a" strokeWidth="4.5" strokeLinecap="round" />
                <ellipse
                  cx="243"
                  cy="118"
                  rx="16"
                  ry="9"
                  fill="#f59e0b"
                  stroke={selectedPart.id === 'anther' ? '#0d9488' : '#92400e'}
                  strokeWidth={selectedPart.id === 'anther' ? 3.2 : 1.8}
                />
                <circle cx="236" cy="116" r="2.2" fill="#fef08a" />
                <circle cx="249" cy="120" r="2.2" fill="#fef08a" />

                {/* سداة يمنى */}
                <path d="M346 258 Q386 185 396 126" fill="none" stroke="#16a34a" strokeWidth="4.5" strokeLinecap="round" />
                <ellipse
                  cx="397"
                  cy="118"
                  rx="16"
                  ry="9"
                  fill="#f59e0b"
                  stroke={selectedPart.id === 'anther' ? '#0d9488' : '#92400e'}
                  strokeWidth={selectedPart.id === 'anther' ? 3.2 : 1.8}
                />
                <circle cx="391" cy="116" r="2.2" fill="#fef08a" />
                <circle cx="403" cy="120" r="2.2" fill="#fef08a" />
              </g>

              {/* المتاع: الميسم والقلم + المبيض والبويضات */}
              <g onClick={() => pickPart('stigma')} className="cursor-pointer">
                <path
                  d="M300 78 C306 78, 308 100, 308 176 L332 176 C332 100, 334 78, 340 78 Z"
                  fill="#86efac"
                  stroke={selectedPart.id === 'stigma' ? '#0d9488' : '#15803d'}
                  strokeWidth={selectedPart.id === 'stigma' ? 3.2 : 2}
                />
                {/* الميسم */}
                <path
                  d="M294 74 Q306 60 320 68 Q334 60 346 74 Q334 86 320 82 Q306 86 294 74 Z"
                  fill="#fde047"
                  stroke={selectedPart.id === 'stigma' ? '#0d9488' : '#ca8a04'}
                  strokeWidth={selectedPart.id === 'stigma' ? 3.2 : 2}
                />
              </g>

              <g onClick={() => pickPart('ovary')} className="cursor-pointer">
                {/* المبيض */}
                <path
                  d="M306 176 C276 190, 268 248, 320 264 C372 248, 364 190, 334 176 Z"
                  fill="url(#ovaryGrad)"
                  stroke={selectedPart.id === 'ovary' ? '#0d9488' : '#15803d'}
                  strokeWidth={selectedPart.id === 'ovary' ? 3.8 : 2.2}
                />
                {/* تجويف المبيض والبويضات */}
                <ellipse cx="320" cy="222" rx="22" ry="26" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                <ellipse cx="313" cy="212" rx="7" ry="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.4" />
                <ellipse cx="327" cy="218" rx="7" ry="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.4" />
                <ellipse cx="315" cy="233" rx="7" ry="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.4" />
              </g>

              {/* التسميات */}
              <g fontSize="11.5" fontWeight="bold">
                <line x1="346" y1="74" x2="430" y2="60" stroke="#a16207" strokeWidth="1.5" />
                <text x="436" y="64" fill="#854d0e" className="cursor-pointer" onClick={() => pickPart('stigma')}>
                  الميسم (عضو التأنيث)
                </text>

                <line x1="332" y1="132" x2="440" y2="132" stroke="#15803d" strokeWidth="1.5" />
                <text x="446" y="136" fill="#166534" className="cursor-pointer" onClick={() => pickPart('stigma')}>
                  القلم
                </text>

                <line x1="354" y1="224" x2="452" y2="212" stroke="#0f766e" strokeWidth="1.5" />
                <text x="458" y="216" fill="#0f766e" className="cursor-pointer" onClick={() => pickPart('ovary')}>
                  المبيض والبويضات
                </text>

                <line x1="227" y1="118" x2="145" y2="108" stroke="#b45309" strokeWidth="1.5" />
                <text x="139" y="112" textAnchor="end" fill="#b45309" className="cursor-pointer" onClick={() => pickPart('anther')}>
                  المتك والخيط (السداة)
                </text>

                <line x1="186" y1="168" x2="122" y2="168" stroke="#be185d" strokeWidth="1.5" />
                <text x="116" y="172" textAnchor="end" fill="#be185d" className="cursor-pointer" onClick={() => pickPart('petal')}>
                  البتلات (التويج)
                </text>

                <line x1="224" y1="254" x2="142" y2="264" stroke="#15803d" strokeWidth="1.5" />
                <text x="136" y="268" textAnchor="end" fill="#166534" className="cursor-pointer" onClick={() => pickPart('sepal')}>
                  السبلات (الكأس)
                </text>
              </g>
            </svg>
          )}
        </div>
      ) : (
        <div className="relative w-full h-[350px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-300/80 dark:border-slate-800 bg-slate-950">
          <div ref={mountRef} className="w-full h-full cursor-pointer" />
          <div className="pointer-events-none absolute top-3 right-3 rounded-lg bg-slate-900/90 border border-slate-700 px-3 py-1.5 text-[11px] text-slate-200">
            انقر على أي جزء في المجسم أو اختره من الشريط السفلي لعرض وظيفته
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/70 dark:bg-slate-900/75 backdrop-blur-md p-3.5 space-y-2.5 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="font-extrabold text-slate-800 dark:text-slate-100">أدوات التشريح والأجزاء</span>
          <div className="flex items-center gap-2">
            {viewMode === '2d' && model === 'kidney' && (
              <button
                type="button"
                onClick={() => setShowFlow((v) => !v)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                  showFlow
                    ? 'bg-teal-700 text-white'
                    : 'border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800'
                }`}
              >
                {showFlow ? 'إخفاء حركة الدم والبول' : 'إظهار حركة الدم والبول'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setDockOpen((v) => !v)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/75 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              {dockOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{dockOpen ? 'طيّ الأدوات' : 'عرض الأدوات'}</span>
            </button>
          </div>
        </div>

        {dockOpen && (
          <div className="space-y-2.5">
            {viewMode === '3d' && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 shrink-0">
                  <Layers className="w-3.5 h-3.5" /> تفكيك الطبقات:
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={explode}
                  onChange={(e) => setExplode(Number(e.target.value))}
                  className="flex-1 accent-teal-600"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {currentList.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => pickPart(p.id)}
                  className={`rounded-xl px-3 py-1.5 text-[11px] font-bold cursor-pointer transition-colors ${
                    selectedPart.id === p.id
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.nameAr}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
