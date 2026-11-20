export type BrickFace = 'largest' | 'medium' | 'smallest';

export interface SolidPressureInput {
  weightKgf: number; // الوزن بوحدة ث.كجم
  areaM2: number; // المساحة بوحدة م²
  standingOnOneFoot?: boolean; // عند إعطاء مساحة القدمين والوقوف على قدم واحدة
}

export interface SolidPressureResult {
  forceNewtons: number; // ق = ث.كجم × 10
  effectiveAreaM2: number;
  pressurePa: number; // ض = ق / م (نيوتن/م² = باسكال)
  pressureKgfPerM2: number; // ث.كجم/م² (لتوضيح التنبيه الوزاري مقابل ص80)
  sandDepthCm: number; // عمق الانغراس التمثيلي في الرمل
}

/**
 * يحسب الضغط في الأجسام الصلبة وفق القاعدة المعتمدة في التصحيح الوزاري:
 * 1 ث.كجم = 10 نيوتن
 * ض = ق / م
 */
export function calculateSolidPressure(input: SolidPressureInput): SolidPressureResult {
  const safeWeightKgf = Math.max(0.1, input.weightKgf);
  const safeArea = Math.max(0.001, input.areaM2);
  const effectiveAreaM2 = input.standingOnOneFoot ? safeArea / 2 : safeArea;
  const forceNewtons = Number((safeWeightKgf * 10).toFixed(2));
  const pressurePa = Number((forceNewtons / effectiveAreaM2).toFixed(2));
  const pressureKgfPerM2 = Number((safeWeightKgf / effectiveAreaM2).toFixed(2));
  // عمق نسبي محسوب طردياً مع الضغط ومقيد لنطاق محاكاة حوض الرمل (0.4 - 6.5 سم)
  const sandDepthCm = Number(Math.min(6.5, Math.max(0.4, pressurePa / 1200)).toFixed(2));

  return {
    forceNewtons,
    effectiveAreaM2: Number(effectiveAreaM2.toFixed(4)),
    pressurePa,
    pressureKgfPerM2,
    sandDepthCm,
  };
}

export function getBrickFaceAreaM2(face: BrickFace): {
  areaM2: number;
  dimensionsCm: string;
  labelAr: string;
} {
  // أبعاد قالب طوب قياسي: الطول 25 سم (0.25 م)، العرض 12 سم (0.12 م)، الارتفاع 8 سم (0.08 م)
  switch (face) {
    case 'largest':
      return {
        areaM2: 0.25 * 0.12, // 0.0300 م²
        dimensionsCm: '25 سم × 12 سم',
        labelAr: 'الوجه الأكبر مساحة (أ)',
      };
    case 'medium':
      return {
        areaM2: 0.25 * 0.08, // 0.0200 م²
        dimensionsCm: '25 سم × 8 سم',
        labelAr: 'الوجه المتوسط مساحة (ب)',
      };
    case 'smallest':
      return {
        areaM2: 0.12 * 0.08, // 0.0096 م²
        dimensionsCm: '12 سم × 8 سم',
        labelAr: 'الوجه الأصغر مساحة (ج)',
      };
  }
}

export type LiquidTypeId = 'pure-water' | 'salt-water' | 'oil' | 'mercury';

export interface LiquidSpec {
  id: LiquidTypeId;
  nameAr: string;
  densityKgM3: number;
  colorHex: string;
}

export const LIQUIDS_CATALOG: Record<LiquidTypeId, LiquidSpec> = {
  'pure-water': { id: 'pure-water', nameAr: 'ماء عذب', densityKgM3: 1000, colorHex: '#0ea5e9' },
  'salt-water': { id: 'salt-water', nameAr: 'ماء مالح', densityKgM3: 1030, colorHex: '#0284c7' },
  oil: { id: 'oil', nameAr: 'زيت نباتي', densityKgM3: 900, colorHex: '#eab308' },
  mercury: { id: 'mercury', nameAr: 'زئبق', densityKgM3: 13600, colorHex: '#94a3b8' },
};

export interface LiquidPressureResult {
  pressurePa: number; // ض = ث × د × ع (مع ج = 10 م/ث²)
  membraneDeflectionMm: number;
  ratioTo1mWater: number;
}

