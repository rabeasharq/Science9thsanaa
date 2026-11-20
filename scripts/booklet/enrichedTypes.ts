export interface EnrichedExperimentGuide {
  title: string;
  tools: string;
  steps: string[];
  observation: string;
  scientificExplanation: string;
  conclusion: string;
}

export interface EnrichedWorkedExample {
  problem: string;
  solutionSteps: string[];
}

export interface EnrichedLessonBookletData {
  /** الخلفية العلمية التأسيسية لمن يعاني ضعفاً ويصعب عليه فهم الدرس الجديد */
  foundation: string[];
  /** الشرح الموسّع السلس المغني عن الكتاب والمعلم */
  deepExplanation: string[];
  /** بطاقة التجربة العملية بالورق (الهدف، الأدوات، الخطوات، المشاهدة، التفسير، الاستنتاج) */
  experiment?: EnrichedExperimentGuide;
  /** مسائل محلولة خطوة بخطوة أو مقارنة تطبيقية */
  workedExamples?: EnrichedWorkedExample[];
  /** معرف الرسم التوضيحي المرتبط إن وُجد */
  diagramId?: string;
}
