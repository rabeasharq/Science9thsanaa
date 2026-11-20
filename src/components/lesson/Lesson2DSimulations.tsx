import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Flame, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import { LabId } from '../../types/curriculum';
import {
  ElectricBellCircuit2DSim,
  ElectrolyteCircuit2DSim,
  MagnetizationMethods2DSim,
  Nephron2DSim,
  OxidesAndCO2Prep2DSim,
  SolidPropsAndHydroJets2DSim,
  TransformerCircuit2DSim,
} from './ExtraCircuitsAndExperiments2D';
import {
  AcidReactions2DSim,
  Genetics2DSim,
  HalogensAndChlorine2DSim,
  SolarEnergyCircuits2DSim,
  SolutionsPrep2DSim,
  SpaceAndUniverse2DSim,
} from './Stage2Simulations2D';

export interface Sim2DCatalogItem {
  lessonId: string;
  unitLabel: string;
  title: string;
  subtitle: string;
}

export interface Sim2DBranchGroup {
  branchId: 'chem' | 'space-solar' | 'genetics';
  branchTitle: string;
  unitsLabel: string;
  items: Sim2DCatalogItem[];
}

export const SIMULATIONS_2D_BY_LAB: Record<LabId, Sim2DCatalogItem[]> = {
  'acids-bases-3d': [
    {
      lessonId: 'u2-l1',
      unitLabel: 'الوحدة 2',
      title: 'الدائرة الكهربائية لاختبار التوصيل الكهربائي للمحاليل',
      subtitle: 'بطارية وأميتر ومصباح وأقطاب غرافيت للتمييز بين الحمض/القاعدة القوية والضعيفة والماء المقطر',
    },
  ],
  'magnetism-dynamo-3d': [
    {
      lessonId: 'u5-l1',
      unitLabel: 'الوحدة 5',
      title: 'طرق التمغنط الثلاث والدائرة الكهربائية للتمغنط بالتيار',
      subtitle: 'مسمار حديدي وملف لولبي وبطارية ومشابك + التمغنط بالدلك والتأثير',
    },
    {
      lessonId: 'u5-l2',
      unitLabel: 'الوحدة 5',
      title: 'الدائرة الكهربائية للجرس الكهربائي + مرسل ومستقبل التلفون',
      subtitle: 'آلية القطع والوصل الآلي في الجرس + مقارنة تركيب مرسل ومستقبل التلفون الكربوني',
    },
    {
      lessonId: 'u5-l3',
      unitLabel: 'الوحدة 5',
      title: 'الدائرة الكهربائية للمحول الكهربائي (AC مقابل بطارية DC)',
      subtitle: 'تجربة رافع/خافض الجهد وكشف مصيدة توصيل المحول ببطارية مستمرة',
    },
    {
      lessonId: 'u5-l4',
      unitLabel: 'الوحدة 5',
      title: 'الموجات الكهرومغناطيسية والعلاقة بين التردد والطول الموجي',
      subtitle: 'تحكم بالتردد وشاهد تغير الطول الموجي λ بسرعة الضوء الثابتة',
    },
  ],
  'anatomy-kidney-flower-3d': [
    {
      lessonId: 'u7-l2',
      unitLabel: 'الوحدة 7',
      title: 'انتقال الحيوان المنوي والبويضة والإخصاب + التكاثر اللاجنسي',
      subtitle: 'مسار الحيوانات المنوية عبر الرحم وقناة فالوب والإخصاب والانغراس + الأميبا والهيدرا ونجم البحر',
    },
    {
      lessonId: 'u7-l1',
      unitLabel: 'الوحدة 7',
      title: 'انتقال حبوب اللقاح ونمو أنبوب اللقاح والإخصاب في الزهرة',
      subtitle: 'التلقيح الخلطي (بالنحلة) والذاتي ونمو أنبوب اللقاح عبر القلم إلى البويضة',
    },
    {
      lessonId: 'u6-l1',
      unitLabel: 'الوحدة 6',
      title: 'الفجوة المنقبضة في أميبا المياه العذبة مقابل المياه المالحة',
      subtitle: 'عملية طرد الماء الزائد بالأسموزية مقارنة بالوسط المالح',
    },
    {
      lessonId: 'u6-l2',
      unitLabel: 'الوحدة 6',
      title: 'النتح عبر الثغور مقابل الإدماع عبر الثغور المائية',
      subtitle: 'أثر نسبة الرطوبة الجوية على خروج الماء بخاراً أو قطرات',
    },
    {
      lessonId: 'u6-l3',
      unitLabel: 'الوحدة 6',
      title: 'تشريح النيفرون وآلية الترشيح وإعادة الامتصاص وتكوين البول',
      subtitle: 'محفظة بومان والتواء هنلي والقناة الجامعة ومصير الجلوكوز واليوريا',
    },
    {
      lessonId: 'u6-l4',
      unitLabel: 'الوحدة 6',
      title: 'الغدة العرقية وتنظيم حرارة الجسم في الجلد',
      subtitle: 'اتساع الشعيرات الدموية وإفراز العرق في الطقس الحار مقابل البارد',
    },
  ],
  'oil-co2-3d': [
    {
      lessonId: 'u9-l1',
      unitLabel: 'الوحدة 9',
      title: 'احتراق المغنيسيوم والكبريت وتكوين الأكاسيد القاعدية والحمضية',
      subtitle: 'مقارنة أكسيد الفلز (يزرق دوار الشمس) بأكسيد اللافلز (يحمر دوار الشمس)',
    },
    {
      lessonId: 'u9-l2',
      unitLabel: 'الوحدة 9',
      title: 'تجربة أنابيب شروط صدأ الحديد الثلاث',
      subtitle: 'مقارنة الماء والهواء مع الماء المغلي+الزيت والهواء الجاف بوجود CaCl2',
    },
    {
      lessonId: 'u9-l3',
      unitLabel: 'الوحدة 9',
      title: 'الدائرة الكهربائية لاختبار التوصيل في الجرافيت مقابل الألماس',
      subtitle: 'بطارية ومصباح يضيء مع الجرافيت وينطفئ مع الألماس',
    },
    {
      lessonId: 'u9-l4',
      unitLabel: 'الوحدة 9',
      title: 'جهاز تحضير غاز CO₂ مخبرياً واختبار تعكر ماء الجير',
      subtitle: 'تفاعل كربونات الكالسيوم مع HCl و H3PO4 وجمع الغاز بالإزاحة العلوية للهواء',
    },
  ],
  'capillary-surface-3d': [
    {
      lessonId: 'u11-l1',
      unitLabel: 'الوحدة 11',
      title: 'خواص الأجسام الصلبة الخمس (مرونة، لدونة، هشاشة، طرق، قساوة)',
      subtitle: 'اختبار تفاعلي للمطاط والصلصال والزجاج والنحاس والألماس',
    },
    {
      lessonId: 'u11-l5',
      unitLabel: 'الوحدة 11',
      title: 'الجريان الانسيابي المنتظم مقابل الجريان المضطرب',
      subtitle: 'مقارنة حركة طبقات السائل وتشكّل الدوامات',
    },
    {
      lessonId: 'u11-l6',
      unitLabel: 'الوحدة 11',
      title: 'سباق الكرات الفولاذية لقياس اللزوجة وأثر التسخين',
      subtitle: 'مقارنة الماء والزيت والعسل وتأثير الحرارة في خفض اللزوجة',
    },
    {
      lessonId: 'u11-l7',
      unitLabel: 'الوحدة 11',
      title: 'انتشار الصبغة في الماء الساخن مقابل الماء البارد',
      subtitle: 'تأثير طاقة حركة الجزيئات الحرارية في سرعة الانتشار',
    },
  ],
  'pressure-3d': [
    {
      lessonId: 'u12-l2',
      unitLabel: 'الوحدة 12',
      title: 'تجربة الأسطوانة المثقوبة على ثلاثة أعماق مختلفة',
      subtitle: 'زيادة مدى اندفاع السائل مع زيادة العمق تحت السطح',
    },
  ],
};

