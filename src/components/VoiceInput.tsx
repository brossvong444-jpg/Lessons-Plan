import React, { useState } from 'react';
import { Mic, MicOff, Check, AlertCircle } from 'lucide-react';
import { useSpeechRecognition, SpeechLanguage } from '../hooks/useSpeechRecognition';

export interface VoiceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChangeValue: (val: string) => void;
  containerClassName?: string;
  showLangToggle?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  value,
  onChangeValue,
  containerClassName = '',
  className = '',
  placeholder,
  showLangToggle = false,
  disabled = false,
  ...restProps
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
      if (!finalChunk || !finalChunk.trim()) return;
      const chunk = finalChunk.trim();

      // If value is empty, set chunk directly; otherwise append with space
      if (!value || value.trim() === '') {
        onChangeValue(chunk);
      } else {
        onChangeValue(`${value} ${chunk}`);
      }
    },
  });

  const handleLangToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = lang === 'km-KH' ? 'en-US' : 'km-KH';
    setLang(next);
    switchLanguage(next);
  };

  return (
    <div className={`relative flex items-center w-full ${containerClassName}`}>
      <input
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full pr-16 transition-all ${
          isListening
            ? 'ring-2 ring-rose-400 border-rose-400 bg-rose-50/20'
            : ''
        } ${className}`}
        {...restProps}
      />

      {/* Mic Action Control inside input */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 no-print">
        {showLangToggle && (
          <button
            type="button"
            onClick={handleLangToggle}
            title="ប្ដូរភាសា (ខ្មែរ / EN)"
            className="text-[9px] px-1 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition font-bold"
          >
            {lang === 'km-KH' ? 'KM' : 'EN'}
          </button>
        )}

        <button
          type="button"
          onClick={() => toggleListening()}
          title={!isSupported ? 'Browser មិនគាំទ្រ Speech Recognition' : isListening ? 'ចុចបញ្ចប់ការនិយាយ' : 'និយាយបញ្ចូលអត្ថបទ (Voice-to-Text)'}
          className={`p-1 rounded-md transition cursor-pointer flex items-center justify-center ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse shadow-xs'
              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
          }`}
        >
          {isListening ? (
            <div className="flex items-center gap-1 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <MicOff className="w-3 h-3 text-white" />
            </div>
          ) : (
            <Mic className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Live Interim Transcript Popover */}
      {isListening && (
        <div className="absolute left-0 bottom-full mb-1.5 z-50 bg-slate-900 text-white rounded-lg shadow-xl px-2.5 py-1.5 text-xs flex items-center gap-2 max-w-sm border border-slate-700 animate-in fade-in duration-100">
          <div className="flex items-center gap-1 text-rose-400 font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>កំពុងស្ដាប់៖</span>
          </div>
          <div className="truncate text-amber-200 font-medium">
            {interimTranscript ? `"${interimTranscript}"` : 'សូមនិយាយ...'}
          </div>
          <button
            type="button"
            onClick={stopListening}
            className="ml-auto text-[10px] px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-medium shrink-0 cursor-pointer"
          >
            រួច
          </button>
        </div>
      )}
    </div>
  );
};
