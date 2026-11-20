import React, { useState } from 'react';
import {
  Atom,
  Dna,
  Droplets,
  Flame,
  FlaskConical,
  HeartPulse,
  Layers,
  Magnet,
  Orbit,
  Scale,
} from 'lucide-react';
import { LabId, LabOpenContext } from '../../types/curriculum';
import { AcidsBasesLab3D } from '../../labs/AcidsBasesLab3D';
import { PressureLab3D } from '../../labs/PressureLab3D';
import { MagnetismDynamoLab3D } from '../../labs/MagnetismDynamoLab3D';
import { CapillarySurfaceLab3D } from '../../labs/CapillarySurfaceLab3D';
import { OilDistillationCO2Lab3D } from '../../labs/OilDistillationCO2Lab3D';
import { AnatomyKidneyFlowerLab3D } from '../../labs/AnatomyKidneyFlowerLab3D';
import {
  Lesson2DSimulations,
  OTHER_UNITS_2D_BRANCHES,
  SIMULATIONS_2D_BY_LAB,
} from '../lesson/Lesson2DSimulations';

interface LabsHubViewProps {
  activeLabId: LabId;
  labContext?: LabOpenContext;
  onSelectLab: (labId: LabId) => void;
  onLabLevelInteract: (labId: string, level: number) => void;
}

const LAB_CARDS: {
  id: LabId;
  title: string;
  unitLabel: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}[] = [
  {
    id: 'acids-bases-3d',
    title: 'معمل الحموض والقواعد والكواشف الأربعة',
    unitLabel: 'الوحدة 2',
    summary: 'مقياس pH، الرؤية الأيونية H+/OH-، التوصيل الكهربائي، وسلامة التخفيف.',
    icon: FlaskConical,
    tone: 'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300',
  },
  {
    id: 'magnetism-dynamo-3d',
    title: 'معمل المغناطيسية والدينامو 3D',
    unitLabel: 'الوحدة 5',
    summary: 'خطوط الفيض، البوصلة، الدينامو، الدوائر الكهربائية للجرس والتمغنط والمحول.',
    icon: Magnet,
    tone: 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300',
  },
  {
    id: 'anatomy-kidney-flower-3d',
    title: 'معمل التشريح التفاعلي (الكلية والزهرة 2D / 3D)',
    unitLabel: 'الوحدتان 6 و 7',
    summary: 'قطاع تشريحي 2D واضح للكلية والزهرة + محاكاة النيفرون والإخصاب واللقاح والجلد والأميبا.',
    icon: HeartPulse,
    tone: 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300',
  },
  {
    id: 'oil-co2-3d',
    title: 'معمل تقطير النفط وغاز CO₂',
    unitLabel: 'الوحدة 9',
    summary: 'برج التقطير 3D، إطفاء الشموع بـ CO₂، الأكاسيد، الصدأ، ودائرة الجرافيت، والتلوث الصناعي.',
    icon: Flame,
    tone: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300',
  },
  {
    id: 'capillary-surface-3d',
    title: 'معمل الخاصية الشعرية والشد السطحي',
    unitLabel: 'الوحدة 11',
    summary: 'الماء مقابل الزئبق، طفو الإبرة، خواص الصلب، الجريان واللزوجة والانتشار.',
    icon: Droplets,
    tone: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300',
  },
  {
    id: 'pressure-3d',
    title: 'معمل الضغط والموائع والبارومتر وبرنولي',
    unitLabel: 'الوحدة 12',
    summary: 'قالب الطوب على الرمل 3D، ضغط السوائل، البارومتر الزئبقي، ومبدأ برنولي.',
    icon: Scale,
    tone: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300',
  },
];

const BRANCH_ICONS: Record<'chem' | 'space-solar' | 'genetics', React.ComponentType<{ className?: string }>> = {
  chem: Atom,
  'space-solar': Orbit,
  genetics: Dna,
};