export const OTHER_UNITS_2D_BRANCHES: Sim2DBranchGroup[] = [
  {
    branchId: 'chem',
    branchTitle: 'فرع الكيمياء: المحاليل والتفاعلات والهالوجينات',
    unitsLabel: 'الوحدات 1 و 3 و 10',
    items: [
      {
        lessonId: 'u1-l1',
        unitLabel: 'الوحدة 1',
        title: 'تحضير المحاليل وحالات الإشباع (غير مشبع / مشبع / فوق مشبع)',
        subtitle: 'تأثير كمية المذاب والتحريك والتسخين على ذوبان الملح وترسيب البلورات',
      },
      {
        lessonId: 'u3-l1',
        unitLabel: 'الوحدة 3',
        title: 'معايرة التعادل وتفاعل الحموض مع الكربونات والمطر الحمضي',
        subtitle: 'سحاحة NaOH لنقطة التعادل pH=7 + فوران الكربونات + دورة SO₂ و NO₂',
      },
      {
        lessonId: 'u10-l1',
        unitLabel: 'الوحدة 10',
        title: 'تدرج الحالات الفيزيائية وألوان الهالوجينات (F₂, Cl₂, Br₂, I₂)',
        subtitle: 'مقارنة الفلور والكلور (غازان) والبروم (سائل) واليود (صلب يتسامى)',
      },
      {
        lessonId: 'u10-l3',
        unitLabel: 'الوحدة 10',
        title: 'جهاز تحضير غاز الكلور Cl₂ وتنقيته بالماء وتجفيفه بـ H₂SO₄',
        subtitle: 'تفاعل MnO₂ مع HCl ثم إمرار الغاز في الماء وحمض الكبريتيك المركز',
      },
    ],
  },
  {
    branchId: 'space-solar',
    branchTitle: 'فرع الفضاء والفيزياء التطبيقية: الكون والطاقة الشمسية',
    unitsLabel: 'الوحدتان 4 و 13',
    items: [
      {
        lessonId: 'u4-l1',
        unitLabel: 'الوحدة 4',
        title: 'الكون والمجموعة الشمسية (دوران الكواكب حول الشمس)',
        subtitle: 'تصور تفاعلي لوحدة بناء الكون ومجرة درب التبانة',
      },
      {
        lessonId: 'u4-l2',
        unitLabel: 'الوحدة 4',
        title: 'مراحل انطلاق الصاروخ الفضائي والأقمار الصناعية',
        subtitle: 'محاكاة قانون نيوتن الثالث وانفصال المراحل والوصول للمدار',
      },
      {
        lessonId: 'u13-l2',
        unitLabel: 'الوحدة 13',
        title: 'السخان الشمسي الحراري وانتقال الحرارة بالحمل',
        subtitle: 'دوران الماء الساخن من المجمع الأسود إلى الخزان المعزول',
      },
      {
        lessonId: 'u13-l3',
        unitLabel: 'الوحدة 13',
        title: 'الدائرة الكهربائية للخلية الشمسية الكهروضوئية (DC)',
        subtitle: 'لوح سيليكون متصل بمنظم شحن وبطارية ومصباح يتحكم بسطوعه الإشعاع',
      },
    ],
  },
  {
    branchId: 'genetics',
    branchTitle: 'فرع الأحياء والوراثة: تجارب مندل والوراثة',
    unitsLabel: 'الوحدة 16',
    items: [
      {
        lessonId: 'u16-l1',
        unitLabel: 'الوحدة 16',
        title: 'مربع بانيت وتوارث الصفات والأمراض الوراثية المتنحية',
        subtitle: 'توزيع الأمشاج وحساب نسب ظهور الصفة السائدة والمتنحية (3:1 و 50%)',
      },
    ],
  },
];

export const HAS_2D_SIMULATION_LESSONS = new Set([
  'u1-l1',
  'u1-l2',
  'u2-l1',
  'u2-l2',
  'u3-l1',
  'u3-l2',
  'u3-l3',
  'u4-l1',
  'u4-l2',
  'u5-l1',
  'u5-l2',
  'u5-l3',
  'u5-l4',
  'u6-l1',
  'u6-l2',
  'u6-l3',
  'u6-l4',
  'u7-l1',
  'u7-l2',
  'u9-l1',
  'u9-l2',
  'u9-l3',
  'u9-l4',
  'u9-l6',
  'u10-l1',
  'u10-l2',
  'u10-l3',
  'u11-l1',
  'u11-l5',
  'u11-l6',
  'u11-l7',
  'u12-l2',
  'u13-l1',
  'u13-l2',
  'u13-l3',
  'u16-l1',
  'u16-l2',
  'u16-l3',
  'u16-l4',
]);

interface Lesson2DSimulationsProps {
  lessonId: string;
  defaultOpen?: boolean;
  titleOverride?: string;
  subtitleOverride?: string;
}

