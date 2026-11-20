import React, { useEffect, useState } from 'react';
import { Flame, FlaskConical, Rocket, Sun, Sparkles } from 'lucide-react';

/* 1. محاكاة المحاليل وطرق تحضيرها (الوحدة 1: u1-l1 و u1-l2) */
export const SolutionsPrep2DSim: React.FC = () => {
  const [spoons, setSpoons] = useState<number>(2); // 1..6
  const [heated, setHeated] = useState<boolean>(false);
  const [stirred, setStirred] = useState<boolean>(true);

  const maxDissolve = heated ? 5 : 3;
  const status =
    !stirred
      ? 'قبل التحريك: تترسب بلورات الملح في القاع لبطء التلامس مع المذيب.'
      : spoons < maxDissolve
      ? 'محلول غير مشبع: يذوب المذاب تماماً ويمكن إذابة كمية إضافية عند هذه الحرارة.'
      : spoons === maxDissolve
      ? 'محلول مشبع: استوعب المذيب أقصى كمية ممكنة من المذاب عند هذه الدرجة.'
      : heated
      ? 'محلول فوق مشبع (بالتسخين): زادت الذوبانية بالحرارة؛ وعند التبريد تترسب البلورات الزائدة!'
      : 'محلول مشبع مع راسب في القاع: الكمية الزائدة لا تذوب دون تسخين!';

  const undissolved = !stirred ? spoons : Math.max(0, spoons - maxDissolve);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-200">كمية المذاب (ملاعق ملح): {spoons}</span>
          <input
            type="range"
            min={1}
            max={6}
            value={spoons}
            onChange={(e) => setSpoons(Number(e.target.value))}
            className="w-28 accent-teal-600"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setStirred((s) => !s)}
            className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              stirred ? 'bg-teal-700 text-white' : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {stirred ? 'التحريك: نشط' : 'بدون تحريك'}
          </button>
          <button
            type="button"
            onClick={() => setHeated((h) => !h)}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              heated ? 'bg-amber-600 text-white' : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{heated ? 'تسخين الكأس (تزيد الذوبانية)' : 'درجة حرارة الغرفة (25°م)'}</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-teal-200/80 dark:border-slate-700 bg-sky-50/75 dark:bg-slate-950 p-3">
        <svg viewBox="0 0 420 185" className="w-full h-auto max-h-[210px]">
          {/* الكأس */}
          <path d="M145 36 V136 Q145 144 155 144 H265 Q275 144 275 136 V36" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2.5" />
          <rect x="148" y="64" width="124" height="78" rx="6" fill={heated ? '#7dd3fc' : '#38bdf8'} opacity="0.45" />
          {/* ساق التحريك */}
          {stirred && <line x1="210" y1="18" x2="224" y2="128" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />}
          {/* جزيئات مذابة منتشرة */}
          {Array.from({ length: Math.min(spoons - undissolved, 5) * 3 }).map((_, idx) => (
            <circle
              key={idx}
              cx={164 + ((idx * 23) % 92)}
              cy={76 + ((idx * 17) % 48)}
              r="2.8"
              fill="#0f766e"
              opacity="0.7"
            />
          ))}
          {/* راسب غير ذائب في القاع */}
          {Array.from({ length: undissolved * 3 }).map((_, idx) => (
            <rect
              key={idx}
              x={168 + ((idx * 14) % 78)}
              y={132 + (idx % 2) * 4}
              width="6"
              height="5"
              rx="1"
              fill="#f8fafc"
              stroke="#64748b"
              strokeWidth="1"
            />
          ))}
          {/* لهب التسخين */}
          {heated && (
            <path d="M196 154 Q210 138 224 154 Q210 164 196 154Z" fill="#f97316" />
          )}
          <text x="210" y="174" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0f766e">
            {status}
          </text>
        </svg>
      </div>
    </div>
  );
};

