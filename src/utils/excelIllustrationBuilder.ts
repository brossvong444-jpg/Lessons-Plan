import { LessonIllustration } from '../types/lessonPlan';

export function buildExcelIllustration(cleanTopic: string, prompt: string): LessonIllustration {
  const t = cleanTopic.toLowerCase();

  // 1. COUNTIFS
  if (t.includes('countifs') || t.includes('count-ifs') || (t.includes('count') && t.includes('ifs'))) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
      <defs>
        <linearGradient id="ictBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#022c22" />
          <stop offset="50%" stop-color="#064e3b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#ictBg)" rx="16" />
      
      <!-- Header Badge -->
      <g transform="translate(40, 24)">
        <rect width="360" height="32" rx="16" fill="#065f46" stroke="#34d399" stroke-width="1.5" />
        <circle cx="18" cy="16" r="6" fill="#34d399" />
        <text x="32" y="21" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">ចំណុចប្រទាក់តារាង Excel៖ រូបមន្ត =COUNTIFS</text>
      </g>
      
      <!-- Excel Window -->
      <g transform="translate(40, 68)">
        <rect width="720" height="315" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="2" />
        <!-- Title bar -->
        <rect width="720" height="26" rx="10" fill="#1e293b" />
        <rect x="0" y="18" width="720" height="8" fill="#1e293b" />
        <circle cx="16" cy="13" r="4" fill="#ef4444" />
        <circle cx="28" cy="13" r="4" fill="#f59e0b" />
        <circle cx="40" cy="13" r="4" fill="#10b981" />
        <text x="60" y="17" font-family="sans-serif" font-size="11" fill="#94a3b8">Microsoft Excel - [CountIFS_Demonstration.xlsx]</text>
        
        <!-- Formula Bar -->
        <rect x="12" y="32" width="696" height="30" rx="4" fill="#1e293b" stroke="#334155" />
        <text x="22" y="52" font-family="sans-serif" font-size="12" font-weight="bold" fill="#10b981">fx</text>
        <line x1="42" y1="36" x2="42" y2="58" stroke="#475569" />
        <text x="52" y="52" font-family="monospace" font-size="12" font-weight="bold" fill="#f8fafc">=COUNTIFS(C2:C7, "ស្រី", E2:E7, "&gt;=50")</text>
        <rect x="520" y="36" width="180" height="22" rx="4" fill="#065f46" stroke="#34d399" />
        <text x="530" y="51" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#a7f3d0">🎯 លទ្ធផលរាប់ = ៤ នាក់</text>
        
        <!-- Table Header (Columns A, B, C, D, E, F) -->
        <rect x="12" y="68" width="696" height="24" fill="#047857" />
        <text x="25" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">A (ល.រ)</text>
        <text x="90" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">B (ឈ្មោះសិស្ស)</text>
        <text x="220" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">C (ភេទ: លក្ខខណ្ឌ ១)</text>
        <text x="360" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">D (ថ្នាក់)</text>
        <text x="440" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">E (ពិន្ទុ: លក្ខខណ្ឌ ២)</text>
        <text x="580" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">F (ផ្ទៀងផ្ទាត់)</text>
        
        <!-- Row 1 (Match: ស្រី, 85) -->
        <rect x="12" y="94" width="696" height="23" fill="#064e3b" stroke="#059669" stroke-width="0.7" />
        <text x="25" y="110" font-family="sans-serif" font-size="11" fill="#f8fafc">1</text>
        <text x="90" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">សុខ ចិន្តា</text>
        <rect x="215" y="96" width="60" height="19" rx="3" fill="#047857" />
        <text x="230" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#a7f3d0">ស្រី</text>
        <text x="360" y="110" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
        <rect x="435" y="96" width="50" height="19" rx="3" fill="#047857" />
        <text x="450" y="110" font-family="sans-serif" font-size="11" font-weight="bold" fill="#a7f3d0">85</text>
        <rect x="580" y="96" width="115" height="19" rx="3" fill="#047857" />
        <text x="590" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#34d399">✔ ត្រូវលក្ខខណ្ឌ</text>
        
        <!-- Row 2 (Not match: ប្រុស, 45) -->
        <rect x="12" y="119" width="696" height="23" fill="#0f172a" />
        <text x="25" y="135" font-family="sans-serif" font-size="11" fill="#94a3b8">2</text>
        <text x="90" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">ចាន់ វិបុល</text>
        <text x="230" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#94a3b8">ប្រុស</text>
        <text x="360" y="135" font-family="sans-serif" font-size="11" fill="#94a3b8">10A</text>
        <text x="450" y="135" font-family="sans-serif" font-size="11" fill="#94a3b8">45</text>
        <text x="590" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#64748b">✘ មិនត្រូវ</text>
        
        <!-- Row 3 (Match: ស្រី, 92) -->
        <rect x="12" y="144" width="696" height="23" fill="#064e3b" stroke="#059669" stroke-width="0.7" />
        <text x="25" y="160" font-family="sans-serif" font-size="11" fill="#f8fafc">3</text>
        <text x="90" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">គង់ ធីតា</text>
        <rect x="215" y="146" width="60" height="19" rx="3" fill="#047857" />
        <text x="230" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#a7f3d0">ស្រី</text>
        <text x="360" y="160" font-family="sans-serif" font-size="11" fill="#cbd5e1">10B</text>
        <rect x="435" y="146" width="50" height="19" rx="3" fill="#047857" />
        <text x="450" y="160" font-family="sans-serif" font-size="11" font-weight="bold" fill="#a7f3d0">92</text>
        <rect x="580" y="146" width="115" height="19" rx="3" fill="#047857" />
        <text x="590" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#34d399">✔ ត្រូវលក្ខខណ្ឌ</text>
        
        <!-- Row 4 (Match: ស្រី, 74) -->
        <rect x="12" y="169" width="696" height="23" fill="#064e3b" stroke="#059669" stroke-width="0.7" />
        <text x="25" y="185" font-family="sans-serif" font-size="11" fill="#f8fafc">4</text>
        <text x="90" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">ជា សុភា</text>
        <rect x="215" y="171" width="60" height="19" rx="3" fill="#047857" />
        <text x="230" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#a7f3d0">ស្រី</text>
        <text x="360" y="185" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
        <rect x="435" y="171" width="50" height="19" rx="3" fill="#047857" />
        <text x="450" y="185" font-family="sans-serif" font-size="11" font-weight="bold" fill="#a7f3d0">74</text>
        <rect x="580" y="171" width="115" height="19" rx="3" fill="#047857" />
        <text x="590" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#34d399">✔ ត្រូវលក្ខខណ្ឌ</text>
        
        <!-- Row 5 (Not match: ប្រុស, 48) -->
        <rect x="12" y="194" width="696" height="23" fill="#0f172a" />
        <text x="25" y="210" font-family="sans-serif" font-size="11" fill="#94a3b8">5</text>
        <text x="90" y="210" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">ហេង ពិសាល</text>
        <text x="230" y="210" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#94a3b8">ប្រុស</text>
        <text x="360" y="210" font-family="sans-serif" font-size="11" fill="#94a3b8">10B</text>
        <text x="450" y="210" font-family="sans-serif" font-size="11" fill="#94a3b8">48</text>
        <text x="590" y="210" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#64748b">✘ មិនត្រូវ</text>
        
        <!-- Row 6 (Match: ស្រី, 65) -->
        <rect x="12" y="219" width="696" height="23" fill="#064e3b" stroke="#059669" stroke-width="0.7" />
        <text x="25" y="235" font-family="sans-serif" font-size="11" fill="#f8fafc">6</text>
        <text x="90" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">មាស រស្មី</text>
        <rect x="215" y="221" width="60" height="19" rx="3" fill="#047857" />
        <text x="230" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#a7f3d0">ស្រី</text>
        <text x="360" y="235" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
        <rect x="435" y="221" width="50" height="19" rx="3" fill="#047857" />
        <text x="450" y="235" font-family="sans-serif" font-size="11" font-weight="bold" fill="#a7f3d0">65</text>
        <rect x="580" y="221" width="115" height="19" rx="3" fill="#047857" />
        <text x="590" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#34d399">✔ ត្រូវលក្ខខណ្ឌ</text>
        
        <!-- Rule and Syntax Footer Card -->
        <rect x="12" y="248" width="696" height="55" rx="6" fill="#1e293b" stroke="#334155" />
        <text x="25" y="270" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#34d399">💡 ទម្រង់វាក្យសម្ព័ន្ធ (Syntax)៖</text>
        <text x="200" y="270" font-family="monospace" font-size="11" font-weight="bold" fill="#f8fafc">=COUNTIFS(criteria_range1, criteria1, criteria_range2, criteria2, ...)</text>
        <text x="25" y="291" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#cbd5e1">📌 គោលការណ៍គរុកោសល្យ៖ រាប់ចំនួនជួរដេកណាដែលបំពេញគ្រប់លក្ខខណ្ឌទាំងអស់ព្រមគ្នា (AND)។ លក្ខខណ្ឌជាអក្សរ ឬនិមិត្តសញ្ញាត្រូវដាក់ក្នុងសញ្ញាសម្រង់ "..."</text>
      </g>
      
      <!-- Bottom Banner -->
      <g transform="translate(40, 395)">
        <rect width="720" height="38" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="1" />
        <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#34d399">ប្រធានបទ៖</text>
        <text x="100" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="semibold" fill="#f8fafc">${cleanTopic}</text>
      </g>
    </svg>`;
    return {
      id: 'ill-' + Date.now(),
      url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      caption: `រូបភាពគំរូទម្រង់កម្មវិធី Excel និងរូបមន្ត =COUNTIFS សម្រាប់រាប់ទិន្នន័យច្រើនលក្ខខណ្ឌ៖ ${cleanTopic}`,
      prompt,
      type: 'ai',
      aspectRatio: '16:9',
      showInStep3: true,
    };
  }

  // 2. COUNTBLANK
  if (t.includes('countblank') || t.includes('count blank') || t.includes('ក្រឡាទទេ')) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
      <defs>
        <linearGradient id="blankBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1f2937" />
          <stop offset="50%" stop-color="#111827" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#blankBg)" rx="16" />
      
      <!-- Header Badge -->
      <g transform="translate(40, 24)">
        <rect width="380" height="32" rx="16" fill="#854d0e" stroke="#facc15" stroke-width="1.5" />
        <circle cx="18" cy="16" r="6" fill="#facc15" />
        <text x="32" y="21" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#fef08a">ចំណុចប្រទាក់តារាង Excel៖ រូបមន្ត =COUNTBLANK</text>
      </g>
      
      <!-- Excel Window -->
      <g transform="translate(40, 68)">
        <rect width="720" height="315" rx="10" fill="#0f172a" stroke="#eab308" stroke-width="2" />
        <!-- Title bar -->
        <rect width="720" height="26" rx="10" fill="#1e293b" />
        <rect x="0" y="18" width="720" height="8" fill="#1e293b" />
        <circle cx="16" cy="13" r="4" fill="#ef4444" />
        <circle cx="28" cy="13" r="4" fill="#f59e0b" />
        <circle cx="40" cy="13" r="4" fill="#10b981" />
        <text x="60" y="17" font-family="sans-serif" font-size="11" fill="#94a3b8">Microsoft Excel - [CountBlank_Report.xlsx]</text>
        
        <!-- Formula Bar -->
        <rect x="12" y="32" width="696" height="30" rx="4" fill="#1e293b" stroke="#334155" />
        <text x="22" y="52" font-family="sans-serif" font-size="12" font-weight="bold" fill="#eab308">fx</text>
        <line x1="42" y1="36" x2="42" y2="58" stroke="#475569" />
        <text x="52" y="52" font-family="monospace" font-size="12" font-weight="bold" fill="#f8fafc">=COUNTBLANK(C2:C7)</text>
        <rect x="500" y="36" width="200" height="22" rx="4" fill="#713f12" stroke="#eab308" />
        <text x="510" y="51" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#fef08a">🎯 ចំនួនក្រឡាទទេ = ៣ ក្រឡា</text>
        
        <!-- Table Header (Columns A, B, C, D, E) -->
        <rect x="12" y="68" width="696" height="24" fill="#854d0e" />
        <text x="25" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">A (ល.រ)</text>
        <text x="90" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">B (ឈ្មោះសិស្ស)</text>
        <text x="240" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">C (លេខទូរសព្ទ - Range C2:C7)</text>
        <text x="440" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">D (អាសយដ្ឋាន)</text>
        <text x="580" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">E (ស្ថានភាពទិន្នន័យ)</text>
        
        <!-- Row 1 (Filled) -->
        <rect x="12" y="94" width="696" height="23" fill="#1e293b" />
        <text x="25" y="110" font-family="sans-serif" font-size="11" fill="#f8fafc">1</text>
        <text x="90" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">សុខ ចិន្តា</text>
        <text x="240" y="110" font-family="sans-serif" font-size="11" fill="#38bdf8">012 345 678</text>
        <text x="440" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">ភ្នំពេញ</text>
        <text x="580" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#34d399">✔ មានទិន្នន័យ</text>
        
        <!-- Row 2 (BLANK!) -->
        <rect x="12" y="119" width="696" height="23" fill="#451a03" stroke="#f59e0b" stroke-width="1" />
        <text x="25" y="135" font-family="sans-serif" font-size="11" fill="#f8fafc">2</text>
        <text x="90" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">ចាន់ វិបុល</text>
        <rect x="235" y="121" width="170" height="19" rx="3" fill="#78350f" stroke="#fbbf24" stroke-dasharray="2,2" />
        <text x="250" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#fef08a">[ ក្រឡាទទេ (Blank) ]</text>
        <text x="440" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">កណ្តាល</text>
        <text x="580" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#f87171">✘ ខ្វះលេខទូរសព្ទ</text>
        
        <!-- Row 3 (Filled) -->
        <rect x="12" y="144" width="696" height="23" fill="#1e293b" />
        <text x="25" y="160" font-family="sans-serif" font-size="11" fill="#f8fafc">3</text>
        <text x="90" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">គង់ ធីតា</text>
        <text x="240" y="160" font-family="sans-serif" font-size="11" fill="#38bdf8">098 765 432</text>
        <text x="440" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">សៀមរាប</text>
        <text x="580" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#34d399">✔ មានទិន្នន័យ</text>
        
        <!-- Row 4 (BLANK!) -->
        <rect x="12" y="169" width="696" height="23" fill="#451a03" stroke="#f59e0b" stroke-width="1" />
        <text x="25" y="185" font-family="sans-serif" font-size="11" fill="#f8fafc">4</text>
        <text x="90" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">ជា សុភា</text>
        <rect x="235" y="171" width="170" height="19" rx="3" fill="#78350f" stroke="#fbbf24" stroke-dasharray="2,2" />
        <text x="250" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#fef08a">[ ក្រឡាទទេ (Blank) ]</text>
        <text x="440" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">បាត់ដំបង</text>
        <text x="580" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#f87171">✘ ខ្វះលេខទូរសព្ទ</text>
        
        <!-- Row 5 (Filled) -->
        <rect x="12" y="194" width="696" height="23" fill="#1e293b" />
        <text x="25" y="210" font-family="sans-serif" font-size="11" fill="#f8fafc">5</text>
        <text x="90" y="210" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">ហេង ពិសាល</text>
        <text x="240" y="210" font-family="sans-serif" font-size="11" fill="#38bdf8">088 112 233</text>
        <text x="440" y="210" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">កំពង់ចាម</text>
        <text x="580" y="210" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#34d399">✔ មានទិន្នន័យ</text>
        
        <!-- Row 6 (BLANK!) -->
        <rect x="12" y="219" width="696" height="23" fill="#451a03" stroke="#f59e0b" stroke-width="1" />
        <text x="25" y="235" font-family="sans-serif" font-size="11" fill="#f8fafc">6</text>
        <text x="90" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">មាស រស្មី</text>
        <rect x="235" y="221" width="170" height="19" rx="3" fill="#78350f" stroke="#fbbf24" stroke-dasharray="2,2" />
        <text x="250" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#fef08a">[ ក្រឡាទទេ (Blank) ]</text>
        <text x="440" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">ភ្នំពេញ</text>
        <text x="580" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#f87171">✘ ខ្វះលេខទូរសព្ទ</text>
        
        <!-- Rule and Syntax Footer Card -->
        <rect x="12" y="248" width="696" height="55" rx="6" fill="#1e293b" stroke="#334155" />
        <text x="25" y="270" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#facc15">💡 ទម្រង់វាក្យសម្ព័ន្ធ (Syntax)៖</text>
        <text x="200" y="270" font-family="monospace" font-size="11" font-weight="bold" fill="#f8fafc">=COUNTBLANK(range)</text>
        <text x="25" y="291" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#cbd5e1">📌 គោលការណ៍គរុកោសល្យ៖ រាប់ចំនួនក្រឡាដែលគ្មានទិន្នន័យ (Empty Cells) ក្នុងដែនកំណត់ range។ ក្រឡាដែលមាន space មិនត្រូវបានចាត់ជា Blank ឡើយ។</text>
      </g>
      
      <!-- Bottom Banner -->
      <g transform="translate(40, 395)">
        <rect width="720" height="38" rx="8" fill="#713f12" stroke="#eab308" stroke-width="1" />
        <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#facc15">ប្រធានបទ៖</text>
        <text x="100" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="semibold" fill="#f8fafc">${cleanTopic}</text>
      </g>
    </svg>`;
    return {
      id: 'ill-' + Date.now(),
      url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      caption: `រូបភាពគំរូទម្រង់កម្មវិធី Excel និងរូបមន្ត =COUNTBLANK សម្រាប់រាប់ក្រឡាទទេ៖ ${cleanTopic}`,
      prompt,
      type: 'ai',
      aspectRatio: '16:9',
      showInStep3: true,
    };
  }

  // 3. COUNTIF
  if (t.includes('countif') || t.includes('count if')) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
      <defs>
        <linearGradient id="cifBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#082f49" />
          <stop offset="50%" stop-color="#0369a1" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#cifBg)" rx="16" />
      
      <!-- Header Badge -->
      <g transform="translate(40, 24)">
        <rect width="360" height="32" rx="16" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5" />
        <circle cx="18" cy="16" r="6" fill="#38bdf8" />
        <text x="32" y="21" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#f0f9ff">ចំណុចប្រទាក់តារាង Excel៖ រូបមន្ត =COUNTIF</text>
      </g>
      
      <!-- Excel Window -->
      <g transform="translate(40, 68)">
        <rect width="720" height="315" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
        <!-- Title bar -->
        <rect width="720" height="26" rx="10" fill="#1e293b" />
        <rect x="0" y="18" width="720" height="8" fill="#1e293b" />
        <circle cx="16" cy="13" r="4" fill="#ef4444" />
        <circle cx="28" cy="13" r="4" fill="#f59e0b" />
        <circle cx="40" cy="13" r="4" fill="#10b981" />
        <text x="60" y="17" font-family="sans-serif" font-size="11" fill="#94a3b8">Microsoft Excel - [CountIF_SingleCriteria.xlsx]</text>
        
        <!-- Formula Bar -->
        <rect x="12" y="32" width="696" height="30" rx="4" fill="#1e293b" stroke="#334155" />
        <text x="22" y="52" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8">fx</text>
        <line x1="42" y1="36" x2="42" y2="58" stroke="#475569" />
        <text x="52" y="52" font-family="monospace" font-size="12" font-weight="bold" fill="#f8fafc">=COUNTIF(C2:C7, "ស្រី")</text>
        <rect x="520" y="36" width="180" height="22" rx="4" fill="#0369a1" stroke="#38bdf8" />
        <text x="530" y="51" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#bae6fd">🎯 លទ្ធផលរាប់ = ៤ នាក់</text>
        
        <!-- Table Header -->
        <rect x="12" y="68" width="696" height="24" fill="#0284c7" />
        <text x="25" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">A (ល.រ)</text>
        <text x="90" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">B (ឈ្មោះសិស្ស)</text>
        <text x="220" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">C (ភេទ - Criteria Range)</text>
        <text x="380" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">D (ថ្នាក់)</text>
        <text x="480" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">E (ពិន្ទុ)</text>
        <text x="580" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">F (លទ្ធផល)</text>
        
        <!-- Rows -->
        <rect x="12" y="94" width="696" height="23" fill="#075985" stroke="#38bdf8" stroke-width="0.7" />
        <text x="25" y="110" font-family="sans-serif" font-size="11" fill="#f8fafc">1</text>
        <text x="90" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">សុខ ចិន្តា</text>
        <text x="230" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#7dd3fc">ស្រី (Match)</text>
        <text x="380" y="110" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
        <text x="480" y="110" font-family="sans-serif" font-size="11" fill="#cbd5e1">85</text>
        <text x="580" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#34d399">✔ រាប់ចូល</text>
        
        <rect x="12" y="119" width="696" height="23" fill="#0f172a" />
        <text x="25" y="135" font-family="sans-serif" font-size="11" fill="#94a3b8">2</text>
        <text x="90" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">ចាន់ វិបុល</text>
        <text x="230" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#94a3b8">ប្រុស</text>
        <text x="380" y="135" font-family="sans-serif" font-size="11" fill="#94a3b8">10A</text>
        <text x="480" y="135" font-family="sans-serif" font-size="11" fill="#94a3b8">45</text>
        <text x="580" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#64748b">✘ មិនរាប់</text>
        
        <rect x="12" y="144" width="696" height="23" fill="#075985" stroke="#38bdf8" stroke-width="0.7" />
        <text x="25" y="160" font-family="sans-serif" font-size="11" fill="#f8fafc">3</text>
        <text x="90" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">គង់ ធីតា</text>
        <text x="230" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#7dd3fc">ស្រី (Match)</text>
        <text x="380" y="160" font-family="sans-serif" font-size="11" fill="#cbd5e1">10B</text>
        <text x="480" y="160" font-family="sans-serif" font-size="11" fill="#cbd5e1">92</text>
        <text x="580" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#34d399">✔ រាប់ចូល</text>
        
        <rect x="12" y="169" width="696" height="23" fill="#075985" stroke="#38bdf8" stroke-width="0.7" />
        <text x="25" y="185" font-family="sans-serif" font-size="11" fill="#f8fafc">4</text>
        <text x="90" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">ជា សុភា</text>
        <text x="230" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#7dd3fc">ស្រី (Match)</text>
        <text x="380" y="185" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
        <text x="480" y="185" font-family="sans-serif" font-size="11" fill="#cbd5e1">74</text>
        <text x="580" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#34d399">✔ រាប់ចូល</text>
        
        <rect x="12" y="194" width="696" height="23" fill="#0f172a" />
        <text x="25" y="210" font-family="sans-serif" font-size="11" fill="#94a3b8">5</text>
        <text x="90" y="210" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">ហេង ពិសាល</text>
        <text x="230" y="210" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#94a3b8">ប្រុស</text>
        <text x="380" y="210" font-family="sans-serif" font-size="11" fill="#94a3b8">10B</text>
        <text x="480" y="210" font-family="sans-serif" font-size="11" fill="#94a3b8">48</text>
        <text x="580" y="210" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#64748b">✘ មិនរាប់</text>
        
        <rect x="12" y="219" width="696" height="23" fill="#075985" stroke="#38bdf8" stroke-width="0.7" />
        <text x="25" y="235" font-family="sans-serif" font-size="11" fill="#f8fafc">6</text>
        <text x="90" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">មាស រស្មី</text>
        <text x="230" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#7dd3fc">ស្រី (Match)</text>
        <text x="380" y="235" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
        <text x="480" y="235" font-family="sans-serif" font-size="11" fill="#cbd5e1">65</text>
        <text x="580" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#34d399">✔ រាប់ចូល</text>
        
        <!-- Footer -->
        <rect x="12" y="248" width="696" height="55" rx="6" fill="#1e293b" stroke="#334155" />
        <text x="25" y="270" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">💡 ទម្រង់វាក្យសម្ព័ន្ធ (Syntax)៖</text>
        <text x="200" y="270" font-family="monospace" font-size="11" font-weight="bold" fill="#f8fafc">=COUNTIF(range, criteria)</text>
        <text x="25" y="291" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#cbd5e1">📌 គោលការណ៍គរុកោសល្យ៖ រាប់ចំនួនក្រឡាក្នុង range ណាដែលត្រូវគ្នានឹងលក្ខខណ្ឌ criteria តែមួយគត់។</text>
      </g>
      
      <!-- Bottom Banner -->
      <g transform="translate(40, 395)">
        <rect width="720" height="38" rx="8" fill="#0369a1" stroke="#38bdf8" stroke-width="1" />
        <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">ប្រធានបទ៖</text>
        <text x="100" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="semibold" fill="#f8fafc">${cleanTopic}</text>
      </g>
    </svg>`;
    return {
      id: 'ill-' + Date.now(),
      url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      caption: `រូបភាពគំរូទម្រង់កម្មវិធី Excel និងរូបមន្ត =COUNTIF រាប់ទិន្នន័យតាមលក្ខខណ្ឌមួយ៖ ${cleanTopic}`,
      prompt,
      type: 'ai',
      aspectRatio: '16:9',
      showInStep3: true,
    };
  }

  // 4. SUMIF / SUMIFS
  if (t.includes('sumif') || t.includes('sumifs') || t.includes('sum-if')) {
    const isSumifs = t.includes('sumifs');
    const formulaStr = isSumifs
      ? '=SUMIFS(E2:E7, C2:C7, "ស្រី", D2:D7, "10A")'
      : '=SUMIF(C2:C7, "ស្រី", E2:E7)';
    const resultStr = isSumifs ? '🎯 ផលបូកពិន្ទុ (ស្រី & 10A) = ២២៤' : '🎯 ផលបូកពិន្ទុសិស្សស្រី = ៣១៦';
    const syntaxStr = isSumifs
      ? '=SUMIFS(sum_range, criteria_range1, criteria1, ...)'
      : '=SUMIF(range, criteria, [sum_range])';

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
      <defs>
        <linearGradient id="sifBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#312e81" />
          <stop offset="50%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#sifBg)" rx="16" />
      
      <g transform="translate(40, 24)">
        <rect width="360" height="32" rx="16" fill="#3730a3" stroke="#818cf8" stroke-width="1.5" />
        <circle cx="18" cy="16" r="6" fill="#818cf8" />
        <text x="32" y="21" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#e0e7ff">ចំណុចប្រទាក់តារាង Excel៖ រូបមន្ត =${isSumifs ? 'SUMIFS' : 'SUMIF'}</text>
      </g>
      
      <g transform="translate(40, 68)">
        <rect width="720" height="315" rx="10" fill="#0f172a" stroke="#818cf8" stroke-width="2" />
        <rect width="720" height="26" rx="10" fill="#1e293b" />
        <circle cx="16" cy="13" r="4" fill="#ef4444" />
        <circle cx="28" cy="13" r="4" fill="#f59e0b" />
        <circle cx="40" cy="13" r="4" fill="#10b981" />
        <text x="60" y="17" font-family="sans-serif" font-size="11" fill="#94a3b8">Microsoft Excel - [SumIF_Calculations.xlsx]</text>
        
        <rect x="12" y="32" width="696" height="30" rx="4" fill="#1e293b" stroke="#334155" />
        <text x="22" y="52" font-family="sans-serif" font-size="12" font-weight="bold" fill="#818cf8">fx</text>
        <line x1="42" y1="36" x2="42" y2="58" stroke="#475569" />
        <text x="52" y="52" font-family="monospace" font-size="12" font-weight="bold" fill="#f8fafc">${formulaStr}</text>
        <rect x="480" y="36" width="220" height="22" rx="4" fill="#312e81" stroke="#818cf8" />
        <text x="490" y="51" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#c7d2fe">${resultStr}</text>
        
        <rect x="12" y="68" width="696" height="24" fill="#4338ca" />
        <text x="25" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">A (ល.រ)</text>
        <text x="90" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">B (ឈ្មោះសិស្ស)</text>
        <text x="220" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">C (ភេទ: លក្ខខណ្ឌ)</text>
        <text x="360" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">D (ថ្នាក់)</text>
        <text x="460" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">E (ពិន្ទុ: Sum Range)</text>
        <text x="590" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">F (បូកសរុប)</text>
        
        <rect x="12" y="94" width="696" height="23" fill="#312e81" stroke="#6366f1" stroke-width="0.7" />
        <text x="25" y="110" font-family="sans-serif" font-size="11" fill="#f8fafc">1</text>
        <text x="90" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">សុខ ចិន្តា</text>
        <text x="230" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#a5b4fc">ស្រី</text>
        <text x="360" y="110" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
        <text x="470" y="110" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">85</text>
        <text x="590" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#34d399">+ 85 (បូកចូល)</text>
        
        <rect x="12" y="119" width="696" height="23" fill="#0f172a" />
        <text x="25" y="135" font-family="sans-serif" font-size="11" fill="#94a3b8">2</text>
        <text x="90" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">ចាន់ វិបុល</text>
        <text x="230" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#94a3b8">ប្រុស</text>
        <text x="360" y="135" font-family="sans-serif" font-size="11" fill="#94a3b8">10A</text>
        <text x="470" y="135" font-family="sans-serif" font-size="11" fill="#94a3b8">45</text>
        <text x="590" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#64748b">- មិនបូក</text>
        
        <rect x="12" y="144" width="696" height="23" fill="#312e81" stroke="#6366f1" stroke-width="0.7" />
        <text x="25" y="160" font-family="sans-serif" font-size="11" fill="#f8fafc">3</text>
        <text x="90" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">គង់ ធីតា</text>
        <text x="230" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#a5b4fc">ស្រី</text>
        <text x="360" y="160" font-family="sans-serif" font-size="11" fill="#cbd5e1">10B</text>
        <text x="470" y="160" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">92</text>
        <text x="590" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#34d399">${isSumifs ? '- ថ្នាក់ 10B មិនបូក' : '+ 92 (បូកចូល)'}</text>
        
        <rect x="12" y="169" width="696" height="23" fill="#312e81" stroke="#6366f1" stroke-width="0.7" />
        <text x="25" y="185" font-family="sans-serif" font-size="11" fill="#f8fafc">4</text>
        <text x="90" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">ជា សុភា</text>
        <text x="230" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#a5b4fc">ស្រី</text>
        <text x="360" y="185" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
        <text x="470" y="185" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">74</text>
        <text x="590" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#34d399">+ 74 (បូកចូល)</text>
        
        <rect x="12" y="194" width="696" height="23" fill="#0f172a" />
        <text x="25" y="210" font-family="sans-serif" font-size="11" fill="#94a3b8">5</text>
        <text x="90" y="210" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">ហេង ពិសាល</text>
        <text x="230" y="210" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#94a3b8">ប្រុស</text>
        <text x="360" y="210" font-family="sans-serif" font-size="11" fill="#94a3b8">10B</text>
        <text x="470" y="210" font-family="sans-serif" font-size="11" fill="#94a3b8">48</text>
        <text x="590" y="210" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#64748b">- មិនបូក</text>
        
        <rect x="12" y="219" width="696" height="23" fill="#312e81" stroke="#6366f1" stroke-width="0.7" />
        <text x="25" y="235" font-family="sans-serif" font-size="11" fill="#f8fafc">6</text>
        <text x="90" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">មាស រស្មី</text>
        <text x="230" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#a5b4fc">ស្រី</text>
        <text x="360" y="235" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
        <text x="470" y="235" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">65</text>
        <text x="590" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#34d399">+ 65 (បូកចូល)</text>
        
        <rect x="12" y="248" width="696" height="55" rx="6" fill="#1e293b" stroke="#334155" />
        <text x="25" y="270" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#818cf8">💡 ទម្រង់វាក្យសម្ព័ន្ធ (Syntax)៖</text>
        <text x="200" y="270" font-family="monospace" font-size="11" font-weight="bold" fill="#f8fafc">${syntaxStr}</text>
        <text x="25" y="291" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#cbd5e1">📌 គោលការណ៍គរុកោសល្យ៖ ធ្វើផលបូកតម្លៃក្នុង sum_range តែចំពោះក្រឡាណាដែលឆ្លើយតបត្រូវនឹងលក្ខខណ្ឌកំណត់។</text>
      </g>
      
      <g transform="translate(40, 395)">
        <rect width="720" height="38" rx="8" fill="#312e81" stroke="#818cf8" stroke-width="1" />
        <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#818cf8">ប្រធានបទ៖</text>
        <text x="100" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="semibold" fill="#f8fafc">${cleanTopic}</text>
      </g>
    </svg>`;
    return {
      id: 'ill-' + Date.now(),
      url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      caption: `រូបភាពគំរូទម្រង់កម្មវិធី Excel និងរូបមន្ត =${isSumifs ? 'SUMIFS' : 'SUMIF'} គណនាផលបូកតាមលក្ខខណ្ឌ៖ ${cleanTopic}`,
      prompt,
      type: 'ai',
      aspectRatio: '16:9',
      showInStep3: true,
    };
  }

  // 5. VLOOKUP / XLOOKUP
  if (t.includes('vlookup') || t.includes('xlookup')) {
    const isXlookup = t.includes('xlookup');
    const formulaStr = isXlookup ? '=XLOOKUP(G2, A2:A7, C2:C7)' : '=VLOOKUP(G2, A2:D7, 3, FALSE)';
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
      <defs>
        <linearGradient id="vBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4c1d95" />
          <stop offset="50%" stop-color="#2e1065" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#vBg)" rx="16" />
      
      <g transform="translate(40, 24)">
        <rect width="360" height="32" rx="16" fill="#581c87" stroke="#c084fc" stroke-width="1.5" />
        <circle cx="18" cy="16" r="6" fill="#c084fc" />
        <text x="32" y="21" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#f3e8ff">ចំណុចប្រទាក់តារាង Excel៖ រូបមន្ត =${isXlookup ? 'XLOOKUP' : 'VLOOKUP'}</text>
      </g>
      
      <g transform="translate(40, 68)">
        <rect width="720" height="315" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="2" />
        <rect width="720" height="26" rx="10" fill="#1e293b" />
        <circle cx="16" cy="13" r="4" fill="#ef4444" />
        <circle cx="28" cy="13" r="4" fill="#f59e0b" />
        <circle cx="40" cy="13" r="4" fill="#10b981" />
        <text x="60" y="17" font-family="sans-serif" font-size="11" fill="#94a3b8">Microsoft Excel - [Lookup_Database.xlsx]</text>
        
        <rect x="12" y="32" width="696" height="30" rx="4" fill="#1e293b" stroke="#334155" />
        <text x="22" y="52" font-family="sans-serif" font-size="12" font-weight="bold" fill="#c084fc">fx</text>
        <line x1="42" y1="36" x2="42" y2="58" stroke="#475569" />
        <text x="52" y="52" font-family="monospace" font-size="12" font-weight="bold" fill="#f8fafc">${formulaStr}</text>
        <rect x="490" y="36" width="210" height="22" rx="4" fill="#581c87" stroke="#c084fc" />
        <text x="500" y="51" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#f3e8ff">🎯 តម្លៃស្វែងរកឃើញ = "គង់ ធីតា"</text>
        
        <rect x="12" y="68" width="696" height="24" fill="#7e22ce" />
        <text x="25" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">A (កូដសិស្ស)</text>
        <text x="140" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">B (ថ្នាក់)</text>
        <text x="250" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">C (ឈ្មោះសិស្ស - ជួរឈរ ៣)</text>
        <text x="420" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">D (ពិន្ទុ)</text>
        <text x="530" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">ផ្ទាំងស្វែងរក (Lookup Cell G2)</text>
        
        <rect x="12" y="94" width="696" height="23" fill="#1e293b" />
        <text x="25" y="110" font-family="monospace" font-size="11" fill="#f8fafc">ID-101</text>
        <text x="140" y="110" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
        <text x="250" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">សុខ ចិន្តា</text>
        <text x="420" y="110" font-family="sans-serif" font-size="11" fill="#cbd5e1">85</text>
        <text x="530" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#94a3b8">កូដចង់រក៖ ID-103</text>
        
        <rect x="12" y="119" width="696" height="23" fill="#0f172a" />
        <text x="25" y="135" font-family="monospace" font-size="11" fill="#cbd5e1">ID-102</text>
        <text x="140" y="135" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
        <text x="250" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">ចាន់ វិបុល</text>
        <text x="420" y="135" font-family="sans-serif" font-size="11" fill="#cbd5e1">45</text>
        
        <rect x="12" y="144" width="696" height="23" fill="#581c87" stroke="#c084fc" stroke-width="1.2" />
        <text x="25" y="160" font-family="monospace" font-size="11" font-weight="bold" fill="#facc15">ID-103 (Match!)</text>
        <text x="140" y="160" font-family="sans-serif" font-size="11" fill="#f8fafc">10B</text>
        <rect x="245" y="146" width="130" height="19" rx="3" fill="#7e22ce" />
        <text x="255" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#f8fafc">គង់ ធីតា (Return)</text>
        <text x="420" y="160" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">92</text>
        <text x="530" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#34d399">➔ រកឃើញផ្គូផ្គងជោគជ័យ</text>
        
        <rect x="12" y="169" width="696" height="23" fill="#1e293b" />
        <text x="25" y="185" font-family="monospace" font-size="11" fill="#cbd5e1">ID-104</text>
        <text x="140" y="185" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
        <text x="250" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">ជា សុភា</text>
        <text x="420" y="185" font-family="sans-serif" font-size="11" fill="#cbd5e1">74</text>
        
        <rect x="12" y="194" width="696" height="23" fill="#0f172a" />
        <text x="25" y="210" font-family="monospace" font-size="11" fill="#cbd5e1">ID-105</text>
        <text x="140" y="210" font-family="sans-serif" font-size="11" fill="#cbd5e1">10B</text>
        <text x="250" y="210" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">ហេង ពិសាល</text>
        <text x="420" y="210" font-family="sans-serif" font-size="11" fill="#cbd5e1">48</text>
        
        <rect x="12" y="219" width="696" height="23" fill="#1e293b" />
        <text x="25" y="235" font-family="monospace" font-size="11" fill="#cbd5e1">ID-106</text>
        <text x="140" y="235" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
        <text x="250" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">មាស រស្មី</text>
        <text x="420" y="235" font-family="sans-serif" font-size="11" fill="#cbd5e1">65</text>
        
        <rect x="12" y="248" width="696" height="55" rx="6" fill="#1e293b" stroke="#334155" />
        <text x="25" y="270" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#c084fc">💡 ទម្រង់វាក្យសម្ព័ន្ធ (Syntax)៖</text>
        <text x="200" y="270" font-family="monospace" font-size="11" font-weight="bold" fill="#f8fafc">${isXlookup ? '=XLOOKUP(lookup_value, lookup_array, return_array)' : '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])'}</text>
        <text x="25" y="291" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#cbd5e1">📌 គោលការណ៍គរុកោសល្យ៖ ស្វែងរកតម្លៃ lookup_value ក្នុងជួរឈរទី ១ នៃតារាង រួចទាញយកទិន្នន័យពីជួរឈរកំណត់មកបង្ហាញ។</text>
      </g>
      
      <g transform="translate(40, 395)">
        <rect width="720" height="38" rx="8" fill="#4c1d95" stroke="#a855f7" stroke-width="1" />
        <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#c084fc">ប្រធានបទ៖</text>
        <text x="100" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="semibold" fill="#f8fafc">${cleanTopic}</text>
      </g>
    </svg>`;
    return {
      id: 'ill-' + Date.now(),
      url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      caption: `រូបភាពគំរូទម្រង់កម្មវិធី Excel និងរូបមន្ត =${isXlookup ? 'XLOOKUP' : 'VLOOKUP'} ស្វែងរកទិន្នន័យ៖ ${cleanTopic}`,
      prompt,
      type: 'ai',
      aspectRatio: '16:9',
      showInStep3: true,
    };
  }

  // 6. Generic / Default Excel / Coding fallback
  const customFormulaMatch = cleanTopic.match(/\b([A-Z]{2,15})\b/);
  const detectedFormula = customFormulaMatch ? customFormulaMatch[1] : 'IF';
  const formulaBarCode = detectedFormula === 'IF'
    ? '=IF(AVERAGE(C2:E2)>=50, "ជាប់", "ធ្លាក់")'
    : `=${detectedFormula}(C2:E2)`;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
    <defs>
      <linearGradient id="ictGenBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#022c22" />
        <stop offset="50%" stop-color="#064e3b" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(#ictGenBg)" rx="16" />
    
    <g transform="translate(40, 24)">
      <rect width="360" height="32" rx="16" fill="#065f46" stroke="#34d399" stroke-width="1.5" />
      <circle cx="18" cy="16" r="6" fill="#34d399" />
      <text x="32" y="21" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">ចំណុចប្រទាក់តារាង Excel៖ រូបមន្ត =${detectedFormula}</text>
    </g>
    
    <g transform="translate(40, 68)">
      <rect width="720" height="315" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="2" />
      <rect width="720" height="26" rx="10" fill="#1e293b" />
      <circle cx="16" cy="13" r="4" fill="#ef4444" />
      <circle cx="28" cy="13" r="4" fill="#f59e0b" />
      <circle cx="40" cy="13" r="4" fill="#10b981" />
      <text x="60" y="17" font-family="sans-serif" font-size="11" fill="#94a3b8">Microsoft Excel - [DataAnalysis.xlsx]</text>
      
      <rect x="12" y="32" width="696" height="30" rx="4" fill="#1e293b" stroke="#334155" />
      <text x="22" y="52" font-family="sans-serif" font-size="12" font-weight="bold" fill="#10b981">fx</text>
      <line x1="42" y1="36" x2="42" y2="58" stroke="#475569" />
      <text x="52" y="52" font-family="monospace" font-size="12" font-weight="bold" fill="#f8fafc">${formulaBarCode}</text>
      
      <rect x="12" y="68" width="696" height="24" fill="#047857" />
      <text x="25" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">A (ឈ្មោះសិស្ស)</text>
      <text x="160" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">B (ថ្នាក់)</text>
      <text x="270" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">C (ពិន្ទុ ១)</text>
      <text x="390" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">D (ពិន្ទុ ២)</text>
      <text x="510" y="84" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">E (អនុវត្ត =${detectedFormula})</text>
      
      <rect x="12" y="94" width="696" height="23" fill="#1e293b" />
      <text x="25" y="110" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">សុខ ចិន្តា</text>
      <text x="160" y="110" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
      <text x="270" y="110" font-family="sans-serif" font-size="11" fill="#cbd5e1">85</text>
      <text x="390" y="110" font-family="sans-serif" font-size="11" fill="#cbd5e1">78</text>
      <text x="510" y="110" font-family="sans-serif" font-size="11" font-weight="bold" fill="#34d399">163</text>
      
      <rect x="12" y="119" width="696" height="23" fill="#0f172a" />
      <text x="25" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">ចាន់ វិបុល</text>
      <text x="160" y="135" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
      <text x="270" y="135" font-family="sans-serif" font-size="11" fill="#cbd5e1">45</text>
      <text x="390" y="135" font-family="sans-serif" font-size="11" fill="#cbd5e1">40</text>
      <text x="510" y="135" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">85</text>
      
      <rect x="12" y="144" width="696" height="23" fill="#1e293b" />
      <text x="25" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">គង់ ធីតា</text>
      <text x="160" y="160" font-family="sans-serif" font-size="11" fill="#cbd5e1">10B</text>
      <text x="270" y="160" font-family="sans-serif" font-size="11" fill="#cbd5e1">92</text>
      <text x="390" y="160" font-family="sans-serif" font-size="11" fill="#cbd5e1">88</text>
      <text x="510" y="160" font-family="sans-serif" font-size="11" font-weight="bold" fill="#34d399">180</text>
      
      <rect x="12" y="169" width="696" height="23" fill="#0f172a" />
      <text x="25" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#f8fafc">ជា សុភា</text>
      <text x="160" y="185" font-family="sans-serif" font-size="11" fill="#cbd5e1">10A</text>
      <text x="270" y="185" font-family="sans-serif" font-size="11" fill="#cbd5e1">74</text>
      <text x="390" y="185" font-family="sans-serif" font-size="11" fill="#cbd5e1">70</text>
      <text x="510" y="185" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">144</text>
      
      <rect x="12" y="248" width="696" height="55" rx="6" fill="#1e293b" stroke="#334155" />
      <text x="25" y="270" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#34d399">💡 ទម្រង់វាក្យសម្ព័ន្ធ និងរូបមន្តគន្លឹះ៖</text>
      <text x="250" y="270" font-family="monospace" font-size="11" font-weight="bold" fill="#f8fafc">${formulaBarCode}</text>
      <text x="25" y="291" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#cbd5e1">📌 គោលការណ៍គរុកោសល្យ៖ អនុវត្តរូបមន្ត ${detectedFormula} លើទិន្នន័យជាក់ស្ដែងតាមជួរឈរ និងជួរដេកក្នុង Excel។</text>
    </g>
    
    <g transform="translate(40, 395)">
      <rect width="720" height="38" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="1" />
      <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#34d399">ប្រធានបទ៖</text>
      <text x="100" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="semibold" fill="#f8fafc">${cleanTopic}</text>
    </g>
  </svg>`;

  return {
    id: 'ill-' + Date.now(),
    url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    caption: `រូបភាពគំរូទម្រង់កម្មវិធី Excel និងរូបមន្ត =${detectedFormula}៖ ${cleanTopic}`,
    prompt,
    type: 'ai',
    aspectRatio: '16:9',
    showInStep3: true,
  };
}
