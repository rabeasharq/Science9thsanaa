import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpLeft,
  Atom,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  Globe,
  Home,
  LayoutGrid,
  Leaf,
  Search,
} from 'lucide-react';
import { CURRICULUM_UNITS } from '../../data/curriculumIndex';
import { LabId, LabOpenContext, UnitIndexEntry } from '../../types/curriculum';

interface CurriculumMapViewProps {
  completedLessonIds: string[];
  selectedUnitId?: number | null;
  onSelectUnit?: (unitId: number | null) => void;
  onBackHome?: () => void;
  onOpenLesson: (unitId: number, lessonId: string) => void;
  onOpenLab: (labId: LabId, context?: LabOpenContext) => void;
}

function getUnitLabLaunch(unit: UnitIndexEntry): { context: LabOpenContext; label: string } {
  switch (unit.id) {
    case 2:
      return { context: {}, label: 'تشغيل مختبر الحموض والقواعد التفاعلي' };
    case 5:
      return { context: { magnetStation: 'compass' }, label: 'تشغيل مختبر المغناطيسية والدينامو 3D' };
    case 6:
      return { context: { anatomyModel: 'kidney' }, label: 'تشغيل مختبر تشريح الكلية والجهاز البولي' };
    case 7:
      return { context: { anatomyModel: 'flower' }, label: 'تشغيل مختبر تشريح الزهرة التفاعلي' };
    case 8:
      return { context: { anatomyModel: 'kidney' }, label: 'تشغيل مختبر تشريح الكلية (الأمراض البولية)' };
    case 9:
      return { context: { oilStation: 'distillation' }, label: 'تشغيل مختبر تقطير النفط وغاز CO₂ 3D' };
    case 11:
      return { context: { capillaryFocus: 'both' }, label: 'تشغيل مختبر الخاصية الشعرية والشد السطحي 3D' };
    case 12:
      return { context: { pressureMode: 'solid' }, label: 'تشغيل مختبر الضغط والموائع والبارومتر 3D' };
    default:
      return { context: {}, label: 'تشغيل المختبر التفاعلي المرتبط' };
  }
}

const DOMAIN_STYLE: Record<
  UnitIndexEntry['domain'],
  { icon: React.ComponentType<{ className?: string }>; tone: string }
> = {
  كيمياء: {
    icon: FlaskConical,
    tone: 'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300',
  },
  فيزياء: {
    icon: Atom,
    tone: 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300',
  },
  'أحياء وصحة': {
    icon: Leaf,
    tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300',
  },
  'علوم الأرض والفضاء': {
    icon: Globe,
    tone: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300',
  },
};

