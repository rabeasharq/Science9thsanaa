import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Compass,
  FlaskConical,
  HelpCircle,
  Image as ImageIcon,
  Lightbulb,
  Sparkles,
  Target,
  XCircle,
  ZoomIn,
} from 'lucide-react';
import { DetailedLessonContent, PracticeQuestion } from '../../types/curriculum';
import { ChemText, MathBlock } from '../common/ChemText';
import { DiagramLightbox, ZoomableDiagramItem } from '../common/DiagramLightbox';
import { AcidsBasesLab3D } from '../../labs/AcidsBasesLab3D';
import { PressureLab3D } from '../../labs/PressureLab3D';
import { MagnetismDynamoLab3D } from '../../labs/MagnetismDynamoLab3D';
import { CapillarySurfaceLab3D } from '../../labs/CapillarySurfaceLab3D';
import { OilDistillationCO2Lab3D } from '../../labs/OilDistillationCO2Lab3D';
import { AnatomyKidneyFlowerLab3D } from '../../labs/AnatomyKidneyFlowerLab3D';
import { FormulaCalculators } from './FormulaCalculators';
import { Lesson2DSimulations } from './Lesson2DSimulations';
import { BOOKLET_DIAGRAMS } from '../../data/booklet/diagramsIndex';
import { ENRICHED_PART_1 } from '../../data/booklet/enrichedPart1';
import { ENRICHED_PART_2 } from '../../data/booklet/enrichedPart2';

const ALL_ENRICHED_LESSONS = { ...ENRICHED_PART_1, ...ENRICHED_PART_2 };

interface LessonWorkspaceProps {
  lesson: DetailedLessonContent;
  highestStep: number;
  isCompleted: boolean;
  onStepProgress: (lessonId: string, step: number, markComplete?: boolean) => void;
  onRecordQuestionAnswer: (q: PracticeQuestion, isCorrect: boolean) => void;
  onLabLevelInteract: (labId: string, level: number) => void;
  onBackToUnits: () => void;
}

const STEPS = [
  { num: 1, title: '1. اكتشف', icon: Compass },
  { num: 2, title: '2. افهم', icon: BookOpen },
  { num: 3, title: '3. جرّب (المعمل التفاعلي)', icon: FlaskConical },
  { num: 4, title: '4. استنتج والحسابات', icon: Calculator },
  { num: 5, title: '5. تحقق', icon: HelpCircle },
  { num: 6, title: '6. أتقن (وزاري)', icon: Target },
  { num: 7, title: '7. راجع', icon: Sparkles },
];

