import { renderSvgToPng, svgCanvas, svgTxt } from './arabicShaper';

export function buildBioDiagrams(): Record<string, { png: Buffer; caption: string; width: number; height: number }> {
  const out: Record<string, { png: Buffer; caption: string; width: number; height: number }> = {};

  const add = (id: string, w: number, h: number, title: string, body: string, caption: string, footer?: string) => {
    const svg = svgCanvas(w, h, title, body, footer);
    out[id] = { png: renderSvgToPng(svg, 1080), caption, width: 520, height: Math.round((520 * h) / w) };
  };

  // Unit 6 Lessons 1 & 2: Amoeba + Transpiration vs Guttation
  add(
    'u6-l1',
    760,
    330,
    'الإخراج في الطلائعيات (الأميبا) وفي النبات (النتح والإدماع)',
    `
      <!-- Amoeba -->
      <rect x="395" y="65" width="345" height="225" rx="10" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.5"/>
      ${svgTxt(567, 88, 'مقارنة أميبا المياه العذبة والمالحة (وزاري)', { bold: true, size: 12.5, color: '#0f766e' })}
      <ellipse cx="645" cy="165" rx="68" ry="48" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
      <circle cx="662" cy="160" r="14" fill="#6366f1"/>
      <circle cx="615" cy="165" r="16" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      ${svgTxt(615, 170, 'فجوة', { size: 9.5, bold: true })}
      ${svgTxt(645, 232, 'أميبا المياه العذبة', { bold: true, size: 11.5, color: '#0369a1' })}
      ${svgTxt(645, 252, 'بها فجوة منقبضة لطرد الماء', { size: 10.5, bold: true })}

      <ellipse cx="480" cy="165" rx="68" ry="48" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
      <circle cx="495" cy="160" r="14" fill="#6366f1"/>
      ${svgTxt(480, 232, 'أميبا المياه المالحة', { bold: true, size: 11.5, color: '#dc2626' })}
      ${svgTxt(480, 252, 'لا توجد بها فجوة منقبضة!', { size: 10.5, bold: true, color: '#dc2626' })}

      <!-- Plant: Transpiration vs Guttation -->
      <rect x="20" y="65" width="355" height="225" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
      ${svgTxt(197, 88, 'الإخراج في النبات: النتح مقابل الإدماع', { bold: true, size: 12.5, color: '#15803d' })}
      <rect x="35" y="108" width="325" height="80" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
      ${svgTxt(197, 130, '1. النتح: خروج الماء على هيئة بخار عبر الثغور', { bold: true, size: 11.5, color: '#0f766e' })}
      ${svgTxt(197, 152, 'يزداد نهاراً عند ارتفاع الحرارة والرياح والجفاف', { size: 11 })}
      ${svgTxt(197, 172, 'يلطّف حرارة النبات ويرفع العصارة للأعلى', { size: 10.5, color: '#475569' })}

      <rect x="35" y="198" width="325" height="80" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
      ${svgTxt(197, 220, '2. الإدماع: خروج الماء كقطرات عبر الثغور المائية', { bold: true, size: 11.5, color: '#0369a1' })}
      ${svgTxt(197, 242, 'يحدث ليلاً وفي الصباح الباكر عند الرطوبة العالية', { size: 11 })}
      ${svgTxt(197, 262, 'تظهر القطرات على حواف الأوراق (يحتوي أملاحاً)', { size: 10.5, color: '#475569' })}
    `,
    'شكل (6-1): الفرق بين أميبا المياه العذبة والمالحة، وبين عمليتي النتح والإدماع في النبات.'
  );

  // Unit 6 Lessons 3 & 4: Kidney Cross-Section + Nephron + Skin Sweat Gland
  add(
    'u6-l3',
    760,
    370,
    'تشريح الكلية، وحدة النيفرون، والغدة العرقية في الجلد',
    `
      <!-- Kidney Cross section -->
      <rect x="445" y="65" width="295" height="260" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>
      ${svgTxt(592, 88, 'القطاع الطولي للكلية (الأجزاء 4)', { bold: true, size: 13, color: '#991b1b' })}
      <!-- Bean shape -->
      <path d="M558 110 C478 100, 458 265, 558 265 C598 265, 588 215, 568 200 C558 190, 558 180, 568 170 C588 155, 598 115, 558 110 Z" fill="#fca5a5" stroke="#991b1b" stroke-width="2.5"/>
      <path d="M551 135 C503 135, 498 240, 551 240 Z" fill="#ef4444" opacity="0.6"/>
      <ellipse cx="568" cy="188" rx="18" ry="24" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <path d="M581 198 Q610 230 610 295" fill="none" stroke="#eab308" stroke-width="6"/>
      ${svgTxt(668, 132, '1. القشرة (ترشيح)', { size: 11, bold: true })}
      ${svgTxt(668, 165, '2. النخاع (أهرامات)', { size: 11, bold: true })}
      ${svgTxt(668, 200, '3. حوض الكلية', { size: 11, bold: true })}
      ${svgTxt(674, 278, '4. الحالب ← للمثانة', { size: 10.5, bold: true, color: '#b45309' })}

      <!-- Nephron & Skin -->
      <rect x="20" y="65" width="405" height="128" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      ${svgTxt(222, 88, 'وحدة النيفرون ومراحل تكوين البول', { bold: true, size: 13, color: '#1d4ed8' })}
      ${svgTxt(222, 114, '1. محفظة بومان (بالقشرة): ترشيح الماء والأملاح والجلوكوز واليوريا', { size: 11, bold: true })}
      ${svgTxt(222, 138, '2. الأنابيب الملتوية والتواء هنلي: إعادة امتصاص 100% جلوكوز ومعظم الماء', { size: 11 })}
      ${svgTxt(222, 162, '3. القناة الجامعة ← حوض الكلية ← الحالب ← المثانة', { size: 11, color: '#0f766e', bold: true })}

      <rect x="20" y="203" width="405" height="122" rx="10" fill="#fffbeb" stroke="#d97706" stroke-width="1.5"/>
      ${svgTxt(222, 226, 'الإخراج عن طريق الجلد (الغدد العرقية)', { bold: true, size: 13, color: '#b45309' })}
      ${svgTxt(222, 252, 'الجلد يتكون من: البشرة (خارجية) + الأدمة (بها الغدد العرقية)', { size: 11 })}
      ${svgTxt(222, 276, 'يتكون العرق من: ماء + أملاح معدنية + نسبة قليلة من البولينا', { size: 11 })}
      ${svgTxt(222, 302, 'وزاري: تكثر المسام العرقية في الجبهة وتحت الذراع وراحة اليد وأخمص القدمين', { size: 10.5, bold: true, color: '#dc2626' })}
    `,
    'شكل (6-2): التركيب التشريحي للكلية، وآلية عمل النيفرون، والإخراج عبر الجلد.'
  );

  // Unit 7: Flower Anatomy + Pollination/Fertilization & Animal/Asexual Reproduction
  add(
    'u7-l1',
    760,
    370,
    'تركيب الزهرة النموذجية والتلقيح والإخصاب والتكاثر اللاجنسي',
    `
      <!-- Flower -->
      <rect x="395" y="65" width="345" height="260" rx="10" fill="#fdf2f8" stroke="#db2777" stroke-width="1.5"/>
      ${svgTxt(567, 88, 'الأجزاء الأساسية للزهرة (ذكرية وأنثوية)', { bold: true, size: 13, color: '#be185d' })}
      <!-- Sepals & Petals -->
      <ellipse cx="526" cy="180" rx="28" ry="52" fill="#fbcfe8" stroke="#db2777"/>
      <ellipse cx="608" cy="180" rx="28" ry="52" fill="#fbcfe8" stroke="#db2777"/>
      <!-- Pistil (Carpel) -->
      <ellipse cx="567" cy="232" rx="20" ry="24" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      <rect x="562" y="155" width="10" height="55" fill="#fef08a" stroke="#ca8a04"/>
      <ellipse cx="567" cy="150" rx="14" ry="8" fill="#f59e0b"/>
      <!-- Stamens -->
      <line x1="538" y1="220" x2="526" y2="155" stroke="#16a34a" stroke-width="3"/>
      <ellipse cx="526" cy="150" rx="8" ry="5.5" fill="#eab308"/>
      <line x1="596" y1="220" x2="608" y2="155" stroke="#16a34a" stroke-width="3"/>
      <ellipse cx="608" cy="150" rx="8" ry="5.5" fill="#eab308"/>

      ${svgTxt(448, 125, 'متك + خيط =', { size: 10, bold: true, color: '#15803d' })}
      ${svgTxt(448, 140, 'سداة (ذكرية)', { size: 10, bold: true, color: '#15803d' })}
      ${svgTxt(686, 138, 'الميسم (اللقاح)', { size: 10, bold: true, color: '#b45309' })}
      ${svgTxt(686, 185, 'القلم (الأنبوب)', { size: 10, bold: true })}
      ${svgTxt(686, 232, 'المبيض ← ثمرة', { size: 10, bold: true, color: '#be185d' })}
      ${svgTxt(567, 286, 'البويضة بعد الإخصاب تتحول إلى بذرة', { size: 11, bold: true, color: '#0f766e' })}
      ${svgTxt(567, 308, 'التلقيح الخلطي: انتقال اللقاح من متك زهرة لميسم أخرى', { size: 10.5 })}

      <!-- Animal / Asexual Reproduction -->
      <rect x="20" y="65" width="355" height="260" rx="10" fill="#f0fdf4" stroke="#0f766e" stroke-width="1.5"/>
      ${svgTxt(197, 88, 'التكاثر اللاجنسي والتكاثر في الإنسان', { bold: true, size: 13, color: '#0f766e' })}
      <rect x="35" y="106" width="325" height="96" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
      ${svgTxt(197, 128, 'التكاثر اللاجنسي (أب واحد - مطابق تماماً):', { bold: true, size: 11.5, color: '#0f766e' })}
      ${svgTxt(197, 150, '• الانشطار الثنائي: الأميبا والبكتيريا والبراميسيوم', { size: 11 })}
      ${svgTxt(197, 170, '• التبرعم: الخميرة والهيدرا  |  • التجدد: نجم البحر', { size: 11 })}
      ${svgTxt(197, 190, '• الأبواغ (الجراثيم): عفن الخبز والسراخس', { size: 11 })}

      <rect x="35" y="212" width="325" height="98" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
      ${svgTxt(197, 234, 'الإخصاب في الإنسان (الخلية المخصبة = زيجوت 2n):', { bold: true, size: 11.5, color: '#1d4ed8' })}
      ${svgTxt(197, 256, 'حيوان منوي (n) + بويضة (n) ⟶ لاقحة (2n)', { bold: true, size: 11.5, color: '#dc2626' })}
      ${svgTxt(197, 278, 'يحدث الإخصاب في الثلث الأول من قناة فالوب', { size: 11 })}
      ${svgTxt(197, 298, 'ثم تنغرس اللاقحة المنقسمة في بطانة الرحم', { size: 11 })}
    `,
    'شكل (7-1): تشريح الزهرة التناسلي، ومسار التلقيح والإخصاب، وصور التكاثر اللاجنسي والجنسي.'
  );

  // Unit 8: Bilharzia & Urinary/Reproductive Diseases
  add(
    'u8-l1',
    760,
    310,
    'دورة عدوى البلهارسيا البولية وأهم أمراض الجهاز التناسلي',
    `
      <rect x="395" y="65" width="345" height="205" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>
      ${svgTxt(567, 88, 'دورة حياة البلهارسيا البولية (عائلان)', { bold: true, size: 13, color: '#991b1b' })}
      ${svgTxt(567, 122, '1. بول مريض في ماء عذب ← يفقس ليرقة (ميراسيديوم)', { size: 11 })}
      ${svgTxt(567, 150, '2. يدخل العائل الوسيط (قوقع البولينس في البرك)', { size: 11, bold: true, color: '#b45309' })}
      ${svgTxt(567, 178, '3. يخرج طور السركاريا ويخترق جلد الإنسان بالسباحة', { size: 11, bold: true, color: '#dc2626' })}
      ${svgTxt(567, 206, '4. تصل للأوردة والمثانة وتسبب التبول الدموي', { size: 11 })}
      ${svgTxt(567, 240, 'الوقاية: منع التبول في الترع والبرك ومكافحة القواقع', { size: 11, bold: true, color: '#15803d' })}

      <rect x="20" y="65" width="355" height="205" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      ${svgTxt(197, 88, 'مقارنة أمراض الجهاز التناسلي وطرق انتقالها', { bold: true, size: 12.5, color: '#1d4ed8' })}
      ${svgTxt(197, 125, '• السيلان (بكتيريا): ينتقل بالاتصال المحرم أو', { size: 11, bold: true })}
      ${svgTxt(197, 145, 'المراحيض الأوروبية الملوثة والمناشف (وزاري هام)', { size: 11, bold: true, color: '#dc2626' })}
      ${svgTxt(197, 178, '• الزهري (بكتيريا لولبية): قرحة غير مؤلمة،', { size: 11 })}
      ${svgTxt(197, 198, 'ينتقل أيضاً من الأم للجنين عبر المشيمة', { size: 11 })}
      ${svgTxt(197, 230, '• الإيدز (فيروس HIV): يدمر جهاز المناعة، ينتقل', { size: 11 })}
      ${svgTxt(197, 250, 'بالاتصال المحرم ونقل الدم الملوث (لا ينتقل بالمصافحة)', { size: 11, bold: true, color: '#15803d' })}
    `,
    'شكل (8-1): دورة عدوى البلهارسيا البولية، ومقارنة مسببات وطرق انتقال أمراض الجهاز التناسلي.'
  );

  // Unit 14 & 15: Environment Resources + Mother & Child Care
  add(
    'u14-l1',
    760,
    310,
    'تنمية الموارد البيئية الحية (الوحدة 14) ورعاية الأمومة والطفولة (الوحدة 15)',
    `
      <rect x="395" y="65" width="345" height="205" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
      ${svgTxt(567, 88, 'تنمية الثروة النباتية والحيوانية (الوحدة 14)', { bold: true, size: 12.5, color: '#15803d' })}
      ${svgTxt(567, 122, '• الري الحديث بالتنقيط يوفر أكثر من 60% من المياه', { size: 11, bold: true })}
      ${svgTxt(567, 148, '• المدرجات الزراعية اليمنية تمنع انجراف التربة', { size: 11 })}
      ${svgTxt(567, 174, '• اختيار البذور المحسنة، التلقيح الصناعي، ومكافحة الآفات', { size: 11 })}
      ${svgTxt(567, 206, '• صناعات حيوية: الألبان والأجبان، المخابز (الخميرة)', { size: 11, bold: true, color: '#0f766e' })}
      ${svgTxt(567, 228, 'والجلود والمنسوجات القطنية والصوفية والأسمدة العضوية', { size: 11 })}

      <rect x="20" y="65" width="355" height="205" rx="10" fill="#fdf2f8" stroke="#db2777" stroke-width="1.5"/>
      ${svgTxt(197, 88, 'رعاية الأم والحامل والرضاعة وتنظيم الأسرة (الوحدة 15)', { bold: true, size: 12, color: '#be185d' })}
      ${svgTxt(197, 122, '• المشيمة والحبل السري: ينقلان الأكسجين والغذاء للجنين', { size: 11 })}
      ${svgTxt(197, 148, '• حليب اللبا (الرضاعة الطبيعية): غني بالأجسام المضادة', { size: 11, bold: true, color: '#0f766e' })}
      ${svgTxt(197, 174, 'ومعقم ودافئ ويقوي العلاقة العاطفية بين الأم والطفل', { size: 11 })}
      ${svgTxt(197, 208, '• تنظيم الأسرة (المباعدة 2 إلى 3 سنوات بين الحملين):', { size: 11, bold: true, color: '#1d4ed8' })}
      ${svgTxt(197, 230, 'يحفظ صحة الأم ويعطي الطفل حقه الكامل في الرضاعة', { size: 11 })}
    `,
    'شكل (14-15): تلخيص استثمار موارد البيئة الحية، ورعاية الأمومة والرضاعة الطبيعية وتنظيم الأسرة.'
  );

  // Unit 16: Genetics - Punnett Square & Consanguinity & Mutations
  add(
    'u16-l1',
    760,
    330,
    'الوراثة: مربع بانيت (Tt × Tt) وأثر زواج الأقارب والطفرات الوراثية',
    `
      <!-- Punnett Square -->
      <rect x="435" y="65" width="305" height="225" rx="10" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.5"/>
      ${svgTxt(587, 88, 'مربع بانيت: تزاوج هجينين (Tt × Tt)', { bold: true, size: 13, color: '#0f766e' })}
      <rect x="485" y="108" width="205" height="120" fill="#ffffff" stroke="#0f766e" stroke-width="2"/>
      <line x1="553" y1="108" x2="553" y2="228" stroke="#0f766e" stroke-width="1.5"/>
      <line x1="621" y1="108" x2="621" y2="228" stroke="#0f766e" stroke-width="1.5"/>
      <line x1="485" y1="148" x2="690" y2="148" stroke="#0f766e" stroke-width="1.5"/>
      <line x1="485" y1="188" x2="690" y2="188" stroke="#0f766e" stroke-width="1.5"/>

      ${svgTxt(519, 134, 'الأمشاج', { size: 11, bold: true })}
      ${svgTxt(587, 134, 'T', { size: 14, bold: true, color: '#0369a1' })}
      ${svgTxt(655, 134, 't', { size: 14, bold: true, color: '#dc2626' })}

      ${svgTxt(519, 174, 'T', { size: 14, bold: true, color: '#0369a1' })}
      ${svgTxt(587, 174, 'TT (سائد)', { size: 11, bold: true, color: '#0f766e' })}
      ${svgTxt(655, 174, 'Tt (هجين)', { size: 11, bold: true, color: '#0f766e' })}

      ${svgTxt(519, 214, 't', { size: 14, bold: true, color: '#dc2626' })}
      ${svgTxt(587, 214, 'Tt (هجين)', { size: 11, bold: true, color: '#0f766e' })}
      ${svgTxt(655, 214, 'tt (متنحي)', { size: 11, bold: true, color: '#dc2626' })}
      ${svgTxt(587, 260, 'النسبة الظاهرية: 3 سائد (75%) : 1 متنحي (25%)', { size: 11.5, bold: true })}

      <!-- Consanguinity & Mutations -->
      <rect x="20" y="65" width="395" height="225" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>
      ${svgTxt(217, 88, 'زواج الأقارب والطفرات والأمراض الوراثية', { bold: true, size: 13, color: '#991b1b' })}
      ${svgTxt(217, 122, '• زواج الأقارب يرفع احتمال التقاء جينين متنحيين (tt)', { size: 11, bold: true })}
      ${svgTxt(217, 144, 'مما يزيد ظهور أمراض مثل: الثلاسيميا والأنيميا المنجلية', { size: 11 })}
      ${svgTxt(217, 176, '• الطفرة: تغيّر مفاجئ في المادة الوراثية (DNA/الكروموسوم)', { size: 11, bold: true, color: '#1d4ed8' })}
      ${svgTxt(217, 198, 'تزداد بالتعرض للإشعاعات والمواد الكيميائية وتورث للأبناء', { size: 11 })}
      ${svgTxt(217, 232, '• عمى الألوان ونزف الدم (الهيموفيليا): أمراض مرتبطة', { size: 11, bold: true, color: '#b45309' })}
      ${svgTxt(217, 254, 'بالكروموسوم الجنسي X وتظهر في الذكور أكثر من الإناث', { size: 11 })}
    `,
    'شكل (16-1): مربع بانيت لتوارث الصفات السائدة والمتنحية، وتفسير أثر زواج الأقارب والطفرات.'
  );

  return out;
}
