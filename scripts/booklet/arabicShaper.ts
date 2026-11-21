import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import QRCode from 'qrcode';

const FORMS: Record<string, [string, string, string, string]> = {
  '\u0621': ['\uFE80', '\uFE80', '\uFE80', '\uFE80'], // ء
  '\u0622': ['\uFE81', '\uFE82', '\uFE81', '\uFE82'], // آ
  '\u0623': ['\uFE83', '\uFE84', '\uFE83', '\uFE84'], // أ
  '\u0624': ['\uFE85', '\uFE86', '\uFE85', '\uFE86'], // ؤ
  '\u0625': ['\uFE87', '\uFE88', '\uFE87', '\uFE88'], // إ
  '\u0626': ['\uFE89', '\uFE8A', '\uFE8B', '\uFE8C'], // ئ
  '\u0627': ['\uFE8D', '\uFE8E', '\uFE8D', '\uFE8E'], // ا
  '\u0628': ['\uFE8F', '\uFE90', '\uFE91', '\uFE92'], // ب
  '\u0629': ['\uFE93', '\uFE94', '\uFE93', '\uFE94'], // ة
  '\u062A': ['\uFE95', '\uFE96', '\uFE97', '\uFE98'], // ت
  '\u062B': ['\uFE99', '\uFE9A', '\uFE9B', '\uFE9C'], // ث
  '\u062C': ['\uFE9D', '\uFE9E', '\uFE9F', '\uFEA0'], // ج
  '\u062D': ['\uFEA1', '\uFEA2', '\uFEA3', '\uFEA4'], // ح
  '\u062E': ['\uFEA5', '\uFEA6', '\uFEA7', '\uFEA8'], // خ
  '\u062F': ['\uFEA9', '\uFEAA', '\uFEA9', '\uFEAA'], // د
  '\u0630': ['\uFEAB', '\uFEAC', '\uFEAB', '\uFEAC'], // ذ
  '\u0631': ['\uFEAD', '\uFEAE', '\uFEAD', '\uFEAE'], // ر
  '\u0632': ['\uFEAF', '\uFEB0', '\uFEAF', '\uFEB0'], // ز
  '\u0633': ['\uFEB1', '\uFEB2', '\uFEB3', '\uFEB4'], // س
  '\u0634': ['\uFEB5', '\uFEB6', '\uFEB7', '\uFEB8'], // ش
  '\u0635': ['\uFEB9', '\uFEBA', '\uFEBB', '\uFEBC'], // ص
  '\u0636': ['\uFEBD', '\uFEBE', '\uFEBF', '\uFEC0'], // ض
  '\u0637': ['\uFEC1', '\uFEC2', '\uFEC3', '\uFEC4'], // ط
  '\u0638': ['\uFEC5', '\uFEC6', '\uFEC7', '\uFEC8'], // ظ
  '\u0639': ['\uFEC9', '\uFECA', '\uFECB', '\uFECC'], // ع
  '\u063A': ['\uFECD', '\uFECE', '\uFECF', '\uFED0'], // غ
  '\u0641': ['\uFED1', '\uFED2', '\uFED3', '\uFED4'], // ف
  '\u0642': ['\uFED5', '\uFED6', '\uFED7', '\uFED8'], // ق
  '\u0643': ['\uFED9', '\uFEDA', '\uFEDB', '\uFEDC'], // ك
  '\u0644': ['\uFEDD', '\uFEDE', '\uFEDF', '\uFEE0'], // ل
  '\u0645': ['\uFEE1', '\uFEE2', '\uFEE3', '\uFEE4'], // م
  '\u0646': ['\uFEE5', '\uFEE6', '\uFEE7', '\uFEE8'], // ن
  '\u0647': ['\uFEE9', '\uFEEA', '\uFEEB', '\uFEEC'], // ه
  '\u0648': ['\uFEED', '\uFEEE', '\uFEED', '\uFEEE'], // و
  '\u0649': ['\uFEEF', '\uFEF0', '\uFEEF', '\uFEF0'], // ى
  '\u064A': ['\uFEF1', '\uFEF2', '\uFEF3', '\uFEF4'], // ي
};

const NON_JOIN_NEXT = new Set([
  '\u0621', '\u0622', '\u0623', '\u0624', '\u0625', '\u0627',
  '\u0629', '\u062F', '\u0630', '\u0631', '\u0632', '\u0648', '\u0649',
]);

const LAM_ALEF: Record<string, [string, string]> = {
  '\u0622': ['\uFEF5', '\uFEF6'],
  '\u0623': ['\uFEF7', '\uFEF8'],
  '\u0625': ['\uFEF9', '\uFEFA'],
  '\u0627': ['\uFEFB', '\uFEFC'],
};

