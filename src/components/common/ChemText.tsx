import React, { useMemo } from 'react';
import katex from 'katex';

interface MathBlockProps {
  latex: string;
  display?: boolean;
  className?: string;
}

export const MathBlock: React.FC<MathBlockProps> = ({ latex, display = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return latex;
    }
  }, [latex, display]);

  return (
    <span
      dir="ltr"
      className={`${display ? 'katex-display my-2' : 'katex-ltr'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const SUB_DIGITS: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
};

const SUP_CHARS: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁺': '+', '⁻': '-',
};

function toAsciiSub(s: string): string {
  return [...s].map((c) => SUB_DIGITS[c] ?? c).join('');
}

function toAsciiSup(s: string): string {
  return [...s].map((c) => SUP_CHARS[c] ?? c).join('');
}

/**
 * يحوّل الصيغ الكيميائية والمعادلات والأيونات والوحدات (مثل H2O, Ca3(PO4)2, H₂SO₄, PO4^3-, H+, OH-, m^2)
 * إلى عناصر React بحيث تكون الأرقام الذرية/السفلية أصغر وأسفل قليلاً من الرمز الكيميائي،
 * والشحنات والأسس أصغر وأعلى قليلاً.
 */
function renderFormattedChemToken(rawToken: string): React.ReactNode[] {
  const token = rawToken
    .replace(/<=>/g, '⇌')
    .replace(/-->|->|⟶/g, '→');

  const nodes: React.ReactNode[] = [];
  let buf = '';
  let keyCounter = 0;

  const flushBuf = () => {
    if (buf) {
      nodes.push(<React.Fragment key={`t-${keyCounter++}`}>{buf}</React.Fragment>);
      buf = '';
    }
  };

  let i = 0;
  while (i < token.length) {
    const ch = token[i];

    // 1. أسس صريحة مثل ^2+ أو ^{3-} أو ^2
    if (ch === '^') {
      if (token[i + 1] === '{') {
        const close = token.indexOf('}', i + 2);
        if (close !== -1) {
          flushBuf();
          const content = toAsciiSup(token.slice(i + 2, close));
          nodes.push(
            <sup key={`sup-${keyCounter++}`} className="text-[0.68em] align-[0.38em] leading-none font-bold">
              {content}
            </sup>
          );
          i = close + 1;
          continue;
        }
      } else {
        const m = token.slice(i + 1).match(/^([0-9]+[+\-]?|[+\-])/);
        if (m) {
          flushBuf();
          nodes.push(
            <sup key={`sup-${keyCounter++}`} className="text-[0.68em] align-[0.38em] leading-none font-bold">
              {m[1]}
            </sup>
          );
          i += 1 + m[1].length;
          continue;
        }
      }
    }

    // 2. أرقام سفلية صريحة بـ Unicode (₀-₉)
    if (SUB_DIGITS[ch]) {
      let j = i;
      let sub = '';
      while (j < token.length && SUB_DIGITS[token[j]]) {
        sub += SUB_DIGITS[token[j]];
        j++;
      }
      flushBuf();
      nodes.push(
        <sub key={`sub-${keyCounter++}`} className="text-[0.72em] align-[-0.24em] leading-none font-bold">
          {sub}
        </sub>
      );
      i = j;
      continue;
    }

    // 3. أسس/شحنات صريحة بـ Unicode (⁰-⁹⁺⁻)
    if (SUP_CHARS[ch]) {
      let j = i;
      let sup = '';
      while (j < token.length && SUP_CHARS[token[j]]) {
        sup += SUP_CHARS[token[j]];
        j++;
      }
      flushBuf();
      nodes.push(
        <sup key={`sup-${keyCounter++}`} className="text-[0.68em] align-[0.38em] leading-none font-bold">
          {sup}
        </sup>
      );
      i = j;
      continue;
    }

    // 4. أرقام ASCII بعد رمز عنصر كيميائي أو قوس مغلق (مثل H2O, Ca3(PO4)2)
    // بشرط ألا تكون معاملات في بداية الصيغة (مثل 2HCl أو 3H2O)
    if (/[0-9]/.test(ch)) {
      const prev = i > 0 ? token[i - 1] : '';
      if (/[A-Za-z)\]]/.test(prev) && prev !== 'p' && !(prev === 'H' && token.slice(Math.max(0, i - 2), i) === 'pH')) {
        let j = i;
        while (j < token.length && /[0-9]/.test(token[j])) {
          j++;
        }
        const digits = token.slice(i, j);
        // لا نحول رقم الشحنة المتبوع مباشرة بـ + أو - بدون رقم قبله مثل Fe3+ إلى رقم سفلي
        const nextChar = token[j] ?? '';
        const prevTwo = token.slice(Math.max(0, i - 2), i);
        const looksLikeIonCharge =
          (nextChar === '+' || nextChar === '-') &&
          ['1', '2', '3', '4'].includes(digits) &&
          /[A-Za-z]/.test(prev) &&
          !['O', 'H', 'Cl', 'Br', 'F', 'I', 'N'].includes(prev) &&
          prevTwo !== 'NH' &&
          prevTwo !== 'PO' &&
          prevTwo !== 'SO' &&
          prevTwo !== 'CO' &&
          prevTwo !== 'NO';

        flushBuf();
        if (looksLikeIonCharge) {
          nodes.push(
            <sup key={`sup-${keyCounter++}`} className="text-[0.68em] align-[0.38em] leading-none font-bold">
              {digits + nextChar}
            </sup>
          );
          i = j + 1;
        } else {
          nodes.push(
            <sub key={`sub-${keyCounter++}`} className="text-[0.72em] align-[-0.24em] leading-none font-bold">
              {digits}
            </sub>
          );
          i = j;
        }
        continue;
      }
    }

    // 5. شحنة أيون نهائية ملتصقة مثل H+ أو OH- أو Cl- أو NH4+
    if ((ch === '+' || ch === '-') && i > 0) {
      const prev = token[i - 1];
      const next = token[i + 1] ?? '';
      const isAttachedLeft = /[A-Za-z0-9₀-₉)\]]/.test(prev);
      const isEndOrPunct = next === '' || /[\s),.;:،؛↑↓→⇌]/.test(next);
      if (isAttachedLeft && isEndOrPunct) {
        flushBuf();
        nodes.push(
          <sup key={`sup-${keyCounter++}`} className="text-[0.68em] align-[0.38em] leading-none font-bold">
            {ch}
          </sup>
        );
        i++;
        continue;
      }
    }

    buf += ch;
    i++;
  }

  flushBuf();
  return nodes;
}

// يعزل الصيغ الكيميائية والمعادلات والأيونات والوحدات داخل النصوص العربية مع دعم المعاملات المتقدمة والأرقام السفلية Unicode
const CHEM_SPECIES =
  '(?:\\d*(?=[A-Z]))?[A-Z][A-Za-z0-9₀-₉⁰-⁹⁺⁻()^]*(?:\\^[\\{\\}0-9+\\-]+|[+-](?![A-Za-z0-9]))?[↑↓]?';
const LATIN_TOKEN_REGEX = new RegExp(
  `(${CHEM_SPECIES}(?:\\s*(?:\\+|-->|->|⟶|<=>|⇌)\\s*${CHEM_SPECIES})*|\\bpH\\b|\\bmbar\\b|\\bcmHg\\b|\\bPa\\b|\\bm\\^[23]\\b|\\bcm\\^[23]\\b)`,
  'g'
);

// يعالج الأسس في الوحدات العربية مثل م² و سم² وم³ حتى خارج المقاطع اللاتينية
function renderArabicWithUnitPowers(text: string, keyPrefix: string): React.ReactNode {
  if (!/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻₀₁₂₃₄₅₆₇₈₉]/.test(text)) {
    return text;
  }
  const parts: React.ReactNode[] = [];
  let idx = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (SUP_CHARS[ch]) {
      parts.push(
        <sup key={`${keyPrefix}-s-${idx++}`} className="text-[0.68em] align-[0.38em] leading-none font-bold">
          {SUP_CHARS[ch]}
        </sup>
      );
    } else if (SUB_DIGITS[ch]) {
      parts.push(
        <sub key={`${keyPrefix}-b-${idx++}`} className="text-[0.72em] align-[-0.24em] leading-none font-bold">
          {SUB_DIGITS[ch]}
        </sub>
      );
    } else {
      parts.push(<React.Fragment key={`${keyPrefix}-c-${idx++}`}>{ch}</React.Fragment>);
    }
  }
  return parts;
}

export const ChemText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const parts = useMemo(() => {
    const result: Array<{ isLtr: boolean; content: string }> = [];
    let lastIndex = 0;
    const regex = new RegExp(LATIN_TOKEN_REGEX);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push({ isLtr: false, content: text.slice(lastIndex, match.index) });
      }
      result.push({ isLtr: true, content: match[0] });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      result.push({ isLtr: false, content: text.slice(lastIndex) });
    }
    return result;
  }, [text]);

  return (
    <span className={className}>
      {parts.map((part, idx) =>
        part.isLtr ? (
          <span
            key={idx}
            dir="ltr"
            className="inline-block [unicode-bidi:isolate] font-mono-num font-semibold mx-0.5 text-teal-800 dark:text-teal-300"
          >
            {renderFormattedChemToken(part.content)}
          </span>
        ) : (
          <React.Fragment key={idx}>{renderArabicWithUnitPowers(part.content, `ar-${idx}`)}</React.Fragment>
        )
      )}
    </span>
  );
};
