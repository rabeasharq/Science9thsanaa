export type SolutionId =
  | 'hcl'
  | 'hno3'
  | 'h2so4'
  | 'h2co3'
  | 'ch3cooh'
  | 'lemon'
  | 'water'
  | 'nh4oh'
  | 'baoh2'
  | 'koh'
  | 'naoh'
  | 'cuoh2';

export type IndicatorId = 'tea' | 'litmus-blue' | 'litmus-red' | 'methyl-orange' | 'phenolphthalein' | 'universal';

export interface SolutionSpec {
  id: SolutionId;
  nameAr: string;
  formula: string;
  category: 'حمض قوي' | 'حمض ضعيف' | 'متعادل' | 'قاعدة ضعيفة' | 'قاعدة قوية' | 'قاعدة غير ذائبة';
  basePh: number;
  isStrong: boolean;
  solubleInWater: boolean;
  ionizationPercent: number; // 0-100
  dissociationEquation: string;
  cationLabel: string;
  anionLabel: string;
  everydaySource: string;
  conductivityLevel: number; // 0 to 1
}

export const SOLUTIONS_CATALOG: Record<SolutionId, SolutionSpec> = {
  hcl: {
    id: 'hcl',
    nameAr: 'حمض الهيدروكلوريك',
    formula: 'HCl',
    category: 'حمض قوي',
    basePh: 1.0,
    isStrong: true,
    solubleInWater: true,
    ionizationPercent: 98,
    dissociationEquation: 'HCl -> H+ + Cl-',
    cationLabel: 'H+',
    anionLabel: 'Cl-',
    everydaySource: 'العصارة المعدية في المعدة',
    conductivityLevel: 0.98,
  },
  hno3: {
    id: 'hno3',
    nameAr: 'حمض النيتريك',
    formula: 'HNO3',
    category: 'حمض قوي',
    basePh: 1.4,
    isStrong: true,
    solubleInWater: true,
    ionizationPercent: 95,
    dissociationEquation: 'HNO3 -> H+ + NO3-',
    cationLabel: 'H+',
    anionLabel: 'NO3-',
    everydaySource: 'منظفات الحمامات المركزة',
    conductivityLevel: 0.94,
  },
  h2so4: {
    id: 'h2so4',
    nameAr: 'حمض الكبريتيك',
    formula: 'H2SO4',
    category: 'حمض قوي',
    basePh: 1.2,
    isStrong: true,
    solubleInWater: true,
    ionizationPercent: 92,
    dissociationEquation: 'H2SO4 -> 2H+ + SO4^2-',
    cationLabel: 'H+',
    anionLabel: 'SO4^2-',
    everydaySource: 'محلول بطارية السيارة',
    conductivityLevel: 0.95,
  },
  h2co3: {
    id: 'h2co3',
    nameAr: 'حمض الكربونيك',
    formula: 'H2CO3',
    category: 'حمض ضعيف',
    basePh: 4.2,
    isStrong: false,
    solubleInWater: true,
    ionizationPercent: 18,
    dissociationEquation: 'H2CO3 <=> 2H+ + CO3^2-',
    cationLabel: 'H+',
    anionLabel: 'CO3^2-',
    everydaySource: 'المشروبات الغازية',
    conductivityLevel: 0.25,
  },
  ch3cooh: {
    id: 'ch3cooh',
    nameAr: 'حمض الخليك (الخل)',
    formula: 'CH3COOH',
    category: 'حمض ضعيف',
    basePh: 3.4,
    isStrong: false,
    solubleInWater: true,
    ionizationPercent: 12,
    dissociationEquation: 'CH3COOH <=> H+ + CH3COO-',
    cationLabel: 'H+',
    anionLabel: 'CH3COO-',
    everydaySource: 'الخل الطبيعي',
    conductivityLevel: 0.22,
  },
  lemon: {
    id: 'lemon',
    nameAr: 'عصير الليمون (حمض الستريك)',
    formula: 'C6H8O7',
    category: 'حمض ضعيف',
    basePh: 2.8,
    isStrong: false,
    solubleInWater: true,
    ionizationPercent: 20,
    dissociationEquation: 'C6H8O7 <=> H+ + C6H7O7-',
    cationLabel: 'H+',
    anionLabel: 'C6H7O7-',
    everydaySource: 'ثمار الليمون والحمضيات',
    conductivityLevel: 0.28,
  },
  water: {
    id: 'water',
    nameAr: 'الماء المقطر النقي',
    formula: 'H2O',
    category: 'متعادل',
    basePh: 7.0,
    isStrong: false,
    solubleInWater: true,
    ionizationPercent: 0.01,
    dissociationEquation: 'H2O <=> H+ + OH-',
    cationLabel: 'H+',
    anionLabel: 'OH-',
    everydaySource: 'ماء مقطر نقي خالٍ من الأملاح',
    conductivityLevel: 0.02,
  },
  nh4oh: {
    id: 'nh4oh',
    nameAr: 'هيدروكسيد الأمونيوم',
    formula: 'NH4OH',
    category: 'قاعدة ضعيفة',
    basePh: 10.6,
    isStrong: false,
    solubleInWater: true,
    ionizationPercent: 16,
    dissociationEquation: 'NH4OH <=> NH4+ + OH-',
    cationLabel: 'NH4+',
    anionLabel: 'OH-',
    everydaySource: 'سوائل تنظيف الزجاج والأسمدة',
    conductivityLevel: 0.26,
  },
  baoh2: {
    id: 'baoh2',
    nameAr: 'هيدروكسيد الباريوم',
    formula: 'Ba(OH)2',
    category: 'قاعدة قوية',
    basePh: 12.6,
    isStrong: true,
    solubleInWater: true,
    ionizationPercent: 85,
    dissociationEquation: 'Ba(OH)2 -> Ba^2+ + 2OH-',
    cationLabel: 'Ba^2+',
    anionLabel: 'OH-',
    everydaySource: 'كاشف مخبري للكربونات والكبريتات',
    conductivityLevel: 0.85,
  },
  koh: {
    id: 'koh',
    nameAr: 'هيدروكسيد البوتاسيوم',
    formula: 'KOH',
    category: 'قاعدة قوية',
    basePh: 13.4,
    isStrong: true,
    solubleInWater: true,
    ionizationPercent: 96,
    dissociationEquation: 'KOH -> K+ + OH-',
    cationLabel: 'K+',
    anionLabel: 'OH-',
    everydaySource: 'صناعة الصابون اللين والبطاريات القلوية',
    conductivityLevel: 0.96,
  },
  naoh: {
    id: 'naoh',
    nameAr: 'هيدروكسيد الصوديوم (الصودا الكاوية)',
    formula: 'NaOH',
    category: 'قاعدة قوية',
    basePh: 13.8,
    isStrong: true,
    solubleInWater: true,
    ionizationPercent: 98,
    dissociationEquation: 'NaOH -> Na+ + OH-',
    cationLabel: 'Na+',
    anionLabel: 'OH-',
    everydaySource: 'صناعة الصابون الصلب ومفتح المصارف',
    conductivityLevel: 0.98,
  },
  cuoh2: {
    id: 'cuoh2',
    nameAr: 'هيدروكسيد النحاس (راسب أزرق)',
    formula: 'Cu(OH)2',
    category: 'قاعدة غير ذائبة',
    basePh: 7.2,
    isStrong: false,
    solubleInWater: false,
    ionizationPercent: 0.1,
    dissociationEquation: 'Cu(OH)2 (s) -> لا يذوب في الماء',
    cationLabel: 'Cu^2+',
    anionLabel: 'OH-',
    everydaySource: 'مثال مهم على قاعدة لا تذوب في الماء (لا تُعد قلوياً)',
    conductivityLevel: 0.03,
  },
};

