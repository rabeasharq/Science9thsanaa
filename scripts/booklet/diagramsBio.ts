import { renderSvgToPng, svgArrow, svgCallout, svgCanvas, svgPin, svgStepBadge, svgTxt } from './arabicShaper';

export function buildBioDiagrams(): Record<string, { png: Buffer; caption: string; width: number; height: number }> {
  const out: Record<string, { png: Buffer; caption: string; width: number; height: number }> = {};

  const add = (id: string, w: number, h: number, title: string, body: string, caption: string, footer?: string) => {
    const svg = svgCanvas(w, h, title, body, footer);
    out[id] = { png: renderSvgToPng(svg, 1120), caption, width: 520, height: Math.round((520 * h) / w) };
  };

  // ==================== u6-l1: الأميبا في المياه العذبة مقابل المالحة + خطوات انقباض الفجوة ====================
  add(
    'u6-l1',
    820,
    420,
    'التركيب التشريحي للأميبا: مقارنة أميبا المياه العذبة والمالحة وخطوات طرد الماء بالفجوة المنقبضة',
    `
      <!-- Right: Freshwater Amoeba Anatomy -->
      <rect x="335" y="60" width="465" height="312" rx="10" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.8"/>
      ${svgStepBadge(567, 72, 330, '1. أميبا المياه العذبة (تحتوي فجوة منقبضة)', '#0f766e', '#ffffff')}
      <!-- Organic Amoeba pseudopodia silhouette -->
      <path d="M510 176 Q470 146 502 126 Q542 130 562 114 Q598 98 620 132 Q668 122 678 156 Q692 192 648 208 Q660 250 616 254 Q576 260 554 234 Q504 252 490 218 Q480 192 510 176 Z" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5"/>
      <!-- Nucleus -->
      <ellipse cx="604" cy="176" rx="22" ry="16" fill="#6366f1" stroke="#312e81" stroke-width="1.8"/>
      <!-- Contractile vacuole (star/sun shape with radiating canals) -->
      <circle cx="542" cy="174" r="18" fill="#fef08a" stroke="#ca8a04" stroke-width="2.2"/>
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const rad = (a * Math.PI) / 180;
        return `<line x1="${542 + Math.cos(rad) * 18}" y1="${174 + Math.sin(rad) * 18}" x2="${542 + Math.cos(rad) * 26}" y2="${174 + Math.sin(rad) * 26}" stroke="#ca8a04" stroke-width="1.8"/>`;
      }).join('')}
      <!-- Food vacuole -->
      <circle cx="628" cy="218" r="11" fill="#86efac" stroke="#15803d" stroke-width="1.6"/>
      <!-- Callouts -->
      ${svgCallout(502, 132, 412, 128, '1', 'أقدام كاذبة', { color: '#0284c7', sub: 'للحركة واقتناص الغذاء' })}
      ${svgCallout(542, 174, 412, 182, '2', 'الفجوة المنقبضة', { color: '#b45309', sub: 'تطرد الماء الزائد باستمرار' })}
      ${svgCallout(604, 176, 730, 146, '3', 'النواة', { color: '#4338ca' })}
      ${svgCallout(628, 218, 730, 212, '4', 'فجوة غذائية', { color: '#15803d' })}
      ${svgCallout(668, 174, 730, 268, '5', 'غشاء بلازمي', { color: '#0f766e', sub: 'تبادل CO2 بالانتشار' })}
      <!-- Bottom 3-step contractile vacuole cycle -->
      <rect x="352" y="294" width="430" height="64" rx="8" fill="#ffffff" stroke="#0f766e"/>
      ${svgTxt(567, 314, 'خطوات عمل الفجوة المنقبضة: ① تمتلئ بالماء الزائد ← ② تتجه للغشاء ← ③ تنقبض وتطرده للخارج', { size: 10.6, bold: true, color: '#0f766e' })}
      ${svgTxt(567, 338, 'لماذا؟ لأن تركيز الأملاح داخل أميبا الماء العذب أعلى من الماء المحيط فينفذ الماء باستمرار!', { size: 10.2, bold: true, color: '#334155' })}

      <!-- Left: Marine Amoeba (NO Contractile Vacuole) -->
      <rect x="20" y="60" width="298" height="312" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.8"/>
      ${svgStepBadge(169, 72, 250, '2. أميبا المياه المالحة (وزاري)', '#b91c1c', '#ffffff')}
      <path d="M110 184 Q88 154 126 140 Q168 122 206 142 Q242 156 226 196 Q234 234 184 238 Q138 242 114 218 Z" fill="#e2e8f0" stroke="#475569" stroke-width="2.4"/>
      <ellipse cx="174" cy="184" rx="20" ry="15" fill="#6366f1" stroke="#312e81" stroke-width="1.8"/>
      <circle cx="140" cy="204" r="9" fill="#86efac" stroke="#15803d"/>
      ${svgTxt(169, 274, 'لا توجد بها فجوة منقبضة ✗', { size: 12.5, bold: true, color: '#dc2626' })}
      ${svgTxt(169, 302, 'السبب العلمي: تساوي تركيز الأملاح', { size: 10.8, bold: true, color: '#0f172a' })}
      ${svgTxt(169, 322, 'داخلها وخارجها في البحر فلا يدخلها', { size: 10.8 })}
      ${svgTxt(169, 342, 'ماء زائد يهددها بالانفجار.', { size: 10.8 })}
    `,
    'شكل (6-1): التشريح الدقيق للأميبا وخطوات عمل الفجوة المنقبضة، والفرق بين أميبا المياه العذبة والمالحة.'
  );

  // ==================== u6-l2: قطاع الورقة والثغر (النتح) مقابل الثغر المائي (الإدماع) ====================
  add(
    'u6-l2',
    820,
    420,
    'الإخراج في النبات: تشريح الثغر (النتح نهاراً) مقابل الثغر المائي على حافة الورقة (الإدماع ليلاً)',
    `
      <!-- Right: Stoma & Guard Cells Cross-Section (Transpiration) -->
      <rect x="420" y="60" width="380" height="314" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8"/>
      ${svgStepBadge(610, 72, 290, '1. النتح: بخار ماء عبر الثغور (نهاراً)', '#15803d', '#ffffff')}
      <!-- Two Kidney-shaped Guard Cells around Stoma Pore -->
      <path d="M594 128 C538 128, 534 232, 594 232 C580 202, 580 158, 594 128 Z" fill="#4ade80" stroke="#15803d" stroke-width="2.4"/>
      <path d="M626 128 C682 128, 686 232, 626 232 C640 202, 640 158, 626 128 Z" fill="#4ade80" stroke="#15803d" stroke-width="2.4"/>
      <!-- Chloroplasts inside guard cells -->
      <circle cx="566" cy="162" r="4" fill="#166534"/><circle cx="562" cy="186" r="4" fill="#166534"/>
      <circle cx="654" cy="162" r="4" fill="#166534"/><circle cx="658" cy="186" r="4" fill="#166534"/>
      <!-- Water vapor escaping upward -->
      ${svgArrow(610, 206, 610, 128, 'blue', 2.4, true)}
      ${svgCallout(565, 178, 492, 168, '1', 'خليتان حارستان', { color: '#15803d', sub: 'تفتح وتغلق الثغر' })}
      ${svgCallout(610, 178, 732, 168, '2', 'فتحة الثغر', { color: '#0284c7', sub: 'خروج بخار الماء النقي' })}
      <rect x="438" y="252" width="344" height="106" rx="8" fill="#ffffff" stroke="#16a34a"/>
      ${svgTxt(610, 274, 'يزداد النتح: بالحرارة + الرياح + الإضاءة + الجفاف', { size: 11, bold: true, color: '#15803d' })}
      ${svgTxt(610, 298, 'الفائدة 1: تلطيف حرارة النبات وحمايته من الجفاف الحار', { size: 10.5 })}
      ${svgTxt(610, 320, 'الفائدة 2: توليد قوة شدّ لرفع الماء والأملاح من الجذور', { size: 10.5 })}
      ${svgTxt(610, 342, 'يخرج أيضاً عبر العديسات في السيقان الخشبية', { size: 10, color: '#475569' })}

      <!-- Left: Leaf Margin Hydathode (Guttation at Night) -->
      <rect x="20" y="60" width="380" height="314" rx="10" fill="#eff6ff" stroke="#0284c7" stroke-width="1.8"/>
      ${svgStepBadge(210, 72, 290, '2. الإدماع: قطرات سائلة على الحواف (ليلاً)', '#0369a1', '#ffffff')}
      <!-- Detailed Leaf with veins and water droplets on serrated edge -->
      <path d="M120 228 Q135 128 228 116 Q296 156 266 228 Q210 248 120 228 Z" fill="#86efac" stroke="#15803d" stroke-width="2.4"/>
      <line x1="112" y1="234" x2="226" y2="118" stroke="#166534" stroke-width="2.5"/>
      <line x1="158" y1="202" x2="146" y2="162" stroke="#166534" stroke-width="1.5"/>
      <line x1="190" y1="168" x2="235" y2="180" stroke="#166534" stroke-width="1.5"/>
      <!-- Guttation Droplets on leaf edge -->
      <path d="M140 144 Q146 156 140 160 Q134 156 140 144 Z" fill="#0284c7"/>
      <path d="M268 156 Q275 168 268 172 Q261 168 268 156 Z" fill="#0284c7"/>
      <path d="M276 202 Q283 214 276 218 Q269 214 276 202 Z" fill="#0284c7"/>
      ${svgCallout(268, 166, 326, 134, '1', 'ثغر مائي بالحافة', { color: '#0369a1' })}
      ${svgCallout(140, 152, 82, 134, '2', 'قطرات ماء وأملاح', { color: '#0284c7' })}
      <rect x="38" y="252" width="344" height="106" rx="8" fill="#ffffff" stroke="#0284c7"/>
      ${svgTxt(210, 274, 'يحدث ليلاً وفي الصباح الباكر عند تشبع الجو بالرطوبة', { size: 11, bold: true, color: '#0369a1' })}
      ${svgTxt(210, 298, 'يحتوي ماء الإدماع على أملاح ذائبة (بخلاف النتح النقي)', { size: 10.5 })}
      ${svgTxt(210, 320, 'طريقة ثالثة: تخزين الفضلات في الأوراق المسنة ثم تساقطها', { size: 10.5, bold: true, color: '#b45309' })}
    `,
    'شكل (6-2): التركيب الدقيق للثغر في النتح مقابل الثغور المائية على حواف الأوراق في الإدماع.'
  );

  // ==================== u6-l3: تشريح الجهاز البولي والكلية الطولي ووحدة النيفرون الكاملة ====================
  add(
    'u6-l3',
    820,
    480,
    'التركيب التشريحي الدقيق للكلية والجهاز البولي، وآلية عمل وحدة النيفرون (3 خطوات)',
    `
      <!-- Top Right: Full Urinary System + Longitudinal Kidney Section -->
      <rect x="415" y="58" width="385" height="378" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.8"/>
      ${svgStepBadge(607, 68, 320, '1. القطاع الطولي للكلية والجهاز البولي', '#991b1b', '#ffffff')}

      <!-- Kidney Outer Cortex (Bean Silhouette) -->
      <path d="M582 108 C478 96, 456 296, 582 296 C626 296, 616 244, 594 226 C580 212, 580 192, 594 178 C616 160, 626 114, 582 108 Z" fill="#fca5a5" stroke="#991b1b" stroke-width="2.6"/>
      <!-- Medulla layer with 5 Renal Pyramids -->
      <path d="M572 128 C505 124, 494 274, 572 272 C595 270, 586 232, 576 218 L576 186 C586 172, 595 130, 572 128 Z" fill="#ef4444" opacity="0.28"/>
      ${[
        'M542,136 L562,168 L528,158 Z',
        'M516,164 L554,186 L512,192 Z',
        'M510,202 L554,202 L514,226 Z',
        'M524,238 L558,220 L542,260 Z',
      ].map((pts) => `<path d="${pts}" fill="#b91c1c" opacity="0.72" stroke="#7f1d1d" stroke-width="1.2"/>`).join('')}
      <!-- Renal Pelvis + Calyces -->
      <path d="M558 176 L588 184 L588 222 L558 230 Q570 202 558 176 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="1.8"/>
      <!-- Renal Artery (Red) & Renal Vein (Blue) -->
      <path d="M645 184 L588 184" stroke="#dc2626" stroke-width="6.5" stroke-linecap="round"/>
      <path d="M645 204 L588 204" stroke="#2563eb" stroke-width="6.5" stroke-linecap="round"/>
      <!-- Ureter going down to Bladder -->
      <path d="M588 220 Q622 254 622 332" fill="none" stroke="#eab308" stroke-width="6"/>
      <!-- Mini Bladder at bottom -->
      <ellipse cx="622" cy="342" rx="44" ry="18" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
      ${svgTxt(622, 346, 'المثانة ← مجرى البول', { size: 9.8, bold: true, color: '#78350f' })}

      ${svgCallout(508, 128, 706, 118, '1', 'القشرة (خارجية داكنة)', { color: '#991b1b', sub: 'بها محفظة بومان' })}
      ${svgCallout(532, 186, 706, 158, '2', 'النخاع (أهرامات كلوية)', { color: '#b91c1c', sub: 'التواء هنلي والجامعة' })}
      ${svgCallout(634, 184, 706, 198, '3', 'شريان (أحمر) ووريد (أزرق)', { color: '#2563eb' })}
      ${svgCallout(582, 204, 706, 238, '4', 'حوض الكلية والكؤوس', { color: '#ca8a04' })}
      ${svgCallout(620, 290, 706, 282, '5', 'الحالب ← المثانة', { color: '#b45309' })}
      ${svgTxt(605, 388, 'تحتوي كل كلية على ~1 مليون نيفرون لتنقية الدم من اليوريا (البولينا)', { size: 10.2, bold: true, color: '#991b1b' })}

      <!-- Left: Drawn Nephron Anatomy + 3 Urine Formation Steps -->
      <rect x="20" y="58" width="380" height="378" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
      ${svgStepBadge(210, 68, 320, '2. رسم وحدة النيفرون وخطوات تنقية الدم', '#1d4ed8', '#ffffff')}
      <!-- Bowman's Capsule (C-cup) + Glomerulus (red capillary knot) -->
      <path d="M326 124 A26 26 0 1 0 326 176" fill="#fef9c3" stroke="#ca8a04" stroke-width="3"/>
      <circle cx="324" cy="150" r="14" fill="#ef4444" stroke="#991b1b" stroke-width="1.6"/>
      <path d="M358 142 L324 142 M324 158 L358 158" stroke="#dc2626" stroke-width="3"/>
      <!-- Proximal Convoluted Tubule -->
      <path d="M298 150 Q276 128 256 150 T216 150" fill="none" stroke="#eab308" stroke-width="7" stroke-linecap="round"/>
      <!-- Loop of Henle (Hairpin Down-Up) -->
      <path d="M216 150 L216 256 A18 18 0 0 0 252 256 L252 174" fill="none" stroke="#f59e0b" stroke-width="6.5"/>
      <!-- Distal Tubule -> Collecting Duct -->
      <path d="M252 174 Q220 162 190 176 Q165 190 132 176" fill="none" stroke="#eab308" stroke-width="7"/>
      <rect x="116" y="138" width="16" height="146" rx="4" fill="#d97706" stroke="#92400e" stroke-width="1.8"/>
      <path d="M132 222 L152 222" stroke="#eab308" stroke-width="5"/>
      <!-- Reabsorption red capillary arrow back to blood -->
      ${svgArrow(234, 232, 234, 198, 'red', 2)}

      ${svgCallout(324, 150, 294, 112, 'أ', 'الكبيبة ومحفظة بومان', { color: '#dc2626' })}
      ${svgCallout(234, 266, 290, 286, 'ب', 'التواء هنلي والأنابيب', { color: '#ca8a04' })}
      ${svgCallout(124, 204, 110, 126, 'ج', 'القناة الجامعة', { color: '#92400e' })}

      <rect x="34" y="308" width="352" height="114" rx="8" fill="#ffffff" stroke="#2563eb"/>
      ${svgTxt(210, 328, '① الترشيح (محفظة بومان): يرشح ماء + أملاح + جلوكوز + يوريا', { size: 10.5, bold: true, color: '#dc2626' })}
      ${svgTxt(210, 350, '   (خلايا الدم وبروتينات البلازما كبيرة لا ترشح في السليم!)', { size: 10, color: '#475569' })}
      ${svgTxt(210, 374, '② إعادة الامتصاص (الأنابيب وهنلي): يعود 100% جلوكوز + معظم الماء', { size: 10.5, bold: true, color: '#15803d' })}
      ${svgTxt(210, 398, '③ القناة الجامعة: يخرج البول (ماء + أملاح زائدة + يوريا) ← الحالب', { size: 10.5, bold: true, color: '#b45309' })}
    `,
    'شكل (6-3): القطاع الطولي الدقيق للكلية والجهاز البولي، وتشريح وحدة النيفرون وخطوات تكوين البول.',
    'الإخراج بالكلية ينقي الدم من البولينا (اليوريا) الناتجة عن هدم البروتينات وينظم ماء الجسم وأملاحه'
  );

  // ==================== u6-l4: قطاع تشريحي ملوّن للجلد البشري والغدة العرقية ====================
  add(
    'u6-l4',
    820,
    430,
    'القطاع التشريحي الملوّن للجلد البشري وآلية الإخراج والتبريد عبر الغدد العرقية',
    `
      <!-- Left: Cross-Section of Human Skin -->
      <rect x="20" y="58" width="490" height="328" rx="10" fill="#fffbeb" stroke="#d97706" stroke-width="1.8"/>
      ${svgStepBadge(265, 68, 320, 'القطاع التشريحي لجلد الإنسان (البشرة والأدمة)', '#b45309', '#ffffff')}

      <!-- Epidermis layer -->
      <rect x="46" y="106" width="300" height="38" fill="#fed7aa" stroke="#ea580c" stroke-width="1.6"/>
      <!-- Dermis layer -->
      <rect x="46" y="144" width="300" height="156" fill="#fecaca" stroke="#ef4444" stroke-width="1.6"/>
      <!-- Subcutaneous Fat layer -->
      <rect x="46" y="300" width="300" height="44" fill="#fef08a" stroke="#eab308" stroke-width="1.6"/>
      ${[70, 110, 150, 190, 230, 270, 310].map((fx) => `<ellipse cx="${fx}" cy="322" rx="16" ry="12" fill="#fde047" stroke="#ca8a04"/>`).join('')}

      <!-- Hair Follicle + Sebaceous Gland -->
      <path d="M120 278 Q128 212 136 96" fill="none" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="122" cy="278" rx="12" ry="16" fill="#334155"/>
      <ellipse cx="144" cy="184" rx="14" ry="9" fill="#fde047" stroke="#ca8a04"/>

      <!-- Coiled Sweat Gland + Duct + Pore + Capillaries -->
      <path d="M254 274 C236 274, 236 250, 254 250 C272 250, 272 284, 246 284 C228 284, 234 238, 254 236 L254 106" fill="none" stroke="#0284c7" stroke-width="4.5"/>
      <circle cx="254" cy="106" r="5" fill="#0369a1"/>
      <!-- Sweat droplets on skin surface -->
      <circle cx="246" cy="96" r="3" fill="#38bdf8"/><circle cx="262" cy="94" r="3.5" fill="#38bdf8"/>
      <!-- Blood Capillaries around sweat gland -->
      <path d="M210 274 Q232 292 254 276 Q278 262 296 278" fill="none" stroke="#dc2626" stroke-width="2.5"/>
      <path d="M210 264 Q234 248 256 262 Q278 278 296 264" fill="none" stroke="#2563eb" stroke-width="2"/>

      ${svgCallout(346, 125, 428, 118, '1', 'البشرة (خارجية)', { color: '#ea580c' })}
      ${svgCallout(254, 106, 428, 160, '2', 'المسام العرقية', { color: '#0369a1' })}
      ${svgCallout(254, 178, 428, 202, '3', 'القناة العرقية', { color: '#0284c7' })}
      ${svgCallout(254, 268, 428, 246, '4', 'الغدة العرقية الملتفة', { color: '#0f766e', sub: 'في طبقة الأدمة' })}
      ${svgCallout(282, 274, 428, 294, '5', 'شعيرات دموية', { color: '#dc2626' })}
      ${svgCallout(126, 212, 428, 336, '6', 'الشعرة والطبقة الدهنية', { color: '#854d0e' })}

      <!-- Right: Step-by-step Sweating Role & Ministerial Regions -->
      <rect x="524" y="58" width="276" height="328" rx="10" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.8"/>
      ${svgTxt(662, 86, 'خطوات الإخراج والتبريد بالعرق:', { size: 12.5, bold: true, color: '#0f766e' })}
      <rect x="538" y="102" width="248" height="62" rx="8" fill="#ffffff" stroke="#0284c7"/>
      ${svgTxt(662, 124, '1. استخلاص العرق من الشعيرات:', { size: 11, bold: true, color: '#0369a1' })}
      ${svgTxt(662, 146, 'ماء + أملاح معدنية + قليل من البولينا', { size: 10.5 })}

      <rect x="538" y="176" width="248" height="72" rx="8" fill="#ffffff" stroke="#0f766e"/>
      ${svgTxt(662, 198, '2. التبريد وتنظيم حرارة الجسم:', { size: 11, bold: true, color: '#0f766e' })}
      ${svgTxt(662, 220, 'تبخر العرق يمتص حرارة من الجلد', { size: 10.5 })}
      ${svgTxt(662, 238, 'فيخفض درجة حرارة الجسم صيفاً ✓', { size: 10.5, bold: true, color: '#15803d' })}

      <rect x="538" y="260" width="248" height="110" rx="8" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>
      ${svgTxt(662, 282, 'معلومة وزارية أكيدة:', { size: 11.5, bold: true, color: '#b91c1c' })}
      ${svgTxt(662, 304, 'تكثر مسام الغدد العرقية في:', { size: 11, bold: true })}
      ${svgTxt(662, 326, 'الجبهة • تحت الذراع • راحة اليد', { size: 10.8, bold: true, color: '#0f766e' })}
      ${svgTxt(662, 348, 'وأخمص القدمين!', { size: 11, bold: true, color: '#0f766e' })}
    `,
    'شكل (6-4): القطاع التشريحي للجلد البشري (البشرة والأدمة والغدد العرقية) وخطوات تكوين العرق.'
  );

  // ==================== u7-l1: القطاع الطولي الكامل للزهرة + خطوات التلقيح ونمو أنبوب اللقاح والإخصاب ====================
  add(
    'u7-l1',
    820,
    470,
    'القطاع الطولي الملوّن للزهرة النموذجية بجميع أجزائها وخطوات التلقيح والإخصاب',
    `
      <!-- Right: Full Botanical Flower Cross-Section with 8 Labeled Parts -->
      <rect x="330" y="58" width="470" height="368" rx="10" fill="#fdf2f8" stroke="#db2777" stroke-width="1.8"/>
      ${svgStepBadge(565, 68, 330, '1. التركيب التشريحي للزهرة الخنثى النموذجية', '#be185d', '#ffffff')}

      <!-- Stem & Receptacle -->
      <rect x="556" y="302" width="18" height="72" fill="#16a34a" stroke="#14532d" stroke-width="1.6"/>
      <ellipse cx="565" cy="296" rx="34" ry="12" fill="#22c55e" stroke="#14532d" stroke-width="1.8"/>
      <!-- Sepals (Green Calyx) -->
      <path d="M532 292 Q495 276 488 250 Q518 264 538 286 Z" fill="#4ade80" stroke="#15803d" stroke-width="1.8"/>
      <path d="M598 292 Q635 276 642 250 Q612 264 592 286 Z" fill="#4ade80" stroke="#15803d" stroke-width="1.8"/>
      <!-- Petals (Vibrant Pink Corolla) -->
      <path d="M536 286 C452 246, 464 130, 528 136 C550 156, 550 236, 542 284 Z" fill="#f472b6" fill-opacity="0.78" stroke="#db2777" stroke-width="2"/>
      <path d="M594 286 C678 246, 666 130, 602 136 C580 156, 580 236, 588 284 Z" fill="#f472b6" fill-opacity="0.78" stroke="#db2777" stroke-width="2"/>
      <!-- Stamens (Filaments + Anthers with pollen) -->
      <path d="M542 282 Q516 208 504 166" fill="none" stroke="#15803d" stroke-width="3.5"/>
      <ellipse cx="504" cy="160" rx="12" ry="7" fill="#eab308" stroke="#a16207" stroke-width="1.8"/>
      <path d="M588 282 Q614 208 626 166" fill="none" stroke="#15803d" stroke-width="3.5"/>
      <ellipse cx="626" cy="160" rx="12" ry="7" fill="#eab308" stroke="#a16207" stroke-width="1.8"/>
      <!-- Carpel / Pistil (Ovary + Ovule + Style + Stigma) -->
      <ellipse cx="565" cy="256" rx="28" ry="34" fill="#fef08a" stroke="#ca8a04" stroke-width="2.2"/>
      <ellipse cx="565" cy="258" rx="13" ry="17" fill="#fffbeb" stroke="#b45309" stroke-width="1.6"/>
      <circle cx="565" cy="258" r="5" fill="#dc2626"/>
      <rect x="558" y="156" width="14" height="72" fill="#fef08a" stroke="#ca8a04" stroke-width="1.8"/>
      <ellipse cx="565" cy="150" rx="20" ry="10" fill="#f59e0b" stroke="#b45309" stroke-width="1.8"/>

      ${svgCallout(504, 160, 422, 130, '1', 'المتك (حبوب اللقاح)', { color: '#ca8a04' })}
      ${svgCallout(516, 212, 422, 178, '2', 'الخيط (= سداة مذكرة)', { color: '#15803d' })}
      ${svgCallout(486, 224, 422, 226, '3', 'البتلة (التويج الملوّن)', { color: '#db2777' })}
      ${svgCallout(506, 272, 422, 276, '4', 'السبلة (الكأس الأخضر)', { color: '#16a34a' })}
      ${svgCallout(565, 296, 422, 326, '5', 'التخت (حامل الزهرة)', { color: '#14532d' })}
      ${svgCallout(582, 150, 712, 134, '6', 'الميسم (لزج)', { color: '#b45309' })}
      ${svgCallout(572, 194, 712, 192, '7', 'القلم (أنبوبي)', { color: '#ca8a04' })}
      ${svgCallout(592, 256, 712, 256, '8', 'المبيض ← يتحول لثمرة', { color: '#be185d' })}
      ${svgCallout(568, 260, 712, 318, '9', 'البويضة ← تتحول لبذرة', { color: '#dc2626' })}

      ${svgTxt(565, 404, 'المتاع (عضو التأنيث) = الميسم + القلم + المبيض  |  الطلع (عضو التذكير) = الأسدية', { size: 10.5, bold: true, color: '#9d174d' })}

      <!-- Left: 3-Step Pollination & Pollen Tube Growth & Fertilization -->
      <rect x="20" y="58" width="298" height="368" rx="10" fill="#f0fdf4" stroke="#0f766e" stroke-width="1.8"/>
      ${svgStepBadge(169, 68, 250, '2. خطوات التلقيح والإخصاب (1 ← 3)', '#0f766e', '#ffffff')}

      <!-- Step 1 -->
      <rect x="34" y="106" width="270" height="86" rx="8" fill="#ffffff" stroke="#0284c7"/>
      ${svgPin(284, 126, '1', '#0284c7', 10)}
      ${svgTxt(158, 128, 'التلقيح: انتقال حبة اللقاح للميسم', { size: 11, bold: true, color: '#0369a1' })}
      ${svgTxt(158, 150, '• ذاتي (نفس الزهرة/النبات)', { size: 10.2 })}
      ${svgTxt(158, 170, '• خلطي (بالحشرات/الرياح: أفضل!)', { size: 10.2, bold: true, color: '#15803d' })}

      <!-- Step 2: Pollen tube diagram -->
      <rect x="34" y="204" width="270" height="106" rx="8" fill="#ffffff" stroke="#d97706"/>
      ${svgPin(284, 224, '2', '#d97706', 10)}
      <path d="M58 222 L58 286" stroke="#f59e0b" stroke-width="6"/>
      <circle cx="58" cy="220" r="6" fill="#ca8a04"/>
      <path d="M58 222 L58 282" stroke="#dc2626" stroke-width="2" stroke-dasharray="3 2"/>
      ${svgTxt(172, 228, 'نمو أنبوب اللقاح عبر القلم:', { size: 11, bold: true, color: '#b45309' })}
      ${svgTxt(172, 252, 'تنبت حبة اللقاح أنبوباً يخترق القلم', { size: 10.2 })}
      ${svgTxt(172, 272, 'لتصل النواة الذكرية إلى البويضة', { size: 10.2 })}
      ${svgTxt(172, 294, 'وتندمج معها (الإخصاب)', { size: 10.5, bold: true, color: '#dc2626' })}

      <!-- Step 3: Fruit & Seed -->
      <rect x="34" y="322" width="270" height="86" rx="8" fill="#fef2f2" stroke="#dc2626"/>
      ${svgPin(284, 342, '3', '#dc2626', 10)}
      ${svgTxt(158, 344, 'بعد الإخصاب (سؤال وزاري ثابت):', { size: 11, bold: true, color: '#b91c1c' })}
      ${svgTxt(158, 368, '• يتحول المبيض ← ثمرة ناضجة', { size: 11, bold: true, color: '#15803d' })}
      ${svgTxt(158, 390, '• تتحول البويضة المخصبة ← بذرة', { size: 11, bold: true, color: '#0f766e' })}
    `,
    'شكل (7-1): القطاع الطولي المفصّل للزهرة الخنثى بجميع أجزائها، وخطوات التلقيح والإخصاب وتكوين الثمرة والبذرة.'
  );

  // ==================== u7-l2: التكاثر اللاجنسي بالرسم + الإخصاب في الإنسان ====================
  add(
    'u7-l2',
    820,
    440,
    'صور التكاثر اللاجنسي بالرسم ومسار الإخصاب وتكوين اللاقحة (2n) في الإنسان',
    `
      <!-- Top: Asexual Reproduction Illustrations -->
      <rect x="20" y="58" width="780" height="170" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8"/>
      ${svgStepBadge(665, 68, 250, '1. صور التكاثر اللاجنسي (أب واحد)', '#15803d', '#ffffff')}

      <!-- 1. Binary Fission (Amoeba) -->
      <ellipse cx="705" cy="146" rx="28" ry="18" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
      <circle cx="705" cy="146" r="6" fill="#4338ca"/>
      ${svgArrow(672, 146, 646, 146, 'blue', 2)}
      <circle cx="622" cy="146" r="14" fill="#bae6fd" stroke="#0284c7" stroke-width="1.8"/>
      <circle cx="592" cy="146" r="14" fill="#bae6fd" stroke="#0284c7" stroke-width="1.8"/>
      ${svgTxt(650, 192, '① الانشطار الثنائي (الأميبا والبكتيريا)', { size: 10.5, bold: true, color: '#0369a1' })}
      ${svgTxt(650, 212, 'ينتج فردان متطابقان تماماً', { size: 9.8, color: '#475569' })}

      <!-- 2. Budding (Hydra / Yeast) -->
      <rect x="396" y="122" width="18" height="48" rx="6" fill="#4ade80" stroke="#15803d" stroke-width="1.8"/>
      <path d="M414 148 Q434 142 430 124" fill="none" stroke="#15803d" stroke-width="6" stroke-linecap="round"/>
      <line x1="398" y1="122" x2="390" y2="108" stroke="#15803d" stroke-width="2"/>
      <line x1="412" y1="122" x2="420" y2="108" stroke="#15803d" stroke-width="2"/>
      ${svgTxt(410, 192, '② التبرعم (الهيدرا والخميرة)', { size: 10.5, bold: true, color: '#15803d' })}
      ${svgTxt(410, 212, 'نمو برعم جانبي ثم ينفصل', { size: 9.8, color: '#475569' })}

      <!-- 3. Regeneration (Starfish) -->
      <polygon points="154,106 164,132 192,132 170,148 178,174 154,158 130,174 138,148 116,132 144,132" fill="#fb923c" stroke="#c2410c" stroke-width="1.8"/>
      ${svgTxt(154, 192, '③ التجدد (نجم البحر) والأبواغ (العفن)', { size: 10.5, bold: true, color: '#c2410c' })}
      ${svgTxt(154, 212, 'تعويض جزء مفقود إلى كائن كامل', { size: 9.8, color: '#475569' })}

      <!-- Bottom: Human Fertilization Pathway (Ovary -> Fallopian Tube 1st third -> Uterus Implantation) -->
      <rect x="20" y="238" width="780" height="156" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
      ${svgStepBadge(650, 248, 280, '2. مسار الإخصاب في الإنسان (2n = 46)', '#1d4ed8', '#ffffff')}

      <!-- Uterus (central pear shape) & Fallopian tube & Ovary drawn diagram -->
      <path d="M510 302 L560 302 L550 356 L520 356 Z" fill="#fbcfe8" stroke="#db2777" stroke-width="2"/>
      <!-- Right Fallopian Tube curve to Ovary -->
      <path d="M560 304 Q625 280 658 314" fill="none" stroke="#db2777" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="662" cy="330" rx="16" ry="11" fill="#fde047" stroke="#ca8a04" stroke-width="1.8"/>
      <circle cx="628" cy="296" r="5" fill="#dc2626"/>
      ${svgCallout(662, 330, 738, 304, '1', 'المبيض (بويضة n)', { color: '#ca8a04' })}
      ${svgCallout(628, 296, 738, 356, '2', 'الثلث الأول من قناة فالوب', { color: '#dc2626', sub: 'موقع حدوث الإخصاب!' })}

      <!-- Formula & Implant steps on Left -->
      <rect x="38" y="274" width="380" height="106" rx="8" fill="#ffffff" stroke="#1d4ed8"/>
      ${svgTxt(228, 296, 'حيوان منوي (n=23) + بويضة (n=23) ⟶ لاقحة / زيجوت (2n=46)', { size: 11, bold: true, color: '#dc2626' })}
      ${svgTxt(228, 322, '① تغلق البويضة المخصبة غشاءها لمنع دخول حيوان منوي آخر', { size: 10.5 })}
      ${svgTxt(228, 344, '② تنقسم اللاقحة وتتحرك نحو الرحم لتنغرس في بطانته السميكة', { size: 10.5, bold: true, color: '#0f766e' })}
      ${svgTxt(228, 366, '③ يتكوّن الجنين محاطاً بالمشيمة لمدة تسعة أشهر', { size: 10.5 })}
    `,
    'شكل (7-2): صور التكاثر اللاجنسي بالرسم، ومسار حدوث الإخصاب في الثلث الأول من قناة فالوب.'
  );

  // ==================== u8-l1: دورة حياة البلهارسيا بالرسم + حصى الكلى ====================
  add(
    'u8-l1',
    820,
    430,
    'دورة عدوى البلهارسيا البولية المرسومة خطوة بخطوة وتكوّن حصى الكلى',
    `
      <!-- Right-to-Left 4-Step Bilharzia Cycle -->
      <rect x="20" y="58" width="780" height="236" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.8"/>
      ${svgTxt(410, 80, 'خطوات دورة حياة البلهارسيا البولية (العائل الأساسي: الإنسان | العائل الوسيط: قوقع البولينس)', { size: 12.2, bold: true, color: '#991b1b' })}
      ${svgArrow(592, 178, 560, 178, 'red', 2.4)}
      ${svgArrow(394, 178, 362, 178, 'amber', 2.4)}
      ${svgArrow(196, 178, 164, 178, 'red', 2.4)}

      <!-- Step 1 -->
      ${svgStepBadge(700, 96, 168, '1. خروج البيض بالبول', '#dc2626', '#ffffff')}
      <rect x="614" y="128" width="172" height="148" rx="8" fill="#ffffff" stroke="#dc2626"/>
      <ellipse cx="700" cy="172" rx="18" ry="11" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
      <polygon points="718,172 728,169 728,175" fill="#ca8a04"/>
      ${svgTxt(700, 212, 'بيضة ذات شوكة طرفية', { size: 10.5, bold: true })}
      ${svgTxt(700, 234, 'تخرج مع بول المريض', { size: 10 })}
      ${svgTxt(700, 254, 'إلى مياه البرك والترع', { size: 10, color: '#0284c7', bold: true })}

      <!-- Step 2 -->
      ${svgStepBadge(476, 96, 152, '2. يرقة ميراسيديوم', '#0284c7', '#ffffff')}
      <rect x="400" y="128" width="152" height="148" rx="8" fill="#ffffff" stroke="#0284c7"/>
      <ellipse cx="476" cy="172" rx="22" ry="11" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
      ${svgTxt(476, 212, 'تفقس البيضة في الماء العذب', { size: 10.2, bold: true })}
      ${svgTxt(476, 234, 'وتسبح بحثاً عن القوقع', { size: 10 })}

      <!-- Step 3: Bulinus Snail -->
      ${svgStepBadge(278, 96, 156, '3. قوقع البولينس', '#d97706', '#ffffff')}
      <rect x="200" y="128" width="156" height="148" rx="8" fill="#ffffff" stroke="#d97706"/>
      <circle cx="278" cy="172" r="22" fill="#fed7aa" stroke="#b45309" stroke-width="2"/>
      <circle cx="282" cy="172" r="12" fill="none" stroke="#92400e" stroke-width="1.8"/>
      <circle cx="284" cy="172" r="5" fill="#92400e"/>
      ${svgTxt(278, 212, 'العائل الوسيط (هام)', { size: 10.5, bold: true, color: '#b45309' })}
      ${svgTxt(278, 234, 'تتكاثر بداخله وتخرج', { size: 10 })}
      ${svgTxt(278, 254, 'بالمئات للماء العذب', { size: 10 })}

      <!-- Step 4: Cercaria -->
      ${svgStepBadge(92, 96, 134, '4. طور السركاريا', '#b91c1c', '#ffffff')}
      <rect x="28" y="128" width="128" height="148" rx="8" fill="#ffffff" stroke="#b91c1c"/>
      <ellipse cx="92" cy="162" rx="14" ry="9" fill="#fca5a5" stroke="#dc2626" stroke-width="1.8"/>
      <path d="M92 171 L92 192 M92 192 L84 202 M92 192 L100 202" stroke="#dc2626" stroke-width="2"/>
      ${svgTxt(92, 222, 'يخترق جلد الإنسان', { size: 10.2, bold: true, color: '#dc2626' })}
      ${svgTxt(92, 242, 'أثناء السباحة ويسبب', { size: 10 })}
      ${svgTxt(92, 260, 'التبول الدموي', { size: 10, bold: true })}

      <!-- Bottom: Kidney Stones & Prevention -->
      <rect x="20" y="304" width="780" height="82" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.6"/>
      ${svgTxt(595, 330, '• حصى الكلى والحالب: ترسب أملاح الكالسيوم واليوريك في حوض الكلية', { size: 11.2, bold: true, color: '#b45309' })}
      ${svgTxt(595, 356, 'تسبب مغصاً كلوياً حاداً؛ الوقاية: شرب ≥2 لتر ماء وتقليل الأملاح', { size: 10.5 })}
      ${svgTxt(190, 330, '• الوقاية من البلهارسيا:', { size: 11.2, bold: true, color: '#15803d' })}
      ${svgTxt(190, 356, 'عدم التبول أو السباحة بالبرك ومكافحة القواقع', { size: 10.5, bold: true })}
    `,
    'شكل (8-1): دورة عدوى البلهارسيا البولية المرسومة بأطوارها الأربعة، وتكوّن حصى الكلى والوقاية منهما.'
  );

  // ==================== u8-l2: أمراض الجهاز التناسلي وطرق انتقالها ====================
  add(
    'u8-l2',
    820,
    380,
    'مقارنة أمراض الجهاز التناسلي (المسبّب، الأعراض، وطرق الانتقال المعتمدة وزارياً)',
    `
      ${[
        {
          x: 548,
          title: '1. مرض السيلان',
          cause: 'بكتيريا كروية',
          c: '#dc2626',
          bg: '#fef2f2',
          points: ['التهاب وصديد بمجرى البول', 'قد يسبب العقم إذا أُهمل', 'ينتقل بالاتصال المحرم أو:', 'المرحاض الأوروبي الملوث ✓', 'والمناشف الملوثة (وزاري!)'],
        },
        {
          x: 288,
          title: '2. مرض الزهري (السفلس)',
          cause: 'بكتيريا لولبية (حلزونية)',
          c: '#d97706',
          bg: '#fffbeb',
          points: ['يبدأ بقرحة غير مؤلمة', 'ثم ينتشر للقلب والدماغ', 'ينتقل بالاتصال المحرم', 'وينتقل من الأم للجنين عبر:', 'المشيمة أثناء الحمل ✓'],
        },
        {
          x: 28,
          title: '3. مرض الإيدز (AIDS)',
          cause: 'فيروس HIV',
          c: '#7c3aed',
          bg: '#f5f3ff',
          points: ['يدمر خلايا المناعة البيضاء', 'ينتقل بالاتصال أو نقل دم ملوث', 'أو مشاركة الإبر والأم للجنين', 'لا ينتقل بالمصافحة أو الأكل', 'أو لدغ البعوض إطلاقاً ✓'],
        },
      ].map((d) => `
        <rect x="${d.x}" y="62" width="244" height="270" rx="10" fill="${d.bg}" stroke="${d.c}" stroke-width="1.8"/>
        <rect x="${d.x}" y="62" width="244" height="36" rx="8" fill="${d.c}"/>
        ${svgTxt(d.x + 122, 86, d.title, { bold: true, size: 13.5, color: '#ffffff' })}
        <rect x="${d.x + 22}" y="110" width="200" height="28" rx="6" fill="#ffffff" stroke="${d.c}"/>
        ${svgTxt(d.x + 122, 128, 'المسبّب: ' + d.cause, { bold: true, size: 11.2, color: d.c })}
        ${d.points.map((pt, i) => svgTxt(d.x + 122, 164 + i * 32, pt, { size: 11, bold: pt.includes('✓'), color: pt.includes('✓') ? '#0f766e' : '#1e293b' })).join('')}
      `).join('')}
    `,
    'شكل (8-2): مقارنة أمراض الجهاز التناسلي الثلاثة (المسبّب البكتيري والفيروسي وطرق الانتقال والوقاية).',
    'الوقاية الأساسية: العفة، النظافة الشخصية، عدم مشاركة المناشف وشفرات الحلاقة، وفحص الدم قبل نقله'
  );

  // ==================== u14-l1: تنمية الثروة النباتية والحيوانية بالرسم ====================
  add(
    'u14-l1',
    820,
    400,
    'الوسائل الحديثة لتنمية الثروة النباتية والحيوانية والصناعات المعتمدة عليهما',
    `
      <!-- 1. Drip Irrigation Drawn Diagram (Right) -->
      <rect x="548" y="60" width="252" height="294" rx="10" fill="#eff6ff" stroke="#0284c7" stroke-width="1.8"/>
      ${svgStepBadge(674, 72, 210, '1. الري الحديث بالتنقيط', '#0369a1', '#ffffff')}
      <rect x="568" y="190" width="212" height="10" rx="3" fill="#1e293b"/>
      <rect x="568" y="256" width="212" height="22" fill="#d97706" fill-opacity="0.35"/>
      <!-- 3 plants with direct drip drops -->
      ${[604, 674, 744].map((px) => `
        <path d="M${px} 256 L${px} 214" stroke="#15803d" stroke-width="4"/>
        <ellipse cx="${px - 10}" cy="224" rx="10" ry="6" fill="#22c55e"/>
        <ellipse cx="${px + 10}" cy="224" rx="10" ry="6" fill="#22c55e"/>
        <circle cx="${px}" cy="206" r="3" fill="#0284c7"/>
        <circle cx="${px}" cy="244" r="3" fill="#0284c7"/>
      `).join('')}
      ${svgTxt(674, 304, 'يوفر أكثر من 60% من المياه!', { size: 11.5, bold: true, color: '#0369a1' })}
      ${svgTxt(674, 326, 'ويمنع تملّح التربة ونمو الأعشاب', { size: 10.5, color: '#334155' })}

      <!-- 2. Yemeni Agricultural Terraces (Middle) -->
      <rect x="282" y="60" width="252" height="294" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8"/>
      ${svgStepBadge(408, 72, 214, '2. المدرجات الزراعية اليمنية', '#15803d', '#ffffff')}
      <!-- Stepped mountain terraces -->
      <polygon points="300,268 300,156 364,156 364,192 432,192 432,228 516,228 516,268" fill="#86efac" stroke="#15803d" stroke-width="2.2"/>
      ${[330, 396, 472].map((tx, idx) => `
        <line x1="${tx}" y1="${156 + idx * 36}" x2="${tx}" y2="${132 + idx * 36}" stroke="#166534" stroke-width="2.5"/>
        <circle cx="${tx}" cy="${128 + idx * 36}" r="10" fill="#22c55e"/>
      `).join('')}
      ${svgTxt(408, 304, 'تحفظ مياه الأمطار بالجبال', { size: 11.5, bold: true, color: '#15803d' })}
      ${svgTxt(408, 326, 'وتمنع انجراف التربة الخصبة', { size: 10.5, color: '#334155' })}

      <!-- 3. Animal Resources + Agro-Industries (Left) -->
      <rect x="20" y="60" width="248" height="294" rx="10" fill="#fffbeb" stroke="#d97706" stroke-width="1.8"/>
      ${svgStepBadge(144, 72, 210, '3. الثروة الحيوانية والصناعات', '#b45309', '#ffffff')}
      <rect x="34" y="114" width="220" height="84" rx="8" fill="#ffffff" stroke="#d97706"/>
      ${svgTxt(144, 136, 'تنمية الثروة الحيوانية:', { size: 11, bold: true, color: '#b45309' })}
      ${svgTxt(144, 158, '• تحسين السلالات والتلقيح الاصطناعي', { size: 10.2 })}
      ${svgTxt(144, 178, '• التحصين البيطري وتوفير الأعلاف', { size: 10.2 })}
      <rect x="34" y="212" width="220" height="122" rx="8" fill="#ffffff" stroke="#0f766e"/>
      ${svgTxt(144, 234, 'صناعات حيوية تعتمد عليهما:', { size: 11, bold: true, color: '#0f766e' })}
      ${svgTxt(144, 258, '• المخابز (خميرة) والزيوت والسكر', { size: 10.2 })}
      ${svgTxt(144, 280, '• الألبان والأجبان (بكتيريا نافعة)', { size: 10.2 })}
      ${svgTxt(144, 302, '• النسيج القطني والصوفي والجلود', { size: 10.2 })}
      ${svgTxt(144, 322, '• المكافحة الحيوية للآفات بدل السموم', { size: 10, bold: true, color: '#15803d' })}
    `,
    'شكل (14-1): الري بالتنقيط والمدرجات الزراعية اليمنية وتنمية الثروة الحيوانية والصناعات الحيوية.'
  );

  // ==================== u15-l1: تشريح الجنين داخل الرحم + الرضاعة الطبيعية وتنظيم الأسرة ====================
  add(
    'u15-l1',
    820,
    430,
    'تغذية الجنين عبر المشيمة والحبل السري، وفوائد الرضاعة الطبيعية وتنظيم الأسرة',
    `
      <!-- Right: Fetus in Uterus with Placenta, Umbilical Cord, Amniotic Sac -->
      <rect x="380" y="58" width="420" height="328" rx="10" fill="#fdf2f8" stroke="#db2777" stroke-width="1.8"/>
      ${svgStepBadge(590, 68, 320, '1. تغذية الجنين داخل الرحم (المشيمة والحبل السري)', '#be185d', '#ffffff')}

      <!-- Uterus wall & Amniotic Sac -->
      <ellipse cx="595" cy="210" rx="112" ry="96" fill="#fbcfe8" stroke="#be185d" stroke-width="3"/>
      <ellipse cx="595" cy="212" rx="92" ry="78" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.8"/>
      <!-- Placenta disc attached to uterine wall -->
      <path d="M652 152 Q694 188 672 246 Q650 226 648 188 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
      <!-- Fetus curled gently -->
      <circle cx="578" cy="176" r="24" fill="#fed7aa" stroke="#ea580c" stroke-width="1.8"/>
      <ellipse cx="578" cy="224" rx="28" ry="34" fill="#fed7aa" stroke="#ea580c" stroke-width="1.8"/>
      <!-- Umbilical Cord connecting placenta to fetus abdomen -->
      <path d="M658 198 Q624 186 604 222" fill="none" stroke="#b91c1c" stroke-width="5.5" stroke-linecap="round"/>

      ${svgCallout(668, 198, 728, 148, '1', 'المشيمة (تبادل)', { color: '#dc2626' })}
      ${svgCallout(630, 198, 728, 224, '2', 'الحبل السري', { color: '#b91c1c' })}
      ${svgCallout(534, 152, 466, 150, '3', 'السائل الأمنيوسي', { color: '#0284c7', sub: 'يحمي الجنين من الصدمات' })}
      ${svgCallout(512, 268, 466, 268, '4', 'جدار الرحم العضلي', { color: '#be185d' })}

      <rect x="396" y="318" width="388" height="56" rx="8" fill="#ffffff" stroke="#be185d"/>
      ${svgTxt(590, 338, 'تنقل المشيمة الأكسجين والغذاء من الأم وتعيد الفضلات (دون اختلاط الدم!)', { size: 10.6, bold: true, color: '#0f172a' })}
      ${svgTxt(590, 360, 'تحذير: يُمنع التدخين والقات والأدوية العشوائية لأنها تعبر المشيمة للجنين!', { size: 10.2, bold: true, color: '#dc2626' })}

      <!-- Left: Breastfeeding (Colostrum) & Family Planning -->
      <rect x="20" y="58" width="346" height="328" rx="10" fill="#f0fdf4" stroke="#0f766e" stroke-width="1.8"/>
      ${svgStepBadge(193, 68, 280, '2. الرضاعة الطبيعية وتنظيم الأسرة', '#0f766e', '#ffffff')}

      <rect x="34" y="106" width="318" height="142" rx="8" fill="#ffffff" stroke="#16a34a"/>
      ${svgTxt(193, 128, 'مزايا الرضاعة الطبيعية (وأهمية حليب اللبا):', { size: 11.5, bold: true, color: '#15803d' })}
      ${svgTxt(193, 152, '• حليب اللبا (الأيام الأولى): غني بالأجسام المضادة للمناعة', { size: 10.4, bold: true, color: '#0f766e' })}
      ${svgTxt(193, 174, '• معقم تماماً، دافئ، سهل الهضم، ولا يسبب حساسية', { size: 10.2 })}
      ${svgTxt(193, 196, '• يقوّي الرابطة العاطفية ويعيد رحم الأم لحجمه الطبيعي', { size: 10.2 })}
      ${svgTxt(193, 218, '• الرضاعة الصناعية: بديل للضرورة فقط (تفتقر للمناعة)', { size: 10, color: '#dc2626', bold: true })}

      <rect x="34" y="260" width="318" height="114" rx="8" fill="#eff6ff" stroke="#2563eb"/>
      ${svgTxt(193, 284, 'تنظيم الأسرة (المباعدة الزمنية):', { size: 12, bold: true, color: '#1d4ed8' })}
      ${svgTxt(193, 310, 'فترة المباعدة الصحية بين الولادات: 2 إلى 3 سنوات ✓', { size: 11, bold: true, color: '#0f766e' })}
      ${svgTxt(193, 334, 'لاستعادة مخزون الأم من الكالسيوم والحديد', { size: 10.2 })}
      ${svgTxt(193, 354, 'وإعطاء كل طفل حقه في الرضاعة والرعاية الكاملة', { size: 10.2 })}
    `,
    'شكل (15-1): تشريح الجنين والمشيمة والحبل السري داخل الرحم، وفوائد الرضاعة الطبيعية وتنظيم الأسرة.'
  );

  // ==================== u16-l1: الكروموسومات (46) + تحديد الجنس (XX × XY) + مربع بانيت ====================
  add(
    'u16-l1',
    820,
    430,
    'الكروموسومات داخل النواة (46)، تحديد الجنس (XX × XY)، ومربع بانيت لمندل (Tt × Tt)',
    `
      <!-- Right: Cell -> Nucleus -> Chromosomes (46 / 23) + Sex Determination -->
      <rect x="420" y="58" width="380" height="328" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
      ${svgStepBadge(610, 68, 300, '1. الكروموسومات (46) وتحديد جنس المولود', '#1d4ed8', '#ffffff')}
      <!-- Drawn Cell & Nucleus & X Chromosome -->
      <circle cx="716" cy="148" r="46" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <circle cx="716" cy="148" r="24" fill="#818cf8" stroke="#312e81" stroke-width="1.8"/>
      <path d="M708 138 L724 158 M724 138 L708 158" stroke="#fef08a" stroke-width="3.5" stroke-linecap="round"/>
      ${svgTxt(544, 126, 'الخلية الجسدية: 46 كروموسوماً', { size: 11, bold: true, color: '#1e3a8a' })}
      ${svgTxt(544, 148, '(23 زوجاً: نصفها من الأب ونصفها من الأم)', { size: 10 })}
      ${svgTxt(544, 170, 'المشيج (منوي أو بويضة): 23 فقط (n)', { size: 10.5, bold: true, color: '#dc2626' })}

      <!-- Sex Determination Cross XX x XY -->
      <rect x="438" y="206" width="344" height="164" rx="8" fill="#ffffff" stroke="#1d4ed8"/>
      ${svgTxt(610, 228, 'تحديد جنس الجنين: الأم (XX) × الأب (XY)', { size: 11.5, bold: true, color: '#0f172a' })}
      ${svgTxt(688, 254, 'بويضة الأم: دائماً X', { size: 10.5, bold: true, color: '#db2777' })}
      ${svgTxt(522, 254, 'منوي الأب: X أو Y', { size: 10.5, bold: true, color: '#0284c7' })}
      <rect x="628" y="272" width="128" height="44" rx="6" fill="#fdf2f8" stroke="#db2777"/>
      ${svgTxt(692, 298, 'X + X ⟶ أنثى XX (50%)', { size: 11, bold: true, color: '#be185d' })}
      <rect x="464" y="272" width="128" height="44" rx="6" fill="#eff6ff" stroke="#0284c7"/>
      ${svgTxt(528, 298, 'X + Y ⟶ ذكر XY (50%)', { size: 11, bold: true, color: '#0369a1' })}
      ${svgTxt(610, 348, 'الأب (الحيوان المنوي) هو المسؤول علمياً عن تحديد الجنس (Y أو X)!', { size: 10.5, bold: true, color: '#0f766e' })}

      <!-- Left: Mendel Punnett Square (Tt x Tt) -->
      <rect x="20" y="58" width="380" height="328" rx="10" fill="#f0fdf4" stroke="#0f766e" stroke-width="1.8"/>
      ${svgStepBadge(210, 68, 300, '2. مربع بانيت لتزاوج هجينين (Tt × Tt)', '#0f766e', '#ffffff')}

      <rect x="64" y="106" width="292" height="168" fill="#ffffff" stroke="#0f766e" stroke-width="2.2"/>
      <line x1="160" y1="106" x2="160" y2="274" stroke="#0f766e" stroke-width="1.6"/>
      <line x1="258" y1="106" x2="258" y2="274" stroke="#0f766e" stroke-width="1.6"/>
      <line x1="64" y1="162" x2="356" y2="162" stroke="#0f766e" stroke-width="1.6"/>
      <line x1="64" y1="218" x2="356" y2="218" stroke="#0f766e" stroke-width="1.6"/>

      ${svgTxt(112, 138, 'الأمشاج', { size: 12, bold: true, color: '#334155' })}
      ${svgTxt(209, 138, 'T (سائد)', { size: 12.5, bold: true, color: '#0369a1' })}
      ${svgTxt(307, 138, 't (متنحٍ)', { size: 12.5, bold: true, color: '#dc2626' })}

      ${svgTxt(112, 194, 'T (سائد)', { size: 12.5, bold: true, color: '#0369a1' })}
      <rect x="162" y="164" width="94" height="52" fill="#dcfce7"/>
      ${svgTxt(209, 194, 'TT (سائد نقي)', { size: 11.2, bold: true, color: '#15803d' })}
      <rect x="260" y="164" width="94" height="52" fill="#e0f2fe"/>
      ${svgTxt(307, 194, 'Tt (سائد هجين)', { size: 11.2, bold: true, color: '#0369a1' })}

      ${svgTxt(112, 250, 't (متنحٍ)', { size: 12.5, bold: true, color: '#dc2626' })}
      <rect x="162" y="220" width="94" height="52" fill="#e0f2fe"/>
      ${svgTxt(209, 250, 'Tt (سائد هجين)', { size: 11.2, bold: true, color: '#0369a1' })}
      <rect x="260" y="220" width="94" height="52" fill="#fee2e2"/>
      ${svgTxt(307, 250, 'tt (متنحي نقي)', { size: 11.2, bold: true, color: '#dc2626' })}

      <rect x="44" y="292" width="332" height="78" rx="8" fill="#ffffff" stroke="#0f766e"/>
      ${svgTxt(210, 316, 'النسبة الظاهرية: 3 سائد (75%) : 1 متنحي (25%)', { size: 11.8, bold: true, color: '#0f766e' })}
      ${svgTxt(210, 340, 'النسبة الجينية: 1 TT (25%) : 2 Tt (50%) : 1 tt (25%)', { size: 11, bold: true, color: '#334155' })}
      ${svgTxt(210, 360, 'الصفة المتنحية لا تظهر إلا باجتماع جينين متنحيين معاً (tt)', { size: 10, color: '#dc2626', bold: true })}
    `,
    'شكل (16-1): الكروموسومات وتحديد جنس المولود، ومربع بانيت لقانون مندل الأول.'
  );

  // ==================== u16-l2: زواج الأقارب والطفرات والأمراض الوراثية ====================
  add(
    'u16-l2',
    820,
    400,
    'تأثير زواج الأقارب في ظهور الأمراض المتنحية، والطفرات، والأمراض المرتبطة بالجنس',
    `
      <!-- Right: Consanguinity Recessive Carrier Inheritance -->
      <rect x="420" y="60" width="380" height="296" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.8"/>
      ${svgStepBadge(610, 72, 300, '1. زواج الأقارب واجتماع الجينات المتنحية', '#b91c1c', '#ffffff')}
      <rect x="642" y="114" width="126" height="44" rx="8" fill="#ffffff" stroke="#0284c7"/>
      ${svgTxt(705, 134, 'الأم حاملة سليمة', { size: 10.5, bold: true })}
      ${svgTxt(705, 150, '(Aa)', { size: 11, bold: true, color: '#0284c7' })}
      <rect x="452" y="114" width="126" height="44" rx="8" fill="#ffffff" stroke="#0284c7"/>
      ${svgTxt(515, 134, 'الأب حامل سليم', { size: 10.5, bold: true })}
      ${svgTxt(515, 150, '(Aa قريب)', { size: 11, bold: true, color: '#0284c7' })}
      ${svgArrow(705, 160, 646, 206, 'slate', 2)}
      ${svgArrow(515, 160, 574, 206, 'slate', 2)}
      <!-- Children outcomes -->
      <rect x="444" y="210" width="332" height="58" rx="8" fill="#ffffff" stroke="#dc2626"/>
      ${svgTxt(716, 242, 'AA (سليم)', { size: 11, bold: true, color: '#15803d' })}
      ${svgTxt(610, 242, 'Aa + Aa (حاملان)', { size: 11, bold: true, color: '#d97706' })}
      ${svgTxt(498, 242, 'aa (مصاب 25%!)', { size: 11.5, bold: true, color: '#dc2626' })}
      ${svgTxt(610, 294, 'أمثلة: الأنيميا المنجلية (كريات هلالية) والثلاسيميا', { size: 10.8, bold: true, color: '#991b1b' })}
      ${svgTxt(610, 318, 'ينصح بالفحص الطبي والاستشارة الوراثية قبل الزواج ✓', { size: 10.5, bold: true, color: '#15803d' })}

      <!-- Left: Mutations + X-linked Diseases + Down Syndrome -->
      <rect x="20" y="60" width="380" height="296" rx="10" fill="#eff6ff" stroke="#1d4ed8" stroke-width="1.8"/>
      ${svgStepBadge(210, 72, 300, '2. الطفرات والأمراض الوراثية النوعية', '#1d4ed8', '#ffffff')}

      <rect x="38" y="108" width="344" height="72" rx="8" fill="#ffffff" stroke="#7c3aed"/>
      ${svgTxt(210, 128, '• الطفرة الوراثية: تغيّر مفاجئ في DNA أو الكروموسوم', { size: 11, bold: true, color: '#6d28d9' })}
      ${svgTxt(210, 148, 'في الأمشاج ← تُورَّث للأبناء | في الجسدية ← لا تُورَّث', { size: 10.5, bold: true })}
      ${svgTxt(210, 168, 'تسببها الإشعاعات (X/نووية) والمواد الكيميائية والتدخين', { size: 10, color: '#475569' })}

      <rect x="38" y="190" width="344" height="76" rx="8" fill="#ffffff" stroke="#b45309"/>
      ${svgTxt(210, 212, '• مرتبطة بالكروموسوم الجنسي X (تصيب الذكور أكثر!):', { size: 10.8, bold: true, color: '#b45309' })}
      ${svgTxt(210, 234, 'عمى الألوان (الأحمر/الأخضر) + نزف الدم (الهيموفيليا)', { size: 10.8, bold: true, color: '#dc2626' })}
      ${svgTxt(210, 254, 'لأن الذكر XY يمتلك X واحداً فقط!', { size: 10.2, color: '#334155' })}

      <rect x="38" y="276" width="344" height="64" rx="8" fill="#f0fdfa" stroke="#0f766e"/>
      ${svgTxt(210, 298, '• خلل عدد الكروموسومات: متلازمة داون = 47 كروموسوماً', { size: 10.8, bold: true, color: '#0f766e' })}
      ${svgTxt(210, 322, 'بسبب زيادة نسخة من الكروموسوم رقم (21)', { size: 10.5 })}
    `,
    'شكل (16-2): أثر زواج الأقارب في الأمراض المتنحية، والطفرات، والأمراض المرتبطة بالكروموسوم X ومتلازمة داون.'
  );

  return out;
}
