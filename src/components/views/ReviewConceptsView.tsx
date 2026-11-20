import React, { useState } from 'react';
import { AlertTriangle, BookMarked, FlaskConical, Scale } from 'lucide-react';
import { UNIT_01_LESSONS } from '../../data/units/unit01Solutions';
import { UNIT_02_LESSONS } from '../../data/units/unit02AcidsBases';
import { UNIT_03_LESSONS } from '../../data/units/unit03AcidsReactions';
import { UNIT_04_LESSONS } from '../../data/units/unit04Space';
import { UNIT_05_LESSONS } from '../../data/units/unit05Magnetism';
import { UNIT_06_LESSONS } from '../../data/units/unit06Excretion';
import { UNIT_07_LESSONS } from '../../data/units/unit07Reproduction';
import { UNIT_08_LESSONS } from '../../data/units/unit08Diseases';
import { UNIT_09_LESSONS } from '../../data/units/unit09Reactions';
import { UNIT_10_LESSONS } from '../../data/units/unit10Halogens';
import { UNIT_11_LESSONS } from '../../data/units/unit11Properties';
import { UNIT_12_LESSONS } from '../../data/units/unit12Pressure';
import { UNIT_13_LESSONS } from '../../data/units/unit13SolarEnergy';
import { UNIT_14_LESSONS, UNIT_15_LESSONS, UNIT_16_LESSONS } from '../../data/units/unit14to16Biology';
import { ChemText, MathBlock } from '../common/ChemText';

