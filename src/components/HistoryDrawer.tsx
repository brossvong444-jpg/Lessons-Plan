import React from 'react';
import { LessonPlanData } from '../types/lessonPlan';
import { X, Calendar, BookOpen, Trash2, ChevronRight, FileText } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plans: LessonPlanData[];
  onSelectPlan: (plan: LessonPlanData) => void;
  onDeletePlan: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  plans,
  onSelectPlan,
  onDeletePlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 text-base sm:text-lg">
                កិច្ចតែងការដែលបានរក្សាទុក ({plans.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {plans.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-1" />
                <p className="text-sm">មិនទាន់មានកិច្ចតែងការដែលបានរក្សាទុកនៅឡើយទេ</p>
                <p className="text-xs text-slate-400 mt-1">
                  រាល់ពេលដែលអ្នកបង្កើតកិច្ចតែងការ វានឹងត្រូវរក្សាទុកនៅទីនេះដោយស្វ័យប្រវត្តិ
                </p>
              </div>
            ) : (
              plans.map((p) => (
                <div
                  key={p.id}
                  className="group relative bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-xl p-3.5 transition flex items-start justify-between cursor-pointer"
                  onClick={() => {
                    onSelectPlan(p);
                    onClose();
                  }}
                >
                  <div className="flex-1 pr-3">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 mb-1">
                      <span>{p.header.subject}</span>
                      <span>•</span>
                      <span>{p.header.grade}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-2">
                      {p.header.topic}
                    </h3>
                    <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-2">
                      <Calendar className="w-3 h-3" />
                      <span>{p.header.date || new Date(p.createdAt).toLocaleDateString('km-KH')}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePlan(p.id);
                      }}
                      className="text-slate-300 hover:text-rose-600 p-1.5 rounded-md transition"
                      title="លុបចេញ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
