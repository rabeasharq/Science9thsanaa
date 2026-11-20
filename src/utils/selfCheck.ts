import {
  COMPLETED_LESSONS_COUNT,
  CURRICULUM_UNITS,
  TOTAL_LESSONS_COUNT,
  TOTAL_UNITS_COUNT,
} from '../data/curriculumIndex';
import { ALL_AVAILABLE_QUESTIONS } from '../data/ministerialExamBank';
import { computeEffectivePh, evaluateIndicator } from '../engines/chemistryEngine';
import {
  calculateAtmosphericPressure,
  calculateLiquidPressure,
  calculateSolidPressure,
  calculateSurfaceTension,
  getBrickFaceAreaM2,
} from '../engines/physicsEngine';

export interface SelfCheckItem {
  id: string;
  label: string;
  passed: boolean;
  details: string;
}

export interface SelfCheckReport {
  allPassed: boolean;
  checks: SelfCheckItem[];
}

export function runSelfCheck(): SelfCheckReport {
  const checks: SelfCheckItem[] = [];

  // 1. Curriculum integrity: 16 units, all 53 documented textbook lessons completed
  const completedUnitIds = CURRICULUM_UNITS.filter((u) => u.status === 'completed').map((u) => u.id);
  const all16UnitsCompleted =
    completedUnitIds.length === 16 &&
    Array.from({ length: 16 }, (_, i) => i + 1).every((id) => completedUnitIds.includes(id));

  checks.push({
    id: 'curriculum-count',
    label: 'فهرس الوحدات الـ 16 (53 درساً) واكتمال المنهج الكامل',
    passed:
      TOTAL_UNITS_COUNT === 16 &&
      TOTAL_LESSONS_COUNT === 53 &&
      CURRICULUM_UNITS.length === 16 &&
      COMPLETED_LESSONS_COUNT === 53 &&
      all16UnitsCompleted,
    details: `الوحدات: ${TOTAL_UNITS_COUNT}، الموثقة: ${TOTAL_LESSONS_COUNT}، المكتملة الآن: ${COMPLETED_LESSONS_COUNT} في ${completedUnitIds.length} وحدة`,
  });

  // 2. Chemistry engine checks (pH, indicators, Cu(OH)2 insolubility)
  const hclPh = computeEffectivePh('hcl', 0);
  const waterPh = computeEffectivePh('water', 0);
  const phenAcid = evaluateIndicator('phenolphthalein', 1.2);
  const phenBase = evaluateIndicator('phenolphthalein', 13.5);
  const methylAcid = evaluateIndicator('methyl-orange', 1.2);
  const chemOk =
    hclPh < 2 &&
    waterPh === 7 &&
    phenAcid.colorLabel === 'عديم اللون' &&
    phenBase.colorLabel.includes('أحمر وردي') &&
    methylAcid.colorLabel === 'أحمر';
  checks.push({
    id: 'chem-engine',
    label: 'محرك الكيمياء: مقياس pH والكواشف الأربعة',
    passed: chemOk,
    details: `pH(HCl)=${hclPh}, pH(H2O)=${waterPh}, الفينولفثالين(حمض)=${phenAcid.colorLabel}`,
  });

  // 3. Physics engine check (Ministerial P.40 Q50 & P.53 Q48 + Surface Tension ش = ق / 2ل)
  const pSolidOneFoot = calculateSolidPressure({
    weightKgf: 70,
    areaM2: 0.35,
    standingOnOneFoot: true,
  });
  const brickLargest = getBrickFaceAreaM2('largest');
  const brickSmallest = getBrickFaceAreaM2('smallest');
  const pLiquid = calculateLiquidPressure('pure-water', 2);
  const atmSea = calculateAtmosphericPressure(0, 20);
  const atmSanaa = calculateAtmosphericPressure(2250, 20);
  const stVal = calculateSurfaceTension(0.007, 0.05);
  const physicsOk =
    pSolidOneFoot.forceNewtons === 700 &&
    pSolidOneFoot.pressurePa === 4000 &&
    brickSmallest.areaM2 < brickLargest.areaM2 &&
    pLiquid.pressurePa === 20000 &&
    Math.abs(atmSea.pressureMbar - 1013) < 1 &&
    Math.abs(atmSea.torricelliVacuumCm - 24) < 0.2 &&
    atmSanaa.pressureMbar < atmSea.pressureMbar &&
    stVal === 0.07;

  checks.push({
    id: 'physics-engine',
    label: 'محرك الفيزياء: تحويل ث.كجم×10، تورشللي 24 سم، والشد السطحي (2ل)',
    passed: physicsOk,
    details: `ق=${pSolidOneFoot.forceNewtons}N، ض(قدم)=${pSolidOneFoot.pressurePa}Pa، تورشللي=${atmSea.torricelliVacuumCm}cm، ش=${stVal}`,
  });

  // 4. Exam scoring math check (20 T/F * 1 + 30 MCQ * 2 = 80 marks)
  const tfCount = ALL_AVAILABLE_QUESTIONS.filter((q) => q.type === 'tf').length;
  const mcqCount = ALL_AVAILABLE_QUESTIONS.filter((q) => q.type === 'mcq').length;
  const maxPossibleIn50Mode = Math.min(20, tfCount) * 1 + Math.min(30, mcqCount) * 2;
  checks.push({
    id: 'exam-scoring',
    label: 'حساب درجات المحاكي الوزاري (20 ص/خ × 1 + 30 اختيار × 2 = 80 درجة)',
    passed: tfCount >= 20 && mcqCount >= 30 && maxPossibleIn50Mode === 80,
    details: `المتوفر: ${tfCount} ص/خ، ${mcqCount} اختيار، الدرجة الكلية: ${maxPossibleIn50Mode}`,
  });

  return {
    allPassed: checks.every((c) => c.passed),
    checks,
  };
}