const TASHKEEL = /[\u064B-\u065F\u0670]/g;

export function shapeArabicSvg(input: string): string {
  // Remove diacritics and color emojis (which Resvg lacks) so presentation-form shaping stays 100% crisp
  const clean = input
    .replace(TASHKEEL, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u2600-\u26FF\uFE0F]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const hasArabic = /[\u0600-\u06FF]/.test(clean);
  if (!hasArabic) return clean;

  const arr = [...clean];
  const out: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    const c = arr[i];
    if (c === '\u0644' && i + 1 < arr.length && LAM_ALEF[arr[i + 1]]) {
      const prev = i > 0 ? arr[i - 1] : '';
      const jp = !!(FORMS[prev] && !NON_JOIN_NEXT.has(prev));
      out.push(LAM_ALEF[arr[i + 1]][jp ? 1 : 0]);
      i++;
      continue;
    }
    if (!FORMS[c]) {
      out.push(c);
      continue;
    }
    const prev = i > 0 ? arr[i - 1] : '';
    const next = i < arr.length - 1 ? arr[i + 1] : '';
    const jp = !!(FORMS[prev] && !NON_JOIN_NEXT.has(prev));
    const jn = !!(FORMS[next] && !NON_JOIN_NEXT.has(c));
    const idx = jp && jn ? 3 : jp ? 1 : jn ? 2 : 0;
    out.push(FORMS[c][idx]);
  }
  return '\u202B' + out.join('') + '\u202C';
}

export function escXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const SVG_SUB_MAP: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
};

const SVG_SUP_MAP: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '₅': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁺': '+', '⁻': '-',
};

function formatSvgChemTspans(xmlSafe: string): string {
  // 1. Convert Unicode subscripts/superscripts if present
  let out = xmlSafe
    .replace(/[₀-₉]+/g, (m) => {
      const ascii = [...m].map((c) => SVG_SUB_MAP[c] ?? c).join('');
      return `<tspan dy="3.2" font-size="72%">${ascii}</tspan><tspan dy="-3.2">&#x200C;</tspan>`;
    })
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+/g, (m) => {
      const ascii = [...m].map((c) => SVG_SUP_MAP[c] ?? c).join('');
      return `<tspan dy="-3.5" font-size="70%">${ascii}</tspan><tspan dy="3.5">&#x200C;</tspan>`;
    });

  // 2. Format ASCII chemical formulas/ions (e.g., H2O, Ca3(PO4)2, H2SO4, Cl2, H+, Cl-)
  out = out.replace(/(?:\d*(?=[A-Z]))?[A-Z][A-Za-z0-9()]*[+-]?/g, (token) => {
    // Skip normal words without digits or ion charges
    if (!/[0-9]/.test(token) && !/[+-]$/.test(token)) return token;
    // Extract trailing + or - as ion charge BEFORE adding <tspan> tags
    let signSup = '';
    let base = token;
    const signMatch = base.match(/^(.*[A-Za-z0-9)])([+-])$/);
    if (signMatch) {
      base = signMatch[1];
      signSup = `<tspan dy="-3.5" font-size="70%">${signMatch[2]}</tspan><tspan dy="3.5">&#x200C;</tspan>`;
    }
    const formattedBase = base.replace(/([A-Za-z)])([0-9]+)/g, (_, prev, digits) => {
      return `${prev}<tspan dy="3.2" font-size="72%">${digits}</tspan><tspan dy="-3.2">&#x200C;</tspan>`;
    });
    return formattedBase + signSup;
  });

  return out;
}

export function svgTxt(
  x: number,
  y: number,
  text: string,
  opts: {
    size?: number;
    color?: string;
    bold?: boolean;
    anchor?: 'start' | 'middle' | 'end';
    font?: string;
  } = {}
): string {
  const {
    size = 14,
    color = '#0f172a',
    bold = false,
    anchor = 'middle',
    font = 'Noto Sans Arabic, DejaVu Sans',
  } = opts;
  const shaped = formatSvgChemTspans(escXml(shapeArabicSvg(text)));
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${font}" font-size="${size}" font-weight="${bold ? 'bold' : 'normal'}" fill="${color}">${shaped}</text>`;
}