export const CurriculumMapView: React.FC<CurriculumMapViewProps> = ({
  completedLessonIds,
  selectedUnitId = null,
  onSelectUnit,
  onBackHome,
  onOpenLesson,
  onOpenLab,
}) => {
  const [partFilter, setPartFilter] = useState<'all' | 1 | 2>('all');
  const [search, setSearch] = useState('');

  const focusedUnit =
    typeof selectedUnitId === 'number'
      ? CURRICULUM_UNITS.find((u) => u.id === selectedUnitId) ?? null
      : null;

  if (focusedUnit) {
    const domainMeta = DOMAIN_STYLE[focusedUnit.domain];
    const DomainIcon = domainMeta.icon;
    const completedInUnit = focusedUnit.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
    const launch = focusedUnit.labId ? getUnitLabLaunch(focusedUnit) : null;

    return (
      <div className="space-y-5">
        {/* شريط العودة والتنقل للوحدة المختارة */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {onBackHome && (
              <button
                type="button"
                onClick={onBackHome}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/85 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/75 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                <span>العودة للرئيسية</span>
              </button>
            )}
            {onSelectUnit && (
              <button
                type="button"
                onClick={() => onSelectUnit(null)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200/80 dark:border-teal-800/70 bg-teal-50/80 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/70 px-3 py-2 text-xs font-bold text-teal-800 dark:text-teal-200 transition-colors cursor-pointer"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>جميع وحدات الكتاب (16)</span>
              </button>
            )}
          </div>

          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            الإنجاز في الوحدة: {completedInUnit} / {focusedUnit.lessons.length} دروس
          </span>
        </div>

        {/* بطاقة رأس الوحدة */}
        <div className="rounded-2xl border border-teal-400/50 dark:border-teal-700/60 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${domainMeta.tone}`}>
              <DomainIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>الجزء {focusedUnit.part === 1 ? 'الأول' : 'الثاني'}</span>
                <span aria-hidden="true">·</span>
                <span>{focusedUnit.domain}</span>
                <span aria-hidden="true">·</span>
                <span>ابتداءً من ص {focusedUnit.pageNumber}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                الوحدة {focusedUnit.id}: {focusedUnit.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                اختر أي درس من القائمة أدناه لفتحه، وعند الخروج من الدرس ستعود إلى هذه القائمة مباشرة.
              </p>
            </div>
          </div>

          {focusedUnit.labId && launch && (
            <button
              type="button"
              onClick={() => onOpenLab(focusedUnit.labId!, launch.context)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <FlaskConical className="w-4 h-4" />
              <span>{launch.label}</span>
            </button>
          )}
        </div>

        {/* قائمة دروس الوحدة */}
        <div className="space-y-3">
          <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
            قائمة دروس الوحدة ({focusedUnit.lessons.length} دروس):
          </div>
          <div className="grid grid-cols-1 gap-3">
            {focusedUnit.lessons.map((lesson) => {
              const done = completedLessonIds.includes(lesson.id);
              const lessonReady = lesson.status === 'completed';
              return (
                <button
                  key={lesson.id}
                  type="button"
                  disabled={!lessonReady}
                  onClick={() => lessonReady && onOpenLesson(focusedUnit.id, lesson.id)}
                  className={`w-full text-right rounded-2xl border p-4 sm:p-5 flex items-center justify-between gap-3 transition-colors ${
                    lessonReady
                      ? 'border-slate-200/85 dark:border-slate-700/80 bg-white/75 dark:bg-slate-900/75 hover:border-teal-500 dark:hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/30 cursor-pointer'
                      : 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 opacity-75 cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                        done
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : 'bg-teal-50 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300'
                      }`}
                    >
                      {done ? <CheckCircle2 className="w-5 h-5" /> : lesson.lessonNumber}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                        الدرس {lesson.lessonNumber}: {lesson.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                        <span>الكتاب المدرسي ص {lesson.pageNumber}</span>
                        {done && (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">· مكتمل</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {lessonReady && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 text-white px-3.5 py-2 text-xs font-bold shrink-0">
                      <span>فتح الدرس</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* تنقل سريع بين الوحدات المجاورة */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-800 text-xs">
          {focusedUnit.id > 1 && onSelectUnit ? (
            <button
              type="button"
              onClick={() => onSelectUnit(focusedUnit.id - 1)}
              className="inline-flex items-center gap-1.5 font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>الوحدة السابقة (الوحدة {focusedUnit.id - 1})</span>
            </button>
          ) : (
            <span />
          )}

          {focusedUnit.id < 16 && onSelectUnit && (
            <button
              type="button"
              onClick={() => onSelectUnit(focusedUnit.id + 1)}
              className="inline-flex items-center gap-1.5 font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              <span>الوحدة التالية (الوحدة {focusedUnit.id + 1})</span>
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  const filteredUnits = CURRICULUM_UNITS.filter((u) => {
    if (partFilter !== 'all' && u.part !== partFilter) return false;
    if (!search.trim()) return true;
    const q = search.trim();
    return u.title.includes(q) || u.lessons.some((l) => l.title.includes(q));
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              خريطة منهج العلوم للصف التاسع
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تصفّح وحدات ودروس كتاب العلوم للجزأين الأول والثاني وافتح الدروس التفاعلية والمختبرات.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن وحدة أو درس..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/75 pr-9 pl-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div className="flex rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/60 dark:bg-slate-800/70 p-1 text-xs">
            {(['all', 1, 2] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPartFilter(p)}
                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors whitespace-nowrap ${
                  partFilter === p
                    ? 'bg-teal-700 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700'
                }`}
              >
                {p === 'all' ? 'الكل (16)' : p === 1 ? 'الجزء الأول (1–8)' : 'الجزء الثاني (9–16)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUnits.map((unit) => {
          const isReady = unit.status === 'completed';
          const domainMeta = DOMAIN_STYLE[unit.domain];
          const DomainIcon = domainMeta.icon;
          return (
            <div
              key={unit.id}
              className={`rounded-2xl border bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-5 space-y-3.5 ${
                isReady ? 'border-teal-400/50 dark:border-teal-700/60' : 'border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${domainMeta.tone}`}>
                    <DomainIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>الجزء {unit.part === 1 ? 'الأول' : 'الثاني'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{unit.domain}</span>
                      <span aria-hidden="true">·</span>
                      <span>ص {unit.pageNumber}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {onSelectUnit ? (
                        <button
                          type="button"
                          onClick={() => onSelectUnit(unit.id)}
                          className="text-right hover:text-teal-700 dark:hover:text-teal-400 transition-colors cursor-pointer"
                        >
                          الوحدة {unit.id}: {unit.title}
                        </button>
                      ) : (
                        <>الوحدة {unit.id}: {unit.title}</>
                      )}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                {unit.lessons.map((lesson) => {
                  const done = completedLessonIds.includes(lesson.id);
                  const lessonReady = lesson.status === 'completed';
                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between gap-2 rounded-xl bg-white/60 dark:bg-slate-950/55 border border-slate-200/70 dark:border-slate-800/80 px-3.5 py-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : lessonReady ? (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-teal-600 inline-block shrink-0" />
                        ) : (
                          <span className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 inline-block shrink-0" />
                        )}
                        <div className="truncate">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {lesson.lessonNumber}. {lesson.title}
                          </span>
                          <span className="text-[11px] text-slate-400 mx-1.5">(ص {lesson.pageNumber})</span>
                        </div>
                      </div>

                      {lessonReady ? (
                        <button
                          type="button"
                          onClick={() => onOpenLesson(unit.id, lesson.id)}
                          className="flex items-center gap-1 rounded-lg bg-teal-700 hover:bg-teal-800 px-2.5 py-1.5 text-[11px] font-bold text-white cursor-pointer shrink-0 transition-colors"
                        >
                          <span>فتح الدرس</span>
                          <ArrowUpLeft className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 shrink-0">فهرس</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {unit.labId && (() => {
                const launch = getUnitLabLaunch(unit);
                return (
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onOpenLab(unit.labId!, launch.context)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>{launch.label}</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
};
