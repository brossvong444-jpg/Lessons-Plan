import React from 'react';
import { BookOpen, Sparkles, FileText, Download, GraduationCap } from 'lucide-react';

interface NavbarProps {
  onSelectSample: (sampleId: string) => void;
  onNewPlan: () => void;
  savedCount: number;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectSample,
  onNewPlan,
  savedCount,
  onOpenHistory,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-moul text-base sm:text-lg text-slate-900 tracking-wide">
                កិច្ចតែងការបង្រៀន AI
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                ស្តង់ដារ MoEYS
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              កម្មវិធីបង្កើតកិច្ចតែងការគ្រូបង្រៀនស្វ័យប្រវត្តិ • នាំចេញជា Word & PDF
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 px-2 font-medium">គំរូរហ័ស៖</span>
            <button
              onClick={() => onSelectSample('sample-math-1')}
              className="text-xs px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-2xs transition"
            >
              គណិតវិទ្យា ថ្នាក់ទី៩
            </button>
            <button
              onClick={() => onSelectSample('sample-khmer-2')}
              className="text-xs px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-2xs transition"
            >
              ភាសាខ្មែរ ថ្នាក់ទី៨
            </button>
            <button
              onClick={() => onSelectSample('sample-science-3')}
              className="text-xs px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-2xs transition"
            >
              រូបវិទ្យា ថ្នាក់ទី១០
            </button>
          </div>

          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
            title="បញ្ជីកិច្ចតែងការដែលបានរក្សាទុក"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>ប្រវត្តិ ({savedCount})</span>
          </button>

          <button
            onClick={onNewPlan}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">បង្កើតថ្មី</span>
          </button>
        </div>
      </div>
    </header>
  );
};