export function svgCanvas(
  width: number,
  height: number,
  title: string,
  body: string,
  subtitle?: string
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <marker id="arr-teal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0f766e"/>
    </marker>
    <marker id="arr-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626"/>
    </marker>
    <marker id="arr-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7"/>
    </marker>
    <marker id="arr-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706"/>
    </marker>
    <marker id="arr-slate" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#334155"/>
    </marker>
    <linearGradient id="grad-water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <linearGradient id="grad-glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7"/>
      <stop offset="50%" stop-color="#e0f2fe" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#bae6fd" stop-opacity="0.5"/>
    </linearGradient>
    <linearGradient id="grad-mercury" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="50%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
    <linearGradient id="grad-kidney" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fca5a5"/>
      <stop offset="100%" stop-color="#dc2626"/>
    </linearGradient>
    <linearGradient id="grad-flame" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#dc2626"/>
      <stop offset="55%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#fde047"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="14" fill="#ffffff" stroke="#0f766e" stroke-width="2.5"/>
  <rect x="2" y="2" width="${width - 4}" height="46" rx="12" fill="#f0fdfa"/>
  <line x1="2" y1="48" x2="${width - 2}" y2="48" stroke="#99f6e4" stroke-width="1.5"/>
  ${svgTxt(width / 2, 31, title, { size: 17, bold: true, color: '#0f766e' })}
  ${body}
  ${
    subtitle
      ? `<rect x="12" y="${height - 34}" width="${width - 24}" height="24" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>` +
        svgTxt(width / 2, height - 17, subtitle, { size: 11.5, color: '#334155', bold: true })
      : ''
  }
</svg>`;
}

/** Draws an RTL numbered step pill badge (e.g. "الخطوة 1: ...") centered at (cx, y) */
export function svgStepBadge(
  cx: number,
  y: number,
  w: number,
  stepLabel: string,
  color = '#0f766e',
  bg = '#f0fdfa'
): string {
  const x = cx - w / 2;
  return `<rect x="${x}" y="${y}" width="${w}" height="24" rx="12" fill="${bg}" stroke="${color}" stroke-width="1.5"/>
  ${svgTxt(cx, y + 16.5, stepLabel, { size: 11.5, bold: true, color })}`;
}

/** Draws a numbered circular pin marker at (cx, cy) */
export function svgPin(cx: number, cy: number, num: string | number, color = '#0f766e', r = 10): string {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" stroke="#ffffff" stroke-width="1.8"/>
  ${svgTxt(cx, cy + 4, String(num), { size: 10.5, bold: true, color: '#ffffff' })}`;
}

/**
 * Draws a scientific textbook callout leader line from exact target (tx, ty) on the illustration
 * to a crisp pill box centered at (bx, by) with optional explicit width bw, numbered pin badge, label, and optional data subtext.
 */
export function svgCallout(
  tx: number,
  ty: number,
  bx: number,
  by: number,
  bwOrNum: number | string,
  numOrLabel: string | number,
  labelOrOpts?: string | { color?: string; bg?: string; sub?: string },
  maybeOpts: { color?: string; bg?: string; sub?: string } = {}
): string {
  let bw: number;
  let num: string | number;
  let label: string;
  let opts: { color?: string; bg?: string; sub?: string };

  if (typeof bwOrNum === 'number') {
    bw = bwOrNum;
    num = numOrLabel;
    label = String(labelOrOpts ?? '');
    opts = maybeOpts;
  } else {
    num = bwOrNum;
    label = String(numOrLabel ?? '');
    opts = (typeof labelOrOpts === 'object' && labelOrOpts !== null ? labelOrOpts : {}) as {
      color?: string;
      bg?: string;
      sub?: string;
    };
    const subLen = opts.sub ? opts.sub.length : 0;
    bw = Math.max(116, Math.min(252, Math.round(Math.max(label.length * 5.6, subLen * 4.8) + 34)));
  }

  const { color = '#0f766e', bg = '#ffffff', sub } = opts;
  const bh = sub ? 35 : 25;
  const clampedBx = Math.max(14 + bw / 2, Math.min(806 - bw / 2, bx));
  const left = clampedBx - bw / 2;
  const top = by - bh / 2;
  const right = clampedBx + bw / 2;
  const attachX = Math.abs(tx - left) < Math.abs(tx - right) ? left : right;
  const elbowX = attachX === left ? left - 8 : right + 8;
  return `<polyline points="${tx},${ty} ${elbowX},${by} ${attachX},${by}" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="3 2"/>
  <circle cx="${tx}" cy="${ty}" r="3.6" fill="${color}" stroke="#ffffff" stroke-width="1.3"/>
  <rect x="${left}" y="${top}" width="${bw}" height="${bh}" rx="7" fill="${bg}" stroke="${color}" stroke-width="1.4"/>
  ${svgPin(right - 12, by, num, color, 8.5)}
  ${svgTxt(clampedBx - 9, sub ? by - 2 : by + 4, label, { size: 10.6, bold: true, color: '#0f172a' })}
  ${sub ? svgTxt(clampedBx - 9, by + 11.5, sub, { size: 9.0, color: '#475569' }) : ''}`;
}

