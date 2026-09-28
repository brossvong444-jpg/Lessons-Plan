import React, { useRef, useState } from 'react';
import { Mic, MicOff, Check, X, RotateCcw, AlertCircle } from 'lucide-react';
import { useSpeechRecognition, SpeechLanguage } from '../hooks/useSpeechRecognition';

export interface VoiceTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChangeValue: (val: string) => void;
  label?: string;
  isPrintFriendly?: boolean;
}

export const VoiceTextarea: React.FC<VoiceTextareaProps> = ({
  value,
  onChangeValue,
  label,
  isPrintFriendly = false,
  placeholder,
  rows = 5,
  className = '',
  disabled = false,
  ...restProps
}) => {
  const [lang, setLang] = useState<SpeechLanguage>('km-KH');
  const [insertMode, setInsertMode] = useState<'append' | 'replace'>('append');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

      if (insertMode === 'replace') {
        onChangeValue(chunk);
        setInsertMode('append'); // revert to append after initial replace
      } else {
        // Smart append: if value exists, add newline or space
        if (!value || value.trim() === '') {
          onChangeValue(chunk);
        } else {
          // If the last character is punctuation or newline, add space or newline
          const endsWithNewline = value.endsWith('\n');
          const separator = endsWithNewline ? '' : ' ';
          onChangeValue(`${value}${separator}${chunk}`);
        }
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
    <div className={`relative flex flex-col w-full rounded-lg border transition-all ${
      isListening
        ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/20'
        : 'border-slate-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-400 bg-white'
    }`}>
      {/* Top action bar: Label & Mic Controls */}
      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-200/80 bg-slate-50/70 text-xs no-print select-none">
        <div className="flex items-center gap-2">
          {label && <span className="font-semibold text-slate-700">{label}</span>}
          {isListening ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-ping" />
              កំពុងស្ដាប់សំឡេង ({lang === 'km-KH' ? 'ខ្មែរ' : 'EN'})...
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">
              {value ? `${value.length} តួអក្សរ` : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Language Switch */}
          <button
            type="button"
            onClick={handleLangToggle}
            title="ប្ដូរភាសានិយាយ (Khmer / English)"
            className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 font-medium transition cursor-pointer"
          >
            {lang === 'km-KH' ? '🇰🇭 ខ្មែរ' : '🇬🇧 EN'}
          </button>

          {/* Mode Switch: Append vs Replace */}
          <button
            type="button"
            onClick={() => setInsertMode((prev) => (prev === 'append' ? 'replace' : 'append'))}
            title={insertMode === 'append' ? 'របៀប៖ បន្ថែមបន្តកន្ទុយ (ចុចដើម្បីប្ដូរទៅជំនួស)' : 'របៀប៖ ជំនួសទាំងអស់ (ចុចដើម្បីប្ដូរទៅបន្ថែម)'}
            className={`text-[10px] px-1.5 py-0.5 rounded border transition cursor-pointer font-medium ${
              insertMode === 'replace'
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {insertMode === 'append' ? '➕ បន្ថែមបន្ត' : '🔄 ជំនួស'}
          </button>

          {/* Clear button if text exists */}
          {value && (
            <button
              type="button"
              onClick={() => onChangeValue('')}
              title="លុបអត្ថបទទាំងអស់"
              className="text-[10px] p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-rose-600 transition cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          {/* Main Microphone Action Button */}
          <button
            type="button"
            onClick={() => toggleListening()}
            title={!isSupported ? 'Browser មិនគាំទ្រ Speech Recognition' : isListening ? 'ចុចបញ្ចប់ការនិយាយ' : 'ចុចដើម្បីនិយាយបញ្ចូលអត្ថបទ (Voice-to-Text)'}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer shadow-2xs ${
              isListening
                ? 'bg-rose-600 text-white hover:bg-rose-700 animate-pulse'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5" />
                <span>បញ្ចប់ (Done)</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-rose-600" />
                <span>និយាយ (Mic)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Textarea Element */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        rows={rows}
        placeholder={placeholder || 'សរសេរ ឬចុចរូប Microphone 🎤 ដើម្បីនិយាយបញ្ចូលអត្ថបទ...'}
        disabled={disabled}
        className={`w-full p-2.5 text-xs sm:text-sm bg-transparent outline-none resize-y leading-relaxed text-slate-900 ${className}`}
        {...restProps}
      />

      {/* Live Interim Feedback Banner while listening */}
      {isListening && (
        <div className="px-3 py-2 bg-rose-50 border-t border-rose-200 text-xs text-rose-900 flex items-center justify-between gap-2 no-print animate-in slide-in-from-bottom-1 duration-150">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex items-end gap-0.5 h-3 shrink-0">
              <span className="w-0.5 bg-rose-600 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
              <span className="w-0.5 bg-rose-600 rounded-full animate-bounce [animation-delay:-0.15s] h-2" />
              <span className="w-0.5 bg-rose-600 rounded-full animate-bounce h-3.5" />
            </div>
            <div className="truncate">
              {interimTranscript ? (
                <span className="font-semibold text-rose-800 italic">"{interimTranscript}"</span>
              ) : (
                <span className="text-slate-500 italic">សូមនិយាយជាភាសាខ្មែរ... ប្រព័ន្ធកំពុងស្ដាប់ និងបំលែង</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={stopListening}
            className="shrink-0 px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer transition"
          >
            <Check className="w-3 h-3" />
            <span>រួចរាល់</span>
          </button>
        </div>
      )}

      {/* Error notification */}
      {error && !isListening && (
        <div className="px-3 py-1.5 bg-amber-50 border-t border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5 no-print">
          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
          <span className="truncate">{error}</span>
        </div>
      )}
    </div>
  );
};
