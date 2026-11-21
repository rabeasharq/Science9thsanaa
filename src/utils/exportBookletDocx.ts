import QRCode from 'qrcode';
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

import { CURRICULUM_UNITS } from '../data/curriculumIndex';
import { UNIT_01_LESSONS } from '../data/units/unit01Solutions';
import { UNIT_02_LESSONS } from '../data/units/unit02AcidsBases';
import { UNIT_03_LESSONS } from '../data/units/unit03AcidsReactions';
import { UNIT_04_LESSONS } from '../data/units/unit04Space';
import { UNIT_05_LESSONS } from '../data/units/unit05Magnetism';
import { UNIT_06_LESSONS } from '../data/units/unit06Excretion';
import { UNIT_07_LESSONS } from '../data/units/unit07Reproduction';
import { UNIT_08_LESSONS } from '../data/units/unit08Diseases';
import { UNIT_09_LESSONS } from '../data/units/unit09Reactions';
import { UNIT_10_LESSONS } from '../data/units/unit10Halogens';
import { UNIT_11_LESSONS } from '../data/units/unit11Properties';
import { UNIT_12_LESSONS } from '../data/units/unit12Pressure';
import { UNIT_13_LESSONS } from '../data/units/unit13SolarEnergy';
import { UNIT_14_LESSONS, UNIT_15_LESSONS, UNIT_16_LESSONS } from '../data/units/unit14to16Biology';
import { buildMinisterialMockExam } from '../data/ministerialExamBank';
import { ENRICHED_PART_1 } from '../data/booklet/enrichedPart1';
import { ENRICHED_PART_2 } from '../data/booklet/enrichedPart2';
import { EnrichedLessonBookletData } from '../data/booklet/enrichedTypes';
import { BOOKLET_DIAGRAMS } from '../data/booklet/diagramsIndex';
import { DetailedLessonContent, PracticeQuestion } from '../types/curriculum';

const AUTHOR_NAME = 'الأستاذ إبراهيم أحمد متاش';
const AUTHOR_PHONE = '779424090';
const APP_TITLE = 'المختبر التفاعلي والكتاب الذكي - علوم الصف التاسع (المنهج اليمني)';
const FONT_AR = 'Cairo';

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
  const arr = LESSONS_BY_UNIT.get(l.unitId) ?? [];
  arr.push(l);
  LESSONS_BY_UNIT.set(l.unitId, arr);
}

const ENRICHED_MAP: Record<string, EnrichedLessonBookletData> = {
  ...ENRICHED_PART_1,
  ...ENRICHED_PART_2,
};

const WORD_SUB_MAP: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
};

const WORD_SUP_MAP: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '₅': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁺': '+', '⁻': '-',
};

function extractBraced(str: string, startIdx: number): { content: string; endIdx: number } | null {
  if (str[startIdx] !== '{') return null;
  let depth = 0;
  for (let i = startIdx; i < str.length; i++) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') {
      depth--;
      if (depth === 0) return { content: str.slice(startIdx + 1, i), endIdx: i };
    }
  }
  return null;
}

function replaceSingleArgCmd(str: string, cmd: string, replacer: (inner: string) => string): string {
  let out = str;
  let safety = 0;
  while (out.includes(cmd + '{') && safety++ < 40) {
    const idx = out.indexOf(cmd + '{');
    const b = extractBraced(out, idx + cmd.length);
    if (!b) break;
    out = out.slice(0, idx) + replacer(b.content) + out.slice(b.endIdx + 1);
  }
  return out;
}

function replaceTwoArgCmd(str: string, cmd: string, replacer: (a: string, b: string) => string): string {
  let out = str;
  let safety = 0;
  while (out.includes(cmd + '{') && safety++ < 40) {
    const idx = out.indexOf(cmd + '{');
    const b1 = extractBraced(out, idx + cmd.length);
    if (!b1) break;
    let nextPos = b1.endIdx + 1;
    while (out[nextPos] === ' ') nextPos++;
    const b2 = extractBraced(out, nextPos);
    if (!b2) break;
    out = out.slice(0, idx) + replacer(b1.content, b2.content) + out.slice(b2.endIdx + 1);
  }
  return out;
}

const SUB_UNI_MAP: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
};

const SUP_UNI_MAP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻',
};