export const ReviewConceptsView: React.FC = () => {
  const [section, setSection] = useState<'glossary' | 'laws' | 'traps'>('glossary');

  const allGlossary = [
    ...UNIT_01_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 1: المحاليل وطرق تحضيرها' }))),
    ...UNIT_02_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 2: الحموض والقواعد' }))),
    ...UNIT_03_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 3: تفاعلات الحموض والقواعد' }))),
    ...UNIT_04_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 4: الإنسان والفضاء الكوني' }))),
    ...UNIT_05_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 5: المغناطيسية والحث' }))),
    ...UNIT_06_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 6: الإخراج في الكائنات' }))),
    ...UNIT_07_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 7: التكاثر في الكائنات' }))),
    ...UNIT_08_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 8: أمراض الجهازين البولي والتناسلي' }))),
    ...UNIT_09_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 9: تفاعلات العناصر والنفط' }))),
    ...UNIT_10_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 10: الهالوجينات' }))),
    ...UNIT_11_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 11: خواص الأجسام' }))),
    ...UNIT_12_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 12: الضغط والموائع' }))),
    ...UNIT_13_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 13: الطاقة الشمسية' }))),
    ...UNIT_14_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 14: موارد البيئة الحية' }))),
    ...UNIT_15_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 15: رعاية الأمومة والطفولة' }))),
    ...UNIT_16_LESSONS.flatMap((l) => l.step2Understand.glossary.map((g) => ({ ...g, unit: 'الوحدة 16: الوراثة' }))),
  ];

  const ministerialTraps = [
    {
      title: 'مصيدة مثال الكتاب ص 80 مقابل التصحيح الوزاري (ث.كجم -> نيوتن)',
      body: 'في مثال ص 80 من الجزء الثاني كُتبت النتيجة عددياً دون ضرب ث.كجم × 10، لكن جميع مفاتيح التصحيح الوزارية الرسمية (نماذج 1446هـ) تضرب الوزن بالثقل كجم × 10 أولاً لتحويله إلى نيوتن قبل القسمة على المساحة.',
    },
    {
      title: 'مصيدة الوقوف على قدم واحدة وحساب مساحة الحذاءين',
      body: 'إذا ذُكر أن شخصاً وقف على قدم واحدة، اقسم مساحة الحذاءين معاً ÷ 2 عند حساب الضغط؛ وإذا طلب السؤال مساحة "الحذاءين معاً" بعد حساب مساحة القدم الواحدة، اضرب الناتج × 2.',
    },
    {
      title: 'مصيدة الشد السطحي وطول السلك (ش = ق / 2ل)',
      body: 'لا يزداد الشد السطحي بزيادة طول السلك الذي يتكون عليه الغشاء، لأن الشد السطحي خاصية فيزيائية ثابتة للسائل عند نفس درجة الحرارة (وعند زيادة ل تزداد ق بنفس النسبة). ولا تنس ضرب الطول × 2 لوجود غشاءين على وجهي السلك.',
    },
    {
      title: 'مصيدة أميبا المياه العذبة مقابل أميبا المياه المالحة',
      body: 'أميبا المياه العذبة تمتلك فجوة منقبضة لطرد الماء الزائد، بينما أميبا المياه المالحة لا توجد بها فجوة منقبضة.',
    },
    {
      title: 'مصيدة مرسل التلفون ومستقبل التلفون',
      body: 'مرسل التلفون الكربوني يحتوي على غشاء معدني رقيق وحبيبات كربون وقرص كربون سميك (بدون مغناطيس)، بينما المستقبل يحتوي على مغناطيس كهربائي وقرص حديد مطاوع رقيق.',
    },
    {
      title: 'مصيدة معادلة حمض الفوسفوريك + كربونات الكالسيوم و pH التربة',
      body: 'تفاعل 2H3PO4 + 3CaCO3 يعطي ملح فوسفات الكالسيوم Ca3(PO4)2 + 3H2O + 3CO2. كما أن التربة الصالحة للزراعة تتراوح قيمة pH لها بين 6 و 7.',
    },
    {
      title: 'مصيدة القاعدة غير الذائبة Cu(OH)2 وألوان الكواشف',
      body: 'ليست كل قاعدة قلوياً! هيدروكسيد النحاس Cu(OH)2 قاعدة غير ذائبة في الماء. والفينولفثالين عديم اللون في الحمض والمتعادل، والميثيل البرتقالي أحمر في الحمض وبرتقالي في المتعادل وأصفر في القاعدة.',
    },
    {
      title: 'مصيدة البارومتر مقابل المانومتر وفراغ تورشللي',
      body: 'البارومتر يقيس الضغط الجوي؛ المانومتر يقيس ضغط الغازات المحصورة أو السوائل. وفي أنبوب طوله 100 سم عند سطح البحر يرتفع الزئبق 76 سم ويكون فراغ تورشللي = 24 سم، وأي مدينة ضغطها > 1013 مللي بار تقع تحت مستوى سطح البحر.',
    },
    {
      title: 'مصيدة وحدة بناء الكون وطرق انتقال السيلان (الوحدتان 4 و 8)',
      body: 'وحدة بناء الكون في المنهج اليمني هي المجموعة الشمسية (وليس المجرة فقط). وينتقل مرض السيلان عبر المراحيض الأوروبية الملوثة أو الاتصال الجنسي المحرم، بينما تعادل أوراق العثرب القاعدية آلام لسعة النمل الحمضية.',
    },
    {
      title: 'مصيدة تنقية وتجفيف الكلور والتيار الناتج من الخلية الشمسية (الوحدتان 10 و 13)',
      body: 'عند تحضير الكلور يمرر الغاز أولاً على الماء لامتصاص شوائب HCl، ثم على حمض الكبريتيك المركز H2SO4 لتجفيفه من بخار الماء (العكس خطأ!). والخلية الشمسية تنتج تياراً مستمراً (DC) وليس متردداً.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <BookMarked className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            بنك المراجعة السريعة: المصطلحات، القوانين، والمصائد الوزارية
          </h2>
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setSection('glossary')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-bold cursor-pointer transition-colors ${
              section === 'glossary' ? 'bg-teal-700 text-white' : 'bg-slate-100/90 dark:bg-slate-800'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>المسرد العلمي</span>
          </button>
          <button
            type="button"
            onClick={() => setSection('laws')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-bold cursor-pointer transition-colors ${
              section === 'laws' ? 'bg-teal-700 text-white' : 'bg-slate-100/90 dark:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>القوانين والمعادلات</span>
          </button>
          <button
            type="button"
            onClick={() => setSection('traps')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-bold cursor-pointer transition-colors ${
              section === 'traps' ? 'bg-amber-600 text-white' : 'bg-slate-100/90 dark:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>مصائد وزارية</span>
          </button>
        </div>
      </div>

      {section === 'glossary' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {allGlossary.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-4 space-y-1.5">
              <div className="text-[11px] text-teal-700 dark:text-teal-400 font-bold">
                {item.unit} {item.pageRef ? `(${item.pageRef})` : ''}
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">{item.term}</div>
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <ChemText text={item.definition} />
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'laws' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-teal-700 dark:text-teal-300">
              <FlaskConical className="w-4 h-4" />
              <span>معادلات التأين والتعادل والكلور و CO₂ (الوحدات 2 و 3 و 9 و 10)</span>
            </div>
            <div className="rounded-lg bg-slate-900 text-white p-3 space-y-2 text-center overflow-x-auto">
              <MathBlock latex="\mathrm{HCl + NaOH \rightarrow NaCl + H_2O}" display />
              <MathBlock latex="\mathrm{MnO_2 + 4HCl \xrightarrow{\Delta} MnCl_2 + 2H_2O + Cl_2\uparrow}" display />
              <MathBlock latex="\mathrm{CaCO_3 + 2HCl \rightarrow CaCl_2 + H_2O + CO_2\uparrow}" display />
              <MathBlock latex="\mathrm{3CaCO_3 + 2H_3PO_4 \rightarrow Ca_3(PO_4)_2 + 3H_2O + 3CO_2\uparrow}" display />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-sky-700 dark:text-sky-300">
              <Scale className="w-4 h-4" />
              <span>قوانين الفيزياء (الوحدات 5 و 11 و 12)</span>
            </div>
            <div className="rounded-lg bg-slate-900 text-white p-3 space-y-2 text-center overflow-x-auto">
              <MathBlock latex="\text{ض} = \frac{\text{ق (نيوتن)}}{\text{م (م}^2)} \qquad (\text{ق} = \text{الوزن بالثقل كجم} \times 10)" display />
              <MathBlock latex="\text{ش} = \frac{\text{ق}}{2\text{ل}} \qquad \text{(معامل الشد السطحي)}" display />
              <MathBlock latex="\frac{\text{ج}_2}{\text{ج}_1} = \frac{\text{ن}_2}{\text{ن}_1} \qquad \text{(المحول الكهربائي)}" display />
              <MathBlock latex="76\text{ cmHg} = 1013\text{ mbar} = 101300\text{ Pa}" display />
            </div>
          </div>
        </div>
      )}

      {section === 'traps' && (
        <div className="space-y-3">
          {ministerialTraps.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-amber-300/80 dark:border-amber-800/80 bg-amber-50/75 dark:bg-amber-950/50 backdrop-blur-md p-4 flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-extrabold text-amber-950 dark:text-amber-200">{t.title}</h3>
                <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-100 mt-1 leading-relaxed">
                  <ChemText text={t.body} />
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
