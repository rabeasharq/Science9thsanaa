import React, { useState } from 'react';
import {
  Baby,
  Droplets,
  Factory,
  HeartPulse,
  Leaf,
  ShieldCheck,
  Sprout,
  Sun,
} from 'lucide-react';

/* 1. التلوث الناتج عن الصناعات الكيميائية (الوحدة 9 - الدرس 6: u9-l6) */
export const IndustrialPollution2DSim: React.FC = () => {
  const [filtersEnabled, setFiltersEnabled] = useState<boolean>(false);
  const [limeNeutralized, setLimeNeutralized] = useState<boolean>(false);

  const soilPh = filtersEnabled ? (limeNeutralized ? 6.6 : 6.1) : limeNeutralized ? 5.8 : 4.3;
  const isHealthySoil = soilPh >= 6.0 && soilPh <= 7.0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <Factory className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          <span>التلوث الصناعي ومعالجة المداخن والتربة الزراعية (pH المثالي 6–7):</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFiltersEnabled((v) => !v)}
            className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              filtersEnabled
                ? 'bg-emerald-700 text-white'
                : 'bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            {filtersEnabled ? 'مرشحات المداخن: مفعّلة' : 'تشغيل مرشحات المداخن'}
          </button>
          <button
            type="button"
            onClick={() => setLimeNeutralized((v) => !v)}
            className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              limeNeutralized
                ? 'bg-teal-700 text-white'
                : 'bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            {limeNeutralized ? 'معادلة التربة بالجير: مفعّلة' : 'إضافة جير لمعادلة التربة'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-sky-50/70 dark:bg-slate-950 p-3">
        <svg viewBox="0 0 460 195" className="w-full h-auto max-h-[220px]">
          {/* المصنع والمداخن */}
          <rect x="28" y="96" width="110" height="58" rx="4" fill="#475569" />
          <rect x="46" y="48" width="18" height="48" fill="#64748b" />
          <rect x="86" y="56" width="18" height="40" fill="#64748b" />
          {filtersEnabled && (
            <>
              <rect x="44" y="52" width="22" height="9" rx="2" fill="#10b981" />
              <rect x="84" y="60" width="22" height="9" rx="2" fill="#10b981" />
            </>
          )}
          {/* غيوم الانبعاثات */}
          <ellipse
            cx="75"
            cy="28"
            rx="42"
            ry="14"
            fill={filtersEnabled ? '#cbd5e1' : '#64748b'}
            opacity={filtersEnabled ? 0.55 : 0.85}
          />
          <text x="75" y="32" textAnchor="middle" fontSize="9" fontWeight="bold" fill={filtersEnabled ? '#0f766e' : '#ffffff'}>
            {filtersEnabled ? 'بخار ماء مرشَّح' : 'SO₂ + NO₂ + دخان أسمنت'}
          </text>

          {/* المطر والسحب نحو التربة */}
          <path d="M135 28 H280" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
          <ellipse cx="320" cy="34" rx="54" ry="18" fill={filtersEnabled ? '#e2e8f0' : '#94a3b8'} />
          <line x1="295" y1="54" x2="288" y2="96" stroke={filtersEnabled ? '#38bdf8' : '#f43f5e'} strokeWidth="2" strokeDasharray="3 3" />
          <line x1="322" y1="54" x2="315" y2="96" stroke={filtersEnabled ? '#38bdf8' : '#f43f5e'} strokeWidth="2" strokeDasharray="3 3" />
          <line x1="348" y1="54" x2="341" y2="96" stroke={filtersEnabled ? '#38bdf8' : '#f43f5e'} strokeWidth="2" strokeDasharray="3 3" />

          {/* التربة والمحصول */}
          <rect x="200" y="132" width="235" height="32" rx="6" fill={isHealthySoil ? '#78350f' : '#9a3412'} />
          {/* نبات */}
          <path d="M318 132 V102" stroke={isHealthySoil ? '#16a34a' : '#ca8a04'} strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="305" cy="108" rx="12" ry="6" fill={isHealthySoil ? '#22c55e' : '#eab308'} transform="rotate(-20 305 108)" />
          <ellipse cx="331" cy="108" rx="12" ry="6" fill={isHealthySoil ? '#22c55e' : '#eab308'} transform="rotate(20 331 108)" />

          {/* مؤشر pH التربة */}
          <rect x="206" y="74" width="84" height="36" rx="8" fill="#ffffff" stroke={isHealthySoil ? '#16a34a' : '#dc2626'} strokeWidth="2" />
          <text x="248" y="90" textAnchor="middle" fontSize="10" fontWeight="bold" fill={isHealthySoil ? '#15803d' : '#b91c1c'}>
            pH التربة = {soilPh.toFixed(1)}
          </text>
          <text x="248" y="103" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#475569">
            {isHealthySoil ? 'صالحة للزراعة (6–7)' : 'تربة متضررة حمضياً'}
          </text>

          <text x="230" y="184" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f766e">
            معالجة غازات المصانع (مثل مصانع الأسمنت والأسمدة) تحمي الهواء والمياه والتربة الزراعية
          </text>
        </svg>
      </div>
    </div>
  );
};

