import React from 'react';

/**
 * خلفية علمية فاتحة ومبهجة مستوحاة من كتاب العلوم:
 * - تدرجات سماوية ونعناعية ناعمة مع شبكة نقاط مختبرية دقيقة.
 * - رسوم علمية ملونة بألوان باستيل هادئة في الهوامش والزوايا (مجهر، دورق، ذرة، حمض نووي، مغناطيس، منشور، وورقة نباتية)
 *   مع الحفاظ التام على وضوح القراءة في منطقة المحتوى الوسطى.
 */
export const ScienceBackdrop: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#f2f9fb] via-[#f8fcfd] to-[#eef7f4] dark:from-[#07101c] dark:via-[#0a1524] dark:to-[#08131d]"
    >
      {/* شبكة نقاط مخبرية لطيفة */}
      <div
        className="absolute inset-0 opacity-50 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(15, 118, 110, 0.14) 1.25px, transparent 1.25px)',
          backgroundSize: '26px 26px',
        }}
      />

      {/* هالات إضاءة باستيل ناعمة */}
      <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-teal-200/35 dark:bg-teal-900/20 blur-3xl" />
      <div className="absolute top-1/3 -left-32 w-[420px] h-[420px] rounded-full bg-sky-200/35 dark:bg-sky-900/15 blur-3xl" />
      <div className="absolute -bottom-36 right-1/4 w-[520px] h-[520px] rounded-full bg-emerald-200/30 dark:bg-emerald-900/15 blur-3xl" />

      {/* 1. أعلى اليمين: مجهر علمي وأوراق نباتية (أحياء) */}
      <svg
        viewBox="0 0 260 260"
        fill="none"
        className="absolute top-14 right-2 sm:right-6 w-44 sm:w-64 h-44 sm:h-64 opacity-[0.30] dark:opacity-[0.16]"
      >
        {/* ورقة نباتية باستيل */}
        <path
          d="M175 74 C198 42, 232 42, 240 68 C222 92, 192 94, 175 74 Z"
          fill="#a7f3d0"
          stroke="#0f766e"
          strokeWidth="2"
        />
        <path d="M175 74 L222 60" stroke="#0f766e" strokeWidth="1.6" strokeLinecap="round" />
        {/* مجهر */}
        <rect x="64" y="200" width="106" height="16" rx="8" fill="#bae6fd" stroke="#0369a1" strokeWidth="2.2" />
        <path
          d="M142 200 C166 178, 168 126, 140 104"
          stroke="#0369a1"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <rect
          x="104"
          y="64"
          width="24"
          height="68"
          rx="5"
          transform="rotate(-22 116 98)"
          fill="#ccfbf1"
          stroke="#0f766e"
          strokeWidth="2.2"
        />
        <line x1="76" y1="158" x2="128" y2="158" stroke="#0f766e" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="144" cy="118" r="8" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
      </svg>

      {/* 2. أعلى اليسار: ذرة بوهر + حلقات كيميائية (كيمياء) */}
      <svg
        viewBox="0 0 280 260"
        fill="none"
        className="absolute top-16 left-2 sm:left-6 w-48 sm:w-64 h-44 sm:h-60 opacity-[0.29] dark:opacity-[0.16]"
      >
        {/* مدارات الذرة */}
        <circle cx="110" cy="110" r="14" fill="#99f6e4" stroke="#0f766e" strokeWidth="2.2" />
        <ellipse cx="110" cy="110" rx="84" ry="30" stroke="#0284c7" strokeWidth="2" transform="rotate(25 110 110)" />
        <ellipse cx="110" cy="110" rx="84" ry="30" stroke="#0f766e" strokeWidth="2" transform="rotate(-35 110 110)" />
        <ellipse cx="110" cy="110" rx="84" ry="30" stroke="#059669" strokeWidth="2" transform="rotate(85 110 110)" />
        <circle cx="182" cy="84" r="6" fill="#38bdf8" />
        <circle cx="52" cy="166" r="6" fill="#10b981" />
        <circle cx="88" cy="34" r="6" fill="#f59e0b" />
        {/* حلقة بنزين سداسية */}
        <polygon
          points="210,148 242,166 242,202 210,220 178,202 178,166"
          fill="#e0f2fe"
          stroke="#0369a1"
          strokeWidth="2.2"
        />
        <circle cx="210" cy="184" r="18" stroke="#0369a1" strokeWidth="1.6" strokeDasharray="5 4" />
      </svg>

      {/* 3. وسط اليمين (للشاشات العريضة): شريط DNA وراثة */}
      <svg
        viewBox="0 0 120 260"
        fill="none"
        className="hidden xl:block absolute top-1/2 -translate-y-1/2 right-4 w-24 h-56 opacity-[0.22] dark:opacity-[0.12]"
      >
        <path d="M28 16 C88 54, 88 106, 28 144 C-18 174, 88 216, 28 248" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
        <path d="M92 16 C32 54, 32 106, 92 144 C138 174, 32 216, 92 248" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
        <line x1="42" y1="38" x2="78" y2="38" stroke="#10b981" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="36" y1="80" x2="84" y2="80" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="42" y1="122" x2="78" y2="122" stroke="#10b981" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="36" y1="168" x2="84" y2="168" stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="42" y1="210" x2="78" y2="210" stroke="#10b981" strokeWidth="2.4" strokeLinecap="round" />
      </svg>

      {/* 4. وسط اليسار (للشاشات العريضة): مغناطيس U وبوصلة */}
      <svg
        viewBox="0 0 140 240"
        fill="none"
        className="hidden xl:block absolute top-1/2 -translate-y-1/2 left-4 w-28 h-52 opacity-[0.22] dark:opacity-[0.12]"
      >
        <path d="M36 44 V96 A34 34 0 0 0 104 96 V44" stroke="#0369a1" strokeWidth="14" strokeLinecap="round" />
        <rect x="29" y="34" width="14" height="18" rx="3" fill="#fca5a5" stroke="#b91c1c" strokeWidth="1.5" />
        <rect x="97" y="34" width="14" height="18" rx="3" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="1.5" />
        <circle cx="70" cy="184" r="34" fill="#f0fdfa" stroke="#0f766e" strokeWidth="2.2" />
        <polygon points="70,156 77,184 70,212 63,184" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.4" />
        <polygon points="70,156 77,184 63,184" fill="#f87171" />
      </svg>

      {/* 5. أسفل اليمين: دورق مخبري بسائل متدرج وأنابيب اختبار */}
      <svg
        viewBox="0 0 260 240"
        fill="none"
        className="absolute bottom-12 right-3 sm:right-8 w-44 sm:w-60 h-40 sm:h-56 opacity-[0.30] dark:opacity-[0.16]"
      >
        {/* دورق مخروطي */}
        <path
          d="M110 44h40M118 44v40l-42 84c-4 9 2 18 12 18h84c10 0 16-9 12-18l-42-84V44"
          fill="#f0fdfa"
          stroke="#0f766e"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M84 146 C108 136, 148 152, 176 142 L184 168 C186 177, 180 186, 172 186 H88 C80 186, 74 177, 76 168 Z"
          fill="#5eead4"
        />
        <circle cx="118" cy="126" r="5" fill="#99f6e4" stroke="#0f766e" strokeWidth="1.5" />
        <circle cx="140" cy="110" r="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
        <circle cx="128" cy="70" r="3.5" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
        {/* أنبوبة اختبار مائلة */}
        <rect
          x="196"
          y="78"
          width="24"
          height="92"
          rx="12"
          transform="rotate(14 208 124)"
          fill="#e0f2fe"
          stroke="#0284c7"
          strokeWidth="2.2"
        />
      </svg>

      {/* 6. أسفل اليسار: منشور ضوئي وموجات كهرومغناطيسية (فيزياء) */}
      <svg
        viewBox="0 0 280 230"
        fill="none"
        className="hidden sm:block absolute bottom-12 left-6 w-64 h-52 opacity-[0.25] dark:opacity-[0.13]"
      >
        {/* منشور زجاجي وشعاع ضوئي */}
        <polygon points="88,46 138,130 38,130" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.2" strokeLinejoin="round" />
        <line x1="12" y1="96" x2="62" y2="86" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="116" y1="90" x2="178" y2="76" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        <line x1="120" y1="98" x2="184" y2="96" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
        <line x1="124" y1="106" x2="186" y2="116" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        {/* موجات كهرومغناطيسية */}
        <path
          d="M32 178 Q 68 134, 104 178 T 176 178 T 248 178"
          stroke="#0f766e"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M32 178 Q 68 214, 104 178 T 176 178 T 248 178"
          stroke="#0284c7"
          strokeWidth="1.8"
          strokeDasharray="6 5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
