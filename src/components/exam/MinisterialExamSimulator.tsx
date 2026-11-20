import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpLeft,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileCheck2,
  Play,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { buildMinisterialMockExam } from '../../data/ministerialExamBank';
import { PracticeQuestion, SkillTag } from '../../types/curriculum';
import { ExamAttemptRecord } from '../../storage/progressDb';
import { ChemText } from '../common/ChemText';

interface MinisterialExamSimulatorProps {
  onSaveAttempt: (attempt: ExamAttemptRecord, perQuestion: { q: PracticeQuestion; isCorrect: boolean }[]) => void;
  onNavigateToLesson: (unitId: number, lessonId: string) => void;
}

type ExamScope = 'all' | number;

const COMPLETED_EXAM_UNITS: { unitId: number; title: string; summary: string }[] = [
  { unitId: 1, title: 'الوحدة 1: المحاليل وطرق تحضيرها', summary: 'المذاب والمذيب، أنواع المحاليل، التركيز والإشباع، وطرق التحضير.' },
  { unitId: 2, title: 'الوحدة 2: الحموض والقواعد', summary: 'الكواشف الأربعة، الأيونات المهاجرة، مقياس pH، وقوة الحموض والقواعد.' },
  { unitId: 3, title: 'الوحدة 3: تفاعلات الحموض والقواعد في حياتنا', summary: 'التعادل (ملح + ماء)، تفاعل الكربونات، أوراق العثرب، والمطر الحمضي.' },
  { unitId: 4, title: 'الوحدة 4: الإنسان والفضاء الكوني', summary: 'وحدة بناء الكون، مجرة درب التبانة، الصواريخ، والأقمار الصناعية.' },
  { unitId: 5, title: 'الوحدة 5: المغناطيسية والحث الكهرومغناطيسي', summary: 'خطوط الفيض، المغناطيس الكهربائي والهاتف، الدينامو والمحول، والموجات.' },
  { unitId: 6, title: 'الوحدة 6: الإخراج في الكائنات الحية', summary: 'فجوة الأميبا المنقبضة، النتح والإدماع، الكلية والنيفرون، والجلد والعرق.' },
  { unitId: 7, title: 'الوحدة 7: التكاثر في الكائنات الحية', summary: 'أجزاء الزهرة والتلقيح والإخصاب، والتكاثر في الحيوان والإنسان.' },
  { unitId: 8, title: 'الوحدة 8: أمراض الجهازين البولي والتناسلي', summary: 'البلهارسيا، حصى الكلى، السيلان والزهري، والوقاية الصحية.' },
  { unitId: 9, title: 'الوحدة 9: تفاعلات العناصر والمركبات', summary: 'الأكاسيد، صدأ الحديد، الكربون، CO2 ومعادلاته، تقطير النفط، والتلوث.' },
  { unitId: 10, title: 'الوحدة 10: الهالوجينات', summary: 'الفلور والكلور والبروم واليود، تحضير الكلور، وتنقيته بالماء وتجفيفه.' },
  { unitId: 11, title: 'الوحدة 11: خواص الأجسام', summary: 'خواص الصلب، الشد السطحي (2ل)، التماسك والتلاصق، الشعرية، اللزوجة، والانتشار.' },
  { unitId: 12, title: 'الوحدة 12: الضغط والموائع', summary: 'ث.كجم×10، الوقوف بقدم واحدة، ضغط السوائل، البارومتر، تورشللي، وبرنولي.' },
  { unitId: 13, title: 'الوحدة 13: الطاقة الشمسية واستغلالها', summary: 'الإشعاع الشمسي، السخان الشمسي الحراري، والخلايا الكهروضوئية (DC).' },
  { unitId: 14, title: 'الوحدة 14: استثمار موارد البيئة الحية', summary: 'تنمية الثروة النباتية والحيوانية، والصناعات الغذائية والجلدية.' },
  { unitId: 15, title: 'الوحدة 15: رعاية الأمومة والطفولة', summary: 'العناية بالحامل والجنين، مزايا الرضاعة الطبيعية، وتنظيم الأسرة.' },
  { unitId: 16, title: 'الوحدة 16: الوراثة في الكائنات الحية', summary: 'قوانين مندل، زواج الأقارب، الطفرات الوراثية، والأمراض الوراثية.' },
];

