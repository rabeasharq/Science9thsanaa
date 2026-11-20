import fs from 'fs';
import path from 'path';
import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';

import { CURRICULUM_UNITS } from '../../src/data/curriculumIndex';
import { UNIT_01_LESSONS } from '../../src/data/units/unit01Solutions';
import { UNIT_02_LESSONS } from '../../src/data/units/unit02AcidsBases';
import { UNIT_03_LESSONS } from '../../src/data/units/unit03AcidsReactions';
import { UNIT_04_LESSONS } from '../../src/data/units/unit04Space';
import { UNIT_05_LESSONS } from '../../src/data/units/unit05Magnetism';
import { UNIT_06_LESSONS } from '../../src/data/units/unit06Excretion';
import { UNIT_07_LESSONS } from '../../src/data/units/unit07Reproduction';
import { UNIT_08_LESSONS } from '../../src/data/units/unit08Diseases';
import { UNIT_09_LESSONS } from '../../src/data/units/unit09Reactions';
import { UNIT_10_LESSONS } from '../../src/data/units/unit10Halogens';
import { UNIT_11_LESSONS } from '../../src/data/units/unit11Properties';
import { UNIT_12_LESSONS } from '../../src/data/units/unit12Pressure';
import { UNIT_13_LESSONS } from '../../src/data/units/unit13SolarEnergy';
import { UNIT_14_LESSONS, UNIT_15_LESSONS, UNIT_16_LESSONS } from '../../src/data/units/unit14to16Biology';
import { buildMinisterialMockExam } from '../../src/data/ministerialExamBank';
import { DetailedLessonContent, PracticeQuestion } from '../../src/types/curriculum';

import { formatChemProse, generateQrPng, latexToWordText } from './arabicShaper';
import { buildChemDiagrams } from './diagramsChem';
import { buildPhysicsSpaceDiagrams } from './diagramsPhysicsSpace';
import { buildBioDiagrams } from './diagramsBio';
import { ENRICHED_PART_1 } from './enrichedPart1';
import { ENRICHED_PART_2 } from './enrichedPart2';
import { EnrichedLessonBookletData } from './enrichedTypes';

const VERCEL_APP_URL = 'https://interactive-science-lab-9th.vercel.app';
const AUTHOR_NAME = 'الأستاذ إبراهيم أحمد متاش';
const AUTHOR_PHONE = '779424090';
const APP_TITLE = 'المختبر التفاعلي والكتاب الذكي - علوم الصف التاسع (المنهج اليمني)';

const ALL_DETAILED_LESSONS: DetailedLessonContent[] = [
  ...UNIT_01_LESSONS,
  ...UNIT_02_LESSONS,
  ...UNIT_03_LESSONS,
  ...UNIT_04_LESSONS,
  ...UNIT_05_LESSONS,
  ...UNIT_06_LESSONS,
  ...UNIT_07_LESSONS,
  ...UNIT_08_LESSONS,
  ...UNIT_09_LESSONS,
  ...UNIT_10_LESSONS,
  ...UNIT_11_LESSONS,
  ...UNIT_12_LESSONS,
  ...UNIT_13_LESSONS,
  ...UNIT_14_LESSONS,
  ...UNIT_15_LESSONS,
  ...UNIT_16_LESSONS,
];

const LESSONS_BY_UNIT = new Map<number, DetailedLessonContent[]>();
for (const l of ALL_DETAILED_LESSONS) {
  const list = LESSONS_BY_UNIT.get(l.unitId) ?? [];
  list.push(l);
  LESSONS_BY_UNIT.set(l.unitId, list);
}

const ENRICHED_MAP: Record<string, EnrichedLessonBookletData> = {
  ...ENRICHED_PART_1,
  ...ENRICHED_PART_2,
};

const FONT_AR = 'Cairo';

function arRun(
  text: string,
  opts: {
    sizeHalfPt?: number;
    bold?: boolean;
    color?: string;
    italics?: boolean;
  } = {}
): TextRun {
  const { sizeHalfPt = 22, bold = false, color = '1E293B', italics = false } = opts;
  return new TextRun({
    text: formatChemProse(text),
    bold,
    italics,
    color,
    size: sizeHalfPt,
    font: { ascii: FONT_AR, hAnsi: FONT_AR, cs: FONT_AR, eastAsia: FONT_AR },
    rightToLeft: true,
  });
}

