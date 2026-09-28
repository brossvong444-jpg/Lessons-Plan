import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ShieldCheck, Mail, Award, BookOpen, Sparkles, X, Heart, ExternalLink, CheckCircle } from 'lucide-react';

interface AboutOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutOwnerModal: React.FC<AboutOwnerModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Banner with Cambodian ornament colors */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
            aria-label={t.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold text-blue-50 backdrop-blur border border-white/20 mb-1">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'km' ? 'សិទ្ធិអ្នកបង្កើតផ្លូវការ' : 'Official Creator Rights'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-moul tracking-wide text-white">
                {t.ownerName}
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 font-medium">
                {t.ownerRole}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Contact & Verification badge */}
          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-blue-900 font-medium">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Email: <strong>{t.ownerEmail}</strong></span>
            </div>
            <span className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'km' ? 'ផ្ទៀងផ្ទាត់សិទ្ធិកម្មសិទ្ធិ' : 'Verified Owner'}</span>
            </span>
          </div>

          {/* Mission & Purpose */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>{t.ownerMissionTitle}</span>
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 text-justify">
              {t.ownerMissionDesc}
            </p>
          </div>

          {/* Key Capabilities */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t.ownerFeaturesTitle}</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {[t.ownerFeature1, t.ownerFeature2, t.ownerFeature3, t.ownerFeature4].map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs sm:text-sm"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Ownership and Legal Notice */}
          <div className="pt-2 border-t border-slate-100">
            <div className="p-3 bg-slate-100 rounded-lg text-center text-xs text-slate-600 font-medium">
              <p>{t.ownerCopyrightNotice}</p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
