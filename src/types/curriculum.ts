export type SkillTag =
  | 'حفظ مصطلح'
  | 'تفسير ظاهرة'
  | 'تطبيق قانون وتحويل وحدات'
  | 'قراءة رسم/معادلة'
  | 'استنتاج';

export type LessonStatus = 'completed' | 'upcoming';

export type LabId =
  | 'acids-bases-3d'
  | 'pressure-3d'
  | 'magnetism-dynamo-3d'
  | 'capillary-surface-3d'
  | 'oil-co2-3d'
  | 'anatomy-kidney-flower-3d';

export interface LessonIndexEntry {
  id: string;
  unitId: number;
  lessonNumber: number;
  title: string;
  pageNumber: number;
  status: LessonStatus;
  labId?: LabId;
}

export interface UnitIndexEntry {
  id: number;
  part: 1 | 2;
  title: string;
  pageNumber: number;
  domain: 'كيمياء' | 'فيزياء' | 'أحياء وصحة' | 'علوم الأرض والفضاء';
  status: LessonStatus;
  labId?: LabId;
  lessons: LessonIndexEntry[];
}

export interface ChemFormulaToken {
  type: 'text' | 'chem' | 'formula';
  value: string;
}

export interface TextbookConceptCard {
  id: string;
  title: string;
  textbookContent: string;
  textbookPage?: string;
  extraExplanation: string;
  ministerialNuance?: string;
  formulaLatex?: string;
  chemEquationLatex?: string;
}

export interface LabLevelChallenge {
  level: 1 | 2 | 3 | 4;
  title: string;
  instruction: string;
  predictPrompt?: string;
  predictOptions?: string[];
  correctPredictIndex?: number;
  postExplanation: string;
  simulationModelNote: string;
}

export interface PracticeQuestion {
  id: string;
  unitId: number;
  lessonId: string;
  type: 'tf' | 'mcq';
  sourceType: 'ministerial' | 'skill-practice';
  sourceLabel: string; // e.g. "نموذج وزاري 1446هـ - ص40 س50" or "تدريب إضافي يقيس المهارة"
  skill: SkillTag;
  prompt: string;
  diagramHint?: string;
  options: string[]; // For 'tf': ['صح', 'خطأ'], for 'mcq': 4 choices
  correctIndex: number;
  explanation: string;
  ministerialNuance?: string;
}

export interface LessonCalculatorConfig {
  id: string;
  title: string;
  formulaLatex: string;
  description: string;
  stepsHint: string[];
}

export interface DetailedLessonContent {
  lessonId: string;
  unitId: number;
  title: string;
  pageRef: string;
  labId?: LabId;
  simulationModel: {
    scope: string;
    assumptions: string;
  };
  prerequisites: string[];
  step1Discover: {
    scenario: string;
    question: string;
    options: string[];
    correctIndex: number;
    revealExplanation: string;
  };
  step2Understand: {
    concepts: TextbookConceptCard[];
    glossary: { term: string; definition: string; pageRef?: string }[];
  };
  step3Experiment: {
    levels: LabLevelChallenge[];
  };
  step4Conclude: {
    summaryLaw: string;
    lawLatex?: string;
    keyTakeaways: string[];
  };
  calculators: LessonCalculatorConfig[];
  step5Verify: PracticeQuestion[];
  step6Master: PracticeQuestion[];
  step7Review: {
    mustRemember: string[];
    commonTraps: string[];
  };
}