export const LabsHubView: React.FC<LabsHubViewProps> = ({
  activeLabId,
  labContext,
  onSelectLab,
  onLabLevelInteract,
}) => {
  const [activeBranch, setActiveBranch] = useState<'chem' | 'space-solar' | 'genetics'>('chem');
  const attached2DSims = SIMULATIONS_2D_BY_LAB[activeLabId] ?? [];
  const activeLabMeta = LAB_CARDS.find((l) => l.id === activeLabId);
  const selectedBranchGroup =
    OTHER_UNITS_2D_BRANCHES.find((b) => b.branchId === activeBranch) ?? OTHER_UNITS_2D_BRANCHES[0];

  const preferredDefaultIndex =
    activeLabId === 'anatomy-kidney-flower-3d' && labContext?.anatomyModel === 'flower'
      ? Math.max(0, attached2DSims.findIndex((item) => item.lessonId.startsWith('u7-')))
      : activeLabId === 'oil-co2-3d' && labContext?.oilStation === 'co2'
        ? Math.max(0, attached2DSims.findIndex((item) => item.lessonId === 'u9-l4'))
        : activeLabId === 'magnetism-dynamo-3d' && labContext?.magnetStation === 'dynamo'
          ? Math.max(0, attached2DSims.findIndex((item) => item.lessonId === 'u5-l3'))
          : 0;

  return (
    <div className="space-y-6">
      {/* القسم الأول: المعامل التفاعلية الستة */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-5">
        <div className="flex items-center gap-2.5 font-extrabold text-slate-900 dark:text-white text-lg">
          <div className="w-9 h-9 rounded-xl bg-teal-50/90 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center">
            <FlaskConical className="w-5 h-5" />
          </div>
          <span>القسم الأول: المختبرات التفاعلية الرئيسية (6 معامل 3D و 2D)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {LAB_CARDS.map((lab) => {
            const active = activeLabId === lab.id;
            const Icon = lab.icon;
            const extraCount = (SIMULATIONS_2D_BY_LAB[lab.id] ?? []).length;
            return (
              <button
                key={lab.id}
                type="button"
                onClick={() => onSelectLab(lab.id)}
                className={`text-right rounded-2xl border p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                  active
                    ? 'border-teal-600 bg-teal-50/80 dark:bg-teal-950/55'
                    : 'border-slate-200/80 dark:border-slate-700/70 bg-white/55 dark:bg-slate-950/50 hover:bg-white/80 dark:hover:bg-slate-800/75'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${lab.tone}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">{lab.unitLabel}</span>
                    {extraCount > 0 && (
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        +{extraCount} رسوم 2D
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 leading-snug">
                    {lab.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{lab.summary}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active 3D Lab Stage */}
      {activeLabId === 'acids-bases-3d' && (
        <AcidsBasesLab3D onLevelInteract={(lvl) => onLabLevelInteract('acids-bases-3d', lvl)} />
      )}
      {activeLabId === 'pressure-3d' && (
        <PressureLab3D
          initialMode={labContext?.pressureMode ?? 'solid'}
          onLevelInteract={(lvl) => onLabLevelInteract('pressure-3d', lvl)}
        />
      )}
      {activeLabId === 'magnetism-dynamo-3d' && (
        <MagnetismDynamoLab3D
          initialStation={labContext?.magnetStation ?? 'compass'}
          onLevelInteract={(lvl) => onLabLevelInteract('magnetism-dynamo-3d', lvl)}
        />
      )}
      {activeLabId === 'capillary-surface-3d' && (
        <CapillarySurfaceLab3D
          initialFocus={labContext?.capillaryFocus ?? 'both'}
          onLevelInteract={(lvl) => onLabLevelInteract('capillary-surface-3d', lvl)}
        />
      )}
      {activeLabId === 'oil-co2-3d' && (
        <OilDistillationCO2Lab3D
          initialStation={labContext?.oilStation ?? 'distillation'}
          onLevelInteract={(lvl) => onLabLevelInteract('oil-co2-3d', lvl)}
        />
      )}
      {activeLabId === 'anatomy-kidney-flower-3d' && (
        <AnatomyKidneyFlowerLab3D
          initialModel={labContext?.anatomyModel ?? 'kidney'}
          onLevelInteract={(lvl) => onLabLevelInteract('anatomy-kidney-flower-3d', lvl)}
        />
      )}

      {/* الرسوم والدوائر التابعة فقط لوحدة المعمل النشط */}
      {attached2DSims.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
              <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>
                الرسوم التفاعلية والدوائر الملحقة بـ ({activeLabMeta?.unitLabel ?? ''})
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              اضغط «فتح» أو «طيّ» لعرض التجربة الملحقة دون ازدحام الشاشة
            </span>
          </div>

          <div className="space-y-2.5">
            {attached2DSims.map((item, idx) => (
              <Lesson2DSimulations
                key={`${activeLabId}-${item.lessonId}-${preferredDefaultIndex}`}
                lessonId={item.lessonId}
                defaultOpen={idx === preferredDefaultIndex}
                titleOverride={`${item.unitLabel}: ${item.title}`}
                subtitleOverride={item.subtitle}
              />
            ))}
          </div>
        </div>
      )}

      {/* القسم الثاني: المحاكيات التفاعلية والدوائر الكهربائية للوحدات الأخرى حسب فروعها الصحيحة */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/62 dark:bg-slate-900/68 backdrop-blur-md p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              القسم الثاني: مختبرات المحاكاة والدوائر للوحدات الأخرى (1، 3، 4، 8، 10، 13، 14، 15، 16)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              مصنّفة حسب الفرع العلمي والوحدة الدراسية الخاصة بها بكل دقة.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            {OTHER_UNITS_2D_BRANCHES.map((branch) => {
              const Icon = BRANCH_ICONS[branch.branchId];
              const isSelected = activeBranch === branch.branchId;
              return (
                <button
                  key={branch.branchId}
                  type="button"
                  onClick={() => setActiveBranch(branch.branchId)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 font-bold cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-teal-700 text-white'
                      : 'bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-teal-50/70 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{branch.unitsLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-xs font-bold text-teal-800 dark:text-teal-300">
          {selectedBranchGroup.branchTitle}
        </div>

        <div className="space-y-2.5">
          {selectedBranchGroup.items.map((item, idx) => (
            <Lesson2DSimulations
              key={`branch-${selectedBranchGroup.branchId}-${item.lessonId}`}
              lessonId={item.lessonId}
              defaultOpen={idx === 0}
              titleOverride={`${item.unitLabel}: ${item.title}`}
              subtitleOverride={item.subtitle}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
