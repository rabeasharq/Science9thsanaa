import React, { useEffect, useRef, useState } from 'react';
import {
  Atom,
  BarChart3,
  BookMarked,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Copy,
  FileText,
  FlaskConical,
  Home,
  Menu,
  Moon,
  Phone,
  Sun,
  Type,
} from 'lucide-react';
import { UNIT_01_LESSONS } from './data/units/unit01Solutions';
import { UNIT_02_LESSONS } from './data/units/unit02AcidsBases';
import { UNIT_03_LESSONS } from './data/units/unit03AcidsReactions';
import { UNIT_04_LESSONS } from './data/units/unit04Space';
import { UNIT_05_LESSONS } from './data/units/unit05Magnetism';
import { UNIT_06_LESSONS } from './data/units/unit06Excretion';
import { UNIT_07_LESSONS } from './data/units/unit07Reproduction';
import { UNIT_08_LESSONS } from './data/units/unit08Diseases';
import { UNIT_09_LESSONS } from './data/units/unit09Reactions';
import { UNIT_10_LESSONS } from './data/units/unit10Halogens';
import { UNIT_11_LESSONS } from './data/units/unit11Properties';
import { UNIT_12_LESSONS } from './data/units/unit12Pressure';
import { UNIT_13_LESSONS } from './data/units/unit13SolarEnergy';
import { UNIT_14_LESSONS, UNIT_15_LESSONS, UNIT_16_LESSONS } from './data/units/unit14to16Biology';
import { DetailedLessonContent, LabId, LabOpenContext, PracticeQuestion } from './types/curriculum';
import {
  DEFAULT_PROGRESS,
  ExamAttemptRecord,
  loadProgress,
  saveProgress,
  StudentProgressState,
} from './storage/progressDb';
import { OfflineIndicator, PWAInstallButton } from './components/pwa/PWAInstallButton';
import { ScienceBackdrop } from './components/common/ScienceBackdrop';
import { HomeDashboard } from './components/views/HomeDashboard';
import { CurriculumMapView } from './components/views/CurriculumMapView';
import { LabsHubView } from './components/views/LabsHubView';
import { MinisterialExamSimulator } from './components/exam/MinisterialExamSimulator';
import { ProgressDiagnosticsView } from './components/views/ProgressDiagnosticsView';
import { ReviewConceptsView } from './components/views/ReviewConceptsView';
import { BookletPdfView } from './components/views/BookletPdfView';
import { LessonWorkspace } from './components/lesson/LessonWorkspace';

type NavTab = 'home' | 'curriculum' | 'labs' | 'booklet' | 'exam' | 'progress' | 'review';
type FontScale = 'normal' | 'large' | 'xlarge';

const FONT_SCALE_PX: Record<FontScale, string> = {
  normal: '16px',
  large: '18px',
  xlarge: '20px',
};

const FONT_SCALE_LABELS: Record<FontScale, string> = {
  normal: 'عادي',
  large: 'كبير',
  xlarge: 'كبير جداً',
};

const DETAILED_LESSONS_MAP: Record<string, DetailedLessonContent> = Object.fromEntries(
  [
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
  ].map((l) => [l.lessonId, l])
);

