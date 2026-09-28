import { useState, useEffect, useRef, useCallback } from 'react';
import { soundFeedback } from '../utils/audioFeedback';

// Define SpeechRecognition interface types for TypeScript
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export type SpeechLanguage = 'km-KH' | 'en-US';

export interface UseSpeechRecognitionOptions {
  language?: SpeechLanguage;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (finalText: string, interimText: string) => void;
  onError?: (errorMessage: string) => void;
  onEnd?: () => void;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const {
    language = 'km-KH',
    continuous = true,
    interimResults = true,
    onResult,
    onError,
    onEnd,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [currentLang, setCurrentLang] = useState<SpeechLanguage>(language);

  const recognitionRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef(false);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  // Check support on mount
  useEffect(() => {
    const win: Partial<IWindow> = typeof window !== 'undefined' ? (window as unknown as IWindow) : {};
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRec) {
      setIsSupported(false);
    }
  }, []);

  const getErrorMessageKhmer = (errCode: string): string => {
    switch (errCode) {
      case 'not-allowed':
        return 'សូមចុចអនុញ្ញាត (Allow) ការប្រើប្រាស់ Microphone ក្នុង Browser របស់អ្នក';
      case 'no-speech':
        return 'មិនទាន់ឮសំឡេងនិយាយឡើយ សូមនិយាយឱ្យជិតមីក្រូហ្វូន';
      case 'audio-capture':
        return 'រកមិនឃើញឧបករណ៍ Microphone លើឧបករណ៍របស់អ្នកឡើយ';
      case 'network':
        return 'មានបញ្ហាតភ្ជាប់អ៊ីនធឺណិតក្នុងការបម្លែងសំឡេង Voice-to-Text';
      case 'aborted':
        return 'ការថតសំឡេងត្រូវបានផ្អាក';
      default:
        return `មានបញ្ហាបច្ចេកទេស៖ ${errCode}`;
    }
  };

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop error
      }
    }
    setIsListening(false);
    setInterimTranscript('');
    soundFeedback.playStop();
  }, []);

  const startListening = useCallback(
    (langOverride?: SpeechLanguage) => {
      const win: Partial<IWindow> = typeof window !== 'undefined' ? (window as unknown as IWindow) : {};
      const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (!SpeechRec) {
        setIsSupported(false);
        const errMsg = 'Browser របស់អ្នកមិនទាន់គាំទ្រ Speech Recognition ឡើយ (សូមប្រើ Google Chrome ឬ Microsoft Edge)';
        setError(errMsg);
        if (onErrorRef.current) onErrorRef.current(errMsg);
        return;
      }

      setError(null);
      setTranscript('');
      setInterimTranscript('');
      isManuallyStoppedRef.current = false;

      // Stop previous instance if exists
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      try {
        const recognition = new SpeechRec();
        const activeLang = langOverride || currentLang;
        recognition.lang = activeLang;
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          soundFeedback.playStart();
        };

        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptChunk = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcriptChunk;
            } else {
              interim += transcriptChunk;
            }
          }

          if (final) {
            setTranscript((prev) => (prev ? `${prev} ${final.trim()}` : final.trim()));
          }
          setInterimTranscript(interim);

          if (onResultRef.current) {
            onResultRef.current(final, interim);
          }
        };

        recognition.onerror = (event: any) => {
          if (event.error === 'no-speech' && !isManuallyStoppedRef.current) {
            // Silence is normal during dictation, don't break UI unless no final text
            return;
          }
          const kmMessage = getErrorMessageKhmer(event.error);
          setError(kmMessage);
          if (onErrorRef.current) onErrorRef.current(kmMessage);
          if (event.error === 'not-allowed') {
            setIsListening(false);
          }
        };

        recognition.onend = () => {
          // If stopped naturally without manual stop and still continuous, restart if needed
          if (!isManuallyStoppedRef.current && continuous) {
            try {
              recognition.start();
              return;
            } catch {
              // Ignore restart error
            }
          }
          setIsListening(false);
          setInterimTranscript('');
          if (onEndRef.current) onEndRef.current();
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        const msg = `មិនអាចចាប់ផ្ដើម Microphone បានឡើយ៖ ${err?.message || err}`;
        setError(msg);
        setIsListening(false);
        if (onErrorRef.current) onErrorRef.current(msg);
      }
    },
    [continuous, interimResults, currentLang],
  );

  const toggleListening = useCallback(
    (langOverride?: SpeechLanguage) => {
      if (isListening) {
        stopListening();
      } else {
        startListening(langOverride);
      }
    },
    [isListening, startListening, stopListening],
  );

  const switchLanguage = useCallback(
    (newLang: SpeechLanguage) => {
      setCurrentLang(newLang);
      if (isListening) {
        stopListening();
        setTimeout(() => {
          startListening(newLang);
        }, 150);
      }
    },
    [isListening, stopListening, startListening],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    currentLang,
    startListening,
    stopListening,
    toggleListening,
    switchLanguage,
    resetTranscript: () => {
      setTranscript('');
      setInterimTranscript('');
      setError(null);
    },
  };
}
