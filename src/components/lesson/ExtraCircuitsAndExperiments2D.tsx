import React, { useEffect, useState } from 'react';
import { BatteryCharging, Bell, Flame, FlaskConical, Hammer, Magnet, Power, Zap } from 'lucide-react';

/* 1. الدائرة الكهربائية لتوصيل المحاليل الكيميائية (الوحدة 2: u2-l1 / u2-l2) */
export const ElectrolyteCircuit2DSim: React.FC = () => {
  const [solution, setSolution] = useState<'hcl' | 'naoh' | 'vinegar' | 'water'>('hcl');
  const [switchClosed, setSwitchClosed] = useState<boolean>(true);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % 100), 60);
    return () => window.clearInterval(id);
  }, []);

  const meta = {
    hcl: {
      label: 'حمض الهيدروكلوريك (HCl قوي)',
      brightness: 1,
      ammeterDeg: 52,
      cation: 'H+',
      anion: 'Cl-',
      note: 'تأين تام! الأيونات الحرة وفيرة فتغلق الدائرة بتيار قوي ويضيء المصباح بشدة.',
    },
    naoh: {
      label: 'هيدروكسيد الصوديوم (NaOH قوي)',
      brightness: 0.95,
      ammeterDeg: 48,
      cation: 'Na+',
      anion: 'OH-',
      note: 'قلوي قوي تام التأين! تتجه أيونات Na+ للمهبط و OH- للمصعد ويضيء المصباح بشدة.',
    },
    vinegar: {
      label: 'حمض الخل (CH3COOH ضعيف)',
      brightness: 0.28,
      ammeterDeg: 14,
      cation: 'H+',
      anion: 'CH3COO-',
      note: 'تأين جزئي (إلكتروليت ضعيف): عدد الأيونات قليل فتكون إضاءة المصباح خافتة.',
    },
    water: {
      label: 'ماء مقطر / محلول سكري',
      brightness: 0,
      ammeterDeg: -45,
      cation: '',
      anion: '',
      note: 'لا يتأين إلى أيونات حرة! لا يمر تيار كهربائي ويبقى المصباح منطفئاً تماماً.',
    },
  }[solution];

  const effectiveBright = switchClosed ? meta.brightness : 0;
  const effectiveNeedle = switchClosed ? meta.ammeterDeg : -45;
  const ionShift = ((tick % 50) / 50) * 32;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: 'hcl', label: 'حمض قوي HCl' },
              { id: 'naoh', label: 'قاعدة قوية NaOH' },
              { id: 'vinegar', label: 'حمض ضعيف (خل)' },
              { id: 'water', label: 'ماء مقطر' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSolution(item.id)}
              className={`rounded-xl px-2.5 py-1.5 font-bold cursor-pointer ${
                solution === item.id
                  ? 'bg-teal-700 text-white'
                  : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSwitchClosed((s) => !s)}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
            switchClosed ? 'bg-amber-600 text-white' : 'bg-slate-600 text-white'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{switchClosed ? 'المفتاح مغلق (تيار متصل)' : 'المفتاح مفتوح (مقطوع)'}</span>
        </button>
      </div>

      <div className="rounded-2xl border border-teal-200/80 dark:border-slate-700 bg-sky-50/75 dark:bg-slate-950 p-3">
        <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
          {/* البطارية */}
          <rect x="38" y="34" width="44" height="36" rx="5" fill="#1e293b" />
          <rect x="46" y="28" width="10" height="6" fill="#dc2626" />
          <rect x="66" y="28" width="10" height="6" fill="#2563eb" />
          <text x="60" y="57" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fff">
            بطارية
          </text>

          {/* الأسلاك */}
          <path d="M51 28 V16 H145" fill="none" stroke="#d97706" strokeWidth="3" />
          {/* المفتاح */}
          <circle cx="145" cy="16" r="3.5" fill="#0f172a" />
          <circle cx="188" cy="16" r="3.5" fill="#0f172a" />
          <line
            x1="145"
            y1="16"
            x2={switchClosed ? 188 : 180}
            y2={switchClosed ? 16 : 3}
            stroke="#dc2626"
            strokeWidth="3"
          />

          {/* سلك للمصباح */}
          <path d="M188 16 H252 V34" fill="none" stroke="#d97706" strokeWidth="3" />
          {/* المصباح */}
          <circle
            cx="266"
            cy="46"
            r={18 + effectiveBright * 10}
            fill="#fef08a"
            opacity={effectiveBright * 0.48}
          />
          <circle
            cx="266"
            cy="46"
            r="16"
            fill={effectiveBright > 0.6 ? '#fde047' : effectiveBright > 0.1 ? '#fef9c3' : '#e2e8f0'}
            stroke="#b45309"
            strokeWidth="2"
          />
          <text x="266" y="24" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#854d0e">
            المصباح
          </text>

          {/* الأميتر */}
          <path d="M282 46 H356" fill="none" stroke="#d97706" strokeWidth="3" />
          <circle cx="378" cy="46" r="22" fill="#fff" stroke="#334155" strokeWidth="2.5" />
          <line
            x1="378"
            y1="46"
            x2={378 + Math.sin((effectiveNeedle * Math.PI) / 180) * 15}
            y2={46 - Math.cos((effectiveNeedle * Math.PI) / 180) * 15}
            stroke="#dc2626"
            strokeWidth="2.2"
          />
          <text x="378" y="61" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0f172a">
            A
          </text>

          {/* أسلاك الأقطاب */}
          <path d="M400 46 H416 V118 H292 V155" fill="none" stroke="#dc2626" strokeWidth="2.8" />
          <path d="M71 28 V118 H186 V155" fill="none" stroke="#2563eb" strokeWidth="2.8" />

          {/* كأس المحلول */}
          <path d="M152 108 V192 Q152 200 162 200 H318 Q328 200 328 192 V108" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2.5" />
          <rect x="155" y="128" width="170" height="70" rx="6" fill="#38bdf8" opacity="0.35" />

          {/* أقطاب الغرافيت */}
          <rect x="180" y="114" width="12" height="74" rx="3" fill="#1e293b" />
          <rect x="286" y="114" width="12" height="74" rx="3" fill="#1e293b" />
          <text x="186" y="106" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#2563eb">
            مهبط (-)
          </text>
          <text x="292" y="106" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#dc2626">
            مصعد (+)
          </text>

          {/* الأيونات المتحركة عند الإغلاق */}
          {meta.cation && (
            <g>
              <circle cx={238 - (switchClosed ? ionShift : 0)} cy="150" r="9" fill="#2563eb" />
              <text x={238 - (switchClosed ? ionShift : 0)} y="153" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="bold">
                {meta.cation}
              </text>
              <circle cx={240 + (switchClosed ? ionShift : 0)} cy="176" r="10" fill="#dc2626" />
              <text x={240 + (switchClosed ? ionShift : 0)} y="179" textAnchor="middle" fontSize="7.5" fill="#fff" fontWeight="bold">
                {meta.anion}
              </text>
            </g>
          )}

          <text x="230" y="215" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0f766e">
            {meta.note}
          </text>
        </svg>
      </div>
    </div>
  );
};

/* 2. طرق التمغنط الثلاث + الدائرة الكهربائية للتمغنط بالتيار (u5-l1) */
export const MagnetizationMethods2DSim: React.FC = () => {
  const [method, setMethod] = useState<'circuit' | 'stroke'>('circuit');
  const [circuitOn, setCircuitOn] = useState<boolean>(true);
  const [currentLevel, setCurrentLevel] = useState<number>(3); // 1..4
  const [stroked, setStroked] = useState<boolean>(false);

  const clipsAttracted = method === 'circuit' && circuitOn ? currentLevel : 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setMethod('circuit')}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              method === 'circuit'
                ? 'bg-sky-700 text-white'
                : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>دائرة التمغنط بالتيار الكهربائي</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('stroke')}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              method === 'stroke'
                ? 'bg-sky-700 text-white'
                : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Magnet className="w-3.5 h-3.5" />
            <span>التمغنط بالدلك والتأثير</span>
          </button>
        </div>

        {method === 'circuit' ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCircuitOn((v) => !v)}
              className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer text-white ${
                circuitOn ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              {circuitOn ? 'فتح المفتاح (إزالة المغناطيسية)' : 'إغلاق المفتاح (تمغنط)'}
            </button>
            <label className="flex items-center gap-1.5">
              <span>شدة التيار:</span>
              <input
                type="range"
                min={1}
                max={4}
                value={currentLevel}
                onChange={(e) => setCurrentLevel(Number(e.target.value))}
                className="w-24 accent-sky-600"
              />
            </label>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setStroked((s) => !s)}
            className="rounded-xl bg-teal-700 hover:bg-teal-800 px-3 py-1.5 font-bold text-white cursor-pointer"
          >
            {stroked ? 'إعادة خلط المجالات (قبل الدلك)' : 'مرّر المغناطيس في اتجاه واحد (دلك)'}
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-sky-200/80 dark:border-slate-700 bg-sky-50/75 dark:bg-slate-950 p-3">
        {method === 'circuit' ? (
          <svg viewBox="0 0 460 200" className="w-full h-auto max-h-[220px]">
            {/* البطارية */}
            <rect x="38" y="48" width="46" height="44" rx="5" fill="#1e293b" />
            <text x="61" y="74" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">
              DC {currentLevel * 3}V
            </text>
            {/* الدائرة */}
            <path d="M61 48 V26 H148" fill="none" stroke="#d97706" strokeWidth="3" />
            <circle cx="148" cy="26" r="3.5" fill="#0f172a" />
            <circle cx="188" cy="26" r="3.5" fill="#0f172a" />
            <line x1="148" y1="26" x2={circuitOn ? 188 : 180} y2={circuitOn ? 26 : 12} stroke="#dc2626" strokeWidth="3" />
            <path d="M188 26 H340 V92 H290" fill="none" stroke="#d97706" strokeWidth="3" />
            <path d="M61 92 V130 H188 V98" fill="none" stroke="#d97706" strokeWidth="3" />

            {/* مسمار الحديد المطاوع + الملف اللولبي */}
            <rect x="176" y="76" width="128" height="22" rx="4" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
            {[194, 208, 222, 236, 250, 264, 278].map((x) => (
              <rect key={x} x={x} y="72" width="7" height="30" rx="3" fill="#b45309" />
            ))}
            <text x="240" y="64" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0369a1">
              ملف لولبي حول قلب حديد مطاوع
            </text>

            {/* مشابك ورقية تنجذب حسب شدة التيار */}
            {[0, 1, 2, 3].map((i) => {
              const attached = i < clipsAttracted;
              const cx = 198 + i * 26;
              const cy = attached ? 105 : 162;
              return (
                <rect
                  key={i}
                  x={cx}
                  y={cy}
                  width="9"
                  height="18"
                  rx="4"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2.5"
                />
              );
            })}

            <text x="230" y="192" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0f766e">
              {circuitOn
                ? `يمر التيار فيتمغنط المسمار ويجذب ${clipsAttracted} مشابك (مغناطيس مؤقت يزول بفتح المفتاح)`
                : 'المفتاح مفتوح: يفقد الحديد المطاوع مغناطيسيته فوراً وتسقط المشابك!'}
            </text>
          </svg>
        ) : (
          <svg viewBox="0 0 460 190" className="w-full h-auto max-h-[210px]">
            {/* المغناطيس الدالك فوق القضيب */}
            <g transform={stroked ? 'translate(290, 26) rotate(-12)' : 'translate(105, 26) rotate(-12)'}>
              <rect x="0" y="0" width="45" height="24" fill="#dc2626" />
              <rect x="45" y="0" width="45" height="24" fill="#2563eb" />
              <text x="22" y="16" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">N</text>
              <text x="67" y="16" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">S</text>
            </g>
            <path d="M135 45 H325" stroke="#0284c7" strokeWidth="2" strokeDasharray="5 4" />
            <text x="230" y="40" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0369a1">
              اتجاه الدلك الواحد ←
            </text>

            {/* القضيب الفولاذي والمجالات المغناطيسية الجزيئية */}
            <rect x="95" y="96" width="270" height="40" rx="6" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
            {[125, 165, 205, 245, 285, 325].map((x, idx) => {
              const angle = stroked ? 0 : [35, -140, 80, -45, 160, -110][idx];
              return (
                <g key={x} transform={`translate(${x}, 116) rotate(${angle})`}>
                  <line x1="-11" y1="0" x2="11" y2="0" stroke="#dc2626" strokeWidth="2.5" />
                  <polygon points="11,0 5,-4 5,4" fill="#dc2626" />
                </g>
              );
            })}
            <text x="230" y="170" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f766e">
              {stroked
                ? 'بعد الدلك في اتجاه واحد: تصطف المجالات المغناطيسية فيتكون قطب شمالي N وآخر جنوبي S'
                : 'قبل التمغنط: المجالات المغناطيسية الداخلية مبعثرة فيلغي بعضها بعضاً'}
            </text>
          </svg>
        )}
      </div>
    </div>
  );
};

/* 3. الدائرة الكهربائية للجرس الكهربائي (تُعرض داخل u5-l2) */
export const ElectricBellCircuit2DSim: React.FC = () => {
  const [pressed, setPressed] = useState<boolean>(true);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    if (!pressed) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % 2), 180);
    return () => window.clearInterval(id);
  }, [pressed]);

  const strike = pressed && tick === 1;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-amber-600" />
          <span>الدائرة الكهربائية للجرس الكهربائي (القطع والوصل الآلي):</span>
        </span>
        <button
          type="button"
          onClick={() => setPressed((p) => !p)}
          className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer text-white ${
            pressed ? 'bg-amber-600' : 'bg-slate-600'
          }`}
        >
          {pressed ? 'إفلات الزر (إيقاف الرنين)' : 'اضغط زر الجرس'}
        </button>
      </div>

      <div className="rounded-2xl border border-amber-200/80 dark:border-slate-700 bg-amber-50/75 dark:bg-slate-950 p-3">
        <svg viewBox="0 0 480 220" className="w-full h-auto max-h-[245px]">
          {/* البطارية + المفتاح الضاغط */}
          <rect x="30" y="144" width="52" height="36" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="38" y="138" width="10" height="6" fill="#dc2626" />
          <rect x="64" y="138" width="10" height="6" fill="#2563eb" />
          <text x="56" y="166" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">بطارية</text>

          {/* الأسلاك */}
          <path d="M43 138 V44 H126" fill="none" stroke="#d97706" strokeWidth="3" />
          <path d="M69 138 V162 H152" fill="none" stroke="#d97706" strokeWidth="3" />
          {/* مفتاح ضاغط */}
          <circle cx="152" cy="162" r="3.5" fill="#0f172a" />
          <circle cx="196" cy="162" r="3.5" fill="#0f172a" />
          <line x1="152" y1="162" x2="196" y2={pressed ? 162 : 146} stroke="#dc2626" strokeWidth="3.2" strokeLinecap="round" />
          <text x="174" y="179" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569">زر الجرس</text>
          <path d="M196 162 H296 V92" fill="none" stroke="#d97706" strokeWidth="3" />

          {/* قلب حديد مطاوع على شكل حرف U + ملفان */}
          <path d="M126 44 H196 V58 H142 V92 H196 V106 H126 Z" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
          {/* ملفات النحاس */}
          {[148, 158, 168, 178, 188].map((x) => (
            <g key={x}>
              <rect x={x} y="39" width="6" height="24" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="0.8" />
              <rect x={x} y="87" width="6" height="24" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="0.8" />
            </g>
          ))}
          <text x="166" y="126" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f766e">
            مغناطيس كهربائي (U)
          </text>

          {/* قاعدة ارتكاز + الرافعة المرنة من الحديد المطاوع + المطرقة */}
          <rect x="242" y="124" width="16" height="10" rx="2" fill="#334155" />
          <g transform={`translate(${strike ? -16 : 0}, 0)`}>
            <line x1="250" y1="124" x2="250" y2="52" stroke="#16a34a" strokeWidth="3" />
            <rect x="244" y="54" width="12" height="54" rx="3" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
            <line x1="250" y1="54" x2="314" y2="42" stroke="#334155" strokeWidth="3" />
            <circle cx="318" cy="41" r="8.5" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
          </g>

          {/* مسمار التلامس (ينفصل عند الانجذاب فتظهر شرارة صغيرة / فجوة) */}
          <path d="M296 92 H260" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
          <polygon points="260,87 253,92 260,97" fill="#0284c7" />
          {strike && <circle cx="253" cy="92" r="4" fill="#facc15" opacity="0.85" />}
          <text x="328" y="96" fontSize="9.5" fontWeight="bold" fill="#0369a1">مسمار التلامس</text>

          {/* الناقوس المعدني */}
          <path d="M336 18 A28 28 0 0 1 336 74 Z" fill="#fde047" stroke="#b45309" strokeWidth="2.5" />
          <path d="M342 26 A20 20 0 0 1 342 66" fill="none" stroke="#fef9c3" strokeWidth="2" />
          {strike && (
            <path d="M372 34 Q384 46 372 58 M382 26 Q398 46 382 66" fill="none" stroke="#dc2626" strokeWidth="2.2" />
          )}
          <text x="354" y="86" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#92400e">الناقوس</text>

          <text x="240" y="206" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#9a3412">
            {pressed
              ? strike
                ? 'ينجذب الحديد المطاوع فتطرق المطرقة الناقوس ← تنقطع الدائرة عند المسمار فترتد مجدداً!'
                : 'المسمار يغلق الدائرة ← يمر التيار فيجذب المغناطيس الرافعة!'
              : 'المفتاح مفتوح: لا يمر تيار ولا يجذب المغناطيس الرافعة.'}
          </text>
        </svg>
      </div>
    </div>
  );
};