const NAV_ITEMS: {
  id: NavTab;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}[] = [
  {
    id: 'home',
    label: 'الرئيسية',
    hint: 'نظرة عامة ووصول سريع للوحدات',
    icon: Home,
    tone: 'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300',
  },
  {
    id: 'curriculum',
    label: 'وحدات الكتاب',
    hint: 'فهرس وحدات ودروس العلوم',
    icon: BookOpen,
    tone: 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300',
  },
  {
    id: 'labs',
    label: 'مختبر التجارب التفاعلي',
    hint: 'المعامل 3D والمحاكيات التفاعلية 2D',
    icon: FlaskConical,
    tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300',
  },
  {
    id: 'booklet',
    label: 'الملزمة الشاملة (PDF)',
    hint: 'كتاب تفاعلي للطباعة A4 وحفظ PDF و Word',
    icon: FileText,
    tone: 'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300',
  },
  {
    id: 'exam',
    label: 'الاختبارات الوزارية',
    hint: 'محاكي التظليل الإلكتروني (50 فقرة)',
    icon: ClipboardCheck,
    tone: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300',
  },
  {
    id: 'progress',
    label: 'تقدمي التعليمي',
    hint: 'تحليل المهارات والنسخ الاحتياطي',
    icon: BarChart3,
    tone: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300',
  },
  {
    id: 'review',
    label: 'المراجعة والمفاهيم',
    hint: 'القوانين والمسرد والمصائد الوزارية',
    icon: BookMarked,
    tone: 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeLabId, setActiveLabId] = useState<LabId>('acids-bases-3d');
  const [labContext, setLabContext] = useState<LabOpenContext>({});
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('science9_theme') === 'dark';
  });

  const [fontScale, setFontScale] = useState<FontScale>(() => {
    if (typeof window === 'undefined') return 'normal';
    const saved = localStorage.getItem('science9_font_scale');
    return saved === 'large' || saved === 'xlarge' ? saved : 'normal';
  });

  const [progress, setProgress] = useState<StudentProgressState>(DEFAULT_PROGRESS);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText('779424090').then(() => {
      setCopiedPhone(true);
      window.setTimeout(() => setCopiedPhone(false), 2000);
    });
  };

  const cycleFontScale = () => {
    setFontScale((prev) => (prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal'));
  };

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('science9_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('science9_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SCALE_PX[fontScale];
    localStorage.setItem('science9_font_scale', fontScale);
  }, [fontScale]);

  useEffect(() => {
    loadProgress().then((loaded) => {
      setProgress(loaded);
    });
  }, []);

  // إغلاق القائمة المنسدلة تلقائياً عند النقر خارجها أو الضغط على Escape أو التمرير
  useEffect(() => {
    if (!menuOpen) return;
    const startY = window.scrollY;

    const handlePointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const handleScroll = () => {
      if (Math.abs(window.scrollY - startY) > 28) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menuOpen]);

  const updateProgress = (updater: (prev: StudentProgressState) => StudentProgressState) => {
    setProgress((prev) => {
      const next = updater(prev);
      saveProgress(next);
      return next;
    });
  };

  const handleSelectNav = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab !== 'curriculum') {
      setActiveLessonId(null);
    }
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLesson = (_unitId: number, lessonId: string) => {
    if (DETAILED_LESSONS_MAP[lessonId]) {
      setActiveLessonId(lessonId);
      setActiveTab('curriculum');
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenLab = (labId: LabId, context?: LabOpenContext) => {
    setActiveLabId(labId);
    setLabContext(context ?? {});
    setActiveLessonId(null);
    setActiveTab('labs');
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepProgress = (lessonId: string, step: number, markComplete?: boolean) => {
    updateProgress((prev) => {
      const completed =
        markComplete && !prev.completedLessons.includes(lessonId)
          ? [...prev.completedLessons, lessonId]
          : prev.completedLessons;
      return {
        ...prev,
        completedLessons: completed,
        lessonStepProgress: {
          ...prev.lessonStepProgress,
          [lessonId]: Math.max(prev.lessonStepProgress[lessonId] ?? 1, step),
        },
      };
    });
  };

  const handleRecordQuestionAnswer = (q: PracticeQuestion, isCorrect: boolean) => {
    updateProgress((prev) => {
      const curSkill = prev.skillStats[q.skill] ?? { attempts: 0, correct: 0 };
      return {
        ...prev,
        answeredQuestions: {
          ...prev.answeredQuestions,
          [q.id]: { isCorrect, skill: q.skill, unitId: q.unitId, lessonId: q.lessonId },
        },
        skillStats: {
          ...prev.skillStats,
          [q.skill]: {
            attempts: curSkill.attempts + 1,
            correct: curSkill.correct + (isCorrect ? 1 : 0),
          },
        },
      };
    });
  };

  const handleSaveExamAttempt = (
    attempt: ExamAttemptRecord,
    perQuestion: { q: PracticeQuestion; isCorrect: boolean }[]
  ) => {
    updateProgress((prev) => {
      const nextSkillStats = { ...prev.skillStats };
      const nextAnswered = { ...prev.answeredQuestions };
      perQuestion.forEach(({ q, isCorrect }) => {
        const s = nextSkillStats[q.skill] ?? { attempts: 0, correct: 0 };
        nextSkillStats[q.skill] = {
          attempts: s.attempts + 1,
          correct: s.correct + (isCorrect ? 1 : 0),
        };
        nextAnswered[q.id] = { isCorrect, skill: q.skill, unitId: q.unitId, lessonId: q.lessonId };
      });
      return {
        ...prev,
        answeredQuestions: nextAnswered,
        skillStats: nextSkillStats,
        examHistory: [attempt, ...prev.examHistory].slice(0, 20),
      };
    });
  };

  const handleLabLevelInteract = (labId: string, level: number) => {
    updateProgress((prev) => ({
      ...prev,
      labMasteryLevels: {
        ...prev.labMasteryLevels,
        [labId]: Math.max(prev.labMasteryLevels[labId] ?? 0, level),
      },
    }));
  };

  const activeLesson = activeLessonId ? DETAILED_LESSONS_MAP[activeLessonId] : null;
  const currentNavItem = NAV_ITEMS.find((n) => n.id === activeTab) ?? NAV_ITEMS[0];
  const CurrentNavIcon = currentNavItem.icon;

  return (
    <div className="min-h-screen flex flex-col relative text-slate-800 dark:text-slate-100">
      <div className="no-print">
        <ScienceBackdrop />
      </div>

      {/* شريط علوي مضغوط وشفاف مع قائمة منسدلة تختفي تلقائياً وأداة تكبير الخط */}
      <header className="no-print sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-800/70 bg-white/58 dark:bg-slate-900/62 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* العلامة التجارية */}
          <button
            type="button"
            onClick={() => handleSelectNav('home')}
            className="flex items-center gap-2.5 cursor-pointer text-right shrink-0 min-w-0"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-center shrink-0">
              <Atom className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
              المختبر التفاعلي والكتاب الذكي
            </span>
          </button>

          {/* أزرار القائمة وتكبير الخط والمظهر */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200/85 dark:border-slate-700/80 bg-white/75 dark:bg-slate-800/75 hover:bg-teal-50/80 dark:hover:bg-slate-800 px-2.5 sm:px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Menu className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" />
                <span className="hidden sm:inline">{currentNavItem.label}</span>
                <span className="inline sm:hidden">القائمة</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-150 ${
                    menuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-72 sm:w-80 rounded-2xl border border-slate-200/85 dark:border-slate-700/80 bg-white/88 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl shadow-slate-900/10 p-2.5 z-50 space-y-2"
                >
                  <div className="px-2.5 pt-1 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span>التنقل السريع</span>
                    <CurrentNavIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  </div>

                  <div className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="menuitem"
                          onClick={() => handleSelectNav(item.id)}
                          className={`w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-right transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-teal-50/90 dark:bg-teal-950/60 text-teal-900 dark:text-teal-100'
                              : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.tone}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs sm:text-sm font-bold leading-snug truncate">{item.label}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.hint}</div>
                          </div>
                          {isActive && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* تحكم حجم الخط داخل القائمة المنسدلة */}
                  <div className="pt-2 border-t border-slate-200/75 dark:border-slate-800 px-1.5 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Type className="w-3.5 h-3.5" />
                      <span>حجم الخط</span>
                    </span>
                    <div className="flex items-center gap-1 rounded-xl bg-slate-100/90 dark:bg-slate-800 p-0.5 text-[11px]">
                      {(['normal', 'large', 'xlarge'] as FontScale[]).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setFontScale(sz)}
                          className={`px-2 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                            fontScale === sz
                              ? 'bg-teal-700 text-white'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700'
                          }`}
                        >
                          {FONT_SCALE_LABELS[sz]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* زر سريع لتكبير وتغيير حجم الخط من الشريط العلوي */}
            <button
              type="button"
              onClick={cycleFontScale}
              className="h-9 rounded-xl border border-slate-200/85 dark:border-slate-700/80 bg-white/75 dark:bg-slate-800/75 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 flex items-center gap-1 text-xs font-extrabold transition-colors cursor-pointer shrink-0"
              aria-label={`تغيير حجم الخط (الحالي: ${FONT_SCALE_LABELS[fontScale]})`}
              title={`تكبير/تغيير حجم الخط (${FONT_SCALE_LABELS[fontScale]})`}
            >
              <Type className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span className="hidden md:inline">{FONT_SCALE_LABELS[fontScale]}</span>
            </button>

            <PWAInstallButton />

            <button
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              className="w-9 h-9 rounded-xl border border-slate-200/85 dark:border-slate-700/80 bg-white/75 dark:bg-slate-800/75 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="تبديل الوضع الليلي والنهاري"
              title={darkMode ? 'تفعيل الخلفية الفاتحة' : 'تفعيل الوضع الليلي'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي بمساحات تنفس مريحة */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'home' && (
          <HomeDashboard
            progress={progress}
            onOpenLesson={handleOpenLesson}
            onNavigateTab={handleSelectNav}
          />
        )}

        {activeTab === 'curriculum' &&
          (activeLesson ? (
            <LessonWorkspace
              key={activeLesson.lessonId}
              lesson={activeLesson}
              highestStep={progress.lessonStepProgress[activeLesson.lessonId] ?? 1}
              isCompleted={progress.completedLessons.includes(activeLesson.lessonId)}
              onStepProgress={handleStepProgress}
              onRecordQuestionAnswer={handleRecordQuestionAnswer}
              onLabLevelInteract={handleLabLevelInteract}
              onBackToUnits={() => setActiveLessonId(null)}
            />
          ) : (
            <CurriculumMapView
              completedLessonIds={progress.completedLessons}
              onOpenLesson={handleOpenLesson}
              onOpenLab={handleOpenLab}
            />
          ))}

        {activeTab === 'labs' && (
          <LabsHubView
            activeLabId={activeLabId}
            labContext={labContext}
            onSelectLab={(labId) => {
              setActiveLabId(labId);
              setLabContext({});
            }}
            onLabLevelInteract={handleLabLevelInteract}
          />
        )}

        {activeTab === 'booklet' && <BookletPdfView />}

        {activeTab === 'exam' && (
          <MinisterialExamSimulator
            onSaveAttempt={handleSaveExamAttempt}
            onNavigateToLesson={handleOpenLesson}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressDiagnosticsView
            progress={progress}
            onOpenLesson={handleOpenLesson}
            onImportProgress={(imported) => {
              setProgress(imported);
              saveProgress(imported);
            }}
          />
        )}

        {activeTab === 'review' && <ReviewConceptsView />}
      </main>

      <footer className="no-print border-t border-slate-200/60 dark:border-slate-800/70 bg-white/58 dark:bg-slate-900/62 backdrop-blur-md mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-right">
            <span className="font-extrabold text-slate-900 dark:text-white">
              إعداد وتطوير: الأستاذ إبراهيم أحمد متاش
            </span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              التطبيق مجاني
            </span>
            <span aria-hidden="true" className="text-slate-400 hidden sm:inline">·</span>
            <span>لإبداء الملاحظات أو الدعم</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:779424090"
              dir="ltr"
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 px-3 py-1.5 font-mono-num font-bold text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>779424090</span>
            </a>
            <button
              type="button"
              onClick={handleCopyPhone}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-2.5 py-1.5 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              title="نسخ رقم التواصل"
            >
              {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPhone ? 'تم النسخ' : 'نسخ الرقم'}</span>
            </button>
          </div>
        </div>
      </footer>

      <div className="no-print">
        <OfflineIndicator />
      </div>
    </div>
  );
}
