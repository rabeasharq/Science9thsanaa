import React, { useState } from 'react';
import { AlertCircle, Calculator, Flame, FlaskConical, Zap } from 'lucide-react';
import {
  calculateAtmosphericPressure,
  calculateLiquidPressure,
  calculateSolidPressure,
  calculateSurfaceTension,
  LIQUIDS_CATALOG,
  LiquidTypeId,
  YEMENI_CITIES_BAROMETER,
} from '../../engines/physicsEngine';
import { SOLUTIONS_CATALOG, SolutionId } from '../../engines/chemistryEngine';
import { ChemText, MathBlock } from '../common/ChemText';

const DISTILLATION_STAGES = [
  { min: 20, max: 70, name: 'الغازات النفطية (وقود منزلي)', boiling: 'أقل من 40 °م' },
  { min: 71, max: 160, name: 'الجازولين (البنزين)', boiling: '40 – 160 °م' },
  { min: 161, max: 250, name: 'الكيروسين (وقود الطائرات والمصابيح)', boiling: '160 – 250 °م' },
  { min: 251, max: 350, name: 'الديزل (السولار)', boiling: '250 – 350 °م' },
  { min: 351, max: 450, name: 'الزيوت الثقيلة وشمع البرافين والإسفلت', boiling: 'أعلى من 350 °م' },
];

