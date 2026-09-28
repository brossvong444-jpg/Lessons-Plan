import React, { useState } from 'react';
import { LessonIllustration } from '../types/lessonPlan';
import {
  Image as ImageIcon,
  Sparkles,
  Maximize2,
  RefreshCw,
  Download,
  Loader2,
  Check,
  X,
} from 'lucide-react';
import { generateTopicIllustration } from '../utils/illustrationEngine';

interface IllustrationSectionProps {
  illustration?: LessonIllustration;
  topic: string;
  subject: string;
  grade: string;
  isEditing: boolean;
  isPrintFriendly?: boolean;
  onChange: (updatedIllustration: LessonIllustration) => void;
}

export const IllustrationSection: React.FC<IllustrationSectionProps> = ({
  illustration,
  topic,
  subject,
  grade,
  isEditing,
  isPrintFriendly = false,
  onChange,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Fallback if not provided
  const currentIllustration: LessonIllustration =
    illustration || generateTopicIllustration(topic, subject, grade);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-illustration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, grade }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.illustration) {
          onChange(data.illustration);
          return;
        }
      }
      // Client-side fallback
      const fresh = generateTopicIllustration(topic, subject, grade);
      fresh.id = 'ill-' + Date.now();
      onChange(fresh);
    } catch {
      const fresh = generateTopicIllustration(topic, subject, grade);
      fresh.id = 'ill-' + Date.now();
      onChange(fresh);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    try {
      const a = document.createElement('a');
      a.href = currentIllustration.url;
      const cleanFileName = `AI_Visual_${subject}_${topic}`.replace(/[\s/\\:]+/g, '_');
      a.download = `${cleanFileName}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className={`mt-3 rounded-xl overflow-hidden border w-full max-w-full transition-all select-none ${
        isPrintFriendly
          ? 'border border-black bg-white text-black shadow-none'
          : 'border-slate-800 bg-slate-900 text-slate-100 shadow-md ring-1 ring-slate-800/80'
      }`}
    >
      {/* Step 3 Visual Aid Header Bar */}
      <div
        className={`px-2.5 py-1.5 flex flex-wrap items-center justify-between gap-1.5 border-b ${
          isPrintFriendly
            ? 'border-black bg-slate-50 text-black'
            : 'border-slate-800 bg-slate-900/95 text-slate-200'
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isPrintFriendly ? 'text-black' : 'text-emerald-400'}`} />
          <span className={`text-[11px] font-bold truncate ${isPrintFriendly ? 'text-black' : 'text-emerald-300'}`}>
            រូបភាពឧបទេស AI Auto
          </span>
          <span className={`no-print text-[9px] px-1.5 py-0.2 rounded font-medium ${
            isPrintFriendly ? 'border border-black text-black' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
          }`}>
            ជំហានទី ៣
          </span>
        </div>

        {/* Action Controls - Compact and wrapped to never push table columns */}
        <div className="no-print flex items-center gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition cursor-pointer border ${
              isPrintFriendly
                ? 'border-black text-black hover:bg-slate-100'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
            title="ពង្រីកមើលរូបភាពពេញអេក្រង់"
          >
            <Maximize2 className="w-3 h-3" />
            <span>ពង្រីក</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition cursor-pointer border ${
              isPrintFriendly
                ? 'border-black text-black hover:bg-slate-100'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
            title="ទាញយករូបភាពទុកប្រើប្រាស់"
          >
            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Download className="w-3 h-3" />}
            <span>{isCopied ? 'បានទាញយក' : 'ទាញយក'}</span>
          </button>

          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isGenerating}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
              isPrintFriendly
                ? 'border border-black text-black hover:bg-slate-100'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
            } ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
            title="បង្កើតរូបភាព AI ថ្មីលើប្រធានបទនេះ"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>កំពុង...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3" />
                <span>បង្កើត AI ថ្មី</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Responsive Visual Viewport: adapts smoothly to table width without expanding table */}
      <div
        className={`relative w-full max-w-full overflow-hidden flex items-center justify-center ${
          isPrintFriendly
            ? 'bg-white p-1'
            : 'aspect-16/10 sm:aspect-16/9 max-h-56 sm:max-h-64 bg-slate-950 p-1.5'
        }`}
      >
        <img
          src={currentIllustration.url}
          alt={currentIllustration.caption || topic}
          referrerPolicy="no-referrer"
          className="w-full h-full max-w-full max-h-56 sm:max-h-64 object-contain rounded cursor-zoom-in transition-transform duration-200 hover:scale-[1.01]"
          onClick={() => setIsFullscreen(true)}
          title="ចុចដើម្បីពង្រីកពេញអេក្រង់ (Fullscreen Projector)"
        />

        {/* Quick zoom button */}
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="no-print absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white p-1 rounded-md border border-white/20 transition cursor-pointer opacity-80 hover:opacity-100 shadow"
          title="ពង្រីកពេញអេក្រង់សម្រាប់បង្រៀន"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Caption & Pedagogical Note */}
      <div
        className={`px-2.5 py-2 border-t ${
          isPrintFriendly ? 'border-black bg-white text-black' : 'border-slate-800 bg-slate-900/95 text-slate-200'
        }`}
      >
        {isEditing ? (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className={`text-[10px] font-bold ${isPrintFriendly ? 'text-black' : 'text-emerald-400'}`}>
                📌 ចំណងជើងរូបភាពឧបទេស៖
              </span>
            </div>
            <input
              type="text"
              value={currentIllustration.caption}
              onChange={(e) =>
                onChange({
                  ...currentIllustration,
                  caption: e.target.value,
                })
              }
              placeholder="ចំណងជើងរូបភាពឧបទេស..."
              className="w-full text-xs rounded border border-slate-600 bg-slate-800 text-white px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>
        ) : (
          <div>
            <div className="text-[11px] sm:text-xs font-semibold leading-snug break-words flex items-start gap-1">
              <span className={isPrintFriendly ? 'text-black shrink-0' : 'text-emerald-400 shrink-0'}>📌</span>
              <span className={isPrintFriendly ? 'text-black' : 'text-slate-100'}>
                {currentIllustration.caption || `រូបភាពឧបទេសគរុកោសល្យ៖ ${topic}`}
              </span>
            </div>
            <p className={`text-[10px] mt-0.5 break-words ${isPrintFriendly ? 'text-black italic' : 'text-slate-400'}`}>
              សមស្របសម្រាប់៖ ការពន្យល់ ការសង្កេត និងពិភាក្សាជាក្រុមក្នុងមេរៀនថ្មី (ជំហានទី ៣)
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox for Projector / Smartboard in Classroom */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 text-white">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold">
                <ImageIcon className="w-4 h-4 text-white" />
              </span>
              <div>
                <h3 className="font-moul text-sm sm:text-base text-white">
                  {currentIllustration.caption || topic}
                </h3>
                <p className="text-xs text-slate-400">
                  {subject} • {grade} • គំនូសបំព្រួញគរុកោសល្យ MoEYS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>ទាញយករូប</span>
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="bg-white/10 hover:bg-rose-600 text-white p-2 rounded-lg transition cursor-pointer"
                title="បិទ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Image Viewport */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
            <img
              src={currentIllustration.url}
              alt={currentIllustration.caption || topic}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <span>💡 ប្រើសម្រាប់បង្ហាញលើស្លាយ ប្រូជិចទ័រ (Projector) ឬក្ដារឆ្លាតវៃ (Smartboard) ក្នុងបន្ទប់រៀន</span>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="text-white hover:underline cursor-pointer"
            >
              ចុចបិទ (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
