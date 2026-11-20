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

// يعزل الصيغ الكيميائية اللاتينية والأرقام المتبوعة بوحدات إنجليزية داخل النصوص العربية حتى لا ينعكس اتجاهها في RTL
const LATIN_TOKEN_REGEX =
  /([A-Z][A-Za-z0-9()^+\-]*[0-9+\-()A-Za-z]*(?:\s*(?:->|<=>)\s*[A-Za-z0-9()^+\-\s]+)?|\bpH\b|\bmbar\b|\bcmHg\b|\bPa\b)/g;

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
            {part.content}
          </span>
        ) : (
          <React.Fragment key={idx}>{part.content}</React.Fragment>
        )
      )}
    </span>
  );
};
