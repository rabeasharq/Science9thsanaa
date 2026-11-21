import { renderSvgToPng, svgArrow, svgCallout, svgCanvas, svgPin, svgStepBadge, svgTxt } from './arabicShaper';

export function buildChemDiagrams(): Record<string, { png: Buffer; caption: string; width: number; height: number }> {
  const out: Record<string, { png: Buffer; caption: string; width: number; height: number }> = {};

  const add = (id: string, w: number, h: number, title: string, body: string, caption: string, footer?: string) => {
    const svg = svgCanvas(w, h, title, body, footer);
    out[id] = { png: renderSvgToPng(svg, 1120), caption, width: 520, height: Math.round((520 * h) / w) };
  };

  // ==================== u1-l1: مكونات المحلول وخطوات تحضير حالات الإشباع الثلاث ====================
  add(
    'u1-l1',
    820,
    400,
    'خطوات تحضير المحاليل وتدرج الإشباع (غير مشبع ← مشبع ← فوق مشبع)',
    `
      <!-- RTL Flow Arrows between steps -->
      ${svgArrow(548, 195, 512, 195, 'teal', 2.6)}
      ${svgArrow(286, 195, 250, 195, 'amber', 2.6)}

      <!-- Step 1 (Right): Unsaturated -->
      ${svgStepBadge(672, 62, 210, 'الخطوة 1: محلول غير مشبع', '#0284c7', '#e0f2fe')}
      <!-- Spoon pouring solute -->
      <path d="M685 95 L728 114" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="682" cy="95" rx="12" ry="5" fill="#94a3b8"/>
      <circle cx="678" cy="112" r="2.5" fill="#0369a1"/><circle cx="672" cy="126" r="2.5" fill="#0369a1"/>
      <!-- Beaker 1 -->
      <path d="M582 135 L582 285 Q582 295 592 295 L742 295 Q752 295 752 285 L752 135" fill="none" stroke="#0284c7" stroke-width="2.8"/>
      <rect x="585" y="172" width="164" height="120" rx="6" fill="url(#grad-water)"/>
      <ellipse cx="667" cy="172" rx="82" ry="7" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.2"/>
      ${[0, 1, 2, 3].map((i) => `<circle cx="${612 + i * 36}" cy="${208 + (i % 2) * 32}" r="5.5" fill="#0369a1" stroke="#fff" stroke-width="1.2"/>`).join('')}
      ${svgCallout(612, 208, 667, 326, '1', 'جزيئات المذاب (تختفي كلياً)', { color: '#0369a1', sub: 'يقبل إذابة كمية إضافية' })}

      <!-- Step 2 (Middle): Saturated -->
      ${svgStepBadge(402, 62, 205, 'الخطوة 2: محلول مشبع', '#0f766e', '#f0fdfa')}
      <path d="M316 135 L316 285 Q316 295 326 295 L476 295 Q486 295 486 285 L486 135" fill="none" stroke="#0f766e" stroke-width="2.8"/>
      <rect x="319" y="172" width="164" height="120" rx="6" fill="#7dd3fc"/>
      <ellipse cx="401" cy="172" rx="82" ry="7" fill="#bae6fd" stroke="#0f766e" stroke-width="1.2"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${340 + (i % 4) * 40}" cy="${198 + Math.floor(i / 4) * 34}" r="5.5" fill="#0f766e" stroke="#fff" stroke-width="1.2"/>`).join('')}
      <!-- Precipitate at bottom -->
      <polygon points="355,290 368,274 382,290" fill="#475569"/>
      <polygon points="376,290 392,272 408,290" fill="#334155"/>
      <polygon points="402,290 416,275 430,290" fill="#64748b"/>
      <polygon points="424,290 438,278 450,290" fill="#475569"/>
      ${svgCallout(395, 282, 401, 326, '2', 'راسب فائض في القاع', { color: '#0f766e', sub: 'تشبع المذيب عند نفس الحرارة' })}

      <!-- Step 3 (Left): Supersaturated + Heat -->
      ${svgStepBadge(138, 62, 224, 'الخطوة 3: فوق مشبع بالتسخين', '#b45309', '#fef3c7')}
      <path d="M52 125 L52 248 Q52 258 62 258 L212 258 Q222 258 222 248 L222 125" fill="none" stroke="#b45309" stroke-width="2.8"/>
      <rect x="55" y="152" width="164" height="103" rx="6" fill="#fde68a"/>
      <ellipse cx="137" cy="152" rx="82" ry="7" fill="#fef3c7" stroke="#b45309" stroke-width="1.2"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<circle cx="${74 + (i % 5) * 31}" cy="${178 + Math.floor(i / 5) * 32}" r="5.5" fill="#b45309" stroke="#fff" stroke-width="1.2"/>`).join('')}
      <!-- Wire gauze + Tripod + Bunsen flame -->
      <line x1="44" y1="262" x2="230" y2="262" stroke="#475569" stroke-width="4"/>
      <path d="M126 296 Q137 264 148 296 Z" fill="url(#grad-flame)"/>
      <rect x="129" y="295" width="16" height="12" rx="2" fill="#475569"/>
      ${svgCallout(137, 278, 138, 330, '3', 'التسخين يباعد الجزيئات', { color: '#b45309', sub: 'يذوب الراسب وبالتبريد يتبلور' })}
    `,
    'شكل (1-1): خطوات تحضير المحاليل وتدرج الإشباع (غير مشبع ← مشبع ← فوق مشبع بالتسخين).',
    'القاعدة: المحلول مخلوط متجانس تماماً لا ينفصل بالترشيح = مذاب (أقل) + مذيب (أكبر مثل الماء)'
  );

  // ==================== u1-l2: أنواع المحاليل الثلاثة وخطوات تسريع الذوبان ====================
  add(
    'u1-l2',
    820,
    400,
    'أنواع المحاليل حسب الحالة الفيزيائية وعوامل تسريع الذوبان',
    `
      <!-- Top Row: 3 Types of Solutions (RTL: Gas, Liquid, Solid) -->
      ${svgStepBadge(672, 62, 220, '1. محلول غازي (الهواء)', '#0284c7', '#eff6ff')}
      <rect x="558" y="94" width="228" height="122" rx="10" fill="#eff6ff" stroke="#0284c7" stroke-width="1.8"/>
      <circle cx="672" cy="145" r="36" fill="#dbeafe" stroke="#0284c7" stroke-dasharray="4 3"/>
      <circle cx="655" cy="135" r="6" fill="#0284c7"/><circle cx="688" cy="140" r="6" fill="#0284c7"/>
      <circle cx="668" cy="158" r="5" fill="#dc2626"/><circle cx="686" cy="160" r="5" fill="#16a34a"/>
      ${svgTxt(672, 198, 'مذيب غاز النيتروجين 78% + O2 21%', { size: 10.5, bold: true, color: '#1e3a8a' })}

      ${svgStepBadge(410, 62, 220, '2. محاليل سائلة (3 صور)', '#0f766e', '#f0fdfa')}
      <rect x="296" y="94" width="228" height="122" rx="10" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.8"/>
      <rect x="315" y="114" width="54" height="58" rx="4" fill="#bae6fd" stroke="#0284c7"/>
      ${svgTxt(342, 146, 'صلب/سائل', { size: 9.5, bold: true })}
      ${svgTxt(342, 188, 'ملح+ماء', { size: 10, bold: true, color: '#0369a1' })}
      <rect x="383" y="114" width="54" height="58" rx="4" fill="#fef3c7" stroke="#d97706"/>
      ${svgTxt(410, 146, 'سائل/سائل', { size: 9.5, bold: true })}
      ${svgTxt(410, 188, 'خل+ماء', { size: 10, bold: true, color: '#b45309' })}
      <rect x="451" y="114" width="54" height="58" rx="4" fill="#fee2e2" stroke="#dc2626"/>
      ${svgTxt(478, 146, 'غاز/سائل', { size: 9.5, bold: true })}
      ${svgTxt(478, 188, 'غاز CO2', { size: 10, bold: true, color: '#dc2626' })}
      ${svgTxt(410, 206, 'تحذير: ذوبان الغازات يزداد بالتبريد والضغط!', { size: 10, bold: true, color: '#dc2626' })}

      ${svgStepBadge(148, 62, 220, '3. محلول صلب (السبائك)', '#b45309', '#fffbeb')}
      <rect x="34" y="94" width="228" height="122" rx="10" fill="#fffbeb" stroke="#b45309" stroke-width="1.8"/>
      <circle cx="148" cy="144" r="34" fill="#fde047" stroke="#b45309" stroke-width="3"/>
      <circle cx="148" cy="144" r="22" fill="#fffbeb" stroke="#b45309" stroke-width="1.5"/>
      ${svgTxt(148, 198, 'سبيكة الذهب عيار 21 (ذهب + نحاس)', { size: 10.5, bold: true, color: '#92400e' })}

      <!-- Bottom Row: 3 Steps for Speeding Up Dissolution -->
      <rect x="34" y="232" width="752" height="126" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.6"/>
      ${svgTxt(410, 253, 'خطوات تسريع تحضير المحلول للصلب في السائل (بالترتيب العملي):', { size: 12.5, bold: true, color: '#0f766e' })}
      ${svgArrow(548, 305, 515, 305, 'teal', 2.4)}
      ${svgArrow(295, 305, 262, 305, 'teal', 2.4)}

      <rect x="556" y="266" width="210" height="78" rx="8" fill="#ffffff" stroke="#0f766e"/>
      <rect x="572" y="280" width="22" height="22" fill="#e2e8f0" stroke="#475569"/>
      <circle cx="622" cy="296" r="2" fill="#475569"/><circle cx="629" cy="292" r="2" fill="#475569"/><circle cx="634" cy="298" r="2" fill="#475569"/>
      ${svgTxt(695, 294, '1. سحق المذاب', { size: 11.5, bold: true, color: '#0f766e' })}
      ${svgTxt(661, 326, 'زيادة مساحة السطح الملامس للمذيب', { size: 10, color: '#475569' })}

      <rect x="304" y="266" width="206" height="78" rx="8" fill="#ffffff" stroke="#0284c7"/>
      <line x1="335" y1="276" x2="320" y2="314" stroke="#0284c7" stroke-width="3"/>
      <path d="M312 296 Q327 306 342 296" fill="none" stroke="#38bdf8" stroke-width="2"/>
      ${svgTxt(428, 294, '2. التحريك المستمر', { size: 11.5, bold: true, color: '#0369a1' })}
      ${svgTxt(407, 326, 'توزيع الجزيئات ومنع التراكم', { size: 10, color: '#475569' })}

      <rect x="52" y="266" width="206" height="78" rx="8" fill="#ffffff" stroke="#dc2626"/>
      <path d="M76 312 Q84 282 92 312 Z" fill="url(#grad-flame)"/>
      ${svgTxt(174, 294, '3. رفع الحرارة', { size: 11.5, bold: true, color: '#dc2626' })}
      ${svgTxt(155, 326, 'زيادة سرعة حركة الجزيئات (للصلب)', { size: 10, color: '#475569' })}
    `,
    'شكل (1-2): تصنيف المحاليل الثلاثة حسب المذيب، وخطوات تسريع إذابة المواد الصلبة.',
    'الغازات عكس الصلب: تقل ذوبانيتها بالتسخين وتزداد بالتبريد والضغط (مثل المشروبات الغازية)'
  );

  // ==================== u2-l1: الكواشف الأربعة + الدائرة الكهربائية للأيونات + التخفيف الآمن ====================
  add(
    'u2-l1',
    820,
    450,
    'جهاز التوصيل الأيوني للمحاليل، اختبار الكواشف الأربعة، وقواعد التخفيف الآمن',
    `
      <!-- Top Right: Indicators with Drawn Test Tubes -->
      <rect x="415" y="60" width="385" height="340" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.6"/>
      ${svgTxt(607, 82, 'الخطوة 1: اختبار الكواشف الأربعة بالأنابيب', { bold: true, size: 13, color: '#0f766e' })}
      ${svgTxt(736, 108, 'الكاشف', { bold: true, size: 11.5 })}
      ${svgTxt(632, 108, 'في الحمض', { bold: true, size: 11.5, color: '#dc2626' })}
      ${svgTxt(544, 108, 'متعادل', { bold: true, size: 11.5, color: '#475569' })}
      ${svgTxt(456, 108, 'في القاعدة', { bold: true, size: 11.5, color: '#2563eb' })}
      ${[
        { name: 'دوار الشمس', a: 'أحمر', ac: '#ef4444', n: 'بنفسجي', nc: '#7c3aed', b: 'أزرق', bc: '#2563eb', y: 148 },
        { name: 'ميثيل برتقالي', a: 'أحمر', ac: '#ef4444', n: 'برتقالي', nc: '#f97316', b: 'أصفر', bc: '#eab308', bt: '#92400e', y: 214 },
        { name: 'الفينولفثالين', a: 'عديم', ac: '#e2e8f0', at: '#475569', n: 'عديم', nc: '#e2e8f0', nt: '#475569', b: 'وردي', bc: '#ec4899', y: 280 },
        { name: 'الشاي الأحمر', a: 'أصفر فاتح', ac: '#fde047', at: '#854d0e', n: 'أحمر بني', nc: '#92400e', b: 'داكن جداً', bc: '#451a03', y: 346 },
      ].map((r) => `
        <line x1="428" y1="${r.y - 28}" x2="788" y2="${r.y - 28}" stroke="#e2e8f0" stroke-width="1"/>
        ${svgTxt(736, r.y + 4, r.name, { bold: true, size: 11.5 })}
        <!-- Drawn Test Tube 1 (Acid) -->
        <rect x="614" y="${r.y - 22}" width="36" height="44" rx="12" fill="#ffffff" stroke="#64748b" stroke-width="1.4"/>
        <rect x="616" y="${r.y - 6}" width="32" height="26" rx="9" fill="${r.ac}"/>
        ${svgTxt(632, r.y + 34, r.a, { size: 10.2, bold: true, color: r.at ?? r.ac })}
        <!-- Drawn Test Tube 2 (Neutral) -->
        <rect x="526" y="${r.y - 22}" width="36" height="44" rx="12" fill="#ffffff" stroke="#64748b" stroke-width="1.4"/>
        <rect x="528" y="${r.y - 6}" width="32" height="26" rx="9" fill="${r.nc}"/>
        ${svgTxt(544, r.y + 34, r.n, { size: 10.2, bold: true, color: r.nt ?? r.nc })}
        <!-- Drawn Test Tube 3 (Base) -->
        <rect x="438" y="${r.y - 22}" width="36" height="44" rx="12" fill="#ffffff" stroke="#64748b" stroke-width="1.4"/>
        <rect x="440" y="${r.y - 6}" width="32" height="26" rx="9" fill="${r.bc}"/>
        ${svgTxt(456, r.y + 34, r.b, { size: 10.2, bold: true, color: r.bt ?? r.bc })}
      `).join('')}

      <!-- Top Left: Electrolysis Circuit with Battery, Bulb, Graphite Electrodes -->
      <rect x="20" y="60" width="380" height="196" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.6"/>
      ${svgTxt(210, 82, 'الخطوة 2: جهاز التوصيل وهجرة الأيونات', { bold: true, size: 13, color: '#0f766e' })}
      <!-- Battery + Bulb circuit -->
      <rect x="118" y="96" width="52" height="22" rx="4" fill="#334155"/>
      ${svgTxt(144, 111, 'بطارية', { size: 10, color: '#fff', bold: true })}
      <circle cx="242" cy="107" r="14" fill="#fef08a" stroke="#eab308" stroke-width="2.5"/>
      ${svgTxt(242, 111, 'يضيء', { size: 9.5, bold: true, color: '#92400e' })}
      <polyline points="170,107 228,107" fill="none" stroke="#334155" stroke-width="2"/>
      <polyline points="118,107 104,107 104,142" fill="none" stroke="#2563eb" stroke-width="2.2"/>
      <polyline points="256,107 278,107 278,142" fill="none" stroke="#dc2626" stroke-width="2.2"/>
      <!-- Beaker + Electrodes -->
      <path d="M84 146 L84 226 Q84 234 92 234 L290 234 Q298 234 298 226 L298 146" fill="none" stroke="#0284c7" stroke-width="2.2"/>
      <rect x="86" y="164" width="210" height="68" rx="4" fill="#e0f2fe"/>
      <rect x="98" y="138" width="12" height="72" rx="2" fill="#1e293b"/>
      <rect x="272" y="138" width="12" height="72" rx="2" fill="#1e293b"/>
      ${svgTxt(104, 134, 'مهبط (-)', { size: 10, bold: true, color: '#2563eb' })}
      ${svgTxt(278, 134, 'مصعد (+)', { size: 10, bold: true, color: '#dc2626' })}
      <!-- Migrating Ions -->
      <circle cx="152" cy="196" r="13" fill="#fee2e2" stroke="#dc2626" stroke-width="1.6"/>
      ${svgTxt(152, 200, 'H+', { size: 11, bold: true, color: '#dc2626' })}
      ${svgArrow(137, 196, 114, 196, 'red', 2)}
      <circle cx="228" cy="196" r="13" fill="#dbeafe" stroke="#2563eb" stroke-width="1.6"/>
      ${svgTxt(228, 200, 'Cl-', { size: 11, bold: true, color: '#2563eb' })}
      ${svgArrow(243, 196, 268, 196, 'blue', 2)}
      ${svgTxt(210, 249, 'الماء المقطر و Cu(OH)2 غير الذائب لا يضيئان المصباح', { size: 10.2, bold: true, color: '#15803d' })}

      <!-- Bottom Left: Acid Dilution Safety Visual -->
      <rect x="20" y="266" width="380" height="134" rx="10" fill="#fef2f2" stroke="#ef4444" stroke-width="1.6"/>
      ${svgTxt(210, 286, 'الخطوة 3: أمان تخفيف الحمض المركز', { bold: true, size: 12.5, color: '#b91c1c' })}
      <!-- Safe side (right) -->
      <rect x="220" y="296" width="166" height="94" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
      <rect x="275" y="326" width="56" height="44" rx="4" fill="#bae6fd" stroke="#0284c7"/>
      <path d="M318 302 L306 322" stroke="#dc2626" stroke-width="4" stroke-dasharray="3 2"/>
      ${svgTxt(303, 314, 'حمض ← ماء', { size: 10.5, bold: true, color: '#15803d' })}
      ${svgTxt(303, 384, 'صح ✓ يمتص الماء الحرارة بأمان', { size: 10, bold: true, color: '#166534' })}
      <!-- Danger side (left) -->
      <rect x="34" y="296" width="166" height="94" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5"/>
      <rect x="89" y="326" width="56" height="44" rx="4" fill="#fca5a5" stroke="#dc2626"/>
      <path d="M100 326 L90 310 M132 326 L142 310" stroke="#ef4444" stroke-width="2.5"/>
      ${svgTxt(117, 314, 'ماء ← حمض', { size: 10.5, bold: true, color: '#b91c1c' })}
      ${svgTxt(117, 384, 'خطأ ✗ فوران وتطاير حارق!', { size: 10, bold: true, color: '#991b1b' })}
    `,
    'شكل (2-1): جدول الكواشف الأربعة بالأنابيب، وجهاز هجرة الأيونات، وقاعدة تخفيف الحمض بالماء.',
    'القاعدة الوزارية: كل قلوي قاعدة وليس كل قاعدة قلوياً (مثل Cu(OH)2 لا يذوب في الماء)'
  );

  // ==================== u2-l2: مقياس pH الملوّن + مقارنة التأين التام والجزئي ====================
  const phColors = ['#dc2626','#ea580c','#f97316','#f59e0b','#eab308','#84cc16','#22c55e','#10b981','#14b8a6','#06b6d4','#0284c7','#2563eb','#4f46e5','#6d28d9','#581c87'];
  add(
    'u2-l2',
    820,
    410,
    'مقياس الرقم الهيدروجيني (pH) وتدرج قوة الحموض والقواعد حسب درجة التأين',
    `
      ${svgStepBadge(665, 58, 250, 'الخطوة 1: قراءة التدرج من 0 إلى 14', '#0f766e', '#f0fdfa')}
      ${phColors.map((c, i) => {
        const x = 44 + i * 48.8;
        return `<rect x="${x}" y="94" width="46" height="54" rx="5" fill="${c}"/>
                ${svgTxt(x + 23, 127, String(i), { bold: true, size: 14.5, color: '#ffffff' })}`;
      }).join('')}
      ${svgArrow(360, 164, 48, 164, 'red', 2.5)}
      ${svgTxt(205, 184, 'تزداد قوة الحمض ← نحو الصفر (pH < 7)', { bold: true, size: 11.5, color: '#dc2626' })}
      <rect x="366" y="152" width="88" height="32" rx="6" fill="#ecfdf5" stroke="#059669" stroke-width="1.6"/>
      ${svgTxt(410, 173, 'متعادل = 7', { bold: true, size: 12, color: '#059669' })}
      ${svgArrow(460, 164, 772, 164, 'blue', 2.5)}
      ${svgTxt(615, 184, 'تزداد قوة القاعدة → نحو 14 (pH > 7)', { bold: true, size: 11.5, color: '#1d4ed8' })}

      <!-- Strong vs Weak Ionization Beakers -->
      ${svgStepBadge(410, 200, 320, 'الخطوة 2: لماذا تتفاوت القوة؟ (درجة التأين في الماء)', '#1d4ed8', '#eff6ff')}
      <!-- Strong Acid -->
      <rect x="430" y="234" width="355" height="128" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.6"/>
      ${svgTxt(607, 256, 'حمض قوي: مثل HCl و H2SO4 (pH ≈ 1)', { bold: true, size: 12, color: '#b91c1c' })}
      <rect x="655" y="270" width="110" height="78" rx="6" fill="#fee2e2" stroke="#dc2626"/>
      ${[0, 1, 2, 3].map((i) => `
        <circle cx="${675 + (i % 2) * 32}" cy="${290 + Math.floor(i / 2) * 30}" r="10" fill="#dc2626"/>
        ${svgTxt(675 + (i % 2) * 32, 294 + Math.floor(i / 2) * 30, 'H+', { size: 9, color: '#fff', bold: true })}
        <circle cx="${738}" cy="${290 + Math.floor(i / 2) * 30}" r="10" fill="#2563eb"/>
        ${svgTxt(738, 294 + Math.floor(i / 2) * 30, 'Cl-', { size: 9, color: '#fff', bold: true })}
      `).join('')}
      ${svgTxt(540, 292, 'تأين تام 100%', { size: 12, bold: true, color: '#b91c1c' })}
      ${svgTxt(540, 314, 'أيونات H+ كثيرة جداً', { size: 11 })}
      ${svgTxt(540, 336, 'إضاءة المصباح قوية جداً ✓', { size: 11, bold: true, color: '#d97706' })}

      <!-- Weak Acid -->
      <rect x="35" y="234" width="355" height="128" rx="10" fill="#fffbeb" stroke="#d97706" stroke-width="1.6"/>
      ${svgTxt(212, 256, 'حمض ضعيف: مثل الخل والليمون (pH ≈ 3)', { bold: true, size: 12, color: '#b45309' })}
      <rect x="260" y="270" width="110" height="78" rx="6" fill="#fef3c7" stroke="#d97706"/>
      <circle cx="282" cy="292" r="10" fill="#dc2626"/>
      ${svgTxt(282, 296, 'H+', { size: 9, color: '#fff', bold: true })}
      <rect x="310" y="282" width="44" height="20" rx="10" fill="#94a3b8"/>
      ${svgTxt(332, 296, 'جزيء', { size: 9, color: '#fff', bold: true })}
      <rect x="278" y="314" width="68" height="20" rx="10" fill="#94a3b8"/>
      ${svgTxt(312, 328, 'معظمه غير متأين', { size: 8.5, color: '#fff', bold: true })}
      ${svgTxt(145, 292, 'تأين جزئي ضعيف', { size: 12, bold: true, color: '#b45309' })}
      ${svgTxt(145, 314, 'أيونات H+ قليلة جداً', { size: 11 })}
      ${svgTxt(145, 336, 'إضاءة المصباح خافتة وضعيفة', { size: 11, bold: true, color: '#475569' })}
    `,
    'شكل (2-2): مقياس الرقم الهيدروجيني (pH) الملوّن ومقارنة التأين التام للحمض القوي والجزئي للضعيف.',
    'التربة الصالحة للزراعة: pH بين 6 و 7 — وإن زادت حموضتها تُعالج بالجير القاعدي Ca(OH)2'
  );

  // ==================== u3-l1: خطوات المعايرة والتعادل + أوراق العثرب ====================
  add(
    'u3-l1',
    820,
    400,
    'تجربة التعادل بالمعايرة (حمض + قاعدة ⟶ ملح + ماء) وتطبيق العثرب',
    `
      ${svgArrow(548, 195, 512, 195, 'teal', 2.6)}
      ${svgArrow(288, 195, 252, 195, 'amber', 2.6)}

      <!-- Step 1: Flask with NaOH + Phenolphthalein (Pink) -->
      ${svgStepBadge(672, 60, 230, 'الخطوة 1: قاعدة + فينولفثالين', '#db2777', '#fdf2f8')}
      <rect x="655" y="92" width="12" height="58" fill="#e2e8f0" stroke="#475569"/>
      <polygon points="655,150 667,150 661,164" fill="#0284c7"/>
      <circle cx="661" cy="176" r="4" fill="#0284c7"/>
      ${svgTxt(736, 128, 'سحاحة بها حمض HCl', { size: 10.5, bold: true, color: '#0369a1' })}
      <!-- Erlenmeyer flask -->
      <path d="M645 190 L677 190 L712 276 Q715 286 704 286 L618 286 Q607 286 610 276 Z" fill="#fbcfe8" stroke="#db2777" stroke-width="2.2"/>
      ${svgCallout(661, 252, 672, 326, '1', 'لون وردي بالقاعدة NaOH', { color: '#be185d', sub: 'أضف HCl قطرة قطرة بالرج' })}

      <!-- Step 2: Endpoint Neutral pH=7 (Colorless NaCl + H2O) -->
      ${svgStepBadge(402, 60, 210, 'الخطوة 2: نقطة التعادل (pH = 7)', '#0f766e', '#f0fdfa')}
      <path d="M385 162 L417 162 L452 252 Q455 262 444 262 L358 262 Q347 262 350 252 Z" fill="#e0f2fe" stroke="#0f766e" stroke-width="2.2"/>
      ${svgTxt(401, 224, 'NaCl + H2O', { size: 12, bold: true, color: '#0f766e' })}
      ${svgTxt(401, 245, 'اختفى اللون الوردي تماماً', { size: 10, bold: true, color: '#0369a1' })}
      ${svgCallout(401, 260, 401, 326, '2', 'HCl + NaOH ⟶ NaCl + H2O', { color: '#0f766e', sub: 'بالتسخين يتبخر الماء ويبقى الملح' })}

      <!-- Step 3: Everyday Neutralization (Ant Sting + Othrob Leaf) -->
      ${svgStepBadge(138, 60, 226, 'الخطوة 3: تطبيق حياتي ووزاري', '#15803d', '#f0fdf4')}
      <rect x="34" y="102" width="210" height="184" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8"/>
      <!-- Leaf drawing -->
      <path d="M138 118 Q182 142 162 192 Q138 205 114 192 Q94 142 138 118 Z" fill="#4ade80" stroke="#15803d" stroke-width="2"/>
      <line x1="138" y1="122" x2="138" y2="205" stroke="#166534" stroke-width="2"/>
      ${svgTxt(138, 160, 'ورق العثرب', { size: 11, bold: true, color: '#052e16' })}
      ${svgTxt(138, 230, 'ذو خواص قاعدية يعادل', { size: 11, bold: true, color: '#15803d' })}
      ${svgTxt(138, 250, 'حمض النمليك للسعة النمل/النحل', { size: 10.5, bold: true })}
      ${svgTxt(138, 272, 'ومع المعدة: أقراص Mg(OH)2', { size: 10.5, color: '#0369a1', bold: true })}
      ${svgCallout(138, 195, 138, 326, '3', 'مصيدة وزارية: العثرب قاعدي', { color: '#15803d', sub: 'يعادل حمض لسعة الحشرات' })}
    `,
    'شكل (3-1): خطوات تجربة المعايرة والتعادل، وأهميتها في علاج الحموضة ولسعة النمل بالعثرب.'
  );

  // ==================== u3-l2: تفاعل الحموض مع الكربونات وتعكير ماء الجير ====================
  add(
    'u3-l2',
    820,
    400,
    'خطوات تفاعل الحموض مع أملاح الكربونات والكشف عن غاز CO₂ بماء الجير',
    `
      ${svgArrow(538, 195, 488, 195, 'teal', 2.6)}
      <!-- Step 1: Flask CaCO3 + HCl / H3PO4 -->
      ${svgStepBadge(668, 60, 228, 'الخطوة 1: تفاعل الفوران في الدورق', '#0284c7', '#eff6ff')}
      <path d="M645 130 L691 130 L728 242 Q732 254 718 254 L618 254 Q604 254 608 242 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.4"/>
      <!-- Marble chips CaCO3 at bottom -->
      <circle cx="645" cy="240" r="7" fill="#e2e8f0" stroke="#64748b"/>
      <circle cx="668" cy="241" r="8" fill="#cbd5e1" stroke="#64748b"/>
      <circle cx="690" cy="240" r="6" fill="#e2e8f0" stroke="#64748b"/>
      <!-- Bubbles -->
      <circle cx="655" cy="205" r="4" fill="#ffffff" stroke="#0284c7"/>
      <circle cx="672" cy="186" r="5" fill="#ffffff" stroke="#0284c7"/>
      <circle cx="662" cy="162" r="4" fill="#ffffff" stroke="#0284c7"/>
      ${svgCallout(668, 240, 668, 306, '1', 'رخام / طباشير CaCO3 + حمض', { color: '#0284c7', sub: 'يتصاعد فوران غاز CO2↑' })}

      <!-- Step 2: Delivery tube into Limewater -->
      ${svgStepBadge(375, 60, 232, 'الخطوة 2: إمرار الغاز على ماء الجير', '#0f766e', '#f0fdfa')}
      <path d="M668 128 L668 102 L375 102 L375 232" fill="none" stroke="#334155" stroke-width="4"/>
      <rect x="330" y="138" width="90" height="122" rx="18" fill="#ffffff" stroke="#0f766e" stroke-width="2.2"/>
      <rect x="333" y="190" width="84" height="67" rx="14" fill="#f1f5f9" stroke="#cbd5e1"/>
      <circle cx="375" cy="232" r="4" fill="#ffffff" stroke="#0f766e"/>
      <circle cx="364" cy="212" r="4" fill="#ffffff" stroke="#0f766e"/>
      <circle cx="386" cy="216" r="3.5" fill="#ffffff" stroke="#0f766e"/>
      ${svgCallout(375, 224, 375, 306, '2', 'يتعكر ماء الجير الرائق Ca(OH)2', { color: '#0f766e', sub: 'لتكوّن راسب أبيض CaCO3' })}

      <!-- Step 3: Key Ministerial Equations Box -->
      ${svgStepBadge(138, 60, 220, 'الخطوة 3: المعادلات الوزارية', '#b91c1c', '#fef2f2')}
      <rect x="28" y="102" width="220" height="236" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.8"/>
      ${svgTxt(138, 130, '1. مع الهيدروكلوريك:', { size: 11.5, bold: true, color: '#0f172a' })}
      ${svgTxt(138, 154, 'CaCO3 + 2HCl ⟶', { size: 11.5, bold: true, color: '#1d4ed8' })}
      ${svgTxt(138, 174, 'CaCl2 + H2O + CO2↑', { size: 11.5, bold: true, color: '#dc2626' })}
      <line x1="45" y1="192" x2="230" y2="192" stroke="#fca5a5"/>
      ${svgTxt(138, 214, '2. مع حمض الفوسفوريك (هام!):', { size: 11.5, bold: true, color: '#b91c1c' })}
      ${svgTxt(138, 238, '2H3PO4 + 3CaCO3 ⟶', { size: 11.2, bold: true, color: '#1d4ed8' })}
      ${svgTxt(138, 258, 'Ca3(PO4)2 + 3H2O + 3CO2↑', { size: 11, bold: true, color: '#dc2626' })}
      <line x1="45" y1="278" x2="230" y2="278" stroke="#fca5a5"/>
      ${svgTxt(138, 300, 'تطبيقات: طفايات الحريق والبيكنج باودر', { size: 10.2, bold: true, color: '#15803d' })}
      ${svgTxt(138, 320, 'ومضاره: تآكل الرخام والأسنان', { size: 10.2, color: '#475569' })}
    `,
    'شكل (3-2): خطوات تجربة تفاعل الحموض مع الكربونات وتعكير ماء الجير، والمعادلات الوزارية.',
    'احفظ الصيغة الوزارية: فوسفات الكالسيوم = Ca3(PO4)2'
  );

  // ==================== u3-l3: دورة تكوّن المطر الحمضي وأضراره ====================
  add(
    'u3-l3',
    820,
    400,
    'دورة تكوّن المطر الحمضي (الخطوات 1 ← 2 ← 3) وأضراره على البيئة',
    `
      <!-- Sky background -->
      <rect x="24" y="60" width="772" height="295" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>

      <!-- Step 1 (Right): Factory + Cars releasing SO2 & NO2 -->
      ${svgStepBadge(675, 70, 215, '1. تصاعد أكاسيد الكبريت والنيتروجين', '#dc2626', '#fef2f2')}
      <rect x="650" y="218" width="110" height="72" fill="#64748b" stroke="#334155" stroke-width="2"/>
      <rect x="670" y="165" width="22" height="53" fill="#475569"/>
      <rect x="712" y="178" width="20" height="40" fill="#475569"/>
      <!-- Smoke plumes going up -->
      <circle cx="681" cy="148" r="14" fill="#cbd5e1"/><circle cx="662" cy="130" r="17" fill="#94a3b8"/>
      <circle cx="640" cy="116" r="15" fill="#cbd5e1"/>
      ${svgTxt(705, 255, 'مصانع وعوادم', { size: 11, bold: true, color: '#ffffff' })}
      ${svgTxt(615, 168, 'SO2 و NO2', { size: 12, bold: true, color: '#dc2626' })}
      ${svgArrow(635, 132, 540, 118, 'red', 2.4)}

      <!-- Step 2 (Middle): Clouds forming H2SO4 & HNO3 -->
      ${svgStepBadge(410, 70, 235, '2. الذوبان في السحب ← أحماض', '#d97706', '#fffbeb')}
      <path d="M325 148 Q312 122 342 115 Q365 92 405 106 Q445 94 468 118 Q498 124 484 152 Z" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      ${svgTxt(405, 134, 'H2SO4 + HNO3', { size: 12, bold: true, color: '#fef08a' })}
      <!-- Acid Rain Drops -->
      ${[345, 375, 405, 435, 465].map((x) => `
        <line x1="${x}" y1="160" x2="${x - 8}" y2="195" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="4 3"/>
      `).join('')}
      <!-- Affected Ground / Lake / Forest / Marble -->
      <rect x="295" y="232" width="225" height="58" rx="8" fill="#fef3c7" stroke="#d97706"/>
      ${svgTxt(407, 254, 'هطول المطر الحمضي:', { size: 11.5, bold: true, color: '#b91c1c' })}
      ${svgTxt(407, 274, 'يحمّض التربة والبحيرات ويتلف الجذور', { size: 10.5, bold: true })}

      ${svgArrow(310, 140, 228, 165, 'amber', 2.4)}

      <!-- Step 3 (Left): Marble erosion & Remedies -->
      ${svgStepBadge(145, 70, 210, '3. الأضرار والمعالجة', '#0f766e', '#f0fdfa')}
      <rect x="38" y="106" width="214" height="232" rx="10" fill="#ffffff" stroke="#0f766e" stroke-width="1.8"/>
      <!-- Marble building icon -->
      <polygon points="145,118 98,144 192,144" fill="#cbd5e1" stroke="#475569"/>
      <rect x="108" y="144" width="16" height="42" fill="#e2e8f0" stroke="#475569"/>
      <rect x="137" y="144" width="16" height="42" fill="#e2e8f0" stroke="#475569"/>
      <rect x="166" y="144" width="16" height="42" fill="#e2e8f0" stroke="#475569"/>
      ${svgTxt(145, 206, 'تآكل الرخام والحجر الجيري', { size: 11, bold: true, color: '#dc2626' })}
      ${svgTxt(145, 226, '(تفاعل الحمض مع CaCO3)', { size: 10, color: '#475569' })}
      <line x1="54" y1="240" x2="236" y2="240" stroke="#cbd5e1"/>
      ${svgTxt(145, 262, 'طرق الحل والمكافحة:', { size: 11.5, bold: true, color: '#15803d' })}
      ${svgTxt(145, 284, '• فلاتر مداخن المصانع بالجير', { size: 10.5 })}
      ${svgTxt(145, 304, '• استخدام الطاقة الشمسية النظيفة', { size: 10.5 })}
      ${svgTxt(145, 324, '• معادلة التربة الحمضية بالجير', { size: 10.5, bold: true, color: '#0f766e' })}
    `,
    'شكل (3-3): دورة تكوّن المطر الحمضي من عوادم المصانع، وأضراره وطرق معالجته.',
    'الغازات الرئيسية المسببة للمطر الحمضي: ثاني أكسيد الكبريت SO2 وأكاسيد النيتروجين NO2'
  );

  // ==================== u9-l1: خطوات تحضير وتمييز أكاسيد الفلزات واللافلزات ====================
  add(
    'u9-l1',
    820,
    410,
    'خطوات التمييز العملي بين أكاسيد الفلزات القاعدية وأكاسيد اللافلزات الحمضية',
    `
      <!-- Right side: Metal Oxide (Mg + O2 -> MgO -> Mg(OH)2 -> turns litmus blue) -->
      <rect x="420" y="60" width="380" height="302" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
      ${svgStepBadge(610, 72, 290, '1. أكسيد الفلز (قاعدي): حرق المغنيسيوم Mg', '#1d4ed8', '#dbeafe')}
      <!-- Burning Mg ribbon + tongs -->
      <line x1="720" y1="115" x2="665" y2="145" stroke="#475569" stroke-width="3"/>
      <circle cx="655" cy="152" r="14" fill="#fef08a" stroke="#f59e0b" stroke-width="2"/>
      ${svgTxt(655, 156, 'ضوء', { size: 9.5, bold: true, color: '#b45309' })}
      ${svgArrow(632, 152, 578, 152, 'blue', 2.2)}
      <!-- Beaker with Mg(OH)2 turning litmus blue -->
      <rect x="455" y="122" width="108" height="105" rx="6" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
      <rect x="458" y="164" width="102" height="60" rx="4" fill="#dbeafe"/>
      <rect x="502" y="128" width="12" height="58" fill="#2563eb" stroke="#1e3a8a"/>
      ${svgTxt(509, 212, 'يزرق دوار الشمس', { size: 10.5, bold: true, color: '#1d4ed8' })}
      ${svgTxt(610, 260, '2Mg + O2 ⟶ 2MgO (رماد أبيض)', { size: 11.5, bold: true, color: '#0f172a' })}
      ${svgTxt(610, 285, 'MgO + H2O ⟶ Mg(OH)2 (قلوي)', { size: 11.5, bold: true, color: '#1d4ed8' })}
      ${svgCallout(508, 150, 610, 326, '1', 'أكاسيد الفلزات تذوب مكونة قلويات', { color: '#2563eb', sub: 'تحول دوار الشمس الأحمر إلى أزرق' })}

      <!-- Left side: Nonmetal Oxide (S + O2 -> SO2 -> H2SO3 -> turns litmus red) -->
      <rect x="20" y="60" width="380" height="302" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.8"/>
      ${svgStepBadge(210, 72, 290, '2. أكسيد اللافلز (حمضي): حرق الكبريت S', '#b91c1c', '#fee2e2')}
      <!-- Combustion spoon inside O2 jar -->
      <rect x="262" y="114" width="84" height="114" rx="6" fill="#ffffff" stroke="#475569" stroke-width="2"/>
      <line x1="304" y1="100" x2="304" y2="178" stroke="#334155" stroke-width="3"/>
      <ellipse cx="304" cy="182" rx="14" ry="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>
      ${svgTxt(304, 210, 'لهب أزرق (SO2)', { size: 10, bold: true, color: '#0369a1' })}
      ${svgArrow(250, 170, 194, 170, 'red', 2.2)}
      <!-- Beaker turning litmus red -->
      <rect x="62" y="122" width="112" height="105" rx="6" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>
      <rect x="65" y="164" width="106" height="60" rx="4" fill="#fee2e2"/>
      <rect x="112" y="128" width="12" height="58" fill="#ef4444" stroke="#991b1b"/>
      ${svgTxt(118, 212, 'يحمر دوار الشمس', { size: 10.5, bold: true, color: '#b91c1c' })}
      ${svgTxt(210, 260, 'S + O2 ⟶ SO2 (ثاني أكسيد الكبريت)', { size: 11.5, bold: true, color: '#0f172a' })}
      ${svgTxt(210, 285, 'SO2 + H2O ⟶ H2SO3 (حمض الكبريتوز)', { size: 11.5, bold: true, color: '#dc2626' })}
      ${svgCallout(118, 150, 210, 326, '2', 'أكاسيد اللافلزات تذوب مكونة أحماضاً', { color: '#dc2626', sub: 'تحول دوار الشمس الأزرق إلى أحمر' })}
    `,
    'شكل (9-1): خطوات تحضير وتمييز أكاسيد الفلزات القاعدية (MgO) وأكاسيد اللافلزات الحمضية (SO₂).',
    'تذكّر: غاز CO2 كذلك أكسيد لافلز يذوب في الماء مكوناً حمض الكربونيك الضعيف H2CO3'
  );

  // ==================== u9-l2: تجربة شروط صدأ الحديد الثلاث وطرق الحماية ====================
  add(
    'u9-l2',
    820,
    400,
    'تجربة إثبات شروط صدأ الحديد (الأنابيب الثلاث) وطرق الوقاية والحماية',
    `
      <!-- Right: 3 Test tubes -->
      <rect x="330" y="60" width="470" height="296" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.6"/>
      ${svgTxt(565, 84, 'خطوات التجربة: إثبات أن الصدأ يتطلب الماء + الأكسجين معاً', { bold: true, size: 12.8, color: '#9a3412' })}

      <!-- Tube 1: Tap water + Air -> RUSTS -->
      ${svgStepBadge(710, 100, 128, 'أنبوب 1: ماء + هواء', '#dc2626', '#fee2e2')}
      <rect x="676" y="132" width="68" height="145" rx="22" fill="#e0f2fe" stroke="#475569" stroke-width="2.2"/>
      <rect x="678" y="192" width="64" height="82" rx="18" fill="#7dd3fc"/>
      <!-- Rusty nail -->
      <line x1="710" y1="158" x2="710" y2="255" stroke="#b45309" stroke-width="7" stroke-linecap="round"/>
      <line x1="701" y1="158" x2="719" y2="158" stroke="#9a3412" stroke-width="4"/>
      <circle cx="710" cy="212" r="5" fill="#9a3412"/><circle cx="712" cy="232" r="4" fill="#dc2626"/>
      ${svgTxt(710, 298, 'يصدأ الحديد ✗', { bold: true, size: 11.5, color: '#dc2626' })}
      ${svgTxt(710, 316, 'لتوفر الماء والهواء', { size: 10, color: '#475569' })}

      <!-- Tube 2: Boiled water + Oil seal -> NO RUST -->
      ${svgStepBadge(565, 100, 134, 'أنبوب 2: ماء مغلي+زيت', '#16a34a', '#dcfce7')}
      <rect x="531" y="132" width="68" height="145" rx="22" fill="#ffffff" stroke="#475569" stroke-width="2.2"/>
      <rect x="533" y="180" width="64" height="14" fill="#fde047"/>
      <rect x="533" y="194" width="64" height="80" rx="18" fill="#bae6fd"/>
      <line x1="565" y1="185" x2="565" y2="256" stroke="#64748b" stroke-width="6.5" stroke-linecap="round"/>
      <line x1="556" y1="185" x2="574" y2="185" stroke="#475569" stroke-width="4"/>
      ${svgTxt(565, 173, 'طبقة زيت تمنع الهواء', { size: 9, bold: true, color: '#a16207' })}
      ${svgTxt(565, 298, 'لا يصدأ ✓', { bold: true, size: 11.5, color: '#15803d' })}
      ${svgTxt(565, 316, 'لغياب الأكسجين', { size: 10, color: '#475569' })}

      <!-- Tube 3: Dry Air + CaCl2 -> NO RUST -->
      ${svgStepBadge(420, 100, 132, 'أنبوب 3: CaCl2 جاف', '#16a34a', '#dcfce7')}
      <rect x="386" y="132" width="68" height="145" rx="22" fill="#f1f5f9" stroke="#475569" stroke-width="2.2"/>
      <!-- Stopper -->
      <rect x="396" y="122" width="48" height="14" rx="3" fill="#b45309"/>
      <!-- Dry nail -->
      <line x1="420" y1="158" x2="420" y2="236" stroke="#64748b" stroke-width="6.5" stroke-linecap="round"/>
      <circle cx="404" cy="258" r="5" fill="#ffffff" stroke="#64748b"/><circle cx="420" cy="261" r="5" fill="#ffffff" stroke="#64748b"/><circle cx="435" cy="256" r="5" fill="#ffffff" stroke="#64748b"/>
      ${svgTxt(420, 298, 'لا يصدأ ✓', { bold: true, size: 11.5, color: '#15803d' })}
      ${svgTxt(420, 316, 'لغياب الماء (الرطوبة)', { size: 10, color: '#475569' })}
      ${svgTxt(565, 342, 'CaCl2 اللامائي مادة مجففة تمتص بخار الماء من الأنبوب 3', { size: 10.5, bold: true, color: '#0369a1' })}

      <!-- Left: Protection Methods -->
      <rect x="20" y="60" width="295" height="296" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8"/>
      ${svgTxt(167, 86, 'طرق حماية الحديد من الصدأ', { bold: true, size: 13, color: '#15803d' })}
      ${[
        { y: 114, num: '1', title: 'الطلاء بالدهان أو الشحم', sub: 'يعزل الحديد عن الماء والهواء', c: '#0284c7' },
        { y: 174, num: '2', title: 'الجلفنة (التغطية بالزنك)', sub: 'تغليف الحديد بطبقة خارصين Zn', c: '#0f766e' },
        { y: 234, num: '3', title: 'الطلاء الكهربائي (كروم/نيكل)', sub: 'طبقة لامعة مقاومة للتآكل', c: '#7c3aed' },
        { y: 294, num: '4', title: 'سبائك الستانلس ستيل', sub: 'خلط الحديد بالكروم والنيكل', c: '#b45309' },
      ].map((m) => `
        <rect x="34" y="${m.y}" width="267" height="48" rx="8" fill="#ffffff" stroke="${m.c}" stroke-width="1.4"/>
        ${svgPin(282, m.y + 24, m.num, m.c, 10)}
        ${svgTxt(154, m.y + 20, m.title, { size: 11.5, bold: true, color: '#0f172a' })}
        ${svgTxt(154, m.y + 38, m.sub, { size: 10, color: '#475569' })}
      `).join('')}
    `,
    'شكل (9-2): إثبات شرطي صدأ الحديد (الماء + الأكسجين) في ثلاث أنابيب، وطرق الحماية من الصدأ.'
  );

  // ==================== u9-l3: البنية الذرية للكربون + تآصل الألماس والجرافيت + دائرة التوصيل ====================
  add(
    'u9-l3',
    820,
    410,
    'تركيب ذرة الكربون (C₆) ومقارنة الألماس العازل بالجرافيت الموصل للكهرباء',
    `
      <!-- Right: Carbon Atom (6p, 2 inner e, 4 valence e) -->
      <rect x="550" y="60" width="250" height="302" rx="10" fill="#f8fafc" stroke="#475569" stroke-width="1.8"/>
      ${svgStepBadge(675, 72, 210, '1. ذرة الكربون (تكافؤ رباعي)', '#0f172a', '#e2e8f0')}
      <circle cx="675" cy="186" r="76" fill="none" stroke="#64748b" stroke-width="1.6" stroke-dasharray="4 3"/>
      <circle cx="675" cy="186" r="44" fill="none" stroke="#0284c7" stroke-width="1.6"/>
      <circle cx="675" cy="186" r="20" fill="#dc2626"/>
      ${svgTxt(675, 190, '6p+ / 6n', { size: 9.5, color: '#fff', bold: true })}
      <!-- 2 inner e- -->
      <circle cx="675" cy="142" r="5" fill="#0284c7"/><circle cx="675" cy="230" r="5" fill="#0284c7"/>
      <!-- 4 outer valence e- -->
      <circle cx="675" cy="110" r="6" fill="#0f766e"/><circle cx="675" cy="262" r="6" fill="#0f766e"/>
      <circle cx="599" cy="186" r="6" fill="#0f766e"/><circle cx="751" cy="186" r="6" fill="#0f766e"/>
      ${svgTxt(675, 294, '4 إلكترونات في المدار الأخير', { size: 11.5, bold: true, color: '#0f766e' })}
      ${svgTxt(675, 316, 'تكوّن 4 روابط تساهمية قوية', { size: 10.5 })}
      ${svgTxt(675, 338, 'وتتحد مكونة سلاسل وحلقات', { size: 10.5, color: '#475569' })}

      <!-- Middle: Diamond 3D Tetrahedral Crystal + Off Bulb -->
      <rect x="285" y="60" width="250" height="302" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
      ${svgStepBadge(410, 72, 200, '2. الألماس (صلب عازل)', '#1d4ed8', '#dbeafe')}
      <!-- Tetrahedral network -->
      <line x1="410" y1="120" x2="360" y2="176" stroke="#2563eb" stroke-width="2.5"/>
      <line x1="410" y1="120" x2="460" y2="176" stroke="#2563eb" stroke-width="2.5"/>
      <line x1="410" y1="120" x2="410" y2="188" stroke="#2563eb" stroke-width="2.5"/>
      <line x1="360" y1="176" x2="460" y2="176" stroke="#2563eb" stroke-width="2"/>
      <line x1="360" y1="176" x2="410" y2="188" stroke="#2563eb" stroke-width="2"/>
      <line x1="460" y1="176" x2="410" y2="188" stroke="#2563eb" stroke-width="2"/>
      <circle cx="410" cy="120" r="8" fill="#38bdf8" stroke="#1d4ed8" stroke-width="2"/>
      <circle cx="360" cy="176" r="7" fill="#38bdf8" stroke="#1d4ed8" stroke-width="2"/>
      <circle cx="460" cy="176" r="7" fill="#38bdf8" stroke="#1d4ed8" stroke-width="2"/>
      <circle cx="410" cy="188" r="7" fill="#38bdf8" stroke="#1d4ed8" stroke-width="2"/>
      <!-- Circuit bulb OFF -->
      <circle cx="410" cy="242" r="20" fill="#e2e8f0" stroke="#64748b" stroke-width="2.2"/>
      ${svgTxt(410, 246, 'مطفأ', { size: 11, bold: true, color: '#475569' })}
      ${svgTxt(410, 294, 'شبكة هرمية ثلاثية الأبعاد', { size: 11, bold: true, color: '#1d4ed8' })}
      ${svgTxt(410, 316, 'كل ذرة مرتبطة بـ 4 ذرات (لا إلكترون حر)', { size: 10.2 })}
      ${svgTxt(410, 338, 'أصلب مادة طبيعية + عازل للكهرباء', { size: 10.2, bold: true, color: '#dc2626' })}

      <!-- Left: Graphite Hexagonal Layers + Lit Bulb -->
      <rect x="20" y="60" width="250" height="302" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8"/>
      ${svgStepBadge(145, 72, 210, '3. الجرافيت (ناعم موصّل)', '#15803d', '#dcfce7')}
      <!-- Hexagonal layer 1 & 2 -->
      <polygon points="110,122 145,112 180,122 180,144 145,154 110,144" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>
      <line x1="145" y1="154" x2="145" y2="174" stroke="#64748b" stroke-dasharray="3 2" stroke-width="1.6"/>
      <polygon points="110,174 145,164 180,174 180,196 145,206 110,196" fill="#94a3b8" stroke="#334155" stroke-width="2"/>
      <!-- Circuit bulb ON -->
      <circle cx="145" cy="242" r="20" fill="#fef08a" stroke="#eab308" stroke-width="2.5"/>
      ${svgTxt(145, 246, 'يضيء!', { size: 11, bold: true, color: '#b45309' })}
      ${svgTxt(145, 294, 'طبقات سداسية تنزلق (أقلام رصاص)', { size: 10.8, bold: true, color: '#15803d' })}
      ${svgTxt(145, 316, 'كل ذرة مرتبطة بـ 3 ذرات + إلكترون حر', { size: 10.2 })}
      ${svgTxt(145, 338, 'اللافلز الوحيد الموصل للكهرباء ✓', { size: 10.5, bold: true, color: '#0f766e' })}
    `,
    'شكل (9-3): ذرة الكربون ومقارنة البنية البلورية والتوصيل الكهربائي بين الألماس والجرافيت.',
    'التآصل: وجود العنصر في أكثر من صورة بلورية تختلف في الخواص الفيزيائية وتتشابه كيميائياً'
  );

  // ==================== u9-l4: جهاز تحضير غاز CO2 + تجربة إطفاء الشموع الأربع ====================
  add(
    'u9-l4',
    820,
    420,
    'خطوات تحضير غاز CO₂ بالإزاحة العلوية للهواء وتجربة إطفاء الشموع الأربع',
    `
      <!-- Right Panel: Lab Apparatus (Step 1 & 2) -->
      <rect x="395" y="60" width="405" height="315" rx="10" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.8"/>
      ${svgStepBadge(597, 72, 320, 'الخطوة 1: تحضير CO2 وجمعه بإزاحة الهواء للأعلى', '#0f766e', '#ffffff')}

      <!-- Erlenmeyer Flask with Thistle Funnel -->
      <path d="M680 154 L710 154 L748 258 Q752 268 740 268 L650 268 Q638 268 642 258 Z" fill="#dbeafe" stroke="#0284c7" stroke-width="2.4"/>
      <rect x="687" y="138" width="16" height="18" fill="#94a3b8"/>
      <!-- Funnel dipping below acid -->
      <rect x="700" y="114" width="6" height="132" fill="#fef3c7" stroke="#b45309"/>
      <polygon points="688,104 718,104 706,118 700,118" fill="#fef3c7" stroke="#b45309"/>
      <!-- CaCO3 chips & bubbles -->
      <circle cx="675" cy="256" r="6" fill="#e2e8f0" stroke="#64748b"/>
      <circle cx="696" cy="257" r="6" fill="#cbd5e1" stroke="#64748b"/>
      <circle cx="718" cy="256" r="5" fill="#e2e8f0" stroke="#64748b"/>
      <circle cx="688" cy="220" r="4" fill="#fff" stroke="#0284c7"/>
      <!-- Delivery Tube -->
      <path d="M692 140 L692 118 L480 118 L480 250" fill="none" stroke="#334155" stroke-width="3.2"/>
      <!-- Upright Gas Jar -->
      <rect x="440" y="160" width="80" height="108" rx="6" fill="#f1f5f9" stroke="#334155" stroke-width="2.2"/>
      <rect x="442" y="218" width="76" height="48" rx="4" fill="#cbd5e1"/>
      ${svgArrow(496, 178, 496, 142, 'slate', 2)}
      ${svgTxt(538, 160, 'هواء يخرج للأعلى', { size: 9.5, bold: true, color: '#475569' })}
      ${svgCallout(695, 256, 675, 316, '1', 'CaCO3 + 2HCl', { color: '#0284c7', sub: 'تفاعل بارد دون تسخين' })}
      ${svgCallout(480, 244, 488, 316, '2', 'جمع بإزاحة الهواء للأعلى', { color: '#0f766e', sub: 'لأن CO2 أثقل من الهواء (1.5×)' })}

      <!-- Left Panel: 4 Ascending Candles Extinguished from Bottom Up -->
      <rect x="20" y="60" width="360" height="315" rx="10" fill="#fffbeb" stroke="#d97706" stroke-width="1.8"/>
      ${svgStepBadge(200, 72, 300, 'الخطوة 2: إطفاء الشموع من الأسفل للأعلى', '#b45309', '#ffffff')}
      <rect x="52" y="128" width="296" height="175" rx="8" fill="#f1f5f9" fill-opacity="0.7" stroke="#64748b" stroke-width="2"/>
      <!-- Heavy CO2 pouring down -->
      <path d="M180 105 Q195 130 140 165" fill="none" stroke="#64748b" stroke-width="3" stroke-dasharray="4 3" marker-end="url(#arr-slate)"/>
      ${svgTxt(242, 122, 'صب غاز CO2 من الأعلى', { size: 10.5, bold: true, color: '#334155' })}
      ${[
        { x: 90, h: 36, lit: false, label: '① تنطفئ أولاً' },
        { x: 152, h: 64, lit: false, label: '② ثانياً' },
        { x: 214, h: 92, lit: false, label: '③ ثالثاً' },
        { x: 276, h: 120, lit: true, label: '④ أخيراً' },
      ].map((c) => `
        <rect x="${c.x}" y="${296 - c.h}" width="24" height="${c.h}" rx="2" fill="#ffffff" stroke="#94a3b8" stroke-width="1.4"/>
        <line x1="${c.x + 12}" y1="${296 - c.h}" x2="${c.x + 12}" y2="${288 - c.h}" stroke="#1e293b" stroke-width="2"/>
        ${
          c.lit
            ? `<path d="M${c.x + 7} ${288 - c.h} Q${c.x + 12} ${266 - c.h} ${c.x + 17} ${288 - c.h} Z" fill="url(#grad-flame)"/>`
            : `<path d="M${c.x + 12} ${286 - c.h} Q${c.x + 16} ${275 - c.h} ${c.x + 10} ${268 - c.h}" fill="none" stroke="#94a3b8" stroke-width="2"/>`
        }
        ${svgTxt(c.x + 12, 320, c.label, { size: 9.5, bold: true, color: c.lit ? '#b45309' : '#475569' })}
      `).join('')}
      ${svgTxt(200, 352, 'الاستنتاج: CO2 أثقل من الهواء، لا يشتعل ولا يساعد على الاشتعال', { size: 11, bold: true, color: '#b91c1c' })}
    `,
    'شكل (9-4): خطوات تحضير غاز CO₂ وجمعه بإزاحة الهواء للأعلى، وتجربة إطفاء الشموع الأربع بالترتيب.',
    'الكشف عن CO2: يعكّر ماء الجير الرائق Ca(OH)2 لتكوّن كربونات الكالسيوم البيضاء'
  );

  // ==================== u9-l5: برج التقطير التجزيئي للنفط الخام ====================
  add(
    'u9-l5',
    820,
    450,
    'برج التقطير التجزيئي للنفط الخام (الخطوات: تسخين ← صعود الأبخرة ← تكثيف متدرج)',
    `
      <!-- Step 1: Furnace (Right) -->
      ${svgStepBadge(672, 62, 230, 'الخطوة 1: تسخين النفط الخام', '#dc2626', '#fee2e2')}
      <rect x="572" y="272" width="195" height="92" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="2.2"/>
      <!-- Coiled pipe inside furnace -->
      <path d="M740 318 L700 318 Q690 296 675 318 T640 318 L552 318" fill="none" stroke="#b91c1c" stroke-width="6"/>
      ${[625, 665, 705].map((fx) => `<path d="M${fx} 352 Q${fx + 8} 325 ${fx + 16} 352 Z" fill="url(#grad-flame)"/>`).join('')}
      ${svgTxt(669, 294, 'فرن التسخين (> 400 م°)', { size: 12, bold: true, color: '#991b1b' })}
      ${svgTxt(669, 384, 'يتبخر النفط ويدخل أسفل البرج', { size: 10.5, bold: true, color: '#dc2626' })}
      ${svgArrow(568, 318, 514, 318, 'red', 3)}

      <!-- Step 2: Tall Distillation Column (Center-Right) -->
      ${svgStepBadge(410, 62, 200, 'الخطوة 2: تصاعد وتدرج الحرارة', '#0f766e', '#f0fdfa')}
      <rect x="315" y="96" width="190" height="296" rx="22" fill="#f8fafc" stroke="#1e293b" stroke-width="2.8"/>
      <!-- Rising vapor arrow inside -->
      ${svgArrow(490, 360, 490, 126, 'red', 2.4, true)}
      ${[
        { y: 110, h: 40, bg: '#e0f2fe', temp: '~20 م°', name: '1. غازات نفطية', use: 'غاز الطبخ والأسطوانات', c: '#0284c7' },
        { y: 155, h: 40, bg: '#dcfce7', temp: '~100 م°', name: '2. الجازولين (البنزين)', use: 'وقود السيارات الخفيفة', c: '#16a34a' },
        { y: 200, h: 40, bg: '#fef9c3', temp: '~200 م°', name: '3. الكيروسين', use: 'وقود الطائرات والإنارة', c: '#ca8a04' },
        { y: 245, h: 40, bg: '#ffedd5', temp: '~300 م°', name: '4. الديزل (السولار)', use: 'الشاحنات والمولدات', c: '#ea580c' },
        { y: 290, h: 40, bg: '#e2e8f0', temp: '~380 م°', name: '5. شمع البارافين والزيوت', use: 'التشحيم وصناعة الشموع', c: '#475569' },
        { y: 335, h: 42, bg: '#94a3b8', temp: '>400 م°', name: '6. الأسفلت (الزفت)', use: 'رصف الطرق (يتبقى بالقاع)', c: '#1e293b' },
      ].map((f) => `
        <rect x="326" y="${f.y}" width="154" height="${f.h}" rx="5" fill="${f.bg}" stroke="#64748b"/>
        ${svgTxt(403, f.y + 24, f.temp, { size: 12, bold: true, color: f.c === '#1e293b' ? '#ffffff' : f.c })}
        ${svgArrow(320, f.y + f.h / 2, 268, f.y + f.h / 2, 'slate', 2)}
        <rect x="28" y="${f.y}" width="236" height="${f.h}" rx="7" fill="#ffffff" stroke="${f.c}" stroke-width="1.5"/>
        ${svgTxt(146, f.y + 16, f.name, { size: 11.2, bold: true, color: f.c })}
        ${svgTxt(146, f.y + 32, f.use, { size: 9.8, color: '#475569' })}
      `).join('')}

      <!-- Step 3 badge above left output column -->
      ${svgStepBadge(146, 62, 220, 'الخطوة 3: خروج المشتقات المقطرة', '#334155', '#f1f5f9')}
      ${svgTxt(669, 165, 'مبدأ الفصل العلمي:', { size: 12, bold: true, color: '#0f766e' })}
      ${svgTxt(669, 186, 'اختلاف درجات غليان المكونات؛', { size: 11 })}
      ${svgTxt(669, 206, 'الأخف والأقل غلياناً يصعد لقمة البرج،', { size: 11 })}
      ${svgTxt(669, 226, 'والأثقل والأعلى غلياناً يبقى بالأسفل.', { size: 11 })}
    `,
    'شكل (9-5): التركيب الكامل لبرج التقطير التجزيئي للنفط الخام ودرجات غليان مشتقاته الستة.',
    'أصل النفط الخام: بقايا كائنات بحرية دقيقة تحللت تحت ضغط وحرارة عالية عبر ملايين السنين'
  );

  // ==================== u9-l6: معالجة التلوث الصناعي ====================
  add(
    'u9-l6',
    820,
    380,
    'مصادر التلوث الكيميائي الصناعي وخطوات معالجته وحماية التربة والمياه',
    `
      ${svgArrow(548, 195, 512, 195, 'red', 2.4)}
      ${svgArrow(290, 195, 254, 195, 'teal', 2.4)}

      <!-- Step 1: Sources -->
      ${svgStepBadge(672, 60, 220, '1. مصادر التلوث الصناعي', '#dc2626', '#fee2e2')}
      <rect x="556" y="96" width="234" height="232" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.6"/>
      <rect x="640" y="114" width="64" height="44" fill="#64748b"/>
      <rect x="652" y="98" width="12" height="18" fill="#475569"/><rect x="680" y="98" width="12" height="18" fill="#475569"/>
      ${svgTxt(673, 182, '• أدخنة SO2 و NO2 و CO', { size: 11, bold: true, color: '#b91c1c' })}
      ${svgTxt(673, 208, '• مخلفات سائلة ومعادن ثقيلة', { size: 11, bold: true })}
      ${svgTxt(673, 234, '(كالرصاص والزئبق في الأنهار)', { size: 10.5, color: '#475569' })}
      ${svgTxt(673, 266, '• الإفراط في الأسمدة والمبيدات', { size: 11, bold: true })}
      ${svgTxt(673, 294, 'يقتل الأسماك ويفسد التربة والآبار', { size: 10.5, color: '#dc2626', bold: true })}

      <!-- Step 2: Chimney Filter & Chemical Neutralization -->
      ${svgStepBadge(402, 60, 206, '2. المعالجة داخل المصنع', '#0284c7', '#eff6ff')}
      <rect x="298" y="96" width="208" height="232" rx="10" fill="#eff6ff" stroke="#0284c7" stroke-width="1.6"/>
      <rect x="372" y="112" width="60" height="72" rx="6" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
      <line x1="376" y1="138" x2="428" y2="138" stroke="#0f766e" stroke-width="3" stroke-dasharray="5 3"/>
      <line x1="376" y1="158" x2="428" y2="158" stroke="#0f766e" stroke-width="3" stroke-dasharray="5 3"/>
      ${svgTxt(402, 204, 'مرشحات (فلاتر) المداخن', { size: 11.5, bold: true, color: '#0369a1' })}
      ${svgTxt(402, 228, '+ رش رذاذ الجير Ca(OH)2', { size: 11, bold: true, color: '#0f766e' })}
      ${svgTxt(402, 250, 'لمعادلة الغازات الحمضية', { size: 10.5 })}
      ${svgTxt(402, 282, '+ تنقية وتدوير المياه الصناعية', { size: 11, bold: true, color: '#1d4ed8' })}
      ${svgTxt(402, 304, 'قبل تصريفها في البيئة', { size: 10.5 })}

      <!-- Step 3: Healthy Soil & Water -->
      ${svgStepBadge(138, 60, 212, '3. بيئة وتربة سليمة', '#15803d', '#dcfce7')}
      <rect x="32" y="96" width="214" height="232" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.6"/>
      <circle cx="139" cy="148" r="32" fill="#dcfce7" stroke="#16a34a" stroke-width="2.2"/>
      ${svgTxt(139, 152, 'pH 6–7', { size: 13, bold: true, color: '#15803d' })}
      ${svgTxt(139, 206, 'تربة خصبة متوازنة الحموضة', { size: 11.5, bold: true, color: '#15803d' })}
      ${svgTxt(139, 232, '• طاقة متجددة (شمس/رياح)', { size: 10.5 })}
      ${svgTxt(139, 256, '• تشجير ومكافحة حيوية', { size: 10.5 })}
      ${svgTxt(139, 280, '• ترشيد المبيدات والأسمدة', { size: 10.5 })}
    `,
    'شكل (9-6): مخطط معالجة التلوث الصناعي بفلاتر المداخن ورذاذ الجير والحفاظ على توازن التربة (pH 6–7).'
  );

  // ==================== u10-l1: تدرج الهالوجينات الأربعة + غلاف التكافؤ (7 إلكترونات) ====================
  add(
    'u10-l1',
    820,
    400,
    'تدرج الخواص الفيزيائية والألوان والنشاط لعناصر مجموعة الهالوجينات (7أ)',
    `
      ${svgArrow(740, 82, 80, 82, 'amber', 2.4)}
      ${svgTxt(410, 74, 'التدرج من أعلى المجموعة إلى أسفلها: يزداد الوزن الذري ← يغمق اللون ← تتغير الحالة (غاز ← سائل ← صلب) ← يقل النشاط', { size: 10.8, bold: true, color: '#92400e' })}

      ${[
        { x: 612, sym: 'F2 — الفلور', state: 'غاز أصفر باهت', use: 'حماية الأسنان (الفلورايد)', tubeBg: '#fef9c3', liqH: 0, solid: false, c: '#a16207' },
        { x: 416, sym: 'Cl2 — الكلور', state: 'غاز أخضر مصفر', use: 'تعقيم المياه والتبييض', tubeBg: '#ecfccb', liqH: 0, solid: false, c: '#3f6212' },
        { x: 220, sym: 'Br2 — البروم', state: 'سائل بني محمر', use: 'اللافلز السائل الوحيد!', tubeBg: '#ffffff', liqH: 45, liqC: '#c2410c', solid: false, c: '#c2410c' },
        { x: 24, sym: 'I2 — اليود', state: 'صلب رمادي داكن', use: 'مطهر + الملح اليودي', tubeBg: '#f3e8ff', liqH: 0, solid: true, c: '#7e22ce' },
      ].map((h) => `
        <rect x="${h.x}" y="100" width="184" height="248" rx="10" fill="#ffffff" stroke="${h.c}" stroke-width="2"/>
        <rect x="${h.x}" y="100" width="184" height="34" rx="8" fill="${h.c}"/>
        ${svgTxt(h.x + 92, 122, h.sym, { bold: true, size: 13.5, color: '#ffffff' })}
        <!-- Sealed Glass Ampoule / Tube showing physical state -->
        <rect x="${h.x + 67}" y="148" width="50" height="94" rx="18" fill="${h.tubeBg}" stroke="#475569" stroke-width="2"/>
        ${h.liqH ? `<rect x="${h.x + 69}" y="${240 - h.liqH}" width="46" height="${h.liqH}" rx="14" fill="${h.liqC}"/>` : ''}
        ${
          h.solid
            ? `<polygon points="${h.x + 80},236 ${h.x + 92},216 ${h.x + 104},236" fill="#334155"/>
               <polygon points="${h.x + 92},236 ${h.x + 105},220 ${h.x + 112},236" fill="#475569"/>`
            : ''
        }
        ${svgTxt(h.x + 92, 266, h.state, { bold: true, size: 12, color: h.c })}
        ${svgTxt(h.x + 92, 290, h.use, { size: 10.5, bold: true, color: '#334155' })}
        ${svgTxt(h.x + 92, 326, '7 إلكترونات في المدار الأخير', { size: 9.8, color: '#0f766e', bold: true })}
      `).join('')}
    `,
    'شكل (10-1): أنابيب تدرج الهالوجينات الأربعة في الحالة الفيزيائية واللون والاستخدامات الحياتية.',
    'الكلور أنشط من البروم ويحل محله، والبروم أنشط من اليود؛ والفلور أنشط اللافلزات إطلاقاً'
  );

  // ==================== u10-l3: جهاز تحضير غاز الكلور Cl2 وتنقيته وتجفيفه بالخطوات ====================
  add(
    'u10-l3',
    820,
    420,
    'خطوات جهاز تحضير غاز الكلور (Cl₂) وتنقيته بالماء ثم تجفيفه بحمض الكبريتيك',
    `
      <!-- Top Steps Flow Bar -->
      ${svgStepBadge(700, 62, 180, 'الخطوة 1: التوليد بالتسخين', '#ca8a04', '#fef9c3')}
      ${svgArrow(604, 74, 578, 74, 'teal', 2.4)}
      ${svgStepBadge(490, 62, 168, 'الخطوة 2: التنقية بالماء', '#0284c7', '#e0f2fe')}
      ${svgArrow(400, 74, 374, 74, 'teal', 2.4)}
      ${svgStepBadge(290, 62, 168, 'الخطوة 3: التجفيف بحمض', '#d97706', '#fef3c7')}
      ${svgArrow(200, 74, 174, 74, 'teal', 2.4)}
      ${svgStepBadge(98, 62, 146, 'الخطوة 4: الجمع', '#3f6212', '#ecfccb')}

      <!-- 1. Generation Flask + Bunsen Burner -->
      <path d="M685 162 L715 162 L750 256 Q754 266 742 266 L658 266 Q646 266 650 256 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2.4"/>
      <polygon points="688,118 714,118 703,134 699,134" fill="#e0f2fe" stroke="#0284c7"/>
      <rect x="699" y="134" width="5" height="108" fill="#e0f2fe" stroke="#0284c7"/>
      <path d="M688 298 Q700 268 712 298 Z" fill="url(#grad-flame)"/>
      <rect x="692" y="298" width="16" height="14" fill="#475569"/>
      ${svgCallout(700, 240, 700, 342, '1', 'MnO2 + 4HCl + حرارة', { color: '#ca8a04', sub: 'يتصاعد Cl2 + شوائب HCl وبخار ماء' })}

      <!-- Tube 1 -> Water Wash -->
      <path d="M708 160 L708 124 L486 124 L486 244" fill="none" stroke="#334155" stroke-width="3"/>
      <rect x="444" y="154" width="94" height="114" rx="10" fill="#ffffff" stroke="#0284c7" stroke-width="2.2"/>
      <rect x="447" y="200" width="88" height="65" rx="7" fill="#bae6fd"/>
      <circle cx="486" cy="240" r="3.5" fill="#fff" stroke="#0284c7"/><circle cx="496" cy="222" r="3.5" fill="#fff" stroke="#0284c7"/>
      ${svgTxt(491, 184, 'ماء مقطر', { size: 11.5, bold: true, color: '#0369a1' })}
      ${svgCallout(491, 240, 491, 342, '2', 'غسل بالماء المقطر أولاً', { color: '#0284c7', sub: 'لإذابة وامتصاص شوائب غاز HCl' })}

      <!-- Tube 2 -> H2SO4 Dryer -->
      <path d="M518 154 L518 124 L286 124 L286 244" fill="none" stroke="#334155" stroke-width="3"/>
      <rect x="244" y="154" width="94" height="114" rx="10" fill="#ffffff" stroke="#d97706" stroke-width="2.2"/>
      <rect x="247" y="200" width="88" height="65" rx="7" fill="#fef3c7"/>
      ${svgTxt(291, 184, 'H2SO4 مركز', { size: 11, bold: true, color: '#b45309' })}
      ${svgCallout(291, 240, 291, 342, '3', 'تجفيف بحمض الكبريتيك المركز', { color: '#d97706', sub: 'لامتصاص بخار الماء (نازع للرطوبة)' })}

      <!-- Tube 3 -> Dry Cl2 Jar -->
      <path d="M318 154 L318 124 L94 124 L94 244" fill="none" stroke="#334155" stroke-width="3"/>
      <rect x="48" y="154" width="94" height="114" rx="6" fill="#ecfccb" stroke="#65a30d" stroke-width="2.2"/>
      ${svgTxt(95, 206, 'Cl2 جاف ونقي', { size: 11.5, bold: true, color: '#3f6212' })}
      ${svgTxt(95, 228, 'أخضر مصفر', { size: 10.5, color: '#3f6212' })}
      ${svgCallout(95, 244, 98, 342, '4', 'إزاحة الهواء للأعلى', { color: '#3f6212', sub: 'أثقل من الهواء (2.5×)' })}
    `,
    'شكل (10-2): الخطوات الأربع لتحضير غاز الكلور وتنقيته بالماء ثم تجفيفه بحمض H₂SO₄ المركز.',
    'مصيدة وزارية قاتلة: عكس ترتيب القارورتين خطأ فادح؛ لأن الماء سيرطّب الغاز بعد تجفيفه!'
  );

  // ==================== u10-l2: تطبيقات الهالوجينات في حياتنا اليومية ====================
  add(
    'u10-l2',
    820,
    400,
    'تطبيقات الهالوجينات في حياتنا اليومية (الفلور، الكلور، البروم، واليود)',
    `
      ${[
        {
          x: 612,
          title: '1. الفلور (F2)',
          c: '#a16207',
          bg: '#fefce8',
          sub1: 'معجون الأسنان (الفلورايد)',
          sub2: 'يقوّي المينا ويمنع التسوس',
          sub3: 'وطلاء التفلون غير اللاصق',
          draw: (cx: number) => `
            <!-- Tooth + Shield -->
            <path d="M${cx - 18} 148 Q${cx} 134 ${cx + 18} 148 Q${cx + 22} 178 ${cx + 12} 214 Q${cx + 6} 224 ${cx + 2} 200 Q${cx} 192 ${cx - 2} 200 Q${cx - 6} 224 ${cx - 12} 214 Q${cx - 22} 178 ${cx - 18} 148 Z" fill="#ffffff" stroke="#ca8a04" stroke-width="2.4"/>
            <rect x="${cx - 28}" y="224" width="56" height="12" rx="4" fill="#fef08a" stroke="#a16207"/>
          `,
        },
        {
          x: 416,
          title: '2. الكلور (Cl2)',
          c: '#15803d',
          bg: '#f0fdf4',
          sub1: 'تعقيم مياه الشرب والمسابح',
          sub2: 'يقتل البكتيريا والجراثيم',
          sub3: 'ومساحيق التبييض وبلاستيك PVC',
          draw: (cx: number) => `
            <!-- Water tank / drop + Clean check -->
            <path d="M${cx} 138 Q${cx + 28} 182 ${cx} 216 Q${cx - 28} 182 ${cx} 138 Z" fill="#38bdf8" stroke="#0369a1" stroke-width="2.4"/>
            <circle cx="${cx + 16}" cy="154" r="10" fill="#dcfce7" stroke="#15803d" stroke-width="1.8"/>
            ${svgTxt(cx + 16, 158, '✓', { size: 11, bold: true, color: '#15803d' })}
          `,
        },
        {
          x: 220,
          title: '3. البروم (Br2)',
          c: '#c2410c',
          bg: '#fff7ed',
          sub1: 'بروميد الفضة بالأفلام',
          sub2: 'حساس للضوء بالتصوير',
          sub3: 'ومثبطات الحريق والمهدئات',
          draw: (cx: number) => `
            <!-- Film strip -->
            <rect x="${cx - 32}" y="148" width="64" height="54" rx="5" fill="#334155" stroke="#9a3412" stroke-width="2"/>
            <rect x="${cx - 20}" y="158" width="16" height="34" fill="#fed7aa"/>
            <rect x="${cx + 4}" y="158" width="16" height="34" fill="#fdba74"/>
          `,
        },
        {
          x: 24,
          title: '4. اليود (I2)',
          c: '#7e22ce',
          bg: '#faf5ff',
          sub1: 'ملح الطعام اليودي',
          sub2: 'يقي الغدة الدرقية من التضخم',
          sub3: 'وصبغة اليود لتطهير الجروح',
          draw: (cx: number) => `
            <!-- Thyroid butterfly gland -->
            <ellipse cx="${cx - 14}" cy="176" rx="13" ry="22" fill="#e9d5ff" stroke="#7e22ce" stroke-width="2"/>
            <ellipse cx="${cx + 14}" cy="176" rx="13" ry="22" fill="#e9d5ff" stroke="#7e22ce" stroke-width="2"/>
            <rect x="${cx - 6}" y="170" width="12" height="12" fill="#d8b4fe" stroke="#7e22ce"/>
          `,
        },
      ].map((h) => {
        const cx = h.x + 92;
        return `
          <rect x="${h.x}" y="66" width="184" height="284" rx="10" fill="${h.bg}" stroke="${h.c}" stroke-width="1.8"/>
          <rect x="${h.x}" y="66" width="184" height="36" rx="8" fill="${h.c}"/>
          ${svgTxt(cx, 90, h.title, { bold: true, size: 13.5, color: '#ffffff' })}
          ${h.draw(cx)}
          ${svgTxt(cx, 256, h.sub1, { size: 11.2, bold: true, color: h.c })}
          ${svgTxt(cx, 284, h.sub2, { size: 10.5, bold: true, color: '#1e293b' })}
          ${svgTxt(cx, 312, h.sub3, { size: 10, color: '#475569' })}
        `;
      }).join('')}
    `,
    'شكل (10-3): الاستخدامات الحياتية والصحية والصناعية لعناصر الهالوجينات الأربعة.',
    'وزاري: نقص اليود في الغذاء يسبب تضخم الغدة الدرقية (الجويتر)، ويُستخدم الفلورايد لمنع تسوس الأسنان'
  );

  return out;
}