/* 2. تفاعلات الحموض والقواعد والمطر الحمضي (الوحدة 3: u3-l1, u3-l2, u3-l3) */
export const AcidReactions2DSim: React.FC<{ initialTab?: 'neutralization' | 'salts' | 'acidrain' }> = ({
  initialTab = 'neutralization',
}) => {
  const [tab, setTab] = useState<'neutralization' | 'salts' | 'acidrain'>(initialTab);
  const [baseDrops, setBaseDrops] = useState<number>(5); // 0..10 (5 = pH 7 neutral)
  const [rainLevel, setRainLevel] = useState<number>(40);

  const phApprox = Number((2 + baseDrops).toFixed(1));
  const phenColor = phApprox > 7.5 ? '#ec4899' : phApprox === 7 ? '#bae6fd' : '#e0f2fe';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 text-xs">
        <button
          type="button"
          onClick={() => setTab('neutralization')}
          className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
            tab === 'neutralization' ? 'bg-teal-700 text-white' : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          تفاعل التعادل (حمض + قاعدة → ملح + ماء)
        </button>
        <button
          type="button"
          onClick={() => setTab('salts')}
          className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
            tab === 'salts' ? 'bg-teal-700 text-white' : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          أثر الحموض في أملاح الكربونات
        </button>
        <button
          type="button"
          onClick={() => setTab('acidrain')}
          className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
            tab === 'acidrain' ? 'bg-amber-600 text-white' : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          تكون المطر الحمضي وتأثيره
        </button>
      </div>

      {tab === 'neutralization' && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-200">
              قطرات القاعدة NaOH المضافة إلى 20 مل حمض HCl: {baseDrops} قطرات (pH ≈ {phApprox})
            </span>
            <input
              type="range"
              min={0}
              max={10}
              value={baseDrops}
              onChange={(e) => setBaseDrops(Number(e.target.value))}
              className="w-40 accent-teal-600"
            />
          </div>
          <div className="rounded-2xl border border-teal-200/80 dark:border-slate-700 bg-sky-50/75 dark:bg-slate-950 p-3">
            <svg viewBox="0 0 420 170" className="w-full h-auto max-h-[195px]">
              {/* السحاحة */}
              <rect x="198" y="14" width="24" height="58" rx="4" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
              <line x1="210" y1="72" x2="210" y2="86" stroke="#334155" strokeWidth="3" />
              <circle cx="210" cy="92" r="3.5" fill="#0ea5e9" />
              {/* الدورق */}
              <path d="M188 94 H232 L256 142 H164 Z" fill={phenColor} stroke="#0f766e" strokeWidth="2.2" />
              <text x="210" y="162" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f766e">
                {phApprox === 7
                  ? 'نقطة التعادل التام (pH = 7): HCl + NaOH → NaCl + H2O'
                  : phApprox < 7
                  ? 'الوسط ما زال حمضياً (H+ فائض) — الفينولفثالين عديم اللون'
                  : 'زيادة القاعدة حولت المحلول لقاعدي (تلون الفينولفثالين بالوردي)'}
              </text>
            </svg>
          </div>
        </div>
      )}

      {tab === 'salts' && (
        <div className="rounded-2xl border border-teal-200/80 dark:border-slate-700 bg-sky-50/75 dark:bg-slate-950 p-3">
          <svg viewBox="0 0 420 170" className="w-full h-auto max-h-[195px]">
            <rect x="85" y="42" width="80" height="96" rx="10" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2.2" />
            <rect x="88" y="88" width="74" height="47" rx="6" fill="#38bdf8" opacity="0.45" />
            <circle cx="115" cy="126" r="6" fill="#f1f5f9" stroke="#64748b" />
            <circle cx="132" cy="128" r="6" fill="#f1f5f9" stroke="#64748b" />
            <circle cx="118" cy="100" r="3.5" fill="#fff" />
            <circle cx="132" cy="94" r="4" fill="#fff" />
            <path d="M135 42 V24 H295 V116" fill="none" stroke="#475569" strokeWidth="3" />
            <rect x="268" y="54" width="60" height="84" rx="10" fill="#e2e8f0" stroke="#0284c7" strokeWidth="2" />
            <text x="210" y="158" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0f766e">
              حمض + ملح كربونات (مثل قشر البيض أو الرخام CaCO3) ← فوران وتصاعد CO2 يعكر ماء الجير
            </text>
          </svg>
        </div>
      )}

      {tab === 'acidrain' && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-200">شدة انبعاث SO2 و NO2 من المصانع: {rainLevel}%</span>
            <input
              type="range"
              min={10}
              max={100}
              value={rainLevel}
              onChange={(e) => setRainLevel(Number(e.target.value))}
              className="w-40 accent-amber-600"
            />
          </div>
          <div className="rounded-2xl border border-amber-200/80 dark:border-slate-700 bg-amber-50/70 dark:bg-slate-950 p-3">
            <svg viewBox="0 0 420 175" className="w-full h-auto max-h-[195px]">
              {/* المصنع */}
              <rect x="38" y="102" width="54" height="44" fill="#475569" />
              <rect x="52" y="72" width="12" height="30" fill="#334155" />
              <path d="M58 70 Q80 42 125 46" stroke="#94a3b8" strokeWidth={2 + rainLevel / 25} strokeDasharray="4 4" fill="none" />
              {/* سحابة المطر الحمضي */}
              <ellipse cx="220" cy="48" rx="68" ry="22" fill={rainLevel > 55 ? '#64748b' : '#94a3b8'} />
              {[180, 210, 240, 265].map((x) => (
                <line key={x} x1={x} y1="74" x2={x - 6} y2="118" stroke="#f59e0b" strokeWidth="2.2" strokeDasharray="5 4" />
              ))}
              {/* شجرة + عمود رخامي يتأثران */}
              <rect x="190" y="114" width="22" height="34" fill="#cbd5e1" stroke="#64748b" />
              <circle cx="315" cy="116" r="22" fill={rainLevel > 60 ? '#ca8a04' : '#22c55e'} />
              <rect x="311" y="132" width="8" height="18" fill="#78350f" />
              <text x="210" y="166" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#9a3412">
                تتحد أكاسيد الكبريت والنيتروجين مع بخار الماء مكونة مطراً حمضياً يؤذي النبات والرخام والتربة
              </text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

/* 3. الإنسان والفضاء الكوني (الوحدة 4: u4-l1 و u4-l2) */
export const SpaceAndUniverse2DSim: React.FC<{ variant: 'universe' | 'rockets' }> = ({ variant }) => {
  const [tick, setTick] = useState<number>(0);
  const [stage, setStage] = useState<number>(65);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % 360), 50);
    return () => window.clearInterval(id);
  }, []);

  if (variant === 'universe') {
    const planets = [
      { name: 'عطارد', r: 28, size: 3.5, color: '#94a3b8', speed: 2.2 },
      { name: 'الزهرة', r: 42, size: 4.5, color: '#facc15', speed: 1.5 },
      { name: 'الأرض', r: 58, size: 5.5, color: '#0ea5e9', speed: 1.1 },
      { name: 'المريخ', r: 74, size: 4.2, color: '#ef4444', speed: 0.85 },
      { name: 'المشتري', r: 96, size: 8.5, color: '#f59e0b', speed: 0.5 },
    ];
    return (
      <div className="rounded-2xl border border-indigo-200/80 dark:border-slate-700 bg-slate-950 p-3">
        <svg viewBox="0 0 420 225" className="w-full h-auto max-h-[245px]">
          <circle cx="210" cy="108" r="16" fill="#fde047" />
          <text x="210" y="112" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#78350f">الشمس</text>
          {planets.map((p) => {
            const ang = (tick * p.speed * Math.PI) / 180;
            const px = 210 + Math.cos(ang) * p.r;
            const py = 108 + Math.sin(ang) * (p.r * 0.72);
            return (
              <g key={p.name}>
                <ellipse cx="210" cy="108" rx={p.r} ry={p.r * 0.72} fill="none" stroke="#334155" strokeWidth="1" />
                <circle cx={px} cy={py} r={p.size} fill={p.color} />
              </g>
            );
          })}
          <text x="210" y="214" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#38bdf8">
            وحدة بناء الكون هي المجموعة الشمسية، ومجرتنا تُسمى مجرة درب التبانة
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <Rocket className="w-4 h-4 text-indigo-600" />
          <span>مراحل انطلاق الصاروخ الفضائي إلى المدار: {stage}%</span>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={stage}
          onChange={(e) => setStage(Number(e.target.value))}
          className="w-44 accent-indigo-600"
        />
      </div>
      <div className="rounded-2xl border border-indigo-200/80 dark:border-slate-700 bg-slate-950 p-3">
        <svg viewBox="0 0 420 185" className="w-full h-auto max-h-[205px]">
          <path d="M20 155 Q210 120 400 155" fill="#0284c7" opacity="0.45" />
          {/* الصاروخ يتحرك مع الشريط */}
          <g transform={`translate(${65 + stage * 2.5}, ${135 - Math.sin((stage / 100) * Math.PI * 0.65) * 95}) rotate(${25 + stage * 0.45})`}>
            <polygon points="0,-16 8,8 -8,8" fill="#f8fafc" />
            <rect x="-6" y="8" width="12" height="16" fill="#0ea5e9" />
            {stage < 90 && <polygon points="-4,24 4,24 0,38" fill="#f97316" />}
          </g>
          {/* قمر صناعي في المدار */}
          {stage > 75 && (
            <g transform="translate(345, 48)">
              <rect x="-12" y="-4" width="24" height="8" fill="#38bdf8" />
              <circle cx="0" cy="0" r="5" fill="#fde047" />
            </g>
          )}
          <text x="210" y="176" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#cbd5e1">
            {stage < 35
              ? '1. الإقلاع: احتراق الوقود يولد دفعاً وفق قانون نيوتن الثالث (لكل فعل رد فعل)'
              : stage < 75
              ? '2. انفصال المرحلة الأولى لتخفيف الوزن ومواصلة الصعود'
              : '3. استقرار القمر الصناعي في مداره لخدمة الاتصالات والأرصاد والاستشعار عن بُعد'}
          </text>
        </svg>
      </div>
    </div>
  );
};

