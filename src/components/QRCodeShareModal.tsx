import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Copy,
  Check,
  Download,
  ExternalLink,
  Printer,
  Sparkles,
  Share2,
  X,
  Smartphone,
  Eye,
  CheckCircle2,
  BookmarkCheck,
} from 'lucide-react';
import { LessonPlanData } from '../types/lessonPlan';
import {
  generateShareUrl,
  generateQRCodeDataUrl,
  downloadQRCodeBadge,
} from '../utils/shareLinkHelper';
import { useLanguage } from '../i18n/LanguageContext';
import confetti from 'canvas-confetti';

interface QRCodeShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: LessonPlanData;
  isEmbeddedInSheet?: boolean;
  onToggleEmbedInSheet?: (val: boolean) => void;
}

export const QRCodeShareModal: React.FC<QRCodeShareModalProps> = ({
  isOpen,
  onClose,
  plan,
  isEmbeddedInSheet = false,
  onToggleEmbedInSheet,
}) => {
  const { t, language } = useLanguage();
  const [shareUrl, setShareUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>('#1e3a8a'); // MoEYS Navy
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const printSlipRef = useRef<HTMLDivElement>(null);

  // Generate share link and QR code on modal open or color change
  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;
    setIsGenerating(true);

    async function init() {
      try {
        const { url } = await generateShareUrl(plan);
        if (isCancelled) return;
        setShareUrl(url);

        const qrCode = await generateQRCodeDataUrl(url, {
          darkColor: selectedColor,
          size: 360,
        });
        if (isCancelled) return;
        setQrDataUrl(qrCode);
      } catch (err) {
        console.error('Failed to generate QR Code:', err);
      } finally {
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    }

    init();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, plan, selectedColor]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      if (!shareUrl) return;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 },
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy share link:', e);
    }
  };

  const handleDownloadBadge = async () => {
    if (!qrDataUrl || !shareUrl) return;
    try {
      setIsDownloading(true);
      await downloadQRCodeBadge(plan, qrDataUrl, shareUrl);
    } catch (e) {
      console.error('Download failed:', e);
      alert('មានបញ្ហាក្នុងការទាញយករូបភាព QR Code');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xs flex items-center justify-center text-amber-300">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{language === 'km' ? 'ចែករំលែករហ័សដល់សហការី' : 'Instant Colleague Sharing'}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black font-moul tracking-wide">
                {language === 'km' ? 'បង្កើត QR Code ចែករំលែកកិច្ចតែងការ' : 'Share Lesson Plan via QR Code'}
              </h3>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
            {language === 'km'
              ? 'គ្រូបង្រៀនដទៃអាចស្កេន QR Code នេះដោយទូរស័ព្ទដៃ ដើម្បីបើកមើល និងទាញយកកិច្ចតែងការបង្រៀននេះភ្លាមៗដោយឥតគិតថ្លៃ។'
              : 'Other teachers can scan this QR code with their mobile phone to view, edit, and export this lesson plan instantly.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Lesson Plan Summary Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                  {plan.header.subject}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {plan.header.grade}
                </span>
                <span className="text-xs text-slate-500">
                  {plan.header.duration}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {plan.header.topic}
              </h4>
              <p className="text-xs text-slate-500">
                {plan.header.schoolName} • គ្រូ៖ {plan.header.teacherName || 'គ្រូបង្រៀន'}
              </p>
            </div>
          </div>

          {/* QR Code Presentation Box */}
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center bg-gradient-to-b from-blue-50/50 to-indigo-50/20 p-5 rounded-2xl border border-blue-100">
            {/* Visual QR Card */}
            <div className="relative group shrink-0">
              <div className="p-4 bg-white rounded-2xl shadow-md border-2 border-slate-200/80 flex flex-col items-center">
                {isGenerating ? (
                  <div className="w-52 h-52 sm:w-56 sm:h-56 flex flex-col items-center justify-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
                    <span className="text-xs text-slate-500 font-medium">
                      {language === 'km' ? 'កំពុងបង្កើត QR Code...' : 'Generating QR Code...'}
                    </span>
                  </div>
                ) : qrDataUrl ? (
                  <>
                    <img
                      src={qrDataUrl}
                      alt="Lesson Plan QR Code"
                      className="w-52 h-52 sm:w-56 sm:h-56 object-contain rounded-lg"
                    />
                    <div className="mt-2 text-center">
                      <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                        <Smartphone className="w-3 h-3 text-blue-600" />
                        <span>{language === 'km' ? 'ស្កេនដោយ Camera ទូរស័ព្ទ' : 'Scan with phone camera'}</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-xs text-rose-500">
                    Failed to generate QR Code
                  </div>
                )}
              </div>
            </div>

            {/* Controls & Options */}
            <div className="flex-1 space-y-4 w-full">
              {/* Color Customizer */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'km' ? 'ពណ៌ QR Code (QR Code Theme)៖' : 'QR Code Theme:'}
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { id: '#1e3a8a', label: language === 'km' ? 'ខៀវ MoEYS' : 'MoEYS Blue' },
                    { id: '#000000', label: language === 'km' ? 'ខ្មៅបុរាណ' : 'Classic Black' },
                    { id: '#047857', label: language === 'km' ? 'បៃតង' : 'Emerald Green' },
                    { id: '#6b21a8', label: language === 'km' ? 'ស្វាយ' : 'Purple' },
                  ].map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        selectedColor === color.id
                          ? 'border-slate-800 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white"
                        style={{ backgroundColor: color.id }}
                      ></span>
                      <span>{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scannable Link Input & Copy */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'km' ? 'តំណភ្ជាប់ផ្ទាល់ (Direct Link)៖' : 'Direct Scannable Link:'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 select-all font-mono truncate focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleCopyLink}
                    disabled={!shareUrl}
                    className="shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-2xs transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-200" />
                        <span>{language === 'km' ? 'បានចម្លង!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{language === 'km' ? 'ចម្លង' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Embed into Lesson Plan Sheet Toggle */}
              {onToggleEmbedInSheet && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="pr-3">
                    <p className="text-xs font-bold text-slate-800">
                      {language === 'km'
                        ? 'បង្ហាញ QR Code លើក្បាលសន្លឹកកិច្ចតែងការបង្រៀន'
                        : 'Embed QR Code in Printable Lesson Sheet'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {language === 'km'
                        ? 'ពេលបោះពុម្ពលើក្រដាស ឬនាំចេញជា PDF នឹងមានរូប QR Code ជាប់លើសន្លឹកកិច្ចតែងការ'
                        : 'Prints the QR code directly onto the paper document so colleagues can scan it physically'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={isEmbeddedInSheet}
                      onChange={(e) => onToggleEmbedInSheet(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions (Download PNG badge, Open Link) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'km' ? 'សាកល្បងបើកតំណ' : 'Test Open Link'}</span>
              </a>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadBadge}
                disabled={isDownloading || !qrDataUrl}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 transition shadow-sm hover:shadow"
              >
                {isDownloading ? (
                  <span>{language === 'km' ? 'កំពុងបង្កើត...' : 'Downloading...'}</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{language === 'km' ? 'ទាញយកកាត QR Code (PNG)' : 'Download QR Card (PNG)'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Teacher Instructions Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <h5 className="font-bold text-slate-800 flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>{language === 'km' ? 'របៀបដែលគ្រូបង្រៀនដទៃប្រើប្រាស់ QR Code នេះ៖' : 'How other teachers use this QR Code:'}</span>
            </h5>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-[12px] leading-relaxed">
              <li>
                {language === 'km'
                  ? 'បើកកម្មវិធី Camera លើទូរស័ព្ទដៃ (iOS ឬ Android) ឬកម្មវិធី QR Scanner'
                  : 'Open the camera app on any iPhone or Android phone'}
              </li>
              <li>
                {language === 'km'
                  ? 'តម្រង់កាមេរ៉ាទៅកាន់រូបភាព QR Code ហើយចុចលើតំណភ្ជាប់ (Banner/Link) ដែលបង្ហាញឡើង'
                  : 'Point camera at the QR code and tap the link that appears on screen'}
              </li>
              <li>
                {language === 'km'
                  ? 'កិច្ចតែងការបង្រៀនពេញលេញនឹងបើកបង្ហាញភ្លាមៗ រួចអាចកែប្រែ ឬទាញយកជា Word/PDF បានភ្លាមៗ!'
                  : 'The complete pedagogical lesson plan loads immediately, ready to customize or download!'}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
