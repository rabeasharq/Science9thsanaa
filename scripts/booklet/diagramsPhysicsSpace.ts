import { renderSvgToPng, svgCanvas, svgTxt } from './arabicShaper';

export function buildPhysicsSpaceDiagrams(): Record<string, { png: Buffer; caption: string; width: number; height: number }> {
  const out: Record<string, { png: Buffer; caption: string; width: number; height: number }> = {};

  const add = (id: string, w: number, h: number, title: string, body: string, caption: string, footer?: string) => {
    const svg = svgCanvas(w, h, title, body, footer);
    out[id] = { png: renderSvgToPng(svg, 1080), caption, width: 520, height: Math.round((520 * h) / w) };
  };

  // Unit 4: Universe & Multi-stage Rocket
  add(
    'u4-l1',
    760,
    330,
    'وحدة بناء الكون (المجموعة الشمسية) ومراحل انطلاق الصاروخ الفضائي',
    `
      <!-- Solar System -->
      <rect x="385" y="65" width="355" height="220" rx="10" fill="#0f172a"/>
      ${svgTxt(562, 88, 'المجموعة الشمسية (وحدة بناء الكون)', { bold: true, size: 13.5, color: '#fde047' })}
      <circle cx="562" cy="180" r="24" fill="#f59e0b"/>
      ${svgTxt(562, 185, 'الشمس', { bold: true, size: 11, color: '#ffffff' })}
      <ellipse cx="562" cy="180" rx="60" ry="30" fill="none" stroke="#475569" stroke-dasharray="4 3"/>
      <ellipse cx="562" cy="180" rx="100" ry="50" fill="none" stroke="#475569" stroke-dasharray="4 3"/>
      <ellipse cx="562" cy="180" rx="145" ry="72" fill="none" stroke="#475569" stroke-dasharray="4 3"/>
      <circle cx="622" cy="180" r="5" fill="#94a3b8"/>
      <circle cx="462" cy="180" r="7" fill="#38bdf8"/>
      ${svgTxt(462, 168, 'الأرض', { size: 10, color: '#7dd3fc', bold: true })}
      <circle cx="707" cy="180" r="9" fill="#fb923c"/>
      ${svgTxt(562, 272, 'مئات الملايين من المجموعات الشمسية = مجرة درب التبانة', { size: 11, color: '#e2e8f0', bold: true })}

      <!-- Rocket Stages -->
      <rect x="20" y="65" width="345" height="220" rx="10" fill="#eff6ff" stroke="#1d4ed8" stroke-width="1.5"/>
      ${svgTxt(192, 88, 'مبدأ عمل الصاروخ (قانون نيوتن الثالث)', { bold: true, size: 13, color: '#1e3a8a' })}
      <!-- Rocket body -->
      <polygon points="192,108 174,142 210,142" fill="#0f766e"/>
      <rect x="174" y="142" width="36" height="40" fill="#14b8a6" stroke="#0f766e"/>
      <rect x="170" y="182" width="44" height="38" fill="#64748b" stroke="#334155"/>
      <polygon points="180,220 204,220 192,256" fill="#f97316"/>
      ${svgTxt(278, 138, 'قمر صناعي (مدار)', { size: 11, bold: true })}
      ${svgTxt(278, 170, 'المرحلة 2: تنفصل', { size: 11, bold: true })}
      ${svgTxt(278, 204, 'المرحلة 1: وقود أولي', { size: 11, bold: true })}
      ${svgTxt(112, 240, 'اندفاع الغازات للأسفل', { size: 11, color: '#dc2626', bold: true })}
      ${svgTxt(112, 152, 'رد فعل الصاروخ للأعلى', { size: 11, color: '#0f766e', bold: true })}
    `,
    'شكل (4-1): المجموعة الشمسية كوحدة بناء الكون، ومراحل الصاروخ الفضائي وقانون نيوتن الثالث.'
  );

  // Unit 5: Magnet Flux & Bell & Telephone & Dynamo/Transformer
  add(
    'u5-l1',
    760,
    330,
    'خطوط الفيض المغناطيسي وطرق التمغنط الثلاث',
    `
      <!-- Bar Magnet & Flux -->
      <rect x="385" y="65" width="355" height="225" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      ${svgTxt(562, 88, 'اتجاه خطوط الفيض المغناطيسي (من N إلى S)', { bold: true, size: 13, color: '#0f172a' })}
      <ellipse cx="562" cy="180" rx="115" ry="70" fill="none" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="5 3"/>
      <ellipse cx="562" cy="180" rx="95" ry="46" fill="none" stroke="#0284c7" stroke-width="1.5"/>
      <rect x="492" y="162" width="70" height="36" fill="#2563eb"/>
      <rect x="562" y="162" width="70" height="36" fill="#dc2626"/>
      ${svgTxt(527, 185, 'S (جنوبي)', { bold: true, size: 12, color: '#ffffff' })}
      ${svgTxt(597, 185, 'N (شمالي)', { bold: true, size: 12, color: '#ffffff' })}
      ${svgTxt(562, 272, 'تتقارب خطوط الفيض وتقوى عند القطبين وتنعدم في المنتصف', { size: 11, bold: true, color: '#0369a1' })}

      <!-- 3 Magnetization Methods -->
      <rect x="20" y="65" width="345" height="225" rx="10" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
      ${svgTxt(192, 88, 'طرق التمغنط الثلاث للحديد والصلب', { bold: true, size: 13, color: '#0f766e' })}
      <rect x="36" y="106" width="312" height="50" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
      ${svgTxt(192, 128, '1. التمغنط بالدلك: في اتجاه واحد وبأحد القطبين فقط', { bold: true, size: 11.5 })}
      ${svgTxt(192, 146, 'يتكون عند نهاية الدلك قطب مخالف للقطب الدالك', { size: 10.5, color: '#475569' })}

      <rect x="36" y="164" width="312" height="50" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
      ${svgTxt(192, 186, '2. التمغنط بالتأثير: تقريب مسمار حديدي دون ملامسة', { bold: true, size: 11.5 })}
      ${svgTxt(192, 204, 'يكتسب المسمار مغناطيسية مؤقتة تزول بإبعاده', { size: 10.5, color: '#475569' })}

      <rect x="36" y="222" width="312" height="55" rx="8" fill="#ffffff" stroke="#0f766e"/>
      ${svgTxt(192, 244, '3. التمغنط بالتيار الكهربائي (المغناطيس الكهربائي):', { bold: true, size: 11.5, color: '#0f766e' })}
      ${svgTxt(192, 264, 'سلك معزول ملفوف على قلب حديد مطاوع + بطارية DC', { size: 10.5, color: '#334155' })}
    `,
    'شكل (5-1): خطوط الفيض المغناطيسي حول القضيب وطرق التمغنط الثلاث.'
  );

  add(
    'u5-l2',
    760,
    360,
    'الجرس الكهربائي، مرسل ومستقبل التلفون، والدينامو والمحول الكهربائي',
    `
      <!-- Bell & Telephone -->
      <rect x="385" y="65" width="355" height="250" rx="10" fill="#fefce8" stroke="#ca8a04" stroke-width="1.5"/>
      ${svgTxt(562, 88, 'مقارنة مرسل التلفون ومستقبله (مصيدة وزارية)', { bold: true, size: 13, color: '#854d0e' })}
      <rect x="400" y="106" width="325" height="78" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
      ${svgTxt(562, 128, 'مرسل التلفون الكربوني (الميكروفون):', { bold: true, size: 12, color: '#0369a1' })}
      ${svgTxt(562, 150, 'غشاء معدني رقيق + حبيبات كربون + قرص كربون سميك', { size: 11 })}
      ${svgTxt(562, 170, '(لا يوجد به مغناطيس! يحوّل الصوت إلى تيار متغير)', { bold: true, size: 11, color: '#dc2626' })}

      <rect x="400" y="196" width="325" height="104" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
      ${svgTxt(562, 218, 'مستقبل التلفون (السماعة) والجرس الكهربائي:', { bold: true, size: 12, color: '#0f766e' })}
      ${svgTxt(562, 240, 'المستقبل: مغناطيس كهربائي + قرص حديد مطاوع رقيق', { size: 11 })}
      ${svgTxt(562, 262, 'يحوّل التيار الكهربائي إلى اهتزازات صوتية', { size: 11, color: '#475569' })}
      ${svgTxt(562, 286, 'الجرس: يعتمد على القطع والوصل المتكرر عبر مسمار التلامس', { size: 11, bold: true, color: '#b45309' })}

      <!-- Dynamo & Transformer -->
      <rect x="20" y="65" width="345" height="250" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      ${svgTxt(192, 88, 'الدينامو (الحث) والمحول الكهربائي', { bold: true, size: 13, color: '#1d4ed8' })}
      <rect x="36" y="106" width="312" height="82" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
      ${svgTxt(192, 128, 'الدينامو: يحوّل الطاقة الحركية إلى كهربائية مترددة', { bold: true, size: 11.5, color: '#1e3a8a' })}
      ${svgTxt(192, 148, 'بشرط قطع الملف النحاسي لخطوط الفيض باستمرار', { size: 11 })}
      ${svgTxt(192, 170, 'عند التوقف عن الحركة: ينعدم التيار (قراءة الجلفانومتر = 0)', { size: 10.5, color: '#dc2626', bold: true })}

      <rect x="36" y="198" width="312" height="102" rx="8" fill="#ffffff" stroke="#0f766e"/>
      ${svgTxt(192, 220, 'المحول الكهربائي: ج2 ÷ ج1 = ن2 ÷ ن1', { bold: true, size: 12, color: '#0f766e' })}
      ${svgTxt(192, 242, 'رافع للجهد: عدد لفات الثانوي ن2 > الابتدائي ن1', { size: 11 })}
      ${svgTxt(192, 262, 'خافض للجهد: عدد لفات الثانوي ن2 < الابتدائي ن1', { size: 11 })}
      ${svgTxt(192, 286, 'هام: لا يعمل المحول بالبطارية (تيار مستمر DC)!', { size: 11, bold: true, color: '#dc2626' })}
    `,
    'شكل (5-2): تركيب الجرس ومرسل ومستقبل التلفون والدينامو والمحول الكهربائي.'
  );

  // Unit 5 Lesson 4: EM Wave
  add(
    'u5-l4',
    760,
    260,
    'الموجات الكهرومغناطيسية والعلاقة العكسية بين التردد والطول الموجي',
    `
      <path d="M55 150 Q105 80 155 150 T255 150 T355 150" fill="none" stroke="#0284c7" stroke-width="3.5"/>
      <line x1="105" y1="115" x2="205" y2="115" stroke="#dc2626" stroke-width="2"/>
      ${svgTxt(155, 102, 'طول موجي كبير (λ) = تردد منخفض', { size: 11.5, bold: true, color: '#dc2626' })}

      <path d="M405 150 Q425 90 445 150 T485 150 T525 150 T565 150 T605 150 T645 150 T685 150" fill="none" stroke="#7c3aed" stroke-width="3"/>
      ${svgTxt(545, 102, 'طول موجي قصير = تردد عالٍ وطاقة أكبر', { size: 11.5, bold: true, color: '#7c3aed' })}

      <rect x="45" y="182" width="670" height="36" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
      ${svgTxt(380, 205, 'الترتيب: موجات الراديو ← الميكروويف ← تحت الحمراء ← الضوء المرئي ← فوق البنفسجية ← السينية ← جاما', { size: 11.5, bold: true })}
    `,
    'شكل (5-3): العلاقة العكسية بين التردد والطول الموجي في الطيف الكهرومغناطيسي.'
  );

  // Unit 11: Surface Tension & Capillary Action (Water concave vs Mercury convex)
  add(
    'u11-l2',
    760,
    360,
    'الشد السطحي وطفو الإبرة، والخاصية الشعرية (الماء مقابل الزئبق)',
    `
      <!-- Surface Tension -->
      <rect x="445" y="65" width="295" height="250" rx="10" fill="#eff6ff" stroke="#0284c7" stroke-width="1.5"/>
      ${svgTxt(592, 88, 'الشد السطحي للماء (ش = ق ÷ 2ل)', { bold: true, size: 13, color: '#0369a1' })}
      <rect x="475" y="118" width="235" height="82" rx="6" fill="#bae6fd" stroke="#0284c7"/>
      <line x1="535" y1="118" x2="650" y2="118" stroke="#1e293b" stroke-width="4"/>
      ${svgTxt(592, 146, 'إبرة تطفو أفقياً فوق الغشاء المشدود', { size: 11, bold: true })}
      ${svgTxt(592, 168, 'عند إضافة قطرة زيت أو صابون:', { size: 11, color: '#dc2626', bold: true })}
      ${svgTxt(592, 188, 'يقل الشد السطحي فتغوص الإبرة فوراً', { size: 11, color: '#dc2626' })}
      ${svgTxt(592, 232, 'القانون الوزاري: ش = ق ÷ (2 × ل)', { bold: true, size: 12.5, color: '#0f766e' })}
      ${svgTxt(592, 255, 'نقسم على 2ل لأن للغشاء وجهين!', { size: 11, bold: true })}
      ${svgTxt(592, 278, 'لا يزداد الشد السطحي بزيادة طول السلك', { size: 10.5, color: '#b91c1c', bold: true })}
      ${svgTxt(592, 297, 'لأنه خاصية ثابتة للسائل عند نفس الحرارة', { size: 10.5, color: '#475569' })}

      <!-- Capillary Action -->
      <rect x="20" y="65" width="405" height="250" rx="10" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
      ${svgTxt(222, 88, 'الخاصية الشعرية: الماء (تلاصق) مقابل الزئبق (تماسك)', { bold: true, size: 12.5 })}
      <!-- Water basin -->
      <rect x="230" y="210" width="175" height="70" fill="#bae6fd" stroke="#0284c7" stroke-width="1.8"/>
      <rect x="255" y="135" width="16" height="125" fill="#ffffff" stroke="#0284c7"/>
      <rect x="256" y="180" width="14" height="80" fill="#38bdf8"/>
      <rect x="300" y="135" width="10" height="125" fill="#ffffff" stroke="#0284c7"/>
      <rect x="301" y="155" width="8" height="105" fill="#38bdf8"/>
      <rect x="342" y="135" width="6" height="125" fill="#ffffff" stroke="#0284c7"/>
      <rect x="343" y="140" width="4" height="120" fill="#38bdf8"/>
      ${svgTxt(317, 118, 'ماء: يرتفع أكثر في الأضيق', { size: 11, bold: true, color: '#0369a1' })}
      ${svgTxt(317, 298, 'تلاصق > تماسك (سطح مقعّر)', { size: 11, bold: true, color: '#0369a1' })}

      <!-- Mercury basin -->
      <rect x="35" y="210" width="175" height="70" fill="#cbd5e1" stroke="#475569" stroke-width="1.8"/>
      <rect x="65" y="135" width="16" height="125" fill="#ffffff" stroke="#475569"/>
      <rect x="66" y="220" width="14" height="40" fill="#94a3b8"/>
      <rect x="110" y="135" width="10" height="125" fill="#ffffff" stroke="#475569"/>
      <rect x="111" y="232" width="8" height="28" fill="#94a3b8"/>
      <rect x="152" y="135" width="6" height="125" fill="#ffffff" stroke="#475569"/>
      <rect x="153" y="244" width="4" height="16" fill="#94a3b8"/>
      ${svgTxt(122, 118, 'زئبق: ينخفض أكثر في الأضيق', { size: 11, bold: true, color: '#334155' })}
      ${svgTxt(122, 298, 'تماسك > تلاصق (سطح محدّب)', { size: 11, bold: true, color: '#334155' })}
    `,
    'شكل (11-1): تجربة الشد السطحي، والفرق بين ارتفاع الماء المقعر وانخفاض الزئبق المحدب في الأنابيب الشعرية.'
  );

  // Unit 11 Lessons 5-7: Laminar flow, Viscosity, Diffusion
  add(
    'u11-l5',
    760,
    270,
    'الجريان الانسيابي، اللزوجة، والانتشار في السوائل',
    `
      <rect x="515" y="65" width="225" height="165" rx="8" fill="#f0fdfa" stroke="#0f766e"/>
      ${svgTxt(627, 88, '1. الجريان الانسيابي', { bold: true, size: 13, color: '#0f766e' })}
      <line x1="540" y1="125" x2="715" y2="125" stroke="#0284c7" stroke-width="2"/>
      <line x1="540" y1="145" x2="715" y2="145" stroke="#0284c7" stroke-width="2"/>
      <line x1="540" y1="165" x2="715" y2="165" stroke="#0284c7" stroke-width="2"/>
      ${svgTxt(627, 200, 'مسارات منتظمة غير متقاطعة', { size: 11, bold: true })}

      <rect x="268" y="65" width="230" height="165" rx="8" fill="#fef3c7" stroke="#d97706"/>
      ${svgTxt(383, 88, '2. اللزوجة (الاحتكاك الداخلي)', { bold: true, size: 13, color: '#b45309' })}
      ${svgTxt(383, 128, 'العسل > الزيت > الماء', { bold: true, size: 12.5 })}
      ${svgTxt(383, 158, 'بالتسخين: تقل اللزوجة', { size: 11.5, color: '#dc2626', bold: true })}
      ${svgTxt(383, 185, 'بالتبريد: تزداد اللزوجة', { size: 11.5, color: '#0369a1', bold: true })}

      <rect x="20" y="65" width="230" height="165" rx="8" fill="#eff6ff" stroke="#2563eb"/>
      ${svgTxt(135, 88, '3. الانتشار في السوائل', { bold: true, size: 13, color: '#1d4ed8' })}
      ${svgTxt(135, 128, 'انتقال الجزيئات من التركيز', { size: 11.5 })}
      ${svgTxt(135, 148, 'الأعلى إلى التركيز الأقل', { size: 11.5 })}
      ${svgTxt(135, 182, 'أسرع في الماء الساخن', { bold: true, size: 12, color: '#dc2626' })}
      ${svgTxt(135, 202, 'لزيادة طاقة الحركة', { size: 11 })}
    `,
    'شكل (11-2): الجريان الانسيابي، وترتيب اللزوجة، وأثر الحرارة في اللزوجة والانتشار.'
  );

  // Unit 12 Lesson 1: Solid Pressure (Brick 3 faces + Sand)
  add(
    'u12-l1',
    760,
    340,
    'تجربة قالب الطوب على الرمل بأوجهه الثلاثة وقانون الضغط الصلب',
    `
      ${[
        { x: 515, w: 125, h: 40, depth: 8, title: '1. الوجه الأكبر مساحة', res: 'ضغط أقل ← انغراس خفيف', color: '#16a34a' },
        { x: 280, w: 80, h: 65, depth: 18, title: '2. الوجه المتوسط', res: 'ضغط متوسط ← انغراس متوسط', color: '#d97706' },
        { x: 45, w: 45, h: 100, depth: 34, title: '3. الوجه الأصغر مساحة', res: 'ضغط أكبر ← أعمق انغراس!', color: '#dc2626' },
      ].map((b) => `
        <rect x="${b.x - 15}" y="205" width="185" height="62" rx="6" fill="#fef3c7" stroke="#b45309" stroke-width="1.8"/>
        <rect x="${b.x + 77 - b.w / 2}" y="${205 - b.h + b.depth}" width="${b.w}" height="${b.h}" rx="3" fill="#b45309" stroke="#78350f" stroke-width="2"/>
        ${svgTxt(b.x + 77, 290, b.title, { bold: true, size: 12 })}
        ${svgTxt(b.x + 77, 309, b.res, { bold: true, size: 11, color: b.color })}
      `).join('')}
      <rect x="45" y="62" width="670" height="32" rx="6" fill="#f0fdfa" stroke="#0f766e"/>
      ${svgTxt(380, 83, 'القانون الوزاري: ض = ق ÷ م  |  ق (نيوتن) = الوزن (ث.كجم) × 10  |  القدم الواحدة = المساحة ÷ 2', { bold: true, size: 12, color: '#0f766e' })}
    `,
    'شكل (12-1): تجربة قالب الطوب على الرمل: كلما قلّت مساحة التلامس زاد الضغط والانغراس.'
  );

  // Unit 12 Lessons 2 & 3: Liquid Pressure + Torricelli Barometer
  add(
    'u12-l3',
    760,
    360,
    'ضغط السوائل بزيادة العمق، وأنابيب بارومتر تورشللي (فراغ 24 سم)',
    `
      <!-- Liquid pressure cylinder -->
      <rect x="415" y="65" width="325" height="250" rx="10" fill="#f8fafc" stroke="#0284c7" stroke-width="1.5"/>
      ${svgTxt(577, 88, 'ضغط السائل يزداد بزيادة العمق والكثافة', { bold: true, size: 12.5, color: '#0369a1' })}
      <rect x="605" y="115" width="80" height="165" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
      <path d="M605 145 Q565 155 550 275" fill="none" stroke="#0284c7" stroke-width="2.5"/>
      <path d="M605 190 Q525 205 500 275" fill="none" stroke="#0284c7" stroke-width="2.5"/>
      <path d="M605 235 Q470 250 445 275" fill="none" stroke="#0284c7" stroke-width="3"/>
      ${svgTxt(510, 138, 'الأعلى: ضغط أقل', { size: 11, bold: true })}
      ${svgTxt(482, 224, 'الوسط: اندفاع متوسط', { size: 10.5, bold: true })}
      ${svgTxt(510, 278, 'الأسفل: أقصى مدى اندفاع', { size: 10.5, bold: true, color: '#dc2626' })}
      ${svgTxt(577, 302, 'ضغط السائل = العمق × الكثافة × عجلة الجاذبية', { size: 11, bold: true })}

      <!-- Torricelli Barometer -->
      <rect x="20" y="65" width="375" height="250" rx="10" fill="#f0fdf4" stroke="#0f766e" stroke-width="1.5"/>
      ${svgTxt(207, 88, 'بارومتر تورشللي (أنبوبة طولها 100 سم)', { bold: true, size: 13, color: '#0f766e' })}
      <rect x="135" y="235" width="145" height="52" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
      <rect x="193" y="110" width="28" height="148" fill="#ffffff" stroke="#334155" stroke-width="2"/>
      <rect x="195" y="146" width="24" height="112" fill="#94a3b8"/>
      ${svgTxt(112, 130, 'فراغ تورشللي = 24 سم', { bold: true, size: 11, color: '#dc2626' })}
      ${svgTxt(298, 195, 'عمود الزئبق = 76 سم', { bold: true, size: 11, color: '#0f172a' })}
      ${svgTxt(207, 305, 'المرجع 1013 مللي بار (تحت البحر أكبر | فوقه أقل)', { size: 10.5, bold: true, color: '#0f766e' })}
    `,
    'شكل (12-2): ازدياد ضغط السائل مع العمق، وبارومتر تورشللي وحساب فراغ تورشللي (24 سم).'
  );

  // Unit 13: Solar Energy (Radiation, Solar Water Heater, PV DC Circuit)
  add(
    'u13-l2',
    760,
    330,
    'استغلال الطاقة الشمسية: الزاوية، السخان الحراري، والخلية الكهروضوئية',
    `
      <rect x="515" y="65" width="225" height="225" rx="8" fill="#fefce8" stroke="#ca8a04"/>
      ${svgTxt(627, 88, '1. الإشعاع الشمسي', { bold: true, size: 13, color: '#854d0e' })}
      <circle cx="627" cy="135" r="22" fill="#facc15"/>
      <line x1="627" y1="162" x2="627" y2="215" stroke="#eab308" stroke-width="3"/>
      ${svgTxt(627, 238, 'الأشعة العمودية تعطي', { size: 11.5, bold: true })}
      ${svgTxt(627, 258, 'تركيزاً حرارياً أعلى', { size: 11.5, bold: true })}

      <rect x="268" y="65" width="230" height="225" rx="8" fill="#fff7ed" stroke="#ea580c"/>
      ${svgTxt(383, 88, '2. السخان الشمسي الحراري', { bold: true, size: 13, color: '#c2410c' })}
      <rect x="315" y="112" width="136" height="32" rx="6" fill="#e2e8f0" stroke="#475569"/>
      ${svgTxt(383, 133, 'خزان معزول (أعلى)', { size: 11, bold: true })}
      <rect x="315" y="175" width="136" height="45" rx="4" fill="#1e293b"/>
      ${svgTxt(383, 202, 'مجمّع أسود (يمتص الحرارة)', { size: 11, color: '#ffffff', bold: true })}
      ${svgTxt(383, 248, 'يصعد الماء الساخن بالحمل للأعلى', { size: 11, bold: true, color: '#c2410c' })}
      ${svgTxt(383, 268, 'ويهبط الماء البارد للتسخين', { size: 11 })}

      <rect x="20" y="65" width="230" height="225" rx="8" fill="#eff6ff" stroke="#2563eb"/>
      ${svgTxt(135, 88, '3. الخلية الكهروضوئية (PV)', { bold: true, size: 13, color: '#1d4ed8' })}
      <rect x="65" y="115" width="140" height="48" rx="4" fill="#1e3a8a" stroke="#60a5fa"/>
      ${svgTxt(135, 144, 'لوح سيليكون (أشباه موصلات)', { size: 11, color: '#ffffff', bold: true })}
      <rect x="85" y="190" width="100" height="36" rx="6" fill="#dcfce7" stroke="#16a34a"/>
      ${svgTxt(135, 213, 'بطارية + مصباح', { size: 11, bold: true })}
      ${svgTxt(135, 254, 'تنتج تياراً مستمراً (DC)', { size: 11.5, bold: true, color: '#dc2626' })}
      ${svgTxt(135, 273, 'وليس تياراً متردداً!', { size: 11, bold: true, color: '#dc2626' })}
    `,
    'شكل (13-1): أوجه استغلال الطاقة الشمسية (الإشعاع، السخان الحراري، والخلية الكهروضوئية).'
  );

  // Unit 11 Lesson 1: Five Solid Properties
  add(
    'u11-l1',
    760,
    270,
    'الخواص الميكانيكية الخمس للأجسام الصلبة (المرونة، اللدونة، الهشاشة، الطرق، القساوة)',
    `
      ${[
        { x: 595, t: '1. المرونة', ex: 'المطاط والنابض', d: 'يعود لشكله بعد زوال القوة', bg: '#f0fdfa', c: '#0f766e' },
        { x: 452, t: '2. اللدونة', ex: 'الصلصال والشمع', d: 'يتشكل ولا يعود لشكله', bg: '#fefce8', c: '#a16207' },
        { x: 309, t: '3. الهشاشة', ex: 'الزجاج والطباشير', d: 'ينكسر سريعاً عند الطرق', bg: '#fef2f2', c: '#b91c1c' },
        { x: 166, t: '4. الطرق والسحب', ex: 'النحاس والذهب', d: 'يُصفّح لألواح وأسلاك', bg: '#ffedd5', c: '#c2410c' },
        { x: 23, t: '5. القساوة', ex: 'الألماس (الأقصى)', d: 'مقاومة الخدش والتآكل', bg: '#eff6ff', c: '#1d4ed8' },
      ].map((p) => `
        <rect x="${p.x}" y="70" width="134" height="152" rx="10" fill="${p.bg}" stroke="${p.c}" stroke-width="1.6"/>
        ${svgTxt(p.x + 67, 102, p.t, { bold: true, size: 12.5, color: p.c })}
        ${svgTxt(p.x + 67, 142, p.ex, { bold: true, size: 11.5 })}
        ${svgTxt(p.x + 67, 182, p.d, { size: 10.5, color: '#334155' })}
      `).join('')}
    `,
    'شكل (11-0): مقارنة الخواص الفيزيائية الخمس للمواد الصلبة مع أمثلة لكل خاصية.'
  );

  return out;
}
