import React from 'react';
import { LessonPlanData, TeachingStep } from '../types/lessonPlan';
import { Sparkles, Plus, Trash2, Edit2, Check, RefreshCw, Clock, CheckCircle2, AlertCircle, Contrast, Mic } from 'lucide-react';
import { calculateStepDurations, sumStepsMinutes, parseDurationMinutes } from '../utils/durationHelper';
import { ObjectivesManager } from './ObjectivesManager';
import { PracticalApplicationSection } from './PracticalApplicationSection';
import { VocabularyListSection } from './VocabularyListSection';
import { IllustrationSection } from './IllustrationSection';
import { VoiceInput } from './VoiceInput';
import { VoiceTextarea } from './VoiceTextarea';
import { VoiceMicButton } from './VoiceMicButton';
import { generateSubjectPracticalApplication, generateSubjectVocabulary } from '../../curriculumEngine';
import { generateTopicIllustration } from '../utils/illustrationEngine';

interface LessonPlanPreviewProps {
  plan: LessonPlanData;
  isEditing: boolean;
  onUpdatePlan: (updated: LessonPlanData) => void;
  onRefineStep: (stepIndex: number) => void;
  isPrintFriendly?: boolean;
}

// Helper to render formatted lines with smart support for titles, solution steps, equations, and calculations
const renderFormattedLines = (
  text: string,
  isLessonContent: boolean = false,
  isPrintFriendly: boolean = false,
) => {
  if (!text) return null;
  const lines = text.split('\n').filter((l) => l.trim().length > 0);

  return (
    <div className={`space-y-1 ${isPrintFriendly ? 'text-black' : 'text-slate-900'} leading-relaxed text-xs sm:text-sm`}>
      {lines.map((rawLine, lIdx) => {
        const trimmed = rawLine.trim();

        // 1. Heading or Section Title (e.g. "១. ...", "២. ...", "I. ...", "ជំពូកទី...", "មេរៀនទី...", or "* ប្រធាន...", "* ដំណោះស្រាយ...", "* លំហាត់...", "* កិច្ចការ...")
        const isHeading =
          /^(?:[០-៩0-9]+[.)]|I[VX]|VI{0,3}|[ក-អ][.)]|ជំពូកទី|មេរៀនទី)/.test(trimmed) ||
          /^\*\s*(?:ប្រធាន|ដំណោះស្រាយ|លំហាត់|កិច្ចការ|ក្រុមទី|សន្និដ្ឋាន|ចំណាំ|រូបមន្ត|វិធាន)/.test(trimmed);

        if (isHeading) {
          const cleanHeading = trimmed.replace(/^\*\s*/, '');
          return (
            <div
              key={lIdx}
              className={`font-bold ${
                isPrintFriendly ? 'text-black' : 'text-blue-950'
              } ${
                lIdx > 0
                  ? isPrintFriendly
                    ? 'mt-2 pt-1.5 border-t border-black/40'
                    : 'mt-2 pt-1.5 border-t border-slate-200/60'
                  : ''
              } text-[13px] sm:text-sm flex items-start gap-1`}
            >
              <span>{cleanHeading}</span>
            </div>
          );
        }

        // 1.5. Pedagogical Definition / Formula / Application / Teaching Strategy Interpretation Callout
        // E.g., [ការពន្យល់ពេលរៀនលម្អិត...], [ដំណោះស្រាយលម្អិត...], [យុទ្ធវិធីបង្រៀន...], [វិធីសាស្ត្របង្រៀន...]
        const isPedagogicalHeader = /^[-•*]?\s*\[\s*(?:ការបកស្រាយនិយមន័យ|ការបកស្រាយរូបមន្ត|ដំណើរការគណនា|ការបកស្រាយអត្ថន័យ|អត្ថន័យនៃចម្លើយ|ពន្យល់រូបមន្ត|ចំណាំគរុកោសល្យ|អត្ថន័យជាក់ស្ដែង|ការពន្យល់ពេលរៀនលម្អិត|ការពន្យល់ពេលរៀន|ដំណោះស្រាយលម្អិត|ដំណោះស្រាយជាជំហានៗ|ដំណោះស្រាយលម្អិតជាជំហានៗ|លំហាត់អនុវត្តនិងដំណោះស្រាយ|លំហាត់អនុវត្តជាក្រុមនិងដំណោះស្រាយផ្ទៀងផ្ទាត់|សកម្មភាពអនុវត្តជាក្រុមនិងដំណោះស្រាយផ្ទៀងផ្ទាត់|ការរៀបចំគម្រោងតែងពេញលេញ|លំហាត់គំរូនិងដំណោះស្រាយលម្អិតជាជំហានៗ|យុទ្ធវិធីបង្រៀន|យុទ្ធវិធី|វិធីសាស្ត្របង្រៀន|យុទ្ធវិធីគិត-គូ-ចែករំលែក|យុទ្ធវិធីដើរទស្សនវិចិត្រសាល|យុទ្ធវិធីផ្គុំរូប|យុទ្ធវិធីក្ដារឈ្នួនឆ្លើយរហ័ស)[^\]]*\]/i.test(trimmed);
        if (isPedagogicalHeader) {
          const badgeText = trimmed.replace(/^[-•*]?\s*\[\s*/, '').replace(/\]\s*[:៖]?\s*$/, '').trim();
          const isExplanation = badgeText.includes('ពន្យល់') || badgeText.includes('និយមន័យ');
          const isSolution = badgeText.includes('ដំណោះស្រាយ') || badgeText.includes('គណនា') || badgeText.includes('គម្រោងតែង');
          const isStrategy = badgeText.includes('យុទ្ធវិធី') || badgeText.includes('វិធីសាស្ត្រ');

          return (
            <div
              key={lIdx}
              className={`mt-2.5 mb-1 px-2.5 py-1 rounded-md text-[12px] sm:text-xs font-semibold flex items-center gap-1.5 ${
                isPrintFriendly
                  ? 'bg-transparent border border-black text-black'
                  : isStrategy
                  ? 'bg-purple-50/90 border border-purple-300 text-purple-950 shadow-2xs'
                  : isExplanation
                  ? 'bg-indigo-50/90 border border-indigo-300 text-indigo-950 shadow-2xs'
                  : isSolution
                  ? 'bg-emerald-50/90 border border-emerald-300 text-emerald-950 shadow-2xs'
                  : 'bg-blue-50/90 border border-blue-300 text-blue-950 shadow-2xs'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                isPrintFriendly
                  ? 'bg-black text-white'
                  : isStrategy
                  ? 'bg-purple-600 text-white'
                  : isExplanation
                  ? 'bg-indigo-600 text-white'
                  : isSolution
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                {isStrategy ? '🎯' : isExplanation ? '📖' : isSolution ? '📐' : 'ℹ'}
              </span>
              <span>{badgeText}</span>
            </div>
          );
        }

        // 1.6. Pedagogical Inline Explanation (e.g. "ពន្យល់ពេលរៀន៖ ...", "ពន្យល់៖ ...", "មូលហេតុ៖ ...")
        const isPedagogicalExplanation = /^[-•*]?\s*(?:ពន្យល់ពេលរៀន|ពន្យល់|មូលហេតុ|ហេតុអ្វី)(?:៖|:)/i.test(trimmed);
        if (isPedagogicalExplanation) {
          const cleanExplanation = trimmed.replace(/^[-•*]\s*/, '').trim();
          return (
            <div
              key={lIdx}
              className={`pl-3 py-1 my-0.5 rounded text-xs sm:text-[13px] flex items-start gap-1.5 ${
                isPrintFriendly
                  ? 'text-black border-l-2 border-black/60 pl-2 italic'
                  : 'bg-amber-50/80 border-l-2 border-amber-500 text-amber-950 italic'
              }`}
            >
              <span className="font-bold not-italic select-none text-amber-600 text-xs">💡</span>
              <span className="flex-1 not-italic font-normal">{cleanExplanation}</span>
            </div>
          );
        }

        // 2. Step in a worked solution (e.g. "- ជំហានទី ១ ...", "ជំហានទី ២ ...")
        const isStepInSolution = /^[-•*]?\s*ជំហានទី\s*[០-៩0-9]+/i.test(trimmed);
        if (isStepInSolution) {
          const cleanStep = trimmed.replace(/^[-•*]\s*/, '').trim();
          return (
            <div
              key={lIdx}
              className={`font-semibold ${
                isPrintFriendly ? 'text-black' : 'text-blue-900'
              } mt-1 pl-1 flex items-baseline gap-1.5`}
            >
              <span className={isPrintFriendly ? 'text-black text-xs' : 'text-blue-600 text-xs'}>▸</span>
              <span>{cleanStep}</span>
            </div>
          );
        }

        // 3. Mathematical Formula / Step-by-Step Numerical Calculation line
        // E.g., starts with "=", "=>", "x₁", "x₂", "Δ", or lines that are explicit equations
        const isMathEquation =
          /^(?:=|=>|→|x[₁₂12]?\s*=|Δ\s*=|a\s*=|b\s*=|c\s*=|F\s*=|m\s*=|v\s*=|A\s*=|B\s*=|C\s*=)/.test(trimmed) ||
          (isLessonContent && /^[a-zA-Z0-9_Δ√]+\s*=\s*[-+0-9a-zA-Z_()/*.\s]+$/.test(trimmed));

        if (isMathEquation) {
          return (
            <div
              key={lIdx}
              className={`pl-3 py-0.5 my-0.5 rounded font-mono text-[12px] sm:text-xs font-medium tracking-tight ${
                isPrintFriendly
                  ? 'bg-transparent border-l-2 border-black text-black'
                  : 'bg-blue-50/60 border-l-2 border-blue-500 text-slate-900'
              }`}
            >
              {trimmed}
            </div>
          );
        }

        // 4. Sub-item indented with +
        if (trimmed.startsWith('+')) {
          const cleanSub = trimmed.replace(/^\+\s*/, '').trim();
          return (
            <div
              key={lIdx}
              className={`pl-4 flex items-start ${
                isPrintFriendly ? 'text-black' : 'text-slate-800'
              } text-xs sm:text-[13px]`}
            >
              <span className={`inline-block mr-1.5 select-none font-bold ${
                isPrintFriendly ? 'text-black' : 'text-blue-600'
              }`}>+</span>
              <span className="flex-1">{cleanSub}</span>
            </div>
          );
        }

        // 5. Standard bullet point (starting with -, *, •)
        const clean = trimmed.replace(/^[-•*]\s*/, '').trim();
        return (
          <div key={lIdx} className={`flex items-start ${isPrintFriendly ? 'text-black' : 'text-slate-900'}`}>
            <span className={`inline-block mr-2 font-bold select-none ${
              isPrintFriendly ? 'text-black' : 'text-slate-900'
            }`}>•</span>
            <span className="flex-1">{clean}</span>
          </div>
        );
      })}
    </div>
  );
};

export const LessonPlanPreview: React.FC<LessonPlanPreviewProps> = ({
  plan,
  isEditing,
  onUpdatePlan,
  onRefineStep,
  isPrintFriendly = false,
}) => {
  const h = plan.header;
  const obj = plan.objectives;
  const mat = plan.materials;
  const effectivePracticalApp =
    plan.practicalApplication ||
    generateSubjectPracticalApplication(
      h.topic,
      h.subject,
      h.grade
    );
  const effectiveVocabularyList =
    plan.vocabularyList ||
    generateSubjectVocabulary(
      h.topic,
      h.subject,
      h.grade
    );

  // Identify Step 3 for embedding practical application into "ជំហានទី៣ មេរៀនថ្មី"
  const step3Index = plan.steps.findIndex(
    (s, i) =>
      i === 2 ||
      (s.stepNumber && (s.stepNumber.includes('៣') || s.stepNumber.includes('3'))) ||
      (s.stepTitle && s.stepTitle.includes('មេរៀនថ្មី')),
  );
  const targetStep3Idx = step3Index !== -1 ? step3Index : 2;

  const totalHeaderMinutes = parseDurationMinutes(h.duration);
  const totalStepsMinutes = sumStepsMinutes(plan.steps);
  const isTimeMatched = totalHeaderMinutes === totalStepsMinutes;

  // Auto-redistribute step durations based on a duration string or header duration
  const handleAutoRedistributeSteps = (targetDuration?: string) => {
    const durStr = targetDuration || h.duration;
    const breakdown = calculateStepDurations(durStr);

    const newSteps = plan.steps.map((step, idx) => {
      let duration = step.duration;
      if (idx === 0) duration = breakdown.step1Str;
      else if (idx === 1) duration = breakdown.step2Str;
      else if (idx === 2) duration = breakdown.step3Str;
      else if (idx === 3) duration = breakdown.step4Str;
      else if (idx === 4) duration = breakdown.step5Str;
      return { ...step, duration };
    });

    onUpdatePlan({
      ...plan,
      header: targetDuration ? { ...h, duration: targetDuration } : h,
      steps: newSteps,
    });
  };

  // Header update helper
  const handleHeaderChange = (field: keyof typeof h, val: string) => {
    onUpdatePlan({
      ...plan,
      header: {
        ...h,
        [field]: val,
      },
    });
  };

  // Step change helper
  const handleStepChange = (
    index: number,
    field: keyof TeachingStep,
    val: string,
  ) => {
    const newSteps = [...plan.steps];
    newSteps[index] = {
      ...newSteps[index],
      [field]: val,
    };
    onUpdatePlan({
      ...plan,
      steps: newSteps,
    });
  };

  return (
    <div className={`p-2 sm:p-6 rounded-2xl border transition-colors flex flex-col items-center ${
      isPrintFriendly
        ? 'bg-slate-200/90 border-slate-300'
        : 'bg-slate-100 border-slate-200 shadow-inner'
    }`}>
      {/* Print-friendly banner */}
      {isPrintFriendly && (
        <div className="no-print w-full max-w-[210mm] mb-3 px-4 py-2.5 bg-slate-950 text-white rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-medium shadow-sm">
          <div className="flex items-center space-x-2">
            <Contrast className="w-4 h-4 text-amber-300 shrink-0" />
            <span>ទម្រង់សន្សំទឹកថ្នាំ (Print-Friendly B&W) ៖ កម្រិតស-ខ្មៅខ្ពស់ ដកពណ៌ផ្ទៃទាំងអស់ ងាយស្រួលព្រីន និងថតចម្លង</span>
          </div>
          <span className="text-[11px] bg-white/20 text-white px-2.5 py-0.5 rounded-full font-mono">
            High-Contrast B&W
          </span>
        </div>
      )}

      {/* Voice-to-Text Teacher Assistant Banner in Edit Mode */}
      {isEditing && (
        <div className="no-print w-full max-w-[210mm] mb-4 p-3.5 bg-gradient-to-r from-rose-50 via-red-50/60 to-amber-50 border-2 border-rose-300 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  មុខងារ Microphone (Voice-to-Text) ត្រូវបានបើកដំណើរការ
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-2xs">
                  🇰🇭 ភាសាខ្មែរ (km-KH)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                  🇬🇧 EN
                </span>
              </div>
              <p className="text-slate-600 text-xs mt-0.5">
                លោកគ្រូ-អ្នកគ្រូអាចចុចលើរូប <strong>Microphone (🎤)</strong> នៅតាមគ្រប់ប្រអប់កែសម្រួល (សកម្មភាពគ្រូ, ខ្លឹមសារមេរៀន, សកម្មភាពសិស្ស, វត្ថុបំណង...) ដើម្បីនិយាយបញ្ចូលអត្ថបទជាសំឡេងបានយ៉ាងរហ័ស!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* A4 Sheet Container */}
      <div
        id="lesson-plan-sheet"
        className={`a4-page rounded-lg transition-all ${
          isPrintFriendly ? 'print-friendly-mode bg-white text-black' : 'text-slate-800'
        }`}
      >
        {/* Kingdom & Motto Header */}
        <div className="text-center mb-6">
          <h2 className={`font-moul text-lg sm:text-xl leading-relaxed ${isPrintFriendly ? 'text-black' : 'text-slate-900'}`}>
            {isEditing ? (
              <VoiceInput
                value={h.country}
                onChangeValue={(val) => handleHeaderChange('country', val)}
                className="w-full text-center border-b border-dashed border-slate-300 font-moul"
              />
            ) : (
              h.country
            )}
          </h2>
          <h3 className={`font-moul text-base sm:text-lg mt-1 ${isPrintFriendly ? 'text-black' : 'text-slate-800'}`}>
            {isEditing ? (
              <VoiceInput
                value={h.motto}
                onChangeValue={(val) => handleHeaderChange('motto', val)}
                className="w-full text-center border-b border-dashed border-slate-300 font-moul"
              />
            ) : (
              h.motto
            )}
          </h3>
          <div className={`flex justify-center items-center my-2 text-sm ${isPrintFriendly ? 'text-black' : 'text-slate-400'}`}>
            <span>𖧷 𖧷 𖧷</span>
          </div>

          <h1 className={`font-moul text-xl sm:text-2xl mt-3 tracking-wider underline underline-offset-8 ${
            isPrintFriendly
              ? 'text-black decoration-black'
              : 'text-blue-900 decoration-blue-200'
          }`}>
            កិច្ចតែងការបង្រៀន
          </h1>
        </div>

        {/* Unified Information Frame directly under "កិច្ចតែងការបង្រៀន" (បញ្ចូលគ្នានៅក្រោមពាក្យកិច្ចតែងការបង្រៀន) */}
        <div className={`mb-6 rounded-xl border-2 transition-all overflow-hidden ${
          isPrintFriendly
            ? 'border-black bg-white text-black'
            : 'border-blue-900/30 bg-gradient-to-br from-slate-50/90 via-white to-blue-50/20 shadow-xs'
        }`}>
          {/* Subtle Decorative Top Bar / Motif */}
          <div className={`px-4 py-1 flex items-center justify-between text-[11px] border-b ${
            isPrintFriendly ? 'border-black text-black' : 'border-blue-100 bg-blue-900/5 text-blue-900'
          }`}>
            <span className="font-medium tracking-wide">ព័ត៌មានទូទៅនៃកិច្ចតែងការបង្រៀន (Lesson Plan Overview)</span>
            <span className="text-[12px] opacity-75">𖧷 𖧷 𖧷</span>
          </div>

          <div className={`divide-y ${isPrintFriendly ? 'divide-black' : 'divide-slate-200'}`}>
            {/* Row 1: មុខវិជ្ជា | ថ្នាក់ទី */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x ${
              isPrintFriendly ? 'divide-black' : 'divide-slate-200'
            }`}>
              <div className="p-2.5 sm:px-4 sm:py-2.5 flex items-center text-xs sm:text-sm">
                <span className={`font-bold min-w-[95px] shrink-0 ${isPrintFriendly ? 'text-black' : 'text-slate-900'}`}>
                  មុខវិជ្ជា៖
                </span>
                {isEditing ? (
                  <VoiceInput
                    value={h.subject}
                    onChangeValue={(val) => handleHeaderChange('subject', val)}
                    placeholder="មុខវិជ្ជា..."
                    className="border-b border-slate-300 px-1 py-0.5 text-xs sm:text-sm font-semibold bg-white"
                  />
                ) : (
                  <span className={`font-bold ${isPrintFriendly ? 'text-black' : 'text-blue-950'}`}>
                    {h.subject}
                  </span>
                )}
              </div>

              <div className="p-2.5 sm:px-4 sm:py-2.5 flex items-center text-xs sm:text-sm">
                <span className={`font-bold min-w-[85px] shrink-0 ${isPrintFriendly ? 'text-black' : 'text-slate-900'}`}>
                  ថ្នាក់ទី៖
                </span>
                {isEditing ? (
                  <VoiceInput
                    value={h.grade}
                    onChangeValue={(val) => handleHeaderChange('grade', val)}
                    placeholder="ថ្នាក់ទី..."
                    className="border-b border-slate-300 px-1 py-0.5 text-xs sm:text-sm font-semibold bg-white"
                  />
                ) : (
                  <span className={`font-semibold ${isPrintFriendly ? 'text-black' : 'text-slate-800'}`}>
                    {h.grade}
                  </span>
                )}
              </div>
            </div>

            {/* Row 2: កាលបរិច្ឆេទ | រយៈពេល */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x ${
              isPrintFriendly ? 'divide-black' : 'divide-slate-200'
            }`}>
              <div className="p-2.5 sm:px-4 sm:py-2.5 flex items-center text-xs sm:text-sm">
                <span className={`font-bold min-w-[95px] shrink-0 ${isPrintFriendly ? 'text-black' : 'text-slate-900'}`}>
                  កាលបរិច្ឆេទ៖
                </span>
                {isEditing ? (
                  <VoiceInput
                    value={h.date}
                    onChangeValue={(val) => handleHeaderChange('date', val)}
                    placeholder="កាលបរិច្ឆេទ..."
                    className="border-b border-slate-300 px-1 py-0.5 text-xs sm:text-sm bg-white"
                  />
                ) : (
                  <span className={isPrintFriendly ? 'text-black' : 'text-slate-800'}>{h.date}</span>
                )}
              </div>

              <div className="p-2.5 sm:px-4 sm:py-2.5 flex flex-col justify-center text-xs sm:text-sm">
                <div className="flex items-center">
                  <span className={`font-bold min-w-[85px] shrink-0 ${isPrintFriendly ? 'text-black' : 'text-slate-900'}`}>
                    រយៈពេល៖
                  </span>
                  {isEditing ? (
                    <VoiceInput
                      value={h.duration}
                      onChangeValue={(val) => handleHeaderChange('duration', val)}
                      placeholder="ឧ. ៥០ នាទី (១ ម៉ោងសិក្សា)"
                      className="border-b border-slate-300 px-1 py-0.5 text-xs sm:text-sm bg-white"
                    />
                  ) : (
                    <span className={`font-medium ${isPrintFriendly ? 'text-black' : 'text-slate-800'}`}>
                      {h.duration}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <div className="flex flex-wrap items-center gap-1 mt-1 pl-[85px] no-print">
                    <span className="text-[10px] text-slate-400">តម្រូវនាទី៖</span>
                    {['៤០ នាទី', '៥០ នាទី (១ ម៉ោង)', '៩០ នាទី', '១០០ នាទី (២ ម៉ោង)'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleAutoRedistributeSteps(d)}
                        className={`text-[10px] px-1.5 py-0.5 rounded border transition cursor-pointer ${
                          h.duration === d
                            ? 'bg-blue-600 text-white border-blue-600 font-medium'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                        title="បែងចែកនាទីស្វ័យប្រវត្តិក្នុ​ងជំហានទាំង ៥"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 3: ជំពូកទី | មេរៀនទី */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x ${
              isPrintFriendly ? 'divide-black' : 'divide-slate-200'
            }`}>
              <div className="p-2.5 sm:px-4 sm:py-2.5 flex items-center text-xs sm:text-sm">
                <span className={`font-bold min-w-[95px] shrink-0 ${isPrintFriendly ? 'text-black' : 'text-slate-900'}`}>
                  ជំពូកទី៖
                </span>
                {isEditing ? (
                  <VoiceInput
                    value={h.chapter || ''}
                    onChangeValue={(val) => handleHeaderChange('chapter', val)}
                    placeholder="ជំពូកទី..."
                    className="border-b border-slate-300 px-1 py-0.5 text-xs sm:text-sm bg-white"
                  />
                ) : (
                  <span className={`font-semibold ${isPrintFriendly ? 'text-black' : 'text-slate-800'}`}>
                    {h.chapter || '—'}
                  </span>
                )}
              </div>

              <div className="p-2.5 sm:px-4 sm:py-2.5 flex items-center text-xs sm:text-sm">
                <span className={`font-bold min-w-[85px] shrink-0 ${isPrintFriendly ? 'text-black' : 'text-slate-900'}`}>
                  មេរៀនទី៖
                </span>
                {isEditing ? (
                  <VoiceInput
                    value={h.lessonNo || ''}
                    onChangeValue={(val) => handleHeaderChange('lessonNo', val)}
                    placeholder="មេរៀនទី..."
                    className="border-b border-slate-300 px-1 py-0.5 text-xs sm:text-sm bg-white"
                  />
                ) : (
                  <span className={`font-semibold ${isPrintFriendly ? 'text-black' : 'text-slate-800'}`}>
                    {h.lessonNo || '—'}
                  </span>
                )}
              </div>
            </div>

            {/* Row 4: ចំណងជើងមេរៀន / ប្រធានបទ (Full Width Prominent Row) */}
            <div className={`p-3 sm:px-4 sm:py-3 ${
              isPrintFriendly ? 'bg-white' : 'bg-blue-50/40'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-2">
                <span className={`font-bold text-xs sm:text-sm shrink-0 ${
                  isPrintFriendly ? 'text-black' : 'text-slate-900'
                }`}>
                  ប្រធានបទ/ចំណងជើងមេរៀន៖
                </span>
                {isEditing ? (
                  <VoiceInput
                    value={h.topic}
                    onChangeValue={(val) => handleHeaderChange('topic', val)}
                    placeholder="ប្រធានបទ ឬចំណងជើងមេរៀន..."
                    showLangToggle
                    className={`border-b-2 px-1 py-0.5 font-bold text-sm sm:text-base bg-white ${
                      isPrintFriendly ? 'border-black text-black' : 'border-blue-600 text-blue-900'
                    }`}
                  />
                ) : (
                  <span className={`font-moul text-sm sm:text-base tracking-wide ${
                    isPrintFriendly ? 'text-black' : 'text-blue-900'
                  }`}>
                    {h.topic}
                  </span>
                )}
              </div>
            </div>

            {/* Row 5: វិធីសាស្ត្របង្រៀន | យុទ្ធវិធីបង្រៀន */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x ${
              isPrintFriendly ? 'divide-black' : 'divide-slate-200'
            }`}>
              <div className="p-2.5 sm:px-4 sm:py-2.5 flex flex-col justify-center text-xs">
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-bold shrink-0 ${isPrintFriendly ? 'text-black' : 'text-blue-950'}`}>
                    វិធីសាស្ត្របង្រៀន៖
                  </span>
                  {isEditing ? (
                    <VoiceInput
                      value={h.teachingMethod || ''}
                      onChangeValue={(val) => handleHeaderChange('teachingMethod', val)}
                      placeholder="ឧ. វិធីសាស្ត្របង្រៀនតាមបែបសិស្សមជ្ឈមណ្ឌល..."
                      className="border-b border-slate-300 px-1 py-0.5 text-xs bg-white text-slate-800"
                    />
                  ) : (
                    <span className={`font-medium ${isPrintFriendly ? 'text-black' : 'text-blue-900'}`}>
                      {h.teachingMethod || 'វិធីសាស្ត្របង្រៀនតាមបែបសិស្សមជ្ឈមណ្ឌល (Student-Centered)'}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-2.5 sm:px-4 sm:py-2.5 flex flex-col justify-center text-xs">
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-bold shrink-0 ${isPrintFriendly ? 'text-black' : 'text-purple-950'}`}>
                    យុទ្ធវិធីបង្រៀន៖
                  </span>
                  {isEditing ? (
                    <VoiceInput
                      value={h.teachingStrategy || ''}
                      onChangeValue={(val) => handleHeaderChange('teachingStrategy', val)}
                      placeholder="ឧ. យុទ្ធវិធី គិត-គូ-ចែករំលែក (Think-Pair-Share)..."
                      className="border-b border-slate-300 px-1 py-0.5 text-xs bg-white text-slate-800"
                    />
                  ) : (
                    <span className={`font-semibold ${isPrintFriendly ? 'text-black' : 'text-purple-950'}`}>
                      {h.teachingStrategy || 'យុទ្ធវិធី គិត-គូ-ចែករំលែក (Think-Pair-Share)'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Row 6: ការបញ្ជ្រាប (Integration) | ឈ្មោះគ្រូ និង សាលារៀន */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x ${
              isPrintFriendly ? 'divide-black' : 'divide-slate-200'
            }`}>
              <div className="p-2.5 sm:px-4 sm:py-2.5 flex flex-col justify-center text-xs">
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-bold shrink-0 ${isPrintFriendly ? 'text-black' : 'text-emerald-950'}`}>
                    ការបញ្ជ្រាប៖
                  </span>
                  {isEditing ? (
                    <div className="flex-1 space-y-1">
                      <VoiceInput
                        value={h.integration || ''}
                        onChangeValue={(val) => handleHeaderChange('integration', val)}
                        placeholder="ឧ. បរិស្ថាន សុខភាព សីលធម៌ សុវត្ថិភាពចរាចរណ៍..."
                        className="border-b border-slate-300 px-1 py-0.5 text-xs bg-white text-slate-800"
                      />
                      <div className="flex flex-wrap gap-1 pt-0.5 no-print">
                        {[
                          'បរិស្ថាន & ជីវចម្រុះ',
                          'សុខភាព & អនាម័យ',
                          'សីលធម៌ & ពលរដ្ឋល្អ',
                          'សុវត្ថិភាពចរាចរណ៍',
                          'បច្ចេកវិទ្យាឌីជីថល',
                          'សមភាពយេនឌ័រ',
                        ].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => handleHeaderChange('integration', chip)}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                          >
                            + {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className={`font-medium ${isPrintFriendly ? 'text-black' : 'text-emerald-900'}`}>
                      {h.integration || 'ការអប់រំបរិស្ថាន សុខភាព និងសីលធម៌រស់នៅស្អាត'}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-2.5 sm:px-4 sm:py-2.5 flex flex-col justify-center text-xs space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-bold shrink-0 ${isPrintFriendly ? 'text-black' : 'text-slate-900'}`}>
                    គ្រូបង្រៀន៖
                  </span>
                  {isEditing ? (
                    <VoiceInput
                      value={h.teacherName}
                      onChangeValue={(val) => handleHeaderChange('teacherName', val)}
                      placeholder="ឈ្មោះគ្រូបង្រៀន..."
                      className="border-b border-slate-300 px-1 py-0.5 text-xs bg-white"
                    />
                  ) : (
                    <span className={`font-medium ${isPrintFriendly ? 'text-black' : 'text-slate-800'}`}>
                      {h.teacherName || '............................'}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className={`font-bold shrink-0 ${isPrintFriendly ? 'text-black' : 'text-slate-900'}`}>
                    សាលារៀន៖
                  </span>
                  {isEditing ? (
                    <VoiceInput
                      value={h.schoolName}
                      onChangeValue={(val) => handleHeaderChange('schoolName', val)}
                      placeholder="ឈ្មោះសាលារៀន..."
                      className="border-b border-slate-300 px-1 py-0.5 text-xs bg-white"
                    />
                  ) : (
                    <span className={`font-medium ${isPrintFriendly ? 'text-black' : 'text-slate-800'}`}>
                      {h.schoolName || '............................'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section I: Objectives (Dedicated 3-Domain UI Component) */}
        <ObjectivesManager
          objectives={obj}
          onChange={(newObjectives) => {
            onUpdatePlan({
              ...plan,
              objectives: newObjectives,
            });
          }}
          isEditing={isEditing}
          isPrintFriendly={isPrintFriendly}
          topic={h.topic}
          subject={h.subject}
        />

        {/* Section II: Teaching Materials */}
        <div className="mb-6">
          <h3 className={`font-moul text-base mb-2 ${isPrintFriendly ? 'text-black' : 'text-blue-900'}`}>
            II. សម្ភារឧបទេស (Teaching Materials)
          </h3>
          <div className={`pl-2 sm:pl-4 text-sm space-y-1.5 ${isPrintFriendly ? 'text-black' : 'text-slate-700'}`}>
            <p>
              <strong className={isPrintFriendly ? 'text-black' : 'text-slate-900'}>- ចំពោះគ្រូ៖ </strong>
              {isEditing ? (
                <input
                  type="text"
                  value={mat.teacher.join(', ')}
                  onChange={(e) =>
                    onUpdatePlan({
                      ...plan,
                      materials: {
                        ...mat,
                        teacher: e.target.value.split(',').map((x) => x.trim()),
                      },
                    })
                  }
                  className="w-full border-b border-slate-300 py-0.5 text-sm mt-1"
                />
              ) : (
                <span>{mat.teacher.join(', ')}</span>
              )}
            </p>
            <p>
              <strong className={isPrintFriendly ? 'text-black' : 'text-slate-900'}>- ចំពោះសិស្ស៖ </strong>
              {isEditing ? (
                <input
                  type="text"
                  value={mat.students.join(', ')}
                  onChange={(e) =>
                    onUpdatePlan({
                      ...plan,
                      materials: {
                        ...mat,
                        students: e.target.value.split(',').map((x) => x.trim()),
                      },
                    })
                  }
                  className="w-full border-b border-slate-300 py-0.5 text-sm mt-1"
                />
              ) : (
                <span>{mat.students.join(', ')}</span>
              )}
            </p>
            {effectiveVocabularyList && effectiveVocabularyList.length > 0 && (
              <div className="pt-1.5 flex flex-wrap items-baseline gap-1.5">
                <strong className={isPrintFriendly ? 'text-black' : 'text-slate-900'}>- វាក្យសព្ទគន្លឹះក្នុងមេរៀន៖ </strong>
                <div className="flex flex-wrap gap-1.5">
                  {effectiveVocabularyList.map((item, vIdx) => (
                    <span
                      key={vIdx}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                        isPrintFriendly
                          ? 'border border-black text-black'
                          : 'bg-blue-50 text-blue-900 border border-blue-200'
                      }`}
                      title={item.definition}
                    >
                      <span>{item.term}</span>
                      {item.partOfSpeech && (
                        <span className={`text-[10px] font-normal italic ${isPrintFriendly ? 'text-black' : 'text-slate-500'}`}>
                          ({item.partOfSpeech})
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section III: Teaching & Learning Process (3-Column Table with Merged Step Headers) */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 className={`font-moul text-base ${isPrintFriendly ? 'text-black' : 'text-blue-900'}`}>
              III. ដំណើរការបង្រៀន និងរៀន (Teaching and Learning Process)
            </h3>

            {/* Duration Match Indicator and Quick Sync */}
            <div className="no-print flex items-center gap-2 text-xs">
              {isTimeMatched ? (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${
                  isPrintFriendly
                    ? 'bg-slate-100 text-black border border-black'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isPrintFriendly ? 'text-black' : 'text-emerald-600'}`} />
                  <span>៥ ជំហានបូកស្មើ {totalStepsMinutes} នាទី (ត្រូវនឹងម៉ោងបង្រៀន ១០០%)</span>
                </span>
              ) : (
                <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full font-medium ${
                  isPrintFriendly
                    ? 'bg-white border-2 border-black text-black'
                    : 'bg-amber-50 border border-amber-200 text-amber-900'
                }`}>
                  <AlertCircle className={`w-3.5 h-3.5 shrink-0 ${isPrintFriendly ? 'text-black' : 'text-amber-600'}`} />
                  <span>ជំហានសរុប {totalStepsMinutes} នាទី ≠ ម៉ោងបង្រៀន {totalHeaderMinutes} នាទី</span>
                  <button
                    type="button"
                    onClick={() => handleAutoRedistributeSteps()}
                    className={`ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer shadow-2xs ${
                      isPrintFriendly
                        ? 'bg-black text-white hover:bg-slate-800'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                    title="ចុចដើម្បីបែងចែកនាទីតាមស្តង់ដារក្រសួងស្វ័យប្រវត្តិ"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>តម្រូវស្វ័យប្រវត្តិ</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={`overflow-x-auto border-2 rounded-lg ${isPrintFriendly ? 'border-black' : 'border-slate-900'}`}>
            <table className="w-full table-fixed border-collapse text-left text-xs sm:text-sm">
              {/* Table Header: 3 columns matching official standard: សកម្មភាពគ្រូ, ខ្លឹមសារមេរៀន, សកម្មភាពសិស្ស */}
              <thead>
                <tr className={`border-b-2 font-moul ${
                  isPrintFriendly
                    ? 'bg-white text-black border-black'
                    : 'bg-[#fef3c7] text-slate-900 border-slate-900'
                }`}>
                  <th className={`p-2.5 font-bold border-r w-[33%] text-center tracking-wide text-sm sm:text-base ${
                    isPrintFriendly ? 'border-black' : 'border-slate-900'
                  }`}>
                    សកម្មភាពគ្រូ
                  </th>
                  <th className={`p-2.5 font-bold border-r w-[34%] text-center tracking-wide text-sm sm:text-base ${
                    isPrintFriendly ? 'border-black' : 'border-slate-900'
                  }`}>
                    ខ្លឹមសារមេរៀន
                  </th>
                  <th className={`p-2.5 font-bold w-[33%] text-center tracking-wide text-sm sm:text-base ${
                    isPrintFriendly ? 'text-black' : ''
                  }`}>
                    សកម្មភាពសិស្ស
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isPrintFriendly ? 'divide-black' : 'divide-slate-800'}`}>
                {plan.steps.map((step, idx) => {
                  const isStep3 = Boolean(
                    (step.stepNumber && (step.stepNumber.includes('៣') || step.stepNumber.includes('3'))) ||
                    (step.stepTitle && step.stepTitle.includes('មេរៀនថ្មី')) ||
                    idx === 2
                  );

                  return (
                    <React.Fragment key={idx}>
                      {/* Merged Step Header Row (Colspan 3) */}
                      <tr className={`border-b ${
                        isPrintFriendly
                          ? 'border-black bg-white'
                          : 'border-slate-900 bg-amber-50/40'
                      }`}>
                        <td colSpan={3} className={`p-2.5 text-center align-middle font-bold ${
                          isPrintFriendly ? 'text-black' : 'text-slate-900'
                        }`}>
                          {isEditing ? (
                            <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
                              <input
                                type="text"
                                value={step.stepNumber}
                                onChange={(e) => handleStepChange(idx, 'stepNumber', e.target.value)}
                                placeholder="ជំហានទី..."
                                className="px-2 py-1 text-xs border border-slate-300 rounded bg-white w-28 text-center font-bold"
                              />
                              <input
                                type="text"
                                value={step.stepTitle}
                                onChange={(e) => handleStepChange(idx, 'stepTitle', e.target.value)}
                                placeholder="ចំណងជើងជំហាន..."
                                className="px-2 py-1 text-xs border border-slate-300 rounded bg-white flex-1 min-w-[200px] text-center font-bold"
                              />
                              <input
                                type="text"
                                value={step.duration}
                                onChange={(e) => handleStepChange(idx, 'duration', e.target.value)}
                                placeholder="រយៈពេល..."
                                className="px-2 py-1 text-xs border border-slate-300 rounded bg-white w-24 text-center"
                              />
                              <button
                                type="button"
                                onClick={() => onRefineStep(idx)}
                                className="no-print flex items-center space-x-1 text-[11px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md border border-indigo-200 font-medium transition"
                              >
                                <Sparkles className="w-3 h-3 text-indigo-500" />
                                <span>AI កែលម្អ</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              <span className={`font-moul text-sm sm:text-base ${isPrintFriendly ? 'text-black' : 'text-slate-900'}`}>
                                {step.stepNumber ? `${step.stepNumber}៖ ` : ''}
                                {step.stepTitle} {step.duration ? `(${step.duration})` : ''}
                              </span>
                              {isStep3 && (
                                <button
                                  type="button"
                                  onClick={() => onRefineStep(idx)}
                                  className="no-print inline-flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200 font-semibold transition cursor-pointer shadow-2xs"
                                  title="ចុចដើម្បីបន្ថែមការពន្យល់ពេលរៀនលម្អិត និងដំណោះស្រាយ"
                                >
                                  <Sparkles className="w-3 h-3 text-blue-600" />
                                  <span>បន្ថែមការពន្យល់ពេលរៀន & ដំណោះស្រាយ</span>
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Step Content Row (3 Columns: Teacher, Content, Student) */}
                      <tr className={`border-b-2 ${
                        isPrintFriendly
                          ? 'border-black bg-white'
                          : 'border-slate-900 hover:bg-slate-50/40'
                      } transition`}>
                        {/* Column 1: សកម្មភាពគ្រូ */}
                        <td className={`p-3 border-r align-top break-words overflow-hidden w-[33%] max-w-0 ${isPrintFriendly ? 'border-black' : 'border-slate-900'}`}>
                          {isEditing ? (
                            <textarea
                              rows={6}
                              value={step.teacherActivity}
                              onChange={(e) => handleStepChange(idx, 'teacherActivity', e.target.value)}
                              placeholder="សកម្មភាពគ្រូ..."
                              className="w-full text-xs sm:text-sm border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          ) : (
                            renderFormattedLines(step.teacherActivity, false, isPrintFriendly)
                          )}
                        </td>

                        {/* Column 2: ខ្លឹមសារមេរៀន */}
                        <td className={`p-3 border-r align-top break-words overflow-hidden w-[34%] max-w-0 ${isPrintFriendly ? 'border-black' : 'border-slate-900'}`}>
                          {isEditing ? (
                            <textarea
                              rows={6}
                              value={step.content}
                              onChange={(e) => handleStepChange(idx, 'content', e.target.value)}
                              placeholder="ខ្លឹមសារមេរៀន..."
                              className="w-full text-xs sm:text-sm border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          ) : (
                            renderFormattedLines(step.content, true, isPrintFriendly)
                          )}

                          {/* Step 3 AI Auto Visual Aid (Embedded directly in Step 3, auto-adapts to column width without table blowout) */}
                          {isStep3 && (
                            <IllustrationSection
                              illustration={plan.illustration || generateTopicIllustration(h.topic, h.subject, h.grade)}
                              topic={h.topic}
                              subject={h.subject}
                              grade={h.grade}
                              isEditing={isEditing}
                              isPrintFriendly={isPrintFriendly}
                              onChange={(newIll) => {
                                onUpdatePlan({
                                  ...plan,
                                  illustration: newIll,
                                });
                              }}
                            />
                          )}
                        </td>

                        {/* Column 3: សកម្មភាពសិស្ស */}
                        <td className={`p-3 align-top break-words overflow-hidden w-[33%] max-w-0 ${isPrintFriendly ? 'text-black' : ''}`}>
                          {isEditing ? (
                            <textarea
                              rows={6}
                              value={step.studentActivity}
                              onChange={(e) => handleStepChange(idx, 'studentActivity', e.target.value)}
                              placeholder="សកម្មភាពសិស្ស..."
                              className="w-full text-xs sm:text-sm border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          ) : (
                            renderFormattedLines(step.studentActivity, false, isPrintFriendly)
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section IV: Board Summary */}
        {plan.boardSummary && (
          <div className="mb-6">
            <h3 className={`font-moul text-base mb-2 ${isPrintFriendly ? 'text-black' : 'text-blue-900'}`}>
              IV. ប្លង់ក្ដារខៀន (Board Summary)
            </h3>
            {isEditing ? (
              <textarea
                rows={3}
                value={plan.boardSummary}
                onChange={(e) =>
                  onUpdatePlan({
                    ...plan,
                    boardSummary: e.target.value,
                  })
                }
                className={`w-full border rounded p-2 text-sm ${
                  isPrintFriendly ? 'border-black bg-white text-black' : 'border-slate-300'
                }`}
              />
            ) : (
              <div className={`p-3 rounded-lg border text-sm whitespace-pre-line leading-relaxed font-sans ${
                isPrintFriendly
                  ? 'bg-white border-2 border-black text-black'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                {plan.boardSummary}
              </div>
            )}
          </div>
        )}

        {/* Section V: Reflection */}
        {plan.reflection && (
          <div className="mb-8">
            <h3 className={`font-moul text-base mb-2 ${isPrintFriendly ? 'text-black' : 'text-blue-900'}`}>
              V. ការស្វ័យតម្លៃ និងការឆ្លុះបញ្ចាំងរបស់គ្រូ (Teacher Reflection)
            </h3>
            <div className={`pl-2 sm:pl-4 text-sm space-y-1.5 ${isPrintFriendly ? 'text-black' : 'text-slate-700'}`}>
              <p>
                <strong className={isPrintFriendly ? 'text-black' : 'text-slate-900'}>- ចំណុចខ្លាំង៖ </strong>
                {isEditing ? (
                  <input
                    type="text"
                    value={plan.reflection.strengths}
                    onChange={(e) =>
                      onUpdatePlan({
                        ...plan,
                        reflection: { ...plan.reflection!, strengths: e.target.value },
                      })
                    }
                    className="w-full border-b border-slate-300 py-0.5 text-sm"
                  />
                ) : (
                  <span>{plan.reflection.strengths}</span>
                )}
              </p>
              <p>
                <strong className={isPrintFriendly ? 'text-black' : 'text-slate-900'}>- ចំណុចខ្វះខាត៖ </strong>
                {isEditing ? (
                  <input
                    type="text"
                    value={plan.reflection.weaknesses}
                    onChange={(e) =>
                      onUpdatePlan({
                        ...plan,
                        reflection: { ...plan.reflection!, weaknesses: e.target.value },
                      })
                    }
                    className="w-full border-b border-slate-300 py-0.5 text-sm"
                  />
                ) : (
                  <span>{plan.reflection.weaknesses}</span>
                )}
              </p>
              <p>
                <strong className={isPrintFriendly ? 'text-black' : 'text-slate-900'}>- វិធានការដោះស្រាយ៖ </strong>
                {isEditing ? (
                  <input
                    type="text"
                    value={plan.reflection.solutions}
                    onChange={(e) =>
                      onUpdatePlan({
                        ...plan,
                        reflection: { ...plan.reflection!, solutions: e.target.value },
                      })
                    }
                    className="w-full border-b border-slate-300 py-0.5 text-sm"
                  />
                ) : (
                  <span>{plan.reflection.solutions}</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className={`grid grid-cols-2 text-center text-sm pt-4 border-t ${
          isPrintFriendly ? 'border-black text-black' : 'border-slate-200'
        }`}>
          <div>
            <p className={`font-bold ${isPrintFriendly ? 'text-black' : 'text-slate-800'}`}>បានឃើញ និងឯកភាព</p>
            <p className={`font-moul text-sm mt-1 ${isPrintFriendly ? 'text-black' : 'text-slate-900'}`}>នាយកសាលា</p>
            <div className={`h-16 flex items-end justify-center ${isPrintFriendly ? 'text-black/60' : 'text-slate-400'}`}>
              ................................................
            </div>
          </div>

          <div>
            <p className={isPrintFriendly ? 'text-black' : 'text-slate-700'}>{h.date || 'ថ្ងៃទី..... ខែ..... ឆ្នាំ២០២....'}</p>
            <p className={`font-moul text-sm mt-1 ${isPrintFriendly ? 'text-black' : 'text-slate-900'}`}>ហត្ថលេខាគ្រូបង្រៀន</p>
            <div className={`h-16 flex items-end justify-center font-bold ${isPrintFriendly ? 'text-black' : 'text-slate-800'}`}>
              {h.teacherName || '................................................'}
            </div>
          </div>
        </div>

        {/* Supplementary Annex: Key Vocabulary Reference */}
        <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-300 w-full">
          <VocabularyListSection
            title="ឧបសម្ព័ន្ធ៖ បញ្ជីវាក្យសព្ទគន្លឹះក្នុងមេរៀន (Key Terms & Vocabulary Reference)"
            vocabularyList={effectiveVocabularyList}
            topic={h.topic}
            subject={h.subject}
            grade={h.grade}
            isEditing={isEditing}
            isPrintFriendly={isPrintFriendly}
            onChange={(updatedList) =>
              onUpdatePlan({
                ...plan,
                vocabularyList: updatedList,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