/* 2. الإشعاع الشمسي وزاوية السقوط (الوحدة 13 - الدرس 1: u13-l1) */
export const SolarRadiation2DSim: React.FC = () => {
  const [angleDeg, setAngleDeg] = useState<number>(90);
  const [cloudy, setCloudy] = useState<boolean>(false);

  const rad = (angleDeg * Math.PI) / 180;
  const sinVal = Math.max(0.35, Math.sin(rad));
  const areaFactor = (1 / sinVal).toFixed(2);
  const intensityPct = Math.round(sinVal * (cloudy ? 52 : 100));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-slate-700 dark:text-slate-200">زاوية سقوط الأشعة الشمسية: {angleDeg}°</span>
          <input
            type="range"
            min={25}
            max={90}
            value={angleDeg}
            onChange={(e) => setAngleDeg(Number(e.target.value))}
            className="w-32 accent-amber-500"
          />
        </div>
        <button
          type="button"
          onClick={() => setCloudy((c) => !c)}
          className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
            cloudy
              ? 'bg-slate-700 text-white'
              : 'bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
          }`}
        >
          {cloudy ? 'حالة الجو: غائم (تشتت الأشعة)' : 'حالة الجو: سماء صافية (إشعاع مباشر)'}
        </button>
      </div>

      <div className="rounded-2xl border border-amber-200/80 dark:border-slate-700 bg-sky-50/75 dark:bg-slate-950 p-3">
        <svg viewBox="0 0 460 190" className="w-full h-auto max-h-[210px]">
          {/* الشمس */}
          <circle
            cx={angleDeg > 60 ? 230 : 95}
            cy={angleDeg > 60 ? 32 : 52}
            r="18"
            fill="#facc15"
            opacity={cloudy ? 0.5 : 0.95}
          />
          {cloudy && (
            <ellipse cx="215" cy="64" rx="85" ry="18" fill="#cbd5e1" opacity="0.88" />
          )}

          {/* حزمة الأشعة */}
          {[-24, 0, 24].map((dx, i) => {
            const sx = (angleDeg > 60 ? 230 : 95) + dx;
            const sy = angleDeg > 60 ? 48 : 66;
            const ex = 230 + dx * (1 / sinVal);
            return (
              <line
                key={i}
                x1={sx}
                y1={sy}
                x2={ex}
                y2={132}
                stroke="#f59e0b"
                strokeWidth="3"
                strokeDasharray={cloudy ? '5 4' : undefined}
              />
            );
          })}

          {/* سطح الأرض ومنطقة التوزع */}
          <rect x="40" y="132" width="380" height="22" rx="4" fill="#d97706" opacity="0.25" />
          <rect
            x={230 - 30 * (1 / sinVal)}
            y="129"
            width={60 * (1 / sinVal)}
            height="8"
            rx="3"
            fill={angleDeg >= 75 && !cloudy ? '#dc2626' : '#f59e0b'}
          />

          <text x="230" y="172" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0f766e">
            الشدة الواصلة: {intensityPct}% · مساحة التوزع النسبية: {areaFactor}× (الأشعة العمودية أكثر تركيزاً وحرارة)
          </text>
        </svg>
      </div>
    </div>
  );
};

/* 3. أمراض الجهازين البولي والتناسلي وطرق الوقاية (الوحدة 8) */
export const Unit8Diseases2DSim: React.FC<{ variant: 'urinary' | 'reproductive' }> = ({ variant }) => {
  const [cleanWaterMode, setCleanWaterMode] = useState<boolean>(false);
  const [selectedDisease, setSelectedDisease] = useState<'gonorrhea' | 'aids'>('gonorrhea');

  if (variant === 'urinary') {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            <span>دورة عدوى البلهارسيا البولية وكيفية قطعها بالوقاية:</span>
          </span>
          <button
            type="button"
            onClick={() => setCleanWaterMode((v) => !v)}
            className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              cleanWaterMode ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'
            }`}
          >
            {cleanWaterMode ? 'تفعيل الوقاية (مياه نظيفة ومكافحة القواقع)' : 'وضع الخطر (بركة راكدة تحوي قواقع)'}
          </button>
        </div>

        <div className="rounded-2xl border border-rose-200/80 dark:border-slate-700 bg-rose-50/55 dark:bg-slate-950 p-3">
          <svg viewBox="0 0 470 185" className="w-full h-auto max-h-[210px]">
            {/* 1. القوقع المائي */}
            <rect x="20" y="38" width="115" height="84" rx="10" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
            <circle cx="77" cy="68" r="16" fill={cleanWaterMode ? '#cbd5e1' : '#f59e0b'} stroke="#78350f" strokeWidth="2" />
            <text x="77" y="106" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0369a1">
              1. القوقع (العائل الوسيط)
            </text>

            <path d="M138 80 H172" stroke={cleanWaterMode ? '#94a3b8' : '#dc2626'} strokeWidth="3" />

            {/* 2. طور السركاريا في الماء الراكد */}
            <rect x="175" y="38" width="120" height="84" rx="10" fill={cleanWaterMode ? '#e0f2fe' : '#fef3c7'} stroke={cleanWaterMode ? '#0284c7' : '#d97706'} strokeWidth="2" />
            <text x="235" y="72" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill={cleanWaterMode ? '#0f766e' : '#b45309'}>
              {cleanWaterMode ? 'مياه جارية آمنة' : 'طور السركاريا المعدي'}
            </text>
            <text x="235" y="104" textAnchor="middle" fontSize="9" fill="#475569">
              {cleanWaterMode ? 'انقطعت دورة العدوى' : 'يخترق الجلد أثناء السباحة'}
            </text>

            <path d="M298 80 H332" stroke={cleanWaterMode ? '#94a3b8' : '#dc2626'} strokeWidth="3" />

            {/* 3. المثانة البولية */}
            <rect x="335" y="38" width="115" height="84" rx="10" fill="#ffffff" stroke={cleanWaterMode ? '#16a34a' : '#dc2626'} strokeWidth="2" />
            <text x="392" y="72" textAnchor="middle" fontSize="10" fontWeight="bold" fill={cleanWaterMode ? '#15803d' : '#b91c1c'}>
              {cleanWaterMode ? 'جهاز بولي سليم' : 'دم في البول (بلهارسيا)'}
            </text>
            <text x="392" y="104" textAnchor="middle" fontSize="9" fill="#475569">
              {cleanWaterMode ? 'شرب الماء يقي الحصوات' : 'تلتصق الديدان بأوردة المثانة'}
            </text>

            <text x="235" y="160" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0f766e">
              الوقاية الوزارية: تجنب السباحة في البرك الراكدة، مكافحة القواقع، والإكثار من شرب الماء لمنع الحصوات
            </text>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>مقارنة الأمراض المعدية وطرق الوقاية:</span>
        </span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedDisease('gonorrhea')}
            className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              selectedDisease === 'gonorrhea'
                ? 'bg-teal-700 text-white'
                : 'bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            مرض السيلان (بكتيري)
          </button>
          <button
            type="button"
            onClick={() => setSelectedDisease('aids')}
            className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              selectedDisease === 'aids'
                ? 'bg-teal-700 text-white'
                : 'bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            مرض الإيدز HIV (فيروسي)
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-teal-200/80 dark:border-slate-700 bg-white/75 dark:bg-slate-950 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800">
          <div className="font-bold text-teal-700 dark:text-teal-300 mb-1">المسبب المرضي</div>
          <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {selectedDisease === 'gonorrhea'
              ? 'بكتيريا مكورة تصيب الأغشية المخاطية للجهاز البولي والتناسلي.'
              : 'فيروس نقص المناعة البشرية (HIV) الذي يهاجم خلايا المناعة في الدم.'}
          </div>
        </div>
        <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/30 p-3 border border-amber-200 dark:border-amber-900">
          <div className="font-bold text-amber-800 dark:text-amber-300 mb-1">طرق الانتقال (نقطة وزارية)</div>
          <div className="text-slate-700 dark:text-slate-200 leading-relaxed">
            {selectedDisease === 'gonorrhea'
              ? 'الاتصال غير المشروع، أو استخدام المرحاض الأوروبي الملوث ومناشف المصاب.'
              : 'نقل دم ملوث، أدوات حادة/إبر ملوثة، أو من الأم الحامل المصابة للجنين (لا ينتقل بالمصافحة أو لدغ البعوض).'}
          </div>
        </div>
        <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 p-3 border border-emerald-200 dark:border-emerald-900">
          <div className="font-bold text-emerald-800 dark:text-emerald-300 mb-1">الوقاية والعلاج</div>
          <div className="text-slate-700 dark:text-slate-200 leading-relaxed">
            {selectedDisease === 'gonorrhea'
              ? 'العفة، النظافة الشخصية، وتعقيم المراحيض العامة؛ ويُعالج بالمضادات الحيوية مبكراً.'
              : 'فحص الدم قبل النقل، عدم مشاركة الإبر والأدوات الحادة، والالتزام الأخلاقي والديني.'}
          </div>
        </div>
      </div>
    </div>
  );
};

