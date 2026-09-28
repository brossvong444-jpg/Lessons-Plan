/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { LessonPlanForm } from './components/LessonPlanForm';
import { LessonPlanPreview } from './components/LessonPlanPreview';
import { ExportToolbar } from './components/ExportToolbar';
import { StepRefineModal } from './components/StepRefineModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { AboutOwnerModal } from './components/AboutOwnerModal';
import { SAMPLE_LESSON_PLANS } from './data/sampleLessonPlans';
import { LessonPlanData, GenerateLessonPlanRequest } from './types/lessonPlan';
import { generateTopicIllustration } from './utils/illustrationEngine';
import { buildTopicAlignedLessonPlan } from '../curriculumEngine';
import { useLanguage } from './i18n/LanguageContext';
import { FileCheck, Sparkles, AlertCircle, HelpCircle, ArrowDown, ShieldCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'khmer_saved_lesson_plans_v1';

function ensurePlanIllustration(p: LessonPlanData): LessonPlanData {
  if (!p) return p;
  if (!p.illustration) {
    return {
      ...p,
      illustration: generateTopicIllustration(p.header?.topic || '', p.header?.subject || 'គណិតវិទ្យា', p.header?.grade || 'ថ្នាក់ទី ៩'),
    };
  }
  return p;
}

export default function App() {
  const { t, language } = useLanguage();
  const [isAboutOwnerOpen, setIsAboutOwnerOpen] = useState(false);

  const [currentPlan, setCurrentPlan] = useState<LessonPlanData>(() => {
    // Check if there are saved plans, or default to first sample
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return ensurePlanIllustration(parsed[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return ensurePlanIllustration(SAMPLE_LESSON_PLANS[0]);
  });

  const [savedPlans, setSavedPlans] = useState<LessonPlanData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [...SAMPLE_LESSON_PLANS];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPrintFriendly, setIsPrintFriendly] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [refineModal, setRefineModal] = useState<{
    isOpen: boolean;
    stepIndex: number;
  }>({
    isOpen: false,
    stepIndex: 0,
  });
  const [notification, setNotification] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  // Sync saved plans to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlans));
    } catch (e) {
      console.error(e);
    }
  }, [savedPlans]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Generate Lesson Plan Handler
  const handleGenerate = async (reqData: GenerateLessonPlanRequest) => {
    setIsLoading(true);
    try {
      let populatedPlan: LessonPlanData;

      try {
        const response = await fetch('/api/generate-lesson-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqData),
        });

        if (response.ok) {
          const newPlan: LessonPlanData = await response.json();
          populatedPlan = ensurePlanIllustration(newPlan);
        } else {
          // Fallback to client-side curriculum engine (for static hosting like GitHub Pages)
          const fallbackPlan = buildTopicAlignedLessonPlan(reqData);
          populatedPlan = ensurePlanIllustration(fallbackPlan);
        }
      } catch {
        // Network / 404 error fallback (e.g. GitHub Pages without Express backend)
        const fallbackPlan = buildTopicAlignedLessonPlan(reqData);
        populatedPlan = ensurePlanIllustration(fallbackPlan);
      }

      setCurrentPlan(populatedPlan);

      // Save to saved plans automatically
      setSavedPlans((prev) => [populatedPlan, ...prev.filter((p) => p.id !== populatedPlan.id)]);

      showToast('កិច្ចតែងការបង្រៀនត្រូវបានបង្កើតដោយជោគជ័យ!');
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Smooth scroll to preview section
      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err: any) {
      console.error('Generation error:', err);
      showToast('មានបញ្ហាក្នុងការបង្កើត សូមព្យាយាមម្ដងទៀត');
    } finally {
      setIsLoading(false);
    }
  };

  // Load a sample
  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_LESSON_PLANS.find((s) => s.id === sampleId);
    if (sample) {
      const populated = ensurePlanIllustration(sample);
      setCurrentPlan(populated);
      showToast(`បានផ្ទុកគំរូ៖ ${sample.header.subject}`);
      previewRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // New Blank / Reset
  const handleNewPlan = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save current plan manually to history
  const handleSaveToHistory = () => {
    setSavedPlans((prev) => {
      const filtered = prev.filter((p) => p.id !== currentPlan.id);
      return [currentPlan, ...filtered];
    });
    showToast('បានរក្សាទុកក្នុងប្រវត្តិដោយជោគជ័យ!');
  };

  // Delete from history
  const handleDeletePlan = (id: string) => {
    setSavedPlans((prev) => prev.filter((p) => p.id !== id));
    showToast('បានលុបកិច្ចតែងការចេញពីប្រវត្តិ');
  };

  // Open AI refine modal for a step
  const handleOpenRefineStep = (stepIndex: number) => {
    setRefineModal({
      isOpen: true,
      stepIndex,
    });
  };

  // Apply step refinement
  const handleApplyStepRefinement = (
    stepIndex: number,
    refined: { content: string; teacherActivity: string; studentActivity: string },
  ) => {
    const updatedSteps = [...currentPlan.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      ...refined,
    };
    setCurrentPlan({
      ...currentPlan,
      steps: updatedSteps,
    });
    showToast('បានកែលម្អជំហានដោយ AI រួចរាល់!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-200">
      {/* Navbar */}
      <Navbar
        onSelectSample={handleSelectSample}
        onNewPlan={handleNewPlan}
        savedCount={savedPlans.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAboutOwner={() => setIsAboutOwnerOpen(true)}
      />

      {/* Floating Toast Notification */}
      {notification && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-bottom-5 duration-300">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Hero / Intro Banner */}
        <section className="no-print relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-lg">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>{language === 'km' ? 'ប្រព័ន្ធបញ្ញាសិប្បនិម្មិតជំនួយគ្រូបង្រៀនកម្ពុជា' : 'Cambodia AI Teacher Pedagogical Assistant'}</span>
              </div>
              <button
                onClick={() => setIsAboutOwnerOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 text-xs font-semibold transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.ownerBadge}</span>
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-moul tracking-wide leading-tight">
              {language === 'km' ? 'បង្កើតកិច្ចតែងការបង្រៀនត្រឹមត្រូវតាមស្តង់ដារ MoEYS' : 'Generate MoEYS-Compliant Lesson Plans'}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {language === 'km' ? (
                <>
                  គ្រាន់តែបញ្ចូលប្រធានបទមេរៀន ប្រព័ន្ធ AI នឹងរៀបចំជូននូវកិច្ចតែងការពេញលេញ រួមមាន
                  វត្ថុបំណង ៣ ដែន (ចំណេះដឹង បំណិន ឥរិយាបថ), សម្ភារឧបទេស, និងដំណាក់កាលបង្រៀន ៥ ជំហាន
                  ព្រមទាំងអាចទាញយកជាឯកសារ <strong>Word (.docx)</strong> និង <strong>PDF</strong> បានភ្លាមៗ!
                </>
              ) : (
                <>
                  Simply enter a lesson topic, and the system instantly generates a comprehensive pedagogical
                  lesson plan including 3-domain learning objectives, teaching materials, 5-step instructional process,
                  and export ready for <strong>Word (.docx)</strong> and <strong>PDF</strong>!
                </>
              )}
            </p>
          </div>
          {/* Subtle decoration background pattern */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
            <div className="w-96 h-96 rounded-full border-40 border-white/20"></div>
          </div>
        </section>

        {/* Section 1: កន្លែងសរសេរប្រធានបទ និងបង្កើតកិច្ចតែងការ */}
        <section id="create-section" className="no-print">
          <LessonPlanForm onGenerate={handleGenerate} isLoading={isLoading} />
        </section>

        {/* Arrow pointer to preview if plan exists */}
        <div className="no-print flex items-center justify-center pt-2">
          <div className="inline-flex items-center space-x-2 text-xs font-medium text-slate-500 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-2xs">
            <span>{language === 'km' ? 'ពិនិត្យមើល និងទាញយកលទ្ធផលខាងក្រោម' : 'Preview and export your lesson plan below'}</span>
            <ArrowDown className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
          </div>
        </div>

        {/* Section 2: កន្លែងទាញយកឯកសារជាទម្រង់ Word និងជាទម្រង់ PDF ផងដែរ */}
        <section id="download-section" className="no-print">
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              ២
            </span>
            <h2 className="text-lg font-bold text-slate-800">
              {language === 'km' ? 'កន្លែងទាញយកឯកសារ (Word & PDF) និង កែសម្រួល' : 'Export Toolbar (Word & PDF) and Edit Content'}
            </h2>
          </div>
          <ExportToolbar
            plan={currentPlan}
            isEditing={isEditing}
            onToggleEdit={() => setIsEditing(!isEditing)}
            onSaveToHistory={handleSaveToHistory}
            isPrintFriendly={isPrintFriendly}
            onTogglePrintFriendly={() => {
              const next = !isPrintFriendly;
              setIsPrintFriendly(next);
              showToast(
                next
                  ? (language === 'km' ? 'បានបើកទម្រង់ Print-Friendly (សន្សំទឹកថ្នាំ ស-ខ្មៅ)' : 'Print-Friendly mode enabled')
                  : (language === 'km' ? 'បានបិទទម្រង់ Print-Friendly' : 'Print-Friendly mode disabled'),
              );
            }}
          />
        </section>

        {/* Section 3: កន្លែងពិនិត្យមើលលទ្ធផល (Interactive MoEYS Standard A4 Preview) */}
        <section id="preview-section" ref={previewRef}>
          <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                ៣
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {t.section3Title}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEditing
                    ? t.editingModeHint
                    : isPrintFriendly
                    ? t.printFriendlyModeHint
                    : t.normalModeHint}
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 italic">
              {t.moeysStandardNote}
            </div>
          </div>

          <LessonPlanPreview
            plan={currentPlan}
            isEditing={isEditing}
            onUpdatePlan={(updated) => setCurrentPlan(updated)}
            onRefineStep={handleOpenRefineStep}
            isPrintFriendly={isPrintFriendly}
          />
        </section>
      </main>

      {/* Footer with Creator / Owner rights */}
      <footer className="no-print mt-16 bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800 text-sm">
                  {t.ownerName}
                </p>
                <p className="text-xs text-slate-500">
                  {t.ownerRole} • Email: <a href="mailto:brossvong444@gmail.com" className="text-blue-600 hover:underline">brossvong444@gmail.com</a>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsAboutOwnerOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition"
              >
                {t.aboutOwnerBtn}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400">
            <p>
              {t.footerRights}
            </p>
            <p>
              {t.footerFormats}
            </p>
          </div>
        </div>
      </footer>

      {/* About App Owner Modal */}
      <AboutOwnerModal
        isOpen={isAboutOwnerOpen}
        onClose={() => setIsAboutOwnerOpen(false)}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        plans={savedPlans}
        onSelectPlan={(p) => {
          setCurrentPlan(p);
          showToast(`បានជ្រើសរើស៖ ${p.header.topic}`);
        }}
        onDeletePlan={handleDeletePlan}
      />

      {/* AI Step Refiner Modal */}
      <StepRefineModal
        isOpen={refineModal.isOpen}
        step={currentPlan.steps[refineModal.stepIndex] || null}
        stepIndex={refineModal.stepIndex}
        subject={currentPlan.header.subject}
        grade={currentPlan.header.grade}
        topic={currentPlan.header.topic}
        totalDuration={currentPlan.header.duration}
        onClose={() => setRefineModal({ isOpen: false, stepIndex: 0 })}
        onApplyRefinement={handleApplyStepRefinement}
      />
    </div>
  );
}