/** Draws an arrow with a crisp marker-end */
export function svgArrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  marker: 'teal' | 'red' | 'blue' | 'amber' | 'slate' = 'teal',
  strokeWidth = 2.2,
  dashed = false
): string {
  const colors = { teal: '#0f766e', red: '#dc2626', blue: '#0284c7', amber: '#d97706', slate: '#334155' };
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colors[marker]}" stroke-width="${strokeWidth}" ${
    dashed ? 'stroke-dasharray="4 3"' : ''
  } marker-end="url(#arr-${marker})"/>`;
}

const NOTO_FONT_PATHS = [
  '/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf',
  '/usr/share/fonts/truetype/noto/NotoSansArabic-Bold.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
].filter((p) => fs.existsSync(p));

export function renderSvgToPng(svg: string, widthPx = 1100): Buffer {
  const useExplicit = NOTO_FONT_PATHS.some((p) => p.includes('NotoSansArabic'));
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: widthPx },
    font: useExplicit
      ? {
          loadSystemFonts: false,
          fontFiles: NOTO_FONT_PATHS,
          defaultFontFamily: 'Noto Sans Arabic',
        }
      : {
          loadSystemFonts: true,
          defaultFontFamily: 'Noto Sans Arabic',
        },
  });
  return resvg.render().asPng();
}

export async function generateQrPng(url: string): Promise<Buffer> {
  return QRCode.toBuffer(url, {
    type: 'png',
    width: 240,
    margin: 1,
    color: { dark: '#0f172a', light: '#ffffff' },
  });
}

const SUB_MAP: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
};

const SUP_MAP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻',
};

function extractBraced(str: string, startIdx: number): { content: string; endIdx: number } | null {
  if (str[startIdx] !== '{') return null;
  let depth = 0;
  for (let i = startIdx; i < str.length; i++) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') {
      depth--;
      if (depth === 0) {
        return { content: str.slice(startIdx + 1, i), endIdx: i };
      }
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

/** Converts LaTeX math/chemistry markup to clean Unicode text suitable for Arabic Word documents */
export function latexToWordText(raw: string): string {
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

  // Subscripts _{...} or _digit or _word
  s = s.replace(/_\{([^{}]+)\}/g, (_, g) =>
    /^[0-9]+$/.test(g) ? [...g].map((c) => SUB_MAP[c] || c).join('') : ` (${g})`
  );
  s = s.replace(/_([0-9])/g, (_, c) => SUB_MAP[c] || c);
  s = s.replace(/_([\u0600-\u06FFa-zA-Z]+)/g, ' ($1)');

  // Superscripts ^{...} or ^char
  s = s.replace(/\^\{([0-9+\-]+)\}/g, (_, g) => [...g].map((c) => SUP_MAP[c] || c).join(''));
  s = s.replace(/\^([0-9+\-])/g, (_, c) => SUP_MAP[c] || c);

  s = s.replace(/[{}]/g, '').replace(/\s{2,}/g, ' ').trim();
  return s;
}

/** Converts inline chemical formulas like H2O, CO2, Ca(OH)2, H+, OH- inside plain Arabic prose */
export function formatChemProse(text: string): string {
  return text
    .replace(/\bH2SO4\b/g, 'H₂SO₄')
    .replace(/\bH3PO4\b/g, 'H₃PO₄')
    .replace(/\bCaCO3\b/g, 'CaCO₃')
    .replace(/\bCa3\(PO4\)2\b/g, 'Ca₃(PO₄)₂')
    .replace(/\bCu\(OH\)2\b/g, 'Cu(OH)₂')
    .replace(/\bCa\(OH\)2\b/g, 'Ca(OH)₂')
    .replace(/\bBa\(OH\)2\b/g, 'Ba(OH)₂')
    .replace(/\bNH4OH\b/g, 'NH₄OH')
    .replace(/\bCaCl2\b/g, 'CaCl₂')
    .replace(/\bMnO2\b/g, 'MnO₂')
    .replace(/\bMnCl2\b/g, 'MnCl₂')
    .replace(/\bH2O\b/g, 'H₂O')
    .replace(/\bCO2\b/g, 'CO₂')
    .replace(/\bSO2\b/g, 'SO₂')
    .replace(/\bNO2\b/g, 'NO₂')
    .replace(/\bCl2\b/g, 'Cl₂')
    .replace(/\bBr2\b/g, 'Br₂')
    .replace(/\bF2\b/g, 'F₂')
    .replace(/\bI2\b/g, 'I₂')
    .replace(/\bO2\b/g, 'O₂')
    .replace(/\bH\+/g, 'H⁺')
    .replace(/\bOH-/g, 'OH⁻')
    .replace(/\bCl-/g, 'Cl⁻');
}
