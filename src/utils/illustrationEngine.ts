import { LessonIllustration } from '../types/lessonPlan';
import { buildExcelIllustration } from './excelIllustrationBuilder';
import { buildMathIllustration } from './mathIllustrationBuilder';

// Generates an educational AI prompt tailored to the topic and subject
export function buildIllustrationPrompt(topic: string, subject: string = 'គណិតវិទ្យា', grade: string = 'ថ្នាក់ទី ៩'): string {
  const cleanTopic = topic.trim();
  const s = subject.toLowerCase();

  if (s.includes('គណិត') || s.includes('math')) {
    return `Clean educational textbook illustration for a mathematics lesson on "${cleanTopic}", featuring precise geometric diagrams, Cartesian coordinate graph showing equations, mathematical formulas, minimalist blue and white aesthetic, high school classroom visual aid, clear typography.`;
  }
  if (s.includes('រូប') || s.includes('physic')) {
    return `Educational science infographic and schematic diagram for physics lesson on "${cleanTopic}", showing laboratory apparatus, electrical circuit components, vector arrows, clear measurement gauges, scientific aesthetic, modern textbook illustration.`;
  }
  if (s.includes('គីមី') || s.includes('chem')) {
    return `Educational chemistry laboratory illustration for lesson on "${cleanTopic}", showing glassware, volumetric flask, beaker with colored solution, molecular structure symbols, precise scientific measurement, clean infographic style.`;
  }
  if (s.includes('ខ្មែរ') || s.includes('khmer')) {
    return `Educational graphic illustration representing Khmer literature study of "${cleanTopic}", showing an elegant study desk with classical manuscripts, open notebook outlining essay structure, ink quill, Cambodian cultural educational aesthetic, warm golden lighting.`;
  }
  if (s.includes('ict') || s.includes('កុំព្យូទ័រ') || s.includes('បច្ចេកវិទ្យា')) {
    return `Modern high-tech educational illustration for computer science and ICT lesson on "${cleanTopic}", clean spreadsheet software interface with data tables, formulas, interactive dashboard charts, sleek digital UI design.`;
  }
  if (s.includes('ជីវ') || s.includes('bio')) {
    return `Detailed biological science infographic diagram for lesson on "${cleanTopic}", showing cellular or botanical structures, labeled biological processes, natural green and teal colors, educational textbook illustration.`;
  }

  return `Clean, elegant educational textbook illustration for a classroom lesson on "${cleanTopic}", showing pedagogical concept diagram, educational symbols, inspiring learning atmosphere, clear visual structure.`;
}

