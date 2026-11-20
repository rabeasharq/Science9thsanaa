import { renderSvgToPng, svgCanvas, svgTxt } from './arabicShaper';

export function buildChemDiagrams(): Record<string, { png: Buffer; caption: string; width: number; height: number }> {
  const out: Record<string, { png: Buffer; caption: string; width: number; height: number }> = {};

  const add = (id: string, w: number, h: number, title: string, body: string, caption: string, footer?: string) => {
    const svg = svgCanvas(w, h, title, body, footer);
    out[id] = { png: renderSvgToPng(svg, 1080), caption, width: 520, height: Math.round((520 * h) / w) };
  };

  // 1. Unit 1 - Solutions Saturation & Preparation
  add(
    'u1-l1',
    760,
    340,
    'مكونات المحلول وحالات الإشباع الثلاث',
    `
      <!-- Beaker 1: Unsaturated -->
      <rect x="495" y="95" width="190" height="165" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.5"/>
      <rect x="495" y="75" width="190" height="25" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
      <circle cx="555" cy="155" r="5" fill="#0369a1"/><circle cx="605" cy="180" r="5" fill="#0369a1"/>
      <circle cx="575" cy="210" r="5" fill="#0369a1"/><circle cx="635" cy="145" r="5" fill="#0369a1"/>
      ${svgTxt(590, 285, '1. محلول غير مشبع', { bold: true, size: 14, color: '#0369a1' })}
      ${svgTxt(590, 304, 'يقبل إذابة كمية إضافية من المذاب', { size: 11, color: '#475569' })}

      <!-- Beaker 2: Saturated -->
      <rect x="285" y="95" width="190" height="165" rx="8" fill="#bae6fd" stroke="#0f766e" stroke-width="2.5"/>
      <rect x="285" y="75" width="190" height="25" fill="#ffffff" stroke="#0f766e" stroke-width="2"/>
      ${[0,1,2,3,4,5,6,7].map((i) => `<circle cx="${315 + (i % 4) * 40}" cy="${135 + Math.floor(i / 4) * 38}" r="5.5" fill="#0f766e"/>`).join('')}
      <rect x="330" y="242" width="18" height="14" rx="2" fill="#64748b"/>
      <rect x="355" y="244" width="18" height="12" rx="2" fill="#475569"/>
      <rect x="380" y="241" width="20" height="15" rx="2" fill="#64748b"/>
      ${svgTxt(380, 285, '2. محلول مشبع', { bold: true, size: 14, color: '#0f766e' })}
      ${svgTxt(380, 304, 'يمتلئ المذيب ويترسب الفائض في القاع', { size: 11, color: '#475569' })}

      <!-- Beaker 3: Supersaturated with heating -->
      <rect x="75" y="95" width="190" height="150" rx="8" fill="#fde68a" stroke="#b45309" stroke-width="2.5"/>
      <rect x="75" y="75" width="190" height="25" fill="#ffffff" stroke="#b45309" stroke-width="2"/>
      ${[0,1,2,3,4,5,6,7,8,9].map((i) => `<circle cx="${100 + (i % 5) * 34}" cy="${130 + Math.floor(i / 5) * 42}" r="5.5" fill="#b45309"/>`).join('')}
      <path d="M145 262 Q155 247 165 262 Q175 247 185 262" fill="none" stroke="#ef4444" stroke-width="3"/>
      ${svgTxt(170, 285, '3. محلول فوق مشبع (بالتسخين)', { bold: true, size: 14, color: '#b45309' })}
      ${svgTxt(170, 304, 'يذيب أكثر من الحد بالتسخين ثم يتبلور', { size: 11, color: '#475569' })}
    `,
    'شكل (1-1): مقارنة بين المحلول غير المشبع والمشبع وفوق المشبع بالتسخين.',
    'القاعدة: المحلول = مذاب (كمية أقل) + مذيب (كمية أكبر مثل الماء)'
  );

  // 2. Unit 2 - Four Indicators + Electrolysis + Dilution Safety
  add(
    'u2-l1',
    760,
    390,
    'الكواشف الأربعة وتوصيل المحاليل الأيونية وقاعدة التخفيف',
    `
      <!-- Indicators table visual -->
      <rect x="385" y="65" width="355" height="275" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      ${svgTxt(562, 88, 'ألوان الكواشف في الأوساط الثلاثة', { bold: true, size: 14, color: '#0f172a' })}
      <line x1="395" y1="98" x2="730" y2="98" stroke="#cbd5e1" stroke-width="1"/>
      ${svgTxt(675, 118, 'الكاشف', { bold: true, size: 12 })}
      ${svgTxt(575, 118, 'حمض', { bold: true, size: 12, color: '#dc2626' })}
      ${svgTxt(495, 118, 'متعادل', { bold: true, size: 12, color: '#475569' })}
      ${svgTxt(422, 118, 'قاعدة', { bold: true, size: 12, color: '#2563eb' })}

      ${[
        { name: 'دوار الشمس', a: 'أحمر', ac: '#ef4444', n: 'بنفسجي', nc: '#7c3aed', b: 'أزرق', bc: '#2563eb', y: 152 },
        { name: 'الميثيل البرتقالي', a: 'أحمر', ac: '#ef4444', n: 'برتقالي', nc: '#f97316', b: 'أصفر', bc: '#eab308', y: 196 },
        { name: 'الفينولفثالين', a: 'عديم اللون', ac: '#64748b', n: 'عديم اللون', nc: '#64748b', b: 'أحمر وردي', bc: '#ec4899', y: 240 },
        { name: 'الشاي الأحمر', a: 'يصفر/يفتح', ac: '#eab308', n: 'أحمر بني', nc: '#92400e', b: 'يغمق', bc: '#451a03', y: 284 },
      ].map((r) => `
        <line x1="395" y1="${r.y - 24}" x2="730" y2="${r.y - 24}" stroke="#e2e8f0" stroke-width="1"/>
        ${svgTxt(675, r.y, r.name, { bold: true, size: 11.5 })}
        <rect x="545" y="${r.y - 16}" width="60" height="24" rx="5" fill="${r.ac}22" stroke="${r.ac}"/>
        ${svgTxt(575, r.y, r.a, { size: 11, bold: true, color: r.ac })}
        <rect x="463" y="${r.y - 16}" width="64" height="24" rx="5" fill="${r.nc}22" stroke="${r.nc}"/>
        ${svgTxt(495, r.y, r.n, { size: 10.5, bold: true, color: r.nc })}
        <rect x="394" y="${r.y - 16}" width="58" height="24" rx="5" fill="${r.bc}22" stroke="${r.bc}"/>
        ${svgTxt(423, r.y, r.b, { size: 10.5, bold: true, color: r.bc })}
      `).join('')}

      <!-- Electrolysis & Dilution -->
      <rect x="20" y="65" width="345" height="150" rx="10" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
      ${svgTxt(192, 86, 'التوصيل الكهربائي وهجرة الأيونات', { bold: true, size: 13.5, color: '#0f766e' })}
      <rect x="85" y="114" width="215" height="72" rx="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <rect x="120" y="100" width="12" height="68" fill="#334155"/>
      <rect x="255" y="100" width="12" height="68" fill="#334155"/>
      ${svgTxt(126, 97, '(-)', { bold: true, size: 11.5, color: '#2563eb' })}
      ${svgTxt(261, 97, '(+)', { bold: true, size: 11.5, color: '#dc2626' })}
      <circle cx="170" cy="146" r="12" fill="#fee2e2" stroke="#dc2626"/>
      ${svgTxt(170, 151, 'H+', { bold: true, size: 11, color: '#dc2626' })}
      <path d="M155 146 L138 146" stroke="#dc2626" stroke-width="2"/>
      <circle cx="215" cy="146" r="12" fill="#dbeafe" stroke="#2563eb"/>
      ${svgTxt(215, 151, 'Cl-', { bold: true, size: 11, color: '#2563eb' })}
      <path d="M230 146 L248 146" stroke="#2563eb" stroke-width="2"/>
      ${svgTxt(192, 204, 'الموجب يتجه للمهبط (-) والسالب للمصعد (+)', { size: 11, color: '#0f172a', bold: true })}

      <!-- Dilution Rule -->
      <rect x="20" y="226" width="345" height="114" rx="10" fill="#fef2f2" stroke="#fca5a5" stroke-width="1.5"/>
      ${svgTxt(192, 248, 'قاعدة السلامة عند تخفيف الحموض المركزة', { bold: true, size: 13, color: '#b91c1c' })}
      <rect x="200" y="262" width="150" height="66" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
      ${svgTxt(275, 286, 'صح: أضف الحمض إلى الماء', { bold: true, size: 11, color: '#15803d' })}
      ${svgTxt(275, 308, 'ببطء مع التحريك المستمر', { size: 10.5, color: '#166534' })}
      <rect x="35" y="262" width="150" height="66" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5"/>
      ${svgTxt(110, 286, 'خطأ: سكب الماء على الحمض', { bold: true, size: 11, color: '#b91c1c' })}
      ${svgTxt(110, 308, 'يسبب غليان وتطاير الحمض!', { size: 10.5, color: '#991b1b' })}
    `,
    'شكل (2-1): جدول الكواشف الأربعة، وهجرة الأيونات أثناء التوصيل الكهربائي، وقاعدة تخفيف الحمض.',
    'تذكّر: هيدروكسيد النحاس Cu(OH)2 قاعدة لا تذوب في الماء لذا لا يُعد قلوياً ولا يضيء المصباح'
  );

  // 3. Unit 2 Lesson 2 - pH Scale 0 to 14
  const phColors = ['#dc2626','#ea580c','#f97316','#f59e0b','#eab308','#84cc16','#22c55e','#10b981','#14b8a6','#06b6d4','#0284c7','#2563eb','#4f46e5','#6d28d9','#581c87'];
  add(
    'u2-l2',
    760,
    310,
    'مقياس الرقم الهيدروجيني (pH) وتدرج قوة الحموض والقواعد',
    `
      ${phColors.map((c, i) => {
        const x = 45 + i * 44.5;
        return `<rect x="${x}" y="95" width="42" height="58" rx="4" fill="${c}"/>
                ${svgTxt(x + 21, 130, String(i), { bold: true, size: 14, color: '#ffffff' })}`;
      }).join('')}
      <!-- Labels -->
      <path d="M45 168 L345 168" stroke="#dc2626" stroke-width="3"/>
      ${svgTxt(195, 190, 'وسط حمضي (pH < 7) — تزداد القوة كلما اقتربنا من 0', { bold: true, size: 12, color: '#b91c1c' })}
      <rect x="332" y="160" width="76" height="32" rx="6" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
      ${svgTxt(370, 181, 'متعادل = 7', { bold: true, size: 12, color: '#059669' })}
      <path d="M418 168 L712 168" stroke="#2563eb" stroke-width="3"/>
      ${svgTxt(565, 190, 'وسط قاعدي (pH > 7) — تزداد القوة كلما اقتربنا من 14', { bold: true, size: 12, color: '#1d4ed8' })}

      <rect x="45" y="210" width="667" height="52" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
      ${svgTxt(615, 232, 'NaOH (13-14) قاعدة قوية', { size: 11.5, bold: true, color: '#4338ca' })}
      ${svgTxt(440, 232, 'ماء مقطر (7) | تربة زراعية (6-7)', { size: 11.5, bold: true, color: '#0f766e' })}
      ${svgTxt(245, 232, 'خل وليمون (2.5-3) حمض ضعيف', { size: 11.5, bold: true, color: '#d97706' })}
      ${svgTxt(95, 232, 'HCl (1) قوي', { size: 11.5, bold: true, color: '#dc2626' })}
      ${svgTxt(380, 253, 'معلومة وزارية: التربة الصالحة للزراعة تتراوح قيمة pH لها بين 6 و 7', { size: 11.5, bold: true, color: '#0f172a' })}
    `,
    'شكل (2-2): تدرج مقياس الرقم الهيدروجيني (pH) من 0 إلى 14 وأمثلة من الكتاب المدرسي.'
  );

  // 4. Unit 3 - Neutralization, Carbonates, Acid Rain
  add(
    'u3-l1',
    760,
    310,
    'تفاعل التعادل وأثر الحموض في الكربونات والمطر الحمضي',
    `
      <rect x="505" y="70" width="230" height="190" rx="10" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.5"/>
      ${svgTxt(620, 95, '1. تفاعل التعادل', { bold: true, size: 14, color: '#0f766e' })}
      ${svgTxt(620, 125, 'حمض + قاعدة ⟶ ملح + ماء', { bold: true, size: 12.5 })}
      ${svgTxt(620, 152, 'HCl + NaOH ⟶ NaCl + H2O', { bold: true, size: 12, color: '#0369a1' })}
      ${svgTxt(620, 185, 'تطبيق حياتي مهم:', { bold: true, size: 12, color: '#15803d' })}
      ${svgTxt(620, 208, 'أوراق العثرب القاعدية تعادل', { size: 11.5 })}
      ${svgTxt(620, 228, 'حمض النمليك عند لسعة النمل', { size: 11.5 })}

      <rect x="265" y="70" width="225" height="190" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      ${svgTxt(377, 95, '2. الحموض + الكربونات', { bold: true, size: 14, color: '#1d4ed8' })}
      ${svgTxt(377, 125, 'CaCO3 + 2HCl ⟶', { bold: true, size: 11.5 })}
      ${svgTxt(377, 146, 'CaCl2 + H2O + CO2↑', { bold: true, size: 11.5, color: '#dc2626' })}
      ${svgTxt(377, 178, 'ومعادلة الفوسفوريك الوزارية:', { bold: true, size: 11.5, color: '#1e293b' })}
      ${svgTxt(377, 200, '2H3PO4 + 3CaCO3 ⟶', { bold: true, size: 11 })}
      ${svgTxt(377, 220, 'Ca3(PO4)2 + 3H2O + 3CO2↑', { bold: true, size: 11, color: '#dc2626' })}

      <rect x="25" y="70" width="225" height="190" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
      ${svgTxt(137, 95, '3. تكوّن المطر الحمضي', { bold: true, size: 14, color: '#b45309' })}
      ${svgTxt(137, 128, 'دخان المصانع: SO2 و NO2', { bold: true, size: 12 })}
      ${svgTxt(137, 152, '+ بخار ماء السحب (H2O)', { size: 11.5 })}
      ${svgTxt(137, 178, '⟶ أمطار حمضية (H2SO4/HNO3)', { bold: true, size: 11.5, color: '#dc2626' })}
      ${svgTxt(137, 210, 'تضر التربة والمباني الجيرية', { size: 11.5 })}
      ${svgTxt(137, 232, 'وتُعالج التربة بالجير القاعدي', { size: 11.5, color: '#15803d', bold: true })}
    `,
    'شكل (3-1): ملخص تفاعلات الوحدة الثالثة (التعادل، الكربونات، وتكوّن المطر الحمضي).',
    'تحذير وزاري: ناتج تفاعل حمض الفوسفوريك مع كربونات الكالسيوم هو فوسفات الكالسيوم Ca3(PO4)2'
  );

  // 5. Unit 9 - Oxides, Rust, Carbon, CO2 Prep & 4 Candles
  add(
    'u9-l4',
    760,
    360,
    'تحضير غاز CO₂ بالإزاحة العلوية للهواء وتجربة إطفاء الشموع الأربع',
    `
      <!-- Left: 4 candles descending -->
      <rect x="35" y="75" width="310" height="235" rx="10" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
      ${svgTxt(190, 98, 'تجربة إطفاء الشموع بغاز CO2 الأثقل من الهواء', { bold: true, size: 13, color: '#0f172a' })}
      <rect x="75" y="130" width="230" height="165" rx="6" fill="#e2e8f0" fill-opacity="0.55" stroke="#64748b" stroke-width="2"/>
      <!-- 4 candles of increasing height from right to left or vice versa -->
      ${[
        { x: 105, h: 40, label: '1' },
        { x: 155, h: 65, label: '2' },
        { x: 205, h: 90, label: '3' },
        { x: 255, h: 115, label: '4' },
      ].map((c, idx) => `
        <rect x="${c.x}" y="${285 - c.h}" width="22" height="${c.h}" fill="#ffffff" stroke="#94a3b8"/>
        <ellipse cx="${c.x + 11}" cy="${275 - c.h}" rx="5" ry="9" fill="${idx < 2 ? '#94a3b8' : '#f97316'}"/>
        ${svgTxt(c.x + 11, 293, c.label, { size: 10, bold: true })}
      `).join('')}
      ${svgTxt(190, 148, 'ينزل CO2 للأسفل ويطفئ الشمعة الأقصر أولاً ثم الأطول', { size: 11.5, bold: true, color: '#0f766e' })}

      <!-- Right: CO2 lab prep apparatus -->
      <rect x="375" y="75" width="350" height="235" rx="10" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.5"/>
      ${svgTxt(550, 98, 'جهاز تحضير CO2 في المختبر', { bold: true, size: 13.5, color: '#0f766e' })}
      <!-- Flask -->
      <path d="M590 155 L615 155 L645 250 L560 250 Z" fill="#dbeafe" stroke="#0284c7" stroke-width="2"/>
      <rect x="597" y="125" width="11" height="35" fill="#fef3c7" stroke="#d97706"/>
      ${svgTxt(602, 268, 'CaCO3 + HCl', { size: 11, bold: true })}
      <!-- Tube -->
      <path d="M610 148 L610 128 L465 128 L465 245" fill="none" stroke="#334155" stroke-width="3"/>
      <!-- Gas Jar (upright - upward displacement of air) -->
      <rect x="430" y="165" width="75" height="90" rx="4" fill="#f1f5f9" stroke="#334155" stroke-width="2"/>
      ${svgTxt(467, 210, 'CO2 يتجمع', { size: 11, bold: true })}
      ${svgTxt(467, 228, 'في القاع', { size: 11, bold: true })}
      ${svgTxt(467, 272, 'إزاحة الهواء للأعلى', { size: 11, bold: true, color: '#b45309' })}
    `,
    'شكل (9-1): جهاز تحضير غاز ثاني أكسيد الكربون وجمعه بإزاحة الهواء للأعلى، وتجربة إطفاء الشموع.',
    'CO2 يعكّر ماء الجير الرائق Ca(OH)2 لتكوّن كربونات الكالسيوم البيضاء غير الذائبة'
  );

  // 6. Unit 9 - Oil Distillation & Rust & Pollution
  add(
    'u9-l5',
    760,
    370,
    'برج التقطير التجزيئي للنفط الخام ودرجات غليان مشتقاته',
    `
      <!-- Furnace -->
      <rect x="530" y="245" width="175" height="75" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      ${svgTxt(617, 275, 'فرن تسخين النفط الخام', { bold: true, size: 12.5, color: '#991b1b' })}
      ${svgTxt(617, 297, '(حرارة تفوق 400 م°)', { bold: true, size: 11.5, color: '#dc2626' })}
      <path d="M530 282 L475 282" stroke="#dc2626" stroke-width="4"/>

      <!-- Distillation Tower -->
      <rect x="275" y="65" width="200" height="260" rx="18" fill="#f8fafc" stroke="#1e293b" stroke-width="2.5"/>
      ${[
        { y: 85, h: 36, bg: '#e0f2fe', label: '20 م°: غازات نفطية (وقود منزلي)' },
        { y: 126, h: 36, bg: '#dcfce7', label: '100 م°: الجازولين (وقود السيارات)' },
        { y: 167, h: 36, bg: '#fef9c3', label: '200 م°: الكيروسين (وقود الطائرات)' },
        { y: 208, h: 36, bg: '#ffedd5', label: '300 م°: الديزل (السولار والشاحنات)' },
        { y: 249, h: 36, bg: '#e2e8f0', label: '380 م°: شمع البارافين والزيوت الثقيلة' },
        { y: 290, h: 30, bg: '#cbd5e1', label: '>400 م°: الأسفلت (الزفت) لرصف الطرق' },
      ].map((f) => `
        <rect x="285" y="${f.y}" width="180" height="${f.h}" rx="4" fill="${f.bg}" stroke="#94a3b8"/>
        <line x1="275" y1="${f.y + f.h / 2}" x2="225" y2="${f.y + f.h / 2}" stroke="#475569" stroke-width="2"/>
        ${svgTxt(120, f.y + f.h / 2 + 4, f.label, { bold: true, size: 11.5 })}
      `).join('')}
      ${svgTxt(375, 108, 'الأقل غلياناً يصعد للأعلى', { size: 11, bold: true, color: '#0369a1' })}
      ${svgTxt(375, 272, 'الأثقل غلياناً يبقى بالأسفل', { size: 11, bold: true, color: '#334155' })}
    `,
    'شكل (9-2): التدرج الحراري لمشتقات النفط الخام في برج التقطير التجزيئي.',
    'الأساس العلمي: فصل مكونات النفط بناءً على اختلاف درجات غليانها'
  );

  // 7. Unit 9 - Oxides, Rust, Graphite Circuit & Industrial Pollution
  add(
    'u9-l2',
    760,
    330,
    'تجربة شروط صدأ الحديد الثلاث ودائرة توصيل الجرافيت والألماس',
    `
      <!-- 3 Rust tubes -->
      <rect x="405" y="65" width="335" height="225" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      ${svgTxt(572, 88, 'شروط صدأ الحديد: الماء + الأكسجين معاً', { bold: true, size: 13, color: '#9a3412' })}
      ${[
        { x: 645, title: '1. ماء + هواء', res: 'يصدأ الحديد', bg: '#fee2e2', c: '#dc2626' },
        { x: 535, title: '2. ماء مغلي+زيت', res: 'لا يصدأ (بلا هواء)', bg: '#dcfce7', c: '#15803d' },
        { x: 425, title: '3. هواء+CaCl2', res: 'لا يصدأ (بلا ماء)', bg: '#dcfce7', c: '#15803d' },
      ].map((t) => `
        <rect x="${t.x}" y="110" width="75" height="115" rx="12" fill="${t.bg}" stroke="#475569" stroke-width="1.8"/>
        <line x1="${t.x + 37}" y1="138" x2="${t.x + 37}" y2="210" stroke="#64748b" stroke-width="5"/>
        ${svgTxt(t.x + 37, 245, t.title, { bold: true, size: 10.5 })}
        ${svgTxt(t.x + 37, 265, t.res, { bold: true, size: 10.5, color: t.c })}
      `).join('')}

      <!-- Graphite vs Diamond -->
      <rect x="20" y="65" width="365" height="225" rx="10" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
      ${svgTxt(202, 88, 'التوصيل الكهربائي: الجرافيت مقابل الألماس', { bold: true, size: 13, color: '#0f766e' })}
      <rect x="215" y="115" width="150" height="150" rx="8" fill="#ffffff" stroke="#0f766e"/>
      ${svgTxt(290, 140, 'قلم رصاص (جرافيت)', { bold: true, size: 12 })}
      <circle cx="290" cy="182" r="18" fill="#fef08a" stroke="#eab308" stroke-width="2.5"/>
      ${svgTxt(290, 187, 'يضيء', { bold: true, size: 12, color: '#b45309' })}
      ${svgTxt(290, 232, 'موصّل (إلكترونات حرة)', { size: 11, color: '#15803d', bold: true })}

      <rect x="40" y="115" width="150" height="150" rx="8" fill="#ffffff" stroke="#64748b"/>
      ${svgTxt(115, 140, 'بلورة ألماس', { bold: true, size: 12 })}
      <circle cx="115" cy="182" r="18" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
      ${svgTxt(115, 187, 'مطفأ', { bold: true, size: 12, color: '#475569' })}
      ${svgTxt(115, 232, 'عازل (4 روابط قوية)', { size: 11, color: '#dc2626', bold: true })}
    `,
    'شكل (9-3): تجربة إثبات شروط صدأ الحديد، وتفوّق الجرافيت في التوصيل الكهربائي على الألماس.'
  );

  // 8. Unit 10 - Halogens & Cl2 Prep (Water wash then H2SO4 drying)
  add(
    'u10-l3',
    760,
    350,
    'جهاز تحضير غاز الكلور (Cl₂) وتنقيته بالماء ثم تجفيفه بحمض الكبريتيك',
    `
      <!-- Flask MnO2 + HCl -->
      <path d="M615 130 L640 130 L675 235 L580 235 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      ${svgTxt(627, 255, 'MnO2 + 4HCl + حرارة', { bold: true, size: 11.5 })}

      <!-- Tube 1 to Water Wash -->
      <path d="M628 130 L628 100 L455 100 L455 215" fill="none" stroke="#334155" stroke-width="2.5"/>
      <rect x="415" y="135" width="85" height="100" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      ${svgTxt(457, 190, 'ماء مقطر', { bold: true, size: 12, color: '#0369a1' })}
      ${svgTxt(457, 255, '1. تنقية من HCl', { bold: true, size: 11.5, color: '#0369a1' })}

      <!-- Tube 2 to H2SO4 drying -->
      <path d="M475 135 L475 100 L285 100 L285 215" fill="none" stroke="#334155" stroke-width="2.5"/>
      <rect x="245" y="135" width="85" height="100" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      ${svgTxt(287, 190, 'H2SO4 مركز', { bold: true, size: 11.5, color: '#b45309' })}
      ${svgTxt(287, 255, '2. تجفيف من بخار الماء', { bold: true, size: 11.5, color: '#b45309' })}

      <!-- Tube 3 to Cl2 Jar -->
      <path d="M305 135 L305 100 L115 100 L115 215" fill="none" stroke="#334155" stroke-width="2.5"/>
      <rect x="70" y="135" width="90" height="100" rx="6" fill="#ecfccb" stroke="#65a30d" stroke-width="2"/>
      ${svgTxt(115, 190, 'غاز Cl2 جاف', { bold: true, size: 12, color: '#3f6212' })}
      ${svgTxt(115, 255, 'أخضر مصفر (أثقل)', { bold: true, size: 11.5, color: '#3f6212' })}

      <rect x="35" y="276" width="690" height="32" rx="6" fill="#fef2f2" stroke="#fca5a5"/>
      ${svgTxt(380, 297, 'مصيدة وزارية: يمرر الكلور أولاً على الماء لامتصاص HCl ثم على H2SO4 المركز للتجفيف (العكس خطأ!)', { bold: true, size: 12, color: '#b91c1c' })}
    `,
    'شكل (10-1): خطوات تحضير غاز الكلور وتنقيته وتجفيفه بالترتيب الصحيح في المختبر.'
  );

  // 8b. Unit 9 Lesson 1 & 6 - Oxides & Industrial Pollution
  add(
    'u9-l1',
    760,
    310,
    'مقارنة أكاسيد الفلزات وأكاسيد اللافلزات، ومكافحة التلوث الصناعي',
    `
      <rect x="395" y="65" width="345" height="205" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      ${svgTxt(567, 88, 'الأكاسيد القاعدية مقابل الأكاسيد الحمضية', { bold: true, size: 13, color: '#1d4ed8' })}
      ${svgTxt(567, 122, '1. أكسيد فلز (مثل MgO من حرق المغنيسيوم):', { size: 11.5, bold: true })}
      ${svgTxt(567, 144, 'يذوب في الماء مكوناً هيدروكسيداً (يزرّق دوار الشمس)', { size: 11, color: '#2563eb', bold: true })}
      ${svgTxt(567, 180, '2. أكسيد لافلز (مثل SO2 و CO2 من حرق الكبريت/الفحم):', { size: 11.5, bold: true })}
      ${svgTxt(567, 202, 'يذوب في الماء مكوناً حمضاً (يحمر دوار الشمس)', { size: 11, color: '#dc2626', bold: true })}
      ${svgTxt(567, 240, '2Mg + O2 ⟶ 2MgO   |   S + O2 ⟶ SO2', { size: 11.5, bold: true, color: '#0f172a' })}

      <rect x="20" y="65" width="355" height="205" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
      ${svgTxt(197, 88, 'معالجة التلوث الصناعي وحماية التربة والمياه', { bold: true, size: 12.5, color: '#15803d' })}
      ${svgTxt(197, 122, '• تركيب مرشحات (فلاتر) في مداخن المصانع لحجز الغازات', { size: 11 })}
      ${svgTxt(197, 146, '• معادلة الغازات الحمضية برذاذ الجير القاعدي Ca(OH)2', { size: 11, bold: true, color: '#0f766e' })}
      ${svgTxt(197, 174, '• الحفاظ على الرقم الهيدروجيني للتربة بين (6 و 7)', { size: 11, bold: true, color: '#15803d' })}
      ${svgTxt(197, 202, '• عدم تصريف مخلفات المصانع الكيميائية في الأنهار والآبار', { size: 11 })}
      ${svgTxt(197, 234, '• استخدام الأسمدة والمبيدات باعتدال وتحت إشراف زراعي', { size: 11 })}
    `,
    'شكل (9-4): الفرق بين الأكاسيد القاعدية والحمضية، وطرق الحد من التلوث الكيميائي الصناعي.'
  );

  // 8c. Unit 10 Lesson 1 - Halogens Progression
  add(
    'u10-l1',
    760,
    270,
    'تدرج الخواص الفيزيائية والألوان لعناصر مجموعة الهالوجينات (المجموعة 7أ)',
    `
      ${[
        { x: 565, sym: 'F2 — الفلور', state: 'غاز أصفر باهت', note: 'الأنشط كيميائياً', bg: '#fef9c3', c: '#a16207' },
        { x: 388, sym: 'Cl2 — الكلور', state: 'غاز أخضر مصفر', note: 'معقّم للمياه ومبيّض', bg: '#ecfccb', c: '#3f6212' },
        { x: 211, sym: 'Br2 — البروم', state: 'سائل بني محمر', note: 'اللافلز السائل الوحيد', bg: '#ffedd5', c: '#c2410c' },
        { x: 34, sym: 'I2 — اليود', state: 'صلب رمادي داكن', note: 'يتسامى لبخار بنفسجي', bg: '#f3e8ff', c: '#7e22ce' },
      ].map((h) => `
        <rect x="${h.x}" y="70" width="160" height="150" rx="10" fill="${h.bg}" stroke="${h.c}" stroke-width="1.8"/>
        ${svgTxt(h.x + 80, 105, h.sym, { bold: true, size: 13.5, color: h.c })}
        ${svgTxt(h.x + 80, 145, h.state, { bold: true, size: 12 })}
        ${svgTxt(h.x + 80, 185, h.note, { size: 11, color: '#334155', bold: true })}
      `).join('')}
    `,
    'شكل (10-2): تدرج الحالة الفيزيائية والألوان من أعلى المجموعة إلى أسفلها (غاز ← سائل ← صلب).',
    'تسمى هالوجينات أي (مكوّنات الأملاح) لأنها تتفاعل مع الفلزات القلوية مكونة أملاحاً مثل NaCl'
  );

  return out;
}