export interface IndicatorResult {
  indicatorId: IndicatorId;
  indicatorName: string;
  colorHex: string;
  colorLabel: string;
  mediumDescription: string;
}

export function computeEffectivePh(solutionId: SolutionId, dilutionFactor: number): number {
  const spec = SOLUTIONS_CATALOG[solutionId];
  const clampedDilution = Math.max(0, Math.min(0.95, dilutionFactor));
  if (spec.basePh === 7 || !spec.solubleInWater) return spec.basePh;
  // Dilution shifts pH gradually toward 7 without crossing 7
  const shifted = spec.basePh + (7 - spec.basePh) * (clampedDilution * 0.35);
  return Number(shifted.toFixed(1));
}

export function evaluateIndicator(indicatorId: IndicatorId, ph: number): IndicatorResult {
  const isAcid = ph < 6.7;
  const isBase = ph > 7.3;

  switch (indicatorId) {
    case 'tea':
      if (isAcid) {
        return {
          indicatorId,
          indicatorName: 'الشاي الأحمر',
          colorHex: '#eab308',
          colorLabel: 'أصفر فاتح',
          mediumDescription: 'يفتح لون الشاي ويصفر عند إضافة الحمض',
        };
      }
      if (isBase) {
        return {
          indicatorId,
          indicatorName: 'الشاي الأحمر',
          colorHex: '#451a03',
          colorLabel: 'بني داكن مسودّ',
          mediumDescription: 'يغمق لون الشاي ويميل للبني الداكن مع القاعدة',
        };
      }
      return {
        indicatorId,
        indicatorName: 'الشاي الأحمر',
        colorHex: '#991b1b',
        colorLabel: 'أحمر شاي طبيعي',
        mediumDescription: 'الوسط متعادل ولا يتغير لون الشاي',
      };

    case 'litmus-blue':
      if (isAcid) {
        return {
          indicatorId,
          indicatorName: 'ورقة دوار الشمس الزرقاء',
          colorHex: '#dc2626',
          colorLabel: 'تتحول إلى الأحمر',
          mediumDescription: 'الحموض تحوّل ورقة دوار الشمس الزرقاء إلى اللون الأحمر',
        };
      }
      return {
        indicatorId,
        indicatorName: 'ورقة دوار الشمس الزرقاء',
        colorHex: '#2563eb',
        colorLabel: 'تبقى زرقاء',
        mediumDescription: isBase ? 'القاعدة تبقي الورقة الزرقاء زرقاء' : 'الوسط المتعادل لا يغيّر لون الورقة',
      };

    case 'litmus-red':
      if (isBase) {
        return {
          indicatorId,
          indicatorName: 'ورقة دوار الشمس الحمراء',
          colorHex: '#2563eb',
          colorLabel: 'تتحول إلى الأزرق',
          mediumDescription: 'القواعد الذائبة تحوّل ورقة دوار الشمس الحمراء إلى اللون الأزرق',
        };
      }
      return {
        indicatorId,
        indicatorName: 'ورقة دوار الشمس الحمراء',
        colorHex: '#dc2626',
        colorLabel: 'تبقى حمراء',
        mediumDescription: isAcid ? 'الحمض يبقي الورقة الحمراء حمراء' : 'الوسط المتعادل لا يغيّر لون الورقة',
      };

    case 'methyl-orange':
      if (isAcid) {
        return {
          indicatorId,
          indicatorName: 'الميثيل البرتقالي',
          colorHex: '#ef4444',
          colorLabel: 'أحمر',
          mediumDescription: 'في الوسط الحمضي يعطي الميثيل البرتقالي لوناً أحمر',
        };
      }
      if (isBase) {
        return {
          indicatorId,
          indicatorName: 'الميثيل البرتقالي',
          colorHex: '#facc15',
          colorLabel: 'أصفر',
          mediumDescription: 'في الوسط القاعدي يعطي الميثيل البرتقالي لوناً أصفر',
        };
      }
      return {
        indicatorId,
        indicatorName: 'الميثيل البرتقالي',
        colorHex: '#f97316',
        colorLabel: 'برتقالي',
        mediumDescription: 'في الوسط المتعادل يبقى لونه برتقالياً',
      };

    case 'phenolphthalein':
      if (isBase) {
        return {
          indicatorId,
          indicatorName: 'الفينولفثالين',
          colorHex: '#db2777',
          colorLabel: 'أحمر وردي / بنفسجي',
          mediumDescription: 'يتحول الفينولفثالين في الوسط القاعدي إلى اللون الأحمر الوردي',
        };
      }
      return {
        indicatorId,
        indicatorName: 'الفينولفثالين',
        colorHex: '#e2e8f0',
        colorLabel: 'عديم اللون',
        mediumDescription: isAcid
          ? 'في الوسط الحمضي يكون الفينولفثالين عديم اللون (مصيدة وزارية شائعة)'
          : 'في الوسط المتعادل يكون عديم اللون',
      };

    case 'universal':
    default:
      return {
        indicatorId: 'universal',
        indicatorName: 'الكاشف العام (pH)',
        colorHex: phColorHex(ph),
        colorLabel: `درجة pH = ${ph}`,
        mediumDescription:
          ph < 7 ? 'وسط حمضي' : ph > 7 ? 'وسط قاعدي' : 'وسط متعادل تماماً ([H+] = [OH-])',
      };
  }
}

