export interface LessonPlanHeader {
  country: string; // ព្រះរាជាណាចក្រកម្ពុជា
  motto: string; // ជាតិ សាសនា ព្រះមហាក្សត្រ
  schoolName: string; // វិទ្យាល័យ / អនុវិទ្យាល័យ / សាលាបឋមសិក្សា...
  teacherName: string; // ឈ្មោះគ្រូបង្រៀន
  subject: string; // មុខវិជ្ជា
  grade: string; // ថ្នាក់ទី
  date: string; // កាលបរិច្ឆេទ
  duration: string; // រយៈពេល (ឧ. ៥០ នាទី)
  chapter: string; // ជំពូកទី
  lessonNo: string; // មេរៀនទី
  topic: string; // ចំណងជើងមេរៀន / ប្រធានបទ
  teachingMethod?: string; // វិធីសាស្ត្របង្រៀន (ឧ. វិធីសាស្ត្រតាមបែបសិស្សមជ្ឈមណ្ឌល, 5E, ស្វែងរកចំណេះដឹង...)
  teachingStrategy?: string; // យុទ្ធវិធីបង្រៀន (ឧ. យុទ្ធវិធី Think-Pair-Share, Gallery Walk, Jigsaw...)
  integration?: string; // ការបញ្ជ្រាប (ឧ. បរិស្ថាន, សុខភាព, សីលធម៌, សមភាពយេនឌ័រ, បច្ចេកវិទ្យា, សុវត្ថិភាពចរាចរណ៍)
  difficultyLevel?: string; // កម្រិតលំបាក (មូលដ្ឋាន / មធ្យម / កម្រិតខ្ពស់)
}

export interface LessonPlanObjectives {
  knowledge: string[]; // ចំណេះដឹង
  skills: string[]; // បំណិន
  attitude: string[]; // ឥរិយាបថ
}

export interface TeachingMaterials {
  teacher: string[]; // ចំពោះគ្រូ
  students: string[]; // ចំពោះសិស្ស
}

export interface TeachingStep {
  stepNumber: string; // ឧ. "ជំហានទី ១", "ជំហានទី ២"
  stepTitle: string; // ឧ. "រដ្ឋបាលថ្នាក់", "រំលឹកមេរៀនចាស់"
  duration: string; // ឧ. "៣ - ៥ នាទី"
  content: string; // ខ្លឹមសារមេរៀន
  teacherActivity: string; // សកម្មភាពគ្រូ
  studentActivity: string; // សកម្មភាពសិស្ស
}

export interface TeacherReflection {
  strengths: string; // ចំណុចខ្លាំង
  weaknesses: string; // ចំណុចខ្វះខាត
  solutions: string; // ដំណោះស្រាយ/ការកែលម្អ
}

export interface PracticalCalculationStep {
  stepNumber: string; // ឧ. "ជំហានទី ១", "ដំណាក់កាលទី ១"
  stepName: string; // ឧ. "កំណត់បម្រាប់ និងរូបមន្ត", "ជំនួសលេខ និងធ្វើប្រមាណវិធី", "សរសេរសេចក្ដីផ្ដើម"
  operationOrCode?: string; // រូបមន្ត / ប្រមាណវិធី / សមីការគីមី / វាក្យសម្ព័ន្ធកូដ / គម្រោងតែង
  explanation: string; // ការពន្យល់ដំណើរការគណនា ឬការវិភាគគរុកោសល្យ
}

export type PracticalSubjectCategory =
  | 'math' // គណិតវិទ្យា: ប្រមាណវិធីគណនា (Arithmetic / Operations / Equations / Geometry)
  | 'physics' // រូបវិទ្យា: រូបមន្ត (Physics Formulas, Units, Calculations)
  | 'chemistry' // គីមីវិទ្យា: លំហាត់គណនាបង្ហាញ (Chemical Reactions, Moles, Concentrations)
  | 'khmer' // ភាសាខ្មែរ: តែងសេចក្ដី (Essay Structure, Intro/Body/Conclusion, Grammar Drills)
  | 'ict' // ICT: រូបមន្ត (Excel Spreadsheet Formulas, Coding Syntax, Algorithms)
  | 'biology' // ជីវវិទ្យា: ការពិសោធន៍ / ករណីសិក្សាជាក់ស្ដែង
  | 'general'; // មុខវិជ្ជាផ្សេងៗ: ការអនុវត្តជាក់ស្ដែងតាមប្រធានបទ