// Generate topic-tailored educational SVG illustration data URI
export function generateTopicIllustration(topic: string, subject: string = 'គណិតវិទ្យា', grade: string = 'ថ្នាក់ទី ៩'): LessonIllustration {
  const t = topic.toLowerCase();
  const s = subject.toLowerCase();
  const cleanTopic = topic.trim();
  const prompt = buildIllustrationPrompt(topic, subject, grade);

  // 0. ICT / Excel / Spreadsheet / Computer Science / Technology
  if (
    s.includes('ict') ||
    s.includes('កុំព្យូទ័រ') ||
    s.includes('បច្ចេកវិទ្យា') ||
    t.includes('excel') ||
    t.includes('spreadsheet') ||
    t.includes('countifs') ||
    t.includes('countblank') ||
    t.includes('countif') ||
    t.includes('sumif') ||
    t.includes('sumifs') ||
    t.includes('vlookup') ||
    t.includes('xlookup') ||
    t.includes('averageif') ||
    t.includes('រូបមន្ត') ||
    t.includes('coding') ||
    t.includes('កូដ') ||
    t.includes('តារាង')
  ) {
    return buildExcelIllustration(cleanTopic, prompt);
  }

  // 1. Math: Pythagoras / Geometry / Quadratic / Equation
  if (
    s.includes('គណិត') ||
    t.includes('សមីការ') ||
    t.includes('ឌីសគ្រី') ||
    t.includes('ធរណី') ||
    t.includes('ប្រមាណ') ||
    t.includes('ពីតាគ័រ') ||
    t.includes('pythagor') ||
    t.includes('ត្រីកោណ')
  ) {
    return buildMathIllustration(cleanTopic, prompt);
  }

  // 2. Physics: Ohm's Law / Electric Circuit / Force / Energy
  if (s.includes('រូប') || t.includes('អគ្គិសនី') || t.includes('ចរន្ត') || t.includes('អូម') || t.includes('កម្លាំង') || t.includes('ញូតុន')) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
      <defs>
        <linearGradient id="pBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#091e3a" />
          <stop offset="100%" stop-color="#111827" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#pBg)" rx="16" />
      
      <!-- Header Badge -->
      <g transform="translate(40, 35)">
        <rect width="250" height="34" rx="17" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
        <circle cx="20" cy="17" r="7" fill="#38bdf8" />
        <text x="36" y="22" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#f8fafc">ដ្យាក្រាមសៀគ្វីអគ្គិសនី៖ រូបវិទ្យា</text>
      </g>
      
      <!-- Circuit Wires -->
      <rect x="140" y="110" width="520" height="230" fill="none" stroke="#38bdf8" stroke-width="3.5" rx="10" />
      
      <!-- Battery DC (Left) -->
      <g transform="translate(140, 225)">
        <line x1="0" y1="-25" x2="0" y2="25" stroke="#091e3a" stroke-width="10" />
        <line x1="-18" y1="-20" x2="18" y2="-20" stroke="#f59e0b" stroke-width="4.5" />
        <line x1="-10" y1="-7" x2="10" y2="-7" stroke="#94a3b8" stroke-width="3" />
        <line x1="-18" y1="6" x2="18" y2="6" stroke="#f59e0b" stroke-width="4.5" />
        <line x1="-10" y1="19" x2="10" y2="19" stroke="#94a3b8" stroke-width="3" />
        <text x="-45" y="-12" font-family="sans-serif" font-size="16" font-weight="bold" fill="#f59e0b">+</text>
        <text x="-43" y="24" font-family="sans-serif" font-size="18" font-weight="bold" fill="#94a3b8">-</text>
        <text x="-80" y="5" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">ប្រភព U</text>
      </g>
      
      <!-- Switch (Top Left) -->
      <g transform="translate(280, 110)">
        <circle cx="-25" cy="0" r="5" fill="#f8fafc" />
        <circle cx="25" cy="0" r="5" fill="#f8fafc" />
        <line x1="-25" y1="0" x2="20" y2="-18" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" />
        <text x="-15" y="-25" font-family="'Kantumruy Pro', sans-serif" font-size="12" fill="#fca5a5">កុងតាក់ K</text>
      </g>
      
      <!-- Ammeter (Top Right) -->
      <g transform="translate(520, 110)">
        <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#10b981" stroke-width="2.5" />
        <text x="-7" y="7" font-family="sans-serif" font-size="18" font-weight="bold" fill="#10b981">A</text>
        <text x="-35" y="-28" font-family="'Kantumruy Pro', sans-serif" font-size="12" fill="#6ee7b7">អំពែម៉ែត្រ (វាស់ I)</text>
      </g>
      
      <!-- Resistor (Right) -->
      <g transform="translate(660, 225)">
        <rect x="-15" y="-40" width="30" height="80" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5" />
        <!-- Color bands -->
        <rect x="-13" y="-25" width="26" height="5" fill="#ef4444" />
        <rect x="-13" y="-10" width="26" height="5" fill="#3b82f6" />
        <rect x="-13" y="5" width="26" height="5" fill="#10b981" />
        <rect x="-13" y="20" width="26" height="5" fill="#eab308" />
        <text x="25" y="5" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#fbbf24">រេស៊ីស្តង់ R</text>
      </g>

      <!-- Current Flow Arrows -->
      <polygon points="400,105 412,110 400,115" fill="#fbbf24" />
      <text x="390" y="95" font-family="sans-serif" font-size="14" font-weight="bold" fill="#fbbf24">ចរន្ត I →</text>
      
      <!-- Formula Banner Bottom -->
      <g transform="translate(180, 260)">
        <rect width="300" height="65" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
        <text x="15" y="26" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#ffffff">ច្បាប់អូម៖ <tspan font-family="sans-serif" fill="#fbbf24">U = R × I</tspan></text>
        <text x="15" y="48" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#94a3b8">I = U / R  |  R = U / I  (ខ្នាត SI: V, A, Ω)</text>
      </g>
      
      <!-- Bottom Topic Banner -->
      <g transform="translate(40, 395)">
        <rect width="720" height="38" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
        <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">ប្រធានបទ៖</text>
        <text x="100" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="semibold" fill="#f8fafc">${cleanTopic}</text>
      </g>
    </svg>`;
    return {
      id: 'ill-' + Date.now(),
      url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      caption: `ដ្យាក្រាមសៀគ្វីអគ្គិសនី និងរូបមន្តច្បាប់អូម៖ ${cleanTopic}`,
      prompt,
      type: 'ai',
      aspectRatio: '16:9',
      showInStep3: true,
    };
  }

  // 3. Chemistry: Lab Glassware / Solutions / Chemical Reaction
  if (s.includes('គីមី') || t.includes('សូលុយស្យុង') || t.includes('អាស៊ីត') || t.includes('ម៉ូល') || t.includes('កំហាប់')) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
      <defs>
        <linearGradient id="cBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#042f2e" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#0f766e" stop-opacity="0.95" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#cBg)" rx="16" />
      
      <!-- Header Badge -->
      <g transform="translate(40, 35)">
        <rect width="260" height="34" rx="17" fill="#134e4a" stroke="#2dd4bf" stroke-width="1.5" />
        <circle cx="20" cy="17" r="7" fill="#2dd4bf" />
        <text x="36" y="22" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#f8fafc">គំនូសបំព្រួញពិសោធន៍៖ គីមីវិទ្យា</text>
      </g>
      
      <!-- Volumetric Flask (Left) -->
      <g transform="translate(220, 250)">
        <!-- Flask Body -->
        <path d="M -15 -140 L -15 -50 L -70 70 A 10 10 0 0 0 -60 85 L 60 85 A 10 10 0 0 0 70 70 L 15 -50 L 15 -140 Z" fill="#0f172a" stroke="#5eead4" stroke-width="3" />
        <!-- Liquid in Flask -->
        <path d="M -45 25 L 45 25 L 58 75 L -58 75 Z" fill="url(#liquidGrad)" />
        <line x1="-15" y1="-80" x2="15" y2="-80" stroke="#f43f5e" stroke-width="2" stroke-dasharray="3,3" />
        <text x="25" y="-76" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#fda4af">គំនូសចំណុះ V</text>
        <text x="-50" y="115" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#ccfbf1">បាឡុងចំណុះ (Volumetric Flask)</text>
      </g>
      
      <!-- Beaker (Center Right) -->
      <g transform="translate(430, 250)">
        <path d="M -50 -70 L -50 80 A 8 8 0 0 0 -42 88 L 42 88 A 8 8 0 0 0 50 80 L 50 -70" fill="#0f172a" stroke="#38bdf8" stroke-width="3" />
        <path d="M -47 0 L 47 0 L 44 80 L -44 80 Z" fill="#0284c7" opacity="0.6" />
        <!-- Graduations -->
        <line x1="-50" y1="40" x2="-35" y2="40" stroke="#bae6fd" stroke-width="1.5" />
        <line x1="-50" y1="0" x2="-30" y2="0" stroke="#bae6fd" stroke-width="1.5" />
        <line x1="-50" y1="-40" x2="-35" y2="-40" stroke="#bae6fd" stroke-width="1.5" />
        <text x="-25" y="115" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#bae6fd">ប៊ីស៊ែ (Beaker)</text>
      </g>
      
      <!-- Formulas Card (Right) -->
      <g transform="translate(540, 100)">
        <rect width="220" height="200" rx="12" fill="#134e4a" stroke="#2dd4bf" stroke-width="1.5" opacity="0.95" />
        <rect width="220" height="30" rx="12" fill="#0f766e" />
        <rect x="0" y="18" width="220" height="12" fill="#0f766e" />
        <text x="12" y="21" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#ffffff">🧪 រូបមន្តគណនាគីមី</text>
        
        <text x="15" y="58" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#5eead4">១. ចំនួនម៉ូល (Mole)៖</text>
        <text x="25" y="80" font-family="sans-serif" font-size="16" font-weight="bold" fill="#fbbf24">n = m / M</text>
        
        <text x="15" y="115" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#5eead4">២. កំហាប់ជាម៉ូល (Molarity)៖</text>
        <text x="25" y="138" font-family="sans-serif" font-size="16" font-weight="bold" fill="#38bdf8">C = n / V</text>
        
        <text x="15" y="170" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#ccfbf1">• m (g), M (g/mol), V (L)</text>
        <text x="15" y="188" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#ccfbf1">• C គិតជា mol/L ឬ M</text>
      </g>
      
      <!-- Bottom Topic Banner -->
      <g transform="translate(40, 395)">
        <rect width="720" height="38" rx="8" fill="#134e4a" stroke="#2dd4bf" stroke-width="1" />
        <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#5eead4">ប្រធានបទ៖</text>
        <text x="100" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="semibold" fill="#f8fafc">${cleanTopic}</text>
      </g>
    </svg>`;
    return {
      id: 'ill-' + Date.now(),
      url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      caption: `រូបភាពឧបទេសពិសោធន៍ និងរូបមន្តគីមី៖ ${cleanTopic}`,
      prompt,
      type: 'ai',
      aspectRatio: '16:9',
      showInStep3: true,
    };
  }

  // 4. Khmer Literature: Essay writing / Structure
  if (s.includes('ខ្មែរ') || t.includes('តែងសេចក្ដី') || t.includes('អក្សរសិល្ប៍')) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
      <defs>
        <linearGradient id="kBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#31102b" />
          <stop offset="50%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#kBg)" rx="16" />
      
      <!-- Header Badge -->
      <g transform="translate(40, 35)">
        <rect width="280" height="34" rx="17" fill="#4c1d95" stroke="#c084fc" stroke-width="1.5" />
        <circle cx="20" cy="17" r="7" fill="#c084fc" />
        <text x="36" y="22" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#f8fafc">រចនាសម្ព័ន្ធតែងសេចក្ដី៖ ភាសាខ្មែរ</text>
      </g>
      
      <!-- 3-Block Essay Flowchart -->
      <!-- Step 1: Introduction -->
      <g transform="translate(60, 110)">
        <rect width="200" height="220" rx="12" fill="#1e1b4b" stroke="#a855f7" stroke-width="2" />
        <rect width="200" height="36" rx="12" fill="#7e22ce" />
        <rect x="0" y="24" width="200" height="12" fill="#7e22ce" />
        <text x="25" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#ffffff">១. សេចក្ដីផ្ដើម</text>
        <text x="15" y="65" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#e9d5ff">• លំនាំបញ្ហា (បរិបទ)</text>
        <text x="15" y="95" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#e9d5ff">• ចំណូលបញ្ហា (លើកប្រធាន)</text>
        <text x="15" y="125" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#e9d5ff">• ចំណោទបញ្ហា (សំណួរគន្លឹះ)</text>
        <rect x="15" y="155" width="170" height="45" rx="6" fill="#4c1d95" opacity="0.6" />
        <text x="25" y="180" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#f3e8ff">💡 ត្រួសត្រាយផ្លូវខ្លី ខ្លឹម ផ្ដោតចំ</text>
      </g>
      
      <!-- Arrow 1 -> 2 -->
      <polygon points="275,220 290,215 275,210" fill="#c084fc" />
      <line x1="260" y1="215" x2="285" y2="215" stroke="#c084fc" stroke-width="2.5" />
      
      <!-- Step 2: Body -->
      <g transform="translate(300, 100)">
        <rect width="220" height="240" rx="12" fill="#1e1b4b" stroke="#ec4899" stroke-width="2.5" />
        <rect width="220" height="36" rx="12" fill="#be185d" />
        <rect x="0" y="24" width="220" height="12" fill="#be185d" />
        <text x="35" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#ffffff">២. តួសេចក្ដី (ស្នូល)</text>
        <text x="15" y="65" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#fbcfe8">• ឃ្លាភ្ជាប់សេចក្ដី</text>
        <text x="15" y="95" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#fbcfe8">• ពន្យល់ពាក្យគន្លឹះ និងន័យរួម</text>
        <text x="15" y="125" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#fbcfe8">• បកស្រាយគំនិតសំខាន់ៗ</text>
        <text x="15" y="155" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#fbcfe8">• លើកឧទាហរណ៍ជាក់ស្ដែង</text>
        <text x="15" y="185" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#fbcfe8">• សរុបមតិគំនិត</text>
      </g>
      
      <!-- Arrow 2 -> 3 -->
      <polygon points="535,220 550,215 535,210" fill="#c084fc" />
      <line x1="520" y1="215" x2="545" y2="215" stroke="#c084fc" stroke-width="2.5" />
      
      <!-- Step 3: Conclusion -->
      <g transform="translate(560, 110)">
        <rect width="180" height="220" rx="12" fill="#1e1b4b" stroke="#a855f7" stroke-width="2" />
        <rect width="180" height="36" rx="12" fill="#7e22ce" />
        <rect x="0" y="24" width="180" height="12" fill="#7e22ce" />
        <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#ffffff">៣. សេចក្ដីបញ្ចប់</text>
        <text x="15" y="70" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#e9d5ff">• វាយតម្លៃរួមលើប្រធាន</text>
        <text x="15" y="105" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#e9d5ff">• ទស្សនៈផ្ទាល់ខ្លួន</text>
        <text x="15" y="140" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#e9d5ff">• មតិផ្ដាំផ្ញើអប់រំ</text>
      </g>
      
      <!-- Bottom Topic Banner -->
      <g transform="translate(40, 395)">
        <rect width="720" height="38" rx="8" fill="#1e1b4b" stroke="#7e22ce" stroke-width="1" />
        <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#c084fc">ប្រធានបទ៖</text>
        <text x="100" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="semibold" fill="#f8fafc">${cleanTopic}</text>
      </g>
    </svg>`;
    return {
      id: 'ill-' + Date.now(),
      url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      caption: `ដ្យាក្រាមរចនាសម្ព័ន្ធតែងសេចក្ដីគរុកោសល្យ៖ ${cleanTopic}`,
      prompt,
      type: 'ai',
      aspectRatio: '16:9',
      showInStep3: true,
    };
  }

  // 5. ICT / Excel / Coding / Tech
  if (s.includes('ict') || s.includes('កុំព្យូទ័រ') || t.includes('excel') || t.includes('coding') || t.includes('កូដ') || t.includes('ai') || t.includes('ទិន្នន័យ')) {
    return buildExcelIllustration(cleanTopic, prompt);
  }

  // 6. Biology: Cell / Photosynthesis / Genetics / Living Things
  if (s.includes('ជីវ') || s.includes('bio') || t.includes('កោសិកា') || t.includes('រស្មីសំយោគ') || t.includes('សរីរាង្គ') || t.includes('adn') || t.includes('ហ្សែន')) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
      <defs>
        <linearGradient id="bioBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#064e3b" />
          <stop offset="50%" stop-color="#022c22" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <linearGradient id="cellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#059669" stop-opacity="0.6" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#bioBg)" rx="16" />
      
      <!-- Header Badge -->
      <g transform="translate(40, 35)">
        <rect width="280" height="34" rx="17" fill="#065f46" stroke="#34d399" stroke-width="1.5" />
        <circle cx="20" cy="17" r="7" fill="#34d399" />
        <text x="36" y="22" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#f8fafc">គំនូសបំព្រួញជីវសាស្ត្រ៖ ជីវវិទ្យា</text>
      </g>
      
      <!-- Cell Diagram (Left) -->
      <g transform="translate(240, 230)">
        <!-- Outer Cell Wall / Membrane -->
        <ellipse cx="0" cy="0" rx="170" ry="120" fill="url(#cellGrad)" stroke="#34d399" stroke-width="3.5" />
        <ellipse cx="0" cy="0" rx="155" ry="105" fill="#022c22" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.8" />
        
        <!-- Nucleus -->
        <circle cx="-30" cy="-10" r="45" fill="#047857" stroke="#6ee7b7" stroke-width="2.5" />
        <circle cx="-30" cy="-10" r="20" fill="#065f46" stroke="#a7f3d0" stroke-width="1.5" />
        <text x="-48" y="-7" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#ffffff">ណ្វៃយ៉ូ</text>
        
        <!-- Mitochondria -->
        <g transform="translate(60, -35)">
          <ellipse cx="0" cy="0" rx="28" ry="16" fill="#b45309" stroke="#f59e0b" stroke-width="2" />
          <path d="M -18 0 Q -10 -8 0 0 Q 10 8 18 0" stroke="#fef3c7" stroke-width="2" fill="none" />
          <text x="-22" y="28" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#fde68a">មីតូកុងឌ្រី</text>
        </g>
        
        <!-- Chloroplast / Vacuole -->
        <g transform="translate(45, 45)">
          <ellipse cx="0" cy="0" rx="35" ry="20" fill="#059669" stroke="#10b981" stroke-width="2" />
          <line x1="-20" y1="0" x2="20" y2="0" stroke="#a7f3d0" stroke-width="2" />
          <text x="-25" y="32" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#a7f3d0">ក្លរ៉ូប្លាស</text>
        </g>
        
        <text x="-70" y="145" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#6ee7b7">ទម្រង់កោសិកា (Cell Structure)</text>
      </g>
      
      <!-- Key Biological Process / Formula Card (Right) -->
      <g transform="translate(490, 95)">
        <rect width="270" height="270" rx="12" fill="#064e3b" stroke="#34d399" stroke-width="1.5" opacity="0.95" />
        <rect width="270" height="32" rx="12" fill="#047857" />
        <rect x="0" y="20" width="270" height="12" fill="#047857" />
        <text x="12" y="22" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#ffffff">🌿 ដំណើរការជីវសាស្ត្រគន្លឹះ</text>
        
        <text x="15" y="60" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#6ee7b7">សមីការរស្មីសំយោគ (Photosynthesis)៖</text>
        <rect x="15" y="70" width="240" height="35" rx="6" fill="#022c22" stroke="#059669" />
        <text x="25" y="93" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fde047">6CO₂ + 6H₂O + ពន្លឺ → C₆H₁₂O₆ + 6O₂</text>
        
        <text x="15" y="130" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#6ee7b7">មុខងារ និងអង្គការលេខ៖</text>
        <text x="15" y="155" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#ecfdf5">• ណ្វៃយ៉ូ (Nucleus)៖ ផ្ទុកព័ត៌មានពន្ធុ ADN</text>
        <text x="15" y="180" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#ecfdf5">• មីតូកុងឌ្រី (Mitochondria)៖ រោងចក្រថាមពល ATP</text>
        <text x="15" y="205" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#ecfdf5">• ក្លរ៉ូប្លាស (Chloroplast)៖ ស្រូបពន្លឺបង្កើតស្ករ</text>
        <text x="15" y="230" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#ecfdf5">• ភ្នាសកោសិកា (Membrane)៖ គ្រប់គ្រងការចេញចូល</text>
      </g>
      
      <!-- Bottom Topic Banner -->
      <g transform="translate(40, 395)">
        <rect width="720" height="38" rx="8" fill="#065f46" stroke="#34d399" stroke-width="1" />
        <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#34d399">ប្រធានបទ៖</text>
        <text x="100" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="semibold" fill="#f8fafc">${cleanTopic}</text>
      </g>
    </svg>`;
    return {
      id: 'ill-' + Date.now(),
      url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      caption: `ដ្យាក្រាមរចនាសម្ព័ន្ធកោសិកា និងដំណើរការជីវសាស្ត្រ៖ ${cleanTopic}`,
      prompt,
      type: 'ai',
      aspectRatio: '16:9',
      showInStep3: true,
    };
  }

  // 7. History & Social Studies: Timeline / Cultural Heritage
  if (s.includes('ប្រវត្តិ') || s.includes('សង្គម') || s.includes('ភូមិ') || s.includes('សីលធម៌') || t.includes('សម័យ') || t.includes('អង្គរ') || t.includes('ប្រាសាទ')) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
      <defs>
        <linearGradient id="histBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#451a03" />
          <stop offset="50%" stop-color="#292524" />
          <stop offset="100%" stop-color="#0c0a09" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#histBg)" rx="16" />
      
      <!-- Header Badge -->
      <g transform="translate(40, 35)">
        <rect width="320" height="34" rx="17" fill="#78350f" stroke="#fbbf24" stroke-width="1.5" />
        <circle cx="20" cy="17" r="7" fill="#fbbf24" />
        <text x="36" y="22" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#f8fafc">បន្ទាត់ពេលវេលាប្រវត្តិសាស្ត្រ៖ ${subject}</text>
      </g>
      
      <!-- Central Timeline Track -->
      <line x1="80" y1="210" x2="720" y2="210" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
      
      <!-- Timeline Era 1 -->
      <g transform="translate(130, 210)">
        <circle cx="0" cy="0" r="16" fill="#78350f" stroke="#fbbf24" stroke-width="3" />
        <circle cx="0" cy="0" r="6" fill="#fbbf24" />
        <line x1="0" y1="-20" x2="0" y2="-65" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3" />
        <rect x="-70" y="-120" width="140" height="55" rx="8" fill="#1c1917" stroke="#d97706" />
        <text x="-60" y="-98" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#fbbf24">ដំណាក់កាលទី ១</text>
        <text x="-60" y="-78" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#fef3c7">ប្រភពដើម និងមូលដ្ឋាន</text>
      </g>
      
      <!-- Timeline Era 2 (Center) -->
      <g transform="translate(400, 210)">
        <circle cx="0" cy="0" r="22" fill="#b45309" stroke="#fde047" stroke-width="3.5" />
        <circle cx="0" cy="0" r="8" fill="#fde047" />
        <line x1="0" y1="25" x2="0" y2="70" stroke="#fde047" stroke-width="2" stroke-dasharray="3,3" />
        <rect x="-90" y="70" width="180" height="65" rx="8" fill="#1c1917" stroke="#eab308" stroke-width="1.5" />
        <text x="-80" y="94" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#fde047">ព្រឹត្តិការណ៍ស្នូល</text>
        <text x="-80" y="114" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#fef3c7">ការអភិវឌ្ឍ និងចំណុចរបត់</text>
        <text x="-80" y="128" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#94a3b8">កាលបរិច្ឆេទ និងភស្តុតាងប្រវត្តិ</text>
      </g>
      
      <!-- Timeline Era 3 -->
      <g transform="translate(670, 210)">
        <circle cx="0" cy="0" r="16" fill="#78350f" stroke="#fbbf24" stroke-width="3" />
        <circle cx="0" cy="0" r="6" fill="#fbbf24" />
        <line x1="0" y1="-20" x2="0" y2="-65" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3" />
        <rect x="-70" y="-120" width="140" height="55" rx="8" fill="#1c1917" stroke="#d97706" />
        <text x="-60" y="-98" font-family="'Kantumruy Pro', sans-serif" font-size="11" font-weight="bold" fill="#fbbf24">ដំណាក់កាលទី ៣</text>
        <text x="-60" y="-78" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#fef3c7">ឥទ្ធិពល និងមេរៀន</text>
      </g>
      
      <!-- Bottom Topic Banner -->
      <g transform="translate(40, 395)">
        <rect width="720" height="38" rx="8" fill="#451a03" stroke="#fbbf24" stroke-width="1" />
        <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#fbbf24">ប្រធានបទ៖</text>
        <text x="100" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="semibold" fill="#f8fafc">${cleanTopic}</text>
      </g>
    </svg>`;
    return {
      id: 'ill-' + Date.now(),
      url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      caption: `បន្ទាត់ពេលវេលាប្រវត្តិសាស្ត្រ និងព្រឹត្តិការណ៍គន្លឹះ៖ ${cleanTopic}`,
      prompt,
      type: 'ai',
      aspectRatio: '16:9',
      showInStep3: true,
    };
  }

  // 8. General Pedagogical Knowledge Diagram
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
    <defs>
      <linearGradient id="gBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1b4b" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#172554" />
      </linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(#gBg)" rx="16" />
    
    <!-- Header Badge -->
    <g transform="translate(40, 35)">
      <rect width="280" height="34" rx="17" fill="#1e293b" stroke="#60a5fa" stroke-width="1.5" />
      <circle cx="20" cy="17" r="7" fill="#60a5fa" />
      <text x="36" y="22" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#f8fafc">គំនូសបំព្រួញគរុកោសល្យ៖ ${subject}</text>
    </g>
    
    <!-- 3 Step Circle Process -->
    <g transform="translate(130, 200)">
      <circle cx="0" cy="0" r="50" fill="#1e293b" stroke="#38bdf8" stroke-width="3" />
      <text x="-15" y="8" font-family="'Kantumruy Pro', sans-serif" font-size="20" font-weight="bold" fill="#38bdf8">១</text>
      <text x="-40" y="75" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">ចំណេះដឹងគ្រឹះ</text>
      <text x="-40" y="95" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#94a3b8">ទ្រឹស្ដី និងនិយមន័យ</text>
    </g>
    
    <line x1="185" y1="200" x2="335" y2="200" stroke="#60a5fa" stroke-width="3" stroke-dasharray="6,4" />
    <polygon points="340,200 330,194 330,206" fill="#60a5fa" />
    
    <g transform="translate(400, 200)">
      <circle cx="0" cy="0" r="55" fill="#1e293b" stroke="#a855f7" stroke-width="3.5" />
      <text x="-15" y="8" font-family="'Kantumruy Pro', sans-serif" font-size="22" font-weight="bold" fill="#c084fc">២</text>
      <text x="-45" y="80" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">ការអនុវត្តផ្ទាល់</text>
      <text x="-45" y="100" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#94a3b8">លំហាត់ និងកិច្ចការ</text>
    </g>
    
    <line x1="460" y1="200" x2="610" y2="200" stroke="#60a5fa" stroke-width="3" stroke-dasharray="6,4" />
    <polygon points="615,200 605,194 605,206" fill="#60a5fa" />
    
    <g transform="translate(670, 200)">
      <circle cx="0" cy="0" r="50" fill="#1e293b" stroke="#10b981" stroke-width="3" />
      <text x="-15" y="8" font-family="'Kantumruy Pro', sans-serif" font-size="20" font-weight="bold" fill="#34d399">៣</text>
      <text x="-40" y="75" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">បំណិនជីវិត</text>
      <text x="-40" y="95" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#94a3b8">ការយល់ដឹងស៊ីជម្រៅ</text>
    </g>
    
    <!-- Bottom Topic Banner -->
    <g transform="translate(40, 395)">
      <rect width="720" height="38" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
      <text x="20" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#60a5fa">ប្រធានបទ៖</text>
      <text x="100" y="24" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="semibold" fill="#f8fafc">${cleanTopic}</text>
    </g>
  </svg>`;

  return {
    id: 'ill-' + Date.now(),
    url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    caption: `ដ្យាក្រាមគំនូសបំព្រួញគរុកោសល្យ៖ ${cleanTopic}`,
    prompt,
    type: 'ai',
    aspectRatio: '16:9',
    showInStep3: true,
  };
}