/* 4. الدائرة الكهربائية للمحول الكهربائي AC مقابل بطارية DC (u5-l3) */
export const TransformerCircuit2DSim: React.FC = () => {
  const [sourceType, setSourceType] = useState<'ac' | 'dc'>('ac');
  const [n1, setN1] = useState<number>(200);
  const [n2, setN2] = useState<number>(600);
  const v1 = 12;
  const v2 = sourceType === 'ac' ? Number(((v1 * n2) / n1).toFixed(1)) : 0;
  const stepLabel =
    sourceType === 'dc'
      ? 'البطارية (DC) تعطي تياراً ثابتاً ← لا يتغير الفيض المغناطيسي ← الجهد الثانوي = 0 فولت!'
      : n2 > n1
      ? `محول رافع للجهد (ن2 > ن1): يزداد الجهد إلى ${v2} فولت`
      : n2 < n1
      ? `محول خافض للجهد (ن2 < ن1): ينخفض الجهد إلى ${v2} فولت`
      : `لفات متساوية: الجهد الناتج ${v2} فولت`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setSourceType('ac')}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              sourceType === 'ac' ? 'bg-teal-700 text-white' : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>مصدر تيار متردد (AC)</span>
          </button>
          <button
            type="button"
            onClick={() => setSourceType('dc')}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              sourceType === 'dc' ? 'bg-rose-700 text-white' : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <BatteryCharging className="w-3.5 h-3.5" />
            <span>بطارية تيار مستمر (DC) — مصيدة وزارية</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-1.5">
            <span>ن₁: {n1}</span>
            <input type="range" min={100} max={800} step={100} value={n1} onChange={(e) => setN1(Number(e.target.value))} className="w-20 accent-teal-600" />
          </label>
          <label className="flex items-center gap-1.5">
            <span>ن₂: {n2}</span>
            <input type="range" min={100} max={800} step={100} value={n2} onChange={(e) => setN2(Number(e.target.value))} className="w-20 accent-amber-600" />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-indigo-200/80 dark:border-slate-700 bg-indigo-50/75 dark:bg-slate-950 p-3">
        <svg viewBox="0 0 460 190" className="w-full h-auto max-h-[210px]">
          {/* مصدر الجهد الابتدائي */}
          <circle cx="58" cy="86" r="22" fill={sourceType === 'ac' ? '#0284c7' : '#334155'} />
          <text x="58" y="90" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">
            {sourceType === 'ac' ? 'AC ~' : 'DC + -'}
          </text>
          <text x="58" y="122" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">
            ج₁ = 12V
          </text>
          <path d="M80 72 H152 M80 100 H152" stroke="#d97706" strokeWidth="2.8" />

          {/* القلب الحديدي المقسم */}
          <rect x="152" y="42" width="156" height="88" rx="8" fill="none" stroke="#475569" strokeWidth="14" />
          {sourceType === 'ac' && (
            <rect x="152" y="42" width="156" height="88" rx="8" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 6" />
          )}
          <text x="230" y="30" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">
            قلب حديد مطاوع صفائحي
          </text>

          {/* الملف الابتدائي و الثانوي */}
          <rect x="142" y="58" width="20" height="56" rx="4" fill="#0d9488" />
          <text x="152" y="150" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f766e">
            ن₁ = {n1}
          </text>
          <rect x="298" y="58" width="20" height="56" rx="4" fill="#d97706" />
          <text x="308" y="150" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#b45309">
            ن₂ = {n2}
          </text>

          {/* المصباح الثانوي */}
          <path d="M318 72 H378 M318 100 H378" stroke="#d97706" strokeWidth="2.8" />
          <circle cx="398" cy="86" r="24" fill="#fef08a" opacity={v2 > 0 ? Math.min(0.65, v2 / 48) : 0} />
          <circle cx="398" cy="86" r="17" fill={v2 > 0 ? '#fde047' : '#cbd5e1'} stroke="#b45309" strokeWidth="2" />
          <text x="398" y="122" textAnchor="middle" fontSize="10" fontWeight="bold" fill={v2 > 0 ? '#0f766e' : '#dc2626'}>
            ج₂ = {v2}V
          </text>

          <text x="230" y="178" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill={sourceType === 'dc' ? '#dc2626' : '#0f766e'}>
            {stepLabel}
          </text>
        </svg>
      </div>
    </div>
  );
};

