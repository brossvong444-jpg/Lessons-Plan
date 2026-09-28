import React, { useState } from 'react';
import { TeachingStep } from '../types/lessonPlan';
import { X, Sparkles, Send, Check } from 'lucide-react';

interface StepRefineModalProps {
  isOpen: boolean;
  step: TeachingStep | null;
  stepIndex: number;
  subject: string;
  grade: string;
  topic: string;
  totalDuration?: string;
  onClose: () => void;
  onApplyRefinement: (
    stepIndex: number,
    refined: { content: string; teacherActivity: string; studentActivity: string },
  ) => void;
}

const QUICK_INSTRUCTIONS = [
  'បន្ថែមការពន្យល់ពេលរៀនលម្អិត និងដំណោះស្រាយមួយជំហានម្តងៗ',
  'បន្ថែមវិធីសាស្រ្តបង្រៀន និងយុទ្ធវិធីបង្រៀនស្របតាមក្រសួង MoEYS',
  'បញ្ចូលយុទ្ធវិធី គិត-គូ-ចែករំលែក (Think-Pair-Share) ក្នុងសកម្មភាពគ្រូនិងសិស្ស',
  'បញ្ចូលយុទ្ធវិធី ដើរទស្សនវិចិត្រសាល (Gallery Walk) ក្នុងការបង្ហាញស្នាដៃជាក្រុម',
  'បញ្ចូលយុទ្ធវិធី ផ្គុំបំណែក (Jigsaw) ក្នុងការស្រាវជ្រាវជាក្រុមអ្នកជំនាញ',
  'បញ្ចូលយុទ្ធវិធី ក្ដារឈ្នួនឆ្លើយរហ័ស (Quick Slates) ដើម្បីវាយតម្លៃរហ័ស',
  'តម្រូវទំហំខ្លឹមសារ និងសកម្មភាពឱ្យសមស្របនឹងរយៈពេលកំណត់',
  'បង្កើនសកម្មភាពសិស្សធ្វើការងារជាក្រុមតូចៗ',
  'បន្ថែមសំណួរគន្លឹះវាស់ស្ទង់ការយល់ដឹងតាមកម្រិតប្លូម',
  'សម្រួលខ្លឹមសារឱ្យងាយស្រួលយល់សម្រាប់សិស្សខ្សោយ',
];

export const StepRefineModal: React.FC<StepRefineModalProps> = ({
  isOpen,
  step,
  stepIndex,
  subject,
  grade,
  topic,
  totalDuration,
  onClose,
  onApplyRefinement,
}) => {
  if (!isOpen || !step) return null;

  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRefine = async (customText?: string) => {
    const promptText = customText || instruction;
    if (!promptText.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/refine-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step,
          instruction: promptText,
          subject,
          grade,
          topic,
          totalDuration,
        }),
      });

      if (!res.ok) throw new Error('បរាជ័យក្នុងការកែសម្រួល');
      const data = await res.json();

      onApplyRefinement(stepIndex, {
        content: data.content || step.content,
        teacherActivity: data.teacherActivity || step.teacherActivity,
        studentActivity: data.studentActivity || step.studentActivity,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      setError('មិនអាចកែសម្រួលបាន សូមព្យាយាមម្ដងទៀត');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-base">
                  AI កែលម្អ {step.stepNumber} ({step.stepTitle})
                </h3>
                {step.duration && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    {step.duration}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{topic} {totalDuration ? `(ម៉ោងសរុប៖ ${totalDuration})` : ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              ជ្រើសរើសការណែនាំរហ័ស៖
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_INSTRUCTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInstruction(item);
                    handleRefine(item);
                  }}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-700 transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ឬសរសេរការណែនាំតាមចិត្ត៖
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="ឧទាហរណ៍៖ បន្ថែមលំហាត់អនុវត្តន៍ ២ ទៀត និងសកម្មភាពឡើងក្ដារខៀនជាគូ..."
              className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {error && <p className="text-xs text-rose-600">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 px-6 py-3 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
          >
            បោះបង់
          </button>
          <button
            type="button"
            disabled={isLoading || !instruction.trim()}
            onClick={() => handleRefine()}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs disabled:opacity-50 transition"
          >
            {isLoading ? (
              <span>កំពុងកែសម្រួល...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>អនុវត្តការកែសម្រួល</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