function arPara(
  runs: (TextRun | ExternalHyperlink)[] | string,
  opts: {
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    spacingBefore?: number;
    spacingAfter?: number;
    line?: number;
    heading?: (typeof HeadingLevel)[keyof typeof HeadingLevel];
    keepNext?: boolean;
    pageBreakBefore?: boolean;
    bold?: boolean;
    color?: string;
    sizeHalfPt?: number;
  } = {}
): Paragraph {
  const {
    align = AlignmentType.RIGHT,
    spacingBefore = 60,
    spacingAfter = 100,
    line = 312,
    heading,
    keepNext = false,
    pageBreakBefore = false,
    bold = false,
    color = '1E293B',
    sizeHalfPt = 22,
  } = opts;

  const children =
    typeof runs === 'string' ? [arRun(runs, { bold, color, sizeHalfPt })] : runs;

  return new Paragraph({
    bidirectional: true,
    alignment: align,
    heading,
    keepNext,
    pageBreakBefore,
    spacing: { before: spacingBefore, after: spacingAfter, line },
    children,
  });
}

function bulletPara(text: string, opts: { color?: string; boldPrefix?: string } = {}): Paragraph {
  const runs: TextRun[] = [arRun('•  ', { bold: true, color: opts.color ?? '0F766E' })];
  if (opts.boldPrefix) {
    runs.push(arRun(opts.boldPrefix + ' ', { bold: true, color: opts.color ?? '0F172A' }));
  }
  runs.push(arRun(text, { color: '1E293B' }));
  return arPara(runs, { spacingBefore: 35, spacingAfter: 65 });
}

function calloutBox(
  title: string,
  paragraphs: Paragraph[],
  theme: { fill: string; border: string; titleColor: string }
): Table {
  return new Table({
    visuallyRightToLeft: true,
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({
        cantSplit: false,
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: theme.fill, color: 'auto' },
            margins: { top: 140, bottom: 140, right: 180, left: 180 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: theme.border },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: theme.border },
              left: { style: BorderStyle.SINGLE, size: 8, color: theme.border },
              right: { style: BorderStyle.SINGLE, size: 24, color: theme.border },
            },
            children: [
              arPara([arRun(title, { bold: true, sizeHalfPt: 24, color: theme.titleColor })], {
                spacingBefore: 0,
                spacingAfter: 90,
                keepNext: true,
              }),
              ...paragraphs,
            ],
          }),
        ],
      }),
    ],
  });
}

function spacer(pts = 120): Paragraph {
  return new Paragraph({ bidirectional: true, spacing: { before: 0, after: pts }, children: [] });
}

function makeDiagramBlock(diagram: { png: Buffer; caption: string; width: number; height: number }): Paragraph[] {
  return [
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      keepNext: true,
      spacing: { before: 120, after: 60 },
      children: [
        new ImageRun({
          type: 'png',
          data: diagram.png,
          transformation: { width: diagram.width, height: diagram.height },
        }),
      ],
    }),
    arPara([arRun(diagram.caption, { bold: true, sizeHalfPt: 19, color: '0F766E' })], {
      align: AlignmentType.CENTER,
      spacingBefore: 0,
      spacingAfter: 140,
    }),
  ];
}