export const LessonWorkspace: React.FC<LessonWorkspaceProps> = ({
  lesson,
  highestStep,
  isCompleted,
  onStepProgress,
  onRecordQuestionAnswer,
  onLabLevelInteract,
  onBackToUnits,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [discoverSelection, setDiscoverSelection] = useState<number | null>(null);
  const [predictSelection, setPredictSelection] = useState<Record<number, number>>({});
  const [questionSelections, setQuestionSelections] = useState<Record<string, number>>({});
  const [zoomedDiagram, setZoomedDiagram] = useState<ZoomableDiagramItem | null>(null);

  const lessonDiagrams = (() => {
    const enriched = ALL_ENRICHED_LESSONS[lesson.lessonId];
    const ids: string[] = [];
    if (enriched?.diagramId) ids.push(enriched.diagramId);
    else if (BOOKLET_DIAGRAMS[lesson.lessonId]) ids.push(lesson.lessonId);
    if (enriched?.extraDiagramIds?.length) {
      for (const extraId of enriched.extraDiagramIds) {
        if (!ids.includes(extraId)) ids.push(extraId);
      }
    }
    return ids.map((id) => BOOKLET_DIAGRAMS[id]).filter(Boolean);
  })();

  const goToStep = (stepNum: number) => {
    setActiveStep(stepNum);
    onStepProgress(lesson.lessonId, Math.max(highestStep, stepNum), stepNum === 7);
  };

  const handleAnswerQuestion = (q: PracticeQuestion, choiceIndex: number) => {
    setQuestionSelections((prev) => ({ ...prev, [q.id]: choiceIndex }));
    onRecordQuestionAnswer(q, choiceIndex === q.correctIndex);
  };

  const renderQuestionCard = (q: PracticeQuestion) => {
    const picked = questionSelections[q.id];
    const hasPicked = typeof picked === 'number';
    const isCorrect = picked === q.correctIndex;

    return (
      <div
        key={q.id}
        className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-teal-700 dark:text-teal-300">{q.sourceLabel}</span>
          <span className="text-slate-500 dark:text-slate-400">المهارة: {q.skill}</span>
        </div>

        <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
          <ChemText text={q.prompt} />
        </div>

        {q.diagramHint && (
          <div className="rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
            وصف الرسم الوزاري: <ChemText text={q.diagramHint} />
          </div>
        )}

        <div className={`grid gap-2 ${q.type === 'tf' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {q.options.map((opt, idx) => {
            const isSelected = picked === idx;
            const showCorrect = hasPicked && idx === q.correctIndex;
            const showWrong = hasPicked && isSelected && !isCorrect;

            let btnStyle =
              'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';
            if (showCorrect) {
              btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold';
            } else if (showWrong) {
              btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleAnswerQuestion(q, idx)}
                className={`rounded-lg border px-3 py-2.5 text-xs sm:text-sm text-right transition-colors cursor-pointer flex items-center justify-between gap-2 ${btnStyle}`}
              >
                <ChemText text={opt} />
                {showCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {showWrong && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {hasPicked && (
          <div
            className={`rounded-lg p-3 text-xs leading-relaxed border ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-100'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-100'
            }`}
          >
            <div className="font-bold mb-1">{isCorrect ? 'إجابة صحيحة!' : 'راجع التفسير العلمي:'}</div>
            <ChemText text={q.explanation} />
            {q.ministerialNuance && (
              <div className="mt-1.5 pt-1.5 border-t border-amber-300/40 font-semibold">
                <ChemText text={q.ministerialNuance} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const initialPressureMode =
    lesson.lessonId === 'u12-l2' ? 'liquid' : lesson.lessonId === 'u12-l3' ? 'atmosphere' : 'solid';
  const initialMagnetStation =
    lesson.lessonId === 'u5-l3' || lesson.lessonId === 'u5-l4' ? 'dynamo' : 'compass';
  const initialOilStation = lesson.lessonId === 'u9-l5' ? 'distillation' : 'co2';
  const initialAnatomyModel = lesson.unitId === 7 ? 'flower' : 'kidney';
  const initialCapillaryFocus: 'surface' | 'capillary' | 'both' =
    lesson.lessonId === 'u11-l2' ? 'surface' : 'capillary';
  const initialAcidsFocus: 'indicators' | 'strength' | 'all' =
    lesson.lessonId === 'u2-l2' ? 'strength' : 'indicators';

  return (
    <div className="space-y-4">
      {/* Lesson Top Header */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={onBackToUnits}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline mb-1 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة إلى قائمة دروس الوحدة</span>
          </button>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">{lesson.title}</h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            المرجع: {lesson.pageRef} {isCompleted ? '· تم الإنجاز' : ''}
          </div>
        </div>
      </div>

      {/* 7-Step Path Navigation Bar */}
      <div className="flex overflow-x-auto gap-1.5 pb-1">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isCurrent = activeStep === s.num;
          const isReached = highestStep >= s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => goToStep(s.num)}
              className={`flex items-center gap-1.5 shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                isCurrent
                  ? 'bg-teal-700 text-white shadow-sm'
                  : isReached
                  ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-900'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Step 1: Discover */}
      {activeStep === 1 && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-5 space-y-4">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-sm">
            <Lightbulb className="w-4 h-4" />
            <span>الخطوة 1: اكتشف قبل الشرح</span>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            <ChemText text={lesson.step1Discover.scenario} />
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white">
            <ChemText text={lesson.step1Discover.question} />
          </div>
          <div className="space-y-2">
            {lesson.step1Discover.options.map((opt, idx) => {
              const selected = discoverSelection === idx;
              const answered = discoverSelection !== null;
              const isRight = idx === lesson.step1Discover.correctIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDiscoverSelection(idx)}
                  className={`w-full text-right rounded-lg border px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    answered && isRight
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 font-bold'
                      : answered && selected && !isRight
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <ChemText text={opt} />
                </button>
              );
            })}
          </div>
          {discoverSelection !== null && (
            <div className="rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 p-3.5 text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
              <ChemText text={lesson.step1Discover.revealExplanation} />
            </div>
          )}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="rounded-lg bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              التالي: افهم المفهوم العلمي ←
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Understand (Layered Content + Ministerial Traps + Prerequisites) */}
      {activeStep === 2 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">المتطلبات السابقة للدرس</div>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
              {lesson.prerequisites.map((p, i) => (
                <li key={i}>
                  <ChemText text={p} />
                </li>
              ))}
            </ul>
          </div>

          {lessonDiagrams.length > 0 && (
            <div className="space-y-4">
              {lessonDiagrams.map((diag, diagIdx) => (
                <div
                  key={`${diag.src}-${diagIdx}`}
                  className="rounded-2xl border border-teal-200/90 dark:border-teal-800/70 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 space-y-3 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-teal-800 dark:text-teal-300">
                      <ImageIcon className="w-4 h-4 shrink-0" />
                      <span>
                        {lessonDiagrams.length > 1
                          ? `لوحة الرسم المدرسي الملوّنة (${diagIdx + 1} من ${lessonDiagrams.length})`
                          : 'لوحة الرسم المدرسي الملوّنة (خطوات الرسم والأجزاء بالبيانات)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setZoomedDiagram(diag)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50/80 dark:bg-teal-950/60 px-3 py-1.5 text-xs font-bold text-teal-800 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/70 transition-colors cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>تكبير اللوحة لقراءة البيانات</span>
                    </button>
                  </div>
                  <figure
                    onClick={() => setZoomedDiagram(diag)}
                    title="انقر لتكبير اللوحة وقراءة البيانات"
                    className="group cursor-zoom-in rounded-xl border border-slate-200 bg-white p-2.5 sm:p-4 text-center space-y-2 overflow-x-auto hover:border-teal-400 transition-colors"
                  >
                    <img
                      src={diag.src}
                      alt={diag.caption}
                      className="mx-auto w-full max-w-2xl h-auto rounded-lg"
                    />
                    <figcaption className="text-xs font-bold text-teal-900 pt-1">
                      {diag.caption}
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          )}

          {lesson.step2Understand.concepts.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{c.title}</h3>
                {c.textbookPage && <span className="text-xs text-slate-500">{c.textbookPage}</span>}
              </div>

              {/* Layer 1: Textbook Content */}
              <div className="rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 text-sm leading-relaxed">
                <div className="text-[11px] font-bold text-teal-700 dark:text-teal-400 mb-1">النص العلمي المعتمد من الكتاب المدرسي:</div>
                <ChemText text={c.textbookContent} />
              </div>

              {(c.formulaLatex || c.chemEquationLatex) && (
                <div className="rounded-lg bg-slate-900 text-slate-100 p-3 text-center overflow-x-auto">
                  {c.formulaLatex && <MathBlock latex={c.formulaLatex} display />}
                  {c.chemEquationLatex && <MathBlock latex={c.chemEquationLatex} display />}
                </div>
              )}

              {/* Layer 2: Extra Pedagogical Explanation */}
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-white">شرح توضيحي مساعد: </span>
                <ChemText text={c.extraExplanation} />
              </div>

              {/* Layer 3: Ministerial Nuance / Trap */}
              {c.ministerialNuance && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3 flex items-start gap-2 text-xs sm:text-sm text-amber-950 dark:text-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>مصيدة وزارية / ملاحظة مراجعة: </strong>
                    <ChemText text={c.ministerialNuance} />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Glossary */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2.5">المفاهيم والمصطلحات الأساسية</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lesson.step2Understand.glossary.map((g, idx) => (
                <div key={idx} className="rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 text-xs">
                  <div className="font-bold text-teal-700 dark:text-teal-300 mb-1">
                    {g.term} {g.pageRef ? `(${g.pageRef})` : ''}
                  </div>
                  <ChemText text={g.definition} className="text-slate-700 dark:text-slate-300 leading-relaxed" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="rounded-lg bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              {lesson.labId ? 'التالي: المختبر التفاعلي والتجربة ←' : 'التالي: التجربة والمحاكاة التفاعلية ←'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Experiment in 3D/2D Virtual Lab + 4 Levels */}
      {activeStep === 3 && (
        <div className="space-y-4">
          {lesson.labId === 'acids-bases-3d' && (
            <AcidsBasesLab3D
              initialFocus={initialAcidsFocus}
              onLevelInteract={(lvl) => onLabLevelInteract('acids-bases-3d', lvl)}
            />
          )}
          {lesson.labId === 'pressure-3d' && (
            <PressureLab3D
              initialMode={initialPressureMode}
              locked
              onLevelInteract={(lvl) => onLabLevelInteract('pressure-3d', lvl)}
            />
          )}
          {lesson.labId === 'magnetism-dynamo-3d' && lesson.lessonId !== 'u5-l4' && (
            <MagnetismDynamoLab3D
              initialStation={initialMagnetStation}
              locked
              onLevelInteract={(lvl) => onLabLevelInteract('magnetism-dynamo-3d', lvl)}
            />
          )}
          {lesson.labId === 'capillary-surface-3d' && (
            <CapillarySurfaceLab3D
              initialFocus={initialCapillaryFocus}
              locked
              onLevelInteract={(lvl) => onLabLevelInteract('capillary-surface-3d', lvl)}
            />
          )}
          {lesson.labId === 'oil-co2-3d' && (
            <OilDistillationCO2Lab3D
              initialStation={initialOilStation}
              locked
              onLevelInteract={(lvl) => onLabLevelInteract('oil-co2-3d', lvl)}
            />
          )}
          {lesson.labId === 'anatomy-kidney-flower-3d' && (
            <AnatomyKidneyFlowerLab3D
              initialModel={initialAnatomyModel}
              locked
              onLevelInteract={(lvl) => onLabLevelInteract('anatomy-kidney-flower-3d', lvl)}
            />
          )}

          {/* Dedicated Interactive 2D Simulation (collapsible) added alongside 3D labs */}
          <Lesson2DSimulations key={lesson.lessonId} lessonId={lesson.lessonId} defaultOpen />

          {/* 4 Progressive Experiment Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lesson.step3Experiment.levels.map((lvl) => (
              <div
                key={lvl.level}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-4 space-y-2.5 text-xs"
              >
                <div className="font-bold text-sm text-teal-700 dark:text-teal-300">{lvl.title}</div>
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <ChemText text={lvl.instruction} />
                </div>

                {lvl.predictPrompt && lvl.predictOptions && (
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 space-y-2">
                    <div className="font-bold text-amber-700 dark:text-amber-300">
                      سؤال التوقّع قبل التجربة: <ChemText text={lvl.predictPrompt} />
                    </div>
                    <div className="space-y-1">
                      {lvl.predictOptions.map((po, pidx) => {
                        const chosen = predictSelection[lvl.level] === pidx;
                        const revealed = typeof predictSelection[lvl.level] === 'number';
                        return (
                          <button
                            key={pidx}
                            type="button"
                            onClick={() => {
                              setPredictSelection((prev) => ({ ...prev, [lvl.level]: pidx }));
                              onLabLevelInteract(lesson.labId ?? `unit-${lesson.unitId}`, lvl.level);
                            }}
                            className={`w-full text-right rounded px-2.5 py-1.5 border cursor-pointer ${
                              revealed && pidx === lvl.correctPredictIndex
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 font-bold'
                                : revealed && chosen
                                ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50'
                                : 'border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <ChemText text={po} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 p-2.5 text-slate-800 dark:text-slate-200">
                  <strong>التفسير العلمي: </strong>
                  <ChemText text={lvl.postExplanation} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => goToStep(4)}
              className="rounded-lg bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              التالي: استنتج القانون والحاسبات التفاعلية ←
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Conclude & Calculators */}
      {activeStep === 4 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-5 space-y-3">
            <h3 className="text-base font-bold text-teal-700 dark:text-teal-300">الاستنتاج العلمي والقاعدة</h3>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              <ChemText text={lesson.step4Conclude.summaryLaw} />
            </p>
            {lesson.step4Conclude.lawLatex && (
              <div className="rounded-lg bg-slate-900 text-white p-3 text-center">
                <MathBlock latex={lesson.step4Conclude.lawLatex} display />
              </div>
            )}
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5">
              {lesson.step4Conclude.keyTakeaways.map((t, idx) => (
                <li key={idx}>
                  <ChemText text={t} />
                </li>
              ))}
            </ul>
          </div>

          <FormulaCalculators unitId={lesson.unitId} lessonId={lesson.lessonId} />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => goToStep(5)}
              className="rounded-lg bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              التالي: تحقق من فهمك ←
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Verify */}
      {activeStep === 5 && (
        <div className="space-y-3">
          <div className="text-sm font-bold text-slate-900 dark:text-white">أسئلة التحقق الفوري من الفهم</div>
          {lesson.step5Verify.map(renderQuestionCard)}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => goToStep(6)}
              className="rounded-lg bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              التالي: أتقن الأسئلة الوزارية ←
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Master (Ministerial Exam Questions) */}
      {activeStep === 6 && (
        <div className="space-y-3">
          <div className="text-sm font-bold text-slate-900 dark:text-white">التدريب على أسئلة الاختبارات الوزارية للدرس</div>
          {lesson.step6Master.map(renderQuestionCard)}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => goToStep(7)}
              className="rounded-lg bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              التالي: المراجعة النهائية وإتمام الدرس ←
            </button>
          </div>
        </div>
      )}

      {/* Step 7: Review */}
      {activeStep === 7 && (
        <div className="rounded-2xl border border-emerald-500/40 bg-white/65 dark:bg-slate-900/70 backdrop-blur-md p-5 space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5" />
            <span>ملخص المراجعة المركزة وإتمام الدرس</span>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-500 mb-1.5">نقاط ذهبية يجب تذكرها:</div>
            <ul className="list-disc list-inside text-sm text-slate-800 dark:text-slate-200 space-y-1.5">
              {lesson.step7Review.mustRemember.map((m, idx) => (
                <li key={idx}>
                  <ChemText text={m} />
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3.5">
            <div className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1.5">أخطاء شائعة احذر منها في الامتحان الوزاري:</div>
            <ul className="list-disc list-inside text-xs sm:text-sm text-amber-950 dark:text-amber-100 space-y-1">
              {lesson.step7Review.commonTraps.map((tr, idx) => (
                <li key={idx}>
                  <ChemText text={tr} />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              تم حفظ إتمام هذا الدرس في سجل تقدمك.
            </span>
            <button
              type="button"
              onClick={onBackToUnits}
              className="rounded-lg bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              العودة إلى قائمة دروس الوحدة
            </button>
          </div>
        </div>
      )}
      <DiagramLightbox diagram={zoomedDiagram} onClose={() => setZoomedDiagram(null)} />
    </div>
  );
};