function latexToWordText(raw: string): string {
  if (!raw) return '';
  let s = raw.trim();

  s = replaceTwoArgCmd(s, '\\frac', (a, b) => `(${a}) ÷ (${b})`);
  s = replaceSingleArgCmd(s, '\\xrightarrow', (inner) =>
    inner.includes('Delta') ? ' ⟶(حرارة) ' : inner.includes('H_2O') ? ' ⟶(ماء) ' : ` ⟶(${inner}) `
  );
  s = replaceSingleArgCmd(s, '\\mathrm', (inner) => inner);
  s = replaceSingleArgCmd(s, '\\text', (inner) => inner);

  s = s
    .replace(/\\rightarrow|\\longrightarrow|\\to\b/g, ' ⟶ ')
    .replace(/\\iff/g, ' ⇔ ')
    .replace(/\\propto/g, ' ∝ ')
    .replace(/\\uparrow/g, '↑')
    .replace(/\\downarrow/g, '↓')
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈')
    .replace(/\\leq|\\le\b/g, '≤')
    .replace(/\\geq|\\ge\b/g, '≥')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\qquad/g, '   |   ')
    .replace(/\\quad/g, '   ')
    .replace(/\\,/g, ' ')
    .replace(/\^\{\\circ\}/g, '°')
    .replace(/\\circ/g, '°');

  s = s.replace(/_\{([^{}]+)\}/g, (_, g) =>
    /^[0-9]+$/.test(g) ? [...g].map((c) => SUB_UNI_MAP[c] || c).join('') : ` (${g})`
  );
  s = s.replace(/_([0-9])/g, (_, c) => SUB_UNI_MAP[c] || c);
  s = s.replace(/_([\u0600-\u06FFa-zA-Z]+)/g, ' ($1)');

  s = s.replace(/\^\{([0-9+\-]+)\}/g, (_, g) => [...g].map((c) => SUP_UNI_MAP[c] || c).join(''));
  s = s.replace(/\^([0-9+\-])/g, (_, c) => SUP_UNI_MAP[c] || c);

  return s.replace(/[{}]/g, '').replace(/\s{2,}/g, ' ').trim();
}

function makeRun(
  text: string,
  opts: {
    sizeHalfPt?: number;
    bold?: boolean;
    color?: string;
    italics?: boolean;
    subScript?: boolean;
    superScript?: boolean;
    rightToLeft?: boolean;
  }
): TextRun {
  const {
    sizeHalfPt = 22,
    bold = false,
    color = '1E293B',
    italics = false,
    subScript = false,
    superScript = false,
    rightToLeft = true,
  } = opts;
  return new TextRun({
    text,
    bold,
    italics,
    color,
    size: sizeHalfPt,
    subScript,
    superScript,
    font: { ascii: FONT_AR, hAnsi: FONT_AR, cs: FONT_AR, eastAsia: FONT_AR },
    rightToLeft,
  });
}

function arRun(
  text: string,
  opts: { sizeHalfPt?: number; bold?: boolean; color?: string; italics?: boolean } = {}
): TextRun {
  return makeRun(text, opts);
}

function arRuns(
  rawText: string,
  opts: { sizeHalfPt?: number; bold?: boolean; color?: string; italics?: boolean } = {}
): TextRun[] {
  const text = rawText.replace(/<=>/g, '⇌').replace(/-->|->|⟶/g, '→');
  const runs: TextRun[] = [];
  const chemRegex =
    /(?:\d*(?=[A-Z]))?[A-Z][A-Za-z0-9₀-₉⁰-⁹⁺⁻()^]*(?:\^[\{\}0-9+\-]+|[+-](?![A-Za-z0-9]))?[↑↓]?|[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻₀₁₂₃₄₅₆₇₈₉]+/g;

  let lastIdx = 0;
  let match: RegExpExecArray | null;

  const pushArabic = (chunk: string) => {
    if (chunk) runs.push(makeRun(chunk, { ...opts, rightToLeft: true }));
  };

  while ((match = chemRegex.exec(text)) !== null) {
    const tok = match[0];
    const hasSubOrSup =
      /[₀-₉⁰-⁹⁺⁻^]/.test(tok) || /[A-Za-z)][0-9]+/.test(tok) || /[A-Za-z0-9)][+-]$/.test(tok);
    if (!hasSubOrSup) continue;

    if (match.index > lastIdx) pushArabic(text.slice(lastIdx, match.index));

    if (/^[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻₀₁₂₃₄₅₆₇₈₉]+$/.test(tok)) {
      for (const ch of tok) {
        if (WORD_SUB_MAP[ch]) runs.push(makeRun(WORD_SUB_MAP[ch], { ...opts, subScript: true, rightToLeft: true }));
        else if (WORD_SUP_MAP[ch]) runs.push(makeRun(WORD_SUP_MAP[ch], { ...opts, superScript: true, rightToLeft: true }));
      }
      lastIdx = chemRegex.lastIndex;
      continue;
    }

    let buf = '';
    const flushLat = () => {
      if (buf) {
        runs.push(makeRun(buf, { ...opts, rightToLeft: false }));
        buf = '';
      }
    };
    let i = 0;
    while (i < tok.length) {
      const ch = tok[i];
      if (ch === '^') {
        if (tok[i + 1] === '{') {
          const close = tok.indexOf('}', i + 2);
          if (close !== -1) {
            flushLat();
            const sup = [...tok.slice(i + 2, close)].map((c) => WORD_SUP_MAP[c] ?? c).join('');
            runs.push(makeRun(sup, { ...opts, superScript: true, rightToLeft: false }));
            i = close + 1;
            continue;
          }
        } else {
          const m = tok.slice(i + 1).match(/^([0-9]+[+\-]?|[+\-])/);
          if (m) {
            flushLat();
            runs.push(makeRun(m[1], { ...opts, superScript: true, rightToLeft: false }));
            i += 1 + m[1].length;
            continue;
          }
        }
      }
      if (WORD_SUB_MAP[ch]) {
        let j = i;
        let sub = '';
        while (j < tok.length && WORD_SUB_MAP[tok[j]]) {
          sub += WORD_SUB_MAP[tok[j]];
          j++;
        }
        flushLat();
        runs.push(makeRun(sub, { ...opts, subScript: true, rightToLeft: false }));
        i = j;
        continue;
      }
      if (WORD_SUP_MAP[ch]) {
        let j = i;
        let sup = '';
        while (j < tok.length && WORD_SUP_MAP[tok[j]]) {
          sup += WORD_SUP_MAP[tok[j]];
          j++;
        }
        flushLat();
        runs.push(makeRun(sup, { ...opts, superScript: true, rightToLeft: false }));
        i = j;
        continue;
      }
      if (/[0-9]/.test(ch) && i > 0 && /[A-Za-z)\]]/.test(tok[i - 1]) && tok.slice(Math.max(0, i - 2), i) !== 'pH') {
        let j = i;
        while (j < tok.length && /[0-9]/.test(tok[j])) j++;
        flushLat();
        runs.push(makeRun(tok.slice(i, j), { ...opts, subScript: true, rightToLeft: false }));
        i = j;
        continue;
      }
      if ((ch === '+' || ch === '-') && i === tok.length - 1 && /[A-Za-z0-9₀-₉)]/.test(tok[i - 1])) {
        flushLat();
        runs.push(makeRun(ch, { ...opts, superScript: true, rightToLeft: false }));
        i++;
        continue;
      }
      buf += ch;
      i++;
    }
    flushLat();
    lastIdx = chemRegex.lastIndex;
  }

  if (lastIdx < text.length) pushArabic(text.slice(lastIdx));
  return runs.length ? runs : [makeRun(text, opts)];
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

  const children = typeof runs === 'string' ? arRuns(runs, { bold, color, sizeHalfPt }) : runs;

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
    runs.push(...arRuns(opts.boldPrefix + ' ', { bold: true, color: opts.color ?? '0F172A' }));
  }
  runs.push(...arRuns(text, { color: '1E293B' }));
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

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] ?? '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function loadDiagramBytes(
  src: string
): Promise<{ data: Uint8Array; width: number; height: number } | null> {
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const data = new Uint8Array(buf);
    // Read PNG IHDR width/height (bytes 16..23)
    let natW = 1080;
    let natH = 480;
    if (data.length > 24 && data[0] === 0x89 && data[1] === 0x50) {
      const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
      natW = view.getUint32(16, false) || 1080;
      natH = view.getUint32(20, false) || 480;
    }
    const targetW = 510;
    const targetH = Math.round((targetW * natH) / natW);
    return { data, width: targetW, height: targetH };
  } catch {
    return null;
  }
}

