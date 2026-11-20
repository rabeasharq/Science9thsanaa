import { SkillTag } from '../types/curriculum';

export interface ExamAttemptRecord {
  id: string;
  timestamp: string;
  modeLabel: string;
  unitId?: number;
  score: number;
  maxScore: number;
  tfCorrect: number;
  tfTotal: number;
  mcqCorrect: number;
  mcqTotal: number;
  durationSeconds: number;
  wrongQuestionIds: string[];
}

export interface SkillPerformance {
  attempts: number;
  correct: number;
}

export interface StudentProgressState {
  version: number;
  studentName: string;
  completedLessons: string[];
  lessonStepProgress: Record<string, number>; // highest step 1..7 reached
  labMasteryLevels: Record<string, number>; // labId -> highest level 1..4 completed
  answeredQuestions: Record<string, { isCorrect: boolean; skill: SkillTag; unitId: number; lessonId: string }>;
  skillStats: Record<SkillTag, SkillPerformance>;
  examHistory: ExamAttemptRecord[];
  lastUpdated: string;
}

const DB_NAME = 'YemenScienceLab9DB';
const DB_VERSION = 1;
const STORE_NAME = 'studentProgress';
const RECORD_KEY = 'primary_student';
const LOCAL_STORAGE_FALLBACK_KEY = 'yemen_science_lab9_progress_v1';

export const DEFAULT_PROGRESS: StudentProgressState = {
  version: 1,
  studentName: 'طالب الصف التاسع',
  completedLessons: [],
  lessonStepProgress: {},
  labMasteryLevels: {},
  answeredQuestions: {},
  skillStats: {
    'حفظ مصطلح': { attempts: 0, correct: 0 },
    'تفسير ظاهرة': { attempts: 0, correct: 0 },
    'تطبيق قانون وتحويل وحدات': { attempts: 0, correct: 0 },
    'قراءة رسم/معادلة': { attempts: 0, correct: 0 },
    'استنتاج': { attempts: 0, correct: 0 },
  },
  examHistory: [],
  lastUpdated: new Date().toISOString(),
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'));
  });
}

function normalizeProgress(raw: Partial<StudentProgressState> | null | undefined): StudentProgressState {
  if (!raw) return { ...DEFAULT_PROGRESS, skillStats: { ...DEFAULT_PROGRESS.skillStats } };
  return {
    ...DEFAULT_PROGRESS,
    ...raw,
    skillStats: {
      ...DEFAULT_PROGRESS.skillStats,
      ...(raw.skillStats || {}),
    },
    completedLessons: Array.isArray(raw.completedLessons) ? raw.completedLessons : [],
    lessonStepProgress: raw.lessonStepProgress ?? {},
    labMasteryLevels: raw.labMasteryLevels ?? {},
    answeredQuestions: raw.answeredQuestions ?? {},
    examHistory: Array.isArray(raw.examHistory) ? raw.examHistory : [],
  };
}

export async function loadProgress(): Promise<StudentProgressState> {
  try {
    const db = await openDb();
    const data = await new Promise<StudentProgressState | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(RECORD_KEY);
      req.onsuccess = () => resolve(req.result as StudentProgressState | undefined);
      req.onerror = () => reject(req.error);
    });
    if (data) {
      return normalizeProgress(data);
    }
  } catch {
    // fallback to localStorage
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
    if (raw) {
      return normalizeProgress(JSON.parse(raw) as Partial<StudentProgressState>);
    }
  } catch {
    // ignore storage errors
  }

  return normalizeProgress(null);
}

export async function saveProgress(state: StudentProgressState): Promise<void> {
  const payload: StudentProgressState = {
    ...state,
    lastUpdated: new Date().toISOString(),
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(payload));
  } catch {
    // ignore localStorage quota errors
  }

  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(payload, RECORD_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // localStorage already updated as fallback
  }
}

export function exportProgressJson(state: StudentProgressState): string {
  return JSON.stringify(state, null, 2);
}

export function parseImportedProgressJson(jsonText: string): StudentProgressState {
  const parsed = JSON.parse(jsonText) as Partial<StudentProgressState>;
  if (!parsed || typeof parsed !== 'object' || typeof parsed.version !== 'number') {
    throw new Error('صيغة ملف النسخ الاحتياطي غير صالحة.');
  }
  return normalizeProgress(parsed);
}