/* 5. النيفرون وترشيح البول (الوحدة 6: u6-l3) */
export const Nephron2DSim: React.FC = () => {
  const [stage, setStage] = useState<'filtration' | 'reabsorption' | 'urine'>('filtration');

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 text-xs">
        {(
          [
            { id: 'filtration', label: '1. الترشيح في محفظة بومان' },
            { id: 'reabsorption', label: '2. إعادة الامتصاص للدم' },
            { id: 'urine', label: '3. تجمع البول في القناة الجامعة' },
          ] as const
        ).map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStage(s.id)}
            className={`rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              stage === s.id
                ? 'bg-rose-700 text-white'
                : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-rose-200/80 dark:border-slate-700 bg-gradient-to-b from-rose-50/85 to-amber-50/55 dark:from-slate-950 dark:to-slate-900 p-3">
        <svg viewBox="0 0 540 250" className="w-full h-auto max-h-[280px]">
          {/* خط فاصل بين القشرة والنخاع */}
          <line x1="20" y1="126" x2="520" y2="126" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="5 4" />
          <text x="32" y="118" fontSize="10" fontWeight="bold" fill="#9f1239">منطقة القشرة</text>
          <text x="32" y="140" fontSize="10" fontWeight="bold" fill="#be123c">منطقة النخاع</text>

          {/* أنبوبة النيفرون الكاملة: محفظة بومان + الملتوية القريبة + التواء هنلي + الملتوية البعيدة + القناة الجامعة */}
          {/* محفظة بومان الهلالية (الكأسية) */}
          <path
            d="M114 52 C74 48, 66 108, 114 104 C132 102, 138 92, 152 90"
            fill="#fef3c7"
            stroke="#d97706"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* الأنبوبة الملتوية القريبة ثم التواء هنلي النازل والصاعد ثم الملتوية البعيدة */}
          <path
            d="M138 82 C164 62, 184 102, 208 78 C228 60, 232 114, 240 162 C245 198, 285 198, 290 162 C298 112, 310 62, 336 80 C358 96, 376 62, 412 72"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M138 82 C164 62, 184 102, 208 78 C228 60, 232 114, 240 162 C245 198, 285 198, 290 162 C298 112, 310 62, 336 80 C358 96, 376 62, 412 72"
            fill="none"
            stroke="#fef3c7"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* القناة الجامعة */}
          <path d="M412 48 V206" fill="none" stroke="#eab308" strokeWidth="16" strokeLinecap="round" />
          <path d="M412 48 V206" fill="none" stroke="#fef9c3" strokeWidth="8" strokeLinecap="round" />
          <path d="M388 116 L412 122 M388 158 L412 164" stroke="#eab308" strokeWidth="6" strokeLinecap="round" />

          {/* الشريان الوارد + الكبيبة الدموية + الشريان الصادر + شبكة الشعيرات المحيطة بالتواء هنلي */}
          <path d="M36 68 H82" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
          {/* الكبيبة (عقدة شعيرات داخل محفظة بومان) */}
          <path
            d="M82 68 C94 56, 114 64, 102 78 C90 90, 118 92, 114 74 C110 62, 92 78, 88 86"
            fill="none"
            stroke="#dc2626"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* الصادر الملتف حول الأنابيب ثم يتصل بالوريد */}
          <path
            d="M88 86 C100 118, 178 110, 212 106 C248 102, 224 180, 265 180 C306 180, 282 102, 326 106 C362 110, 366 150, 366 200"
            fill="none"
            stroke="#ef4444"
            strokeWidth="3.2"
            strokeDasharray={stage === 'reabsorption' ? 'none' : '0'}
            opacity="0.88"
          />
          <path d="M366 158 V208" stroke="#2563eb" strokeWidth="5.5" strokeLinecap="round" />

          {/* حركة الجزيئات حسب المرحلة المختارة */}
          {stage === 'filtration' && (
            <g>
              <circle cx="118" cy="76" r="4.5" fill="#2563eb" />
              <circle cx="128" cy="84" r="4.5" fill="#16a34a" />
              <circle cx="136" cy="76" r="4" fill="#ca8a04" />
              <text x="132" y="42" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#dc2626">
                الكبيبة: ترشيح الماء والجلوكوز والأملاح واليوريا
              </text>
            </g>
          )}
          {stage === 'reabsorption' && (
            <g>
              <path d="M196 86 Q198 110 176 112" stroke="#16a34a" strokeWidth="2.8" fill="none" />
              <polygon points="176,112 183,108 183,116" fill="#16a34a" />
              <circle cx="192" cy="96" r="4.5" fill="#16a34a" />
              <path d="M244 166 Q256 176 264 176" stroke="#2563eb" strokeWidth="2.5" fill="none" />
              <circle cx="256" cy="174" r="4" fill="#2563eb" />
              <text x="190" y="136" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#15803d">
                امتصاص 100% من الجلوكوز ومعظم الماء للدم
              </text>
            </g>
          )}
          {stage === 'urine' && (
            <g>
              <circle r="4.5" fill="#ca8a04">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M412,68 L412,202" />
              </circle>
              <circle r="4" fill="#b45309">
                <animateMotion dur="2.2s" begin="1.1s" repeatCount="indefinite" path="M412,68 L412,202" />
              </circle>
              <text x="458" y="196" fontSize="9.5" fontWeight="bold" fill="#a16207">
                نحو حوض الكلية ↓
              </text>
            </g>
          )}

          {/* التسميات التشريحية الواضحة */}
          <text x="102" y="28" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#9f1239">
            محفظة بومان والكبيبة
          </text>
          <text x="200" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#b45309">
            أنبوبة ملتوية قريبة
          </text>
          <text x="265" y="216" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#b45309">
            التواء هنلي
          </text>
          <text x="342" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#b45309">
            أنبوبة ملتوية بعيدة
          </text>
          <text x="412" y="34" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0f766e">
            القناة الجامعة
          </text>

          <text x="270" y="238" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#881337">
            {stage === 'filtration'
              ? '1) يرتشح الماء والأملاح والجلوكوز واليوريا، وتبقى كريات الدم والبروتينات الكبيرة بالدم'
              : stage === 'reabsorption'
              ? '2) يعيد النيفرون امتصاص الجلوكوز كاملاً ومعظم الماء والأملاح النافعة إلى الشعيرات الدموية'
              : '3) يتجه السائل المتبقي (ماء + يوريا + أملاح زائدة) عبر القناة الجامعة إلى حوض الكلية'}
          </text>
        </svg>
      </div>
    </div>
  );
};

/* 6. احتراق الأكاسيد + تحضير CO2 مخبرياً (الوحدة 9: u9-l1 و u9-l4) */
export const OxidesAndCO2Prep2DSim: React.FC<{ variant: 'oxides' | 'co2-prep' }> = ({ variant }) => {
  const [oxideType, setOxideType] = useState<'mg' | 's'>('mg');
  const [acidType, setAcidType] = useState<'hcl' | 'h3po4'>('hcl');
  const [limeTurbid, setLimeTurbid] = useState<boolean>(true);

  if (variant === 'oxides') {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setOxideType('mg')}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              oxideType === 'mg' ? 'bg-blue-700 text-white' : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>احتراق المغنيسيوم Mg (أكسيد فلزي قاعدي)</span>
          </button>
          <button
            type="button"
            onClick={() => setOxideType('s')}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              oxideType === 's' ? 'bg-rose-700 text-white' : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>احتراق الكبريت S (أكسيد لافلزي حمضي)</span>
          </button>
        </div>
        <div className="rounded-2xl border border-amber-200/80 dark:border-slate-700 bg-amber-50/75 dark:bg-slate-950 p-3">
          <svg viewBox="0 0 460 185" className="w-full h-auto max-h-[205px]">
            {/* مخبار الاحتراق */}
            <rect x="65" y="32" width="110" height="106" rx="10" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2.2" />
            <circle cx="120" cy="88" r="18" fill={oxideType === 'mg' ? '#fef9c3' : '#38bdf8'} opacity="0.85" />
            <text x="120" y="155" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0369a1">
              {oxideType === 'mg' ? 'لهب أبيض ساطع ← MgO' : 'لهب أزرق باهت ← SO2'}
            </text>

            {/* كأس المحلول وورقة دوار الشمس */}
            <rect x="275" y="48" width="115" height="90" rx="10" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
            <rect x="278" y="84" width="109" height="51" rx="6" fill={oxideType === 'mg' ? '#bae6fd' : '#fecdd3'} />
            <rect x="326" y="42" width="14" height="68" rx="3" fill={oxideType === 'mg' ? '#2563eb' : '#dc2626'} />
            <text x="332" y="155" textAnchor="middle" fontSize="10" fontWeight="bold" fill={oxideType === 'mg' ? '#1d4ed8' : '#be123c'}>
              {oxideType === 'mg' ? 'يزرق دوار الشمس (قاعدي)' : 'يحمر دوار الشمس (حمضي)'}
            </text>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setAcidType('hcl')}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              acidType === 'hcl' ? 'bg-teal-700 text-white' : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>CaCO3 + 2HCl</span>
          </button>
          <button
            type="button"
            onClick={() => setAcidType('h3po4')}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
              acidType === 'h3po4' ? 'bg-teal-700 text-white' : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>3CaCO3 + 2H3PO4 (وزارية)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setLimeTurbid((t) => !t)}
          className="rounded-xl bg-amber-600 hover:bg-amber-700 px-3 py-1.5 font-bold text-white cursor-pointer"
        >
          {limeTurbid ? 'حالة: تعكر ماء الجير CaCO3↓' : 'حالة: ماء جير رائق قبل الغاز'}
        </button>
      </div>

      <div className="rounded-2xl border border-teal-200/80 dark:border-slate-700 bg-teal-50/70 dark:bg-slate-950 p-3">
        <svg viewBox="0 0 480 205" className="w-full h-auto max-h-[230px]">
          {/* الدورق المخروطي + السدادة + قمع إضافة الحمض */}
          <path d="M90 54 H118 L146 144 H62 Z" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2.2" strokeLinejoin="round" />
          <rect x="86" y="42" width="36" height="12" rx="3" fill="#475569" />
          {/* قمع الحمض */}
          <polygon points="82,16 106,16 97,32 91,32" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="94" y1="32" x2="94" y2="112" stroke="#0284c7" strokeWidth="2.5" />
          {/* السائل والفقاعات وقطع الرخام */}
          <polygon points="71,116 137,116 144,142 64,142" fill="#38bdf8" opacity="0.45" />
          <circle cx="88" cy="133" r="6" fill="#f1f5f9" stroke="#64748b" />
          <circle cx="104" cy="131" r="6" fill="#f1f5f9" stroke="#64748b" />
          <circle cx="118" cy="134" r="5.5" fill="#f1f5f9" stroke="#64748b" />
          <circle cx="100" cy="108" r="2.8" fill="#ffffff" />
          <circle cx="114" cy="96" r="3.2" fill="#ffffff" />

          {/* أنبوب التوصيل إلى مخبار الجمع (الإزاحة العلوية للهواء) */}
          <path d="M112 42 V24 H274 V126" fill="none" stroke="#475569" strokeWidth="3.5" strokeLinejoin="round" />
          <rect x="240" y="54" width="68" height="88" rx="8" fill="#f8fafc" stroke="#0f766e" strokeWidth="2.2" />
          <rect x="243" y="94" width="62" height="45" rx="5" fill="#cbd5e1" opacity="0.45" />
          <path d="M254 88 L254 70 M294 88 L294 70" stroke="#0284c7" strokeWidth="1.8" />
          <polygon points="254,68 250,75 258,75" fill="#0284c7" />
          <polygon points="294,68 290,75 298,75" fill="#0284c7" />

          {/* أنبوب تمرير الغاز إلى ماء الجير */}
          <path d="M294 54 V34 H396 V122" fill="none" stroke="#475569" strokeWidth="2.5" strokeDasharray="4 3" />
          <rect x="372" y="64" width="48" height="78" rx="14" fill="#f1f5f9" stroke="#0284c7" strokeWidth="2" />
          <rect x="374" y="92" width="44" height="48" rx="10" fill={limeTurbid ? '#e2e8f0' : '#bae6fd'} />

          <text x="104" y="164" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0369a1">
            {acidType === 'hcl' ? 'CaCO3 + 2HCl' : '3CaCO3 + 2H3PO4 → Ca3(PO4)2'}
          </text>
          <text x="274" y="164" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f766e">
            جمع بإزاحة الهواء لأعلى (أثقل)
          </text>
          <text x="396" y="164" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#1e293b">
            {limeTurbid ? 'تعكر ماء الجير CaCO3↓' : 'ماء جير رائق'}
          </text>
        </svg>
      </div>
    </div>
  );
};

/* 7. خواص الأجسام الصلبة (u11-l1) + ثقوب السائل على 3 أعماق (u12-l2) */
export const SolidPropsAndHydroJets2DSim: React.FC<{ variant: 'solids' | 'jets' }> = ({ variant }) => {
  const [solidProp, setSolidProp] = useState<'elastic' | 'plastic' | 'brittle' | 'ductile' | 'hard'>('elastic');
  const [appliedForce, setAppliedForce] = useState<boolean>(true);
  const [waterLevel, setWaterLevel] = useState<number>(85);

  if (variant === 'solids') {
    const map = {
      elastic: { title: 'المرونة (شريط مطاط / نابض)', result: 'يستعيد شكله الأصلي تماماً بعد زوال القوة.', color: '#0ea5e9' },
      plastic: { title: 'اللدونة (الصلصال / العجين)', result: 'يتشوه ويبقى محتفظاً بالشكل الجديد بعد زوال القوة.', color: '#f59e0b' },
      brittle: { title: 'الهشاشة (الزجاج / الطباشير)', result: 'ينكسر ويتفتت فوراً عند تعرضه للطرق.', color: '#ef4444' },
      ductile: { title: 'القابلية للطرق والسحب (النحاس)', result: 'يتسطح إلى صفائح أو يُسحب إلى أسلاك طويلة دون انكسار.', color: '#d97706' },
      hard: { title: 'القساوة (الماس يخدش الزجاج)', result: 'يقاوم الخدش ويخدش المواد الأقل قساوة منه.', color: '#06b6d4' },
    }[solidProp];

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'elastic', label: 'مرونة (مطاط)' },
                { id: 'plastic', label: 'لدونة (صلصال)' },
                { id: 'brittle', label: 'هشاشة (زجاج)' },
                { id: 'ductile', label: 'طرق وسحب (نحاس)' },
                { id: 'hard', label: 'قساوة (الماس)' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSolidProp(item.id)}
                className={`rounded-xl px-2.5 py-1.5 font-bold cursor-pointer ${
                  solidProp === item.id ? 'bg-cyan-700 text-white' : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAppliedForce((f) => !f)}
            className="flex items-center gap-1 rounded-xl bg-amber-600 px-3 py-1.5 font-bold text-white cursor-pointer"
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>{appliedForce ? 'إزالة القوة / الطرق' : 'تطبيق قوة / طرق'}</span>
          </button>
        </div>

        <div className="rounded-2xl border border-cyan-200/80 dark:border-slate-700 bg-cyan-50/75 dark:bg-slate-950 p-3">
          <svg viewBox="0 0 420 155" className="w-full h-auto max-h-[185px]">
            {solidProp === 'elastic' && (
              <g>
                <rect x="85" y="34" width="12" height="58" rx="3" fill="#475569" />
                <path
                  d={
                    appliedForce
                      ? 'M97 63 L125 46 L145 80 L165 46 L185 80 L205 46 L225 80 L245 46 L265 80 L295 63'
                      : 'M97 63 L112 46 L124 80 L136 46 L148 80 L160 46 L172 80 L184 46 L196 80 L212 63'
                  }
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
                {appliedForce && <path d="M298 63 H334 M326 57 L336 63 L326 69" stroke="#dc2626" strokeWidth="3" fill="none" />}
              </g>
            )}
            {solidProp === 'plastic' && (
              <g>
                <path
                  d={
                    appliedForce
                      ? 'M125 94 Q130 56 175 68 Q210 82 245 68 Q290 56 295 94 Z'
                      : 'M135 94 Q140 48 210 48 Q280 48 285 94 Z'
                  }
                  fill="#f59e0b"
                  stroke="#b45309"
                  strokeWidth="2.5"
                />
                {appliedForce && <path d="M210 26 V64 M203 56 L210 66 L217 56" stroke="#dc2626" strokeWidth="3" fill="none" />}
              </g>
            )}
            {solidProp === 'brittle' && (
              <g>
                {appliedForce ? (
                  <>
                    <polygon points="145,42 195,52 182,94 138,88" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
                    <polygon points="214,48 272,38 280,86 218,95" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
                    <polygon points="194,68 210,74 202,96 186,90" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
                  </>
                ) : (
                  <rect x="145" y="42" width="130" height="52" rx="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.2" />
                )}
              </g>
            )}
            {solidProp === 'ductile' && (
              <g>
                <rect
                  x={appliedForce ? 95 : 155}
                  y={appliedForce ? 62 : 46}
                  width={appliedForce ? 230 : 110}
                  height={appliedForce ? 16 : 42}
                  rx="6"
                  fill="#d97706"
                  stroke="#92400e"
                  strokeWidth="2"
                />
                {appliedForce && <text x="210" y="48" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#92400e">صفيحة نحاسية مطروقة دون كسر</text>}
              </g>
            )}
            {solidProp === 'hard' && (
              <g>
                <rect x="120" y="70" width="180" height="24" rx="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
                <polygon points="210,69 196,44 204,34 216,34 224,44" fill="#e0f2fe" stroke="#0891b2" strokeWidth="2" />
                {appliedForce && <line x1="150" y1="76" x2="270" y2="76" stroke="#0369a1" strokeWidth="2" strokeDasharray="4 2" />}
              </g>
            )}
            <text x="210" y="132" textAnchor="middle" fontSize="11.5" fontWeight="bold" fill="#0f766e">
              {map.title}: {map.result}
            </text>
          </svg>
        </div>
      </div>
    );
  }

  const ratio = waterLevel / 100;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-200">ارتفاع عمود السائل في الأسطوانة المثقوبة: {waterLevel}%</span>
        <input
          type="range"
          min={30}
          max={100}
          value={waterLevel}
          onChange={(e) => setWaterLevel(Number(e.target.value))}
          className="w-44 accent-sky-600"
        />
      </div>
      <div className="rounded-2xl border border-sky-200/80 dark:border-slate-700 bg-sky-50/75 dark:bg-slate-950 p-3">
        <svg viewBox="0 0 420 180" className="w-full h-auto max-h-[205px]">
          <rect x="65" y="24" width="70" height="122" rx="6" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2.5" />
          <rect x="67" y={144 - waterLevel * 1.1} width="66" height={waterLevel * 1.1} rx="4" fill="#38bdf8" opacity="0.6" />
          {/* 3 ثقوب */}
          <path d={`M135 55 Q${165 + ratio * 30} 65 ${185 + ratio * 40} 145`} fill="none" stroke="#0284c7" strokeWidth="3" />
          <path d={`M135 88 Q${195 + ratio * 55} 98 ${230 + ratio * 65} 145`} fill="none" stroke="#0284c7" strokeWidth="3" />
          <path d={`M135 122 Q${235 + ratio * 80} 126 ${285 + ratio * 95} 145`} fill="none" stroke="#0284c7" strokeWidth="3.5" />
          <text x="230" y="168" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369a1">
            يندفع الماء من الثقب السفلي لأبعد مسافة لأن ضغط السائل يزداد بزيادة العمق!
          </text>
        </svg>
      </div>
    </div>
  );
};