export interface BrowserDocxOptions {
  scope: 'all' | 'part1' | 'part2' | number;
  includeAnswers: boolean;
  includeExam: boolean;
  vercelUrl: string;
}

export async function generateBookletDocxBlob(opts: BrowserDocxOptions): Promise<Blob> {
  const { scope, includeAnswers, includeExam, vercelUrl } = opts;
  const normalizedUrl = /^https?:\/\//i.test(vercelUrl.trim())
    ? vercelUrl.trim()
    : `https://${vercelUrl.trim() || 'Science9thsanaa.vercel.app'}`;

  const targetUnits =
    scope === 'all'
      ? CURRICULUM_UNITS
      : scope === 'part1'
        ? CURRICULUM_UNITS.filter((u) => u.part === 1)
        : scope === 'part2'
          ? CURRICULUM_UNITS.filter((u) => u.part === 2)
          : CURRICULUM_UNITS.filter((u) => u.id === scope);

  // Pre-fetch needed PNG diagrams in parallel + generate QR code
  const neededDiagramIds = new Set<string>();
  for (const unit of targetUnits) {
    for (const l of LESSONS_BY_UNIT.get(unit.id) ?? []) {
      const enr = ENRICHED_MAP[l.lessonId];
      if (enr?.diagramId && BOOKLET_DIAGRAMS[enr.diagramId]) neededDiagramIds.add(enr.diagramId);
      for (const extraId of enr?.extraDiagramIds ?? []) {
        if (BOOKLET_DIAGRAMS[extraId]) neededDiagramIds.add(extraId);
      }
    }
  }

  const [qrDataUrl, ...loadedDiagrams] = await Promise.all([
    QRCode.toDataURL(normalizedUrl, {
      width: 240,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
    }),
    ...Array.from(neededDiagramIds).map(async (id) => ({
      id,
      meta: BOOKLET_DIAGRAMS[id],
      img: await loadDiagramBytes(BOOKLET_DIAGRAMS[id].src),
    })),
  ]);

  const diagramMap = new Map(
    loadedDiagrams.filter((x) => x.img !== null).map((x) => [x.id, { img: x.img!, caption: x.meta.caption }])
  );
  const qrBytes = dataUrlToUint8Array(qrDataUrl);

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
              margins: { top: 260, bottom: 260, right: 220, left: 220 },
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
                  spacingAfter: 60,
                }),
                arPara('الملزمة العلمية الشاملة والمفسّرة للكتاب المدرسي', {
                  align: AlignmentType.CENTER,
                  color: 'FFFFFF',
                  bold: true,
                  sizeHalfPt: 40,
                  spacingAfter: 80,
                }),
                arPara(APP_TITLE, {
                  align: AlignmentType.CENTER,
                  color: 'FDE68A',
                  bold: true,
                  sizeHalfPt: 26,
                  spacingAfter: 0,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    spacer(160),
    calloutBox(
      'لماذا هذه الملزمة؟ (تغني عن الكتاب وتعمل كمعلم ومختبر متكامل على الورق)',
      [
        bulletPara('تغطي المنهج اليمني بأسلوب سلس ووافٍ لا يشعر الطالب معه بحاجة إلى معلم لشرح المفاهيم الأساسية.'),
        bulletPara('تبدأ كل درس ببطاقة «تأسيس سريع وخلفية علمية» ترفع مستوى الطلبة الضعفاء وتمهد للفهم.'),
        bulletPara('تضم لوحات رسوم توضيحية مشروحة وخطوات عملية للتجارب لتعويض غياب المختبرات والهواتف.'),
        bulletPara('تشمل القوانين والمعادلات المحلولة، والمصائد الوزارية، وتدريبات الدروس، ونموذج اختبار وزاري.'),
      ],
      { fill: 'F0FDFA', border: '0F766E', titleColor: '0F766E' }
    ),
    spacer(140),
    new Table({
      visuallyRightToLeft: true,
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 73, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: 'F8FAFC', color: 'auto' },
              margins: { top: 140, bottom: 140, right: 160, left: 160 },
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
                  spacingAfter: 70,
                }),
                bulletPara(AUTHOR_NAME, { boldPrefix: 'إعداد وتطوير:' }),
                bulletPara(AUTHOR_PHONE, { boldPrefix: 'رقم التواصل لإبداء الملاحظات أو الدعم:' }),
                bulletPara('هذه الملزمة والتطبيق مجانيان 100% وقفاً للعلم وخدمةً لطلاب اليمن.'),
                arPara(
                  [
                    arRun('•  رابط التطبيق التفاعلي (3D) على فيرسل (Vercel): ', { bold: true, color: '0F766E' }),
                    new ExternalHyperlink({
                      link: normalizedUrl,
                      children: [
                        new TextRun({
                          text: normalizedUrl,
                          style: 'Hyperlink',
                          bold: true,
                          size: 21,
                          color: '0369A1',
                        }),
                      ],
                    }),
                  ],
                  { spacingBefore: 40, spacingAfter: 40 }
                ),
                arPara(
                  'عند توفر هاتف ذكي أو حاسوب، امسح رمز الاستجابة السريع (QR) لمشاهدة التجارب ثلاثية الأبعاد وحل الاختبارات الإلكترونية.',
                  { sizeHalfPt: 19, color: '475569', spacingAfter: 0 }
                ),
              ],
            }),
            new TableCell({
              width: { size: 27, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: 'FFFFFF', color: 'auto' },
              margins: { top: 140, bottom: 140, right: 100, left: 100 },
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
                  spacing: { before: 40, after: 40 },
                  children: [
                    new ImageRun({
                      type: 'png',
                      data: qrBytes,
                      transformation: { width: 115, height: 115 },
                    }),
                  ],
                }),
                arPara('امسح للوصول للتطبيق 3D', {
                  align: AlignmentType.CENTER,
                  bold: true,
                  sizeHalfPt: 18,
                  color: '0F766E',
                  spacingAfter: 0,
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // ==================== الفهرس ====================
  const totalLessonsCount = targetUnits.reduce((acc, u) => acc + u.lessons.length, 0);
  children.push(
    arPara(`فهرس محتويات الملزمة (${targetUnits.length} وحدة / ${totalLessonsCount} درساً)`, {
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      align: AlignmentType.CENTER,
      sizeHalfPt: 30,
      color: '0F766E',
      bold: true,
      spacingAfter: 120,
    })
  );

  const tocRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: ['م', 'الجزء', 'عنوان الوحدة', 'المجال', 'الدروس', 'ص'].map(
        (h) =>
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: '0F766E', color: 'auto' },
            margins: { top: 80, bottom: 80, right: 80, left: 80 },
            children: [arPara(h, { bold: true, color: 'FFFFFF', sizeHalfPt: 20, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })],
          })
      ),
    }),
    ...targetUnits.map((u, idx) => {
      const fill = idx % 2 === 0 ? 'FFFFFF' : 'F8FAFC';
      return new TableRow({
        children: [
          new TableCell({ shading: { type: ShadingType.CLEAR, fill, color: 'auto' }, children: [arPara(String(u.id), { bold: true, align: AlignmentType.CENTER, sizeHalfPt: 19 })] }),
          new TableCell({ shading: { type: ShadingType.CLEAR, fill, color: 'auto' }, children: [arPara(u.part === 1 ? 'الأول' : 'الثاني', { align: AlignmentType.CENTER, sizeHalfPt: 19 })] }),
          new TableCell({ shading: { type: ShadingType.CLEAR, fill, color: 'auto' }, children: [arPara(u.title, { bold: true, sizeHalfPt: 19 })] }),
          new TableCell({ shading: { type: ShadingType.CLEAR, fill, color: 'auto' }, children: [arPara(u.domain, { align: AlignmentType.CENTER, sizeHalfPt: 19 })] }),
          new TableCell({ shading: { type: ShadingType.CLEAR, fill, color: 'auto' }, children: [arPara(u.lessons.map((l) => `${l.lessonNumber}. ${l.title}`).join(' · '), { sizeHalfPt: 18, color: '334155' })] }),
          new TableCell({ shading: { type: ShadingType.CLEAR, fill, color: 'auto' }, children: [arPara(String(u.pageNumber), { align: AlignmentType.CENTER, sizeHalfPt: 19 })] }),
        ],
      });
    }),
  ];

  children.push(
    new Table({
      visuallyRightToLeft: true,
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tocRows,
    })
  );

  // ==================== الوحدات والدروس ====================
  for (const unit of targetUnits) {
    const unitLessons = LESSONS_BY_UNIT.get(unit.id) ?? [];
    const unitQA: { lessonTitle: string; q: PracticeQuestion }[] = [];

    children.push(
      new Paragraph({ bidirectional: true, children: [new PageBreak()] }),
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
                  arPara(
                    `الجزء ${unit.part === 1 ? 'الأول' : 'الثاني'} · المجال: ${unit.domain} · مرجع الكتاب المدرسي: ص ${unit.pageNumber} · عدد الدروس: ${unit.lessons.length}`,
                    { color: 'CCFBF1', sizeHalfPt: 20, spacingBefore: 0, spacingAfter: 0 }
                  ),
                ],
              }),
            ],
          }),
        ],
      }),
      spacer(120)
    );

    for (let lIdx = 0; lIdx < unitLessons.length; lIdx++) {
      const lesson = unitLessons[lIdx];
      const enriched = ENRICHED_MAP[lesson.lessonId];

      children.push(
        arPara(`الدرس ${lIdx + 1}: ${lesson.title} (${lesson.pageRef})`, {
          heading: HeadingLevel.HEADING_2,
          sizeHalfPt: 26,
          bold: true,
          color: '0369A1',
          spacingBefore: 160,
          spacingAfter: 80,
          keepNext: true,
        })
      );

      // أولاً: التأسيس
      const foundItems: Paragraph[] = [
        ...(enriched?.foundation ?? []).map((f) => bulletPara(f, { color: '0284C7' })),
        ...lesson.prerequisites.map((pre) => bulletPara(pre, { color: '0369A1', boldPrefix: 'متطلب سابق:' })),
      ];
      if (foundItems.length) {
        children.push(
          calloutBox('أولاً: تأسيس سريع وخلفية علمية (قبل أن تبدأ الدرس)', foundItems, {
            fill: 'F0F9FF',
            border: '0284C7',
            titleColor: '0369A1',
          }),
          spacer(90)
        );
      }

      // ثانياً: التمهيد
      children.push(
        calloutBox(
          'ثانياً: تمهيد من الواقع وسؤال استكشافي',
          [
            arPara(lesson.step1Discover.scenario, { spacingBefore: 0, spacingAfter: 70 }),
            arPara([arRun('السؤال: ', { bold: true, color: '0F766E' }), ...arRuns(lesson.step1Discover.question, { bold: true })], {
              spacingAfter: 60,
            }),
            arPara(
              [arRun('الجواب والتفسير العلمي: ', { bold: true, color: '15803D' }), ...arRuns(lesson.step1Discover.revealExplanation)],
              { spacingAfter: 0 }
            ),
          ],
          { fill: 'F8FAFC', border: '64748B', titleColor: '334155' }
        ),
        spacer(90)
      );

      // ثالثاً: الشرح التفصيلي
      children.push(
        arPara('ثالثاً: الشرح المفصّل والشامل لمادة الكتاب المدرسي', {
          bold: true,
          sizeHalfPt: 24,
          color: '0F766E',
          spacingBefore: 70,
          spacingAfter: 60,
          keepNext: true,
        })
      );
      if (enriched?.deepExplanation?.length) {
        for (const p of enriched.deepExplanation) {
          children.push(arPara(p, { spacingBefore: 20, spacingAfter: 80 }));
        }
      }

      for (const concept of lesson.step2Understand.concepts) {
        const conceptParas: Paragraph[] = [
          arPara([arRun('نص الكتاب وتفصيله: ', { bold: true, color: '0F172A' }), ...arRuns(concept.textbookContent)], {
            spacingBefore: 0,
            spacingAfter: 65,
          }),
          arPara([arRun('توضيح المعلم المبسط: ', { bold: true, color: '0F766E' }), ...arRuns(concept.extraExplanation)], {
            spacingBefore: 0,
            spacingAfter: 65,
          }),
        ];
        if (concept.chemEquationLatex) {
          conceptParas.push(
            arPara(
              [
                arRun('المعادلة الكيميائية: ', { bold: true, color: '1D4ED8' }),
                ...arRuns(latexToWordText(concept.chemEquationLatex), { bold: true, color: '1E3A8A' }),
              ],
              { spacingAfter: 55 }
            )
          );
        }
        if (concept.formulaLatex) {
          conceptParas.push(
            arPara(
              [
                arRun('القانون الرياضي: ', { bold: true, color: '1D4ED8' }),
                ...arRuns(latexToWordText(concept.formulaLatex), { bold: true, color: '1E3A8A' }),
              ],
              { spacingAfter: 55 }
            )
          );
        }
        if (concept.ministerialNuance) {
          conceptParas.push(
            arPara(
              [
                arRun('تنبيه وزاري هام: ', { bold: true, color: 'B45309' }),
                ...arRuns(concept.ministerialNuance, { bold: true, color: '92400E' }),
              ],
              { spacingAfter: 0 }
            )
          );
        }
        children.push(
          calloutBox(
            `${concept.title}${concept.textbookPage ? ` (${concept.textbookPage})` : ''}`,
            conceptParas,
            { fill: 'FFFFFF', border: '0F766E', titleColor: '0F766E' }
          ),
          spacer(80)
        );
      }

      // الرسوم التوضيحية
      const lessonDiagKeys = [
        ...(enriched?.diagramId ? [enriched.diagramId] : []),
        ...(enriched?.extraDiagramIds ?? []),
      ];
      for (const dKey of lessonDiagKeys) {
        const diag = diagramMap.get(dKey);
        if (diag) {
          children.push(
            new Paragraph({
              bidirectional: true,
              alignment: AlignmentType.CENTER,
              keepNext: true,
              spacing: { before: 100, after: 50 },
              children: [
                new ImageRun({
                  type: 'png',
                  data: diag.img.data,
                  transformation: { width: diag.img.width, height: diag.img.height },
                }),
              ],
            }),
            arPara(diag.caption, {
              align: AlignmentType.CENTER,
              bold: true,
              sizeHalfPt: 19,
              color: '0F766E',
              spacingBefore: 0,
              spacingAfter: 120,
            })
          );
        }
      }

      // رابعاً: مختبر الورق
      if (enriched?.experiment) {
        const exp = enriched.experiment;
        const expParas: Paragraph[] = [
          arPara([arRun('الأدوات المطلوبة: ', { bold: true, color: '0F172A' }), ...arRuns(exp.tools)], { spacingAfter: 55 }),
          arPara('خطوات تنفيذ التجربة:', { bold: true, color: '0F766E', spacingAfter: 35 }),
          ...exp.steps.map((st, idx) => arPara(`${idx + 1}. ${st}`, { spacingBefore: 15, spacingAfter: 35 })),
          arPara([arRun('المشاهدة: ', { bold: true, color: '0369A1' }), ...arRuns(exp.observation)], { spacingAfter: 45 }),
          arPara([arRun('التفسير العلمي: ', { bold: true, color: '7C3AED' }), ...arRuns(exp.scientificExplanation)], { spacingAfter: 45 }),
          arPara([arRun('الاستنتاج النهائي: ', { bold: true, color: '15803D' }), ...arRuns(exp.conclusion, { bold: true })], { spacingAfter: 0 }),
        ];
        children.push(
          calloutBox(`رابعاً: مختبر الورق — ${exp.title}`, expParas, {
            fill: 'F0FDF4',
            border: '16A34A',
            titleColor: '15803D',
          }),
          spacer(85)
        );
      } else if (lesson.step3Experiment?.levels?.length) {
        children.push(
          calloutBox(
            'رابعاً: خلاصة النشاط والاستكشاف العملي للدرس',
            lesson.step3Experiment.levels.map((lv) => bulletPara(`${lv.title}: ${lv.postExplanation}`, { color: '15803D' })),
            { fill: 'F0FDF4', border: '16A34A', titleColor: '15803D' }
          ),
          spacer(85)
        );
      }

      // خامساً: القوانين والأمثلة المحلولة
      const lawParas: Paragraph[] = [
        arPara([arRun('القاعدة الذهبية للدرس: ', { bold: true, color: '0F172A' }), ...arRuns(lesson.step4Conclude.summaryLaw)], {
          spacingAfter: 55,
        }),
      ];
      if (lesson.step4Conclude.lawLatex) {
        lawParas.push(
          arPara(latexToWordText(lesson.step4Conclude.lawLatex), {
            align: AlignmentType.CENTER,
            bold: true,
            sizeHalfPt: 23,
            color: '1E3A8A',
            spacingAfter: 65,
          })
        );
      }
      for (const tk of lesson.step4Conclude.keyTakeaways) {
        lawParas.push(bulletPara(tk, { color: '1D4ED8' }));
      }
      if (enriched?.workedExamples?.length) {
        for (const ex of enriched.workedExamples) {
          lawParas.push(
            arPara(ex.problem, { bold: true, color: '0F172A', spacingBefore: 70, spacingAfter: 45 }),
            ...ex.solutionSteps.map((s) => arPara(`   ${s}`, { color: '1E3A8A', spacingBefore: 15, spacingAfter: 30 }))
          );
        }
      }
      children.push(
        calloutBox('خامساً: القوانين والمعادلات والأمثلة المحلولة بالخطوات', lawParas, {
          fill: 'EFF6FF',
          border: '2563EB',
          titleColor: '1D4ED8',
        }),
        spacer(85)
      );

      // سادساً: المصطلحات والمصائد الوزارية
      const trapParas: Paragraph[] = [];
      if (lesson.step2Understand.glossary.length) {
        trapParas.push(arPara('أهم المصطلحات العلمية للحفظ:', { bold: true, color: '0F172A', spacingAfter: 35 }));
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
        trapParas.push(arPara('احذر هذه المصائد في الاختبار الوزاري:', { bold: true, color: 'B91C1C', spacingBefore: 55, spacingAfter: 35 }));
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
          spacer(85)
        );
      }

      // سابعاً: تدريبات الدرس
      const lessonQs = [...lesson.step5Verify, ...lesson.step6Master];
      if (lessonQs.length) {
        children.push(
          arPara(
            `سابعاً: اختبر فهمك (أسئلة الدرس${includeAnswers ? ' — الإجابات المفسّرة في نهاية الوحدة' : ''})`,
            { bold: true, sizeHalfPt: 23, color: '0F766E', spacingBefore: 55, spacingAfter: 55, keepNext: true }
          )
        );
        lessonQs.forEach((q, qIdx) => {
          unitQA.push({ lessonTitle: lesson.title, q });
          const qType = q.type === 'tf' ? '[صح / خطأ]' : '[اختيار من متعدد]';
          children.push(
            arPara(`${qIdx + 1}. ${qType} ${q.prompt}`, { bold: true, spacingBefore: 35, spacingAfter: 25 }),
            arPara(
              q.type === 'tf'
                ? '    (   ) صح       (   ) خطأ'
                : '    ' + q.options.map((op, oi) => `${['أ', 'ب', 'ج', 'د'][oi]}) ${op}`).join('    |    '),
              { sizeHalfPt: 20, color: '334155', spacingBefore: 0, spacingAfter: 55 }
            )
          );
        });
      }
    }

    if (includeAnswers && unitQA.length) {
      children.push(
        calloutBox(
          `ملحق إجابات تدريبات الوحدة ${unit.id} (مع التفسير العلمي)`,
          unitQA.map(({ lessonTitle, q }, idx) =>
            arPara(
              [
                arRun(`س${idx + 1} (${lessonTitle}): `, { bold: true, color: '0F172A', sizeHalfPt: 20 }),
                ...arRuns(`الإجابة: (${q.options[q.correctIndex]}) — `, { bold: true, color: '15803D', sizeHalfPt: 20 }),
                ...arRuns(q.explanation, { color: '334155', sizeHalfPt: 19 }),
              ],
              { spacingBefore: 20, spacingAfter: 45 }
            )
          ),
          { fill: 'F8FAFC', border: '0F766E', titleColor: '0F766E' }
        ),
        spacer(130)
      );
    }
  }

  // ==================== الملحق الختامي: الاختبار الوزاري ====================
  if (includeExam) {
    const unitArg =
      scope === 'all'
        ? undefined
        : scope === 'part1'
          ? [1, 2, 3, 4, 5, 6, 7, 8]
          : scope === 'part2'
            ? [9, 10, 11, 12, 13, 14, 15, 16]
            : scope;
    const mockExam = buildMinisterialMockExam(unitArg);

    children.push(
      arPara(`الملحق الختامي: محاكي الاختبار الوزاري المطبوع (${mockExam.questions.length} فقرة = ${mockExam.maxScore} درجة)`, {
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        align: AlignmentType.CENTER,
        sizeHalfPt: 30,
        color: '0F766E',
        bold: true,
        spacingAfter: 75,
      }),
      arPara(
        'نموذج تدريبي مطابق لنظام الورقة الوزارية (صح/خطأ بدرجة واحدة لكل فقرة، واختيار من متعدد بدرجتين لكل فقرة).',
        { align: AlignmentType.CENTER, color: '475569', sizeHalfPt: 21, spacingAfter: 120 }
      )
    );

    mockExam.questions.forEach((q, idx) => {
      const num = idx + 1;
      const marks = q.type === 'tf' ? 'درجة واحدة' : 'درجتان';
      if (idx === 0) {
        children.push(
          arPara('القسم الأول (صح / خطأ): ضع علامة (✓) أمام العبارة الصحيحة وعلامة (✗) أمام الخاطئة:', {
            bold: true,
            color: '0369A1',
            sizeHalfPt: 23,
            spacingAfter: 70,
          })
        );
      } else if (idx === mockExam.tfCount) {
        children.push(
          arPara('القسم الثاني (اختيار من متعدد): اختر الإجابة الصحيحة من البدائل المعطاة:', {
            bold: true,
            color: '0369A1',
            sizeHalfPt: 23,
            spacingBefore: 120,
            spacingAfter: 70,
          })
        );
      }
      children.push(
        arPara(`${num}. (${marks} — الوحدة ${q.unitId}): ${q.prompt}`, { bold: true, spacingBefore: 35, spacingAfter: 25 }),
        arPara(
          q.type === 'tf'
            ? '    (   ) صح       (   ) خطأ'
            : '    ' + q.options.map((op, oi) => `${['أ', 'ب', 'ج', 'د'][oi]}) ${op}`).join('    |    '),
          { sizeHalfPt: 20, color: '334155', spacingBefore: 0, spacingAfter: 50 }
        )
      );
    });

    if (mockExam.questions.length === 50) {
      children.push(
        arPara('ورقة التظليل الإرشادية (درّب نفسك على التظليل الصحيح)', {
          heading: HeadingLevel.HEADING_2,
          pageBreakBefore: true,
          align: AlignmentType.CENTER,
          sizeHalfPt: 26,
          bold: true,
          color: '0F766E',
          spacingAfter: 90,
        })
      );

      const bubbleRows: TableRow[] = [
        new TableRow({
          tableHeader: true,
          children: ['رقم السؤال', 'التظليل', 'رقم السؤال', 'التظليل'].map(
            (h) =>
              new TableCell({
                shading: { type: ShadingType.CLEAR, fill: '0F766E', color: 'auto' },
                margins: { top: 55, bottom: 55, right: 55, left: 55 },
                children: [arPara(h, { bold: true, color: 'FFFFFF', sizeHalfPt: 19, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })],
              })
          ),
        }),
        ...Array.from({ length: 25 }, (_, i) => {
          const leftNum = i + 1;
          const rightNum = i + 26;
          const fmt = (n: number) => (n <= 20 ? '○ صح   ○ خطأ' : '○ أ   ○ ب   ○ ج   ○ د');
          return new TableRow({
            children: [
              new TableCell({ children: [arPara(String(leftNum), { bold: true, sizeHalfPt: 18, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })] }),
              new TableCell({ children: [arPara(fmt(leftNum), { sizeHalfPt: 18, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })] }),
              new TableCell({ children: [arPara(String(rightNum), { bold: true, sizeHalfPt: 18, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })] }),
              new TableCell({ children: [arPara(fmt(rightNum), { sizeHalfPt: 18, align: AlignmentType.CENTER, spacingBefore: 0, spacingAfter: 0 })] }),
            ],
          });
        }),
      ];

      children.push(
        new Table({
          visuallyRightToLeft: true,
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: bubbleRows,
        })
      );
    }

    if (includeAnswers) {
      children.push(
        spacer(140),
        arPara('نموذج الإجابة المفسّر للاختبار الوزاري', {
          heading: HeadingLevel.HEADING_2,
          pageBreakBefore: true,
          align: AlignmentType.CENTER,
          sizeHalfPt: 26,
          bold: true,
          color: '15803D',
          spacingAfter: 90,
        }),
        ...mockExam.questions.map((q, idx) =>
          arPara(
            [
              arRun(`س${idx + 1} (الوحدة ${q.unitId}): `, { bold: true, color: '0F172A', sizeHalfPt: 19 }),
              ...arRuns(`${q.options[q.correctIndex]} — `, { bold: true, color: '15803D', sizeHalfPt: 19 }),
              ...arRuns(q.explanation, { color: '334155', sizeHalfPt: 19 }),
            ],
            { spacingBefore: 20, spacingAfter: 45 }
          )
        )
      );
    }
  }

  children.push(
    spacer(160),
    calloutBox(
      'خاتمة وتواصل — مع أطيب التمنيات بالتفوق والنجاح',
      [
        arPara(`إعداد وتطوير: ${AUTHOR_NAME} · للتواصل وإبداء الملاحظات أو الدعم: ${AUTHOR_PHONE}`, { bold: true, color: '0F766E' }),
        arPara(`رابط التطبيق التفاعلي ثلاثي الأبعاد على Vercel: ${normalizedUrl}`, { bold: true, color: '0369A1', spacingAfter: 0 }),
      ],
      { fill: 'F0FDFA', border: '0F766E', titleColor: '0F766E' }
    )
  );

  const doc = new Document({
    creator: AUTHOR_NAME,
    title: `الملزمة العلمية الشاملة - ${APP_TITLE}`,
    description: 'ملزمة تعليمية شاملة ومفسّرة لمنهج العلوم للصف التاسع الأساسي اليمني.',
    sections: [
      {
        properties: {
          titlePage: true,
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1134, bottom: 1134, right: 1020, left: 1020 },
          },
        },
        headers: {
          default: new Header({
            children: [
              arPara(`المختبر التفاعلي والكتاب الذكي (علوم الصف التاسع — المنهج اليمني)  |  إعداد: ${AUTHOR_NAME}`, {
                align: AlignmentType.CENTER,
                sizeHalfPt: 17,
                color: '64748B',
                spacingBefore: 0,
                spacingAfter: 40,
              }),
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
                  arRun(`ملزمة مجانية · تواصل: ${AUTHOR_PHONE} · التطبيق: ${normalizedUrl}  —  صفحة `, {
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

  const rawBlob = await Packer.toBlob(doc);
  return new Blob([rawBlob], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}
