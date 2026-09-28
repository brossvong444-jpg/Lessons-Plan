import React, { useState } from 'react';
import {
  FileDown,
  Printer,
  Copy,
  Check,
  Edit3,
  Eye,
  FileText,
  Share2,
  Sparkles,
  Contrast,
} from 'lucide-react';
import { LessonPlanData } from '../types/lessonPlan';
import { exportLessonPlanToDocx, downloadBlob } from '../utils/docxExport';
import { exportLessonPlanToPdf } from '../utils/pdfExport';
import { useLanguage } from '../i18n/LanguageContext';
import confetti from 'canvas-confetti';

interface ExportToolbarProps {
  plan: LessonPlanData;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSaveToHistory: () => void;
  isPrintFriendly: boolean;
  onTogglePrintFriendly: () => void;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  plan,
  isEditing,
  onToggleEdit,
  onSaveToHistory,
  isPrintFriendly,
  onTogglePrintFriendly,
}) => {
  const { t, language } = useLanguage();
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Export to Microsoft Word (.docx)
  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      const blob = await exportLessonPlanToDocx(plan);
      const safeTitle = (plan.header.topic || 'កិច្ចតែងការបង្រៀន')
        .replace(/[/\\?%*:|"<>]/g, '-')
        .substring(0, 40);
      const filename = `កិច្ចតែងការ_${plan.header.subject || ''}_${safeTitle}.docx`;
      downloadBlob(blob, filename);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error('Failed to export docx:', err);
      alert('មានបញ្ហាក្នុងការបង្កើតឯកសារ Word');
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Export to PDF directly as a file download
  const handleExportPDF = async () => {
    try {
      setIsExportingPdf(true);

      // If user is currently editing, temporarily turn off edit mode to capture clean text
      if (isEditing) {
        onToggleEdit();
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      const safeTitle = (plan.header.topic || 'កិច្ចតែងការបង្រៀន')
        .replace(/[/\\?%*:|"<>]/g, '-')
        .substring(0, 40);
      const filename = `កិច្ចតែងការ_${plan.header.subject || ''}_${safeTitle}.pdf`;

      await exportLessonPlanToPdf('lesson-plan-sheet', filename);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      // If client-side pdf export fails, fallback to window.print
      try {
        window.print();
      } catch (printErr) {
        alert('មិនអាចទាញយកជា PDF បានទេ សូមព្យាយាមម្ដងទៀត');
      }
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Direct print option
  const handleDirectPrint = () => {
    window.print();
  };

  // Copy full text to clipboard
  const handleCopyText = async () => {
    try {
      const h = plan.header;
      const text = `
${h.country}
${h.motto}

កិច្ចតែងការបង្រៀន
សាលារៀន៖ ${h.schoolName}
ឈ្មោះគ្រូ៖ ${h.teacherName}
មុខវិជ្ជា៖ ${h.subject} | ${h.grade}
កាលបរិច្ឆេទ៖ ${h.date} | រយៈពេល៖ ${h.duration}
${h.chapter} - ${h.lessonNo}
ប្រធានបទ៖ ${h.topic}

I. វត្ថុបំណង៖
១. ចំណេះដឹង៖
${plan.objectives.knowledge.map((k) => `  - ${k}`).join('\n')}
២. បំណិន៖
${plan.objectives.skills.map((s) => `  - ${s}`).join('\n')}
៣. ឥរិយាបថ៖
${plan.objectives.attitude.map((a) => `  - ${a}`).join('\n')}

II. សម្ភារឧបទេស៖
- ចំពោះគ្រូ៖ ${plan.materials.teacher.join(', ')}
- ចំពោះសិស្ស៖ ${plan.materials.students.join(', ')}

III. ដំណើរការបង្រៀន (៥ ជំហាន)៖
${plan.steps
  .map(
    (st) => `
[${st.stepNumber ? `${st.stepNumber}៖ ` : ''}${st.stepTitle} (${st.duration})]
• សកម្មភាពគ្រូ៖
${st.teacherActivity}
• ខ្លឹមសារមេរៀន៖
${st.content}
• សកម្មភាពសិស្ស៖
${st.studentActivity}
`,
  )
  .join('\n')}

${plan.boardSummary ? `IV. ប្លង់ក្ដារខៀន៖\n${plan.boardSummary}\n` : ''}
${
  plan.reflection
    ? `V. ការឆ្លុះបញ្ចាំងរបស់គ្រូ៖\n- ចំណុចខ្លាំង៖ ${plan.reflection.strengths}\n- ចំណុចខ្វះខាត៖ ${plan.reflection.weaknesses}\n- ដំណោះស្រាយ៖ ${plan.reflection.solutions}\n`
    : ''
}
      `.trim();

      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = () => {
    onSaveToHistory();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="no-print bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Status & Quick edit toggle */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              {language === 'km' ? 'កិច្ចតែងការរួចរាល់សម្រាប់ទាញយក' : 'Lesson Plan Ready for Export'}
            </h3>
            <p className="text-xs text-slate-500">
              {t.moeysStandardNote}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edit Mode Toggle */}
          <button
            onClick={onToggleEdit}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition ${
              isEditing
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            {isEditing ? (
              <>
                <Eye className="w-4 h-4" />
                <span>{t.saveEditsBtn}</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>{t.editContentBtn}</span>
              </>
            )}
          </button>

          {/* Print-Friendly (High-Contrast B&W Ink-Saving) Toggle */}
          <button
            onClick={onTogglePrintFriendly}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition ${
              isPrintFriendly
                ? 'bg-slate-900 text-white border-slate-950 shadow-sm ring-2 ring-slate-800'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title="Print-Friendly (High-Contrast B&W)"
          >
            <Contrast className={`w-4 h-4 ${isPrintFriendly ? 'text-amber-300' : 'text-slate-600'}`} />
            <span>{isPrintFriendly ? `${t.printFriendlyBtn} (ស-ខ្មៅ)` : t.printFriendlyBtn}</span>
            {isPrintFriendly && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5"></span>
            )}
          </button>

          {/* Copy Text */}
          <button
            onClick={handleCopyText}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 transition"
            title="Copy Text"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">{language === 'km' ? 'បានចម្លង!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>{language === 'km' ? 'ចម្លងអត្ថបទ' : 'Copy Text'}</span>
              </>
            )}
          </button>

          {/* Direct Print Option */}
          <button
            onClick={handleDirectPrint}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 transition"
            title="Direct Print"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{language === 'km' ? 'បោះពុម្ព' : 'Print'}</span>
          </button>

          {/* PDF Download Button */}
          <button
            onClick={handleExportPDF}
            disabled={isExportingPdf}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 transition shadow-sm hover:shadow"
            title={t.exportPdfBtn}
          >
            {isExportingPdf ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{t.exportingPdf}</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>{t.exportPdfBtn}</span>
              </>
            )}
          </button>

          {/* Word (.docx) Download */}
          <button
            onClick={handleExportDocx}
            disabled={isExportingDocx}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition shadow-sm hover:shadow"
            title={t.exportWordBtn}
          >
            {isExportingDocx ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{t.exportingWord}</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>{t.exportWordBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
