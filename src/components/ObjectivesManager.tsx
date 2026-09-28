import React, { useState } from 'react';
import {
  BookOpen,
  Wrench,
  Heart,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Info,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  X,
  Copy,
  Check,
  GraduationCap,
} from 'lucide-react';
import { LessonPlanObjectives } from '../types/lessonPlan';

export interface ObjectivesManagerProps {
  objectives: LessonPlanObjectives;
  onChange: (updated: LessonPlanObjectives) => void;
  isEditing: boolean;
  isPrintFriendly?: boolean;
  topic?: string;
  subject?: string;
}

type DomainKey = keyof LessonPlanObjectives;

interface DomainMeta {
  key: DomainKey;
  numberKm: string;
  titleKm: string;
  titleEn: string;
  taxonomyName: string;
  color: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    iconBg: string;
    ring: string;
    light: string;
  };
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  suggestedVerbs: string[];
}

const DOMAINS: DomainMeta[] = [
  {
    key: 'knowledge',
    numberKm: '១',
    titleKm: 'ចំណេះដឹង',
    titleEn: 'Knowledge',
    taxonomyName: 'វិជ្ជាសម្បទា (Cognitive)',
    color: {
      bg: 'bg-blue-50/70',
      border: 'border-blue-200',
      text: 'text-blue-900',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      iconBg: 'bg-blue-600 text-white',
      ring: 'focus-within:ring-blue-400',
      light: 'bg-blue-50/40',
    },
    icon: BookOpen,
    description: 'ផ្ដោតលើការចងចាំ ការយល់ដឹង ការវិភាគ និងការកំណត់និយមន័យ/ទ្រឹស្ដីនៃមេរៀន។',
    suggestedVerbs: [
      'កំណត់និយមន័យ',
      'ពន្យល់ពី',
      'រៀបរាប់ពី',
      'បកស្រាយពី',
      'ប្រៀបធៀបរវាង',
      'វិភាគពីលក្ខណៈ',
      'ចង្អុលបង្ហាញពី',
    ],
  },
  {
    key: 'skills',
    numberKm: '២',
    titleKm: 'បំណិន',
    titleEn: 'Skills',
    taxonomyName: 'បំណិនសម្បទា (Psychomotor)',
    color: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-600 text-white',
      ring: 'focus-within:ring-emerald-400',
      light: 'bg-emerald-50/40',
    },
    icon: Wrench,
    description: 'ផ្ដោតលើការអនុវត្តជាក់ស្ដែង ការគណនា ការដោះស្រាយលំហាត់ និងការបង្កើតផលិតផល/លទ្ធផល។',
    suggestedVerbs: [
      'អនុវត្តការ',
      'គណនា និងរកឃើញ',
      'ដោះស្រាយលំហាត់',
      'រៀបចំដំណាក់កាល',
      'បង្ហាញពីរបៀប',
      'ពិសោធន៍ និងបង្កើត',
      'ប្រើប្រាស់ឧបករណ៍',
    ],
  },
  {
    key: 'attitude',
    numberKm: '៣',
    titleKm: 'ឥរិយាបថ',
    titleEn: 'Attitude',
    taxonomyName: 'ចរិយាសម្បទា (Affective)',
    color: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-200',
      text: 'text-amber-900',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-600 text-white',
      ring: 'focus-within:ring-amber-400',
      light: 'bg-amber-50/40',
    },
    icon: Heart,
    description: 'ផ្ដោតលើការបណ្ដុះស្មារតី ទំនួលខុសត្រូវ កិច្ចសហការជាក្រុម និងការយល់តម្លៃសង្គម។',
    suggestedVerbs: [
      'បណ្ដុះស្មារតី',
      'បង្ហាញការយកចិត្តទុកដាក់',
      'សហការគ្នាជាក្រុមក្នុងការ',
      'មានទំនួលខុសត្រូវចំពោះ',
      'ស្រឡាញ់ និងថែរក្សា',
      'គោរពវិន័យ និងសុវត្ថិភាព',
      'មានភាពក្លាហានក្នុងការ',
    ],
  },
];

