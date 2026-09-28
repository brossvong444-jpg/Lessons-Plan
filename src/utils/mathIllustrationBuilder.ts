import { LessonIllustration } from '../types/lessonPlan';

export function buildMathIllustration(cleanTopic: string, prompt: string): LessonIllustration {
  const t = cleanTopic.toLowerCase();

  // 1. Pythagoras Theorem
  if (t.includes('ពីតាគ័រ') || t.includes('pythagor') || t.includes('ត្រីកោណកែង') || t.includes('អ៊ីប៉ូតេនុស')) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
      <defs>
        <linearGradient id="mBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="50%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#mBg)" rx="16" />
      
      <!-- Header Badge -->
      <g transform="translate(40, 25)">
        <rect width="360" height="32" rx="16" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.5" />
        <circle cx="18" cy="16" r="6" fill="#818cf8" />
        <text x="32" y="21" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">ធរណីមាត្រ៖ ទ្រឹស្ដីបទពីតាគ័រ (Pythagoras Theorem)</text>
      </g>
      
      <!-- Right Triangle Diagram (Left) -->
      <g transform="translate(60, 80)">
        <rect width="360" height="295" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <text x="20" y="30" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">ត្រីកោណកែង ABC កែងត្រង់ A</text>
        
        <!-- Triangle Shape: A(70, 230), B(70, 70), C(290, 230) -->
        <!-- a = AC = 220 (base b), c = AB = 160 (height a), b = BC = ? (hypotenuse c) -->
        <polygon points="70,230 70,70 290,230" fill="#1e1b4b" stroke="#60a5fa" stroke-width="3.5" />
        
        <!-- Right angle square at A -->
        <rect x="70" y="210" width="20" height="20" fill="none" stroke="#f59e0b" stroke-width="2" />
        <circle cx="80" cy="220" r="2.5" fill="#f59e0b" />
        
        <!-- Vertices -->
        <circle cx="70" cy="230" r="5" fill="#ef4444" />
        <text x="48" y="245" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">A</text>
        
        <circle cx="70" cy="70" r="5" fill="#ef4444" />
        <text x="48" y="70" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">B</text>
        
        <circle cx="290" cy="230" r="5" fill="#ef4444" />
        <text x="300" y="245" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">C</text>
        
        <!-- Side labels -->
        <!-- Side AB (a) -->
        <text x="30" y="155" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f87171">c = 3</text>
        <!-- Side AC (b) -->
        <text x="170" y="255" font-family="sans-serif" font-size="13" font-weight="bold" fill="#34d399">b = 4</text>
        <!-- Hypotenuse BC (a) -->
        <text x="195" y="140" font-family="sans-serif" font-size="14" font-weight="bold" fill="#fbbf24">a = 5 (អ៊ីប៉ូតេនុស)</text>
      </g>
      
      <!-- Formula & Calculation Card (Right) -->
      <g transform="translate(440, 80)">
        <rect width="320" height="295" rx="12" fill="#1e293b" stroke="#6366f1" stroke-width="1.5" />
        <rect width="320" height="32" rx="12" fill="#4338ca" />
        <rect x="0" y="20" width="320" height="12" fill="#4338ca" />
        <text x="15" y="22" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#ffffff">📐 រូបមន្តស្នូល និងការគណនា</text>
        
        <text x="20" y="62" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#818cf8">១. ទ្រឹស្ដីបទ (Theorem)៖</text>
        <rect x="20" y="72" width="280" height="40" rx="8" fill="#0f172a" stroke="#818cf8" stroke-width="1" />
        <text x="65" y="98" font-family="sans-serif" font-size="18" font-weight="bold" fill="#38bdf8">BC² = AB² + AC²</text>
        
        <text x="20" y="138" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#818cf8">២. ឧទាហរណ៍គំរូជាក់ស្ដែង៖</text>
        <text x="30" y="162" font-family="sans-serif" font-size="13" fill="#cbd5e1">• a² = b² + c²</text>
        <text x="30" y="186" font-family="sans-serif" font-size="13" fill="#cbd5e1">• 5² = 4² + 3²</text>
        <text x="30" y="210" font-family="sans-serif" font-size="14" font-weight="bold" fill="#34d399">• 25 = 16 + 9 (ពិត!)</text>
        
        <rect x="20" y="228" width="280" height="50" rx="6" fill="#312e81" stroke="#6366f1" />
        <text x="30" y="248" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#facc15">💡 ច្បាប់គន្លឹះ៖</text>
        <text x="30" y="266" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#e0e7ff">ការ៉េនៃអ៊ីប៉ូតេនុស = ផលបូកការ៉េនៃជ្រុងជាប់មុំកែងទាំងពីរ</text>
      </g>
      
      <!-- Bottom Banner -->
      <g transform="translate(40, 395)">
        <rect width="720" height="38" rx="8" fill="#1e1b4b" stroke="#818cf8" stroke-width="1" />
        <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#818cf8">ប្រធានបទ៖</text>
        <text x="100" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="semibold" fill="#f8fafc">${cleanTopic}</text>
      </g>
    </svg>`;
    return {
      id: 'ill-' + Date.now(),
      url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      caption: `រូបភាពគំរូទ្រឹស្ដីបទពីតាគ័រលើត្រីកោណកែង៖ ${cleanTopic}`,
      prompt,
      type: 'ai',
      aspectRatio: '16:9',
      showInStep3: true,
    };
  }

  // 2. Parabola / Quadratic Equation
  const isQuadratic = t.includes('ដឺក្រេ') || t.includes('ឌីសគ្រី') || t.includes('សមីការ');
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="50%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
      <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="50%" stop-color="#60a5fa" />
        <stop offset="100%" stop-color="#818cf8" />
      </linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(#bgGrad)" rx="16" />
    
    <g transform="translate(40, 25)">
      <rect width="280" height="32" rx="16" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
      <circle cx="18" cy="16" r="6" fill="#38bdf8" />
      <text x="32" y="21" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">គំនូសបំព្រួញគរុកោសល្យ៖ គណិតវិទ្យា</text>
    </g>
    
    <!-- Axes -->
    <line x1="80" y1="240" x2="480" y2="240" stroke="#94a3b8" stroke-width="2.5" />
    <polygon points="485,240 475,235 475,245" fill="#94a3b8" />
    <text x="492" y="245" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">x</text>
    
    <line x1="280" y1="360" x2="280" y2="70" stroke="#94a3b8" stroke-width="2.5" />
    <polygon points="280,65 275,75 285,75" fill="#94a3b8" />
    <text x="288" y="75" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">y</text>
    <text x="265" y="255" font-family="sans-serif" font-size="12" fill="#cbd5e1">O</text>

    ${isQuadratic ? `
    <!-- Parabola Curve y = ax^2 + bx + c -->
    <path d="M 120 90 Q 280 340 440 90" fill="none" stroke="url(#curveGrad)" stroke-width="4.5" stroke-linecap="round" />
    <circle cx="180" cy="240" r="5" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
    <text x="170" y="265" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#fca5a5">ឫស x₁</text>
    <circle cx="380" cy="240" r="5" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
    <text x="370" y="265" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#fca5a5">ឫស x₂</text>
    <circle cx="280" cy="215" r="4.5" fill="#10b981" stroke="#ffffff" stroke-width="1.5" />
    <text x="290" y="210" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#6ee7b7">កំពូល S</text>
    ` : `
    <line x1="100" y1="320" x2="460" y2="100" stroke="url(#curveGrad)" stroke-width="4" stroke-linecap="round" />
    <circle cx="280" cy="210" r="5" fill="#ef4444" stroke="#ffffff" stroke-width="2" />
    `}
    
    <!-- Info Card Right -->
    <g transform="translate(510, 80)">
      <rect width="250" height="295" rx="12" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
      <rect width="250" height="28" rx="12" fill="#2563eb" />
      <rect x="0" y="16" width="250" height="12" fill="#2563eb" />
      <text x="12" y="20" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#ffffff">📊 រូបមន្តស្នូល និងលក្ខខណ្ឌ</text>
      <text x="15" y="60" font-family="sans-serif" font-size="16" font-weight="bold" fill="#38bdf8">ax² + bx + c = 0</text>
      <text x="15" y="90" font-family="sans-serif" font-size="15" font-weight="bold" fill="#fbbf24">Δ = b² - 4ac</text>
      <text x="15" y="125" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">• Δ &gt; 0 ៖ មានឫសពីរផ្សេងគ្នា</text>
      <text x="15" y="150" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">• Δ = 0 ៖ ឫសឌុប x = -b/2a</text>
      <text x="15" y="175" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#cbd5e1">• Δ &lt; 0 ៖ គ្មានឫសក្នុង ℝ</text>
      <rect x="15" y="200" width="220" height="75" rx="6" fill="#0f172a" stroke="#334155" />
      <text x="25" y="225" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#38bdf8">💡 រូបមន្តឫស៖</text>
      <text x="25" y="250" font-family="sans-serif" font-size="12" fill="#f8fafc">x = (-b ± √Δ) / 2a</text>
    </g>
    
    <g transform="translate(40, 395)">
      <rect width="720" height="38" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
      <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">ប្រធានបទ៖</text>
      <text x="100" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="semibold" fill="#f8fafc">${cleanTopic}</text>
    </g>
  </svg>`;

  return {
    id: 'ill-' + Date.now(),
    url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    caption: `ដ្យាក្រាមក្រាហ្វ និងរូបមន្តគណិតវិទ្យា៖ ${cleanTopic}`,
    prompt,
    type: 'ai',
    aspectRatio: '16:9',
    showInStep3: true,
  };
}
