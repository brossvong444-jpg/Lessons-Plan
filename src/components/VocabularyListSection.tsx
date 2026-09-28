import React, { useState } from 'react';
import { VocabularyItem } from '../types/lessonPlan';
import { BookOpen, Sparkles, Plus, Trash2, Loader2, Quote, Check } from 'lucide-react';
import { generateSubjectVocabulary } from '../../curriculumEngine';

interface VocabularyListSectionProps {
  vocabularyList?: VocabularyItem[];
  topic: string;
  subject: string;
  grade: string;
  isEditing: boolean;
  isPrintFriendly?: boolean;
  title?: string;
  onChange: (updatedList: VocabularyItem[]) => void;
}

export const VocabularyListSection: React.FC<VocabularyListSectionProps> = ({
  vocabularyList = [],
  topic,
  subject,
  grade,
  isEditing,
  isPrintFriendly = false,
  title = 'ឧបសម្ព័ន្ធ៖ បញ្ជីវាក្យសព្ទគន្លឹះ (Key Vocabulary & Terms)',
  onChange,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If no vocabularyList provided yet, fallback to default for this subject
  const currentList: VocabularyItem[] =
    vocabularyList && vocabularyList.length > 0
      ? vocabularyList
      : [];

  const handleGenerateVocabulary = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/generate-vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, grade }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate from server');
      }

      const data: VocabularyItem[] = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        onChange(data);
      } else {
        const fallback = generateSubjectVocabulary(topic, subject, grade);
        onChange(fallback);
      }
    } catch {
      // Fallback directly to client-side curriculum engine
      const fallback = generateSubjectVocabulary(topic, subject, grade);
      onChange(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleItemChange = (index: number, field: keyof VocabularyItem, value: string) => {
    const updated = [...currentList];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const handleAddItem = () => {
    const newItem: VocabularyItem = {
      id: 'vocab-' + Date.now(),
      term: '',
      partOfSpeech: 'នាម',
      definition: '',
      exampleOrContext: '',
    };
    onChange([...currentList, newItem]);
  };

  const handleDeleteItem = (index: number) => {
    const updated = currentList.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <h3 className={`font-moul text-base ${isPrintFriendly ? 'text-black' : 'text-blue-900'}`}>
            {title}
          </h3>
          {currentList.length > 0 && (
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                isPrintFriendly
                  ? 'border border-black text-black'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {currentList.length} ពាក្យ
            </span>
          )}
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="no-print flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateVocabulary}
            disabled={isGenerating}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-2xs cursor-pointer ${
              isGenerating
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : isPrintFriendly
                ? 'bg-black text-white hover:bg-slate-800'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
            }`}
            title="ទាញយក ឬបង្កើតបញ្ជីវាក្យសព្ទគន្លឹះស្របតាមប្រធានបទនេះដោយស្វ័យប្រវត្តិ"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>កំពុងបង្កើត...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{currentList.length > 0 ? 'AI បង្កើតឡើងវិញ' : 'AI បង្កើតពាក្យគន្លឹះ'}</span>
              </>
            )}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>បន្ថែមពាក្យ</span>
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="no-print text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg mb-2">
          {errorMsg}
        </div>
      )}

      {/* Vocabulary List Container */}
      {currentList.length === 0 ? (
        <div
          className={`p-6 rounded-xl border text-center ${
            isPrintFriendly
              ? 'border-2 border-black bg-white text-black'
              : 'border-dashed border-slate-300 bg-slate-50 text-slate-600'
          }`}
        >
          <BookOpen className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-medium">មិនទាន់មានបញ្ជីវាក្យសព្ទគន្លឹះសម្រាប់មេរៀននេះនៅឡើយទេ</p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            ចុចប៊ូតុងខាងក្រោមដើម្បីបង្កើតបញ្ជីវាក្យសព្ទ និយមន័យ និងឧទាហរណ៍ប្រើប្រាស់ស្របតាមប្រធានបទ «{topic}»
          </p>
          <button
            type="button"
            onClick={handleGenerateVocabulary}
            disabled={isGenerating}
            className="no-print mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>បង្កើតបញ្ជីវាក្យសព្ទដោយស្វ័យប្រវត្តិ</span>
          </button>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${
            isPrintFriendly ? 'print-vocab-grid' : ''
          }`}
        >
          {currentList.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`rounded-xl border p-3 transition flex flex-col justify-between ${
                isPrintFriendly
                  ? 'border border-black bg-white text-black'
                  : 'bg-white border-slate-200/90 shadow-2xs hover:border-blue-300'
              }`}
            >
              <div>
                {/* Term & Part of Speech Row */}
                <div className="flex items-start justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100">
                  <div className="flex-1 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold ${
                        isPrintFriendly
                          ? 'border border-black text-black'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    {isEditing ? (
                      <input
                        type="text"
                        value={item.term}
                        onChange={(e) => handleItemChange(idx, 'term', e.target.value)}
                        placeholder="ពាក្យគន្លឹះ..."
                        className="font-bold text-sm text-blue-950 border-b border-slate-300 px-1 py-0.5 focus:border-blue-500 outline-none flex-1 min-w-[120px]"
                      />
                    ) : (
                      <span className={`font-bold text-sm ${isPrintFriendly ? 'text-black' : 'text-blue-950'}`}>
                        {item.term}
                      </span>
                    )}

                    {isEditing ? (
                      <input
                        type="text"
                        value={item.partOfSpeech || ''}
                        onChange={(e) => handleItemChange(idx, 'partOfSpeech', e.target.value)}
                        placeholder="ថ្នាក់ពាក្យ..."
                        className="text-[11px] border border-slate-200 rounded px-1.5 py-0.5 w-24 text-slate-600"
                      />
                    ) : (
                      item.partOfSpeech && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            isPrintFriendly
                              ? 'border border-black text-black'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.partOfSpeech}
                        </span>
                      )
                    )}
                  </div>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(idx)}
                      className="no-print text-slate-400 hover:text-rose-600 transition p-1"
                      title="លុបពាក្យនេះ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Definition */}
                <div className="text-xs sm:text-[13px] leading-relaxed mb-2">
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={item.definition}
                      onChange={(e) => handleItemChange(idx, 'definition', e.target.value)}
                      placeholder="និយមន័យ ឬការពន្យល់ន័យ..."
                      className="w-full border border-slate-200 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className={isPrintFriendly ? 'text-black' : 'text-slate-800'}>
                      <span className={`font-semibold mr-1 ${isPrintFriendly ? 'text-black' : 'text-slate-900'}`}>
                        និយមន័យ៖
                      </span>
                      {item.definition}
                    </p>
                  )}
                </div>
              </div>

              {/* Context / Example */}
              {(item.exampleOrContext || isEditing) && (
                <div
                  className={`mt-1 text-xs rounded-lg p-2 flex items-start gap-1.5 ${
                    isPrintFriendly
                      ? 'border-l-2 border-black pl-2 italic text-black'
                      : 'bg-amber-50/70 border-l-2 border-amber-400 text-slate-700'
                  }`}
                >
                  <Quote className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isPrintFriendly ? 'text-black' : 'text-amber-600'}`} />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.exampleOrContext || ''}
                        onChange={(e) => handleItemChange(idx, 'exampleOrContext', e.target.value)}
                        placeholder="ឧទាហរណ៍ ឬបរិបទប្រើប្រាស់ក្នុងមេរៀន..."
                        className="w-full border-b border-amber-200 bg-transparent text-xs py-0.5 outline-none"
                      />
                    ) : (
                      <span className="italic">
                        <strong className="not-italic font-semibold mr-1">ឧទាហរណ៍/បរិបទ៖</strong>
                        {item.exampleOrContext}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
