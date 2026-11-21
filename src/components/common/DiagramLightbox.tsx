import React, { useEffect, useState } from 'react';
import { RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';

export interface ZoomableDiagramItem {
  src: string;
  caption: string;
}

interface DiagramLightboxProps {
  diagram: ZoomableDiagramItem | null;
  onClose: () => void;
}

const ZOOM_PRESETS = [100, 150, 200, 250] as const;

export const DiagramLightbox: React.FC<DiagramLightboxProps> = ({ diagram, onClose }) => {
  const [zoomPct, setZoomPct] = useState<number>(150);

  useEffect(() => {
    if (!diagram) return;
    // Open slightly zoomed in on smaller screens so fine Arabic labels are immediately legible
    const isNarrow = typeof window !== 'undefined' && window.innerWidth < 768;
    setZoomPct(isNarrow ? 160 : 135);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        setZoomPct((z) => Math.min(300, z + 25));
      } else if (e.key === '-') {
        setZoomPct((z) => Math.max(75, z - 25));
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [diagram, onClose]);

  if (!diagram) return null;

  return (
    <div
      className="no-print fixed inset-0 z-50 flex flex-col bg-slate-950/92 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={diagram.caption}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/95 px-3 py-2.5 sm:px-5 text-white">
        <div className="text-xs sm:text-sm font-extrabold text-teal-300 line-clamp-1 max-w-full sm:max-w-[45%]">
          {diagram.caption}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoomPct((z) => Math.max(75, z - 25))}
            aria-label="تصغير الرسمة"
            className="inline-flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-xs font-bold text-slate-100 cursor-pointer transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
            <span>تصغير</span>
          </button>

          <span className="min-w-[3.2rem] text-center font-mono-num text-xs font-extrabold text-amber-300">
            {zoomPct}%
          </span>

          <button
            type="button"
            onClick={() => setZoomPct((z) => Math.min(300, z + 25))}
            aria-label="تكبير الرسمة"
            className="inline-flex items-center gap-1 rounded-lg bg-teal-700 hover:bg-teal-600 px-2.5 py-1.5 text-xs font-bold text-white cursor-pointer transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>تكبير</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 mr-1">
            {ZOOM_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setZoomPct(p)}
                className={`rounded-md px-2 py-1 text-[11px] font-bold font-mono-num cursor-pointer transition-colors ${
                  zoomPct === p
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {p}%
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setZoomPct(100)}
            title="إعادة الحجم الطبيعي"
            className="inline-flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-2 py-1.5 text-xs font-bold text-slate-200 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">إعادة ضبط</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 hover:bg-rose-700 px-3 py-1.5 text-xs font-bold text-white cursor-pointer transition-colors mr-1"
          >
            <X className="w-4 h-4" />
            <span>إغلاق</span>
          </button>
        </div>
      </div>

      {/* Scrollable Pan/Zoom Canvas */}
      <div
        className="flex-1 overflow-auto p-3 sm:p-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="min-h-full flex items-center justify-center">
          <div
            className="rounded-xl bg-white p-2 sm:p-4 shadow-2xl border border-slate-200 shrink-0 transition-[width] duration-150 ease-out"
            style={{
              width: `${zoomPct}%`,
              maxWidth: 'none',
            }}
          >
            <img
              src={diagram.src}
              alt={diagram.caption}
              className="w-full h-auto block rounded-lg select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="border-t border-slate-800 bg-slate-900/95 px-4 py-1.5 text-center text-[11px] text-slate-300">
        مرّر الإصبع أو الماوس لتصفح أجزاء الرسمة وبياناتها بوضوح · اضغط «تكبير» حتى 300% · أو «إغلاق» للعودة
      </div>
    </div>
  );
};