export const ObjectivesManager: React.FC<ObjectivesManagerProps> = ({
  objectives,
  onChange,
  isEditing,
  isPrintFriendly = false,
  topic = '',
  subject = '',
}) => {
  // Local state for modal / expanded view
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DomainKey | 'all'>('all');
  const [showPedagogyGuide, setShowPedagogyGuide] = useState(false);
  const [newInputs, setNewInputs] = useState<Record<DomainKey, string>>({
    knowledge: '',
    skills: '',
    attitude: '',
  });
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Helper actions
  const handleUpdateItem = (domain: DomainKey, index: number, value: string) => {
    const list = [...objectives[domain]];
    list[index] = value;
    onChange({
      ...objectives,
      [domain]: list,
    });
  };

  const handleAddItem = (domain: DomainKey, initialText?: string) => {
    const textToAdd = (initialText !== undefined ? initialText : newInputs[domain]).trim();
    if (!textToAdd) return;
    onChange({
      ...objectives,
      [domain]: [...objectives[domain], textToAdd],
    });
    setNewInputs((prev) => ({ ...prev, [domain]: '' }));
  };

  const handleDeleteItem = (domain: DomainKey, index: number) => {
    const list = [...objectives[domain]];
    list.splice(index, 1);
    onChange({
      ...objectives,
      [domain]: list,
    });
  };

  const handleMoveItem = (domain: DomainKey, index: number, direction: 'up' | 'down') => {
    const list = [...objectives[domain]];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    onChange({
      ...objectives,
      [domain]: list,
    });
  };

  const handleApplyVerb = (domain: DomainKey, verb: string) => {
    const current = newInputs[domain].trim();
    if (!current) {
      setNewInputs((prev) => ({ ...prev, [domain]: `${verb} ` }));
    } else {
      setNewInputs((prev) => ({ ...prev, [domain]: `${verb} ${current}` }));
    }
  };

  // Quick contextual suggestions generator based on subject & topic
  const handleGenerateSmartSuggestions = () => {
    const t = topic || 'មេរៀន';
    const s = subject || 'មុខវិជ្ជា';
    const suggested: LessonPlanObjectives = {
      knowledge: [
        `កំណត់និយមន័យ និងខ្លឹមសារគន្លឹះនៃ «${t}» ក្នុងមុខវិជ្ជា ${s} បានច្បាស់លាស់`,
        `ពន្យល់ពីលក្ខណៈសម្គាល់ និងរូបមន្ត/ក្បួនខ្នាតបច្ចេកទេសនៃ «${t}» បានត្រឹមត្រូវ`,
      ],
      skills: [
        `អនុវត្តការដោះស្រាយលំហាត់ ឬប្រតិបត្តិការងារជាក់ស្ដែងលើ «${t}» តាមលំដាប់លំដោយ`,
        `បង្ហាញពីដំណោះស្រាយ និងផ្ទៀងផ្ទាត់លទ្ធផលជាក់ស្ដែងបានសុក្រឹតភាព`,
      ],
      attitude: [
        `បណ្ដុះស្មារតីស្រឡាញ់ការសិក្សា និងការអនុវត្តជាក់ស្ដែងលើ «${t}»`,
        `សហការគ្នាជាក្រុមដោយស្មារតីទទួលខុសត្រូវ និងគោរពវិន័យក្នុងថ្នាក់រៀន`,
      ],
    };
    onChange(suggested);
  };

  // Copy objectives text formatted
  const handleCopyObjectivesText = () => {
    const text = `I. វត្ថុបំណង (Objectives)
១. ចំណេះដឹង (Knowledge)៖
${objectives.knowledge.map((k) => `- ${k}`).join('\n')}

២. បំណិន (Skills)៖
${objectives.skills.map((s) => `- ${s}`).join('\n')}

៣. ឥរិយាបថ (Attitude)៖
${objectives.attitude.map((a) => `- ${a}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const totalCount =
    objectives.knowledge.length + objectives.skills.length + objectives.attitude.length;
  const isBalanced =
    objectives.knowledge.length > 0 &&
    objectives.skills.length > 0 &&
    objectives.attitude.length > 0;

  // ----------------------------------------------------
  // RENDER: Dedicated Management Dialog / Modal
  // ----------------------------------------------------
  const renderManagerDialog = () => {
    if (!isManagerModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
          {/* Dialog Header */}
          <div className="px-5 py-4 border-b border-slate-200 bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-moul text-sm sm:text-base tracking-wide flex items-center gap-2">
                  <span>គ្រប់គ្រងវត្ថុបំណង ៣ វិស័យ (3 Domains of Learning)</span>
                </h3>
                <p className="text-xs text-blue-200 font-sans mt-0.5">
                  វិជ្ជាសម្បទា (Knowledge) • បំណិនសម្បទា (Skills) • ចរិយាសម្បទា (Attitude)
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowPedagogyGuide(!showPedagogyGuide)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition ${
                  showPedagogyGuide
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-semibold'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
                title="បង្ហាញគោលការណ៍ Bloom's Taxonomy & SMART"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ក្បួនគរុកោសល្យ</span>
              </button>
              <button
                type="button"
                onClick={() => setIsManagerModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Balance Status & Controls Sub-bar */}
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-600">តុល្យភាពវិស័យ៖</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                ចំណេះដឹង៖ {objectives.knowledge.length}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                បំណិន៖ {objectives.skills.length}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                ឥរិយាបថ៖ {objectives.attitude.length}
              </span>
              <span className="text-slate-400">|</span>
              <span className="font-semibold text-slate-700">សរុប៖ {totalCount} ចំណុច</span>
              {isBalanced ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  គ្រប់ ៣ វិស័យ
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  គួរមានយ៉ាងហោច ១ ចំណុចក្នុងវិស័យនីមួយៗ
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGenerateSmartSuggestions}
                className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1 cursor-pointer transition font-medium"
                title="បង្កើតវត្ថុបំណងគំរូស្វ័យប្រវត្តិតាមប្រធានបទមេរៀន"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>បង្កើតគំរូថ្មីស្វ័យប្រវត្តិ</span>
              </button>
              <button
                type="button"
                onClick={handleCopyObjectivesText}
                className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 cursor-pointer transition"
                title="ចម្លងអត្ថបទវត្ថុបំណងទាំងអស់"
              >
                {copiedNotification ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">បានចម្លង!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>ចម្លងអត្ថបទ</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Pedagogical Guideline Accordion (Collapsible) */}
          {showPedagogyGuide && (
            <div className="p-4 bg-amber-50/80 border-b border-amber-200 text-xs text-amber-950 shrink-0 animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                    <GraduationCap className="w-4 h-4 text-amber-700" />
                    <span>គោលការណ៍កំណត់វត្ថុបំណងតាមស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា (Bloom's Taxonomy & SMART)៖</span>
                  </div>
                  <p className="leading-relaxed">
                    វត្ថុបំណងត្រូវកំណត់ឱ្យបានច្បាស់លាស់លើ <strong>៣ វិស័យ</strong> និងអនុវត្តតាមលក្ខខណ្ឌ <strong>SMART</strong> ៖
                    <span className="ml-1 text-slate-800">
                      (១) <strong>S</strong>pecific: ជាក់លាក់ មិនស្រពិចស្រពិល •
                      (២) <strong>M</strong>easurable: អាចវាស់វែងបានដោយប្រើកិរិយាសព្ទសកម្ម •
                      (៣) <strong>A</strong>chievable: សិស្សអាចសម្រេចបាន •
                      (៤) <strong>R</strong>elevant: ស្របតាមខ្លឹមសារមេរៀន •
                      (៥) <strong>T</strong>ime-bound: សម្រេចក្នុងរយៈពេលម៉ោងសិក្សា។
                    </span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 pt-2 border-t border-amber-200/80">
                    <div className="bg-white/80 p-2 rounded border border-amber-200">
                      <span className="font-bold text-blue-900">១. វិជ្ជាសម្បទា (ចំណេះដឹង)៖</span>
                      <p className="text-[11px] text-slate-600 mt-0.5">តើសិស្សនឹងចងចាំ យល់ និងបកស្រាយអ្វីខ្លះពីទ្រឹស្ដី ឬរូបមន្ត?</p>
                    </div>
                    <div className="bg-white/80 p-2 rounded border border-amber-200">
                      <span className="font-bold text-emerald-900">២. បំណិនសម្បទា (បំណិន)៖</span>
                      <p className="text-[11px] text-slate-600 mt-0.5">តើសិស្សនឹងចេះធ្វើ ចេះគណនា ឬដោះស្រាយបញ្ហាអ្វីខ្លះដោយដៃផ្ទាល់?</p>
                    </div>
                    <div className="bg-white/80 p-2 rounded border border-amber-200">
                      <span className="font-bold text-amber-900">៣. ចរិយាសម្បទា (ឥរិយាបថ)៖</span>
                      <p className="text-[11px] text-slate-600 mt-0.5">តើសិស្សនឹងបណ្ដុះស្មារតី ការសហការ ទំនួលខុសត្រូវ ឬការយល់តម្លៃអ្វីខ្លះ?</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPedagogyGuide(false)}
                  className="text-amber-700 hover:text-amber-950 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab Filter Header for small screens */}
          <div className="flex border-b border-slate-200 px-5 pt-2 bg-slate-50/50 gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition ${
                activeTab === 'all'
                  ? 'border-blue-600 text-blue-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              វិស័យទាំង ៣ ព្រមគ្នា (Side-by-Side)
            </button>
            {DOMAINS.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setActiveTab(d.key)}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === d.key
                    ? 'border-blue-600 text-blue-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{d.titleKm}</span>
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-mono">
                  {objectives[d.key].length}
                </span>
              </button>
            ))}
          </div>

          {/* Dialog Scrollable Content: Domain Cards */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/60">
            <div
              className={`grid gap-5 ${
                activeTab === 'all'
                  ? 'grid-cols-1 lg:grid-cols-3'
                  : 'grid-cols-1 max-w-2xl mx-auto'
              }`}
            >
              {DOMAINS.filter((d) => activeTab === 'all' || activeTab === d.key).map((domain) => {
                const DomainIcon = domain.icon;
                const items = objectives[domain.key];
                const inputVal = newInputs[domain.key];

                return (
                  <div
                    key={domain.key}
                    className={`rounded-xl border bg-white shadow-xs flex flex-col overflow-hidden transition-all ${domain.color.border}`}
                  >
                    {/* Domain Card Header */}
                    <div className={`p-3.5 border-b ${domain.color.bg} ${domain.color.border}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <div className={`w-7 h-7 rounded-lg ${domain.color.iconBg} flex items-center justify-center shrink-0`}>
                            <DomainIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className={`font-bold text-sm leading-tight ${domain.color.text}`}>
                              {domain.numberKm}. {domain.titleKm} ({domain.titleEn})
                            </h4>
                            <span className="text-[11px] font-medium text-slate-500">
                              {domain.taxonomyName}
                            </span>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold border ${domain.color.badge}`}>
                          {items.length} ចំណុច
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {domain.description}
                      </p>
                    </div>

                    {/* Domain Item List */}
                    <div className="p-3.5 flex-1 space-y-2.5 overflow-y-auto max-h-[350px]">
                      {items.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400 italic border-2 border-dashed border-slate-200 rounded-lg">
                          មិនទាន់មានវត្ថុបំណងក្នុងវិស័យនេះនៅឡើយ
                        </div>
                      ) : (
                        items.map((item, idx) => (
                          <div
                            key={idx}
                            className="group p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-white transition flex items-start gap-2 shadow-2xs"
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] flex items-center justify-center shrink-0 mt-1 font-mono font-semibold">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <textarea
                                value={item}
                                onChange={(e) => handleUpdateItem(domain.key, idx, e.target.value)}
                                rows={2}
                                className="w-full text-xs text-slate-800 bg-transparent resize-none focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-blue-400 p-1 rounded transition border border-transparent hover:border-slate-200"
                                placeholder={`សរសេរវត្ថុបំណង ${domain.titleKm}...`}
                              />
                            </div>
                            {/* Actions: Reorder and Delete */}
                            <div className="flex flex-col gap-0.5 shrink-0 pt-0.5">
                              <div className="flex items-center gap-0.5">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveItem(domain.key, idx, 'up')}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 transition"
                                  title="រំកិលឡើងលើ"
                                >
                                  <ChevronUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === items.length - 1}
                                  onClick={() => handleMoveItem(domain.key, idx, 'down')}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 transition"
                                  title="រំកិលចុះក្រោម"
                                >
                                  <ChevronDown className="w-3 h-3" />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(domain.key, idx)}
                                className="w-5 h-5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition mt-1 self-end"
                                title="លុបចំណុចនេះ"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Quick Action Verb Starters */}
                    <div className="px-3.5 pt-2 pb-2 bg-slate-50/80 border-t border-slate-100">
                      <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mb-1.5">
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        កិរិយាសព្ទសកម្មគំរូ (ចុចដើម្បីដាក់ចូល)៖
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {domain.suggestedVerbs.map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => handleApplyVerb(domain.key, v)}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-300 transition cursor-pointer"
                          >
                            + {v}...
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Add New Item Input */}
                    <div className="p-3 border-t border-slate-200 bg-white">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={inputVal}
                          onChange={(e) =>
                            setNewInputs((prev) => ({ ...prev, [domain.key]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddItem(domain.key);
                            }
                          }}
                          placeholder={`បន្ថែមចំណុចថ្មីលើ ${domain.titleKm}...`}
                          className="flex-1 text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddItem(domain.key)}
                          disabled={!inputVal.trim()}
                          className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition shrink-0 font-medium ${
                            inputVal.trim()
                              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-xs'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>បន្ថែម</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="px-5 py-3 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500">
              ការផ្លាស់ប្ដូរត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិចូលកិច្ចតែងការបង្រៀន។
            </span>
            <button
              type="button"
              onClick={() => setIsManagerModalOpen(false)}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>រួចរាល់ (បិទផ្ទាំង)</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // RENDER: In-Page Preview & Quick Inline Management
  // ----------------------------------------------------
  return (
    <div className="objectives-section mb-6">
      {/* Section Header with Dedicated Management Button */}
      <div className="flex items-center justify-between mb-2">
        <h3
          className={`font-moul text-base flex items-center gap-2 ${
            isPrintFriendly ? 'text-black' : 'text-blue-900'
          }`}
        >
          <span>I. វត្ថុបំណង (Objectives)</span>
        </h3>

        {/* Action Controls (Hidden on Print) */}
        <div className="no-print flex items-center gap-2">
          {/* Quick Domain Balance Pill */}
          <span
            className={`hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full border ${
              isBalanced
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isBalanced ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-3 h-3 text-amber-600" />
            )}
            <span>៣ វិស័យ ({totalCount} ចំណុច)</span>
          </span>

          {/* Dedicated Manager Button */}
          <button
            type="button"
            onClick={() => setIsManagerModalOpen(true)}
            className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 font-medium flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            title="បើកផ្ទាំងគ្រប់គ្រងវត្ថុបំណង ៣ វិស័យលម្អិត"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            <span>គ្រប់គ្រងវត្ថុបំណង (3 Domains)</span>
          </button>
        </div>
      </div>

      {/* 3 Domains Content Container */}
      <div className="space-y-3.5 pl-2 sm:pl-4 text-sm">
        {DOMAINS.map((domain) => {
          const items = objectives[domain.key];
          const DomainIcon = domain.icon;

          return (
            <div
              key={domain.key}
              className={`rounded-lg transition-all ${
                isEditing && !isPrintFriendly
                  ? `p-3 border ${domain.color.border} ${domain.color.light}`
                  : ''
              }`}
            >
              {/* Domain Subheading */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-[13px] sm:text-sm flex items-center gap-1.5 ${
                      isPrintFriendly ? 'text-black' : domain.color.text
                    }`}
                  >
                    {!isPrintFriendly && (
                      <span className={`w-5 h-5 rounded-md ${domain.color.iconBg} flex items-center justify-center text-[10px]`}>
                        <DomainIcon className="w-3 h-3" />
                      </span>
                    )}
                    <span>
                      {domain.numberKm}. {domain.titleKm} ({domain.titleEn})៖
                    </span>
                  </span>

                  {/* Taxonomy badge (non-print only) */}
                  {!isPrintFriendly && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded text-slate-500 font-sans hidden sm:inline">
                      [{domain.taxonomyName}]
                    </span>
                  )}
                </div>

                {/* Inline Add Button when editing */}
                {isEditing && (
                  <div className="no-print flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddItem(domain.key, 'ចំណុចថ្មី...')}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>បន្ថែម</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Items List */}
              <ul
                className={`pl-5 space-y-1 ${
                  isPrintFriendly ? 'text-black list-disc' : 'text-slate-800'
                }`}
              >
                {items.length === 0 ? (
                  <li className="text-xs text-slate-400 italic list-none">
                    - មិនទាន់មានវត្ថុបំណង
                  </li>
                ) : (
                  items.map((item, idx) => (
                    <li
                      key={idx}
                      className={`${
                        !isPrintFriendly ? 'list-disc' : ''
                      } leading-relaxed`}
                    >
                      {isEditing && !isPrintFriendly ? (
                        <div className="flex items-center gap-2 my-1">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleUpdateItem(domain.key, idx, e.target.value)}
                            className="flex-1 border-b border-slate-300 py-0.5 text-xs sm:text-sm focus:border-blue-500 focus:outline-hidden bg-white/80 px-1 rounded"
                          />
                          <div className="flex items-center gap-0.5 shrink-0 no-print">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveItem(domain.key, idx, 'up')}
                              className="p-1 hover:bg-slate-200 disabled:opacity-20 rounded text-slate-600"
                              title="រំកិលឡើង"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === items.length - 1}
                              onClick={() => handleMoveItem(domain.key, idx, 'down')}
                              className="p-1 hover:bg-slate-200 disabled:opacity-20 rounded text-slate-600"
                              title="រំកិលចុះ"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(domain.key, idx)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                              title="លុប"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm">{item}</span>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Render the Full Dedicated Modal if opened */}
      {renderManagerDialog()}
    </div>
  );
};
