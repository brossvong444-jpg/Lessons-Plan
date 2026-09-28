import React, { useState } from 'react';
import { Mic, MicOff, Check, AlertCircle, Globe } from 'lucide-react';
import { useSpeechRecognition, SpeechLanguage } from '../hooks/useSpeechRecognition';

export interface VoiceMicButtonProps {
  onTranscript: (newText: string) => void;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
  title?: string;
  showBadge?: boolean;
}

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  onTranscript,
  className = '',
  size = 'sm',
  title = 'ចុចដើម្បីនិយាយ (Voice-to-Text)',
  showBadge = true,
}) => {
  const [lang, setLang] = useState<SpeechLanguage>('km-KH');

  const {
    isListening,
    interimTranscript,
    error,
    isSupported,
    toggleListening,
    stopListening,
    switchLanguage,
  } = useSpeechRecognition({
    language: lang,
    continuous: true,
    interimResults: true,
    onResult: (finalChunk) => {
      if (finalChunk && finalChunk.trim()) {
        onTranscript(finalChunk.trim());
      }
    },
  });

  const handleLangToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextLang = lang === 'km-KH' ? 'en-US' : 'km-KH';
    setLang(nextLang);
    switchLanguage(nextLang);
  };

  const sizeClasses = {
    xs: 'p-1 text-xs gap-1',
    sm: 'px-2 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
  }[size];

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }[size];

  return (
    <div className="relative inline-flex items-center no-print">
      <div className="inline-flex items-center rounded-md overflow-hidden shadow-2xs border transition">
        <button
          type="button"
          onClick={() => toggleListening()}
          title={!isSupported ? 'Browser មិនគាំទ្រ Speech Recognition' : isListening ? 'ចុចដើម្បីបញ្ចប់ការនិយាយ' : title}
          className={`inline-flex items-center font-medium transition cursor-pointer select-none ${sizeClasses} ${
            isListening
              ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600 animate-pulse'
              : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border-slate-300'
          } ${className}`}
        >
          {isListening ? (
            <>
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-300 opacity-75" />
                <Mic className={`${iconSizes} text-white relative z-10`} />
              </div>
              <span className="font-semibold">កំពុងស្ដាប់...</span>
              {/* Animated audio equalizer bars */}
              <div className="flex items-end gap-0.5 h-3 ml-0.5">
                <span className="w-0.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
                <span className="w-0.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s] h-2" />
                <span className="w-0.5 bg-white rounded-full animate-bounce h-3.5" />
              </div>
            </>
          ) : (
            <>
              <Mic className={`${iconSizes} text-rose-600`} />
              <span className="text-[11px] font-medium hidden sm:inline">សំឡេង</span>
            </>
          )}
        </button>

        {/* Mini Language Switcher: 🇰🇭 vs 🇬🇧 */}
        <button
          type="button"
          onClick={handleLangToggle}
          title={`ប្ដូរភាសានិយាយ (បច្ចុប្បន្ន: ${lang === 'km-KH' ? 'ខ្មែរ km-KH' : 'English en-US'})`}
          className={`px-1.5 py-1 text-[10px] font-bold border-l border-slate-200 transition cursor-pointer ${
            isListening
              ? 'bg-rose-700 text-rose-100 hover:bg-rose-800'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          {lang === 'km-KH' ? '🇰🇭 ខ្មែរ' : '🇬🇧 EN'}
        </button>
      </div>

      {/* Live Speech Recognition Floating Banner / Popover when listening */}
      {isListening && showBadge && (
        <div className="absolute left-0 bottom-full mb-2 z-50 min-w-[260px] max-w-sm bg-slate-900 text-white rounded-xl shadow-xl p-2.5 text-xs animate-in fade-in zoom-in-95 duration-150 border border-slate-700">
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-700/80">
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>មីក្រូហ្វូនបើក ({lang === 'km-KH' ? 'ភាសាខ្មែរ' : 'English'})</span>
            </div>
            <button
              type="button"
              onClick={stopListening}
              className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer transition shadow-2xs"
            >
              <Check className="w-3 h-3" />
              <span>រួចរាល់</span>
            </button>
          </div>

          <div className="pt-2 text-slate-200 min-h-[28px] max-h-24 overflow-y-auto leading-relaxed">
            {interimTranscript ? (
              <span className="text-amber-300 font-medium italic">"{interimTranscript}"</span>
            ) : (
              <span className="text-slate-400 italic">សូមនិយាយ... ពាក្យនឹងបញ្ចូលដោយស្វ័យប្រវត្តិ</span>
            )}
          </div>
        </div>
      )}

      {/* Error message tooltip */}
      {error && !isListening && (
        <div className="absolute left-0 bottom-full mb-2 z-50 max-w-xs bg-rose-900 text-rose-100 rounded-lg shadow-lg p-2 text-[11px] flex items-start gap-1.5 border border-rose-700 animate-in fade-in duration-200">
          <AlertCircle className="w-3.5 h-3.5 text-rose-300 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