export const MinisterialExamSimulator: React.FC<MinisterialExamSimulatorProps> = ({
  onSaveAttempt,
  onNavigateToLesson,
}) => {
  const [scope, setScope] = useState<ExamScope>('all');
  const [started, setStarted] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(3600);

  const examBundle = useMemo(() => {
    const unitFilter = scope === 'all' ? undefined : scope;
    return buildMinisterialMockExam(unitFilter);
  }, [scope]);

  const { questions, tfCount, mcqCount, maxScore, isFull50Mode } = examBundle;

  useEffect(() => {
    if (!started || submitted) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [started, submitted]);

  const startExam = (selectedScope: ExamScope) => {
    setScope(selectedScope);
    setAnswers({});
    setCurrentIdx(0);
    setSubmitted(false);
    setSecondsLeft(selectedScope === 'all' ? 3600 : 1200);
    setStarted(true);
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);

    let tfCorrect = 0;
    let mcqCorrect = 0;
    let score = 0;
    const wrongQuestionIds: string[] = [];
    const perQuestion: { q: PracticeQuestion; isCorrect: boolean }[] = [];

    questions.forEach((q) => {
      const picked = answers[q.id];
      const isCorrect = picked === q.correctIndex;
      perQuestion.push({ q, isCorrect });
      if (isCorrect) {
        if (q.type === 'tf') {
          tfCorrect += 1;
          score += 1;
        } else {
          mcqCorrect += 1;
          score += 2;
        }
      } else {
        wrongQuestionIds.push(q.id);
      }
    });

    const totalBudget = scope === 'all' ? 3600 : 1200;
    const matchedUnit = COMPLETED_EXAM_UNITS.find((u) => u.unitId === scope);
    const attempt: ExamAttemptRecord = {
      id: `exam-${Date.now()}`,
      timestamp: new Date().toISOString(),
      modeLabel:
        scope === 'all'
          ? 'المحاكي الوزاري الشامل (50 فقرة)'
          : matchedUnit
          ? `اختبار ${matchedUnit.title}`
          : `اختبار الوحدة ${scope}`,
      unitId: scope === 'all' ? undefined : scope,
      score,
      maxScore,
      tfCorrect,
      tfTotal: tfCount,
      mcqCorrect,
      mcqTotal: mcqCount,
      durationSeconds: Math.max(1, totalBudget - secondsLeft),
      wrongQuestionIds,
    };

    onSaveAttempt(attempt, perQuestion);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Pre-start screen
  if (!started) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-5 space-y-3">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-lg">
            <ClipboardCheck className="w-5 h-5" />
            <span>محاكي الاختبارات الوزارية الإلكترونية (ورقة التظليل)</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            يحاكي نظام التصحيح الإلكتروني المعتمد في اختبارات الصف التاسع بالجمهورية اليمنية: فقرات صواب وخطأ (درجة واحدة لكل فقرة) + فقرات اختيار من متعدد 4 بدائل (درجتان لكل فقرة) مع ورقة تظليل جانبية وتقرير تشخيصي للمهارات الضعيفة.
          </p>
        </div>

        <div className="rounded-2xl border border-teal-500/40 bg-white/66 dark:bg-slate-900/72 backdrop-blur-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">المحاكي الشامل (50 فقرة = 80 درجة)</div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              20 فقرة صواب/خطأ (20 درجة) + 30 فقرة اختيار من متعدد (60 درجة) بأسئلة وزارية وتدريبات مهارية شاملة.
            </p>
          </div>
          <button
            type="button"
            onClick={() => startExam('all')}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 px-5 py-3 text-xs font-bold text-white cursor-pointer shrink-0"
          >
            <Play className="w-4 h-4" />
            <span>ابدأ المحاكي الشامل (60 دقيقة)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMPLETED_EXAM_UNITS.map((u) => (
            <div
              key={u.unitId}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-4 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white">{u.title}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">{u.summary}</p>
              </div>
              <button
                type="button"
                onClick={() => startExam(u.unitId)}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 py-2.5 text-xs font-bold text-white cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>بدء اختبار الوحدة {u.unitId}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Submitted: Electronic Grading Report + Skill Diagnostics
  if (submitted) {
    let earnedScore = 0;
    const skillMisses: Record<SkillTag, { wrong: number; sampleLesson?: { unitId: number; lessonId: string } }> = {
      'حفظ مصطلح': { wrong: 0 },
      'تفسير ظاهرة': { wrong: 0 },
      'تطبيق قانون وتحويل وحدات': { wrong: 0 },
      'قراءة رسم/معادلة': { wrong: 0 },
      'استنتاج': { wrong: 0 },
    };

    questions.forEach((q) => {
      const ok = answers[q.id] === q.correctIndex;
      if (ok) {
        earnedScore += q.type === 'tf' ? 1 : 2;
      } else {
        skillMisses[q.skill].wrong += 1;
        if (!skillMisses[q.skill].sampleLesson) {
          skillMisses[q.skill].sampleLesson = { unitId: q.unitId, lessonId: q.lessonId };
        }
      }
    });

    const pct = Math.round((earnedScore / maxScore) * 100);
    const weakSkills = (Object.entries(skillMisses) as [SkillTag, { wrong: number; sampleLesson?: { unitId: number; lessonId: string } }][])
      .filter(([, info]) => info.wrong > 0)
      .sort((a, b) => b[1].wrong - a[1].wrong);

    return (
      <div className="space-y-4">
        {/* Report Header */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-base">
              <FileCheck2 className="w-5 h-5" />
              <span>نتيجة التصحيح الإلكتروني التشخيصي</span>
            </div>
            <div className="text-3xl font-extrabold font-mono-num text-slate-900 dark:text-white mt-1">
              {earnedScore} / {maxScore}{' '}
              <span className="text-base font-bold text-teal-600 dark:text-teal-400">({pct}%)</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => startExam(scope)}
              className="flex items-center gap-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 px-3.5 py-2 text-xs font-bold text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة الاختبار</span>
            </button>
            <button
              type="button"
              onClick={() => setStarted(false)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-xs font-bold cursor-pointer"
            >
              تغيير النموذج
            </button>
          </div>
        </div>

        {/* Weak Skills Diagnostic Recommendations */}
        {weakSkills.length > 0 && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-50/75 dark:bg-amber-950/45 backdrop-blur-md p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4" />
              <span>التشخيص المهارى والتوصيات العلاجية</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {weakSkills.map(([skill, info]) => (
                <div
                  key={skill}
                  className="rounded-xl bg-white/75 dark:bg-slate-900/75 border border-amber-200/80 dark:border-amber-900 p-3 flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">مهارة: {skill}</div>
                    <div className="text-rose-600 dark:text-rose-400">عدد الأخطاء: {info.wrong}</div>
                  </div>
                  {info.sampleLesson && (
                    <button
                      type="button"
                      onClick={() => onNavigateToLesson(info.sampleLesson!.unitId, info.sampleLesson!.lessonId)}
                      className="flex items-center gap-1 rounded-md bg-teal-700 hover:bg-teal-800 px-2.5 py-1.5 text-white font-semibold cursor-pointer shrink-0"
                    >
                      <span>راجع الدرس المعالج</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Electronic Grading Table */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-800/80 font-bold text-sm">
            جدول التصحيح الإلكتروني التفصيلي ({questions.length} فقرة)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead className="bg-slate-50/75 dark:bg-slate-950/65 text-slate-500">
                <tr>
                  <th className="p-2.5">ر.س</th>
                  <th className="p-2.5">السؤال والمصدر</th>
                  <th className="p-2.5">إجابتك</th>
                  <th className="p-2.5">الإجابة الصحيحة</th>
                  <th className="p-2.5">الدرجة المستحقة</th>
                  <th className="p-2.5">المهارة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {questions.map((q, i) => {
                  const pickedIdx = answers[q.id];
                  const isOk = pickedIdx === q.correctIndex;
                  const pts = q.type === 'tf' ? 1 : 2;
                  return (
                    <tr key={q.id} className={isOk ? '' : 'bg-rose-50/40 dark:bg-rose-950/20'}>
                      <td className="p-2.5 font-mono-num font-bold">{i + 1}</td>
                      <td className="p-2.5 max-w-md">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          <ChemText text={q.prompt} />
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {q.sourceLabel} — <ChemText text={q.explanation} />
                        </div>
                      </td>
                      <td className="p-2.5">
                        {typeof pickedIdx === 'number' ? (
                          <span className={isOk ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-rose-600 font-bold'}>
                            <ChemText text={q.options[pickedIdx]} />
                          </span>
                        ) : (
                          <span className="text-slate-400">لم تُجب</span>
                        )}
                      </td>
                      <td className="p-2.5 font-bold text-emerald-700 dark:text-emerald-400">
                        <ChemText text={q.options[q.correctIndex]} />
                      </td>
                      <td className="p-2.5 font-mono-num font-bold">
                        {isOk ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {pts} / {pts}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-600">
                            <XCircle className="w-3.5 h-3.5" /> 0 / {pts}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-300">{q.skill}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Active Exam Screen with Side Bubble Sheet
  const activeQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-4">
      {/* Top Exam Status Bar */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
          {isFull50Mode ? 'نموذج 50 فقرة (80 درجة)' : `نموذج الوحدة (${questions.length} فقرة = ${maxScore} درجة)`}
          <span className="text-slate-500 font-normal mx-2">
            | أُجيب عن {answeredCount} من {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono-num text-sm font-bold text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4" />
            <span>{formatTime(secondsLeft)}</span>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-teal-700 hover:bg-teal-800 px-4 py-1.5 text-xs font-bold text-white cursor-pointer"
          >
            تسليم الورقة والتصحيح الإلكتروني
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Question Card (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-teal-700 dark:text-teal-300">
              السؤال {currentIdx + 1} من {questions.length} ({activeQ.type === 'tf' ? 'صواب / خطأ - درجة واحدة' : 'اختيار من متعدد - درجتان'})
            </span>
            <span>{activeQ.sourceLabel}</span>
          </div>

          <div className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
            <ChemText text={activeQ.prompt} />
          </div>

          {activeQ.diagramHint && (
            <div className="rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-600 dark:text-slate-300">
              <ChemText text={activeQ.diagramHint} />
            </div>
          )}

          <div className="space-y-2">
            {activeQ.options.map((opt, oIdx) => {
              const selected = answers[activeQ.id] === oIdx;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [activeQ.id]: oIdx }))}
                  className={`w-full text-right rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors flex items-center gap-3 ${
                    selected
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/50 text-teal-900 dark:text-teal-200 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono-num shrink-0 ${
                      selected ? 'bg-teal-700 border-teal-700 text-white' : 'border-slate-400 text-slate-500'
                    }`}
                  >
                    {oIdx + 1}
                  </span>
                  <ChemText text={opt} />
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              السابق
            </button>
            <button
              type="button"
              disabled={currentIdx === questions.length - 1}
              onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
              className="rounded-lg bg-slate-800 text-white px-4 py-1.5 text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              التالي
            </button>
          </div>
        </div>

        {/* Bubble Sheet Sidebar (ورقة التظليل الإلكتروني) */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-3">
          <div className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
            ورقة التظليل الإلكتروني (Bubble Sheet)
          </div>
          <div className="grid grid-cols-5 gap-1.5 max-h-[380px] overflow-y-auto p-0.5">
            {questions.map((q, idx) => {
              const isAnswered = typeof answers[q.id] === 'number';
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`rounded-md py-1.5 text-xs font-mono-num font-bold border cursor-pointer transition-colors ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : isAnswered
                      ? 'border-teal-600 bg-teal-600 text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>الفقرات 1–{tfCount}: ص/خ (1 درجة)</span>
            <span>البقية: اختيار (2 درجة)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