/* 4. الهالوجينات وجهاز تحضير غاز الكلور Cl2 (الوحدة 10: u10-l1, u10-l3) */
export const HalogensAndChlorine2DSim: React.FC<{ variant: 'halogens' | 'chlorine' }> = ({ variant }) => {
  const [purifierOn, setPurifierOn] = useState<boolean>(true);

  if (variant === 'halogens') {
    const items = [
      { sym: 'F2', name: 'الفلور', state: 'غاز أصفر باهت', color: '#fef08a', note: 'الأنشط كيميائياً' },
      { sym: 'Cl2', name: 'الكلور', state: 'غاز أصفر مخضر', color: '#bef264', note: 'يُستخدم للتعقيم والتبييض' },
      { sym: 'Br2', name: 'البروم', state: 'سائل بني محمر', color: '#b45309', note: 'اللافلز السائل الوحيد' },
      { sym: 'I2', name: 'اليود', state: 'صلب رمادي/بنفسجي', color: '#6b21a8', note: 'يتسامى بالتسخين' },
    ];
    return (
      <div className="rounded-2xl border border-lime-200/80 dark:border-slate-700 bg-lime-50/65 dark:bg-slate-950 p-3">
        <svg viewBox="0 0 460 175" className="w-full h-auto max-h-[200px]">
          {items.map((h, i) => {
            const x = 58 + i * 102;
            return (
              <g key={h.sym}>
                <rect x={x - 24} y="24" width="48" height="86" rx="14" fill={h.color} opacity="0.72" stroke="#334155" strokeWidth="2" />
                <text x={x} y="62" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0f172a">{h.sym}</text>
                <text x={x} y="128" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0f766e">{h.name}</text>
                <text x={x} y="144" textAnchor="middle" fontSize="9" fill="#334155">{h.state}</text>
                <text x={x} y="159" textAnchor="middle" fontSize="8.5" fill="#64748b">{h.note}</text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <FlaskConical className="w-4 h-4 text-lime-700" />
          <span>جهاز تحضير غاز الكلور Cl₂ مخبرياً (تنقية بالماء + تجفيف بـ H₂SO₄):</span>
        </span>
        <button
          type="button"
          onClick={() => setPurifierOn((p) => !p)}
          className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer text-white ${
            purifierOn ? 'bg-teal-700' : 'bg-amber-600'
          }`}
        >
          {purifierOn ? 'تفعيل التنقية والتجفيف (نقي جاف)' : 'بدون تنقية وتجفيف (تظهر شوائب)'}
        </button>
      </div>

      <div className="rounded-2xl border border-lime-200/80 dark:border-slate-700 bg-lime-50/65 dark:bg-slate-950 p-3">
        <svg viewBox="0 0 470 205" className="w-full h-auto max-h-[230px]">
          {/* 1. دورق التفاعل MnO2 + 4HCl + تسخين */}
          <path d="M48 56 H76 L98 138 H26 Z" fill="#bef264" opacity="0.55" stroke="#365314" strokeWidth="2.2" strokeLinejoin="round" />
          <rect x="46" y="46" width="32" height="10" rx="3" fill="#475569" />
          <path d="M52 150 Q62 136 72 150 Q62 158 52 150 Z" fill="#f97316" />
          <text x="62" y="172" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#365314">MnO2 + 4HCl + Δ</text>

          {/* 2. قارورة الماء (تنقية من HCl - أنبوب دخول طويل مغمور بالماء وأنبوب خروج قصير) */}
          <rect x="136" y="60" width="60" height="78" rx="10" fill="#f8fafc" stroke="#0284c7" strokeWidth="2" />
          <rect x="138" y="92" width="56" height="44" rx="6" fill="#bae6fd" />
          <rect x="148" y="52" width="36" height="8" rx="2" fill="#475569" />
          <path d="M68 46 V28 H156 V126" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="156" cy="114" r="2.8" fill="#ffffff" />
          <circle cx="161" cy="102" r="2.5" fill="#ffffff" />
          <text x="166" y="158" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0369a1">1) الماء (امتصاص HCl)</text>

          {/* 3. قارورة حمض الكبريتيك المركز (تجفيف - أنبوب طويل مغمور بالحمض) */}
          <rect x="248" y="60" width="60" height="78" rx="10" fill="#f8fafc" stroke="#ca8a04" strokeWidth="2" />
          <rect x="250" y="92" width="56" height="44" rx="6" fill="#fef08a" />
          <rect x="260" y="52" width="36" height="8" rx="2" fill="#475569" />
          <path d="M178 72 V28 H268 V126" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="268" cy="114" r="2.8" fill="#ffffff" />
          <circle cx="273" cy="102" r="2.5" fill="#ffffff" />
          <text x="278" y="158" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#854d0e">2) H2SO4 مركز (تجفيف)</text>

          {/* 4. مخبار جمع الكلور بالإزاحة العلوية للهواء */}
          <path d="M290 72 V28 H398 V124" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="366" y="62" width="64" height="78" rx="8" fill={purifierOn ? '#d9f99d' : '#fca5a5'} opacity="0.7" stroke="#4d7c0f" strokeWidth="2.2" />
          <text x="398" y="158" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#365314">
            {purifierOn ? 'Cl2 نقي وجاف' : 'غاز مختلط بشوائب'}
          </text>
        </svg>
      </div>
    </div>
  );
};

/* 5. الطاقة الشمسية: السخان الحراري + الدائرة الكهربائية للخلية الشمسية (الوحدة 13) */
export const SolarEnergyCircuits2DSim: React.FC<{ variant: 'thermal' | 'pv-circuit' }> = ({ variant }) => {
  const [sunIntensity, setSunIntensity] = useState<number>(80);

  if (variant === 'thermal') {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>شدة الإشعاع الشمسي على المجمع الحراري: {sunIntensity}%</span>
          </span>
          <input type="range" min={10} max={100} value={sunIntensity} onChange={(e) => setSunIntensity(Number(e.target.value))} className="w-40 accent-amber-500" />
        </div>
        <div className="rounded-2xl border border-amber-200/80 dark:border-slate-700 bg-sky-50/75 dark:bg-slate-950 p-3">
          <svg viewBox="0 0 420 185" className="w-full h-auto max-h-[205px]">
            <circle cx="56" cy="36" r="18" fill="#facc15" opacity={0.4 + sunIntensity / 160} />
            <line x1="78" y1="46" x2="175" y2="96" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" />
            <line x1="88" y1="34" x2="215" y2="92" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" />
            {/* المجمع الشمسي المائل */}
            <polygon points="120,128 245,86 270,118 145,158" fill="#1e293b" stroke="#94a3b8" strokeWidth="3" />
            {/* خزان الماء المعزول أعلى المجمع */}
            <rect x="275" y="42" width="96" height="48" rx="14" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
            <path d="M245 86 H275" stroke="#dc2626" strokeWidth="4" />
            <path d="M275 76 H252 L145 135" fill="none" stroke="#0284c7" strokeWidth="3" />
            <text x="323" y="70" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#b91c1c">
              ماء ساخن ({Math.round(25 + sunIntensity * 0.55)}°م)
            </text>
            <text x="210" y="176" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0f766e">
              يمتص السطح الأسود الإشعاع فيسخن الماء ويصعد تلقائياً بالحمل الحراري إلى الخزان
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
          <Sun className="w-4 h-4 text-amber-500" />
          <span>الدائرة الكهربائية للخلية الشمسية (شدة الضوء: {sunIntensity}%)</span>
        </span>
        <input type="range" min={0} max={100} value={sunIntensity} onChange={(e) => setSunIntensity(Number(e.target.value))} className="w-40 accent-amber-500" />
      </div>
      <div className="rounded-2xl border border-amber-200/80 dark:border-slate-700 bg-sky-50/75 dark:bg-slate-950 p-3">
        <svg viewBox="0 0 460 190" className="w-full h-auto max-h-[210px]">
          {/* شمس + أشعة */}
          <circle cx="54" cy="36" r="18" fill="#fde047" opacity={0.3 + sunIntensity / 140} />
          <line x1="72" y1="44" x2="112" y2="80" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 3" />
          {/* لوح الخلايا الشمسية */}
          <polygon points="48,92 150,74 166,118 64,136" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="2.5" />
          <text x="108" y="152" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#1e40af">خلية شمسية (سيليكون)</text>

          {/* أسلاك + بطارية + مصباح */}
          <path d="M158 96 H244 V64 H348" fill="none" stroke="#d97706" strokeWidth="3" />
          <path d="M158 118 H366 V98" fill="none" stroke="#0284c7" strokeWidth="3" />
          <rect x="220" y="90" width="52" height="36" rx="5" fill="#1e293b" />
          <text x="246" y="112" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="bold">منظم وبطارية</text>

          <circle cx="366" cy="76" r={18 + (sunIntensity / 100) * 10} fill="#fef08a" opacity={(sunIntensity / 100) * 0.55} />
          <circle cx="366" cy="76" r="16" fill={sunIntensity > 20 ? '#fde047' : '#cbd5e1'} stroke="#b45309" strokeWidth="2" />
          <text x="230" y="178" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0f766e">
            تحول الخلايا الكهروضوئية ضوء الشمس مباشرة إلى تيار كهربائي مستمر (DC) يضيء المصباح ويشحن البطارية
          </text>
        </svg>
      </div>
    </div>
  );
};

/* 6. الوراثة: مربع بانيت وتحديد الجنس وزواج الأقارب (الوحدة 16) */
export const Genetics2DSim: React.FC<{ focus?: 'general' | 'consanguinity' | 'mutations' }> = ({
  focus = 'general',
}) => {
  const [parent1, setParent1] = useState<'Tt' | 'TT'>('Tt');
  const [parent2, setParent2] = useState<'Tt' | 'tt'>(focus === 'consanguinity' ? 'Tt' : 'Tt');

  const alleles1 = parent1 === 'Tt' ? ['T', 't'] : ['T', 'T'];
  const alleles2 = parent2 === 'Tt' ? ['T', 't'] : ['t', 't'];
  const grid = alleles1.flatMap((a1) => alleles2.map((a2) => (a1 === 'T' || a2 === 'T' ? (a1 === 'T' && a2 === 'T' ? 'TT' : 'Tt') : 'tt')));
  const recessiveCount = grid.filter((g) => g === 'tt').length;

  return (
    <div className="space-y-3">
      {focus === 'consanguinity' && (
        <div className="rounded-xl bg-amber-50/85 dark:bg-amber-950/35 border border-amber-300/70 dark:border-amber-800 px-3 py-2 text-xs text-amber-950 dark:text-amber-100">
          <strong>زواج الأقارب (الوحدة 16 - الدرس 2):</strong> تزداد احتمالية أن يحمل كلا الزوجين القريبين نفس الأليل المتنحي للمرض (Tt × Tt)، فيظهر المرض الوراثي بنسبة 25% في الأبناء!
        </div>
      )}
      {focus === 'mutations' && (
        <div className="rounded-xl bg-indigo-50/85 dark:bg-indigo-950/35 border border-indigo-300/70 dark:border-indigo-800 px-3 py-2 text-xs text-indigo-950 dark:text-indigo-100">
          <strong>الطفرات والأمراض الوراثية:</strong> تغيّر مفاجئ في تركيب الكروموسوم أو الجين (كالأشعة أو الكيماويات) قد يورّث صفة أو مرضاً مثل فقر الدم المنجلي والهيموفيليا.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setParent1('Tt');
              setParent2('Tt');
            }}
            className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              parent1 === 'Tt' && parent2 === 'Tt'
                ? 'bg-emerald-700 text-white'
                : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            تزاوج حاملين (Tt × Tt) — نسبة 3:1
          </button>
          <button
            type="button"
            onClick={() => {
              setParent1('Tt');
              setParent2('tt');
            }}
            className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              parent1 === 'Tt' && parent2 === 'tt'
                ? 'bg-amber-600 text-white'
                : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            تزاوج حامل × مصاب/متنحي (Tt × tt) — 50%
          </button>
          <button
            type="button"
            onClick={() => {
              setParent1('TT');
              setParent2('tt');
            }}
            className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              parent1 === 'TT'
                ? 'bg-teal-700 text-white'
                : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            نقي سائد × متنحي (TT × tt) — 100% سائد
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-200/80 dark:border-slate-700 bg-emerald-50/65 dark:bg-slate-950 p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto text-center text-xs font-mono-num">
          <div className="p-2 font-bold text-slate-500">الأمشاج</div>
          <div className="rounded-lg bg-sky-100 dark:bg-sky-900/50 p-2 font-extrabold">{alleles2[0]}</div>
          <div className="rounded-lg bg-sky-100 dark:bg-sky-900/50 p-2 font-extrabold">{alleles2[1]}</div>

          <div className="rounded-lg bg-rose-100 dark:bg-rose-900/50 p-2 font-extrabold">{alleles1[0]}</div>
          <div className={`rounded-lg p-2.5 font-extrabold border ${grid[0] === 'tt' ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-400 text-amber-900 dark:text-amber-100' : 'bg-white dark:bg-slate-800 border-emerald-300'}`}>
            {grid[0]}
          </div>
          <div className={`rounded-lg p-2.5 font-extrabold border ${grid[1] === 'tt' ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-400 text-amber-900 dark:text-amber-100' : 'bg-white dark:bg-slate-800 border-emerald-300'}`}>
            {grid[1]}
          </div>

          <div className="rounded-lg bg-rose-100 dark:bg-rose-900/50 p-2 font-extrabold">{alleles1[1]}</div>
          <div className={`rounded-lg p-2.5 font-extrabold border ${grid[2] === 'tt' ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-400 text-amber-900 dark:text-amber-100' : 'bg-white dark:bg-slate-800 border-emerald-300'}`}>
            {grid[2]}
          </div>
          <div className={`rounded-lg p-2.5 font-extrabold border ${grid[3] === 'tt' ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-400 text-amber-900 dark:text-amber-100' : 'bg-white dark:bg-slate-800 border-emerald-300'}`}>
            {grid[3]}
          </div>
        </div>

        <div className="text-center text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            نسبة ظهور الصفة السائدة: {((4 - recessiveCount) / 4) * 100}% · نسبة الصفة/المرض المتنحي (tt):{' '}
            {(recessiveCount / 4) * 100}%
          </span>
        </div>
      </div>
    </div>
  );
};