/* ==================== 1. محاكاة انتقال حبوب اللقاح والإخصاب في النبات (u7-l1) ==================== */
const PlantPollination2DSim: React.FC = () => {
  const [mode, setMode] = useState<'cross' | 'self'>('cross');
  const [playing, setPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0); // 0 -> 100

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setProgress((prev) => {
        const next = prev + dt * 15;
        return next >= 100 ? 100 : next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const handleRestart = () => {
    setProgress(0);
    setPlaying(true);
  };

  // المراحل الزمنية:
  // 0..35: انتقال حبة اللقاح (من المتك بالنحلة في الخلطي أو من متك نفس الزهرة في الذاتي) إلى الميسم
  // 35..75: نمو أنبوب اللقاح نازلاً عبر القلم باتجاه البويضة في المبيض
  // 75..100: اندماج النواتين (الإخصاب) وتحول المبيض لثمرة والبويضة لبذرة
  const transferT = Math.min(1, progress / 35);
  const tubeT = Math.max(0, Math.min(1, (progress - 35) / 40));
  const fertT = Math.max(0, Math.min(1, (progress - 75) / 25));

  const pollenX = mode === 'cross' ? 95 + transferT * 215 : 238 + transferT * 72;
  const pollenY =
    mode === 'cross'
      ? 108 - Math.sin(transferT * Math.PI) * 58
      : 105 - Math.sin(transferT * Math.PI) * 42 + transferT * 3;

  const tubeLength = tubeT * 102;
  const stageText =
    progress < 35
      ? mode === 'cross'
        ? '1. التلقيح الخلطي: تنقل النحلة حبوب اللقاح من متك الزهرة الأولى إلى ميسم الزهرة الثانية.'
        : '1. التلقيح الذاتي: تنتقل حبة اللقاح من متك الزهرة إلى ميسم نفس الزهرة.'
      : progress < 75
      ? '2. إنبات حبة اللقاح: يمتد أنبوب اللقاح نازلاً عبر القلم حاملاً المشيج المذكر نحو المبيض.'
      : '3. الإخصاب: تندمج نواة حبة اللقاح مع البويضة فيتحول المبيض إلى ثمرة والبويضة إلى بذرة!';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => {
              setMode('cross');
              handleRestart();
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
              mode === 'cross'
                ? 'bg-teal-700 text-white'
                : 'bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            التلقيح الخلطي (بواسطة النحلة)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('self');
              handleRestart();
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
              mode === 'self'
                ? 'bg-teal-700 text-white'
                : 'bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            التلقيح الذاتي (في نفس الزهرة)
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => (progress >= 100 ? handleRestart() : setPlaying((p) => !p))}
            className="flex items-center gap-1 rounded-xl bg-amber-600 hover:bg-amber-700 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
          >
            {playing && progress < 100 ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{progress >= 100 ? 'إعادة العرض' : playing ? 'إيقاف مؤقت' : 'تشغيل'}</span>
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-1 rounded-xl border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 text-xs font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-200/80 dark:border-slate-700 bg-gradient-to-b from-sky-50/90 via-emerald-50/60 to-emerald-100/70 dark:from-slate-950 dark:to-slate-900 p-3 overflow-hidden">
        <svg viewBox="0 0 460 270" className="w-full h-auto max-h-[300px]">
          {/* شمس لطيفة */}
          <circle cx="42" cy="36" r="18" fill="#fde047" opacity="0.85" />

          {/* الزهرة الأولى (المانحة في التلقيح الخلطي) */}
          {mode === 'cross' && (
            <g>
              <path d="M95 250 V168" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
              <ellipse cx="75" cy="142" rx="18" ry="26" fill="#f9a8d4" transform="rotate(-28 75 142)" />
              <ellipse cx="115" cy="142" rx="18" ry="26" fill="#f9a8d4" transform="rotate(28 115 142)" />
              {/* خيط ومتك */}
              <path d="M95 162 V118" stroke="#4ade80" strokeWidth="3" />
              <ellipse cx="95" cy="112" rx="13" ry="8" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
              <circle cx="90" cy="110" r="2.2" fill="#fef08a" />
              <circle cx="99" cy="113" r="2.2" fill="#fef08a" />
              <text x="95" y="264" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f766e">
                زهرة 1 (المتك)
              </text>
            </g>
          )}

          {/* الزهرة الثانية / الرئيسية (تشريح 2D تفصيلي) */}
          <g>
            {/* ساق وسبلات */}
            <path d="M310 250 V220" stroke="#15803d" strokeWidth="7" strokeLinecap="round" />
            <path d="M278 214 Q310 232 342 214" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />

            {/* بتلات */}
            <ellipse cx="262" cy="158" rx="22" ry="44" fill="#fbcfe8" stroke="#db2777" strokeWidth="1.5" transform="rotate(-24 262 158)" />
            <ellipse cx="358" cy="158" rx="22" ry="44" fill="#fbcfe8" stroke="#db2777" strokeWidth="1.5" transform="rotate(24 358 158)" />

            {/* سداة الزهرة الرئيسية (المتك الأيسر واضح للتلقيح الذاتي) */}
            <path d="M286 205 Q250 155 238 114" fill="none" stroke="#16a34a" strokeWidth="3.2" />
            <ellipse cx="238" cy="108" rx="12" ry="7.5" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />

            <path d="M334 205 Q370 155 382 114" fill="none" stroke="#16a34a" strokeWidth="3.2" />
            <ellipse cx="382" cy="108" rx="12" ry="7.5" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />

            {/* المتاع: المبيض + القلم + الميسم */}
            <path
              d="M294 114 C298 114, 300 132, 300 164 C282 174, 276 218, 310 220 C344 218, 338 174, 320 164 C320 132, 322 114, 326 114"
              fill={fertT > 0.4 ? '#bbf7d0' : '#dcfce7'}
              stroke="#15803d"
              strokeWidth="2.4"
            />
            {/* الميسم أعلى القلم */}
            <ellipse cx="310" cy="108" rx="18" ry="8" fill="#fde047" stroke="#ca8a04" strokeWidth="1.8" />

            {/* البويضة داخل المبيض */}
            <ellipse
              cx="310"
              cy="196"
              rx={13 + fertT * 4}
              ry={16 + fertT * 4}
              fill={fertT > 0.5 ? '#f59e0b' : '#fef9c3'}
              stroke="#0f766e"
              strokeWidth="1.8"
            />
            <circle cx="310" cy="196" r="4.5" fill={fertT > 0.5 ? '#dc2626' : '#0284c7'} />

            {/* أنبوب اللقاح ينمو من الميسم نحو البويضة */}
            {tubeT > 0 && (
              <g>
                <line
                  x1="310"
                  y1="108"
                  x2="310"
                  y2={108 + tubeLength}
                  stroke="#d97706"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="310" cy={108 + tubeLength} r="3.5" fill="#dc2626" />
              </g>
            )}

            {/* مسار منقط لتوضيح الحركة */}
            {mode === 'cross' ? (
              <path d="M95 108 Q202 35 310 108" fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeDasharray="4 4" opacity="0.7" />
            ) : (
              <path d="M238 105 Q274 52 310 108" fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeDasharray="4 4" opacity="0.7" />
            )}

            {/* النحلة في التلقيح الخلطي أثناء الطيران */}
            {mode === 'cross' && transferT < 1 && (
              <g transform={`translate(${pollenX}, ${pollenY - 14})`}>
                <ellipse cx="0" cy="0" rx="10" ry="6" fill="#facc15" stroke="#1e293b" strokeWidth="1.4" />
                <line x1="-3" y1="-5" x2="-3" y2="5" stroke="#1e293b" strokeWidth="2" />
                <line x1="3" y1="-5" x2="3" y2="5" stroke="#1e293b" strokeWidth="2" />
                <ellipse cx="-2" cy="-7" rx="5" ry="3.5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
              </g>
            )}

            {/* حبة اللقاح المتحركة */}
            <circle
              cx={pollenX}
              cy={pollenY}
              r="5.5"
              fill="#f59e0b"
              stroke="#78350f"
              strokeWidth="1.5"
            />

            {/* مسميات واضحة */}
            <text x="355" y="106" fontSize="11" fontWeight="bold" fill="#854d0e">الميسم</text>
            <text x="344" y="144" fontSize="10.5" fontWeight="bold" fill="#166534">القلم</text>
            <text x="364" y="198" fontSize="11" fontWeight="bold" fill="#0f766e">
              {fertT > 0.6 ? 'المبيض → ثمرة' : 'المبيض (البويضة)'}
            </text>
            <text x="218" y="96" fontSize="11" fontWeight="bold" fill="#b45309">المتك</text>
          </g>
        </svg>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <span>تحكّم يدوي بمرحلة التلقيح والإخصاب:</span>
          <span className="font-mono-num font-bold text-teal-700 dark:text-teal-300">{Math.round(progress)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => {
            setPlaying(false);
            setProgress(Number(e.target.value));
          }}
          className="w-full accent-teal-600"
        />
        <div className="rounded-xl bg-teal-50/85 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 px-3 py-2 text-xs font-semibold text-teal-950 dark:text-teal-100">
          {stageText}
        </div>
      </div>
    </div>
  );
};

/* ==================== 2. محاكاة انتقال الحيوان المنوي والبويضة والإخصاب في الإنسان (u7-l2) ==================== */
const HumanReproduction2DSim: React.FC = () => {
  const [subMode, setSubMode] = useState<'human' | 'asexual'>('human');
  const [playing, setPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [asexualType, setAsexualType] = useState<'amoeba' | 'hydra' | 'starfish'>('amoeba');

  useEffect(() => {
    if (!playing || subMode !== 'human') return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setProgress((prev) => {
        const next = prev + dt * 13;
        return next >= 100 ? 100 : next;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, subMode]);

  const restartHuman = () => {
    setProgress(0);
    setPlaying(true);
  };

  // مراحل الإخصاب في الإنسان:
  // 0..30: تبويض (خروج البويضة من المبيض الأيمن) + صعود الحيوانات المنوية في المهبل فالرحم
  // 30..65: التقاء البويضة والحيوان المنوي في الثلث الأول من قناة فالوب (حدوث الإخصاب)
  // 65..100: انتقال اللاقحة (الزيجوت) منقسمةً إلى تجويف الرحم وانغراسها في بطانة الرحم
  const ovumT = Math.min(1, progress / 45);
  const spermT = Math.min(1, progress / 55);
  const fertilized = progress >= 55;
  const implantT = Math.max(0, Math.min(1, (progress - 58) / 42));

  // موضع البويضة / اللاقحة (على مسار واضح داخل القناة اليمنى ثم داخل الرحم)
  let eggX = 356;
  let eggY = 148;
  if (!fertilized) {
    // تخرج من المبيض (356, 148) إلى أعلى البوق (370, 92) ثم تدخل الثلث الأول لقناة فالوب (312, 82)
    if (ovumT < 0.45) {
      const k = ovumT / 0.45;
      eggX = 356 + k * 14;
      eggY = 148 - k * 56;
    } else {
      const k = (ovumT - 0.45) / 0.55;
      eggX = 370 - k * 58;
      eggY = 92 - Math.sin(k * Math.PI) * 14;
    }
  } else {
    // اللاقحة تنتقل من (312, 82) إلى بطانة الرحم (242, 134)
    eggX = 312 - implantT * 70;
    eggY = 82 + implantT * 52;
  }

  // مسار الحيوانات المنوية: تبدأ أسفل المهبل (230, 245) تصعد للرحم (230, 145) ثم تتجه لقناة فالوب نحو (312, 82)
  const calcSpermPos = (offset: number, lateral: number) => {
    const t = Math.max(0, Math.min(1, spermT - offset));
    if (t < 0.5) {
      const k = t / 0.5;
      return {
        x: 230 + lateral * (1 - k * 0.4) + Math.sin(t * 24 + offset * 10) * 3,
        y: 245 - k * 100,
      };
    }
    const k = (t - 0.5) / 0.5;
    return {
      x: 230 + k * 80 + lateral * 0.35,
      y: 145 - k * 63 + Math.sin(t * 28 + offset * 8) * 3,
    };
  };

  const spermList = [
    { offset: 0.0, lateral: 0, winner: true },
    { offset: 0.07, lateral: -9, winner: false },
    { offset: 0.11, lateral: 9, winner: false },
    { offset: 0.16, lateral: -5, winner: false },
  ];

  const humanStageNote =
    progress < 30
      ? '1. الإباضة وحركة الأمشاج: تنطلق البويضة من المبيض نحو البوق، بينما تسبح الحيوانات المنوية صعوداً عبر المهبل ثم الرحم.'
      : progress < 58
      ? '2. الوصول لقناة فالوب: تدخل الحيوانات المنوية قناة فالوب وتلتقي بالبويضة في الثلث الأول من القناة.'
      : progress < 82
      ? '3. الإخصاب وتكوين اللاقحة: يخترق حيوان منوي واحد البويضة وتتحد النواتان فتتشكل اللاقحة (الزيجوت).'
      : '4. الانغراس: تنقسم اللاقحة أثناء نزولها وتستقر وتنغرس في بطانة الرحم السميكة لينمو الجنين!';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSubMode('human')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
              subMode === 'human'
                ? 'bg-rose-700 text-white'
                : 'bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            الإخصاب في الإنسان (2D متحرك)
          </button>
          <button
            type="button"
            onClick={() => setSubMode('asexual')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
              subMode === 'asexual'
                ? 'bg-teal-700 text-white'
                : 'bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            صور التكاثر اللاجنسي (أميبا / هيدرا / نجم البحر)
          </button>
        </div>

        {subMode === 'human' && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => (progress >= 100 ? restartHuman() : setPlaying((p) => !p))}
              className="flex items-center gap-1 rounded-xl bg-rose-600 hover:bg-rose-700 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
            >
              {playing && progress < 100 ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{progress >= 100 ? 'إعادة العرض' : playing ? 'إيقاف مؤقت' : 'تشغيل'}</span>
            </button>
            <button
              type="button"
              onClick={restartHuman}
              className="flex items-center gap-1 rounded-xl border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {subMode === 'human' ? (
        <>
          <div className="rounded-2xl border border-rose-200/80 dark:border-slate-700 bg-gradient-to-b from-rose-50/85 to-pink-50/75 dark:from-slate-950 dark:to-slate-900 p-3">
            <svg viewBox="0 0 460 270" className="w-full h-auto max-h-[300px]">
              {/* الإطار التشريحي للجهاز التناسلي الأنثوي (الرحم + قناتا فالوب + المبيضان) */}
              {/* قناتا فالوب */}
              <path
                d="M196 105 C140 80, 96 74, 82 104"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="18"
                strokeLinecap="round"
                opacity="0.32"
              />
              <path
                d="M264 105 C320 80, 364 74, 378 104"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="18"
                strokeLinecap="round"
                opacity="0.32"
              />
              {/* جدار الرحم والمهبل */}
              <path
                d="M190 96 C205 84, 255 84, 270 96 L252 182 L248 252 H212 L208 182 Z"
                fill="#ffe4e6"
                stroke="#e11d48"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* بطانة الرحم الداخلية */}
              <path
                d="M204 106 C214 98, 246 98, 256 106 L242 174 L238 250 H222 L218 174 Z"
                fill="#fecdd3"
              />

              {/* المبيض الأيسر والأيمن */}
              <ellipse cx="104" cy="148" rx="22" ry="15" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
              <ellipse cx="356" cy="148" rx="22" ry="15" fill="#fde68a" stroke="#d97706" strokeWidth="2" />

              {/* منطقة الإخصاب (الثلث الأول لقناة فالوب) */}
              <circle cx="312" cy="82" r="17" fill="none" stroke="#0d9488" strokeWidth="1.6" strokeDasharray="4 3" />

              {/* البويضة / اللاقحة */}
              <g transform={`translate(${eggX}, ${eggY})`}>
                <circle
                  r={fertilized ? 10 : 8.5}
                  fill={fertilized ? '#f97316' : '#facc15'}
                  stroke="#9a3412"
                  strokeWidth="1.8"
                />
                {fertilized ? (
                  <>
                    <circle cx="-3" cy="0" r="2.2" fill="#fff" />
                    <circle cx="3" cy="0" r="2.2" fill="#fff" />
                  </>
                ) : (
                  <circle cx="0" cy="0" r="3" fill="#b45309" />
                )}
              </g>

              {/* الحيوانات المنوية المتحركة (رأس أزرق + ذيل سوطي) */}
              {spermList.map((sp, i) => {
                if (fertilized && !sp.winner && i > 0) {
                  // تتلاشى البقية عند تشكل غشاء الإخصاب
                  return null;
                }
                if (fertilized && sp.winner) return null;
                const pos = calcSpermPos(sp.offset, sp.lateral);
                return (
                  <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
                    <path
                      d="M0 3 Q-4 9 1 15 Q4 19 -1 23"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <ellipse cx="0" cy="0" rx="3.4" ry="4.8" fill="#0369a1" />
                  </g>
                );
              })}

              {/* تسميات عربية واضحة */}
              <text x="356" y="176" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400e">المبيض</text>
              <text x="322" y="57" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f766e">
                قناة فالوب (مكان الإخصاب)
              </text>
              <text x="230" y="138" textAnchor="middle" fontSize="11.5" fontWeight="bold" fill="#be123c">
                تجويف الرحم
              </text>
              <text x="230" y="264" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#881337">
                دخول الحيوانات المنوية ↑
              </text>
            </svg>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>شريط تتبع رحلة البويضة والحيوانات المنوية:</span>
              <span className="font-mono-num font-bold text-rose-700 dark:text-rose-300">{Math.round(progress)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => {
                setPlaying(false);
                setProgress(Number(e.target.value));
              }}
              className="w-full accent-rose-600"
            />
            <div className="rounded-xl bg-rose-50/85 dark:bg-rose-950/35 border border-rose-200 dark:border-rose-800 px-3 py-2 text-xs font-semibold text-rose-950 dark:text-rose-100">
              {humanStageNote}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5 text-xs">
            {(
              [
                { id: 'amoeba', label: 'الانشطار الثنائي (الأميبا)' },
                { id: 'hydra', label: 'التبرعم (الهيدرا)' },
                { id: 'starfish', label: 'التجدد (نجم البحر)' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAsexualType(item.id)}
                className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
                  asexualType === item.id
                    ? 'bg-teal-700 text-white'
                    : 'bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-teal-200/80 dark:border-slate-700 bg-teal-50/60 dark:bg-slate-950 p-3">
            <svg viewBox="0 0 420 170" className="w-full h-auto max-h-[210px]">
              {asexualType === 'amoeba' && (
                <g>
                  <path d="M55 75 Q75 45 100 68 Q112 95 85 110 Q55 108 55 75Z" fill="#67e8f9" stroke="#0891b2" strokeWidth="2" />
                  <circle cx="80" cy="82" r="8" fill="#0369a1" />
                  <text x="145" y="88" fontSize="18" fill="#0f766e">→</text>
                  <path d="M185 75 Q210 52 225 74 Q242 52 266 76 Q262 108 225 92 Q188 108 185 75Z" fill="#67e8f9" stroke="#0891b2" strokeWidth="2" />
                  <circle cx="206" cy="80" r="6" fill="#0369a1" />
                  <circle cx="246" cy="80" r="6" fill="#0369a1" />
                  <text x="292" y="88" fontSize="18" fill="#0f766e">→</text>
                  <circle cx="348" cy="56" r="21" fill="#67e8f9" stroke="#0891b2" strokeWidth="2" />
                  <circle cx="348" cy="56" r="6" fill="#0369a1" />
                  <circle cx="348" cy="114" r="21" fill="#67e8f9" stroke="#0891b2" strokeWidth="2" />
                  <circle cx="348" cy="114" r="6" fill="#0369a1" />
                  <text x="210" y="152" textAnchor="middle" fontSize="11.5" fontWeight="bold" fill="#0f766e">
                    تنقسم الأميبا بالتساوي إلى خليتين متطابقتين وراثياً
                  </text>
                </g>
              )}
              {asexualType === 'hydra' && (
                <g>
                  <path d="M90 135 V70 M76 70 Q90 52 104 70 M80 70 L70 50 M90 70 L90 48 M100 70 L110 50" stroke="#15803d" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <text x="150" y="95" fontSize="18" fill="#0f766e">→</text>
                  <path d="M210 135 V70 M210 102 Q232 95 236 78" stroke="#15803d" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <path d="M236 78 L228 62 M236 78 L244 62" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
                  <text x="285" y="95" fontSize="18" fill="#0f766e">→</text>
                  <path d="M335 135 V72 M368 135 V84" stroke="#15803d" strokeWidth="5.5" strokeLinecap="round" />
                  <text x="210" y="155" textAnchor="middle" fontSize="11.5" fontWeight="bold" fill="#166534">
                    ينمو برعم جانبي على جسم الهيدرا ثم ينفصل مكوناً فرداً مستقلاً
                  </text>
                </g>
              )}
              {asexualType === 'starfish' && (
                <g>
                  <polygon points="85,35 96,64 126,64 102,82 110,112 85,94 60,112 68,82 44,64 74,64" fill="#fb923c" stroke="#c2410c" strokeWidth="2" />
                  <line x1="94" y1="62" x2="108" y2="90" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="3 3" />
                  <text x="160" y="84" fontSize="18" fill="#0f766e">→</text>
                  <polygon points="235,38 246,66 274,66 251,84 259,112 235,95 211,112 219,84 196,66 224,66" fill="#fb923c" stroke="#c2410c" strokeWidth="2" />
                  <polygon points="340,46 350,70 375,70 355,85 362,110 340,95 318,110 325,85 305,70 330,70" fill="#fdba74" stroke="#c2410c" strokeWidth="2" />
                  <text x="210" y="152" textAnchor="middle" fontSize="11.5" fontWeight="bold" fill="#9a3412">
                    الذراع المقطوع مع جزء من القرص المركزي يتجدد مكوناً نجم بحر كاملاً
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==================== 3. محاكاة الإخراج في الأميبا والنبات والجلد (u6-l1, u6-l2, u6-l4) ==================== */
const Excretion2DSim: React.FC<{ variant: 'amoeba' | 'plant' | 'skin' }> = ({ variant }) => {
  const [waterEnv, setWaterEnv] = useState<'fresh' | 'salt'>('fresh');
  const [humidity, setHumidity] = useState<number>(45);
  const [bodyTemp, setBodyTemp] = useState<'hot' | 'cold'>('hot');
  const [pulsePhase, setPulsePhase] = useState<number>(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPulsePhase((p) => (p + 0.06) % 1);
    }, 50);
    return () => window.clearInterval(id);
  }, []);

  if (variant === 'amoeba') {
    const vacuoleR = waterEnv === 'fresh' ? 8 + Math.sin(pulsePhase * Math.PI) * 14 : 0;
    const expelling = waterEnv === 'fresh' && pulsePhase > 0.85;
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setWaterEnv('fresh')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer ${
              waterEnv === 'fresh' ? 'bg-sky-600 text-white' : 'bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            أميبا المياه العذبة (توجد فجوة منقبضة)
          </button>
          <button
            type="button"
            onClick={() => setWaterEnv('salt')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer ${
              waterEnv === 'salt' ? 'bg-amber-600 text-white' : 'bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            أميبا المياه المالحة (لا توجد فجوة منقبضة)
          </button>
        </div>

        <div className="rounded-2xl border border-sky-200/80 dark:border-slate-700 bg-sky-50/75 dark:bg-slate-950 p-3">
          <svg viewBox="0 0 420 180" className="w-full h-auto max-h-[210px]">
            <path
              d="M135 90 Q145 45 190 48 Q235 28 265 65 Q305 78 282 115 Q265 152 215 142 Q165 158 145 120 Z"
              fill="#a5f3fc"
              stroke="#0891b2"
              strokeWidth="2.5"
            />
            <circle cx="195" cy="96" r="14" fill="#0369a1" />
            <text x="195" y="100" textAnchor="middle" fontSize="9.5" fill="#fff" fontWeight="bold">النواة</text>

            {waterEnv === 'fresh' ? (
              <>
                <circle cx="248" cy="88" r={vacuoleR} fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.2" />
                <text x="248" y="124" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0369a1">
                  الفجوة المنقبضة
                </text>
                {expelling && (
                  <g>
                    <circle cx="295" cy="82" r="4" fill="#38bdf8" />
                    <circle cx="310" cy="88" r="3" fill="#38bdf8" />
                  </g>
                )}
                <text x="210" y="168" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f766e">
                  يدخل الماء بالأسموزية ← تمتلئ الفجوة المنقبضة وتنقبض لطرد الماء الزائد
                </text>
              </>
            ) : (
              <text x="210" y="168" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#b45309">
                أميبا المياه المالحة لا تحتوي على فجوة منقبضة لأنها متوازنة أسموزياً مع الوسط المالح
              </text>
            )}
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'plant') {
    const isGuttation = humidity > 75;
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-200">رطوبة الجو المحيط بالورقة: {humidity}%</span>
          <input
            type="range"
            min={20}
            max={95}
            value={humidity}
            onChange={(e) => setHumidity(Number(e.target.value))}
            className="w-48 accent-emerald-600"
          />
        </div>
        <div className="rounded-2xl border border-emerald-200/80 dark:border-slate-700 bg-emerald-50/75 dark:bg-slate-950 p-3">
          <svg viewBox="0 0 420 180" className="w-full h-auto max-h-[210px]">
            <path d="M90 120 Q200 28 330 84 Q230 148 90 120Z" fill="#4ade80" stroke="#15803d" strokeWidth="2.5" />
            <path d="M90 120 Q200 92 325 85" stroke="#14532d" strokeWidth="2" fill="none" />
            {!isGuttation ? (
              <g>
                <path d="M180 72 Q175 50 185 32" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                <path d="M235 66 Q230 44 240 26" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                <text x="210" y="164" textAnchor="middle" fontSize="11.5" fontWeight="bold" fill="#0f766e">
                  النتح: خروج الماء على صورة بخار عبر الثغور عند انخفاض الرطوبة
                </text>
              </g>
            ) : (
              <g>
                <circle cx="330" cy="88" r="5.5" fill="#0ea5e9" />
                <circle cx="290" cy="112" r="5" fill="#0ea5e9" />
                <circle cx="255" cy="126" r="5" fill="#0ea5e9" />
                <text x="210" y="164" textAnchor="middle" fontSize="11.5" fontWeight="bold" fill="#0369a1">
                  الإدماع: خروج قطرات ماء سائلة من حواف الأوراق عبر الثغور المائية في الرطوبة العالية
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setBodyTemp('hot')}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer ${
            bodyTemp === 'hot' ? 'bg-amber-600 text-white' : 'bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          طقس حار / مجهود بدني (تعرق نشط)
        </button>
        <button
          type="button"
          onClick={() => setBodyTemp('cold')}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer ${
            bodyTemp === 'cold' ? 'bg-sky-700 text-white' : 'bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          طقس بارد (حفظ الحرارة)
        </button>
      </div>
      <div className="rounded-2xl border border-amber-200/80 dark:border-slate-700 bg-amber-50/75 dark:bg-slate-950 p-3">
        <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[245px]">
          {/* الطبقة الدهنية تحت الجلد */}
          <rect x="34" y="148" width="392" height="30" rx="6" fill="#fef08a" stroke="#eab308" strokeWidth="1.5" />
          {[62, 100, 140, 180, 260, 300, 340, 380].map((cx) => (
            <ellipse key={cx} cx={cx} cy="163" rx="14" ry="8" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
          ))}

          {/* طبقة الأدمة */}
          <rect x="34" y="66" width="392" height="82" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
          {/* طبقة البشرة مع تموج الحليمات ومسام العرق */}
          <path
            d="M34 44 H196 Q204 44 206 50 Q208 44 216 44 H426 V66 Q380 60 330 68 Q280 60 230 68 Q180 60 130 68 Q80 60 34 66 Z"
            fill="#fdba74"
            stroke="#c2410c"
            strokeWidth="1.6"
          />

          {/* شعرة وبصيلة الشعر */}
          <path d="M112 130 C110 92, 118 52, 134 18" fill="none" stroke="#451a03" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="112" cy="132" rx="8" ry="11" fill="#78350f" />

          {/* الشعيرات الدموية (شريان أحمر ووريد أزرق تتفرع حول الغدة العرقية) */}
          <path
            d="M44 136 Q130 132 204 138 Q265 130 340 138 H416"
            fill="none"
            stroke="#dc2626"
            strokeWidth={bodyTemp === 'hot' ? 6 : 2.2}
            opacity="0.9"
          />
          <path
            d="M44 143 Q135 140 208 144 Q270 138 345 144 H416"
            fill="none"
            stroke="#2563eb"
            strokeWidth={bodyTemp === 'hot' ? 4.8 : 1.8}
            opacity="0.82"
          />

          {/* الغدة العرقية: كرة ملتفة في الأدمة + قناة صاعدة إلى مسام العرق */}
          <path
            d="M206 46 V106 C206 116, 224 114, 222 126 C220 138, 194 136, 198 122 C202 110, 218 124, 210 134"
            fill="none"
            stroke="#0284c7"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* قطرات العرق على سطح الجلد عند الحر */}
          {bodyTemp === 'hot' && (
            <g>
              <path d="M206 30 Q212 39 206 42 Q200 39 206 30 Z" fill="#0ea5e9" />
              <circle cx="192" cy="24" r="2.8" fill="#38bdf8" />
              <circle cx="220" cy="22" r="2.8" fill="#38bdf8" />
            </g>
          )}

          {/* التسميات */}
          <text x="206" y="16" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0369a1">
            مسام العرق
          </text>
          <text x="366" y="59" fontSize="10.5" fontWeight="bold" fill="#7c2d12">البشرة</text>
          <text x="366" y="96" fontSize="10.5" fontWeight="bold" fill="#7c2d12">الأدمة</text>
          <text x="276" y="114" fontSize="10.5" fontWeight="bold" fill="#0369a1">الغدة العرقية</text>
          <text x="64" y="126" fontSize="9.5" fontWeight="bold" fill="#dc2626">شعيرات دموية</text>
          <text x="320" y="167" fontSize="9.5" fontWeight="bold" fill="#854d0e">طبقة دهنية</text>

          <text x="230" y="204" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#9a3412">
            {bodyTemp === 'hot'
              ? 'في الجو الحار: تتسع الشعيرات الدموية وتنشط الغدة العرقية فتُفرز العرق لتبريد الجسم عند تبخره'
              : 'في الجو البارد: تضيق الشعيرات الدموية ويقل إفراز العرق للمحافظة على حرارة الجسم'}
          </text>
        </svg>
      </div>
    </div>
  );
};

/* ==================== 4. محاكاة الجرس والهاتف والموجات (u5-l2, u5-l4) ==================== */
const MagnetismExtra2DSim: React.FC<{ variant: 'telephone' | 'waves' }> = ({ variant }) => {
  const [talking, setTalking] = useState<boolean>(true);
  const [subMode, setSubMode] = useState<'bell' | 'phone'>('bell');
  const [freq, setFreq] = useState<number>(3);

  if (variant === 'telephone') {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setSubMode('bell')}
            className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              subMode === 'bell' ? 'bg-amber-600 text-white' : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            الدائرة الكهربائية للجرس الكهربائي
          </button>
          <button
            type="button"
            onClick={() => setSubMode('phone')}
            className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              subMode === 'phone' ? 'bg-teal-700 text-white' : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            تركيب مرسل ومستقبل التلفون الكربوني
          </button>
        </div>

        {subMode === 'bell' ? (
          <ElectricBellCircuit2DSim />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                مقارنة تركيب مرسل التلفون الكربوني والمستقبل:
              </span>
              <button
                type="button"
                onClick={() => setTalking((t) => !t)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer ${
                  talking ? 'bg-teal-700 text-white' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                {talking ? 'إيقاف الصوت' : 'تحدّث في المرسل'}
              </button>
            </div>
            <div className="rounded-2xl border border-sky-200/80 dark:border-slate-700 bg-sky-50/75 dark:bg-slate-950 p-3">
              <svg viewBox="0 0 480 205" className="w-full h-auto max-h-[235px]">
                {/* المرسل الكربوني (لا يوجد مغناطيس!) */}
                <rect x="22" y="28" width="166" height="128" rx="14" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2" />
                <text x="105" y="48" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369a1">
                  المرسل الكربوني (بلا مغناطيس)
                </text>
                {/* موجات صوتية داخلة */}
                {talking && (
                  <path d="M32 82 Q38 96 32 110 M40 76 Q48 96 40 116" fill="none" stroke="#0284c7" strokeWidth="2" />
                )}
                {/* غشاء معدني رقيق */}
                <rect x="52" y="64" width="6" height="62" rx="2" fill="#94a3b8" stroke="#334155" strokeWidth="1.2" />
                {/* حجرة حبيبات الكربون */}
                <rect x="60" y="66" width="28" height="58" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                {[72, 82, 92, 102, 112].map((cy, idx) => (
                  <g key={cy}>
                    <circle cx={68 + (idx % 2) * 4} cy={cy} r="3.2" fill="#1e293b" />
                    <circle cx={79 - (idx % 2) * 3} cy={cy + 3} r="3.2" fill="#0f172a" />
                  </g>
                ))}
                {/* قرص كربون سميك */}
                <rect x="90" y="64" width="12" height="62" rx="2" fill="#0f172a" />
                <text x="142" y="82" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">غشاء رقيق</text>
                <text x="142" y="98" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">+ حبيبات كربون</text>
                <text x="142" y="114" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">+ قرص سميك</text>

                {/* الأسلاك + البطارية */}
                <path d="M188 74 H292 M188 112 H222 M258 112 H292" stroke={talking ? '#f59e0b' : '#94a3b8'} strokeWidth="2.8" />
                <rect x="222" y="100" width="36" height="24" rx="4" fill="#1e293b" />
                <text x="240" y="115" textAnchor="middle" fontSize="8.5" fill="#fff" fontWeight="bold">بطارية</text>
                <text x="240" y="64" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#b45309">
                  {talking ? 'تيار متغير الشدة' : 'تيار ثابت'}
                </text>

                {/* المستقبل الكهرومغناطيسي */}
                <rect x="292" y="28" width="166" height="128" rx="14" fill="#ecfdf5" stroke="#0f766e" strokeWidth="2" />
                <text x="375" y="48" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f766e">
                  المستقبل (مغناطيس كهربائي)
                </text>
                {/* مغناطيس على شكل U مع ملفات */}
                <path d="M312 72 H374 V84 H326 V108 H374 V120 H312 Z" fill="#0d9488" stroke="#115e59" strokeWidth="1.5" />
                {[334, 346, 358].map((x) => (
                  <g key={x}>
                    <rect x={x} y="68" width="6" height="18" rx="2" fill="#d97706" />
                    <rect x={x} y="106" width="6" height="18" rx="2" fill="#d97706" />
                  </g>
                ))}
                {/* قرص الحديد المطاوع الرقيق */}
                <rect x={talking ? 388 : 392} y="64" width="7" height="64" rx="2" fill="#334155" />
                {talking && (
                  <path d="M406 82 Q414 96 406 110 M416 76 Q426 96 416 116" fill="none" stroke="#0f766e" strokeWidth="2" />
                )}
                <text x="375" y="144" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f766e">
                  قرص حديد مطاوع رقيق يهتز فيصدر الصوت
                </text>

                <text x="240" y="186" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0f766e">
                  يحوّل المرسل الصوت إلى تيار متغير (تضغط الحبيبات فتتغير المقاومة)، ويحوّل المستقبل التيار إلى صوت!
                </text>
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  }

  // EM waves
  const wavePoints: string[] = [];
  for (let x = 20; x <= 400; x += 4) {
    const y = 85 - Math.sin(((x - 20) / 380) * Math.PI * 2 * freq) * 38;
    wavePoints.push(`${x},${y.toFixed(1)}`);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-200">
          التردد: {freq} دورة (كلما زاد التردد قصر الطول الموجي λ)
        </span>
        <input
          type="range"
          min={1}
          max={8}
          value={freq}
          onChange={(e) => setFreq(Number(e.target.value))}
          className="w-48 accent-sky-600"
        />
      </div>
      <div className="rounded-2xl border border-sky-200/80 dark:border-slate-700 bg-sky-50/75 dark:bg-slate-950 p-3">
        <svg viewBox="0 0 420 160" className="w-full h-auto max-h-[190px]">
          <line x1="20" y1="85" x2="400" y2="85" stroke="#94a3b8" strokeDasharray="4 4" />
          <polyline fill="none" stroke="#0284c7" strokeWidth="3" points={wavePoints.join(' ')} />
          <text x="210" y="148" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369a1">
            الموجات الكهرومغناطيسية مستعرضة وتنتقل في الفراغ بسرعة الضوء (ع = ت × λ)
          </text>
        </svg>
      </div>
    </div>
  );
};

/* ==================== 5. محاكاة صدأ الحديد والكربون (u9-l1, u9-l2, u9-l3, u9-l6) ==================== */
const ChemistryExtra2DSim: React.FC<{ variant: 'rust' | 'carbon' }> = ({ variant }) => {
  const [tubeIdx, setTubeIdx] = useState<number>(0);
  const [material, setMaterial] = useState<'graphite' | 'diamond'>('graphite');

  if (variant === 'rust') {
    const tubes = [
      { title: 'أنبوب 1: ماء + هواء', result: 'يصدأ المسمار لتوفر الأكسجين والرطوبة معاً!', rust: true },
      { title: 'أنبوب 2: ماء مغلي + طبقة زيت', result: 'لا يصدأ (الزيت يمنع ذوبان الأكسجين في الماء).', rust: false },
      { title: 'أنبوب 3: هواء جاف + CaCl2', result: 'لا يصدأ (كلوريد الكالسيوم يمتص الرطوبة).', rust: false },
    ];
    const active = tubes[tubeIdx];
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5 text-xs">
          {tubes.map((t, i) => (
            <button
              key={t.title}
              type="button"
              onClick={() => setTubeIdx(i)}
              className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
                tubeIdx === i
                  ? 'bg-amber-600 text-white'
                  : 'bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-amber-200/80 dark:border-slate-700 bg-amber-50/75 dark:bg-slate-950 p-3">
          <svg viewBox="0 0 420 170" className="w-full h-auto max-h-[200px]">
            <rect x="175" y="20" width="70" height="115" rx="20" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2.5" />
            {tubeIdx === 1 && <rect x="177" y="64" width="66" height="10" fill="#facc15" />}
            {tubeIdx !== 2 && <rect x="177" y="74" width="66" height="58" rx="12" fill="#38bdf8" opacity="0.55" />}
            {/* مسمار الحديد */}
            <rect
              x="205"
              y="48"
              width="10"
              height="68"
              rx="3"
              fill={active.rust ? '#b45309' : '#94a3b8'}
              stroke={active.rust ? '#7c2d12' : '#475569'}
              strokeWidth="1.5"
            />
            <text x="210" y="156" textAnchor="middle" fontSize="11.5" fontWeight="bold" fill={active.rust ? '#b45309' : '#0f766e'}>
              {active.result}
            </text>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMaterial('graphite')}
          className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
            material === 'graphite' ? 'bg-slate-800 text-white' : 'bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          توصيل ساق الجرافيت (موصل للكهرباء)
        </button>
        <button
          type="button"
          onClick={() => setMaterial('diamond')}
          className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
            material === 'diamond' ? 'bg-sky-700 text-white' : 'bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          توصيل بلورة الألماس (عازل)
        </button>
      </div>
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-950 p-3">
        <svg viewBox="0 0 420 160" className="w-full h-auto max-h-[190px]">
          <rect x="60" y="62" width="38" height="44" rx="4" fill="#334155" />
          <path d="M98 76 H172 M248 76 H320 V108 H98" fill="none" stroke="#d97706" strokeWidth="3" />
          <rect
            x="172"
            y="66"
            width="76"
            height="20"
            rx="4"
            fill={material === 'graphite' ? '#1e293b' : '#bae6fd'}
            stroke="#0284c7"
            strokeWidth="1.5"
          />
          <circle
            cx="320"
            cy="64"
            r="16"
            fill={material === 'graphite' ? '#fde047' : '#cbd5e1'}
            stroke="#b45309"
            strokeWidth="2"
          />
          <text x="210" y="144" textAnchor="middle" fontSize="11.5" fontWeight="bold" fill="#0f766e">
            {material === 'graphite'
              ? 'الجرافيت يوصل الكهرباء لوجود إلكترونات حرة في بنيته الطبقية فيضيء المصباح!'
              : 'الألماس عازل للكهرباء لارتباط كل ذرة كربون بأربع ذرات بروابط تساهمية قوية.'}
          </text>
        </svg>
      </div>
    </div>
  );
};

/* ==================== 6. محاكاة الجريان واللزوجة والانتشار (u11-l5, u11-l6, u11-l7) ==================== */
const Fluids2DSim: React.FC<{ variant: 'flow' | 'viscosity' | 'diffusion' }> = ({ variant }) => {
  const [tick, setTick] = useState<number>(0);
  const [warm, setWarm] = useState<boolean>(false);
  const [turbulent, setTurbulent] = useState<boolean>(false);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % 100), 60);
    return () => window.clearInterval(id);
  }, []);

  if (variant === 'flow') {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setTurbulent(false)}
            className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              !turbulent ? 'bg-sky-700 text-white' : 'bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            جريان انسيابي منتظم
          </button>
          <button
            type="button"
            onClick={() => setTurbulent(true)}
            className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              turbulent ? 'bg-amber-600 text-white' : 'bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            جريان مضطرب (دوامات)
          </button>
        </div>
        <div className="rounded-2xl border border-sky-200/80 dark:border-slate-700 bg-sky-50/75 dark:bg-slate-950 p-3">
          <svg viewBox="0 0 420 150" className="w-full h-auto max-h-[180px]">
            <rect x="20" y="34" width="380" height="72" rx="8" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2.5" />
            {[48, 70, 92].map((y, idx) => {
              const speed = idx === 1 ? 4.2 : 2.2;
              const x = 35 + ((tick * speed) % 350);
              const dy = turbulent ? Math.sin(tick * 0.4 + idx * 2) * 14 : 0;
              return (
                <g key={y}>
                  <line x1="25" y1={y} x2="395" y2={y} stroke="#7dd3fc" strokeDasharray={turbulent ? '3 4' : 'none'} />
                  <circle cx={x} cy={y + dy} r="5.5" fill="#0284c7" />
                </g>
              );
            })}
            <text x="210" y="135" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369a1">
              {turbulent
                ? 'في الجريان المضطرب تتقاطع المسارات وتنشأ دوامات معيقة للحركة'
                : 'في الجريان الانسيابي لا تتقاطع خطوط الانسياب وتكون السرعة في المحور المركزي أكبر'}
            </text>
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'viscosity') {
    const factor = warm ? 1.7 : 1;
    const yWater = 40 + ((tick * 2.2 * factor) % 90);
    const yOil = 40 + ((tick * 1.1 * factor) % 90);
    const yHoney = 40 + ((tick * 0.45 * factor) % 90);
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-200">سباق سقوط الكرة الفولاذية (قياس اللزوجة):</span>
          <button
            type="button"
            onClick={() => setWarm((w) => !w)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              warm ? 'bg-amber-600 text-white' : 'bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{warm ? 'إيقاف التسخين (سوائل باردة)' : 'تسخين السوائل (تقل اللزوجة)'}</span>
          </button>
        </div>
        <div className="rounded-2xl border border-amber-200/80 dark:border-slate-700 bg-amber-50/75 dark:bg-slate-950 p-3">
          <svg viewBox="0 0 420 170" className="w-full h-auto max-h-[200px]">
            {[
              { x: 95, label: 'ماء (أقل لزوجة)', fill: '#bae6fd', y: yWater },
              { x: 210, label: 'زيت (متوسط)', fill: '#fde047', y: yOil },
              { x: 325, label: 'عسل (أعلى لزوجة)', fill: '#f59e0b', y: yHoney },
            ].map((col) => (
              <g key={col.label}>
                <rect x={col.x - 24} y="24" width="48" height="114" rx="8" fill={col.fill} stroke="#475569" strokeWidth="2" />
                <circle cx={col.x} cy={col.y} r="7" fill="#334155" />
                <text x={col.x} y="156" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#1e293b">
                  {col.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  }

  // diffusion hot vs cold
  const coldSpread = 8 + (tick * 0.25);
  const hotSpread = 10 + Math.min(46, tick * 0.72);
  return (
    <div className="rounded-2xl border border-indigo-200/80 dark:border-slate-700 bg-indigo-50/75 dark:bg-slate-950 p-3">
      <svg viewBox="0 0 420 175" className="w-full h-auto max-h-[210px]">
        <rect x="65" y="28" width="110" height="106" rx="10" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.2" />
        <circle cx="120" cy="80" r={coldSpread} fill="#6366f1" opacity="0.45" />
        <text x="120" y="152" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369a1">
          ماء بارد (انتشار بطيء)
        </text>

        <rect x="245" y="28" width="110" height="106" rx="10" fill="#ffedd5" stroke="#ea580c" strokeWidth="2.2" />
        <circle cx="300" cy="80" r={hotSpread} fill="#4f46e5" opacity="0.48" />
        <text x="300" y="152" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#c2410c">
          ماء ساخن (انتشار أسرع)
        </text>
      </svg>
    </div>
  );
};

export const Lesson2DSimulations: React.FC<Lesson2DSimulationsProps> = ({
  lessonId,
  defaultOpen = true,
  titleOverride,
  subtitleOverride,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  if (!HAS_2D_SIMULATION_LESSONS.has(lessonId)) return null;

  return (
    <div className="rounded-2xl border border-teal-300/70 dark:border-teal-800/80 bg-white/68 dark:bg-slate-900/72 backdrop-blur-md overflow-hidden transition-colors">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-right hover:bg-teal-50/45 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
      >
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-extrabold text-teal-800 dark:text-teal-300 leading-snug">
              {titleOverride ?? 'محاكاة تفاعلية ثنائية الأبعاد (2D) ودوائر مساعدة للدرس'}
            </div>
            {subtitleOverride && (
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {subtitleOverride}
              </div>
            )}
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0">
          {isOpen ? (
            <>
              <span>طيّ</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>فتح</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </span>
      </button>

      {isOpen && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 border-t border-slate-200/70 dark:border-slate-800/80">
          {(lessonId === 'u1-l1' || lessonId === 'u1-l2') && <SolutionsPrep2DSim />}
          {(lessonId === 'u2-l1' || lessonId === 'u2-l2') && <ElectrolyteCircuit2DSim />}
          {lessonId === 'u3-l1' && <AcidReactions2DSim initialTab="neutralization" />}
          {lessonId === 'u3-l2' && <AcidReactions2DSim initialTab="salts" />}
          {lessonId === 'u3-l3' && <AcidReactions2DSim initialTab="acidrain" />}
          {lessonId === 'u4-l1' && <SpaceAndUniverse2DSim variant="universe" />}
          {lessonId === 'u4-l2' && <SpaceAndUniverse2DSim variant="rockets" />}
          {lessonId === 'u5-l1' && <MagnetizationMethods2DSim />}
          {lessonId === 'u5-l2' && <MagnetismExtra2DSim variant="telephone" />}
          {lessonId === 'u5-l3' && <TransformerCircuit2DSim />}
          {lessonId === 'u5-l4' && <MagnetismExtra2DSim variant="waves" />}
          {lessonId === 'u6-l1' && <Excretion2DSim variant="amoeba" />}
          {lessonId === 'u6-l2' && <Excretion2DSim variant="plant" />}
          {lessonId === 'u6-l3' && <Nephron2DSim />}
          {lessonId === 'u6-l4' && <Excretion2DSim variant="skin" />}
          {lessonId === 'u7-l1' && <PlantPollination2DSim />}
          {lessonId === 'u7-l2' && <HumanReproduction2DSim />}
          {lessonId === 'u9-l1' && <OxidesAndCO2Prep2DSim variant="oxides" />}
          {(lessonId === 'u9-l2' || lessonId === 'u9-l6') && <ChemistryExtra2DSim variant="rust" />}
          {lessonId === 'u9-l3' && <ChemistryExtra2DSim variant="carbon" />}
          {lessonId === 'u9-l4' && <OxidesAndCO2Prep2DSim variant="co2-prep" />}
          {(lessonId === 'u10-l1' || lessonId === 'u10-l2') && <HalogensAndChlorine2DSim variant="halogens" />}
          {lessonId === 'u10-l3' && <HalogensAndChlorine2DSim variant="chlorine" />}
          {lessonId === 'u11-l1' && <SolidPropsAndHydroJets2DSim variant="solids" />}
          {lessonId === 'u11-l5' && <Fluids2DSim variant="flow" />}
          {lessonId === 'u11-l6' && <Fluids2DSim variant="viscosity" />}
          {lessonId === 'u11-l7' && <Fluids2DSim variant="diffusion" />}
          {lessonId === 'u12-l2' && <SolidPropsAndHydroJets2DSim variant="jets" />}
          {lessonId === 'u13-l2' && <SolarEnergyCircuits2DSim variant="thermal" />}
          {(lessonId === 'u13-l1' || lessonId === 'u13-l3') && <SolarEnergyCircuits2DSim variant="pv-circuit" />}
          {(lessonId === 'u16-l1' || lessonId === 'u16-l2' || lessonId === 'u16-l3' || lessonId === 'u16-l4') && (
            <Genetics2DSim />
          )}
        </div>
      )}
    </div>
  );
};
