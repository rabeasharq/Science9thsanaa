import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  AlertTriangle,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  FlaskConical,
  Link2,
  Loader2,
  Printer,
  Share2,
  Sparkles,
  Type,
} from 'lucide-react';
import { CURRICULUM_UNITS } from '../../data/curriculumIndex';
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
import { buildMinisterialMockExam } from '../../data/ministerialExamBank';
import { ENRICHED_PART_1 } from '../../data/booklet/enrichedPart1';
import { ENRICHED_PART_2 } from '../../data/booklet/enrichedPart2';
import { EnrichedLessonBookletData } from '../../data/booklet/enrichedTypes';
import { BOOKLET_DIAGRAMS } from '../../data/booklet/diagramsIndex';
import { DetailedLessonContent, PracticeQuestion } from '../../types/curriculum';
import { ChemText, MathBlock } from '../common/ChemText';
import { generateBookletDocxBlob } from '../../utils/exportBookletDocx';

const DEFAULT_VERCEL_URL = 'https://Science9thsanaa.vercel.app';
const AUTHOR_NAME = 'الأستاذ إبراهيم أحمد متاش';
const AUTHOR_PHONE = '779424090';

const ALL_LESSONS_BY_UNIT = (() => {
  const all: DetailedLessonContent[] = [
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
  const map = new Map<number, DetailedLessonContent[]>();
  for (const l of all) {
    const arr = map.get(l.unitId) ?? [];
    arr.push(l);
    map.set(l.unitId, arr);
  }
  return map;
})();

const ENRICHED_MAP: Record<string, EnrichedLessonBookletData> = {
  ...ENRICHED_PART_1,
  ...ENRICHED_PART_2,
};

type BookletScope = 'all' | 'part1' | 'part2' | number;
type ViewMode = 'reader' | 'full';
type ReaderPage = 'cover' | number | 'exam';
type ReaderFont = 'normal' | 'comfortable' | 'large';

const READER_FONT_CLASS: Record<ReaderFont, string> = {
  normal: 'text-[13px] sm:text-sm',
  comfortable: 'text-sm sm:text-base',
  large: 'text-base sm:text-lg',
};

interface BookletPdfViewProps {
  onOpenLesson?: (unitId: number, lessonId: string) => void;
}

export const BookletPdfView: React.FC<BookletPdfViewProps> = ({ onOpenLesson }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('reader');
  const [readerPage, setReaderPage] = useState<ReaderPage>('cover');
  const [readerFont, setReaderFont] = useState<ReaderFont>('comfortable');
  const [scope, setScope] = useState<BookletScope>('all');
  const [includeAnswers, setIncludeAnswers] = useState<boolean>(true);
  const [includeExam, setIncludeExam] = useState<boolean>(true);
  const [vercelUrl, setVercelUrl] = useState<string>(DEFAULT_VERCEL_URL);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [docxBusy, setDocxBusy] = useState<boolean>(false);
  const [docxError, setDocxError] = useState<string | null>(null);
  const [readyDocx, setReadyDocx] = useState<{
    url: string;
    blob: Blob;
    filename: string;
    sizeKb: number;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (readyDocx?.url) URL.revokeObjectURL(readyDocx.url);
    };
  }, [readyDocx]);

  useEffect(() => {
    const raw = vercelUrl.trim() || DEFAULT_VERCEL_URL;
    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    QRCode.toDataURL(normalized, {
      width: 220,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''));
  }, [vercelUrl]);

  const visibleUnits = useMemo(() => {
    if (viewMode === 'reader') {
      if (typeof readerPage === 'number') {
        return CURRICULUM_UNITS.filter((u) => u.id === readerPage);
      }
      return [];
    }
    if (scope === 'all') return CURRICULUM_UNITS;
    if (scope === 'part1') return CURRICULUM_UNITS.filter((u) => u.part === 1);
    if (scope === 'part2') return CURRICULUM_UNITS.filter((u) => u.part === 2);
    return CURRICULUM_UNITS.filter((u) => u.id === scope);
  }, [viewMode, readerPage, scope]);

  const mockExam = useMemo(() => {
    if (viewMode === 'reader') {
      return buildMinisterialMockExam();
    }
    if (typeof scope === 'number') {
      return buildMinisterialMockExam(scope);
    }
    if (scope === 'part1') {
      return buildMinisterialMockExam([1, 2, 3, 4, 5, 6, 7, 8]);
    }
    if (scope === 'part2') {
      return buildMinisterialMockExam([9, 10, 11, 12, 13, 14, 15, 16]);
    }
    return buildMinisterialMockExam();
  }, [viewMode, scope]);

  const totalLessonsInScope =
    viewMode === 'reader'
      ? CURRICULUM_UNITS.reduce((acc, u) => acc + u.lessons.length, 0)
      : visibleUnits.reduce((acc, u) => acc + u.lessons.length, 0);

  const readerOrder: ReaderPage[] = useMemo(
    () => ['cover', ...CURRICULUM_UNITS.map((u) => u.id), 'exam'],
    []
  );
  const currentReaderIdx = readerOrder.indexOf(readerPage);

  const goToReaderPage = (page: ReaderPage) => {
    setReaderPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToUnit = (unitId: number) => {
    if (viewMode === 'reader') {
      goToReaderPage(unitId);
    } else {
      const el = document.getElementById(`booklet-unit-${unitId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrintCurrentPdf = () => {
    window.print();
  };

  const handlePrintFullBookPdf = () => {
    setViewMode('full');
    setScope('all');
    window.setTimeout(() => {
      window.print();
    }, 220);
  };

  const displayUrl = (() => {
    const raw = vercelUrl.trim() || DEFAULT_VERCEL_URL;
    return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  })();

  const triggerBlobDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadWord = async (targetScope: BookletScope = 'all') => {
    if (docxBusy) return;
    setDocxBusy(true);
    setDocxError(null);
    try {
      const filename =
        targetScope === 'all'
          ? 'ملزمة_علوم_الصف_التاسع_اليمني_كاملة.docx'
          : targetScope === 'part1'
            ? 'ملزمة_علوم_الصف_التاسع_الجزء_الأول.docx'
            : targetScope === 'part2'
              ? 'ملزمة_علوم_الصف_التاسع_الجزء_الثاني.docx'
              : `ملزمة_علوم_التاسع_الوحدة_${targetScope}.docx`;

      let finalBlob: Blob | null = null;

      // عند طلب النسخة الكاملة بالإعدادات الافتراضية، نجرب أولاً الملف الجاهز إذا كان سليماً (PK header)
      const isDefaultFull =
        targetScope === 'all' &&
        includeAnswers &&
        includeExam &&
        displayUrl.toLowerCase() === DEFAULT_VERCEL_URL.toLowerCase();

      if (isDefaultFull) {
        try {
          const res = await fetch('/malzama-science9-yemen.docx', { cache: 'no-store' });
          if (res.ok) {
            const buf = await res.arrayBuffer();
            const head = new Uint8Array(buf, 0, Math.min(4, buf.byteLength));
            // التأكد أن الملف هو ZIP/DOCX حقيقي وليس صفحة HTML
            if (buf.byteLength > 100_000 && head[0] === 0x50 && head[1] === 0x4b) {
              finalBlob = new Blob([buf], {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              });
            }
          }
        } catch {
          // سننتقل لتوليد الملف مباشرة داخل المتصفح
        }
      }

      if (!finalBlob) {
        finalBlob = await generateBookletDocxBlob({
          scope: targetScope,
          includeAnswers,
          includeExam,
          vercelUrl: displayUrl,
        });
      }

      if (readyDocx?.url) URL.revokeObjectURL(readyDocx.url);
      const blobUrl = URL.createObjectURL(finalBlob);
      const sizeKb = Math.round(finalBlob.size / 1024);
      setReadyDocx({ url: blobUrl, blob: finalBlob, filename, sizeKb });
      triggerBlobDownload(blobUrl, filename);
    } catch {
      setDocxError('تعذّر تجهيز ملف الوورد؛ يمكنك استخدام زر «حفظ كملف PDF» أو المحاولة مرة أخرى.');
    } finally {
      setDocxBusy(false);
    }
  };

  const handleShareWord = async () => {
    if (!readyDocx) return;
    try {
      const file = new File([readyDocx.blob], readyDocx.filename, {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'ملزمة علوم الصف التاسع - المنهج اليمني',
        });
      }
    } catch {
      // المستخدم ألغى المشاركة
    }
  };

  const showCoverAndToc = viewMode === 'full' || readerPage === 'cover';
  const showExamSection =
    (viewMode === 'full' && includeExam) || (viewMode === 'reader' && readerPage === 'exam');

  return (
    <div className="space-y-6">
      {/* شريط التحكم بالملزمة (يختفي تماماً عند الطباعة أو الحفظ PDF) */}
      <div className="no-print rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md p-5 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                الملزمة العلمية الشاملة والمفسّرة (نسخة الطباعة PDF و Word)
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                ملزمة متكاملة تغني عن الكتاب المدرسي وتعمل كمعلم ومختبر ورقي (16 وحدة / 53 درساً + {Object.keys(BOOKLET_DIAGRAMS).length} لوحة رسوم ملوّنة بالخطوات والبيانات + اختبار وزاري).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrintCurrentPdf}
              className="flex items-center gap-2 rounded-xl bg-teal-700 hover:bg-teal-800 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{viewMode === 'reader' ? 'طباعة / حفظ هذه الصفحة PDF' : 'حفظ كملف PDF / طباعة A4'}</span>
            </button>

            {viewMode === 'reader' && (
              <button
                type="button"
                onClick={handlePrintFullBookPdf}
                className="flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>حفظ كامل الملزمة PDF</span>
              </button>
            )}

            <button
              type="button"
              disabled={docxBusy}
              onClick={() => handleDownloadWord('all')}
              className="flex items-center gap-2 rounded-xl border border-teal-600/40 bg-teal-50/90 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/70 px-4 py-2.5 text-xs sm:text-sm font-bold text-teal-800 dark:text-teal-200 transition-colors cursor-pointer disabled:opacity-60"
            >
              {docxBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{docxBusy ? 'جاري تجهيز ملف Word...' : 'تحميل الملزمة كاملة (Word .docx)'}</span>
            </button>
          </div>
        </div>

        {docxError && (
          <div className="rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-800">
            {docxError}
          </div>
        )}

        {readyDocx && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/50 dark:border-emerald-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-emerald-900 dark:text-emerald-200">
              ✓ تم تجهيز ملف الوورد الكامل بنجاح ({readyDocx.sizeKb} كيلوبايت) — إذا لم يبدأ التنزيل تلقائياً اضغط «حفظ الملف»:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={readyDocx.url}
                download={readyDocx.filename}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>حفظ الملف (.docx)</span>
              </a>
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleShareWord}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/50 bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-200 px-3 py-1.5 font-bold hover:bg-emerald-100 cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>مشاركة / حفظ بالهاتف</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* تبديل وضع القراءة داخل التطبيق vs العرض الكامل للطباعة */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
          <div className="inline-flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('reader')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                viewMode === 'reader'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700'
              }`}
            >
              قراءة داخل التطبيق (وحدة بوحدة)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('full')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                viewMode === 'full'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700'
              }`}
            >
              العرض الشامل للطباعة PDF
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span>حجم نص الملزمة:</span>
            </span>
            {(
              [
                { id: 'normal', label: 'قياسي' },
                { id: 'comfortable', label: 'مريح' },
                { id: 'large', label: 'كبير' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setReaderFont(f.id)}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                  readerFont === f.id
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* خيارات القراءة السريعة أو نطاق الطباعة */}
        {viewMode === 'reader' ? (
          <div className="space-y-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                تصفح فصول الملزمة مباشرة:
              </span>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAnswers}
                  onChange={(e) => setIncludeAnswers(e.target.checked)}
                  className="accent-teal-700 w-4 h-4 rounded"
                />
                <span>إظهار ملحق الإجابات المفسّرة</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => goToReaderPage('cover')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  readerPage === 'cover'
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-700'
                }`}
              >
                الغلاف والفهرس
              </button>
              {CURRICULUM_UNITS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => goToReaderPage(u.id)}
                  title={`الوحدة ${u.id}: ${u.title}`}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    readerPage === u.id
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-700'
                  }`}
                >
                  وحدة {u.id}
                </button>
              ))}
              <button
                type="button"
                onClick={() => goToReaderPage('exam')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  readerPage === 'exam'
                    ? 'bg-indigo-700 text-white'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 hover:bg-indigo-100'
                }`}
              >
                الاختبار الوزاري (50 فقرة)
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                نطاق الملزمة للطباعة / PDF:
              </label>
              <select
                value={String(scope)}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === 'all' || v === 'part1' || v === 'part2') setScope(v);
                  else setScope(Number(v));
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:border-teal-600 focus:outline-none"
              >
                <option value="all">كامل المنهج (الجزأين 1 و 2 — 16 وحدة / 53 درساً)</option>
                <option value="part1">الجزء الأول فقط (الوحدات 1 – 8)</option>
                <option value="part2">الجزء الثاني فقط (الوحدات 9 – 16)</option>
                {CURRICULUM_UNITS.map((u) => (
                  <option key={u.id} value={String(u.id)}>
                    الوحدة {u.id} فقط: {u.title} ({u.lessons.length} دروس)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                <Link2 className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                <span>رابط التطبيق على Vercel (يتحدّث رمز QR تلقائياً):</span>
              </label>
              <input
                type="url"
                dir="ltr"
                value={vercelUrl}
                onChange={(e) => setVercelUrl(e.target.value)}
                placeholder={DEFAULT_VERCEL_URL}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono-num text-slate-800 dark:text-slate-100 focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAnswers}
                  onChange={(e) => setIncludeAnswers(e.target.checked)}
                  className="accent-teal-700 w-4 h-4 rounded"
                />
                <span>تضمين ملحق الإجابات المفسّرة نهاية كل وحدة</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeExam}
                  onChange={(e) => setIncludeExam(e.target.checked)}
                  className="accent-teal-700 w-4 h-4 rounded"
                />
                <span>تضمين ملحق الاختبار الوزاري وورقة التظليل</span>
              </label>
            </div>
          </div>
        )}

        <div className="rounded-xl bg-amber-50/85 dark:bg-amber-950/45 border border-amber-200/80 dark:border-amber-800/60 px-3.5 py-2 text-[11px] sm:text-xs text-amber-950 dark:text-amber-200 flex items-center justify-between gap-2 flex-wrap">
          <span>
            💡 <strong>للحفظ كملف PDF احترافي:</strong> اضغط زر الطباعة/الحفظ ثم اختر الوجهة <strong>«حفظ بتنسيق PDF / Save as PDF»</strong> بحجم ورق A4.
          </span>
          <span className="font-bold">
            {viewMode === 'reader'
              ? readerPage === 'cover'
                ? 'الغلاف والفهرس التفاعلي (انقر على أي وحدة للفتح)'
                : readerPage === 'exam'
                  ? 'ملحق الاختبار الوزاري الشامل (50 فقرة)'
                  : `الوحدة ${readerPage} من 16`
              : `المعروض حالياً: ${visibleUnits.length} وحدة · ${totalLessonsInScope} درساً`}
          </span>
        </div>
      </div>

      {/* ورقة الملزمة المنسقة للطباعة A4 (تُطبع بخلفية بيضاء نقية دائماً) */}
      <article className={`booklet-sheet rounded-2xl border border-slate-200/80 bg-white text-slate-900 p-5 sm:p-10 shadow-sm space-y-8 ${READER_FONT_CLASS[readerFont]}`}>
        {/* 1. صفحة الغلاف */}
        {showCoverAndToc && (
        <section className="space-y-6">
          <div className="rounded-2xl bg-teal-700 text-white p-6 sm:p-8 text-center space-y-2.5">
            <div className="text-xs sm:text-sm font-bold text-teal-100">
              الجمهورية اليمنية — الصف التاسع الأساسي (الجزآن الأول والثاني)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-snug">
              الملزمة العلمية الشاملة والمفسّرة للكتاب المدرسي
            </h1>
            <div className="text-sm sm:text-base font-bold text-amber-200">
              المختبر التفاعلي والكتاب الذكي - علوم الصف التاسع (المنهج اليمني)
            </div>
          </div>

          <div className="rounded-xl border-r-4 border-teal-700 border border-teal-200 bg-teal-50/70 p-5 space-y-2">
            <h3 className="text-sm sm:text-base font-extrabold text-teal-900">
              لماذا هذه الملزمة؟ (تغني عن الكتاب وتعمل كمعلم ومختبر متكامل على الورق)
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed list-disc list-inside">
              <li>تغطي كامل المنهج اليمني بجزأيه الأول والثاني بأسلوب سلس ووافٍ لا يحتاج إلى معلم.</li>
              <li>تبدأ كل درس ببطاقة «تأسيس سريع وخلفية علمية» لمعالجة الضعف التراكمي وبناء الأساس العلمي.</li>
              <li>تضم {Object.keys(BOOKLET_DIAGRAMS).length} لوحة رسوم توضيحية ملوّنة ومرتّبة كخطوات رسم بجميع البيانات والأجزاء لتعويض غياب المختبرات والهواتف.</li>
              <li>تشمل القوانين والمسائل المحلولة خطوة بخطوة، والمصائد الوزارية، واختباراً وزارياً كاملاً مع الإجابات.</li>
            </ul>
          </div>

          {/* بطاقة المؤلف + رابط فيرسل + رمز QR */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch rounded-xl border border-slate-300 bg-slate-50/80 p-5">
            <div className="sm:col-span-9 space-y-2 text-xs sm:text-sm">
              <div className="text-sm sm:text-base font-extrabold text-teal-800">
                بيانات الإعداد والتطوير والتطبيق الرقمي المرافق
              </div>
              <div>
                <strong>إعداد وتطوير:</strong> {AUTHOR_NAME}
              </div>
              <div>
                <strong>رقم التواصل للدعم وإبداء الملاحظات:</strong>{' '}
                <span className="font-mono-num font-bold text-teal-800" dir="ltr">
                  {AUTHOR_PHONE}
                </span>
              </div>
              <div>
                <strong>الترخيص:</strong> هذه الملزمة والتطبيق مجانيان 100% وقفاً للعلم وخدمةً لطلاب اليمن.
              </div>
              <div className="pt-1">
                <strong>رابط التطبيق التفاعلي (3D) على فيرسل (Vercel):</strong>{' '}
                <a
                  href={displayUrl}
                  target="_blank"
                  rel="noreferrer"
                  dir="ltr"
                  className="font-mono-num font-bold text-sky-700 underline break-all"
                >
                  {displayUrl}
                </a>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                عند توفر هاتف ذكي أو حاسوب، امسح رمز الاستجابة السريع (QR) أو افتح الرابط أعلاه لمشاهدة التجارب ثلاثية الأبعاد وحل الاختبارات الإلكترونية.
              </p>
            </div>

            <div className="sm:col-span-3 flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="QR Code رابط التطبيق"
                  className="w-28 h-28 object-contain"
                />
              )}
              <span className="text-[11px] font-bold text-teal-800 mt-1 text-center">
                امسح للوصول للتطبيق 3D
              </span>
            </div>
          </div>
        </section>
        )}

        {/* 2. الفهرس */}
        {showCoverAndToc && (
        <section className="print-page-break space-y-4">
          <h2 className="text-xl font-extrabold text-teal-800 text-center border-b-2 border-teal-700 pb-2">
            فهرس محتويات الملزمة ({viewMode === 'reader' ? CURRICULUM_UNITS.length : visibleUnits.length} وحدة / {totalLessonsInScope} درساً)
          </h2>
          <p className="no-print text-xs text-slate-500 text-center">
            انقر على أي وحدة في الفهرس لفتحها مباشرة وقراءتها:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-teal-700 text-white">
                  <th className="border border-teal-800 px-2.5 py-2 text-center">م</th>
                  <th className="border border-teal-800 px-2.5 py-2 text-center">الجزء</th>
                  <th className="border border-teal-800 px-3 py-2 text-right">عنوان الوحدة</th>
                  <th className="border border-teal-800 px-2.5 py-2 text-center">المجال</th>
                  <th className="border border-teal-800 px-3 py-2 text-right">الدروس</th>
                  <th className="border border-teal-800 px-2.5 py-2 text-center">ص</th>
                </tr>
              </thead>
              <tbody>
                {(viewMode === 'reader' ? CURRICULUM_UNITS : visibleUnits).map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => handleJumpToUnit(u.id)}
                    className="odd:bg-white even:bg-slate-50 hover:bg-teal-50/80 cursor-pointer transition-colors"
                  >
                    <td className="border border-slate-300 px-2 py-2 text-center font-bold">{u.id}</td>
                    <td className="border border-slate-300 px-2 py-2 text-center">
                      {u.part === 1 ? 'الأول' : 'الثاني'}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 font-bold text-teal-800 underline decoration-teal-300">
                      {u.title}
                    </td>
                    <td className="border border-slate-300 px-2 py-2 text-center">{u.domain}</td>
                    <td className="border border-slate-300 px-3 py-2 text-slate-700 leading-relaxed">
                      {u.lessons.map((l) => `${l.lessonNumber}. ${l.title}`).join(' · ')}
                    </td>
                    <td className="border border-slate-300 px-2 py-2 text-center font-mono-num">
                      {u.pageNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        )}

        {/* 3. الوحدات والدروس */}
        {visibleUnits.map((unit) => {
          const unitLessons = ALL_LESSONS_BY_UNIT.get(unit.id) ?? [];
          const unitQA: { lessonTitle: string; q: PracticeQuestion }[] = [];

          return (
            <section key={unit.id} id={`booklet-unit-${unit.id}`} className="print-page-break space-y-6 scroll-mt-20">
              {/* ترويسة الوحدة */}
              <div className="rounded-xl bg-teal-700 text-white px-5 py-4 space-y-1">
                <h2 className="text-xl font-extrabold">
                  الوحدة {unit.id}: {unit.title}
                </h2>
                <div className="text-xs text-teal-100">
                  الجزء {unit.part === 1 ? 'الأول' : 'الثاني'} · المجال: {unit.domain} · مرجع الكتاب: ص {unit.pageNumber} · عدد الدروس: {unit.lessons.length}
                </div>
              </div>

              {unitLessons.map((lesson, idx) => {
                const enriched = ENRICHED_MAP[lesson.lessonId];
                const diagramMeta =
                  enriched?.diagramId && BOOKLET_DIAGRAMS[enriched.diagramId]
                    ? BOOKLET_DIAGRAMS[enriched.diagramId]
                    : undefined;
                const lessonQs = [...lesson.step5Verify, ...lesson.step6Master];
                lessonQs.forEach((q) => unitQA.push({ lessonTitle: lesson.title, q }));

                return (
                  <div key={lesson.lessonId} className="space-y-4 border-b border-slate-200 pb-6 last:border-b-0">
                    {/* عنوان الدرس */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-r-4 border-sky-700 bg-sky-50/70 px-4 py-2.5 rounded-l-xl">
                      <h3 className="text-base sm:text-lg font-extrabold text-sky-900">
                        الدرس {idx + 1}: {lesson.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-sky-800">{lesson.pageRef}</span>
                        {onOpenLesson && (
                          <button
                            type="button"
                            onClick={() => onOpenLesson(unit.id, lesson.lessonId)}
                            className="no-print inline-flex items-center gap-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>فتح الدرس والمختبر 3D</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* أولاً: التأسيس والخلفية العلمية */}
                    <div className="print-avoid-break rounded-xl border border-sky-300 border-r-4 border-r-sky-600 bg-sky-50/60 p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-sm font-extrabold text-sky-900">
                        <Sparkles className="w-4 h-4 text-sky-700 shrink-0" />
                        <span>أولاً: تأسيس سريع وخلفية علمية (قبل أن تبدأ الدرس)</span>
                      </div>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {enriched?.foundation.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-sky-700 font-bold">•</span>
                            <span><ChemText text={f} /></span>
                          </li>
                        ))}
                        {lesson.prerequisites.map((pre, i) => (
                          <li key={`pre-${i}`} className="flex items-start gap-2 text-slate-700">
                            <span className="text-sky-600 font-bold">◦</span>
                            <span><ChemText text={pre} /></span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* ثانياً: تمهيد من الواقع وسؤال استكشافي */}
                    <div className="print-avoid-break rounded-xl border border-slate-300 border-r-4 border-r-slate-600 bg-slate-50/80 p-4 space-y-2 text-xs sm:text-sm">
                      <div className="font-extrabold text-slate-800">ثانياً: تمهيد من الواقع وسؤال استكشافي</div>
                      <p className="text-slate-700 leading-relaxed">
                        <ChemText text={lesson.step1Discover.scenario} />
                      </p>
                      <p className="font-bold text-teal-900">
                        السؤال: <ChemText text={lesson.step1Discover.question} />
                      </p>
                      <p className="text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 leading-relaxed">
                        <strong>الجواب والتفسير: </strong>
                        <ChemText text={lesson.step1Discover.revealExplanation} />
                      </p>
                    </div>

                    {/* ثالثاً: الشرح التفصيلي الوافي للكتاب المدرسي */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-sm font-extrabold text-teal-800">
                        <BookOpen className="w-4 h-4 shrink-0" />
                        <span>ثالثاً: الشرح المفصّل والشامل لمادة الكتاب المدرسي</span>
                      </div>

                      {enriched?.deepExplanation.map((para, i) => (
                        <p key={i} className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                          <ChemText text={para} />
                        </p>
                      ))}

                      {lesson.step2Understand.concepts.map((c) => (
                        <div
                          key={c.id}
                          className="print-avoid-break rounded-xl border border-teal-200 border-r-4 border-r-teal-700 bg-white p-4 space-y-2 text-xs sm:text-sm"
                        >
                          <div className="font-extrabold text-teal-900">
                            {c.title} {c.textbookPage ? `(${c.textbookPage})` : ''}
                          </div>
                          <p className="text-slate-800 leading-relaxed">
                            <strong>نص الكتاب وتفصيله: </strong>
                            <ChemText text={c.textbookContent} />
                          </p>
                          <p className="text-slate-700 leading-relaxed">
                            <strong className="text-teal-800">توضيح المعلم: </strong>
                            <ChemText text={c.extraExplanation} />
                          </p>
                          {c.chemEquationLatex && (
                            <div className="rounded-lg bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 text-center overflow-x-auto">
                              <MathBlock latex={c.chemEquationLatex} display />
                            </div>
                          )}
                          {c.formulaLatex && (
                            <div className="rounded-lg bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 text-center overflow-x-auto">
                              <MathBlock latex={c.formulaLatex} display />
                            </div>
                          )}
                          {c.ministerialNuance && (
                            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-amber-950 font-semibold leading-relaxed">
                              <strong>تنبيه وزاري هام: </strong>
                              <ChemText text={c.ministerialNuance} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* الرسم التوضيحي المطبوع */}
                    {diagramMeta && (
                      <figure className="print-avoid-break rounded-xl border border-slate-200 bg-white p-3 text-center space-y-2">
                        <img
                          src={diagramMeta.src}
                          alt={diagramMeta.caption}
                          className="mx-auto max-w-full w-[640px] h-auto rounded-lg"
                        />
                        <figcaption className="text-xs font-bold text-teal-800">
                          {diagramMeta.caption}
                        </figcaption>
                      </figure>
                    )}

                    {/* رابعاً: مختبر الورق (التجربة العملية بالخطوات) */}
                    {enriched?.experiment ? (
                      <div className="print-avoid-break rounded-xl border border-emerald-300 border-r-4 border-r-emerald-600 bg-emerald-50/55 p-4 space-y-2 text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5 font-extrabold text-emerald-900">
                          <FlaskConical className="w-4 h-4 shrink-0" />
                          <span>رابعاً: مختبر الورق — {enriched.experiment.title}</span>
                        </div>
                        <p className="text-slate-800">
                          <strong>الأدوات المطلوبة: </strong>
                          <ChemText text={enriched.experiment.tools} />
                        </p>
                        <div>
                          <strong className="text-emerald-900">خطوات تنفيذ التجربة:</strong>
                          <ol className="list-decimal list-inside space-y-1 mt-1 text-slate-800">
                            {enriched.experiment.steps.map((st, si) => (
                              <li key={si}><ChemText text={st} /></li>
                            ))}
                          </ol>
                        </div>
                        <p className="text-sky-900">
                          <strong>المشاهدة: </strong>
                          <ChemText text={enriched.experiment.observation} />
                        </p>
                        <p className="text-purple-900">
                          <strong>التفسير العلمي: </strong>
                          <ChemText text={enriched.experiment.scientificExplanation} />
                        </p>
                        <p className="text-emerald-950 font-bold">
                          <strong>الاستنتاج النهائي: </strong>
                          <ChemText text={enriched.experiment.conclusion} />
                        </p>
                      </div>
                    ) : (
                      lesson.step3Experiment?.levels?.length > 0 && (
                        <div className="print-avoid-break rounded-xl border border-emerald-300 border-r-4 border-r-emerald-600 bg-emerald-50/55 p-4 space-y-1.5 text-xs sm:text-sm">
                          <div className="flex items-center gap-1.5 font-extrabold text-emerald-900">
                            <FlaskConical className="w-4 h-4 shrink-0" />
                            <span>رابعاً: خلاصة النشاط والاستكشاف العملي للدرس</span>
                          </div>
                          <ul className="space-y-1 text-slate-800">
                            {lesson.step3Experiment.levels.map((lv) => (
                              <li key={lv.level}>
                                <strong>{lv.title}: </strong>
                                <ChemText text={lv.postExplanation} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}

                    {/* خامساً: القوانين والمعادلات والأمثلة المحلولة */}
                    <div className="print-avoid-break rounded-xl border border-indigo-200 border-r-4 border-r-indigo-600 bg-indigo-50/55 p-4 space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 font-extrabold text-indigo-900">
                        <Calculator className="w-4 h-4 shrink-0" />
                        <span>خامساً: القوانين والمعادلات والأمثلة المحلولة بالخطوات</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">
                        <strong>القاعدة الذهبية: </strong>
                        <ChemText text={lesson.step4Conclude.summaryLaw} />
                      </p>
                      {lesson.step4Conclude.lawLatex && (
                        <div className="rounded-lg bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 text-center overflow-x-auto">
                          <MathBlock latex={lesson.step4Conclude.lawLatex} display />
                        </div>
                      )}
                      <ul className="space-y-1 text-slate-800">
                        {lesson.step4Conclude.keyTakeaways.map((tk, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-indigo-700 font-bold">•</span>
                            <span><ChemText text={tk} /></span>
                          </li>
                        ))}
                      </ul>
                      {enriched?.workedExamples?.map((ex, ei) => (
                        <div key={ei} className="rounded-lg bg-white border border-indigo-200 p-3 space-y-1">
                          <div className="font-bold text-slate-900">
                            <ChemText text={ex.problem} />
                          </div>
                          {ex.solutionSteps.map((s, si) => (
                            <div key={si} className="text-indigo-900">
                              <ChemText text={s} />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* سادساً: المصطلحات والمصائد الوزارية */}
                    {(lesson.step2Understand.glossary.length > 0 || lesson.step7Review.commonTraps.length > 0) && (
                      <div className="print-avoid-break rounded-xl border border-amber-300 border-r-4 border-r-amber-600 bg-amber-50/60 p-4 space-y-2 text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5 font-extrabold text-amber-900">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>سادساً: المصطلحات العلمية والمصائد الوزارية</span>
                        </div>
                        {lesson.step2Understand.glossary.map((g, gi) => (
                          <p key={gi} className="text-slate-800">
                            <strong>{g.term}: </strong>
                            <ChemText text={g.definition} /> {g.pageRef ? `(${g.pageRef})` : ''}
                          </p>
                        ))}
                        {lesson.step7Review.commonTraps.length > 0 && (
                          <div className="pt-1 space-y-1 border-t border-amber-200">
                            <div className="font-bold text-rose-800">احذر هذه المصائد في الاختبار الوزاري:</div>
                            {lesson.step7Review.commonTraps.map((tr, ti) => (
                              <p key={ti} className="text-rose-900">
                                • <ChemText text={tr} />
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* سابعاً: أسئلة الدرس */}
                    {lessonQs.length > 0 && (
                      <div className="print-avoid-break space-y-2 text-xs sm:text-sm">
                        <div className="font-extrabold text-teal-800">
                          سابعاً: اختبر فهمك (تدريبات الدرس{includeAnswers ? ' — الإجابات في نهاية الوحدة' : ''})
                        </div>
                        {lessonQs.map((q, qi) => (
                          <div key={q.id} className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 space-y-1">
                            <div className="font-bold text-slate-900">
                              {qi + 1}. {q.type === 'tf' ? '[صح / خطأ]' : '[اختيار]'}{' '}
                              <ChemText text={q.prompt} />
                            </div>
                            <div className="text-slate-700">
                              {q.type === 'tf'
                                ? '(   ) صح       (   ) خطأ'
                                : q.options.map((op, oi) => (
                                    <span key={oi} className="ml-4 inline-block">
                                      {['أ', 'ب', 'ج', 'د'][oi]}) <ChemText text={op} />
                                    </span>
                                  ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ملحق إجابات الوحدة */}
              {includeAnswers && unitQA.length > 0 && (
                <div className="print-avoid-break rounded-xl border border-emerald-300 bg-emerald-50/50 p-4 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 font-extrabold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>ملحق إجابات تدريبات الوحدة {unit.id} (مع التفسير العلمي)</span>
                  </div>
                  <div className="space-y-1.5">
                    {unitQA.map(({ lessonTitle, q }, idx) => (
                      <p key={`${q.id}-${idx}`} className="text-slate-800 leading-relaxed">
                        <strong>س{idx + 1} ({lessonTitle}): </strong>
                        <span className="font-bold text-emerald-800">
                          الإجابة: (<ChemText text={q.options[q.correctIndex]} />) —{' '}
                        </span>
                        <ChemText text={q.explanation} />
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}

        {/* 4. الملحق الختامي: الاختبار الوزاري الشامل + ورقة التظليل + نموذج الإجابة */}
        {showExamSection && (
          <section className="print-page-break space-y-5">
            <div className="text-center space-y-1 border-b-2 border-teal-700 pb-3">
              <h2 className="text-xl font-extrabold text-teal-800">
                الملحق الختامي: محاكي الاختبار الوزاري المطبوع ({mockExam.questions.length} فقرة = {mockExam.maxScore} درجة)
              </h2>
              <p className="text-xs text-slate-600">
                نموذج مطابق للورقة الوزارية (الفقرات 1–20: صح/خطأ بدرجة واحدة لكل فقرة · الفقرات 21–50: اختيار من متعدد بدرجتين لكل فقرة).
              </p>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              {mockExam.questions.map((q, idx) => (
                <div key={q.id} className="print-avoid-break space-y-1 border-b border-slate-100 pb-2">
                  {idx === 0 && (
                    <div className="font-extrabold text-sky-900 pb-1">
                      القسم الأول (صح / خطأ): ضع علامة (✓) أو (✗) أمام كل عبارة:
                    </div>
                  )}
                  {idx === mockExam.tfCount && (
                    <div className="font-extrabold text-sky-900 pt-2 pb-1">
                      القسم الثاني (اختيار من متعدد): اختر الإجابة الصحيحة من البدائل المعطاة:
                    </div>
                  )}
                  <div className="font-bold text-slate-900">
                    {idx + 1}. (الوحدة {q.unitId}) <ChemText text={q.prompt} />
                  </div>
                  <div className="text-slate-700">
                    {q.type === 'tf'
                      ? '(   ) صح       (   ) خطأ'
                      : q.options.map((op, oi) => (
                          <span key={oi} className="ml-4 inline-block">
                            {['أ', 'ب', 'ج', 'د'][oi]}) <ChemText text={op} />
                          </span>
                        ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ورقة التظليل */}
            {mockExam.questions.length === 50 && (
              <div className="print-page-break space-y-3">
                <h3 className="text-lg font-extrabold text-teal-800 text-center">
                  ورقة التظليل الإرشادية (درّب نفسك على التظليل الصحيح)
                </h3>
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-teal-700 text-white">
                      <th className="border border-teal-800 px-2 py-1.5">السؤال</th>
                      <th className="border border-teal-800 px-2 py-1.5">التظليل</th>
                      <th className="border border-teal-800 px-2 py-1.5">السؤال</th>
                      <th className="border border-teal-800 px-2 py-1.5">التظليل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 25 }, (_, i) => {
                      const left = i + 1;
                      const right = i + 26;
                      return (
                        <tr key={i} className="odd:bg-white even:bg-slate-50">
                          <td className="border border-slate-300 px-2 py-1 text-center font-bold">{left}</td>
                          <td className="border border-slate-300 px-2 py-1 text-center">
                            {left <= 20 ? '○ صح   ○ خطأ' : '○ أ   ○ ب   ○ ج   ○ د'}
                          </td>
                          <td className="border border-slate-300 px-2 py-1 text-center font-bold">{right}</td>
                          <td className="border border-slate-300 px-2 py-1 text-center">
                            ○ أ   ○ ب   ○ ج   ○ د
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* نموذج الإجابة المفسر */}
            {includeAnswers && (
              <div className="print-page-break space-y-2.5 text-xs sm:text-sm">
                <h3 className="text-lg font-extrabold text-emerald-800 text-center border-b border-emerald-600 pb-2">
                  نموذج الإجابة المفسّر للاختبار الوزاري
                </h3>
                {mockExam.questions.map((q, idx) => (
                  <p key={`ans-${q.id}`} className="text-slate-800 leading-relaxed">
                    <strong>س{idx + 1} (الوحدة {q.unitId}): </strong>
                    <span className="font-bold text-emerald-800">
                      <ChemText text={q.options[q.correctIndex]} /> —{' '}
                    </span>
                    <ChemText text={q.explanation} />
                  </p>
                ))}
              </div>
            )}
          </section>
        )}

        {/* تذييل ختامي للنسخة المطبوعة */}
        <footer className="print-avoid-break rounded-xl border border-teal-300 bg-teal-50/70 p-4 text-center space-y-1 text-xs">
          <div className="font-extrabold text-teal-900">
            إعداد وتطوير: {AUTHOR_NAME} · للتواصل وإبداء الملاحظات أو الدعم: {AUTHOR_PHONE}
          </div>
          <div className="text-sky-800 font-semibold" dir="ltr">
            {displayUrl}
          </div>
        </footer>
      </article>

      {/* شريط التنقل السفلي في وضع القراءة داخل التطبيق */}
      {viewMode === 'reader' && (
        <div className="no-print flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4">
          <button
            type="button"
            disabled={currentReaderIdx <= 0}
            onClick={() => currentReaderIdx > 0 && goToReaderPage(readerOrder[currentReaderIdx - 1])}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 text-center">
            {readerPage === 'cover'
              ? 'الغلاف والفهرس'
              : readerPage === 'exam'
                ? 'الاختبار الوزاري الشامل'
                : `الوحدة ${readerPage} من 16`}
          </span>

          <button
            type="button"
            disabled={currentReaderIdx >= readerOrder.length - 1}
            onClick={() =>
              currentReaderIdx < readerOrder.length - 1 && goToReaderPage(readerOrder[currentReaderIdx + 1])
            }
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 text-xs sm:text-sm font-bold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