async function main() {
  console.log('1. Rendering high-resolution Arabic scientific diagrams...');
  const diagrams = {
    ...buildChemDiagrams(),
    ...buildPhysicsSpaceDiagrams(),
    ...buildBioDiagrams(),
  };
  console.log(`   Rendered ${Object.keys(diagrams).length} multi-panel illustrations.`);

  const qrPng = await generateQrPng(VERCEL_APP_URL);
  const children: (Paragraph | Table)[] = [];

  // ==================== صفحة الغلاف ====================
  children.push(
    new Table({
      visuallyRightToLeft: true,
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { type: ShadingType.CLEAR, fill: '0F766E', color: 'auto' },
              margins: { top: 280, bottom: 280, right: 240, left: 240 },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              },
              children: [
                arPara('الجمهورية اليمنية — الصف التاسع الأساسي (الجزآن الأول والثاني)', {
                  align: AlignmentType.CENTER,
                  color: 'CCFBF1',
                  bold: true,
                  sizeHalfPt: 24,
                  spacingAfter: 100,
                }),
                arPara('الملزمة العلمية الشاملة والمفسّرة للكتاب المدرسي', {
                  align: AlignmentType.CENTER,
                  color: 'FFFFFF',
                  bold: true,
                  sizeHalfPt: 40,
                  spacingAfter: 110,
                }),
                arPara(APP_TITLE, {
                  align: AlignmentType.CENTER,
                  color: 'FDE68A',
                  bold: true,
                  sizeHalfPt: 28,
                  spacingAfter: 40,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    spacer(180),
    calloutBox(
      'لماذا هذه الملزمة؟ (تغني عن الكتاب وتعمل كمعلم ومختبر متكامل على الورق)',
      [
        bulletPara('تغطي كامل المنهج اليمني للصف التاسع بجزأيه الأول والثاني (16 وحدة — 53 درساً) بشرح سلس ووافٍ لا يحتاج إلى معلم.'),
        bulletPara('تبدأ كل درس ببطاقة «تأسيس سريع قبل أن تبدأ» لمعالجة الضعف العلمي وبناء الخلفية اللازمة لفهم الدرس الجديد.'),
        bulletPara('تضم 22 لوحة رسوم توضيحية مشروحة وخطوات عملية للتجارب المخبرية لتعويض غياب المختبرات والهواتف في المناطق النائية.'),
        bulletPara('تشمل جميع القوانين والمسائل المحلولة خطوة بخطوة، والمصائد الوزارية المعتمدة في نماذج 1446هـ، واختباراً وزارياً كاملاً من 50 فقرة (80 درجة) مع الحلول المفسرة.'),
      ],
      { fill: 'F0FDFA', border: '0F766E', titleColor: '0F766E' }
    ),
    spacer(180),
    // Author & Vercel QR Table
    new Table({
      visuallyRightToLeft: true,
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: 'F8FAFC', color: 'auto' },
              margins: { top: 180, bottom: 180, right: 180, left: 180 },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' },
                bottom: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' },
                left: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' },
                right: { style: BorderStyle.SINGLE, size: 20, color: '0F766E' },
              },
              children: [
                arPara('بيانات الإعداد والتطوير والتطبيق الرقمي المرافق', {
                  bold: true,
                  sizeHalfPt: 24,
                  color: '0F766E',
                  spacingAfter: 90,
                }),
                bulletPara(AUTHOR_NAME, { boldPrefix: 'إعداد وتطوير:' }),
                bulletPara(`${AUTHOR_PHONE} (لإبداء الملاحظات أو الدعم والاستفسار)`, { boldPrefix: 'رقم التواصل:' }),
                bulletPara('هذه الملزمة والتطبيق مجانيان 100% وقفاً للعلم وخدمةً لطلاب اليمن.', { boldPrefix: 'الترخيص:' }),
                arPara([
                  arRun('•  رابط التطبيق التفاعلي (3D) على فيرسل (Vercel): ', { bold: true, color: '0F766E' }),
                  new ExternalHyperlink({
                    link: VERCEL_APP_URL,
                    children: [
                      new TextRun({
                        text: VERCEL_APP_URL,
                        style: 'Hyperlink',
                        size: 20,
                        color: '0369A1',
                        bold: true,
                        font: { ascii: FONT_AR, hAnsi: FONT_AR, cs: FONT_AR },
                      }),
                    ],
                  }),
                ]),
                arPara(
                  'ملاحظة: عند توفر هاتف ذكي أو حاسوب، امسح رمز الاستجابة السريع (QR) أو افتح الرابط أعلاه لمشاهدة التجارب ثلاثية الأبعاد وحل الاختبارات الإلكترونية.',
                  { sizeHalfPt: 19, color: '475569', spacingBefore: 40, spacingAfter: 0 }
                ),
              ],
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: 'FFFFFF', color: 'auto' },
              margins: { top: 150, bottom: 150, right: 120, left: 120 },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' },
                bottom: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' },
                left: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' },
                right: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' },
              },
              children: [
                new Paragraph({
                  bidirectional: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 40, after: 60 },
                  children: [
                    new ImageRun({
                      type: 'png',
                      data: qrPng,
                      transformation: { width: 130, height: 130 },
                    }),
                  ],
                }),
                arPara('امسح للوصول للتطبيق 3D', {
                  align: AlignmentType.CENTER,
                  sizeHalfPt: 18,
                  bold: true,
                  color: '0F766E',
                  spacingBefore: 0,
                  spacingAfter: 0,
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // ==================== فهرس الوحدات الـ 16 ====================
  children.push(
    arPara('فهرس محتويات المنهج الكامل (الجزآن الأول والثاني — 16 وحدة / 53 درساً)', {
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      align: AlignmentType.CENTER,
      sizeHalfPt: 30,
      color: '0F766E',
      bold: true,
      spacingAfter: 160,
    })
  );

  const tocRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: ['م', 'الجزء', 'عنوان الوحدة الدراسية', 'المجال', 'عناوين الدروس (مرقمة)', 'ص الكتاب'].map(
        (h) =>
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: '0F766E', color: 'auto' },
            margins: { top: 90, bottom: 90, right: 80, left: 80 },
            children: [arPara(h, { bold: true, color: 'FFFFFF', sizeHalfPt: 20, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })],
          })
      ),
    }),
  ];

  for (const unit of CURRICULUM_UNITS) {
    const lessonsText = unit.lessons.map((l) => `${l.lessonNumber}. ${l.title}`).join('  |  ');
    tocRows.push(
      new TableRow({
        children: [
          new TableCell({
            margins: { top: 70, bottom: 70, right: 60, left: 60 },
            children: [arPara(String(unit.id), { bold: true, sizeHalfPt: 19, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })],
          }),
          new TableCell({
            margins: { top: 70, bottom: 70, right: 60, left: 60 },
            children: [arPara(unit.part === 1 ? 'الأول' : 'الثاني', { sizeHalfPt: 18, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })],
          }),
          new TableCell({
            margins: { top: 70, bottom: 70, right: 80, left: 80 },
            children: [arPara(unit.title, { bold: true, sizeHalfPt: 19, color: '0F172A', spacingBefore: 0, spacingAfter: 0 })],
          }),
          new TableCell({
            margins: { top: 70, bottom: 70, right: 60, left: 60 },
            children: [arPara(unit.domain, { sizeHalfPt: 18, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })],
          }),
          new TableCell({
            margins: { top: 70, bottom: 70, right: 80, left: 80 },
            children: [arPara(lessonsText, { sizeHalfPt: 17, color: '334155', spacingBefore: 0, spacingAfter: 0 })],
          }),
          new TableCell({
            margins: { top: 70, bottom: 70, right: 60, left: 60 },
            children: [arPara(`ص ${unit.pageNumber}`, { sizeHalfPt: 18, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })],
          }),
        ],
      })
    );
  }

  children.push(
    new Table({
      visuallyRightToLeft: true,
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tocRows,
    })
  );

  // ==================== الوحدات الـ 16 والدروس الـ 53 ====================
  let currentPart = 0;

  for (const unit of CURRICULUM_UNITS) {
    if (unit.part !== currentPart) {
      currentPart = unit.part;
      children.push(
        new Paragraph({
          bidirectional: true,
          pageBreakBefore: true,
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 140 },
          children: [
            arRun(
              currentPart === 1
                ? 'القسم الأول: كتاب الجزء الأول (الوحدات 1 إلى 8)'
                : 'القسم الثاني: كتاب الجزء الثاني (الوحدات 9 إلى 16)',
              { bold: true, sizeHalfPt: 34, color: '0F766E' }
            ),
          ],
        })
      );
    }

    // Unit Banner (start each unit cleanly on a new page except Units 1 and 9 which follow their part header)
    if (unit.id !== 1 && unit.id !== 9) {
      children.push(new Paragraph({ bidirectional: true, children: [new PageBreak()] }));
    }
    children.push(
      new Table({
        visuallyRightToLeft: true,
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: { type: ShadingType.CLEAR, fill: '0F766E', color: 'auto' },
                margins: { top: 140, bottom: 140, right: 180, left: 180 },
                children: [
                  arPara(`الوحدة ${unit.id}: ${unit.title}`, {
                    heading: HeadingLevel.HEADING_1,
                    color: 'FFFFFF',
                    bold: true,
                    sizeHalfPt: 30,
                    spacingBefore: 0,
                    spacingAfter: 40,
                  }),
                  arPara(`الجزء ${unit.part === 1 ? 'الأول' : 'الثاني'} · المجال: ${unit.domain} · مرجع الكتاب: ص ${unit.pageNumber} · عدد الدروس: ${unit.lessons.length}`, {
                    color: 'CCFBF1',
                    sizeHalfPt: 20,
                    spacingBefore: 0,
                    spacingAfter: 0,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      spacer(120)
    );

    const unitLessons = LESSONS_BY_UNIT.get(unit.id) ?? [];
    const unitQuestionsToAnswer: { lessonTitle: string; q: PracticeQuestion }[] = [];

    for (let li = 0; li < unitLessons.length; li++) {
      const lesson = unitLessons[li];
      const enriched = ENRICHED_MAP[lesson.lessonId];

      // Lesson Header
      children.push(
        arPara(`الدرس ${li + 1}: ${lesson.title}   (${lesson.pageRef})`, {
          heading: HeadingLevel.HEADING_2,
          sizeHalfPt: 27,
          bold: true,
          color: '0369A1',
          spacingBefore: 160,
          spacingAfter: 100,
          keepNext: true,
        })
      );

      // 1. Foundation box (الخلفية العلمية لمن يعاني ضعفا)
      const foundationParas: Paragraph[] = [];
      if (enriched?.foundation?.length) {
        for (const f of enriched.foundation) {
          foundationParas.push(bulletPara(f, { color: '0284C7' }));
        }
      }
      if (lesson.prerequisites?.length) {
        foundationParas.push(
          arPara('متطلبات قبلية من دروس سابقة:', { bold: true, sizeHalfPt: 20, color: '0369A1', spacingBefore: 60, spacingAfter: 40 })
        );
        for (const pre of lesson.prerequisites) {
          foundationParas.push(bulletPara(pre, { color: '0369A1' }));
        }
      }
      children.push(
        calloutBox('أولاً: تأسيس سريع وخلفية علمية (قبل أن تبدأ الدرس)', foundationParas, {
          fill: 'F0F9FF',
          border: '0284C7',
          titleColor: '0369A1',
        }),
        spacer(100)
      );

      // 2. Discover Scenario
      children.push(
        calloutBox(
          'ثانياً: تمهيد من الواقع وسؤال استكشافي',
          [
            arPara(lesson.step1Discover.scenario, { spacingBefore: 0, spacingAfter: 70 }),
            arPara([arRun('السؤال: ', { bold: true, color: '0F766E' }), arRun(lesson.step1Discover.question, { bold: true })], {
              spacingAfter: 60,
            }),
            arPara(
              [
                arRun('الجواب والتفسير العلمي: ', { bold: true, color: '15803D' }),
                arRun(lesson.step1Discover.revealExplanation),
              ],
              { spacingAfter: 0 }
            ),
          ],
          { fill: 'F8FAFC', border: '64748B', titleColor: '334155' }
        ),
        spacer(100)
      );

      // 3. Comprehensive Book Explanation (الشرح الوافي المغني عن الكتاب)
      children.push(
        arPara('ثالثاً: الشرح المفصّل والشامل لمادة الكتاب المدرسي', {
          bold: true,
          sizeHalfPt: 24,
          color: '0F766E',
          spacingBefore: 80,
          spacingAfter: 70,
          keepNext: true,
        })
      );

      if (enriched?.deepExplanation?.length) {
        for (const p of enriched.deepExplanation) {
          children.push(arPara(p, { spacingBefore: 20, spacingAfter: 90 }));
        }
      }

      for (const concept of lesson.step2Understand.concepts) {
        const conceptParas: Paragraph[] = [
          arPara([
            arRun('نص الكتاب وتفصيله: ', { bold: true, color: '0F172A' }),
            arRun(concept.textbookContent),
          ], { spacingBefore: 0, spacingAfter: 70 }),
          arPara([
            arRun('توضيح المعلم المبسط: ', { bold: true, color: '0F766E' }),
            arRun(concept.extraExplanation),
          ], { spacingBefore: 0, spacingAfter: 70 }),
        ];

        if (concept.chemEquationLatex) {
          conceptParas.push(
            arPara([
              arRun('المعادلة الكيميائية: ', { bold: true, color: '1D4ED8' }),
              arRun(latexToWordText(concept.chemEquationLatex), { bold: true, color: '1E3A8A' }),
            ], { spacingAfter: 60 })
          );
        }
        if (concept.formulaLatex) {
          conceptParas.push(
            arPara([
              arRun('القانون الرياضي: ', { bold: true, color: '1D4ED8' }),
              arRun(latexToWordText(concept.formulaLatex), { bold: true, color: '1E3A8A' }),
            ], { spacingAfter: 60 })
          );
        }
        if (concept.ministerialNuance) {
          conceptParas.push(
            arPara([
              arRun('تنبيه وزاري هام: ', { bold: true, color: 'B45309' }),
              arRun(concept.ministerialNuance, { bold: true, color: '92400E' }),
            ], { spacingAfter: 0 })
          );
        }

        children.push(
          calloutBox(
            `${concept.title}${concept.textbookPage ? ` (${concept.textbookPage})` : ''}`,
            conceptParas,
            { fill: 'FFFFFF', border: '0F766E', titleColor: '0F766E' }
          ),
          spacer(90)
        );
      }

      // 4. Embedded Illustration PNG Diagram (if mapped to this lesson)
      const diagKey = enriched?.diagramId && diagrams[enriched.diagramId] ? enriched.diagramId : undefined;
      if (diagKey) {
        children.push(...makeDiagramBlock(diagrams[diagKey]));
      }

      // 5. Practical Lab Walkthrough on Paper (مختبر بدون معامل)
      if (enriched?.experiment) {
        const exp = enriched.experiment;
        const expParas: Paragraph[] = [
          arPara([arRun('الأدوات المطلوبة: ', { bold: true, color: '0F172A' }), arRun(exp.tools)], { spacingAfter: 60 }),
          arPara('خطوات تنفيذ التجربة:', { bold: true, color: '0F766E', spacingAfter: 40 }),
          ...exp.steps.map((st, idx) => arPara(`${idx + 1}. ${st}`, { spacingBefore: 15, spacingAfter: 40 })),
          arPara([arRun('المشاهدة: ', { bold: true, color: '0369A1' }), arRun(exp.observation)], { spacingAfter: 50 }),
          arPara([arRun('التفسير العلمي: ', { bold: true, color: '7C3AED' }), arRun(exp.scientificExplanation)], { spacingAfter: 50 }),
          arPara([arRun('الاستنتاج النهائي: ', { bold: true, color: '15803D' }), arRun(exp.conclusion, { bold: true })], { spacingAfter: 0 }),
        ];
        children.push(
          calloutBox(`رابعاً: مختبر الورق — ${exp.title}`, expParas, {
            fill: 'F0FDF4',
            border: '16A34A',
            titleColor: '15803D',
          }),
          spacer(90)
        );
      } else if (lesson.step3Experiment?.levels?.length) {
        const lvlParas = lesson.step3Experiment.levels.map((lv) =>
          bulletPara(`${lv.title}: ${lv.postExplanation}`, { color: '15803D' })
        );
        children.push(
          calloutBox('رابعاً: خلاصة النشاط والاستكشاف العملي للدرس', lvlParas, {
            fill: 'F0FDF4',
            border: '16A34A',
            titleColor: '15803D',
          }),
          spacer(90)
        );
      }

      // 6. Laws, Conclusions & Worked Numerical Examples
      const lawParas: Paragraph[] = [
        arPara([arRun('القاعدة الذهبية للدرس: ', { bold: true, color: '0F172A' }), arRun(lesson.step4Conclude.summaryLaw)], {
          spacingAfter: 60,
        }),
      ];
      if (lesson.step4Conclude.lawLatex) {
        lawParas.push(
          arPara(latexToWordText(lesson.step4Conclude.lawLatex), {
            align: AlignmentType.CENTER,
            bold: true,
            sizeHalfPt: 23,
            color: '1E3A8A',
            spacingAfter: 70,
          })
        );
      }
      for (const tk of lesson.step4Conclude.keyTakeaways) {
        lawParas.push(bulletPara(tk, { color: '1D4ED8' }));
      }
      if (enriched?.workedExamples?.length) {
        for (const ex of enriched.workedExamples) {
          lawParas.push(
            arPara(ex.problem, { bold: true, color: '0F172A', spacingBefore: 80, spacingAfter: 50 }),
            ...ex.solutionSteps.map((s) => arPara(`   ${s}`, { color: '1E3A8A', spacingBefore: 15, spacingAfter: 35 }))
          );
        }
      }
      children.push(
        calloutBox('خامساً: القوانين والمعادلات والأمثلة المحلولة بالخطوات', lawParas, {
          fill: 'EFF6FF',
          border: '2563EB',
          titleColor: '1D4ED8',
        }),
        spacer(90)
      );

      // 7. Glossary & Ministerial Traps
      const trapParas: Paragraph[] = [];
      if (lesson.step2Understand.glossary.length) {
        trapParas.push(arPara('أهم المصطلحات العلمية للحفظ:', { bold: true, color: '0F172A', spacingAfter: 40 }));
        for (const g of lesson.step2Understand.glossary) {
          trapParas.push(
            bulletPara(`${g.definition}${g.pageRef ? ` (${g.pageRef})` : ''}`, {
              boldPrefix: `${g.term}:`,
              color: 'B45309',
            })
          );
        }
      }
      if (lesson.step7Review.commonTraps.length) {
        trapParas.push(arPara('احذر هذه المصائد في الاختبار الوزاري:', { bold: true, color: 'B91C1C', spacingBefore: 60, spacingAfter: 40 }));
        for (const tr of lesson.step7Review.commonTraps) {
          trapParas.push(bulletPara(tr, { color: 'DC2626' }));
        }
      }
      if (trapParas.length) {
        children.push(
          calloutBox('سادساً: المصطلحات العلمية والمصائد الوزارية', trapParas, {
            fill: 'FFFBEB',
            border: 'D97706',
            titleColor: 'B45309',
          }),
          spacer(90)
        );
      }

      // 8. Practice Questions (printed clean; answers collected for end of unit)
      const lessonQs = [...lesson.step5Verify, ...lesson.step6Master];
      if (lessonQs.length) {
        children.push(
          arPara('سابعاً: اختبر فهمك (أسئلة الدرس — الإجابات المفسّرة في نهاية الوحدة)', {
            bold: true,
            sizeHalfPt: 23,
            color: '0F766E',
            spacingBefore: 60,
            spacingAfter: 60,
            keepNext: true,
          })
        );
        lessonQs.forEach((q, qIdx) => {
          unitQuestionsToAnswer.push({ lessonTitle: lesson.title, q });
          const qType = q.type === 'tf' ? '[صح / خطأ]' : '[اختيار من متعدد]';
          children.push(
            arPara(`${qIdx + 1}. ${qType} ${q.prompt}`, { bold: true, spacingBefore: 40, spacingAfter: 30 }),
            arPara(
              q.type === 'tf'
                ? '    (   ) صح       (   ) خطأ'
                : '    ' + q.options.map((op, oi) => `${['أ', 'ب', 'ج', 'د'][oi]}) ${op}`).join('    |    '),
              { sizeHalfPt: 20, color: '334155', spacingBefore: 0, spacingAfter: 60 }
            )
          );
        });
      }
    }

    // End of Unit Answer Key
    if (unitQuestionsToAnswer.length) {
      children.push(
        calloutBox(
          `ملحق إجابات تدريبات الوحدة ${unit.id} (مع التفسير العلمي)`,
          unitQuestionsToAnswer.map(({ lessonTitle, q }, idx) =>
            arPara(
              [
                arRun(`س${idx + 1} (${lessonTitle}): `, { bold: true, color: '0F172A', sizeHalfPt: 20 }),
                arRun(`الإجابة: (${q.options[q.correctIndex]}) — `, { bold: true, color: '15803D', sizeHalfPt: 20 }),
                arRun(q.explanation, { color: '334155', sizeHalfPt: 19 }),
              ],
              { spacingBefore: 20, spacingAfter: 45 }
            )
          ),
          { fill: 'F8FAFC', border: '0F766E', titleColor: '0F766E' }
        ),
        spacer(140)
      );
    }
  }

  // ==================== الملحق الختامي: الاختبار الوزاري الشامل (50 فقرة / 80 درجة) ====================
  const mockExam = buildMinisterialMockExam();
  children.push(
    arPara('الملحق الختامي: محاكي الاختبار الوزاري المطبوع (50 فقرة = 80 درجة)', {
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      align: AlignmentType.CENTER,
      sizeHalfPt: 32,
      color: '0F766E',
      bold: true,
      spacingAfter: 80,
    }),
    arPara(
      'نموذج تدريبي متوازن يغطي جميع الوحدات الـ 16 مطابق لنظام الورقة الوزارية (الفقرات 1–20: صح/خطأ بدرجة واحدة لكل فقرة، والفقرات 21–50: اختيار من متعدد بدرجتين لكل فقرة).',
      { align: AlignmentType.CENTER, color: '475569', sizeHalfPt: 21, spacingAfter: 140 }
    )
  );

  mockExam.questions.forEach((q, idx) => {
    const num = idx + 1;
    const marks = q.type === 'tf' ? 'درجة واحدة' : 'درجتان';
    if (idx === 0) {
      children.push(
        arPara('القسم الأول (الفقرات 1 – 20): ضع علامة (✓) أمام العبارة الصحيحة وعلامة (✗) أمام العبارة الخاطئة (20 درجة):', {
          bold: true,
          color: '0369A1',
          sizeHalfPt: 24,
          spacingAfter: 80,
        })
      );
    } else if (idx === 20) {
      children.push(
        arPara('القسم الثاني (الفقرات 21 – 50): اختر الإجابة الصحيحة من البدائل المعطاة (60 درجة):', {
          bold: true,
          color: '0369A1',
          sizeHalfPt: 24,
          spacingBefore: 140,
          spacingAfter: 80,
        })
      );
    }
    children.push(
      arPara(`${num}. (${marks} — الوحدة ${q.unitId}): ${q.prompt}`, { bold: true, spacingBefore: 40, spacingAfter: 30 }),
      arPara(
        q.type === 'tf'
          ? '    (   ) صح       (   ) خطأ'
          : '    ' + q.options.map((op, oi) => `${['أ', 'ب', 'ج', 'د'][oi]}) ${op}`).join('    |    '),
        { sizeHalfPt: 20, color: '334155', spacingBefore: 0, spacingAfter: 55 }
      )
    );
  });

  // Printable Bubble Sheet (ورقة التظليل الورقية)
  children.push(
    arPara('ورقة التظليل الإرشادية (درّب نفسك على التظليل الصحيح)', {
      heading: HeadingLevel.HEADING_2,
      pageBreakBefore: true,
      align: AlignmentType.CENTER,
      sizeHalfPt: 26,
      bold: true,
      color: '0F766E',
      spacingAfter: 100,
    })
  );

  const bubbleRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: ['رقم السؤال', 'التظليل', 'رقم السؤال', 'التظليل'].map(
        (h) =>
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: '0F766E', color: 'auto' },
            margins: { top: 60, bottom: 60, right: 60, left: 60 },
            children: [arPara(h, { bold: true, color: 'FFFFFF', sizeHalfPt: 19, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })],
          })
      ),
    }),
  ];

  for (let i = 0; i < 25; i++) {
    const leftNum = i + 1;
    const rightNum = i + 26;
    const fmt = (n: number) => (n <= 20 ? '○ صح   ○ خطأ' : '○ أ   ○ ب   ○ ج   ○ د');
    bubbleRows.push(
      new TableRow({
        children: [
          new TableCell({
            margins: { top: 45, bottom: 45, right: 50, left: 50 },
            children: [arPara(String(leftNum), { bold: true, sizeHalfPt: 18, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })],
          }),
          new TableCell({
            margins: { top: 45, bottom: 45, right: 50, left: 50 },
            children: [arPara(fmt(leftNum), { sizeHalfPt: 18, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })],
          }),
          new TableCell({
            margins: { top: 45, bottom: 45, right: 50, left: 50 },
            children: [arPara(String(rightNum), { bold: true, sizeHalfPt: 18, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })],
          }),
          new TableCell({
            margins: { top: 45, bottom: 45, right: 50, left: 50 },
            children: [arPara(fmt(rightNum), { sizeHalfPt: 18, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })],
          }),
        ],
      })
    );
  }

  children.push(
    new Table({
      visuallyRightToLeft: true,
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: bubbleRows,
    }),
    spacer(160),
    arPara('نموذج الإجابة المفسّر للاختبار الوزاري الشامل (50 فقرة)', {
      heading: HeadingLevel.HEADING_2,
      pageBreakBefore: true,
      align: AlignmentType.CENTER,
      sizeHalfPt: 26,
      bold: true,
      color: '15803D',
      spacingAfter: 100,
    }),
    ...mockExam.questions.map((q, idx) =>
      arPara(
        [
          arRun(`س${idx + 1} (الوحدة ${q.unitId}): `, { bold: true, color: '0F172A', sizeHalfPt: 19 }),
          arRun(`${q.options[q.correctIndex]} — `, { bold: true, color: '15803D', sizeHalfPt: 19 }),
          arRun(q.explanation, { color: '334155', sizeHalfPt: 19 }),
        ],
        { spacingBefore: 20, spacingAfter: 45 }
      )
    ),
    spacer(180),
    calloutBox(
      'خاتمة وتواصل — مع أطيب التمنيات بالتفوق والنجاح',
      [
        arPara(`إعداد وتطوير: ${AUTHOR_NAME} · للتواصل وإبداء الملاحظات أو الدعم: ${AUTHOR_PHONE}`, { bold: true, color: '0F766E' }),
        arPara(`رابط التطبيق التفاعلي ثلاثي الأبعاد على Vercel: ${VERCEL_APP_URL}`, { bold: true, color: '0369A1', spacingAfter: 0 }),
      ],
      { fill: 'F0FDFA', border: '0F766E', titleColor: '0F766E' }
    )
  );

  // ==================== Build Word Document ====================
  const doc = new Document({
    creator: AUTHOR_NAME,
    title: `الملزمة العلمية الشاملة - ${APP_TITLE}`,
    description: 'ملزمة تعليمية شاملة ومفسّرة لمنهج العلوم للصف التاسع الأساسي اليمني بجزأيه الأول والثاني مدعمة بالرسوم التوضيحية.',
    sections: [
      {
        properties: {
          titlePage: true,
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 1134, bottom: 1134, right: 1020, left: 1020 },
          },
        },
        headers: {
          default: new Header({
            children: [
              arPara(
                `المختبر التفاعلي والكتاب الذكي (علوم الصف التاسع — المنهج اليمني)  |  إعداد: ${AUTHOR_NAME}`,
                { align: AlignmentType.CENTER, sizeHalfPt: 17, color: '64748B', spacingBefore: 0, spacingAfter: 40 }
              ),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.CENTER,
                children: [
                  arRun(`ملزمة مجانية · تواصل: ${AUTHOR_PHONE} · التطبيق: ${VERCEL_APP_URL}  —  صفحة `, {
                    sizeHalfPt: 16,
                    color: '64748B',
                  }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '0F766E', bold: true }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  console.log('2. Packing .docx file...');
  const buf = await Packer.toBuffer(doc);

  const outPublic = path.resolve(process.cwd(), 'public/malzama-science9-yemen.docx');
  const outWorkspace = path.resolve(process.cwd(), 'workspace/malzama-science9-yemen.docx');
  fs.writeFileSync(outPublic, buf);
  fs.writeFileSync(outWorkspace, buf);
  console.log(`SUCCESS! Generated Word document (${(buf.length / 1024).toFixed(1)} KB):`);
  console.log(` - ${outPublic}`);
  console.log(` - ${outWorkspace}`);
}

main().catch((err) => {
  console.error('Failed to build docx:', err);
  process.exit(1);
});
