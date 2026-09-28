import React, { useState } from 'react';
import {
  PracticalApplication,
  PracticalCalculationStep,
  PracticalSubjectCategory,
} from '../types/lessonPlan';
import {
  Calculator,
  Zap,
  FlaskConical,
  PenTool,
  Laptop,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  Play,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Eye,
  EyeOff,
  Edit3,
  Plus,
  Trash2,
} from 'lucide-react';

interface PracticalApplicationSectionProps {
  practicalApplication?: PracticalApplication;
  isEditing?: boolean;
  isPrintFriendly?: boolean;
  embeddedInStep?: boolean;
  onChange?: (updated: PracticalApplication) => void;
}

export const PracticalApplicationSection: React.FC<PracticalApplicationSectionProps> = ({
  practicalApplication,
  isEditing = false,
  isPrintFriendly = false,
  embeddedInStep = false,
  onChange,
}) => {
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [showInteractiveSandbox, setShowInteractiveSandbox] = useState(false);

  // Interactive Sandbox states for live demonstration in class
  // 1. Math Quadratic Sandbox (ax² + bx + c = 0)
  const [mathA, setMathA] = useState(1);
  const [mathB, setMathB] = useState(-5);
  const [mathC, setMathC] = useState(6);

  // 2. Physics Ohm Sandbox (U = R * I)
  const [physU, setPhysU] = useState(220);
  const [physR, setPhysR] = useState(44);

  // 3. Chemistry Concentration Sandbox (C = n / V)
  const [chemM, setChemM] = useState(8);
  const [chemMolarMass, setChemMolarMass] = useState(40);
  const [chemVmL, setChemVmL] = useState(500);

  // 4. ICT Excel Sandbox
  const [ictScore1, setIctScore1] = useState(85);
  const [ictScore2, setIctScore2] = useState(78);
  const [ictScore3, setIctScore3] = useState(92);

  if (!practicalApplication) {
    return null;
  }

  const {
    title,
    subjectCategory,
    topic,
    problemStatement,
    givenDataOrContext = [],
    formulasOrRules = [],
    steps = [],
    finalResult,
    studentPracticeTask,
  } = practicalApplication;

  // Handlers for edit mode
  const handleUpdateField = <K extends keyof PracticalApplication>(
    field: K,
    value: PracticalApplication[K]
  ) => {
    if (!onChange) return;
    onChange({
      ...practicalApplication,
      [field]: value,
    });
  };

  const handleStepChange = (
    index: number,
    field: keyof PracticalCalculationStep,
    val: string
  ) => {
    if (!onChange) return;
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      [field]: val,
    };
    handleUpdateField('steps', newSteps);
  };

  const handleAddStep = () => {
    if (!onChange) return;
    const newStep: PracticalCalculationStep = {
      stepNumber: `ជំហានទី ${steps.length + 1}`,
      stepName: 'ដំណាក់កាលថ្មី',
      operationOrCode: '',
      explanation: 'សរសេរការបកស្រាយគរុកោសល្យ...',
    };
    handleUpdateField('steps', [...steps, newStep]);
  };

  const handleRemoveStep = (index: number) => {
    if (!onChange) return;
    const newSteps = steps.filter((_, i) => i !== index);
    handleUpdateField('steps', newSteps);
  };

  // Subject theme styling
  const getSubjectTheme = (cat: PracticalSubjectCategory) => {
    switch (cat) {
      case 'math':
        return {
          label: 'គណិតវិទ្យា៖ ប្រមាណវិធីគណនា',
          icon: <Calculator className="w-4 h-4" />,
          accentBg: 'bg-blue-50 border-blue-200 text-blue-800',
          badgeBg: 'bg-blue-600 text-white',
          borderAccent: 'border-blue-400',
          formulaBg: 'bg-blue-950 text-blue-100',
          chipColor: 'bg-blue-100 text-blue-900 border-blue-300',
        };
      case 'physics':
        return {
          label: 'រូបវិទ្យា៖ រូបមន្ត និងខ្នាតអន្តរជាតិ SI',
          icon: <Zap className="w-4 h-4" />,
          accentBg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
          badgeBg: 'bg-indigo-600 text-white',
          borderAccent: 'border-indigo-400',
          formulaBg: 'bg-slate-900 text-indigo-100',
          chipColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
        };
      case 'chemistry':
        return {
          label: 'គីមីវិទ្យា៖ សមីការ និងលំហាត់គណនាបង្ហាញ',
          icon: <FlaskConical className="w-4 h-4" />,
          accentBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          badgeBg: 'bg-emerald-700 text-white',
          borderAccent: 'border-emerald-400',
          formulaBg: 'bg-emerald-950 text-emerald-100',
          chipColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        };
      case 'khmer':
        return {
          label: 'ភាសាខ្មែរ៖ គម្រោងតែងសេចក្ដី និងវេយ្យាករណ៍',
          icon: <PenTool className="w-4 h-4" />,
          accentBg: 'bg-amber-50 border-amber-200 text-amber-900',
          badgeBg: 'bg-amber-700 text-white',
          borderAccent: 'border-amber-400',
          formulaBg: 'bg-amber-950 text-amber-100',
          chipColor: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'ict':
        return {
          label: 'ICT៖ រូបមន្ត និងវាក្យសម្ព័ន្ធកូដ',
          icon: <Laptop className="w-4 h-4" />,
          accentBg: 'bg-cyan-50 border-cyan-200 text-cyan-900',
          badgeBg: 'bg-cyan-700 text-white',
          borderAccent: 'border-cyan-400',
          formulaBg: 'bg-slate-900 text-cyan-100',
          chipColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
        };
      default:
        return {
          label: 'ការអនុវត្តជាក់ស្ដែងតាមប្រធានបទ',
          icon: <Sparkles className="w-4 h-4" />,
          accentBg: 'bg-slate-50 border-slate-200 text-slate-800',
          badgeBg: 'bg-slate-700 text-white',
          borderAccent: 'border-slate-400',
          formulaBg: 'bg-slate-900 text-slate-100',
          chipColor: 'bg-slate-100 text-slate-900 border-slate-300',
        };
    }
  };

  const theme = getSubjectTheme(subjectCategory);

  // Live calculation helpers for Sandbox
  const mathDelta = mathB * mathB - 4 * mathA * mathC;
  const mathHasRoots = mathDelta >= 0;
  const mathX1 = mathHasRoots && mathA !== 0 ? ((-mathB - Math.sqrt(mathDelta)) / (2 * mathA)).toFixed(2) : null;
  const mathX2 = mathHasRoots && mathA !== 0 ? ((-mathB + Math.sqrt(mathDelta)) / (2 * mathA)).toFixed(2) : null;

  const physI = physR > 0 ? (physU / physR).toFixed(2) : '0';
  const physP = (physU * parseFloat(physI)).toFixed(1);

  const chemMoles = chemMolarMass > 0 ? (chemM / chemMolarMass).toFixed(3) : '0';
  const chemVL = chemVmL > 0 ? chemVmL / 1000 : 0.001;
  const chemC = (parseFloat(chemMoles) / chemVL).toFixed(2);

  const ictTotal = ictScore1 + ictScore2 + ictScore3;
  const ictAvg = (ictTotal / 3).toFixed(2);
  const ictStatus = parseFloat(ictAvg) >= 50 ? 'ជាប់ (Passed)' : 'ធ្លាក់ (Failed)';

  return (
    <div
      className={`${
        embeddedInStep ? 'my-1 rounded-xl' : 'my-6 rounded-2xl'
      } transition-all duration-200 overflow-hidden ${
        isPrintFriendly
          ? 'border-2 border-black bg-white p-4 text-black'
          : embeddedInStep
            ? 'border border-blue-200 bg-white/95 shadow-sm p-4 sm:p-5'
            : 'border-2 border-indigo-200/80 bg-linear-to-b from-white to-slate-50/50 shadow-md p-5 sm:p-6'
      }`}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs ${
                isPrintFriendly ? 'border border-black text-black' : theme.badgeBg
              }`}
            >
              {theme.icon}
              <span>{theme.label}</span>
            </span>
            {embeddedInStep && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                ជំហានទី ៣ (មេរៀនថ្មី)
              </span>
            )}
            <span className="text-xs text-slate-500 font-medium">
              ស្តង់ដារអនុវត្តជាក់ស្ដែង MoEYS
            </span>
          </div>

          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => handleUpdateField('title', e.target.value)}
              className="mt-2 text-lg sm:text-xl font-bold text-slate-900 border-b border-blue-400 focus:outline-none w-full bg-blue-50/50 px-2 py-1 rounded"
            />
          ) : (
            <h3 className="mt-2 text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>{title}</span>
            </h3>
          )}

          <p className="text-xs text-slate-600 mt-1">
            ការអនុវត្តផ្ទាល់ស្របតាមប្រធានបទ «<strong className="text-slate-800">{topic}</strong>»
            ដោយមានប្រមាណវិធី រូបមន្ត គម្រោងតែង និងជំហានគណនាបង្ហាញយ៉ាងច្បាស់លាស់។
          </p>
        </div>

        {/* Live Simulator button (Hidden in print) */}
        {!isPrintFriendly && (
          <div className="no-print flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowInteractiveSandbox(!showInteractiveSandbox)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-2xs ${
                showInteractiveSandbox
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {showInteractiveSandbox ? 'បិទបន្ទប់សាកល្បង' : 'បន្ទប់សាកល្បងលេខ/រូបមន្តផ្ទាល់ (Live Sandbox)'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Sandbox Simulator Card (For In-Class Demonstration) */}
      {showInteractiveSandbox && !isPrintFriendly && (
        <div className="no-print mt-4 p-4 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-inner animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-amber-300">
                បន្ទប់ពិសោធន៍គណនា និងសាកល្បងរូបមន្តផ្ទាល់ (Live Calculation Sandbox)
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">
              លោកគ្រូ-អ្នកគ្រូអាចប្ដូរតួលេខដើម្បីបង្ហាញសិស្សលើក្ដារខៀនភ្លាមៗ
            </span>
          </div>

          <div className="mt-3">
            {subjectCategory === 'math' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  សាកល្បងផ្លាស់ប្ដូរមេគុណសមីការដឺក្រេទី ២៖ <span className="font-mono text-amber-400">ax² + bx + c = 0</span>
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400">មេគុណ a:</label>
                    <input
                      type="number"
                      value={mathA}
                      onChange={(e) => setMathA(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">មេគុណ b:</label>
                    <input
                      type="number"
                      value={mathB}
                      onChange={(e) => setMathB(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">មេគុណ c:</label>
                    <input
                      type="number"
                      value={mathC}
                      onChange={(e) => setMathC(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 text-sm font-mono"
                    />
                  </div>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-lg text-xs font-mono border border-slate-700 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <span className="text-slate-400">ឌីសគ្រីមីណង់ Δ = b² - 4ac:</span>{' '}
                    <strong className="text-amber-300">
                      ({mathB})² - 4({mathA})({mathC}) = {mathDelta}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">ស្ថានភាពឫស៖</span>{' '}
                    {mathDelta > 0 ? (
                      <span className="text-emerald-400">មានឫសពីរផ្សេងគ្នា (x₁ = {mathX1}, x₂ = {mathX2})</span>
                    ) : mathDelta === 0 ? (
                      <span className="text-blue-400">មានឫសឌុប (x₀ = {mathX1})</span>
                    ) : (
                      <span className="text-rose-400">គ្មានឫសក្នុងសំណុំ R (Δ &lt; 0)</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {subjectCategory === 'physics' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  សាកល្បងផ្លាស់ប្ដូរតម្លៃច្បាប់អូម៖ <span className="font-mono text-cyan-400">U = R × I =&gt; I = U / R</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400">តង់ស្យុង U (Volt):</label>
                    <input
                      type="number"
                      value={physU}
                      onChange={(e) => setPhysU(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">រេស៊ីស្តង់ R (Ohm Ω):</label>
                    <input
                      type="number"
                      value={physR}
                      onChange={(e) => setPhysR(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 text-sm font-mono"
                    />
                  </div>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-lg text-xs font-mono border border-slate-700 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <span className="text-slate-400">អាំងតង់ស៊ីតេចរន្ត I = U/R:</span>{' '}
                    <strong className="text-cyan-300">{physI} A (អំពែ)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">អានុភាពអគ្គិសនី P = U × I:</span>{' '}
                    <strong className="text-amber-300">{physP} W (វ៉ាត់)</strong>
                  </div>
                </div>
              </div>
            )}

            {subjectCategory === 'chemistry' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  សាកល្បងគណនាកំហាប់ម៉ូល៖ <span className="font-mono text-emerald-400">n = m / M និង C = n / V</span>
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400">ម៉ាស m (ក្រាម g):</label>
                    <input
                      type="number"
                      value={chemM}
                      onChange={(e) => setChemM(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">ម៉ាសម៉ូល M (g/mol):</label>
                    <input
                      type="number"
                      value={chemMolarMass}
                      onChange={(e) => setChemMolarMass(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">មាឌ V (mL):</label>
                    <input
                      type="number"
                      value={chemVmL}
                      onChange={(e) => setChemVmL(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 text-sm font-mono"
                    />
                  </div>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-lg text-xs font-mono border border-slate-700 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <span className="text-slate-400">ចំនួនម៉ូល n = m/M:</span>{' '}
                    <strong className="text-emerald-300">{chemMoles} mol</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">កំហាប់ជាម៉ូល C = n/V:</span>{' '}
                    <strong className="text-amber-300">{chemC} mol/L (M)</strong>
                  </div>
                </div>
              </div>
            )}

            {subjectCategory === 'ict' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  សាកល្បងរូបមន្ត Excel៖ <span className="font-mono text-cyan-400">=SUM(), =AVERAGE(), =IF()</span>
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400">ពិន្ទុមុខវិជ្ជា ១ (B2):</label>
                    <input
                      type="number"
                      value={ictScore1}
                      onChange={(e) => setIctScore1(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">ពិន្ទុមុខវិជ្ជា ២ (C2):</label>
                    <input
                      type="number"
                      value={ictScore2}
                      onChange={(e) => setIctScore2(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">ពិន្ទុមុខវិជ្ជា ៣ (D2):</label>
                    <input
                      type="number"
                      value={ictScore3}
                      onChange={(e) => setIctScore3(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 text-sm font-mono"
                    />
                  </div>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-lg text-xs font-mono border border-slate-700 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <span className="text-slate-400">=SUM(B2:D2):</span>{' '}
                    <strong className="text-cyan-300">{ictTotal} ពិន្ទុ</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">=AVERAGE(B2:D2):</span>{' '}
                    <strong className="text-amber-300">{ictAvg} មធ្យមភាគ</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">=IF(F2&gt;=50, "ជាប់", "ធ្លាក់"):</span>{' '}
                    <strong className={parseFloat(ictAvg) >= 50 ? 'text-emerald-300' : 'text-rose-400'}>
                      {ictStatus}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {subjectCategory === 'khmer' && (
              <div className="p-3 bg-slate-800/80 rounded-lg text-xs border border-slate-700 text-slate-300">
                <span className="font-bold text-amber-300">💡 គន្លឹះគរុកោសល្យបង្រៀនតែងសេចក្ដី៖</span>{' '}
                ណែនាំសិស្សឱ្យអនុវត្តតាមក្បួនខ្នាត ៣ ផ្នែក (ផ្ដើម តួ បញ្ចប់)។ ក្នុងតួសេចក្ដី ត្រូវតែមានយ៉ាងតិច ២ ឧទាហរណ៍ជាក់ស្ដែង (ឧទាហរណ៍ក្នុងជីវភាពរស់នៅជាក់ស្ដែង ១ និងឧទាហរណ៍ក្នុងអក្សរសិល្ប៍ ១) ដើម្បីធ្វើឱ្យអត្ថបទមានទម្ងន់ទាក់ទាញ និងគួរឱ្យជឿជាក់។
              </div>
            )}

            {subjectCategory === 'general' && (
              <div className="p-3 bg-slate-800/80 rounded-lg text-xs border border-slate-700 text-slate-300">
                <span className="font-bold text-cyan-300">💡 វិធីសាស្ត្រអនុវត្តជាក់ស្ដែង៖</span>{' '}
                ជំរុញសិស្សឱ្យផ្សារភ្ជាប់ទ្រឹស្ដីនៃប្រធានបទ «{topic}» ទៅនឹងការដោះស្រាយបញ្ហាជាក់ស្ដែងក្នុងជីវភាពប្រចាំថ្ងៃ និងសហគមន៍។
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Practical Content Grid */}
      <div className="mt-5 space-y-5">
        {/* 1. Problem Statement / Task Prompt */}
        <div
          className={`p-4 rounded-xl border ${
            isPrintFriendly ? 'border-black bg-white' : theme.accentBg
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <BookOpen className="w-4 h-4" />
            <span className="font-extrabold text-sm uppercase tracking-wide">
              {subjectCategory === 'khmer'
                ? '១. ប្រធានតែងសេចក្ដី / ប្រធានជាក់ស្ដែង'
                : '១. ប្រធានលំហាត់ជាក់ស្ដែង និងលក្ខខណ្ឌចោទ (Problem Statement)'}
            </span>
          </div>

          {isEditing ? (
            <textarea
              rows={3}
              value={problemStatement}
              onChange={(e) => handleUpdateField('problemStatement', e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 font-sans text-sm focus:ring-2 focus:ring-blue-500 bg-white"
            />
          ) : (
            <div className="text-sm font-semibold text-slate-900 whitespace-pre-line leading-relaxed">
              {problemStatement}
            </div>
          )}

          {/* Given Data / Context Chips */}
          {givenDataOrContext && givenDataOrContext.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-700">បម្រាប់ / បរិបទ៖</span>
              {givenDataOrContext.map((item, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                    isPrintFriendly ? 'border-black bg-white' : theme.chipColor
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2. Key Formulas / Structural Rules Box */}
        {formulasOrRules && formulasOrRules.length > 0 && (
          <div
            className={`p-4 rounded-xl ${
              isPrintFriendly
                ? 'border-2 border-black bg-white text-black'
                : `${theme.formulaBg} shadow-sm`
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="font-extrabold text-sm uppercase tracking-wide">
                {subjectCategory === 'khmer'
                  ? '២. ក្បួនខ្នាត និងរចនាសម្ព័ន្ធគន្លឹះ (Structural Rules)'
                  : subjectCategory === 'ict'
                  ? '២. រូបមន្ត និងវាក្យសម្ព័ន្ធ ICT (Syntax & Formulas)'
                  : '២. រូបមន្តគន្លឹះ និងក្បួនប្រមាណវិធី (Key Formulas & Rules)'}
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs sm:text-sm">
              {formulasOrRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">❖</span>
                  <span className="leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Step-by-Step Calculation & Pedagogical Breakdown */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <span>
                {subjectCategory === 'khmer'
                  ? '៣. ដំណើរការតែងសេចក្ដីលម្អិតជាដំណាក់កាល (Step-by-Step Outline & Composition)'
                  : '៣. ដំណើរការគណនាប្រមាណវិធីមួយបន្ទាត់ម្តងៗ (Step-by-Step Calculation & Operations)'}
              </span>
            </h4>

            {isEditing && (
              <button
                type="button"
                onClick={handleAddStep}
                className="px-2.5 py-1 text-xs rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1 border border-blue-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>បន្ថែមជំហាន</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {steps.map((st, sIndex) => (
              <div
                key={sIndex}
                className={`p-3.5 rounded-xl border transition ${
                  isPrintFriendly
                    ? 'border-black bg-white'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                      {st.stepNumber}
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={st.stepName}
                        onChange={(e) => handleStepChange(sIndex, 'stepName', e.target.value)}
                        className="text-xs sm:text-sm font-bold text-slate-900 border-b border-blue-400 bg-blue-50/40 px-1 py-0.5 rounded"
                      />
                    ) : (
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {st.stepName}
                      </span>
                    )}
                  </div>

                  {isEditing && steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(sIndex)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Operation / Code block if available */}
                {st.operationOrCode && (
                  <div
                    className={`my-2 p-2.5 rounded-lg font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${
                      isPrintFriendly
                        ? 'border border-black bg-slate-50 text-black'
                        : 'bg-slate-900 text-amber-300 border border-slate-800 shadow-inner'
                    }`}
                  >
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={st.operationOrCode}
                        onChange={(e) =>
                          handleStepChange(sIndex, 'operationOrCode', e.target.value)
                        }
                        className="w-full bg-slate-800 text-amber-300 font-mono text-xs p-1.5 rounded border border-slate-700 focus:outline-none"
                      />
                    ) : (
                      st.operationOrCode
                    )}
                  </div>
                )}

                {/* Pedagogical Explanation */}
                <div className="text-xs text-slate-700 leading-relaxed flex items-start gap-2 mt-1.5">
                  <span className="font-bold text-indigo-700 shrink-0">
                    💡 ការពន្យល់គរុកោសល្យ៖
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={st.explanation}
                      onChange={(e) =>
                        handleStepChange(sIndex, 'explanation', e.target.value)
                      }
                      className="w-full text-xs border-b border-blue-400 bg-blue-50/40 px-1 py-0.5 rounded"
                    />
                  ) : (
                    <span>{st.explanation}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Final Result & Applied Meaning */}
        <div
          className={`p-4 rounded-xl border ${
            isPrintFriendly
              ? 'border-2 border-black bg-white text-black'
              : 'border-emerald-300 bg-emerald-50/80 text-emerald-950 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span className="font-extrabold text-sm uppercase tracking-wide text-emerald-900">
              ៤. ចម្លើយសម្រេច និងអត្ថន័យការអនុវត្តក្នុងជីវភាពជាក់ស្ដែង
            </span>
          </div>

          {isEditing ? (
            <textarea
              rows={2}
              value={finalResult}
              onChange={(e) => handleUpdateField('finalResult', e.target.value)}
              className="w-full p-2 text-xs sm:text-sm rounded border border-emerald-300 bg-white font-medium"
            />
          ) : (
            <p className="text-xs sm:text-sm font-semibold leading-relaxed">
              {finalResult}
            </p>
          )}
        </div>

        {/* 5. Student Hands-On Practice Task */}
        {studentPracticeTask && (
          <div
            className={`p-4 rounded-xl border ${
              isPrintFriendly
                ? 'border border-black bg-white text-black'
                : 'border-slate-300 bg-slate-50 text-slate-900 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  ៥
                </span>
                <span className="font-extrabold text-sm uppercase tracking-wide text-slate-900">
                  {subjectCategory === 'khmer'
                    ? 'ប្រធានតែងសេចក្ដីសម្រាប់សិស្សអនុវត្តផ្ទាល់ (Student Practice)'
                    : 'លំហាត់អនុវត្តស្រដៀងគ្នាសម្រាប់សិស្សធ្វើដោយខ្លួនឯង (Hands-On Exercise)'}
                </span>
              </div>

              {/* Reveal Hint/Answer Button (Hidden in print) */}
              {studentPracticeTask.hintOrAnswerKey && !isPrintFriendly && (
                <button
                  type="button"
                  onClick={() => setShowAnswerKey(!showAnswerKey)}
                  className="no-print text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs transition"
                >
                  {showAnswerKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showAnswerKey ? 'លាក់ចម្លើយ' : 'បង្ហាញគន្លឹះដោះស្រាយ/ចម្លើយ'}</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <textarea
                rows={2}
                value={studentPracticeTask.problem}
                onChange={(e) =>
                  handleUpdateField('studentPracticeTask', {
                    ...studentPracticeTask,
                    problem: e.target.value,
                  })
                }
                className="w-full p-2 text-xs sm:text-sm rounded border border-slate-300 bg-white"
              />
            ) : (
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-800">
                {studentPracticeTask.problem}
              </p>
            )}

            {/* Answer Key or Hint */}
            {(showAnswerKey || isPrintFriendly) && studentPracticeTask.hintOrAnswerKey && (
              <div className="mt-3 p-3 rounded-lg bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 animate-fadeIn">
                <span className="font-bold">🔑 គន្លឹះដោះស្រាយ និងចម្លើយផ្ទៀងផ្ទាត់៖</span>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={studentPracticeTask.hintOrAnswerKey}
                    onChange={(e) =>
                      handleUpdateField('studentPracticeTask', {
                        ...studentPracticeTask,
                        hintOrAnswerKey: e.target.value,
                      })
                    }
                    className="w-full mt-1 p-1.5 text-xs rounded border border-indigo-300 bg-white"
                  />
                ) : (
                  <span>{studentPracticeTask.hintOrAnswerKey}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