export function phColorHex(ph: number): string {
  const clamped = Math.max(0, Math.min(14, Math.round(ph)));
  const palette: Record<number, string> = {
    0: '#b91c1c',
    1: '#dc2626',
    2: '#ea580c',
    3: '#f97316',
    4: '#f59e0b',
    5: '#eab308',
    6: '#84cc16',
    7: '#22c55e',
    8: '#10b981',
    9: '#06b6d4',
    10: '#0ea5e9',
    11: '#2563eb',
    12: '#4f46e5',
    13: '#7c3aed',
    14: '#6b21a8',
  };
  return palette[clamped] ?? '#22c55e';
}

export function getIonicCounts(solutionId: SolutionId, dilutionFactor: number): {
  hPlusCount: number;
  ohMinusCount: number;
  intactMoleculeCount: number;
  effectiveConductivity: number;
} {
  const spec = SOLUTIONS_CATALOG[solutionId];
  if (!spec.solubleInWater) {
    return { hPlusCount: 1, ohMinusCount: 1, intactMoleculeCount: 16, effectiveConductivity: 0.03 };
  }
  if (solutionId === 'water') {
    return { hPlusCount: 2, ohMinusCount: 2, intactMoleculeCount: 18, effectiveConductivity: 0.02 };
  }
  const scale = 1 - Math.min(0.6, dilutionFactor * 0.5);
  const totalParticles = 20;
  const ionized = Math.max(2, Math.round((spec.ionizationPercent / 100) * totalParticles * scale));
  const intact = Math.max(0, totalParticles - ionized);
  const isAcid = spec.basePh < 7;
  return {
    hPlusCount: isAcid ? ionized : 1,
    ohMinusCount: isAcid ? 1 : ionized,
    intactMoleculeCount: intact,
    effectiveConductivity: Number((spec.conductivityLevel * scale).toFixed(2)),
  };
}