export interface PracticalApplication {
  title: string; // ចំណងជើងការអនុវត្តជាក់ស្ដែង (ឧ. "ការអនុវត្តជាក់ស្ដែង៖ ប្រមាណវិធីគណនា...", "ការអនុវត្តជាក់ស្ដែង៖ គម្រោងតែងសេចក្ដី...")
  subjectCategory: PracticalSubjectCategory;
  topic: string; // ប្រធានបទជាក់ស្ដែង
  problemStatement: string; // ប្រធានលំហាត់ជាក់ស្ដែង / ប្រធានតែងសេចក្ដី / កិច្ចការប្រតិបត្តិ
  givenDataOrContext?: string[]; // បម្រាប់ / បរិបទ / ទិន្នន័យដើម
  formulasOrRules?: string[]; // រូបមន្តគន្លឹះ / ក្បួនប្រមាណវិធី / ទម្រង់តែងសេចក្ដី / Syntax រូបមន្ត ICT
  steps: PracticalCalculationStep[]; // ដំណើរការគណនា/ដោះស្រាយមួយជំហានម្តងៗ
  finalResult: string; // ចម្លើយចុងក្រោយ / អត្ថន័យការអនុវត្តក្នុងជីវភាពជាក់ស្ដែង / សេចក្ដីសន្និដ្ឋាន
  studentPracticeTask: {
    problem: string; // លំហាត់/ប្រធានសម្រាប់សិស្សអនុវត្តដោយខ្លួនឯង
    hintOrAnswerKey?: string; // គន្លឹះដោះស្រាយ ឬចម្លើយផ្ទៀងផ្ទាត់
  };
}

export interface VocabularyItem {
  id?: string;
  term: string; // ពាក្យគន្លឹះ / វាក្យសព្ទ (Key Term / Vocabulary)
  partOfSpeech?: string; // ថ្នាក់ពាក្យ (នាម, កិរិយា, គុណនាម, ពាក្យបច្ចេកទេស...)
  definition: string; // និយមន័យ ឬការពន្យល់ន័យជាភាសាខ្មែរ
  exampleOrContext?: string; // ឧទាហរណ៍ ឬបរិបទប្រើប្រាស់ក្នុងមេរៀន
}

export interface LessonIllustration {
  id?: string;
  url: string; // Image URL (Data URL, Base64, or image path)
  caption: string; // ចំណងជើង ឬការពន្យល់រូបភាពឧបទេស (Caption)
  prompt?: string; // AI Prompt ដែលបានប្រើ
  type?: 'ai' | 'diagram' | 'svg';
  aspectRatio?: string;
  showInStep3?: boolean; // បង្ហាញក្នុងជំហានទី ៣ មេរៀនថ្មី
}

export interface LessonPlanData {
  id: string;
  createdAt: string;
  header: LessonPlanHeader;
  objectives: LessonPlanObjectives;
  materials: TeachingMaterials;
  vocabularyList?: VocabularyItem[]; // បញ្ជីវាក្យសព្ទ និងពាក្យគន្លឹះ (Vocabulary List / Key Terms)
  illustration?: LessonIllustration; // រូបភាព AI Auto ជំនួយការបង្រៀនតាមប្រធានបទ (AI Topic Illustration / Visual Aid)
  steps: TeachingStep[];
  practicalApplication?: PracticalApplication; // ការអនុវត្តជាក់ស្ដែងតាមប្រធានបទ (គណិតមានប្រមាណវិធី រូបមានរូបមន្ត ខ្មែរមានតែងសេចក្ដី គីមីមានលំហាត់បង្ហាញ ICTមានរូបមន្ត)
  boardSummary?: string; // កិច្ចការលើក្ដារខៀន / ប្លង់ក្ដារខៀន
  reflection?: TeacherReflection;
}

export interface GenerateLessonPlanRequest {
  topic: string;
  subject?: string;
  grade?: string;
  duration?: string;
  chapter?: string;
  lessonNo?: string;
  teacherName?: string;
  schoolName?: string;
  focusKeywords?: string;
  teachingMethod?: string; // វិធីសាស្ត្របង្រៀន
  teachingStrategy?: string; // យុទ្ធវិធីបង្រៀន
  integration?: string; // ការបញ្ជ្រាប (ឧ. បរិស្ថាន, សុខភាព, សីលធម៌, សមភាពយេនឌ័រ, បច្ចេកវិទ្យា, សុវត្ថិភាពចរាចរណ៍)
  difficultyLevel?: string; // កម្រិតលំបាក (មូលដ្ឋាន / មធ្យម / កម្រិតខ្ពស់)
  isCustomTopic?: boolean; // មេរៀនសរសេរថ្មី ឬក្រៅសៀវភៅពុម្ព
  includeIllustration?: boolean; // បង្កើតរូបភាព AI Auto ទៅតាមប្រធានបទ
}
