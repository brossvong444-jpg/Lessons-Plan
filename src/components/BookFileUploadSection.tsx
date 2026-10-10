import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, Trash2, Sparkles, BookOpen, Layers, Search, Loader2, AlertCircle, FileCheck, ArrowRight } from 'lucide-react';
import { UploadedLessonFile, BookOutlineItem } from '../types/lessonPlan';
import { useLanguage } from '../i18n/LanguageContext';

interface BookFileUploadSectionProps {
  uploadedFile: UploadedLessonFile | null;
  onFileChange: (file: UploadedLessonFile | null) => void;
  chapter: string;
  onChapterChange: (ch: string) => void;
  lessonNo: string;
  onLessonNoChange: (les: string) => void;
  targetPage: string;
  onTargetPageChange: (pg: string) => void;
  topic: string;
  onTopicChange: (top: string) => void;
}

export const BookFileUploadSection: React.FC<BookFileUploadSectionProps> = ({
  uploadedFile,
  onFileChange,
  chapter,
  onChapterChange,
  lessonNo,
  onLessonNoChange,
  targetPage,
  onTargetPageChange,
  topic,
  onTopicChange,
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileBadgeColor = (type: string, name: string) => {
    if (type.includes('pdf') || name.toLowerCase().endsWith('.pdf')) {
      return { bg: 'bg-rose-50 border-rose-200 text-rose-700', label: 'PDF Book', icon: '📕' };
    }
    if (type.includes('word') || type.includes('officedocument') || name.toLowerCase().endsWith('.docx')) {
      return { bg: 'bg-blue-50 border-blue-200 text-blue-700', label: 'Word (.docx)', icon: '📘' };
    }
    if (type.startsWith('image/')) {
      return { bg: 'bg-purple-50 border-purple-200 text-purple-700', label: 'Book Page Photo', icon: '🖼️' };
    }
    return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: 'Text File', icon: '📄' };
  };

  const processFile = async (file: File) => {
    setScanError(null);
    setIsScanning(true);

    try {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const result = reader.result as string;
          // Extract base64 without the data:...;base64, prefix
          const base64Data = result.split(',')[1] || '';

          // Call server parser to extract text and outline
          const res = await fetch('/api/parse-lesson-file', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type || (file.name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/octet-stream'),
              fileBase64: base64Data,
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'Failed to parse file');
          }

          const data = await res.json();

          const uploaded: UploadedLessonFile = {
            name: file.name,
            type: file.type || (file.name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/octet-stream'),
            size: file.size,
            base64Data,
            extractedText: data.extractedPreview || '',
            detectedOutline: data.detectedOutline || [],
            detectedTopic: data.detectedTopic || '',
          };

          onFileChange(uploaded);

          // If outline detected, auto-select first lesson if empty
          if (data.detectedOutline && data.detectedOutline.length > 0) {
            const first = data.detectedOutline[0];
            if (!chapter && first.chapter) onChapterChange(first.chapter);
            if (!lessonNo && first.lesson) onLessonNoChange(first.lesson);
            if (!topic && first.topic) onTopicChange(first.topic);
          } else if (data.detectedTopic && !topic) {
            onTopicChange(data.detectedTopic);
          }
        } catch (err: any) {
          console.error('File process error:', err);
          // Still register the file so it can be sent directly to Gemini
          const base64Data = (reader.result as string).split(',')[1] || '';
          onFileChange({
            name: file.name,
            type: file.type || 'application/octet-stream',
            size: file.size,
            base64Data,
          });
          setScanError('បានផ្ទុក file ជោគជ័យ។ លោកគ្រូ-អ្នកគ្រូអាចកំណត់ជំពូក និងមេរៀនដោយផ្ទាល់។');
        } finally {
          setIsScanning(false);
        }
      };

      reader.onerror = () => {
        setIsScanning(false);
        setScanError('បរាជ័យក្នុងការអានឯកសារពីឧបករណ៍');
      };

      reader.readAsDataURL(file);
    } catch (e: any) {
      setIsScanning(false);
      setScanError(e?.message || 'Error uploading file');
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Demo sample book selections for quick testing
  const loadDemoBookSample = (sampleType: 'math' | 'khmer' | 'physics') => {
    if (sampleType === 'math') {
      const demoOutline: BookOutlineItem[] = [
        { chapter: 'ជំពូកទី ១', lesson: 'មេរៀនទី ១', topic: 'ផលបូក និងផលដកកន្សោមពីជគណិត', page: 'ទំព័រ ៥-១២' },
        { chapter: 'ជំពូកទី ២', lesson: 'មេរៀនទី ១', topic: 'សមីការដឺក្រេទី ២ មានមួយអញាត និងរូបមន្តឌីសគ្រីមីណង់', page: 'ទំព័រ ៣២-៤០' },
        { chapter: 'ជំពូកទី ២', lesson: 'មេរៀនទី ២', topic: 'ទំនាក់ទំនងរវាងឫស និងមេគុណ (ទ្រឹស្ដីបទវីយ៉ែត)', page: 'ទំព័រ ៤១-៤៨' },
        { chapter: 'ជំពូកទី ៣', lesson: 'មេរៀនទី ១', topic: 'ទ្រឹស្ដីបទពីតាក័រ និងត្រីកោណកែង', page: 'ទំព័រ ៥៥-៦៤' },
      ];
      onFileChange({
        name: 'សៀវភៅពុម្ពគណិតវិទ្យា_ថ្នាក់ទី៩_MoEYS.pdf',
        type: 'application/pdf',
        size: 4520000,
        detectedOutline: demoOutline,
        detectedTopic: 'សមីការដឺក្រេទី ២ មានមួយអញាត និងរូបមន្តឌីសគ្រីមីណង់',
      });
      onChapterChange('ជំពូកទី ២');
      onLessonNoChange('មេរៀនទី ១');
      onTargetPageChange('ទំព័រ ៣២-៤០');
      onTopicChange('សមីការដឺក្រេទី ២ មានមួយអញាត និងរូបមន្តឌីសគ្រីមីណង់');
    } else if (sampleType === 'khmer') {
      const demoOutline: BookOutlineItem[] = [
        { chapter: 'ជំពូកទី ១', lesson: 'មេរៀនទី ១', topic: 'អត្ថបទអំណាន «តម្លៃនៃពេលវេលា»', page: 'ទំព័រ ៨-១៥' },
        { chapter: 'ជំពូកទី ២', lesson: 'មេរៀនទី ២', topic: 'វេយ្យាករណ៍៖ ឈ្នាប់ និងកន្សោមឈ្នាប់ក្នុងល្បះ', page: 'ទំព័រ ២៦-៣៤' },
        { chapter: 'ជំពូកទី ៣', lesson: 'មេរៀនទី ១', topic: 'ការតែងសេចក្ដីបែបពណ៌នា «ទេសភាពភូមិឋានជនបទខ្មែរ»', page: 'ទំព័រ ៤២-៥០' },
      ];
      onFileChange({
        name: 'សៀវភៅពុម្ពភាសាខ្មែរ_ថ្នាក់ទី៨_MoEYS.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 2150000,
        detectedOutline: demoOutline,
        detectedTopic: 'ការតែងសេចក្ដីបែបពណ៌នា «ទេសភាពភូមិឋានជនបទខ្មែរ»',
      });
      onChapterChange('ជំពូកទី ៣');
      onLessonNoChange('មេរៀនទី ១');
      onTargetPageChange('ទំព័រ ៤២-៥០');
      onTopicChange('ការតែងសេចក្ដីបែបពណ៌នា «ទេសភាពភូមិឋានជនបទខ្មែរ»');
    } else if (sampleType === 'physics') {
      const demoOutline: BookOutlineItem[] = [
        { chapter: 'ជំពូកទី ១', lesson: 'មេរៀនទី ១', topic: 'ចលនាស្នើ និងល្បឿនមធ្យម', page: 'ទំព័រ ៤-១០' },
        { chapter: 'ជំពូកទី ១', lesson: 'មេរៀនទី ២', topic: 'កម្លាំង និងច្បាប់ទី ២ ញូតុន (F = m × a)', page: 'ទំព័រ ១៨-២៦' },
        { chapter: 'ជំពូកទី ២', lesson: 'មេរៀនទី ១', topic: 'ថាមពលស៊ីនេទិច និងថាមពលប៉ូតង់ស្យែល', page: 'ទំព័រ ៣៥-៤២' },
      ];
      onFileChange({
        name: 'សៀវភៅពុម្ពរូបវិទ្យា_ថ្នាក់ទី១០_MoEYS.pdf',
        type: 'application/pdf',
        size: 3840000,
        detectedOutline: demoOutline,
        detectedTopic: 'កម្លាំង និងច្បាប់ទី ២ ញូតុន (F = m × a)',
      });
      onChapterChange('ជំពូកទី ១');
      onLessonNoChange('មេរៀនទី ២');
      onTargetPageChange('ទំព័រ ១៨-២៦');
      onTopicChange('កម្លាំង និងច្បាប់ទី ២ ញូតុន (F = m × a)');
    }
  };

  const badgeInfo = uploadedFile ? getFileBadgeColor(uploadedFile.type, uploadedFile.name) : null;

  return (
    <div className="space-y-4">
      {/* Upload Zone / Connected File Card */}
      {!uploadedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.md,image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 shadow-xs">
            <Upload className="w-7 h-7" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            {t.uploadFileLabel}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-1.5 leading-relaxed">
            {t.uploadFileSub}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{t.uploadFileBtn}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-3">
            {t.uploadFileFormats}
          </p>

          {/* Quick Demo Book Samples */}
          <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-500 font-medium">សាកល្បងគំរូសៀវភៅពុម្ពរហ័ស៖</span>
            <button
              type="button"
              onClick={() => loadDemoBookSample('math')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 font-medium transition cursor-pointer"
            >
              📘 គណិតទី ៩ (ជំពូក ២ មេរៀន ១)
            </button>
            <button
              type="button"
              onClick={() => loadDemoBookSample('khmer')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 font-medium transition cursor-pointer"
            >
              📗 ភាសាខ្មែរទី ៨ (ជំពូក ៣ មេរៀន ១)
            </button>
            <button
              type="button"
              onClick={() => loadDemoBookSample('physics')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 font-medium transition cursor-pointer"
            >
              📙 រូបវិទ្យាទី ១០ (ជំពូក ១ មេរៀន ២)
            </button>
          </div>

          {isScanning && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center gap-2 z-10">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-800">{t.uploadScanning}</p>
            </div>
          )}
        </div>
      ) : (
        /* Connected File Card */
        <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/40 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs text-xl">
                {badgeInfo?.icon || '📁'}
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 break-all">
                    {uploadedFile.name}
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeInfo?.bg}`}>
                    {badgeInfo?.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                  <span>ទំហំ៖ {formatFileSize(uploadedFile.size)}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.uploadSuccess}</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onFileChange(null);
                setScanError(null);
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition font-medium flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.uploadRemove}</span>
            </button>
          </div>

          {/* Book Target Specification Inputs: Chapter, Lesson No, Page */}
          <div className="bg-white/90 p-4 rounded-xl border border-blue-100 shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <Search className="w-4 h-4 text-blue-600" />
              <span>កំណត់ជំពូក និងមេរៀនដែលចង់បានពីសៀវភៅ (Target Extraction)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Chapter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.targetChapterLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={chapter}
                  onChange={(e) => onChapterChange(e.target.value)}
                  placeholder={t.targetChapterPlaceholder}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 font-medium"
                />
              </div>

              {/* Lesson No */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.targetLessonLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lessonNo}
                  onChange={(e) => onLessonNoChange(e.target.value)}
                  placeholder={t.targetLessonPlaceholder}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 font-medium"
                />
              </div>

              {/* Target Page */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.targetPageLabel}
                </label>
                <input
                  type="text"
                  value={targetPage}
                  onChange={(e) => onTargetPageChange(e.target.value)}
                  placeholder={t.targetPagePlaceholder}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Topic Input if known or detected */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ប្រធានបទ ឬចំណងជើងមេរៀន (បើមាន ឬទុកឱ្យប្រព័ន្ធស្វែងរកស្វ័យប្រវត្ត)
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => onTopicChange(e.target.value)}
                placeholder="ចំណងជើងមេរៀន... (ឧ. សមីការដឺក្រេទី ២, ច្បាប់ញូតុន, តែងសេចក្តី...)"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
              />
            </div>

            {/* Note Guaranteeing 100% Target Precision */}
            <div className="p-2.5 rounded-lg bg-emerald-50/90 border border-emerald-200 text-[11px] sm:text-xs text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">ធានាចេញចំអ្វីដែលចង់បាន ១០០%៖</span> {t.bookTargetNote}
              </div>
            </div>
          </div>

          {/* Detected Chapters and Lessons Chips */}
          {uploadedFile.detectedOutline && uploadedFile.detectedOutline.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.bookScanOutlineTitle}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {uploadedFile.detectedOutline.map((item, idx) => {
                  const isSelected =
                    (chapter && item.chapter && chapter.includes(item.chapter.replace(/[^០-៩0-9]/g, ''))) ||
                    (lessonNo && item.lesson && lessonNo.includes(item.lesson.replace(/[^០-៩0-9]/g, '')));

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (item.chapter) onChapterChange(item.chapter);
                        if (item.lesson) onLessonNoChange(item.lesson);
                        if (item.topic) onTopicChange(item.topic);
                        if (item.page) onTargetPageChange(item.page);
                      }}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition text-left cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-700 shadow-2xs font-semibold'
                          : 'bg-white hover:bg-blue-50 text-slate-700 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <span>📖</span>
                      <span className="font-medium">{item.chapter ? `${item.chapter} - ` : ''}{item.lesson}</span>
                      {item.topic && <span className="opacity-90 font-normal">៖ {item.topic}</span>}
                      {item.page && <span className="text-[10px] opacity-75 font-mono">({item.page})</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {scanError && (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{scanError}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
