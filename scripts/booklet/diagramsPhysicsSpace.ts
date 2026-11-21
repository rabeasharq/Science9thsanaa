import { renderSvgToPng, svgArrow, svgCallout, svgCanvas, svgPin, svgStepBadge, svgTxt } from './arabicShaper';

export function buildPhysicsSpaceDiagrams(): Record<string, { png: Buffer; caption: string; width: number; height: number }> {
  const out: Record<string, { png: Buffer; caption: string; width: number; height: number }> = {};

  const add = (id: string, w: number, h: number, title: string, body: string, caption: string, footer?: string) => {
    const svg = svgCanvas(w, h, title, body, footer);
    out[id] = { png: renderSvgToPng(svg, 1120), caption, width: 520, height: Math.round((520 * h) / w) };
  };

  // ==================== u4-l1: المجموعة الشمسية (الكواكب الـ 8) ومجرة درب التبانة ====================
  add(
    'u4-l1',
    820,
    410,
    'تركيب المجموعة الشمسية (وحدة بناء الكون) والكواكب الثمانية وموقعها في المجرة',
    `
      <!-- Left: Milky Way Galaxy context -->
      <rect x="20" y="60" width="218" height="305" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      ${svgTxt(129, 86, 'مجرة درب التبانة الحلزونية', { bold: true, size: 12.5, color: '#fde047' })}
      <ellipse cx="129" cy="180" rx="88" ry="46" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 3"/>
      <ellipse cx="129" cy="180" rx="58" ry="28" fill="none" stroke="#818cf8" stroke-width="2"/>
      <circle cx="129" cy="180" r="14" fill="#fef08a"/>
      <circle cx="192" cy="168" r="5" fill="#22d3ee"/>
      ${svgTxt(129, 250, 'تضم مئات المليارات من النجوم', { size: 10.5, color: '#e2e8f0', bold: true })}
      ${svgTxt(129, 274, 'السنة الضوئية: المسافة التي يقطعها', { size: 10, color: '#94a3b8' })}
      ${svgTxt(129, 292, 'الضوء في سنة (300,000 كم/ث)', { size: 10, color: '#94a3b8' })}
      ${svgTxt(129, 326, 'وزاري: وحدة بناء الكون =', { size: 10.5, bold: true, color: '#fbbf24' })}
      ${svgTxt(129, 344, 'المجموعة الشمسية', { size: 11.5, bold: true, color: '#34d399' })}

      <!-- Right: Solar System 8 Planets in Order (Sun on Right -> Planets Left) -->
      <rect x="250" y="60" width="550" height="305" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
      ${svgTxt(525, 86, 'المجموعة الشمسية بالترتيب من الأقرب للشمس إلى الأبعد', { bold: true, size: 13.5, color: '#fde047' })}
      <!-- Sun on right edge -->
      <circle cx="770" cy="206" r="46" fill="#f59e0b" stroke="#fde047" stroke-width="3"/>
      ${svgTxt(762, 210, 'الشمس', { bold: true, size: 12, color: '#ffffff' })}
      <!-- Orbit arcs -->
      ${[105, 145, 192, 238, 320, 385, 442, 495].map((r) => `
        <path d="M ${770 - r} 102 Q ${770 - r - 18} 206 ${770 - r} 310" fill="none" stroke="#334155" stroke-width="1.2" stroke-dasharray="4 3"/>
      `).join('')}
      <!-- Asteroid Belt between Mars & Jupiter -->
      <path d="M 492 106 Q 478 206 492 308" fill="none" stroke="#94a3b8" stroke-width="5" stroke-dasharray="2 6"/>
      ${svgTxt(486, 102, 'حزام الكويكبات', { size: 9.2, color: '#cbd5e1', bold: true })}

      <!-- 8 Planets -->
      ${[
        { x: 672, y: 206, r: 6, c: '#a8a29e', name: '1. عطارد', ly: 234 },
        { x: 632, y: 174, r: 9, c: '#fcd34d', name: '2. الزهرة', ly: 152 },
        { x: 586, y: 206, r: 10, c: '#38bdf8', name: '3. الأرض', ly: 238, moon: true },
        { x: 538, y: 174, r: 8, c: '#ef4444', name: '4. المريخ', ly: 152 },
        { x: 446, y: 206, r: 22, c: '#fb923c', name: '5. المشتري', ly: 248 },
        { x: 382, y: 174, r: 16, c: '#fde68a', name: '6. زحل', ly: 146, ring: true },
        { x: 326, y: 210, r: 12, c: '#22d3ee', name: '7. أورانوس', ly: 244 },
        { x: 274, y: 178, r: 12, c: '#3b82f6', name: '8. نبتون', ly: 154 },
      ].map((p) => `
        ${p.ring ? `<ellipse cx="${p.x}" cy="${p.y}" rx="28" ry="8" fill="none" stroke="#eab308" stroke-width="3"/>` : ''}
        <circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="${p.c}"/>
        ${p.moon ? `<circle cx="${p.x}" cy="${p.y - 18}" r="3.5" fill="#e2e8f0"/>` : ''}
        ${svgTxt(p.x, p.ly, p.name, { size: 10.2, bold: true, color: '#f8fafc' })}
      `).join('')}

      <rect x="275" y="324" width="500" height="28" rx="6" fill="#1e293b"/>
      ${svgTxt(640, 342, 'كواكب صخرية قريبة (1–4)', { size: 10.5, bold: true, color: '#38bdf8' })}
      ${svgTxt(390, 342, 'كواكب غازية عملاقة (5–8)', { size: 10.5, bold: true, color: '#fb923c' })}
    `,
    'شكل (4-1): المجموعة الشمسية بالترتيب (عطارد ← نبتون) وموقعها في مجرة درب التبانة.'
  );

  // ==================== u4-l2: خطوات انطلاق الصاروخ ذي المراحل الثلاث ====================
  add(
    'u4-l2',
    820,
    410,
    'خطوات انطلاق الصاروخ الفضائي متعدد المراحل ومبدأ الفعل ورد الفعل (نيوتن الثالث)',
    `
      ${svgArrow(552, 200, 514, 200, 'teal', 2.6)}
      ${svgArrow(294, 200, 256, 200, 'teal', 2.6)}

      <!-- Step 1: Launch & Action/Reaction -->
      ${svgStepBadge(675, 60, 224, 'الخطوة 1: الإقلاع (نيوتن 3)', '#dc2626', '#fee2e2')}
      <rect x="560" y="94" width="232" height="262" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.6"/>
      <polygon points="675,112 659,144 691,144" fill="#0f766e"/>
      <rect x="659" y="144" width="32" height="36" fill="#14b8a6" stroke="#0f766e"/>
      <rect x="656" y="180" width="38" height="36" fill="#94a3b8" stroke="#475569"/>
      <rect x="652" y="216" width="46" height="44" fill="#475569" stroke="#1e293b"/>
      <path d="M660 260 L675 306 L690 260 Z" fill="url(#grad-flame)"/>
      ${svgArrow(632, 190, 632, 134, 'teal', 2.4)}
      ${svgTxt(604, 164, 'رد فعل', { size: 10.5, bold: true, color: '#0f766e' })}
      ${svgArrow(720, 232, 720, 288, 'red', 2.4)}
      ${svgTxt(748, 260, 'فعل (غاز)', { size: 10.5, bold: true, color: '#dc2626' })}
      ${svgTxt(675, 330, 'الوقود + المؤكسد داخل الصاروخ', { size: 10.5, bold: true, color: '#0f172a' })}
      ${svgTxt(675, 348, '(يعمل في الفراغ دون هواء)', { size: 10, color: '#475569' })}

      <!-- Step 2: Stage 1 Separation -->
      ${svgStepBadge(405, 60, 210, 'الخطوة 2: انفصال المراحل', '#d97706', '#fef3c7')}
      <rect x="300" y="94" width="210" height="262" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.6"/>
      <polygon points="405,118 391,146 419,146" fill="#0f766e"/>
      <rect x="391" y="146" width="28" height="36" fill="#14b8a6" stroke="#0f766e"/>
      <path d="M396 182 L405 212 L414 182 Z" fill="url(#grad-flame)"/>
      <!-- Falling Stage 1 -->
      <rect x="386" y="246" width="38" height="36" fill="#94a3b8" stroke="#475569" stroke-dasharray="3 2"/>
      ${svgArrow(405, 224, 405, 242, 'slate', 2)}
      ${svgCallout(405, 264, 405, 318, '2', 'تنفصل المرحلة الفارغة', { color: '#b45309', sub: 'لتخفيف الوزن وبلوغ سرعة الإفلات' })}

      <!-- Step 3: Satellite in Orbit + Shuttle -->
      ${svgStepBadge(138, 60, 212, 'الخطوة 3: الاستقرار بالمدار', '#0f766e', '#f0fdfa')}
      <rect x="30" y="94" width="218" height="262" rx="10" fill="#0f172a" stroke="#0f766e" stroke-width="1.8"/>
      <!-- Earth arc -->
      <circle cx="139" cy="285" r="56" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
      <path d="M105 265 Q128 248 155 268 Q170 288 135 298 Z" fill="#22c55e"/>
      <!-- Orbit ellipse -->
      <ellipse cx="139" cy="215" rx="88" ry="62" fill="none" stroke="#94a3b8" stroke-dasharray="4 3" stroke-width="1.5"/>
      <!-- Satellite -->
      <rect x="129" y="146" width="20" height="16" fill="#fde047" stroke="#b45309"/>
      <rect x="104" y="149" width="22" height="10" fill="#38bdf8"/>
      <rect x="152" y="149" width="22" height="10" fill="#38bdf8"/>
      ${svgTxt(139, 130, 'قمر صناعي (اتصالات/GPS/أرصاد)', { size: 10, bold: true, color: '#fde047' })}
      ${svgTxt(139, 194, 'توازن الجاذبية والطرد المركزي', { size: 9.8, color: '#e2e8f0', bold: true })}
      ${svgTxt(139, 342, 'المكوك الفضائي: يهبط ويعاد استخدامه', { size: 10, bold: true, color: '#34d399' })}
    `,
    'شكل (4-2): مراحل انطلاق الصاروخ ذي المراحل، وعمل الأقمار الصناعية والمكوك الفضائي.'
  );

  // ==================== u5-l1: خطوط الفيض المغناطيسي وطرق التمغنط الثلاث بالرسم ====================
  add(
    'u5-l1',
    820,
    430,
    'خطوط الفيض المغناطيسي حول القضيب والرسوم التوضيحية لطرق التمغنط الثلاث',
    `
      <!-- Top Panel: Bar Magnet + Field Lines + Neutral Center + Compasses -->
      <rect x="20" y="58" width="780" height="172" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.6"/>
      ${svgTxt(410, 79, 'شكل خطوط الفيض المغناطيسي (تخرج من N وتدخل إلى S خارج المغناطيس ولا تتقاطع)', { bold: true, size: 12.5, color: '#0f172a' })}
      <!-- Field curves -->
      <ellipse cx="410" cy="144" rx="165" ry="64" fill="none" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="5 3"/>
      <ellipse cx="410" cy="144" rx="132" ry="44" fill="none" stroke="#0284c7" stroke-width="1.6"/>
      <!-- Magnet bar -->
      <rect x="308" y="126" width="102" height="36" rx="4" fill="#2563eb" stroke="#1e3a8a" stroke-width="1.5"/>
      <rect x="410" y="126" width="102" height="36" rx="4" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
      ${svgTxt(359, 149, 'S (جنوبي)', { bold: true, size: 12.5, color: '#ffffff' })}
      ${svgTxt(461, 149, 'N (شمالي)', { bold: true, size: 12.5, color: '#ffffff' })}
      <!-- Compasses on both ends showing needle direction -->
      <circle cx="566" cy="144" r="14" fill="#ffffff" stroke="#334155" stroke-width="1.8"/>
      <polygon points="560,144 574,140 574,148" fill="#dc2626"/>
      <circle cx="254" cy="144" r="14" fill="#ffffff" stroke="#334155" stroke-width="1.8"/>
      <polygon points="246,144 260,140 260,148" fill="#dc2626"/>
      ${svgCallout(410, 144, 678, 134, '1', 'المنطقة المتعادلة (المنتصف)', { color: '#475569', sub: 'تنعدم القوة المغناطيسية تقريباً' })}
      ${svgCallout(508, 136, 678, 186, '2', 'القوة تتركز عند القطبين', { color: '#dc2626', sub: 'أشد كثافة لخطوط الفيض' })}
      ${svgCallout(254, 144, 138, 160, '3', 'اتجاه البوصلة مع الفيض', { color: '#0284c7', sub: 'المتشابه يتنافر والمختلف يتجاذب' })}

      <!-- Bottom Row: Drawn Diagrams of 3 Magnetization Methods (RTL 1, 2, 3) -->
      ${svgStepBadge(672, 240, 224, 'طريقة 1: الدلك باتجاه واحد', '#0284c7', '#e0f2fe')}
      <rect x="556" y="268" width="234" height="122" rx="10" fill="#eff6ff" stroke="#0284c7" stroke-width="1.6"/>
      <rect x="588" y="328" width="166" height="22" rx="3" fill="#94a3b8" stroke="#334155"/>
      <!-- Tilted stroking magnet -->
      <rect x="650" y="280" width="22" height="44" transform="rotate(20 660 302)" fill="#dc2626" stroke="#991b1b"/>
      <path d="M726 306 L608 306" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arr-red)"/>
      ${svgTxt(602, 344, 'S', { size: 11, bold: true, color: '#fff' })}
      ${svgTxt(740, 344, 'N', { size: 11, bold: true, color: '#fff' })}
      ${svgTxt(673, 376, 'نهاية الدلك تكون قطباً مخالفاً للقطب الدالك', { size: 10, bold: true, color: '#1e3a8a' })}

      ${svgStepBadge(410, 240, 210, 'طريقة 2: التأثير (عن بُعد)', '#d97706', '#fef3c7')}
      <rect x="298" y="268" width="224" height="122" rx="10" fill="#fffbeb" stroke="#d97706" stroke-width="1.6"/>
      <rect x="330" y="282" width="150" height="24" rx="4" fill="#dc2626" stroke="#991b1b"/>
      ${svgTxt(405, 299, 'مغناطيس دائم (قريب)', { size: 10.5, bold: true, color: '#fff' })}
      <rect x="372" y="320" width="66" height="14" rx="2" fill="#64748b"/>
      <!-- Paperclips attached -->
      <circle cx="394" cy="342" r="5" fill="none" stroke="#334155" stroke-width="2"/>
      <circle cx="405" cy="342" r="5" fill="none" stroke="#334155" stroke-width="2"/>
      <circle cx="416" cy="342" r="5" fill="none" stroke="#334155" stroke-width="2"/>
      ${svgTxt(410, 376, 'تمغنط مؤقت دون تلامس ويزول بالإبعاد', { size: 10, bold: true, color: '#92400e' })}

      ${svgStepBadge(145, 240, 224, 'طريقة 3: التيار الكهربائي', '#0f766e', '#f0fdfa')}
      <rect x="24" y="268" width="242" height="122" rx="10" fill="#f0fdf4" stroke="#0f766e" stroke-width="1.6"/>
      <!-- Nail + Coil + Battery -->
      <rect x="66" y="302" width="110" height="16" rx="4" fill="#64748b" stroke="#334155"/>
      ${[76, 92, 108, 124, 140, 156].map((cx) => `<rect x="${cx}" y="297" width="8" height="26" rx="3" fill="none" stroke="#ea580c" stroke-width="2.2"/>`).join('')}
      <rect x="196" y="294" width="44" height="32" rx="4" fill="#334155"/>
      ${svgTxt(218, 314, 'بطارية', { size: 9.5, color: '#fff', bold: true })}
      <polyline points="164,310 196,310" fill="none" stroke="#ea580c" stroke-width="2"/>
      <polyline points="76,310 54,310 54,344 218,344 218,326" fill="none" stroke="#ea580c" stroke-width="2"/>
      ${svgTxt(145, 376, 'مسمار حديد مطاوع يفقد المغنطة بفصل التيار', { size: 10, bold: true, color: '#0f766e' })}
    `,
    'شكل (5-1): خطوط الفيض المغناطيسي حول القضيب، والرسوم التوضيحية لطرق التمغنط الثلاث.'
  );

  // ==================== u5-l2: الرسوم التركيبية للجرس الكهربائي ومرسل ومستقبل التلفون ====================
  add(
    'u5-l2',
    820,
    460,
    'الرسوم التركيبية بالأجزاء: الجرس الكهربائي، مرسل التلفون الكربوني، ومستقبل التلفون',
    `
      <!-- Top Half: Electric Bell Diagram with 6 Numbered Parts -->
      <rect x="20" y="58" width="780" height="202" rx="10" fill="#f8fafc" stroke="#0f766e" stroke-width="1.8"/>
      ${svgStepBadge(665, 68, 250, '1. تركيب الجرس الكهربائي (6 أجزاء)', '#0f766e', '#ffffff')}
      <!-- Battery + Push Switch -->
      <rect x="650" y="114" width="46" height="28" rx="4" fill="#334155"/>
      ${svgTxt(673, 132, 'بطارية', { size: 10, color: '#fff', bold: true })}
      <!-- Contact Screw -->
      <rect x="524" y="138" width="42" height="10" rx="2" fill="#d97706"/>
      <line x1="650" y1="128" x2="566" y2="143" stroke="#0284c7" stroke-width="2.4"/>
      <!-- Spring & Soft Iron Armature -->
      <path d="M475 186 L495 170 L495 154" fill="none" stroke="#64748b" stroke-width="3"/>
      <rect x="488" y="128" width="12" height="58" rx="2" fill="#475569"/>
      <!-- Hammer + Gong -->
      <line x1="488" y1="130" x2="426" y2="118" stroke="#334155" stroke-width="3"/>
      <circle cx="420" cy="116" r="7" fill="#dc2626"/>
      <path d="M350 96 A34 34 0 0 1 350 166 Z" fill="#fde047" stroke="#ca8a04" stroke-width="2.5"/>
      <!-- U-shaped Electromagnet -->
      <rect x="405" y="144" width="56" height="22" rx="3" fill="#64748b"/>
      <rect x="405" y="182" width="56" height="22" rx="3" fill="#64748b"/>
      <rect x="394" y="144" width="14" height="60" fill="#475569"/>
      ${[420, 434, 448].map((x) => `<line x1="${x}" y1="142" x2="${x}" y2="168" stroke="#ea580c" stroke-width="2.5"/><line x1="${x}" y1="180" x2="${x}" y2="206" stroke="#ea580c" stroke-width="2.5"/>`).join('')}
      <polyline points="461,193 673,193 673,142" fill="none" stroke="#dc2626" stroke-width="2.2"/>

      ${svgCallout(434, 155, 224, 102, '1', 'مغناطيس كهربائي', { color: '#0f766e', sub: 'يجذب الحافظة عند مرور التيار' })}
      ${svgCallout(494, 154, 224, 148, '2', 'حافظة حديد مطاوع + زنبرك', { color: '#0284c7', sub: 'تنجذب وتعود عند انقطاع الدائرة' })}
      ${svgCallout(545, 143, 668, 224, '3', 'مسمار التلامس (القطع والوصل)', { color: '#d97706', sub: 'يفتح ويغلق الدائرة آلياً ليتكرر الرنين' })}
      ${svgCallout(356, 130, 224, 198, '4', 'المطرقة والناقوس المعدني', { color: '#dc2626', sub: 'تطرق الناقوس مع كل نبضة تيار' })}
      ${svgTxt(668, 178, 'مفتاح التشغيل (قفل/فتح)', { size: 10.5, bold: true, color: '#0f172a' })}

      <!-- Bottom Right: Carbon Transmitter (NO Magnet!) -->
      <rect x="420" y="272" width="380" height="145" rx="10" fill="#fefce8" stroke="#ca8a04" stroke-width="1.8"/>
      ${svgTxt(610, 294, '2. مرسل التلفون الكربوني (بلا مغناطيس!)', { bold: true, size: 12.5, color: '#854d0e' })}
      <!-- Drawn Cross-section -->
      <line x1="740" y1="312" x2="740" y2="394" stroke="#0284c7" stroke-width="4"/>
      <rect x="692" y="318" width="44" height="70" rx="6" fill="#e2e8f0" stroke="#64748b"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${705 + (i % 2) * 18}" cy="${332 + Math.floor(i / 2) * 14}" r="5" fill="#1e293b"/>`).join('')}
      <rect x="676" y="314" width="16" height="78" rx="3" fill="#334155"/>
      <path d="M776 340 Q762 352 776 364" fill="none" stroke="#dc2626" stroke-width="2"/>
      ${svgCallout(740, 326, 540, 324, 'أ', 'غشاء معدني رقيق', { color: '#0284c7' })}
      ${svgCallout(714, 354, 540, 356, 'ب', 'حبيبات كربون مضغوطة', { color: '#334155' })}
      ${svgCallout(684, 382, 540, 388, 'ج', 'قرص كربون سميك', { color: '#ca8a04', sub: 'يحوّل الصوت لتيار متغير' })}

      <!-- Bottom Left: Telephone Receiver (Electromagnet + Thin Iron Diaphragm) -->
      <rect x="20" y="272" width="380" height="145" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
      ${svgTxt(210, 294, '3. مستقبل التلفون / السماعة (به مغناطيس)', { bold: true, size: 12.5, color: '#1d4ed8' })}
      <!-- Drawn Cross-section -->
      <rect x="330" y="312" width="8" height="82" fill="#475569" stroke="#1e293b"/>
      <rect x="266" y="324" width="50" height="18" fill="#64748b"/>
      <rect x="266" y="362" width="50" height="18" fill="#64748b"/>
      <rect x="256" y="324" width="12" height="56" fill="#2563eb"/>
      ${[278, 290, 302].map((x) => `<line x1="${x}" y1="322" x2="${x}" y2="344" stroke="#ea580c" stroke-width="2"/><line x1="${x}" y1="360" x2="${x}" y2="382" stroke="#ea580c" stroke-width="2"/>`).join('')}
      <path d="M354 340 Q368 352 354 364" fill="none" stroke="#16a34a" stroke-width="2.2"/>
      ${svgCallout(334, 326, 134, 326, 'أ', 'قرص حديد مطاوع رقيق', { color: '#475569' })}
      ${svgCallout(290, 352, 134, 366, 'ب', 'مغناطيس كهربائي', { color: '#2563eb', sub: 'يهتز القرص ليُعيد الصوت' })}
    `,
    'شكل (5-2): الرسوم التركيبية التفصيلية للجرس الكهربائي ومرسل التلفون الكربوني ومستقبله.',
    'مصيدة وزارية متكررة: مرسل التلفون الكربوني لا يحتوي على مغناطيس، بينما المستقبل يحتوي على مغناطيس كهربائي'
  );

  // ==================== u5-l3: رسم الدينامو والمحول الكهربائي الرافع والخافض ====================
  add(
    'u5-l3',
    820,
    430,
    'الحث الكهرومغناطيسي: تركيب الدينامو (المولد AC) والمحول الكهربائي الرافع والخافض',
    `
      <!-- Right: AC Dynamo Drawing -->
      <rect x="420" y="58" width="380" height="330" rx="10" fill="#eff6ff" stroke="#1d4ed8" stroke-width="1.8"/>
      ${svgStepBadge(610, 68, 300, '1. الدينامو (يحوّل الحركة إلى تيار متردد AC)', '#1d4ed8', '#ffffff')}
      <!-- Magnet poles N & S -->
      <rect x="708" y="122" width="66" height="58" rx="6" fill="#dc2626"/>
      ${svgTxt(741, 156, 'N', { size: 16, bold: true, color: '#ffffff' })}
      <rect x="446" y="122" width="66" height="58" rx="6" fill="#2563eb"/>
      ${svgTxt(479, 156, 'S', { size: 16, bold: true, color: '#ffffff' })}
      <!-- Rotating copper coil -->
      <polygon points="565,124 655,134 655,176 565,166" fill="none" stroke="#ea580c" stroke-width="3.5"/>
      <line x1="610" y1="112" x2="610" y2="212" stroke="#64748b" stroke-width="2" stroke-dasharray="3 2"/>
      <!-- Slip rings + Brushes + Galvanometer -->
      <ellipse cx="610" cy="196" rx="18" ry="6" fill="none" stroke="#ca8a04" stroke-width="2.5"/>
      <ellipse cx="610" cy="212" rx="18" ry="6" fill="none" stroke="#ca8a04" stroke-width="2.5"/>
      <polyline points="592,212 552,212 552,248" fill="none" stroke="#334155" stroke-width="2"/>
      <polyline points="628,196 668,196 668,248" fill="none" stroke="#334155" stroke-width="2"/>
      <circle cx="610" cy="248" r="24" fill="#ffffff" stroke="#0f766e" stroke-width="2.2"/>
      <line x1="610" y1="248" x2="622" y2="232" stroke="#dc2626" stroke-width="2.5"/>
      ${svgTxt(610, 264, 'جلفانومتر', { size: 9.5, bold: true, color: '#0f766e' })}
      <!-- AC wave graph -->
      <rect x="470" y="284" width="280" height="52" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
      <line x1="482" y1="310" x2="738" y2="310" stroke="#94a3b8" stroke-dasharray="3 2"/>
      <path d="M490 310 Q520 286 550 310 T610 310 T670 310 T730 310" fill="none" stroke="#0f766e" stroke-width="2.5"/>
      ${svgTxt(610, 355, 'بشرط استمرار الحركة وقطع خطوط الفيض (عند التوقف = صفر)', { size: 10.5, bold: true, color: '#dc2626' })}
      ${svgTxt(610, 374, 'يزداد التيار بزيادة: اللفات + قوة المغناطيس + سرعة الدوران', { size: 10, color: '#334155' })}

      <!-- Left: Transformer Drawing (Step-up vs Step-down) -->
      <rect x="20" y="58" width="380" height="330" rx="10" fill="#f0fdf4" stroke="#0f766e" stroke-width="1.8"/>
      ${svgStepBadge(210, 68, 300, '2. المحول الكهربائي (يعمل بالمتردد AC فقط)', '#0f766e', '#ffffff')}
      <!-- Laminated Iron Core -->
      <rect x="95" y="118" width="230" height="122" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="2.5"/>
      <rect x="135" y="148" width="150" height="62" rx="4" fill="#f0fdf4" stroke="#475569" stroke-width="1.8"/>
      <!-- Primary Coil (Right side of core - fewer turns here for Step-up) -->
      ${[138, 156, 174, 192, 210].map((y) => `<rect x="302" y="${y}" width="32" height="8" rx="3" fill="#ea580c" stroke="#9a3412"/>`).join('')}
      <!-- Secondary Coil (Left side - more turns) -->
      ${[130, 142, 154, 166, 178, 190, 202, 214].map((y) => `<rect x="86" y="${y}" width="32" height="7" rx="3" fill="#0284c7" stroke="#0369a1"/>`).join('')}
      ${svgCallout(320, 174, 344, 266, '1', 'ابتدائي ن1 (جهد ج1)', { color: '#ea580c' })}
      ${svgCallout(100, 174, 78, 266, '2', 'ثانوي ن2 (جهد ج2)', { color: '#0284c7' })}
      ${svgTxt(210, 184, 'قلب حديد شرائح', { size: 11, bold: true, color: '#334155' })}

      <rect x="44" y="294" width="332" height="82" rx="8" fill="#ffffff" stroke="#0f766e"/>
      ${svgTxt(210, 316, 'القانون: ج2 ÷ ج1 = ن2 ÷ ن1', { size: 12.5, bold: true, color: '#0f766e' })}
      ${svgTxt(210, 338, 'ن2 > ن1 : رافع للجهد  |  ن2 < ن1 : خافض للجهد', { size: 11, bold: true })}
      ${svgTxt(210, 362, 'تحذير وزاري: لا يعمل المحول بالبطارية (DC) أبداً!', { size: 11, bold: true, color: '#dc2626' })}
    `,
    'شكل (5-3): تركيب الدينامو (مولد التيار المتردد)، والمحول الكهربائي وقانون حساب الجهد واللفات.'
  );

  // ==================== u5-l4: تشريح الموجة الكهرومغناطيسية والطيف الملوّن ====================
  add(
    'u5-l4',
    820,
    400,
    'تركيب الموجة الكهرومغناطيسية والطيف الكهرومغناطيسي (العلاقة العكسية)',
    `
      <!-- Top: Anatomy of a Transverse Wave -->
      <rect x="20" y="58" width="780" height="176" rx="10" fill="#f8fafc" stroke="#0284c7" stroke-width="1.6"/>
      ${svgTxt(410, 80, 'الخطوة 1: أجزاء الموجة المستعرضة (ع = التردد × الطول الموجي λ)', { bold: true, size: 12.8, color: '#0369a1' })}
      <!-- Axis line -->
      <line x1="65" y1="150" x2="755" y2="150" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>
      <!-- Blue long-wavelength wave -> Purple short-wavelength wave -->
      <path d="M75 150 Q125 90 175 150 T275 150 T375 150" fill="none" stroke="#0284c7" stroke-width="3.2"/>
      <path d="M435 150 Q460 95 485 150 T535 150 T585 150 T635 150 T685 150 T735 150" fill="none" stroke="#7c3aed" stroke-width="3.2"/>
      <!-- Wavelength double indicator -->
      <line x1="125" y1="106" x2="325" y2="106" stroke="#dc2626" stroke-width="2"/>
      ${svgPin(125, 118, '1', '#dc2626', 8)}
      ${svgPin(225, 182, '2', '#0f766e', 8)}
      ${svgTxt(225, 98, 'طول موجي كبير (λ) = تردد منخفض', { size: 11, bold: true, color: '#dc2626' })}
      ${svgTxt(125, 138, 'قمة', { size: 10, bold: true, color: '#0369a1' })}
      ${svgTxt(225, 202, 'قاع', { size: 10, bold: true, color: '#0f766e' })}
      ${svgTxt(585, 102, 'طول موجي قصير = تردد عالٍ وطاقة كبرى', { size: 11, bold: true, color: '#7c3aed' })}
      ${svgTxt(410, 220, 'تنتشر في الفراغ بسرعة ثابتة (300,000 كم/ث) بتعامد مجال كهربائي ومجال مغناطيسي', { size: 10.8, bold: true, color: '#334155' })}

      <!-- Bottom: Full Colored EM Spectrum Band (RTL: Radio -> Gamma) -->
      ${svgTxt(410, 256, 'الخطوة 2: ترتيب الطيف الكهرومغناطيسي (يزداد التردد والطاقة وتقل λ من اليمين لليسار)', { bold: true, size: 12, color: '#0f766e' })}
      ${[
        { x: 694, name: 'راديو وتلفاز', use: 'البث الإذاعي', bg: '#fecaca', c: '#991b1b' },
        { x: 584, name: 'ميكروويف', use: 'الرادار والطهي', bg: '#fed7aa', c: '#9a3412' },
        { x: 474, name: 'تحت حمراء', use: 'الريموت والتصوير', bg: '#fef08a', c: '#854d0e' },
        { x: 364, name: 'الضوء المرئي', use: 'ألوان الطيف السبعة', bg: '#bbf7d0', c: '#166534' },
        { x: 254, name: 'فوق بنفسجية', use: 'تعقيم + فيتامين د', bg: '#bae6fd', c: '#075985' },
        { x: 144, name: 'أشعة سينية X', use: 'تصوير العظام', bg: '#ddd6fe', c: '#5b21b6' },
        { x: 34, name: 'أشعة جاما', use: 'الأعلى طاقة (أورام)', bg: '#fbcfe8', c: '#9d174d' },
      ].map((s) => `
        <rect x="${s.x}" y="268" width="102" height="82" rx="8" fill="${s.bg}" stroke="${s.c}" stroke-width="1.6"/>
        ${svgTxt(s.x + 51, 298, s.name, { size: 11, bold: true, color: s.c })}
        ${svgTxt(s.x + 51, 326, s.use, { size: 9.5, bold: true, color: '#1e293b' })}
      `).join('')}
      ${svgArrow(775, 360, 45, 360, 'red', 2.4)}
    `,
    'شكل (5-4): تشريح الموجة الكهرومغناطيسية، وترتيب الطيف الكهرومغناطيسي من موجات الراديو إلى أشعة جاما.'
  );

  // ==================== u11-l1: الرسوم التوضيحية للخواص الخمس للأجسام الصلبة ====================
  add(
    'u11-l1',
    820,
    380,
    'الرسوم التطبيقية للخواص الميكانيكية الخمس للأجسام الصلبة',
    `
      ${[
        { x: 648, t: '1. المرونة', ex: 'النابض والمطاط', d: 'يعود بعد زوال القوة', bg: '#f0fdfa', c: '#0f766e', icon: 'spring' },
        { x: 492, t: '2. اللدونة', ex: 'الصلصال والشمع', d: 'يتشكل ولا يعود لشكله', bg: '#fefce8', c: '#a16207', icon: 'clay' },
        { x: 336, t: '3. الهشاشة', ex: 'الزجاج والطباشير', d: 'ينكسر عند الطرق', bg: '#fef2f2', c: '#b91c1c', icon: 'glass' },
        { x: 180, t: '4. الطرق والسحب', ex: 'النحاس والذهب', d: 'يُصفّح لأسلاك وألواح', bg: '#fff7ed', c: '#c2410c', icon: 'wire' },
        { x: 24, t: '5. القساوة', ex: 'الألماس (الأقسى)', d: 'مقاومة الخدش', bg: '#eff6ff', c: '#1d4ed8', icon: 'diamond' },
      ].map((p) => {
        const cx = p.x + 73;
        let drawing = '';
        if (p.icon === 'spring') {
          drawing = `<path d="M${cx - 24} 134 L${cx + 24} 142 L${cx - 24} 152 L${cx + 24} 162 L${cx - 24} 172 L${cx + 24} 182" fill="none" stroke="#0f766e" stroke-width="3"/>`;
        } else if (p.icon === 'clay') {
          drawing = `<path d="M${cx - 28} 172 Q${cx - 10} 130 ${cx + 12} 144 Q${cx + 30} 158 ${cx + 24} 176 Z" fill="#f59e0b" stroke="#92400e" stroke-width="2"/>`;
        } else if (p.icon === 'glass') {
          drawing = `<rect x="${cx - 26}" y="132" width="52" height="50" fill="#bae6fd" stroke="#0284c7" stroke-width="1.8"/><path d="M${cx - 8} 132 L${cx + 4} 158 L${cx - 14} 182 M${cx + 4} 158 L${cx + 22} 170" fill="none" stroke="#dc2626" stroke-width="2"/>`;
        } else if (p.icon === 'wire') {
          drawing = `<rect x="${cx - 34}" y="146" width="68" height="14" rx="4" fill="#ea580c" stroke="#9a3412"/><path d="M${cx - 24} 174 Q${cx} 162 ${cx + 24} 174" fill="none" stroke="#c2410c" stroke-width="3"/>`;
        } else {
          drawing = `<polygon points="${cx},126 ${cx + 24},148 ${cx},182 ${cx - 24},148" fill="#7dd3fc" stroke="#1d4ed8" stroke-width="2"/>`;
        }
        return `<rect x="${p.x}" y="68" width="146" height="262" rx="10" fill="${p.bg}" stroke="${p.c}" stroke-width="1.8"/>
          ${svgTxt(cx, 96, p.t, { bold: true, size: 13, color: p.c })}
          ${drawing}
          ${svgTxt(cx, 224, p.ex, { bold: true, size: 11.5, color: '#0f172a' })}
          ${svgTxt(cx, 256, p.d, { size: 10.5, color: '#334155', bold: true })}`;
      }).join('')}
    `,
    'شكل (11-1): الخواص الميكانيكية الخمس للأجسام الصلبة بالرسوم والأمثلة من الكتاب.'
  );

  // ==================== u11-l2: الشد السطحي وطفو الإبرة وسلك الغشاء المزدوج (2ل) ====================
  add(
    'u11-l2',
    820,
    400,
    'خطوات تجربة الشد السطحي (طفو الإبرة ← قطرة الصابون ← حساب ش = ق ÷ 2ل)',
    `
      ${svgArrow(548, 195, 512, 195, 'red', 2.5)}
      <!-- Step 1: Floating Needle on Concave Water Membrane -->
      ${svgStepBadge(672, 60, 220, 'الخطوة 1: وضع الإبرة أفقياً', '#0284c7', '#e0f2fe')}
      <rect x="556" y="96" width="234" height="248" rx="10" fill="#f8fafc" stroke="#0284c7" stroke-width="1.8"/>
      <rect x="588" y="160" width="170" height="86" rx="6" fill="url(#grad-water)" stroke="#0284c7" stroke-width="2"/>
      <!-- Dented water surface holding horizontal needle -->
      <path d="M588 160 L644 160 Q673 172 702 160 L758 160" fill="none" stroke="#0369a1" stroke-width="2.5"/>
      <line x1="636" y1="162" x2="710" y2="162" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
      ${svgCallout(673, 162, 673, 286, '1', 'تطفو الإبرة فوق الغشاء المشدود', { color: '#0369a1', sub: 'لانجذاب جزيئات السطح للأسفل والجانبين' })}

      <!-- Step 2: Soap/Oil Drop -> Needle Sinks -->
      ${svgStepBadge(402, 60, 206, 'الخطوة 2: إضافة زيت أو صابون', '#dc2626', '#fee2e2')}
      <rect x="298" y="96" width="208" height="248" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.8"/>
      <!-- Drop falling -->
      <path d="M402 108 Q412 128 402 134 Q392 128 402 108 Z" fill="#eab308" stroke="#b45309"/>
      <rect x="322" y="160" width="160" height="86" rx="6" fill="#bae6fd" stroke="#dc2626" stroke-width="2"/>
      <!-- Sunken needle at bottom -->
      <line x1="366" y1="234" x2="438" y2="238" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
      ${svgCallout(402, 236, 402, 286, '2', 'يضعف الغشاء فتغوص الإبرة فوراً', { color: '#dc2626', sub: 'المنظفات والتسخين يقللان الشد السطحي' })}

      <!-- Step 3: Double-sided soap film on wire U-frame (2L) -->
      ${svgStepBadge(138, 60, 224, 'الخطوة 3: قياس المعامل (ش = ق ÷ 2ل)', '#0f766e', '#f0fdfa')}
      <rect x="24" y="96" width="234" height="248" rx="10" fill="#f0fdf4" stroke="#0f766e" stroke-width="1.8"/>
      <!-- U wire + movable bar -->
      <polyline points="78,128 78,214 202,214 202,128" fill="none" stroke="#334155" stroke-width="3.5"/>
      <rect x="80" y="164" width="120" height="48" fill="#7dd3fc" fill-opacity="0.7"/>
      <line x1="72" y1="164" x2="208" y2="164" stroke="#0f766e" stroke-width="4"/>
      ${svgArrow(140, 162, 140, 126, 'teal', 2.4)}
      ${svgTxt(164, 142, 'القوة ق', { size: 11, bold: true, color: '#0f766e' })}
      ${svgTxt(140, 194, 'وجه أمامي + وجه خلفي = 2ل', { size: 10.5, bold: true, color: '#0369a1' })}
      ${svgTxt(140, 266, 'القانون الوزاري: ش = ق ÷ (2 × ل)', { size: 11.5, bold: true, color: '#0f766e' })}
      ${svgTxt(140, 290, 'مصيدة: لا يتغير الشد السطحي', { size: 10.5, bold: true, color: '#dc2626' })}
      ${svgTxt(140, 308, 'بزيادة طول السلك (ثابت للسائل)', { size: 10.5, color: '#dc2626' })}
    `,
    'شكل (11-2): خطوات تجربة طفو الإبرة فوق غشاء الماء المشدود، وسقوطها بالصابون، وحساب الشد السطحي (2ل).'
  );

  // ==================== u11-l3 & u11-l4: التماسك والتلاصق والخاصية الشعرية (ماء vs زئبق) ====================
  add(
    'u11-l3',
    820,
    420,
    'قوى التماسك والتلاصق وسطح التقعر للماء مقابل التحدب للزئبق والخاصية الشعرية',
    `
      <!-- Right: Water Basin + 3 Graduated Capillary Tubes -->
      <rect x="420" y="60" width="380" height="316" rx="10" fill="#eff6ff" stroke="#0284c7" stroke-width="1.8"/>
      ${svgStepBadge(610, 72, 320, '1. الماء: تلاصق > تماسك (يرتفع أكثر في الأضيق)', '#0369a1', '#ffffff')}
      <rect x="458" y="232" width="304" height="72" rx="6" fill="url(#grad-water)" stroke="#0284c7" stroke-width="2"/>
      <!-- Wide tube (low rise) -->
      <rect x="680" y="114" width="24" height="162" fill="#ffffff" stroke="#0284c7" stroke-width="1.6"/>
      <rect x="682" y="196" width="20" height="80" fill="#38bdf8"/>
      <path d="M682 196 Q692 204 702 196" fill="none" stroke="#0369a1" stroke-width="2"/>
      <!-- Medium tube -->
      <rect x="598" y="114" width="16" height="162" fill="#ffffff" stroke="#0284c7" stroke-width="1.6"/>
      <rect x="600" y="160" width="12" height="116" fill="#38bdf8"/>
      <path d="M600 160 Q606 167 612 160" fill="none" stroke="#0369a1" stroke-width="2"/>
      <!-- Narrowest tube (highest rise!) -->
      <rect x="514" y="114" width="9" height="162" fill="#ffffff" stroke="#0284c7" stroke-width="1.6"/>
      <rect x="515" y="124" width="7" height="152" fill="#0284c7"/>
      ${svgCallout(518, 128, 492, 168, 'أ', 'أنبوب أضيق = أعلى ارتفاع', { color: '#0369a1' })}
      ${svgCallout(692, 198, 680, 336, 'ب', 'سطح مقعّر يبلل الزجاج', { color: '#0284c7', sub: 'تلاصق الماء مع الزجاج أكبر من التماسك' })}

      <!-- Left: Mercury Basin + 3 Graduated Capillary Tubes -->
      <rect x="20" y="60" width="380" height="316" rx="10" fill="#f8fafc" stroke="#475569" stroke-width="1.8"/>
      ${svgStepBadge(210, 72, 320, '2. الزئبق: تماسك > تلاصق (ينخفض أكثر في الأضيق)', '#334155', '#ffffff')}
      <rect x="58" y="218" width="304" height="86" rx="6" fill="url(#grad-mercury)" stroke="#475569" stroke-width="2"/>
      <!-- Wide tube -->
      <rect x="280" y="114" width="24" height="162" fill="#ffffff" stroke="#475569" stroke-width="1.6"/>
      <rect x="282" y="232" width="20" height="44" fill="#94a3b8"/>
      <path d="M282 232 Q292 224 302 232" fill="none" stroke="#334155" stroke-width="2"/>
      <!-- Medium tube -->
      <rect x="198" y="114" width="16" height="162" fill="#ffffff" stroke="#475569" stroke-width="1.6"/>
      <rect x="200" y="248" width="12" height="28" fill="#94a3b8"/>
      <!-- Narrowest tube (deepest depression!) -->
      <rect x="114" y="114" width="9" height="162" fill="#ffffff" stroke="#475569" stroke-width="1.6"/>
      <rect x="115" y="264" width="7" height="12" fill="#64748b"/>
      ${svgCallout(118, 264, 114, 168, 'أ', 'أنبوب أضيق = أشد انخفاض', { color: '#475569' })}
      ${svgCallout(292, 228, 250, 336, 'ب', 'سطح محدّب لا يبلل الزجاج', { color: '#334155', sub: 'قوة التماسك بين الزئبق أكبر من التلاصق' })}
    `,
    'شكل (11-3): الفرق بين ارتفاع الماء المقعر وانخفاض الزئبق المحدب في الأنابيب الشعرية متدرجة القطر.',
    'تطبيق: صعود الماء في أوعية الخشب بالنبات، وحرث التربة السطحية يقطع الأنابيب الشعرية ليحفظ الرطوبة'
  );

  // ==================== u11-l5: الجريان الانسيابي + قياس اللزوجة + الانتشار بالحرارة ====================
  add(
    'u11-l5',
    820,
    410,
    'الجريان الانسيابي مقابل المضطرب، تجربة قياس اللزوجة، والانتشار في السوائل',
    `
      <!-- 1. Laminar vs Turbulent Flow (Right) -->
      <rect x="556" y="60" width="244" height="302" rx="10" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.8"/>
      ${svgStepBadge(678, 72, 200, '1. الجريان الانسيابي', '#0f766e', '#ffffff')}
      <rect x="576" y="110" width="204" height="72" rx="6" fill="#ffffff" stroke="#0284c7"/>
      <line x1="766" y1="128" x2="592" y2="128" stroke="#0284c7" stroke-width="2.4" marker-end="url(#arr-blue)"/>
      <line x1="766" y1="146" x2="592" y2="146" stroke="#0284c7" stroke-width="2.4" marker-end="url(#arr-blue)"/>
      <line x1="766" y1="164" x2="592" y2="164" stroke="#0284c7" stroke-width="2.4" marker-end="url(#arr-blue)"/>
      ${svgTxt(678, 198, 'انسيابي: مسارات متوازية لا تتقاطع', { size: 10.5, bold: true, color: '#0f766e' })}
      <rect x="576" y="214" width="204" height="72" rx="6" fill="#ffffff" stroke="#dc2626"/>
      <path d="M764 236 Q710 218 670 256 T592 238" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arr-red)"/>
      <path d="M764 264 Q710 278 670 240 T592 264" fill="none" stroke="#dc2626" stroke-width="2.2"/>
      ${svgTxt(678, 304, 'مضطرب: دوامات وتقاطع عند السرعة', { size: 10.5, bold: true, color: '#dc2626' })}
      ${svgTxt(678, 336, 'تُصمم الطائرات والسفن بشكل انسيابي', { size: 10, color: '#334155', bold: true })}

      <!-- 2. Viscosity Falling Ball Cylinders (Middle) -->
      <rect x="288" y="60" width="254" height="302" rx="10" fill="#fffbeb" stroke="#d97706" stroke-width="1.8"/>
      ${svgStepBadge(415, 72, 210, '2. قياس اللزوجة بإسقاط كرة', '#b45309', '#ffffff')}
      ${[
        { x: 472, label: 'ماء', fill: '#bae6fd', ballY: 266, note: 'سريع (قليلة)', c: '#0284c7' },
        { x: 394, label: 'زيت', fill: '#fde047', ballY: 208, note: 'متوسط', c: '#ca8a04' },
        { x: 316, label: 'عسل', fill: '#f59e0b', ballY: 146, note: 'بطيء (عالية)', c: '#92400e' },
      ].map((cyl) => `
        <rect x="${cyl.x}" y="114" width="44" height="172" rx="8" fill="${cyl.fill}" stroke="#475569" stroke-width="1.8"/>
        <circle cx="${cyl.x + 22}" cy="${cyl.ballY}" r="7" fill="#1e293b"/>
        ${svgTxt(cyl.x + 22, 304, cyl.label, { size: 11, bold: true, color: cyl.c })}
        ${svgTxt(cyl.x + 22, 322, cyl.note, { size: 9.5, color: '#334155' })}
      `).join('')}
      ${svgTxt(415, 348, 'بالتسخين تقل اللزوجة ويسهل الجريان!', { size: 10.5, bold: true, color: '#dc2626' })}

      <!-- 3. Diffusion with Cold vs Hot Water (Left) -->
      <rect x="20" y="60" width="254" height="302" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
      ${svgStepBadge(147, 72, 210, '3. الانتشار وتأثير الحرارة', '#1d4ed8', '#ffffff')}
      <!-- Cold Beaker -->
      <rect x="162" y="122" width="84" height="122" rx="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <circle cx="204" cy="222" r="22" fill="#a855f7" fill-opacity="0.5"/>
      <circle cx="204" cy="232" r="7" fill="#6b21a8"/>
      ${svgTxt(204, 264, 'ماء بارد: انتشار بطيء', { size: 10, bold: true, color: '#0369a1' })}
      <!-- Hot Beaker -->
      <rect x="44" y="122" width="84" height="122" rx="6" fill="#e9d5ff" stroke="#7e22ce" stroke-width="2"/>
      <path d="M78 260 Q86 244 94 260 Z" fill="url(#grad-flame)"/>
      ${svgTxt(86, 184, 'انتشر كلياً!', { size: 10.5, bold: true, color: '#581c87' })}
      ${svgTxt(86, 276, 'ماء ساخن: أسرع', { size: 10, bold: true, color: '#dc2626' })}
      ${svgTxt(147, 316, 'من التركيز الأعلى ← الأقل', { size: 11, bold: true })}
      ${svgTxt(147, 342, 'الأسرع: الغازات ثم السوائل', { size: 10.5, color: '#1d4ed8', bold: true })}
    `,
    'شكل (11-4): الجريان الانسيابي والمضطرب، وقياس اللزوجة بسقوط الكرات، وأثر الحرارة في الانتشار.'
  );

  // ==================== u12-l1: تجربة قالب الطوب بأوجهه الثلاثة على الرمل + تحويل نيوتن ====================
  add(
    'u12-l1',
    820,
    410,
    'خطوات تجربة الضغط الصلب (قالب الطوب على الرمل بأوجهه الثلاثة) وقواعد الحساب الوزارية',
    `
      <rect x="28" y="60" width="764" height="44" rx="8" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.6"/>
      ${svgTxt(410, 80, 'القانون الوزاري: ض (باسكال) = ق (نيوتن) ÷ م (م²)  |  تحويل إجباري: ق = الوزن (ث.كجم) × 10', { bold: true, size: 12, color: '#0f766e' })}
      ${svgTxt(410, 97, 'تذكّر: عند الوقوف على قدم واحدة ← نقسم مساحة الحذاء للقدمين على 2 (أي يتضاعف الضغط!)', { bold: true, size: 11, color: '#dc2626' })}

      ${svgArrow(548, 200, 512, 200, 'amber', 2.4)}
      ${svgArrow(290, 200, 254, 200, 'red', 2.4)}

      ${[
        { x: 672, bw: 136, bh: 44, depth: 10, step: '1. الوجه الأكبر مساحة', res: 'أقل ضغط ← انغراس سطحي', c: '#16a34a', bg: '#dcfce7', dim: 'المساحة كبيرة' },
        { x: 402, bw: 86, bh: 72, depth: 20, step: '2. الوجه المتوسط', res: 'ضغط متوسط ← انغراس متوسط', c: '#d97706', bg: '#fef3c7', dim: 'المساحة متوسطة' },
        { x: 138, bw: 48, bh: 110, depth: 38, step: '3. الوجه الأصغر مساحة', res: 'أكبر ضغط ← أعمق انغراس!', c: '#dc2626', bg: '#fee2e2', dim: 'المساحة صغيرة جداً' },
      ].map((b) => `
        ${svgStepBadge(b.x, 114, 200, b.step, b.c, b.bg)}
        <!-- Sand basin -->
        <rect x="${b.x - 98}" y="252" width="196" height="66" rx="8" fill="#fde68a" stroke="#b45309" stroke-width="2"/>
        <!-- Brick sinking by b.depth -->
        <rect x="${b.x - b.bw / 2}" y="${252 - b.bh + b.depth}" width="${b.bw}" height="${b.bh}" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2.2"/>
        ${svgTxt(b.x, 252 - b.bh / 2 + b.depth + 4, b.dim, { size: 9.5, bold: true, color: '#ffffff' })}
        ${svgTxt(b.x, 342, b.res, { size: 11.5, bold: true, color: b.c })}
      `).join('')}
    `,
    'شكل (12-1): تدرج انغراس قالب الطوب في الرمل حسب مساحة القاعدة (الضغط يتناسب عكسياً مع المساحة).'
  );

  // ==================== u12-l2: ضغط السوائل (الثقوب الثلاثة + الأواني المستطرقة + السد) ====================
  add(
    'u12-l2',
    820,
    400,
    'خصائص ضغط السوائل: الازدياد بالعمق، تساوي المستوى بالأواني المستطرقة، وقاعدة السد',
    `
      <!-- 1. 3-Hole Cylinder -->
      <rect x="536" y="60" width="264" height="296" rx="10" fill="#eff6ff" stroke="#0284c7" stroke-width="1.8"/>
      ${svgStepBadge(668, 72, 224, '1. الضغط يزداد مع العمق', '#0369a1', '#ffffff')}
      <rect x="708" y="114" width="66" height="196" rx="4" fill="url(#grad-water)" stroke="#0284c7" stroke-width="2.2"/>
      <!-- Jets -->
      <path d="M708 148 Q670 156 654 308" fill="none" stroke="#0284c7" stroke-width="2.5"/>
      <path d="M708 198 Q634 214 606 308" fill="none" stroke="#0284c7" stroke-width="2.8"/>
      <path d="M708 250 Q594 268 552 308" fill="none" stroke="#dc2626" stroke-width="3.2"/>
      ${svgTxt(632, 146, 'ثقب علوي (ضغط قليل)', { size: 10, bold: true })}
      ${svgTxt(608, 214, 'أوسط (اندفاع متوسط)', { size: 10, bold: true })}
      ${svgTxt(615, 294, 'سفلي (أقصى مدى!)', { size: 10.5, bold: true, color: '#dc2626' })}
      ${svgTxt(668, 336, 'ض = العمق × الكثافة × عجلة الجاذبية', { size: 10.5, bold: true, color: '#0369a1' })}

      <!-- 2. Communicating Vessels (Same Horizontal Level) -->
      <rect x="278" y="60" width="244" height="296" rx="10" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.8"/>
      ${svgStepBadge(400, 72, 214, '2. قاعدة التساوي الأفقي', '#0f766e', '#ffffff')}
      <rect x="304" y="256" width="192" height="32" rx="6" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
      <!-- 4 varied shape vessels up to y=170 -->
      <rect x="310" y="128" width="24" height="130" fill="#ffffff" stroke="#0f766e" stroke-width="1.8"/>
      <rect x="312" y="170" width="20" height="88" fill="#38bdf8"/>
      <polygon points="366,128 398,128 386,258 378,258" fill="#ffffff" stroke="#0f766e" stroke-width="1.8"/>
      <polygon points="370,170 394,170 386,258 378,258" fill="#38bdf8"/>
      <path d="M420 128 Q436 168 420 208 Q436 232 428 258 L442 258 Q450 232 436 208 Q450 168 434 128 Z" fill="#ffffff" stroke="#0f766e" stroke-width="1.8"/>
      <rect x="424" y="170" width="18" height="88" fill="#38bdf8"/>
      <rect x="472" y="128" width="16" height="130" fill="#ffffff" stroke="#0f766e" stroke-width="1.8"/>
      <rect x="474" y="170" width="12" height="88" fill="#38bdf8"/>
      <line x1="296" y1="170" x2="504" y2="170" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="5 3"/>
      ${svgTxt(400, 314, 'لا يتأثر الضغط بشكل الإناء أو اتساعه!', { size: 10.5, bold: true, color: '#0f766e' })}
      ${svgTxt(400, 336, 'تستقر السوائل المتجانسة في مستوى أفقي واحد', { size: 10, color: '#334155' })}

      <!-- 3. Dam Wall Thick at Base -->
      <rect x="20" y="60" width="244" height="296" rx="10" fill="#fffbeb" stroke="#d97706" stroke-width="1.8"/>
      ${svgStepBadge(142, 72, 200, '3. تطبيق: بناء السدود', '#b45309', '#ffffff')}
      <rect x="132" y="126" width="112" height="162" fill="#38bdf8"/>
      <!-- Thick trapezoid dam wall -->
      <polygon points="118,118 134,118 134,288 68,288" fill="#64748b" stroke="#334155" stroke-width="2"/>
      ${svgArrow(168, 152, 136, 152, 'blue', 1.8)}
      ${svgArrow(192, 210, 136, 210, 'blue', 2.4)}
      ${svgArrow(224, 266, 136, 266, 'red', 3.2)}
      ${svgTxt(142, 314, 'السد أعرض وأسمك من الأسفل', { size: 11, bold: true, color: '#92400e' })}
      ${svgTxt(142, 336, 'لتحمّل ضغط الماء الهائل في القاع', { size: 10.5, color: '#475569' })}
    `,
    'شكل (12-2): خصائص ضغط السوائل (العمق، الأواني المستطرقة، وتصميم قاعدة السد العريضة).'
  );

  // ==================== u12-l3: خطوات تجربة تورشللي (24 سم فراغ) + جناح الطائرة (برنولي) ====================
  add(
    'u12-l3',
    820,
    430,
    'تجربة بارومتر تورشللي بالخطوات (فراغ 24 سم) ومقارنة المدن بالضغط الجوي ومبدأ برنولي',
    `
      <!-- Right: Torricelli 3-step apparatus (100cm tube -> 76cm Hg + 24cm vacuum) -->
      <rect x="415" y="58" width="385" height="328" rx="10" fill="#f0fdf4" stroke="#0f766e" stroke-width="1.8"/>
      ${svgStepBadge(607, 68, 320, '1. خطوات بارومتر تورشللي (أنبوبة 100 سم)', '#0f766e', '#ffffff')}
      <!-- Step A: Fill 100cm -->
      <rect x="720" y="114" width="22" height="156" fill="url(#grad-mercury)" stroke="#334155" stroke-width="1.8"/>
      ${svgTxt(731, 288, '1. أنبوبة 100 سم مملوءة زئبقاً', { size: 9.8, bold: true })}
      ${svgArrow(708, 190, 676, 190, 'teal', 2.2)}
      <!-- Step B: Invert in basin -> drops to 76cm leaving 24cm vacuum -->
      <rect x="530" y="242" width="136" height="46" rx="4" fill="#94a3b8" stroke="#334155" stroke-width="2"/>
      <rect x="586" y="106" width="24" height="158" fill="#ffffff" stroke="#334155" stroke-width="2"/>
      <rect x="588" y="148" width="20" height="114" fill="#64748b"/>
      ${svgCallout(598, 126, 492, 128, '1', 'فراغ تورشللي = 24 سم', { color: '#dc2626', sub: '100 - 76 = 24 سم' })}
      ${svgCallout(598, 206, 492, 186, '2', 'عمود الزئبق = 76 سم', { color: '#0f172a', sub: '= 1013 مللي بار' })}
      ${svgCallout(548, 242, 492, 244, '3', 'ضغط الهواء الجوي', { color: '#0284c7', sub: 'يسند عمود الزئبق' })}
      <rect x="432" y="308" width="352" height="62" rx="8" fill="#ffffff" stroke="#0f766e"/>
      ${svgTxt(608, 328, 'المرجع عند سطح البحر = 1013 مللي بار (76 سم زئبق)', { size: 11, bold: true, color: '#0f766e' })}
      ${svgTxt(608, 352, '> 1013 (مثل 1015): تحت سطح البحر  |  < 1013: فوق سطح البحر', { size: 10.5, bold: true, color: '#dc2626' })}

      <!-- Left: Bernoulli Wing Lift Diagram -->
      <rect x="20" y="58" width="380" height="328" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
      ${svgStepBadge(210, 68, 300, '2. مبدأ برنولي وارتفاع جناح الطائرة', '#1d4ed8', '#ffffff')}
      <!-- Airfoil wing cross-section -->
      <path d="M98 206 Q165 148 316 202 Q195 218 98 206 Z" fill="#cbd5e1" stroke="#334155" stroke-width="2.4"/>
      <!-- Fast streamlines over top (low pressure) -->
      <path d="M350 170 Q210 132 70 174" fill="none" stroke="#dc2626" stroke-width="2.6" marker-end="url(#arr-red)"/>
      <path d="M350 186 Q210 144 70 190" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arr-red)"/>
      <!-- Slower streamlines below (high pressure) -->
      <path d="M350 226 L70 226" fill="none" stroke="#0284c7" stroke-width="2.6" marker-end="url(#arr-blue)"/>
      <!-- Upward Lift arrow -->
      ${svgArrow(206, 260, 206, 214, 'teal', 3.4)}
      ${svgTxt(206, 120, 'هواء سريع فوق السطح المقوس ← ضغط أقل (-)', { size: 11, bold: true, color: '#dc2626' })}
      ${svgTxt(206, 282, 'هواء أبطأ أسفل الجناح ← ضغط أكبر (+) يدفع للأعلى!', { size: 11, bold: true, color: '#0369a1' })}
      <rect x="44" y="308" width="332" height="62" rx="8" fill="#ffffff" stroke="#2563eb"/>
      ${svgTxt(210, 328, 'قاعدة برنولي: كلما زادت سرعة المائع قلّ ضغطه', { size: 11, bold: true, color: '#1d4ed8' })}
      ${svgTxt(210, 352, 'تنبيه: البارومتر للضغط الجوي | المانومتر للغازات المحصورة', { size: 10.2, bold: true, color: '#0f766e' })}
    `,
    'شكل (12-3): خطوات تجربة تورشللي (فراغ 24 سم)، ومقارنة المدن بالضغط الجوي، وجناح الطائرة (برنولي).'
  );

  // ==================== u13-l1: زاوية سقوط الإشعاع الشمسي ====================
  add(
    'u13-l1',
    820,
    380,
    'تأثير زاوية سقوط الأشعة الشمسية ولون السطح على كمية الحرارة المكتسبة',
    `
      <!-- Right: Perpendicular vs Oblique Solar Rays on Earth -->
      <rect x="420" y="60" width="380" height="278" rx="10" fill="#fefce8" stroke="#ca8a04" stroke-width="1.8"/>
      ${svgStepBadge(610, 72, 290, '1. زاوية سقوط الإشعاع الشمسي', '#854d0e', '#ffffff')}
      <!-- Earth curve -->
      <path d="M446 300 A180 180 0 0 1 774 300" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5"/>
      <!-- Perpendicular beam (Middle-Right, concentrated small patch) -->
      ${[586, 606, 626].map((x) => svgArrow(x, 108, x, 200, 'red', 2.4)).join('')}
      <rect x="582" y="198" width="52" height="10" fill="#dc2626"/>
      ${svgTxt(608, 228, 'عمودية (الظهيرة والاستواء)', { size: 10.5, bold: true, color: '#b91c1c' })}
      ${svgTxt(608, 246, 'مساحة صغيرة ← حرارة مركّزة قوية', { size: 10.2, bold: true })}
      <!-- Oblique beam (Left side, spread wide) -->
      ${[480, 502, 524].map((x) => svgArrow(x + 28, 120, x - 18, 240, 'amber', 2.2)).join('')}
      <line x1="454" y1="252" x2="528" y2="232" stroke="#d97706" stroke-width="7"/>
      ${svgTxt(504, 286, 'مائلة: تتوزع على مساحة أكبر فتضعف', { size: 10.2, bold: true, color: '#b45309' })}

      <!-- Left: Black Matte vs White Shiny Surface -->
      <rect x="20" y="60" width="380" height="278" rx="10" fill="#f8fafc" stroke="#334155" stroke-width="1.8"/>
      ${svgStepBadge(210, 72, 290, '2. لون السطح وامتصاص الحرارة', '#334155', '#ffffff')}
      <rect x="235" y="138" width="128" height="96" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
      ${svgTxt(299, 174, 'سطح أسود خشن', { size: 11.5, bold: true, color: '#ffffff' })}
      ${svgTxt(299, 198, 'يمتص ~95% من الحرارة', { size: 10.5, bold: true, color: '#fde047' })}
      <rect x="56" y="138" width="128" height="96" rx="8" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
      ${svgTxt(120, 174, 'سطح أبيض مصقول', { size: 11.5, bold: true, color: '#0f172a' })}
      ${svgTxt(120, 198, 'يعكس معظم الأشعة', { size: 10.5, bold: true, color: '#0284c7' })}
      ${svgTxt(210, 274, 'لذلك تُطلى أنابيب السخان الشمسي باللون الأسود المعتم،', { size: 11, bold: true, color: '#0f766e' })}
      ${svgTxt(210, 296, 'وتُصنع المرايا المجمعة في الأفران الشمسية لامعة عاكسة.', { size: 11, color: '#334155' })}
    `,
    'شكل (13-1): تأثير زاوية السقوط الشمسية ولون السطح على تركيز وامتصاص الطاقة الحرارية.'
  );

  // ==================== u13-l2: التركيب التفصيلي للسخان الشمسي الحراري + الفرن الشمسي ====================
  add(
    'u13-l2',
    820,
    420,
    'التركيب الداخلي للسخان الشمسي الحراري (تيارات الحمل) والفرن الشمسي بالمرآة المقعرة',
    `
      <!-- Right: Solar Thermal Water Heater Cross-section with 5 parts -->
      <rect x="335" y="58" width="465" height="318" rx="10" fill="#fff7ed" stroke="#ea580c" stroke-width="1.8"/>
      ${svgStepBadge(567, 68, 320, '1. السخان الشمسي الحراري (الأجزاء الخمسة)', '#c2410c', '#ffffff')}
      <!-- Insulated Tank on Top -->
      <rect x="445" y="102" width="215" height="58" rx="12" fill="#e2e8f0" stroke="#475569" stroke-width="2.2"/>
      <rect x="455" y="110" width="195" height="22" rx="4" fill="#fca5a5"/>
      <rect x="455" y="134" width="195" height="20" rx="4" fill="#bae6fd"/>
      ${svgTxt(552, 125, 'ماء ساخن أعلى الخزان ↑', { size: 10.2, bold: true, color: '#991b1b' })}
      ${svgTxt(552, 148, 'ماء بارد بالأسفل ↓', { size: 10.2, bold: true, color: '#0369a1' })}
      <!-- Tilted Solar Collector Box -->
      <polygon points="505,198 675,198 630,304 460,304" fill="#1e293b" stroke="#0284c7" stroke-width="3"/>
      <!-- Copper Serpentine Pipes -->
      <path d="M486 290 L618 290 L628 265 L498 265 L508 240 L638 240 L648 215 L518 215" fill="none" stroke="#ea580c" stroke-width="4.5"/>
      <!-- Convection flow pipes between tank and collector -->
      <polyline points="518,215 480,160" fill="none" stroke="#dc2626" stroke-width="3.5" marker-end="url(#arr-red)"/>
      <polyline points="620,160 630,285" fill="none" stroke="#0284c7" stroke-width="3.5" marker-end="url(#arr-blue)"/>
      <!-- Solar rays hitting glass cover -->
      ${svgArrow(720, 178, 646, 214, 'amber', 2.4)}
      ${svgArrow(720, 210, 646, 246, 'amber', 2.4)}

      ${svgCallout(652, 130, 725, 118, '1', 'خزان معزول علوي', { color: '#475569' })}
      ${svgCallout(646, 224, 726, 268, '2', 'لوح زجاجي حابس للحرارة', { color: '#0284c7' })}
      ${svgCallout(565, 252, 418, 256, '3', 'أنابيب نحاس سوداء', { color: '#ea580c', sub: 'تمتص الحرارة وتنقلها' })}
      ${svgCallout(495, 188, 418, 198, '4', 'صعود الساخن بالحمل', { color: '#dc2626' })}
      ${svgTxt(567, 344, 'يسخن الماء في المجمّع وتقل كثافته فيصعد للأعلى ويهبط البارد مكانه طبيعياً', { size: 10.5, bold: true, color: '#9a3412' })}

      <!-- Left: Parabolic Dish Solar Cooker/Furnace -->
      <rect x="20" y="58" width="298" height="318" rx="10" fill="#fefce8" stroke="#ca8a04" stroke-width="1.8"/>
      ${svgStepBadge(169, 68, 240, '2. الفرن الشمسي (مرآة مقعرة)', '#a16207', '#ffffff')}
      <path d="M68 278 Q169 328 270 278" fill="none" stroke="#64748b" stroke-width="7"/>
      <path d="M74 276 Q169 320 264 276" fill="none" stroke="#38bdf8" stroke-width="3"/>
      <!-- Focus pot at focal point -->
      <rect x="148" y="182" width="42" height="28" rx="4" fill="#1e293b"/>
      <circle cx="169" cy="196" r="24" fill="none" stroke="#dc2626" stroke-dasharray="3 2"/>
      <!-- Parallel rays reflecting to focus -->
      ${[96, 242].map((rx) => `
        <line x1="${rx}" y1="112" x2="${rx}" y2="288" stroke="#eab308" stroke-width="2" marker-end="url(#arr-amber)"/>
        <line x1="${rx}" y1="288" x2="169" y2="196" stroke="#dc2626" stroke-width="2" marker-end="url(#arr-red)"/>
      `).join('')}
      ${svgCallout(169, 196, 169, 138, 'ب', 'البؤرة (تركيز الأشعة والحرارة)', { color: '#dc2626', sub: 'للشوي والغلي وصهر المعادن' })}
      ${svgTxt(169, 344, 'تجمع المرآة المقعرة الأشعة في نقطة البؤرة', { size: 10.5, bold: true, color: '#854d0e' })}
    `,
    'شكل (13-2): التركيب التشريحي للسخان الشمسي الحراري (تيارات الحمل)، ومبدأ الفرن الشمسي بالمرآة المقعرة.'
  );

  // ==================== u13-l3: الخلية الشمسية الكهروضوئية (n/p) ودائرة النظام الشمسي DC ====================
  add(
    'u13-l3',
    820,
    400,
    'الخلية الشمسية الكهروضوئية (السيليكون) وخطوات إنتاج التيار الكهربائي المستمر (DC)',
    `
      ${svgArrow(522, 195, 486, 195, 'blue', 2.6)}
      ${svgArrow(274, 195, 238, 195, 'teal', 2.6)}

      <!-- Step 1: Silicon PV Cross-Section -->
      ${svgStepBadge(662, 60, 250, 'الخطوة 1: تحرر الإلكترونات بالضوء', '#1d4ed8', '#eff6ff')}
      <rect x="530" y="96" width="266" height="248" rx="10" fill="#eff6ff" stroke="#1d4ed8" stroke-width="1.8"/>
      <!-- Photons -->
      ${svgArrow(618, 108, 638, 152, 'amber', 2.4)}
      ${svgArrow(678, 108, 698, 152, 'amber', 2.4)}
      ${svgTxt(662, 128, 'فوتونات الشمس الساقطة', { size: 10.5, bold: true, color: '#b45309' })}
      <!-- n-type & p-type silicon layers -->
      <rect x="564" y="156" width="196" height="36" fill="#2563eb" stroke="#1e3a8a"/>
      ${svgTxt(662, 179, 'طبقة سيليكون سالبة (n) — إلكترونات -', { size: 10.5, bold: true, color: '#ffffff' })}
      <rect x="564" y="192" width="196" height="12" fill="#94a3b8"/>
      <rect x="564" y="204" width="196" height="36" fill="#dc2626" stroke="#991b1b"/>
      ${svgTxt(662, 227, 'طبقة سيليكون موجبة (p) — فجوات +', { size: 10.5, bold: true, color: '#ffffff' })}
      <rect x="556" y="266" width="212" height="58" rx="6" fill="#ffffff" stroke="#1d4ed8"/>
      ${svgTxt(662, 288, 'الخلايا الشمسية: شرائح سيليكون', { size: 11, bold: true, color: '#1e3a8a' })}
      ${svgTxt(662, 310, 'تنتج تياراً مستمراً (DC) ثابت الاتجاه!', { size: 11, bold: true, color: '#dc2626' })}

      <!-- Step 2: Charge Controller + Battery -->
      ${svgStepBadge(380, 60, 200, 'الخطوة 2: المنظم والبطارية', '#0f766e', '#f0fdfa')}
      <rect x="280" y="96" width="200" height="248" rx="10" fill="#f0fdf4" stroke="#0f766e" stroke-width="1.8"/>
      <rect x="328" y="128" width="104" height="44" rx="6" fill="#14b8a6" stroke="#0f766e" stroke-width="2"/>
      ${svgTxt(380, 155, 'منظم الشحن', { size: 11.5, bold: true, color: '#ffffff' })}
      ${svgArrow(380, 174, 380, 206, 'teal', 2.4)}
      <rect x="320" y="210" width="120" height="62" rx="8" fill="#334155" stroke="#0f172a" stroke-width="2"/>
      ${svgTxt(380, 238, 'بطارية تخزين (DC)', { size: 11.5, bold: true, color: '#fde047' })}
      ${svgTxt(380, 258, 'لتشغيل الأجهزة ليلاً', { size: 10, color: '#ffffff' })}
      ${svgTxt(380, 310, 'يحمي البطارية من الشحن الزائد', { size: 10.5, color: '#0f766e', bold: true })}

      <!-- Step 3: DC Loads vs Inverter for AC -->
      ${svgStepBadge(126, 60, 204, 'الخطوة 3: العاكس والتشغيل', '#d97706', '#fef3c7')}
      <rect x="24" y="96" width="208" height="248" rx="10" fill="#fffbeb" stroke="#d97706" stroke-width="1.8"/>
      <rect x="52" y="128" width="152" height="52" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="1.6"/>
      ${svgTxt(128, 150, 'مصابيح وأجهزة DC', { size: 11, bold: true, color: '#0369a1' })}
      ${svgTxt(128, 170, 'تعمل مباشرة من البطارية', { size: 10, color: '#475569' })}
      <rect x="52" y="206" width="152" height="66" rx="8" fill="#ffffff" stroke="#dc2626" stroke-width="1.6"/>
      ${svgTxt(128, 228, 'العاكس (Inverter)', { size: 11.5, bold: true, color: '#dc2626' })}
      ${svgTxt(128, 250, 'يحوّل DC إلى متردد AC 220V', { size: 10, bold: true })}
      ${svgTxt(128, 310, 'طاقة نظيفة متجددة بلا تلوث ✓', { size: 10.5, bold: true, color: '#15803d' })}
    `,
    'شكل (13-3): مبدأ عمل الخلية الشمسية الكهروضوئية (n/p) ومكونات المنظومة الشمسية الكهربائية.'
  );

  return out;
}
