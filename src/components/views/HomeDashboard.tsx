import React, { useState } from 'react';
import {
  ArrowUpLeft,
  Atom,
  Baby,
  Beaker,
  ClipboardCheck,
  Dna,
  Droplets,
  FileText,
  Flame,
  FlaskConical,
  HeartPulse,
  Leaf,
  Magnet,
  Orbit,
  Scale,
  ShieldPlus,
  Sprout,
  Sun,
} from 'lucide-react';
import { COMPLETED_LESSONS_COUNT } from '../../data/curriculumIndex';
import { StudentProgressState } from '../../storage/progressDb';

interface HomeDashboardProps {
  progress: StudentProgressState;
  onOpenLesson: (unitId: number, lessonId: string) => void;
  onNavigateTab: (tab: 'home' | 'curriculum' | 'labs' | 'booklet' | 'exam' | 'progress' | 'review') => void;
}

interface QuickUnitItem {
  unitId: number;
  part: 1 | 2;
  domain: string;
  title: string;
  desc: string;
  lessonCount: number;
  lessonId: string;
  icon: React.ComponentType<{ className?: string }>;
  iconTone: string;
}

const UNITS_SHOWCASE: QuickUnitItem[] = [
  {
    unitId: 1,
    part: 1,
    domain: 'الكيمياء',
    title: 'المحاليل وطرق تحضيرها',
    desc: 'المذاب والمذيب، التركيز، وحالات الإشباع بالتسخين.',
    lessonCount: 2,
    lessonId: 'u1-l1',
    icon: Beaker,
    iconTone: 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300',
  },
  {
    unitId: 2,
    part: 1,
    domain: 'الكيمياء',
    title: 'الحموض والقواعد',
    desc: 'الكواشف الأربعة، مقياس pH، وتأين المحاليل والأيونات.',
    lessonCount: 2,
    lessonId: 'u2-l1',
    icon: FlaskConical,
    iconTone: 'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300',
  },
  {
    unitId: 3,
    part: 1,
    domain: 'الكيمياء',
    title: 'تفاعلات الحموض والقواعد',
    desc: 'تفاعلات التعادل، أثر الحموض في الكربونات، والمطر الحمضي.',
    lessonCount: 3,
    lessonId: 'u3-l1',
    icon: Atom,
    iconTone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300',
  },
  {
    unitId: 4,
    part: 1,
    domain: 'الفضاء',
    title: 'الإنسان والفضاء الكوني',
    desc: 'المجموعة الشمسية والمجرة، الصواريخ الفضائية والأقمار.',
    lessonCount: 2,
    lessonId: 'u4-l1',
    icon: Orbit,
    iconTone: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300',
  },
  {
    unitId: 5,
    part: 1,
    domain: 'الفيزياء',
    title: 'المغناطيسية والحث الكهرومغناطيسي',
    desc: 'خطوط الفيض والبوصلة 3D، الهاتف، والدينامو والمحول.',
    lessonCount: 4,
    lessonId: 'u5-l1',
    icon: Magnet,
    iconTone: 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300',
  },
  {
    unitId: 6,
    part: 1,
    domain: 'الأحياء',
    title: 'الإخراج في الكائنات الحية',
    desc: 'فجوة الأميبا، النتح والإدماع، وتشريح الكلية والجلد.',
    lessonCount: 4,
    lessonId: 'u6-l1',
    icon: HeartPulse,
    iconTone: 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300',
  },
  {
    unitId: 7,
    part: 1,
    domain: 'الأحياء',
    title: 'التكاثر في الكائنات الحية',
    desc: 'مجسم الزهرة 3D المفكك، التلقيح والإخصاب، والتكاثر.',
    lessonCount: 2,
    lessonId: 'u7-l1',
    icon: Sprout,
    iconTone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300',
  },
  {
    unitId: 8,
    part: 1,
    domain: 'الأحياء',
    title: 'أمراض الجهازين البولي والتناسلي',
    desc: 'البلهارسيا، حصى الكلى، الأمراض التناسلية وطرق الوقاية.',
    lessonCount: 3,
    lessonId: 'u8-l1',
    icon: ShieldPlus,
    iconTone: 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300',
  },
  {
    unitId: 9,
    part: 2,
    domain: 'الكيمياء',
    title: 'تفاعلات العناصر والنفط',
    desc: 'الأكاسيد، الكربون، غاز CO₂، وتقطير النفط الخام 3D.',
    lessonCount: 6,
    lessonId: 'u9-l1',
    icon: Flame,
    iconTone: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300',
  },
  {
    unitId: 10,
    part: 2,
    domain: 'الكيمياء',
    title: 'الهالوجينات',
    desc: 'الفلور والكلور والبروم واليود، وجهاز تحضير وتجفيف الكلور.',
    lessonCount: 3,
    lessonId: 'u10-l1',
    icon: FlaskConical,
    iconTone: 'bg-lime-50 text-lime-700 dark:bg-lime-950/70 dark:text-lime-300',
  },
  {
    unitId: 11,
    part: 2,
    domain: 'الفيزياء',
    title: 'خواص الأجسام والشد السطحي',
    desc: 'الشد السطحي، التماسك والتلاصق، والخاصية الشعرية 3D.',
    lessonCount: 7,
    lessonId: 'u11-l1',
    icon: Droplets,
    iconTone: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300',
  },
  {
    unitId: 12,
    part: 2,
    domain: 'الفيزياء',
    title: 'الضغط في المواد الصلبة والموائع',
    desc: 'تجربة الرمل (ث.كجم × 10)، السوائل، البارومتر وبرنولي.',
    lessonCount: 3,
    lessonId: 'u12-l1',
    icon: Scale,
    iconTone: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300',
  },
  {
    unitId: 13,
    part: 2,
    domain: 'الفيزياء',
    title: 'الطاقة الشمسية واستغلالها',
    desc: 'الإشعاع الشمسي، السخان الحراري، والخلايا الكهروضوئية.',
    lessonCount: 3,
    lessonId: 'u13-l1',
    icon: Sun,
    iconTone: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300',
  },
  {
    unitId: 14,
    part: 2,
    domain: 'الأحياء',
    title: 'استثمار موارد البيئة الحية',
    desc: 'تنمية الثروة النباتية والحيوانية والصناعات المعتمدة عليها.',
    lessonCount: 2,
    lessonId: 'u14-l1',
    icon: Leaf,
    iconTone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300',
  },
  {
    unitId: 15,
    part: 2,
    domain: 'الأحياء',
    title: 'رعاية الأمومة والطفولة',
    desc: 'العناية بالحامل، مزايا الرضاعة الطبيعية، وتنظيم الأسرة.',
    lessonCount: 3,
    lessonId: 'u15-l1',
    icon: Baby,
    iconTone: 'bg-pink-50 text-pink-700 dark:bg-pink-950/70 dark:text-pink-300',
  },
  {
    unitId: 16,
    part: 2,
    domain: 'الأحياء',
    title: 'الوراثة في الكائنات الحية',
    desc: 'مربع بانيت، زواج الأقارب، الطفرات، والأمراض الوراثية.',
    lessonCount: 4,
    lessonId: 'u16-l1',
    icon: Dna,
    iconTone: 'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300',
  },
];

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  progress,
  onOpenLesson,
  onNavigateTab,
}) => {
  const [partFilter, setPartFilter] = useState<'all' | 1 | 2>('all');

  const totalAttempts = Object.values(progress.skillStats).reduce((a, b) => a + b.attempts, 0);
  const totalCorrect = Object.values(progress.skillStats).reduce((a, b) => a + b.correct, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null;

  const visibleUnits = UNITS_SHOWCASE.filter(
    (u) => partFilter === 'all' || u.part === partFilter
  );

  return (
    <div className="space-y-6">
      {/* الترحيب الرئيسي */}
      <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-6 sm:p-8 shadow-sm shadow-slate-900/[0.03]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="text-xs font-bold text-teal-700 dark:text-teal-400">
              الجمهورية اليمنية · علوم الصف التاسع الأساسي
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
              تعلّم العلوم بالتجربة التفاعلية 3D و 2D
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              دروس تفاعلية لجميع الوحدات الـ 16، مختبرات ثلاثية وثنائية الأبعاد، حاسبات قوانين، ومحاكي الاختبارات الوزارية في واجهة مريحة وسهلة القراءة.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <span>
                <strong className="font-mono-num text-teal-700 dark:text-teal-400">{COMPLETED_LESSONS_COUNT}</strong> درساً تفاعلياً
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span>
                <strong className="font-mono-num text-slate-900 dark:text-white">6</strong> معامل 3D ومحاكيات 2D
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span>
                إنجازك:{' '}
                <strong className="font-mono-num text-slate-900 dark:text-white">
                  {progress.completedLessons.length}
                </strong>{' '}
                درس
              </span>
              {overallAccuracy !== null && (
                <>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <span>
                    الدقة:{' '}
                    <strong className="font-mono-num text-emerald-700 dark:text-emerald-400">{overallAccuracy}%</strong>
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateTab('labs')}
              className="flex items-center gap-2 rounded-xl bg-teal-700 hover:bg-teal-800 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <FlaskConical className="w-4 h-4" />
              <span>دخول مختبر التجارب التفاعلي</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('booklet')}
              className="flex items-center gap-2 rounded-xl border border-emerald-300/80 dark:border-emerald-700/80 bg-emerald-50/85 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 px-4 py-3 text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>فتح وقراءة الملزمة (PDF / Word)</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('exam')}
              className="flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/75 hover:bg-white/90 dark:hover:bg-slate-700 px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              <ClipboardCheck className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span>المحاكي الوزاري</span>
            </button>
          </div>
        </div>
      </section>

      {/* الوحدات الدراسية */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">الوحدات الدراسية التفاعلية</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              اختر وحدة لبدء الدرس والتجربة العملية، أو تصفح الفهرس الكامل من القائمة.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/62 dark:bg-slate-900/68 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 text-xs">
            {(
              [
                { id: 'all', label: 'الكل' },
                { id: 1, label: 'الجزء الأول' },
                { id: 2, label: 'الجزء الثاني' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPartFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  partFilter === tab.id
                    ? 'bg-teal-700 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleUnits.map((unit) => {
            const Icon = unit.icon;
            return (
              <div
                key={unit.unitId}
                className="group rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-5 flex flex-col justify-between gap-4 hover:border-teal-400/70 dark:hover:border-teal-600/60 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${unit.iconTone}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      الجزء {unit.part === 1 ? 'الأول' : 'الثاني'} · {unit.domain} · {unit.lessonCount} دروس
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                      الوحدة {unit.unitId}: {unit.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                      {unit.desc}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenLesson(unit.unitId, unit.lessonId)}
                  className="inline-flex items-center justify-between w-full rounded-xl bg-slate-50/75 dark:bg-slate-800/70 hover:bg-teal-700 hover:text-white dark:hover:bg-teal-700 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
                >
                  <span>ابدأ دراسة الوحدة</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