export const FormulaCalculators: React.FC<{ unitId: number }> = ({ unitId }) => {
  // Unit 2 states
  const [selectedSol, setSelectedSol] = useState<SolutionId>('h2so4');
  const [phInput, setPhInput] = useState<number>(3);

  // Unit 5 states (Transformer)
  const [v1, setV1] = useState<number>(220);
  const [n1, setN1] = useState<number>(500);
  const [n2, setN2] = useState<number>(100);

  // Unit 9 states (Distillation temp)
  const [oilTemp, setOilTemp] = useState<number>(200);

  // Unit 11 states (Surface tension: ش = ق / 2ل)
  const [stForceN, setStForceN] = useState<number>(0.007);
  const [stLengthM, setStLengthM] = useState<number>(0.05);

  // Unit 1 states (Solution mass percentage concentration)
  const [soluteMassG, setSoluteMassG] = useState<number>(20);
  const [solventMassG, setSolventMassG] = useState<number>(80);

  // Unit 13 states (Solar PV Power = V * I)
  const [pvVolts, setPvVolts] = useState<number>(18);
  const [pvAmps, setPvAmps] = useState<number>(5);

  // Unit 12 states
  const [weightKgf, setWeightKgf] = useState<number>(70);
  const [areaM2, setAreaM2] = useState<number>(0.35);
  const [oneFoot, setOneFoot] = useState<boolean>(true);
  const [liquidId, setLiquidId] = useState<LiquidTypeId>('pure-water');
  const [depthM, setDepthM] = useState<number>(3);
  const [altitudeM, setAltitudeM] = useState<number>(0);

  if (unitId === 1) {
    const totalMass = soluteMassG + solventMassG;
    const pct = Number(((soluteMassG / Math.max(1, totalMass)) * 100).toFixed(1));
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>حاسبة التركيز المئوي الكتلي للمحلول (الوحدة 1)</span>
          </div>
          <MathBlock latex="\text{التركيز \%} = \frac{\text{كتلة المذاب}}{\text{كتلة المحلول}} \times 100" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 mb-1">كتلة المذاب (جم)</label>
            <input
              type="number"
              min={1}
              max={500}
              value={soluteMassG}
              onChange={(e) => setSoluteMassG(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-mono-num"
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">كتلة المذيب (جم)</label>
            <input
              type="number"
              min={1}
              max={1000}
              value={solventMassG}
              onChange={(e) => setSolventMassG(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-mono-num"
            />
          </div>
        </div>
        <div className="rounded-xl bg-slate-50/75 dark:bg-slate-950/60 border border-slate-200/75 dark:border-slate-800/80 p-3 text-xs space-y-1">
          <div className="font-mono-num">
            كتلة المحلول = المذاب ({soluteMassG}) + المذيب ({solventMassG}) = <strong>{totalMass} جم</strong>
          </div>
          <div className="text-sm font-bold text-teal-700 dark:text-teal-300 font-mono-num">
            التركيز المئوي = ({soluteMassG} ÷ {totalMass}) × 100 = {pct}%
          </div>
        </div>
      </div>
    );
  }

  if (unitId === 3) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-2.5">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <FlaskConical className="w-4 h-4 text-teal-600" />
          <span>المعادلات الموزونة لتفاعلات الحموض والقواعد والأملاح (الوحدة 3)</span>
        </div>
        <div className="rounded-lg bg-slate-900 text-white p-3 space-y-2 text-center overflow-x-auto">
          <MathBlock latex="\mathrm{HCl + NaOH \rightarrow NaCl + H_2O}" display />
          <MathBlock latex="\mathrm{CaCO_3 + 2HCl \rightarrow CaCl_2 + H_2O + CO_2\uparrow}" display />
        </div>
        <div className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
          تذكّر وزارياً: أوراق العثرب ذات خواص قاعدية تُستخدم لمعادلة سم النمل الحمضي وتخفيف ألمه، بينما تتكون الأمطار الحمضية من ذوبان SO₂ و NO₂ في بخار الماء.
        </div>
      </div>
    );
  }

  if (unitId === 4) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 text-xs sm:text-sm space-y-2">
        <div className="font-bold text-indigo-700 dark:text-indigo-300">
          ملخص الحقائق والقوانين الفضائية (الوحدة 4: الإنسان والفضاء الكوني)
        </div>
        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1">
          <li>وحدة بناء الكون في المنهج هي <strong>المجموعة الشمسية</strong>، وتقع مجموعتنا في مجرة <strong>درب التبانة</strong>.</li>
          <li>المسافات الشاسعة بين النجوم والمجرات تُقاس بوحدة <strong>السنة الضوئية</strong> (المسافة التي يقطعها الضوء في سنة).</li>
          <li>ينطلق الصاروخ الفضائي اعتماداً على <strong>قانون نيوتن الثالث للحركة</strong> (لكل فعل رد فعل مساوٍ له في المقدار ومضاد في الاتجاه) لذا يعمل حتى في الفراغ الفضائي.</li>
        </ul>
      </div>
    );
  }

  if (unitId === 10) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-2.5">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <FlaskConical className="w-4 h-4 text-lime-600" />
          <span>معادلة تحضير غاز الكلور ومراحل تنقيته وتجفيفه (الوحدة 10)</span>
        </div>
        <div className="rounded-lg bg-slate-900 text-white p-3 space-y-2 text-center overflow-x-auto">
          <MathBlock latex="\mathrm{MnO_2 + 4HCl \xrightarrow{\Delta} MnCl_2 + 2H_2O + Cl_2\uparrow}" display />
        </div>
        <div className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
          الترتيب الإلزامي: يمرر الكلور أولاً على الماء لامتصاص شوائب غاز HCl، ثم على حمض الكبريتيك المركز H₂SO₄ لتجفيفه من بخار الماء، ويُجمع بإزاحة الهواء لأعلى.
        </div>
      </div>
    );
  }

  if (unitId === 13) {
    const watts = Number((pvVolts * pvAmps).toFixed(1));
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>حاسبة القدرة الكهربائية للوح الشمسي DC (الوحدة 13)</span>
          </div>
          <MathBlock latex="\text{القدرة (واط)} = \text{الجهد (فولت)} \times \text{التيار (أمبير)}" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 mb-1">جهد اللوح الشمسي (فولت)</label>
            <input
              type="number"
              min={1}
              max={200}
              value={pvVolts}
              onChange={(e) => setPvVolts(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-mono-num"
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">شدة التيار المستمر DC (أمبير)</label>
            <input
              type="number"
              min={0.5}
              step={0.5}
              max={100}
              value={pvAmps}
              onChange={(e) => setPvAmps(Math.max(0.5, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-mono-num"
            />
          </div>
        </div>
        <div className="rounded-xl bg-slate-50/75 dark:bg-slate-950/60 border border-slate-200/75 dark:border-slate-800/80 p-3 text-xs space-y-1">
          <div className="text-sm font-bold text-teal-700 dark:text-teal-300 font-mono-num">
            القدرة الناتجة = {pvVolts} × {pvAmps} = {watts} واط (تيار مستمر DC)
          </div>
          <div className="text-slate-600 dark:text-slate-300">
            يُستخدم العاكس (Inverter) لتحويل التيار المستمر DC إلى متردد AC لتشغيل الأجهزة المنزلية.
          </div>
        </div>
      </div>
    );
  }

  if (unitId === 8 || unitId === 14 || unitId === 15 || unitId === 16) {
    const bioNotes: Record<number, { title: string; bullets: string[] }> = {
      8: {
        title: 'ملخص التشخيص والوقاية لأمراض الجهازين البولي والتناسلي (الوحدة 8)',
        bullets: [
          'تخترق سركاريا دودة البلهارسيا الجلد عند السباحة في المياه الراكدة الملوثة وتسبب دماً في البول.',
          'مرض السيلان بكتيري وقد ينتقل عبر المرحاض الأوروبي الملوث، بينما مرض الإيدز فيروسي (HIV) ولا ينتقل بالمصافحة أو لدغ البعوض.',
        ],
      },
      14: {
        title: 'ملخص تنمية موارد البيئة الحية والصناعات المعتمدة عليها (الوحدة 14)',
        bullets: [
          'تشمل وسائل التنمية: التهجين والانتخاب لتحسين السلالات، الري الحديث، والدورة الزراعية.',
          'تعتمد صناعة الزبادي والجبن على بكتيريا حمض اللاكتيك النافعة، والخبز على فطر الخميرة.',
        ],
      },
      15: {
        title: 'ملخص رعاية الأمومة والطفولة وتنظيم الأسرة (الوحدة 15)',
        bullets: [
          'حليب اللبا في الأيام الأولى بعد الولادة غني بالأجسام المضادة التي تمنح الرضيع مناعة طبيعية.',
          'تنظيم الأسرة يعني المباعدة بين الولادات (2–3 سنوات) لحفظ صحة الأم ونمو الطفل السليم.',
        ],
      },
      16: {
        title: 'ملخص قوانين الوراثة والأمراض الوراثية (الوحدة 16)',
        bullets: [
          'تزاوج هجينين (Tt × Tt) يعطي نسبة 3 سائد : 1 متنحي (25% متنحي).',
          'زواج الأقارب يزيد احتمال التقاء جينين متنحيين وظهور الأمراض الوراثية مثل فقر الدم المنجلي والهيموفيليا.',
        ],
      },
    };
    const info = bioNotes[unitId];
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 text-xs sm:text-sm space-y-2">
        <div className="font-bold text-teal-700 dark:text-teal-300">{info.title}</div>
        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 leading-relaxed">
          {info.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (unitId === 2) {
    const sol = SOLUTIONS_CATALOG[selectedSol];
    const phType = phInput < 7 ? 'وسط حمضي' : phInput > 7 ? 'وسط قاعدي' : 'وسط متعادل تماماً';
    const phIonRel =
      phInput < 7 ? '[H+] > [OH-]' : phInput > 7 ? '[OH-] > [H+]' : '[H+] = [OH-]';

    return (
      <div className="space-y-4">
        {/* Calculator 1: Dissociation Equation & Electrode Migration */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>محلل معادلة التأين وتحديد حركة الأيونات نحو الأقطاب</span>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">اختر المركب الكيميائي</label>
            <select
              value={selectedSol}
              onChange={(e) => setSelectedSol(e.target.value as SolutionId)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm"
            >
              {Object.values(SOLUTIONS_CATALOG).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nameAr} ({item.formula})
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-xl bg-slate-50/75 dark:bg-slate-950/60 border border-slate-200/75 dark:border-slate-800/80 p-3 space-y-2 text-sm">
            <div>
              <span className="text-slate-500">معادلة التأين: </span>
              <span dir="ltr" className="inline-block [unicode-bidi:isolate] font-mono-num font-bold text-teal-700 dark:text-teal-300">
                {sol.dissociationEquation}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 p-2">
                الأيون المتجه للمهبط (القطب السالب -):{' '}
                <span dir="ltr" className="inline-block [unicode-bidi:isolate] font-mono-num font-bold">
                  {sol.cationLabel}
                </span>
              </div>
              <div className="rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 p-2">
                الأيون المتجه للمصعد (القطب الموجب +):{' '}
                <span dir="ltr" className="inline-block [unicode-bidi:isolate] font-mono-num font-bold">
                  {sol.anionLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator 2: pH Analyzer */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white text-sm">محلل مقياس الأس الهيدروجيني (pH)</span>
            <span className="font-mono-num font-bold text-lg text-teal-600 dark:text-teal-400">pH = {phInput}</span>
          </div>
          <input
            type="range"
            min={0}
            max={14}
            step={0.5}
            value={phInput}
            onChange={(e) => setPhInput(Number(e.target.value))}
            className="w-full accent-teal-600"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-2.5 border border-slate-200 dark:border-slate-800">
              <div className="text-slate-500">نوع الوسط</div>
              <div className="font-bold mt-0.5">{phType}</div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-2.5 border border-slate-200 dark:border-slate-800">
              <div className="text-slate-500">العلاقة الأيونية</div>
              <div dir="ltr" className="inline-block [unicode-bidi:isolate] font-mono-num font-bold mt-0.5">
                {phIonRel}
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-2.5 border border-slate-200 dark:border-slate-800">
              <div className="text-slate-500">لون الفينولفثالين / الميثيل</div>
              <div className="font-bold mt-0.5">
                <ChemText
                  text={
                    phInput > 7
                      ? 'وردي / أصفر'
                      : phInput === 7
                      ? 'عديم اللون / برتقالي'
                      : 'عديم اللون / أحمر'
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (unitId === 5) {
    const v2 = Number(((v1 * n2) / Math.max(1, n1)).toFixed(2));
    const transformerType =
      n2 > n1 ? 'محول رافع للجهد (ن2 > ن1)' : n2 < n1 ? 'محول خافض للجهد (ن2 < ن1)' : 'محول عازل متساوي اللفات';

    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>حاسبة المحول الكهربائي (نسبة اللفات والجهد)</span>
          </div>
          <MathBlock latex="\frac{\text{ج}_2}{\text{ج}_1} = \frac{\text{ن}_2}{\text{ن}_1}" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 mb-1">جهد الملف الابتدائي ج₁ (فولت)</label>
            <input
              type="number"
              min={1}
              max={10000}
              value={v1}
              onChange={(e) => setV1(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-mono-num"
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">عدد لفات الابتدائي ن₁</label>
            <input
              type="number"
              min={1}
              max={10000}
              value={n1}
              onChange={(e) => setN1(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-mono-num"
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">عدد لفات الثانوي ن₂</label>
            <input
              type="number"
              min={1}
              max={10000}
              value={n2}
              onChange={(e) => setN2(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-mono-num"
            />
          </div>
        </div>
        <div className="rounded-xl bg-slate-50/75 dark:bg-slate-950/60 border border-slate-200/75 dark:border-slate-800/80 p-3 text-xs space-y-1">
          <div className="text-sm font-bold text-teal-700 dark:text-teal-300 font-mono-num">
            الجهد الناتج ج₂ = ({v1} × {n2}) ÷ {n1} = {v2} فولت
          </div>
          <div className="font-semibold text-slate-700 dark:text-slate-300">تصنيف المحول: {transformerType}</div>
        </div>
      </div>
    );
  }

  if (unitId === 9) {
    const matchedStage =
      DISTILLATION_STAGES.find((s) => oilTemp >= s.min && oilTemp <= s.max) ?? DISTILLATION_STAGES[4];

    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>مستكشف درجات التقطير التجزيئي للنفط الخام</span>
            </div>
            <span className="font-mono-num font-bold text-amber-600 dark:text-amber-400">{oilTemp} °م</span>
          </div>
          <input
            type="range"
            min={20}
            max={420}
            step={10}
            value={oilTemp}
            onChange={(e) => setOilTemp(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="rounded-xl bg-slate-50/75 dark:bg-slate-950/60 border border-slate-200/75 dark:border-slate-800/80 p-3 text-xs space-y-1">
            <div className="font-bold text-teal-700 dark:text-teal-300 text-sm">{matchedStage.name}</div>
            <div className="text-slate-600 dark:text-slate-400">نطاق الغليان القياسي: {matchedStage.boiling}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            <FlaskConical className="w-4 h-4 text-teal-600" />
            <span>المعادلات الموزونة الحرجة لتحضير غاز CO₂ (الأهم وزارياً)</span>
          </div>
          <div className="rounded-lg bg-slate-900 text-white p-3 space-y-2 text-center overflow-x-auto">
            <MathBlock latex="\mathrm{CaCO_3 + 2HCl \rightarrow CaCl_2 + H_2O + CO_2\uparrow}" display />
            <MathBlock latex="\mathrm{3CaCO_3 + 2H_3PO_4 \rightarrow Ca_3(PO_4)_2 + 3H_2O + 3CO_2\uparrow}" display />
          </div>
          <div className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
            تنبيه وزاري: ناتج تفاعل حمض الفوسفوريك H3PO4 مع كربونات الكالسيوم هو فوسفات الكالسيوم Ca3(PO4)2، كما أن التربة الصالحة للزراعة تقع عند pH بين 6 و 7.
          </div>
        </div>
      </div>
    );
  }

  if (unitId === 11) {
    const stValue = calculateSurfaceTension(stForceN, stLengthM);

    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>حاسبة معامل الشد السطحي للسائل (قانون الغشاءين 2ل)</span>
          </div>
          <MathBlock latex="\text{ش} = \frac{\text{ق}}{2\text{ل}}" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 mb-1">القوة العمودية اللازمة لتمزيق الغشاء ق (نيوتن)</label>
            <input
              type="number"
              min={0.0005}
              step={0.001}
              value={stForceN}
              onChange={(e) => setStForceN(Math.max(0.0005, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-mono-num"
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">طول السلك الملامس ل (متر)</label>
            <input
              type="number"
              min={0.005}
              step={0.01}
              value={stLengthM}
              onChange={(e) => setStLengthM(Math.max(0.005, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-mono-num"
            />
          </div>
        </div>
        <div className="rounded-xl bg-slate-50/75 dark:bg-slate-950/60 border border-slate-200/75 dark:border-slate-800/80 p-3 text-xs space-y-1.5">
          <div className="font-mono-num">
            <strong>مضاعفة طول السلك (لوجود غشاءين على وجهي السلك):</strong> 2 × {stLengthM} = {(2 * stLengthM).toFixed(3)} م
          </div>
          <div className="text-sm font-bold text-teal-700 dark:text-teal-300 font-mono-num">
            الشد السطحي (ش) = {stForceN} ÷ {(2 * stLengthM).toFixed(3)} = {stValue} نيوتن/م
          </div>
          <div className="flex items-start gap-1.5 text-amber-700 dark:text-amber-300">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              مصيدة وزارية: زيادة طول السلك (ل) تزيد القوة (ق) بنفس النسبة فتظل قيمة الشد السطحي (ش) ثابتة للسائل الواحد عند ثبوت درجة الحرارة!
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (unitId === 6 || unitId === 7) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 text-xs sm:text-sm space-y-2">
        <div className="font-bold text-teal-700 dark:text-teal-300">
          {unitId === 6
            ? 'ملخص المسار التشريحي والوظيفي للإخراج (الوحدة السادسة)'
            : 'ملخص المسار التكاثري في النبات والإنسان (الوحدة السابعة)'}
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          {unitId === 6
            ? 'تذكّر: الأميبا العذبة تمتلك فجوة منقبضة بخلاف أميبا المياه المالحة، النتح يُخرج بخار الماء من الثغور بينما الإدماع قطرات من الثغور المائية، والكلية تحتوي مليون نيفرون وتكثر مسام العرق في الجبهة وتحت الذراع وراحة اليد وأخمص القدمين.'
            : 'تذكّر: الزهرة الكاملة تتكون من 4 محيطات (الكأس، التويج، الطلع المذكر من متك وخيط، والمتاع المؤنث من ميسم وقلم ومبيض)، وبعد الإخصاب يتحول المبيض إلى ثمرة والبويضة إلى بذرة.'}
        </p>
      </div>
    );
  }

  if (unitId !== 12) {
    return null;
  }

  // Unit 12 calculators
  const solidRes = calculateSolidPressure({
    weightKgf,
    areaM2,
    standingOnOneFoot: oneFoot,
  });
  const liquidRes = calculateLiquidPressure(liquidId, depthM);
  const atmRes = calculateAtmosphericPressure(altitudeM, 20);

  return (
    <div className="space-y-4">
      {/* Solid Pressure Step-by-Step Calculator */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>حاسبة ضغط الجسم الصلب (الوزارية خطوة بخطوة)</span>
          </div>
          <MathBlock latex="\text{ض} = \frac{\text{ق}}{\text{م}}" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 mb-1">الوزن (ث.كجم)</label>
            <input
              type="number"
              min={1}
              max={1000}
              value={weightKgf}
              onChange={(e) => setWeightKgf(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-mono-num"
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">مساحة القاعدة/الحذاءين (م²)</label>
            <input
              type="number"
              min={0.01}
              step={0.01}
              value={areaM2}
              onChange={(e) => setAreaM2(Math.max(0.005, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-mono-num"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 w-full cursor-pointer">
              <input
                type="checkbox"
                checked={oneFoot}
                onChange={(e) => setOneFoot(e.target.checked)}
                className="accent-teal-600"
              />
              <span>الوقوف على قدم واحدة (÷ 2)</span>
            </label>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50/75 dark:bg-slate-950/60 border border-slate-200/75 dark:border-slate-800/80 p-3 text-xs space-y-1.5">
          <div>
            <strong>الخطوة 1 (تحويل ث.كجم إلى نيوتن):</strong>{' '}
            <span className="font-mono-num">{weightKgf} × 10 = {solidRes.forceNewtons} نيوتن</span>
          </div>
          <div>
            <strong>الخطوة 2 (المساحة الفعالة):</strong>{' '}
            <span className="font-mono-num">
              {oneFoot ? `${areaM2} ÷ 2 = ${solidRes.effectiveAreaM2} م²` : `${solidRes.effectiveAreaM2} م²`}
            </span>
          </div>
          <div className="text-sm font-bold text-teal-700 dark:text-teal-300">
            الخطوة 3 (الضغط): <span className="font-mono-num">{solidRes.forceNewtons} ÷ {solidRes.effectiveAreaM2} = {solidRes.pressurePa} نيوتن/م² (باسكال)</span>
          </div>
          <div className="flex items-start gap-1.5 pt-1 text-amber-700 dark:text-amber-300">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              ملاحظة مراجعة ص 80: دون ضرب (×10) تكون القيمة <span className="font-mono-num">{solidRes.pressureKgfPerM2}</span> ث.كجم/م²، لكن في التصحيح الوزاري يُلزم الضرب في 10.
            </span>
          </div>
        </div>
      </div>

      {/* Liquid & Atmospheric Pressure Quick Calculators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-2.5 text-xs">
          <div className="font-bold text-slate-900 dark:text-white text-sm">حاسبة ضغط السائل</div>
          <select
            value={liquidId}
            onChange={(e) => setLiquidId(e.target.value as LiquidTypeId)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5"
          >
            {Object.values(LIQUIDS_CATALOG).map((l) => (
              <option key={l.id} value={l.id}>
                {l.nameAr} (كثافة {l.densityKgM3} كجم/م³)
              </option>
            ))}
          </select>
          <div className="flex items-center justify-between">
            <span>العمق (ع): {depthM} م</span>
            <input
              type="range"
              min={0.5}
              max={15}
              step={0.5}
              value={depthM}
              onChange={(e) => setDepthM(Number(e.target.value))}
              className="w-36 accent-sky-600"
            />
          </div>
          <div className="font-bold text-sky-700 dark:text-sky-300 font-mono-num text-sm">
            ض = {liquidRes.pressurePa.toLocaleString('en-US')} باسكال
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-2.5 text-xs">
          <div className="font-bold text-slate-900 dark:text-white text-sm">حاسبة البارومتر والتحويل (مللي بار / باسكال)</div>
          <select
            value={altitudeM}
            onChange={(e) => setAltitudeM(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5"
          >
            {YEMENI_CITIES_BAROMETER.map((c) => (
              <option key={c.id} value={c.altitudeMeters}>
                {c.nameAr} ({c.altitudeMeters} م)
              </option>
            ))}
          </select>
          <div className="font-mono-num space-y-1 text-slate-700 dark:text-slate-300">
            <div>الضغط: <strong className="text-teal-600 dark:text-teal-400">{atmRes.pressureMbar} مللي بار</strong> = {atmRes.pressurePa.toLocaleString('en-US')} باسكال</div>
            <div>عمود الزئبق: <strong>{atmRes.mercuryColumnCm} سم</strong> | فراغ تورشللي (أنبوب 100 سم): <strong>{atmRes.torricelliVacuumCm} سم</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