/* 4. استثمار موارد البيئة الحية (الوحدة 14) */
export const Unit14EnvResources2DSim: React.FC<{ variant: 'development' | 'industries' }> = ({ variant }) => {
  const [irrigation, setIrrigation] = useState<'flood' | 'drip'>('drip');
  const [industry, setIndustry] = useState<'dairy' | 'bread' | 'textile'>('dairy');

  if (variant === 'development') {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>مقارنة طرق الري الزراعي والمدرجات الجبلية:</span>
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setIrrigation('drip')}
              className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
                irrigation === 'drip' ? 'bg-emerald-700 text-white' : 'bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              الري بالتنقيط (حديث)
            </button>
            <button
              type="button"
              onClick={() => setIrrigation('flood')}
              className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
                irrigation === 'flood' ? 'bg-amber-600 text-white' : 'bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              الري بالغمر (تقليدي مهدر)
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200/80 dark:border-slate-700 bg-emerald-50/55 dark:bg-slate-950 p-3">
          <svg viewBox="0 0 460 175" className="w-full h-auto max-h-[195px]">
            {/* مدرجات جبلية + تربة */}
            <path d="M25 135 H435 V155 H25 Z" fill="#78350f" />
            {irrigation === 'drip' ? (
              <>
                <line x1="40" y1="88" x2="415" y2="88" stroke="#1e293b" strokeWidth="4" />
                {[110, 230, 350].map((x) => (
                  <g key={x}>
                    <line x1={x} y1="88" x2={x} y2="132" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 3" />
                    <circle cx={x} cy="128" r="4" fill="#0284c7" />
                    <path d={`M${x} 135 V96`} stroke="#15803d" strokeWidth="4" />
                    <ellipse cx={x - 10} cy="102" rx="10" ry="5" fill="#22c55e" />
                    <ellipse cx={x + 10} cy="102" rx="10" ry="5" fill="#22c55e" />
                  </g>
                ))}
              </>
            ) : (
              <>
                <rect x="35" y="114" width="390" height="22" fill="#38bdf8" opacity="0.55" />
                {[110, 230, 350].map((x) => (
                  <g key={x}>
                    <path d={`M${x} 135 V102`} stroke="#65a30d" strokeWidth="4" />
                    <ellipse cx={x - 8} cy="106" rx="8" ry="4" fill="#84cc16" />
                  </g>
                ))}
              </>
            )}
            <text x="230" y="42" textAnchor="middle" fontSize="11" fontWeight="bold" fill={irrigation === 'drip' ? '#0f766e' : '#b45309'}>
              {irrigation === 'drip'
                ? 'توفير المياه بنسبة كبيرة: يصل الماء إلى جذور النبات مباشرة دون هدر بالتبخر'
                : 'فاقد ماء مرتفع جداً بالتبخر والتسرب وقد يسبب ملوحة التربة وانجرافها'}
            </text>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>الصناعات المعتمدة على الموارد الحية والكائنات الدقيقة النافعة:</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: 'dairy', label: 'الألبان والجبن' },
              { id: 'bread', label: 'المخبوزات (الخميرة)' },
              { id: 'textile', label: 'النسيج والزيوت والجلود' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndustry(item.id)}
              className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
                industry === item.id
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-200/80 dark:border-slate-700 bg-white/75 dark:bg-slate-950 p-4 text-xs sm:text-sm space-y-2">
        {industry === 'dairy' && (
          <div className="space-y-1">
            <div className="font-bold text-emerald-800 dark:text-emerald-300">صناعة الزبادي والجبن (البكتيريا النافعة):</div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              تقوم <strong>بكتيريا حمض اللاكتيك</strong> بتحويل سكر اللاكتوز في الحليب إلى حمض اللاكتيك فيتخثر البروتين (الكازين) ويمنح الزبادي طعمه وقوامه مع حفظه من البكتيريا الضارة.
            </p>
          </div>
        )}
        {industry === 'bread' && (
          <div className="space-y-1">
            <div className="font-bold text-amber-700 dark:text-amber-300">صناعة الخبز والمعجنات (فطر الخميرة):</div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              يتنفس <strong>فطر الخميرة</strong> لا هوائياً على السكريات وينتج غاز <strong>ثاني أكسيد الكربون CO₂</strong> الذي يسبب انتفاخ العجين ومساميته الطرية أثناء الخبز.
            </p>
          </div>
        )}
        {industry === 'textile' && (
          <div className="space-y-1">
            <div className="font-bold text-teal-700 dark:text-teal-300">صناعات النسيج والزيوت والجلود:</div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              تعتمد على الألياف النباتية (القطن والكتان) والحيوانية (الصوف والحرير والجلود المدبوغة)، واستخلاص الزيوت النباتية من السمسم والزيتون ودوار الشمس.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* 5. رعاية الأمومة والطفولة وتنظيم الأسرة (الوحدة 15) */
export const Unit15MotherChild2DSim: React.FC<{ variant: 'pregnancy' | 'breastfeeding' | 'planning' }> = ({ variant }) => {
  const [feedingType, setFeedingType] = useState<'natural' | 'formula'>('natural');
  const [spacingYears, setSpacingYears] = useState<number>(3);

  if (variant === 'pregnancy') {
    return (
      <div className="rounded-2xl border border-pink-200/80 dark:border-slate-700 bg-pink-50/55 dark:bg-slate-950 p-4 space-y-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-bold text-pink-800 dark:text-pink-300">
          <Baby className="w-4 h-4" />
          <span>التبادل الغذائي عبر المشيمة والحبل السري ورعاية الحامل</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-pink-200 dark:border-slate-800">
            <div className="font-bold text-teal-700 dark:text-teal-300 mb-1">1. المشيمة والحبل السري</div>
            <p className="text-slate-600 dark:text-slate-300">ينقلان الأكسجين والغذاء المهضوم والأجسام المضادة من دم الأم للجنين دون اختلاط الدم، وينقلان الفضلات وCO₂ للأم.</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-pink-200 dark:border-slate-800">
            <div className="font-bold text-emerald-700 dark:text-emerald-300 mb-1">2. التغذية والحديد</div>
            <p className="text-slate-600 dark:text-slate-300">حاجة الحامل للبروتينات والكالسيوم والحديد وحمض الفوليك لنمو عظام الجنين وجهازه العصبي ووقاية الأم من فقر الدم.</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-rose-200 dark:border-slate-800">
            <div className="font-bold text-rose-700 dark:text-rose-300 mb-1">3. محاذير الحمل</div>
            <p className="text-slate-600 dark:text-slate-300">تجنب تناول أي أدوية دون استشارة الطبيب، وتجنب الأشعة السينية والتدخين لتفادي التشوهات الخلقية.</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'breastfeeding') {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-pink-600" />
            <span>مقارنة الرضاعة الطبيعية (وحليب اللبا) مقابل الصناعية:</span>
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setFeedingType('natural')}
              className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
                feedingType === 'natural' ? 'bg-emerald-700 text-white' : 'bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              الرضاعة الطبيعية (الأفضل)
            </button>
            <button
              type="button"
              onClick={() => setFeedingType('formula')}
              className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
                feedingType === 'formula' ? 'bg-amber-600 text-white' : 'bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              الرضاعة الصناعية (عند الضرورة فقط)
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-pink-200/80 dark:border-slate-700 bg-white/75 dark:bg-slate-950 p-4 text-xs sm:text-sm">
          {feedingType === 'natural' ? (
            <ul className="list-disc list-inside space-y-1.5 text-slate-700 dark:text-slate-200">
              <li><strong>حليب اللبا (اللبأ في الأيام الأولى):</strong> غني جداً بالأجسام المضادة التي تمنح الرضيع مناعة طبيعية ضد الأمراض.</li>
              <li><strong>معقم وجاهز دائماً:</strong> درجة حرارته مطابقة لجسم الطفل (37°م) وسهل الهضم ومتوازن المكونات.</li>
              <li><strong>فائدة نفسية وصحية:</strong> يقوي الارتباط العاطفي بين الأم وطفلها ويساعد على عودة الرحم لحجمه الطبيعي.</li>
            </ul>
          ) : (
            <ul className="list-disc list-inside space-y-1.5 text-slate-700 dark:text-slate-200">
              <li><strong>تفتقر للأجسام المضادة:</strong> لا تمنح الطفل المناعة الطبيعية الموجودة في حليب اللبا.</li>
              <li><strong>مخاطر التلوث وعسر الهضم:</strong> تتطلب تعقيماً صارماً للزجاجات والماء ومراقبة دقيقة للتركيز.</li>
              <li><strong>متى تُستخدم؟</strong> فقط عند تعذر الرضاعة الطبيعية صحياً أو بوفاة الأم وتحت إشراف طبي.</li>
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-200">فترة المباعدة بين الولادات: {spacingYears} سنوات</span>
        <input
          type="range"
          min={1}
          max={4}
          step={0.5}
          value={spacingYears}
          onChange={(e) => setSpacingYears(Number(e.target.value))}
          className="w-40 accent-pink-600"
        />
      </div>
      <div className="rounded-2xl border border-pink-200/80 dark:border-slate-700 bg-pink-50/55 dark:bg-slate-950 p-4 text-xs sm:text-sm">
        <div className={`font-bold mb-1 ${spacingYears >= 2 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
          {spacingYears >= 2
            ? 'مباعدة صحية سليمة (سنتان إلى ثلاث سنوات فأكثر):'
            : 'تقارب الولادات (أقل من سنتين) يرهق صحة الأم والرضيع:'}
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {spacingYears >= 2
            ? 'تستعيد الأم مخزون الحديد والكالسيوم، وينال الطفل حقه الكامل من الرضاعة الطبيعية والرعاية التربوية والصحية.'
            : 'يؤدي التقارب الشديد إلى فقر الدم لدى الأم، وانقطاع مبكر للرضاعة الطبيعية للطفل الأول، وولادة طفل أقل وزناً.'}
        </p>
      </div>
    </div>
  );
};