export function calculateLiquidPressure(liquidId: LiquidTypeId, depthMeters: number): LiquidPressureResult {
  const spec = LIQUIDS_CATALOG[liquidId];
  const g = 10; // عجلة الجاذبية المعتمدة في منهج التاسع
  const safeDepth = Math.max(0, depthMeters);
  const pressurePa = Number((spec.densityKgM3 * g * safeDepth).toFixed(1));
  const membraneDeflectionMm = Number(Math.min(28, (pressurePa / 15000) * 10).toFixed(1));
  const ratioTo1mWater = Number((pressurePa / 10000).toFixed(2));
  return { pressurePa, membraneDeflectionMm, ratioTo1mWater };
}

export interface CityBarometerPreset {
  id: string;
  nameAr: string;
  altitudeMeters: number;
}

export const YEMENI_CITIES_BAROMETER: CityBarometerPreset[] = [
  { id: 'sea-level', nameAr: 'مستوى سطح البحر (مرجع)', altitudeMeters: 0 },
  { id: 'hodeidah', nameAr: 'الحديدة / المخا / عدن (ساحلية)', altitudeMeters: 12 },
  { id: 'taiz', nameAr: 'تعز (الحوبان/المدينة)', altitudeMeters: 1400 },
  { id: 'sanaa', nameAr: 'صنعاء', altitudeMeters: 2250 },
  { id: 'dhamar', nameAr: 'ذمار', altitudeMeters: 2400 },
  { id: 'depression', nameAr: 'منخفض تحت مستوى سطح البحر', altitudeMeters: -150 },
];

export interface AtmosphericPressureResult {
  pressureMbar: number; // مللي بار
  pressurePa: number; // باسكال (1 مللي بار = 100 باسكال)
  mercuryColumnCm: number; // طول عمود الزئبق بالسم
  torricelliVacuumCm: number; // فراغ تورشللي في أنبوب طوله 100 سم
  relativeToSeaLevel: 'أعلى من 1013 مللي بار (منخفض)' | 'يساوي 1013 مللي بار (قياسي)' | 'أقل من 1013 مللي بار (مرتفع)';
}

export function calculateAtmosphericPressure(altitudeMeters: number, tempCelsius = 20): AtmosphericPressureResult {
  // نموذج تقريبي يتطابق مع قيم الكتاب: عند سطح البحر و20م = 1013 مللي بار = 76 سم زئبق
  // ينخفض الضغط بارتفاع السطح وبارتفاع الحرارة بشكل طفيف
  const tempAdjustment = (tempCelsius - 20) * 0.35;
  const rawMbar = 1013 * Math.exp(-altitudeMeters / 8400) - tempAdjustment;
  const pressureMbar = Number(Math.max(400, Math.min(1100, rawMbar)).toFixed(1));
  const pressurePa = Number((pressureMbar * 100).toFixed(0));
  const mercuryColumnCm = Number(((pressureMbar / 1013) * 76).toFixed(2));
  const torricelliVacuumCm = Number(Math.max(0, 100 - mercuryColumnCm).toFixed(2));

  let relativeToSeaLevel: AtmosphericPressureResult['relativeToSeaLevel'] = 'يساوي 1013 مللي بار (قياسي)';
  if (pressureMbar > 1013.5) {
    relativeToSeaLevel = 'أعلى من 1013 مللي بار (منخفض)';
  } else if (pressureMbar < 1012.5) {
    relativeToSeaLevel = 'أقل من 1013 مللي بار (مرتفع)';
  }

  return {
    pressureMbar,
    pressurePa,
    mercuryColumnCm,
    torricelliVacuumCm,
    relativeToSeaLevel,
  };
}

export function calculateBernoulliLift(airSpeedMps: number): {
  topPressureMbar: number;
  bottomPressureMbar: number;
  pressureDiffPa: number;
  liftAngleDeg: number;
} {
  // كلما زادت سرعة الهواء فوق الورقة/الجناح قل الضغط العلوي (مبدأ برنولي)
  const v = Math.max(0, Math.min(40, airSpeedMps));
  const rhoAir = 1.225;
  const pressureDiffPa = Number((0.5 * rhoAir * v * v).toFixed(1));
  const topPressureMbar = Number((1013 - pressureDiffPa / 100).toFixed(2));
  const bottomPressureMbar = 1013;
  const liftAngleDeg = Number(Math.min(38, v * 1.15).toFixed(1));
  return { topPressureMbar, bottomPressureMbar, pressureDiffPa, liftAngleDeg };
}

export function calculateSurfaceTension(forceNewtons: number, lengthMeters: number): number {
  const safeLen = Math.max(0.001, lengthMeters);
  return Number((forceNewtons / (2 * safeLen)).toFixed(4));
}
