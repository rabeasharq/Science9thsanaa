import React, { useRef, useState } from 'react';
import {
  ArrowUpLeft,
  Award,
  BarChart3,
  BookOpen,
  Download,
  History,
  Upload,
} from 'lucide-react';
import {
  exportProgressJson,
  parseImportedProgressJson,
  StudentProgressState,
} from '../../storage/progressDb';
import { SkillTag } from '../../types/curriculum';

interface ProgressDiagnosticsViewProps {
  progress: StudentProgressState;
  onOpenLesson: (unitId: number, lessonId: string) => void;
  onImportProgress: (imported: StudentProgressState) => void;
}

const SKILL_REMEDIAL_MAP: Record<SkillTag, { unitId: number; lessonId: string; hint: string }> = {
  'حفظ مصطلح': { unitId: 2, lessonId: 'u2-l1', hint: 'راجع بطاقات المصطلحات والكواشف الأربعة' },
  'تفسير ظاهرة': { unitId: 12, lessonId: 'u12-l2', hint: 'استكشف أسباب تغير الضغط والتأين في المعمل 3D' },
  'تطبيق قانون وتحويل وحدات': { unitId: 12, lessonId: 'u12-l1', hint: 'تدرّب على تحويل ث.كجم × 10 = نيوتن وحاسبة الضغط' },
  'قراءة رسم/معادلة': { unitId: 2, lessonId: 'u2-l1', hint: 'فعّل الرؤية الأيونية (X-Ray) لمتابعة اتجاه H+ و OH-' },
  'استنتاج': { unitId: 12, lessonId: 'u12-l3', hint: 'حلّ تحديات المستوى 4 في المختبر (التوقّع قبل التجربة)' },
};

export const ProgressDiagnosticsView: React.FC<ProgressDiagnosticsViewProps> = ({
  progress,
  onOpenLesson,
  onImportProgress,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [backupMsg, setBackupMsg] = useState<string>('');

  const handleExport = () => {
    const json = exportProgressJson(progress);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `science9-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMsg('تم تصدير ملف التقدم (JSON) بنجاح.');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseImportedProgressJson(text);
      onImportProgress(parsed);
      setBackupMsg('تم استيراد بيانات تقدمك بنجاح.');
    } catch {
      setBackupMsg('تعذّر استيراد الملف؛ تأكد أنه نسخة احتياطية صالحة بصيغة JSON.');
    }
    e.target.value = '';
  };

  const skills = Object.entries(progress.skillStats) as [SkillTag, { attempts: number; correct: number }][];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 font-extrabold text-slate-900 dark:text-white text-lg">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span>التحليل التشخيصي للمهارات العلمية الخمس</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          يقيس النظام أداءك في كل مهارة من مهارات الاختبار الوزاري ليدلك على موضع الخلل ويفتح لك الدرس أو التجربة المعالجة مباشرة.
        </p>

        <div className="space-y-3">
          {skills.map(([skillName, stats]) => {
            const pct = stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : null;
            const remedial = SKILL_REMEDIAL_MAP[skillName];
            return (
              <div
                key={skillName}
                className="rounded-xl border border-slate-200/75 dark:border-slate-800/80 bg-white/55 dark:bg-slate-950/55 p-3.5 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{skillName}</div>
                    <div className="text-[11px] text-slate-500">
                      المحاولات: <span className="font-mono-num">{stats.attempts}</span> · الصحيحة:{' '}
                      <span className="font-mono-num">{stats.correct}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono-num text-sm font-extrabold ${
                        pct === null
                          ? 'text-slate-400'
                          : pct >= 75
                          ? 'text-emerald-600'
                          : pct >= 50
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {pct !== null ? `${pct}%` : 'لا توجد بيانات بعد'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenLesson(remedial.unitId, remedial.lessonId)}
                      className="flex items-center gap-1 rounded-xl bg-teal-700 hover:bg-teal-800 px-3 py-1.5 text-[11px] font-bold text-white cursor-pointer"
                    >
                      <span>درس معالج</span>
                      <ArrowUpLeft className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      pct === null
                        ? 'bg-slate-300 dark:bg-slate-700'
                        : pct >= 75
                        ? 'bg-emerald-500'
                        : pct >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${pct ?? 0}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500">{remedial.hint}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam History Log */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white text-base">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-300 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <span>سجل الاختبارات الوزارية السابقة</span>
        </div>

        {progress.examHistory.length === 0 ? (
          <div className="text-xs text-slate-500 py-4 text-center">
            لم تُجرِ أي اختبار محاكي بعد. انتقل إلى "الاختبارات الوزارية" من القائمة لبدء أول اختبار تشخيصي.
          </div>
        ) : (
          <div className="space-y-2">
            {progress.examHistory.map((ex) => {
              const pct = Math.round((ex.score / ex.maxScore) * 100);
              return (
                <div
                  key={ex.id}
                  className="rounded-xl border border-slate-200/75 dark:border-slate-800/80 bg-white/55 dark:bg-slate-950/55 p-3 flex flex-wrap items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{ex.modeLabel}</div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(ex.timestamp).toLocaleDateString('ar-YE')} · ص/خ: {ex.tfCorrect}/{ex.tfTotal} · اختيار: {ex.mcqCorrect}/{ex.mcqTotal}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono-num font-extrabold text-sm text-teal-700 dark:text-teal-300">
                    {ex.score} / {ex.maxScore} ({pct}%)
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* النسخ الاحتياطي لبيانات الطالب */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">حفظ واستعادة بيانات الطالب محلياً</div>
              <div className="text-xs text-slate-500">تصدير نسخة احتياطية بصيغة JSON أو استعادتها لاحقاً</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 px-3.5 py-2 text-xs font-bold text-white cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير التقدم</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>استيراد نسخة</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
        </div>

        {backupMsg && <div className="text-xs font-semibold text-teal-700 dark:text-teal-400">{backupMsg}</div>}
      </div>
    </div>
  );
};
