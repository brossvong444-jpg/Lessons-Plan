import React from 'react';
import { Sparkles, FileText, GraduationCap, Languages, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface NavbarProps {
  onSelectSample: (sampleId: string) => void;
  onNewPlan: () => void;
  savedCount: number;
  onOpenHistory: () => void;
  onOpenAboutOwner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectSample,
  onNewPlan,
  savedCount,
  onOpenHistory,
  onOpenAboutOwner,
}) => {
  const { t, language, toggleLanguage, setLanguage } = useLanguage();

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-moul text-sm sm:text-base md:text-lg text-slate-900 tracking-wide">
                {t.appTitle}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                {t.moeysBadge}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Buttons & Utilities */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Quick Samples (Desktop only) */}
          <div className="hidden xl:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 px-2 font-medium">{t.quickSamples}</span>
            <button
              onClick={() => onSelectSample('sample-math-1')}
              className="text-xs px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-2xs transition"
            >
              {t.sampleMath}
            </button>
            <button
              onClick={() => onSelectSample('sample-khmer-2')}
              className="text-xs px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-2xs transition"
            >
              {t.sampleKhmer}
            </button>
            <button
              onClick={() => onSelectSample('sample-science-3')}
              className="text-xs px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-2xs transition"
            >
              {t.sampleScience}
            </button>
          </div>

          {/* Owner Credit Badge Button */}
          <button
            onClick={onOpenAboutOwner}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-amber-200/80 shadow-2xs transition group"
            title={t.ownerTitle}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            <span className="font-semibold hidden sm:inline">{t.ownerBadge}</span>
            <span className="sm:hidden text-[11px] font-semibold">ឡោម មនីវង្ស</span>
          </button>

          {/* Language Switcher Button */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setLanguage('km')}
              className={`px-2 py-1 rounded-md transition flex items-center space-x-1 ${
                language === 'km'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="ប្តូរទៅភាសាខ្មែរ"
            >
              <span className="text-xs">🇰🇭</span>
              <span>ខ្មែរ</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-md transition flex items-center space-x-1 ${
                language === 'en'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to English"
            >
              <span className="text-xs">🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
            title={t.historyTitle}
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">{t.historyBtn} ({savedCount})</span>
            <span className="sm:hidden font-semibold">({savedCount})</span>
          </button>

          {/* Create New Plan Button */}
          <button
            onClick={onNewPlan}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">{t.newPlanBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
