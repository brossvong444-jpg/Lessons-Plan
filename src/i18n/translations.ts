export type Language = 'km' | 'en';

export interface Translations {
  // Navigation & Header
  appTitle: string;
  appSubtitle: string;
  moeysBadge: string;
  quickSamples: string;
  sampleMath: string;
  sampleKhmer: string;
  sampleScience: string;
  historyBtn: string;
  newPlanBtn: string;
  ownerBadge: string;
  aboutOwnerBtn: string;

  // Owner & Creator Info
  ownerTitle: string;
  ownerName: string;
  ownerRole: string;
  ownerEmail: string;
  ownerMissionTitle: string;
  ownerMissionDesc: string;
  ownerFeaturesTitle: string;
  ownerFeature1: string;
  ownerFeature2: string;
  ownerFeature3: string;
  ownerFeature4: string;
  ownerCopyrightNotice: string;
  closeBtn: string;

  // Sections
  section1Title: string;
  section1Subtitle: string;
  filterAll: string;
  filterPrimary: string;
  filterLowerSec: string;
  filterUpperSec: string;
  loadSampleBtn: string;

  section2Title: string;
  section2Subtitle: string;
  topicLabel: string;
  topicPlaceholder: string;
  subjectLabel: string;
  gradeLabel: string;
  durationLabel: string;
  teachingMethodLabel: string;
  teachingStrategyLabel: string;
  difficultyLabel: string;
  focusKeywordsLabel: string;
  focusKeywordsPlaceholder: string;
  teacherNameLabel: string;
  schoolNameLabel: string;
  chapterLabel: string;
  lessonNoLabel: string;
  advancedOptionsToggle: string;
  generateBtn: string;
  generatingBtn: string;
  clearBtn: string;

  // Preview Section
  section3Title: string;
  section3Subtitle: string;
  editingModeHint: string;
  printFriendlyModeHint: string;
  normalModeHint: string;
  moeysStandardNote: string;

  // Toolbars & Actions
  editContentBtn: string;
  saveEditsBtn: string;
  printFriendlyBtn: string;
  fullscreenBtn: string;
  exitFullscreenBtn: string;
  saveToHistoryBtn: string;
  exportPdfBtn: string;
  exportWordBtn: string;
  exportingPdf: string;
  exportingWord: string;

  // Document Fields
  countryName: string;
  countryMotto: string;
  schoolPrefix: string;
  teacherPrefix: string;
  subjectPrefix: string;
  gradePrefix: string;
  datePrefix: string;
  durationPrefix: string;
  chapterPrefix: string;
  lessonPrefix: string;
  topicPrefix: string;
  teachingMethodPrefix: string;
  teachingStrategyPrefix: string;
  integrationPrefix: string;

  objectivesTitle: string;
  knowledgeDomain: string;
  skillsDomain: string;
  attitudeDomain: string;
  materialsTitle: string;
  teacherMaterials: string;
  studentMaterials: string;

  processTitle: string;
  stepCol: string;
  durationCol: string;
  contentCol: string;
  teacherActCol: string;
  studentActCol: string;

  step1Title: string;
  step2Title: string;
  step3Title: string;
  step4Title: string;
  step5Title: string;

  practicalSectionTitle: string;
  givenDataTitle: string;
  formulaRuleTitle: string;
  stepByStepSolutionTitle: string;
  finalResultTitle: string;
  studentPracticeTitle: string;
  hintOrAnswerKey: string;

  vocabularyTitle: string;
  vocabTerm: string;
  vocabPart: string;
  vocabDef: string;
  vocabExample: string;

  illustrationTitle: string;
  boardSummaryTitle: string;
  reflectionTitle: string;
  reflectionStrengths: string;
  reflectionWeaknesses: string;
  reflectionSolutions: string;

  signatureDirector: string;
  signatureTeacher: string;

  // History Drawer
  historyTitle: string;
  historySubtitle: string;
  historyEmpty: string;
  historyDeleteTooltip: string;
  historyViewBtn: string;

  // Step Refiner Modal
  refineTitle: string;
  refinePromptPlaceholder: string;
  refineSuggestionsTitle: string;
  refineAddDetail: string;
  refineAddSteps: string;
  refineSimplify: string;
  refineAddGroupWork: string;
  refineSubmitBtn: string;
  refineCancelBtn: string;
  refiningBtn: string;

  // Footer
  footerRights: string;
  footerCreatedBy: string;
  footerFormats: string;
}

export const translations: Record<Language, Translations> = {
  km: {
    appTitle: 'កិច្ចតែងការបង្រៀន AI',
    appSubtitle: 'កម្មវិធីបង្កើតកិច្ចតែងការគ្រូបង្រៀនស្វ័យប្រវត្តិតាមស្តង់ដារក្រសួង MoEYS',
    moeysBadge: 'ស្តង់ដារ MoEYS',
    quickSamples: 'គំរូរហ័ស៖',
    sampleMath: 'គណិតវិទ្យា ថ្នាក់ទី៩',
    sampleKhmer: 'ភាសាខ្មែរ ថ្នាក់ទី៨',
    sampleScience: 'រូបវិទ្យា ថ្នាក់ទី១០',
    historyBtn: 'ប្រវត្តិ',
    newPlanBtn: 'បង្កើតថ្មី',
    ownerBadge: 'ម្ចាស់កម្មវិធី៖ ឡោម មនីវង្ស',
    aboutOwnerBtn: 'អំពីអ្នកបង្កើត',

    ownerTitle: 'ព័ត៌មានអ្នកបង្កើត និងសិទ្ធិម្ចាស់កម្មវិធី',
    ownerName: 'ឡោម មនីវង្ស (Lorm Monyvong)',
    ownerRole: 'ម្ចាស់កម្មវិធី និងអ្នកអភិវឌ្ឍន៍ប្រព័ន្ធ (Owner & Lead Developer)',
    ownerEmail: 'brossvong444@gmail.com',
    ownerMissionTitle: 'បេសកកម្ម និងគោលបំណងនៃការបង្កើត',
    ownerMissionDesc:
      'កម្មវិធីបង្កើតកិច្ចតែងការបង្រៀន AI នេះ ត្រូវបានផ្តួចផ្តើម ដឹកនាំរចនា និងអភិវឌ្ឍឡើងដោយលោក ឡោម មនីវង្ស ក្នុងគោលបំណងចូលរួមលើកកម្ពស់វិស័យអប់រំ និងគរុកោសល្យនៅព្រះរាជាណាចក្រកម្ពុជា។ ប្រព័ន្ធនេះជួយសម្រាលបន្ទុកលោកគ្រូ-អ្នកគ្រូទូទាំងប្រទេស ក្នុងការរៀបចំកិច្ចតែងការបង្រៀនឱ្យកាន់តែឆាប់រហ័ស សម្បូរបែប ស្របតាមទម្រង់ផ្លូវការរបស់ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS) ១០០%។',
    ownerFeaturesTitle: 'ចំណុចលេចធ្លោនៃកម្មវិធី',
    ownerFeature1: 'កិច្ចតែងការបង្រៀនស្របតាមស្តង់ដារ MoEYS ៥ ជំហាន និងវត្ថុបំណង ៣ ដែន',
    ownerFeature2: 'មានការបកស្រាយលម្អិតមួយជំហានម្តងៗ និងលំហាត់អនុវត្តជាក់ស្តែងតាមមុខវិជ្ជា',
    ownerFeature3: 'នាំចេញជាឯកសារ Microsoft Word (.docx) និង PDF គុណភាពខ្ពស់ភ្លាមៗ',
    ownerFeature4: 'អាចប្រើប្រាស់សំឡេង (Voice-to-Text) និងជំនួយការ AI ក្នុងការកែលម្អជំហាននីមួយៗ',
    ownerCopyrightNotice: 'រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ ឡោម មនីវង្ស © ២០២៦។ ហាមចម្លង ឬកែច្នៃកម្មសិទ្ធិដោយគ្មានការអនុញ្ញាត។',
    closeBtn: 'បិទ',

    section1Title: 'ជ្រើសរើសគំរូមេរៀនរហ័ស (Quick Templates)',
    section1Subtitle: 'ចុចលើកាតណាមួយខាងក្រោមដើម្បីផ្ទុកកិច្ចតែងការគំរូ ឬចុចបង្កើតថ្មីដោយខ្លួនឯង',
    filterAll: 'ទាំងអស់',
    filterPrimary: 'បឋមសិក្សា (ថ្នាក់ទី ១-៦)',
    filterLowerSec: 'អនុវិទ្យាល័យ (ថ្នាក់ទី ៧-៩)',
    filterUpperSec: 'វិទ្យាល័យ (ថ្នាក់ទី ១០-១២)',
    loadSampleBtn: 'ផ្ទុកគំរូនេះ',

    section2Title: 'បញ្ចូលព័ត៌មានមេរៀនដើម្បីបង្កើតដោយស្វ័យប្រវត្ត',
    section2Subtitle: 'ប្រព័ន្ធនឹងបង្កើតកិច្ចតែងការបង្រៀនពេញលេញ ត្រឹមត្រូវតាមស្តង់ដារគរុកោសល្យខ្មែរ',
    topicLabel: 'ប្រធានបទមេរៀន / ចំណងជើងមេរៀន *',
    topicPlaceholder: 'ឧ. ផលគុណកន្សោមពីជគណិត, ការតែងសេចក្តីពណ៌នា, ច្បាប់ញូតុនទី២...',
    subjectLabel: 'មុខវិជ្ជា',
    gradeLabel: 'កម្រិតថ្នាក់',
    durationLabel: 'រយៈពេលបង្រៀន',
    teachingMethodLabel: 'វិធីសាស្ត្របង្រៀន',
    teachingStrategyLabel: 'យុទ្ធវិធីបង្រៀន (Teaching Strategy)',
    difficultyLabel: 'កម្រិតលំបាក',
    focusKeywordsLabel: 'ពាក្យគន្លឹះ / ការផ្ដោតសំខាន់បន្ថែម',
    focusKeywordsPlaceholder: 'ឧ. រូបមន្តគន្លឹះ, ការពន្យល់ពេលរៀនលម្អិត, ការដោះស្រាយជាជំហានៗ...',
    teacherNameLabel: 'ឈ្មោះគ្រូបង្រៀន',
    schoolNameLabel: 'ឈ្មោះសាលារៀន',
    chapterLabel: 'ជំពូកទី (ស្រេចចិត្ត)',
    lessonNoLabel: 'មេរៀនទី (ស្រេចចិត្ត)',
    advancedOptionsToggle: 'ជម្រើសបន្ថែម (ឈ្មោះគ្រូ, សាលារៀន, ជំពូក, មេរៀន)',
    generateBtn: 'បង្កើតកិច្ចតែងការបង្រៀន',
    generatingBtn: 'កំពុងបង្កើតកិច្ចតែងការបង្រៀន...',
    clearBtn: 'សម្អាតទិន្នន័យ',

    section3Title: 'កន្លែងពិនិត្យមើលលទ្ធផល (ទម្រង់ A4 ស្តង់ដារ)',
    section3Subtitle: 'កិច្ចតែងការបង្រៀនពេញលេញតាមទម្រង់ផ្លូវការក្រសួងអប់រំ យុវជន និងកីឡា',
    editingModeHint: 'កំពុងស្ថិតក្នុងទម្រង់កែសម្រួល៖ អ្នកអាចចុចលើប្រអប់អត្ថបទនីមួយៗដើម្បីកែសម្រួលបាន',
    printFriendlyModeHint: 'កំពុងស្ថិតក្នុងទម្រង់ Print-Friendly (កម្រិតពណ៌ស-ខ្មៅ សន្សំទឹកថ្នាំម៉ាស៊ីនព្រីន)',
    normalModeHint: 'អ្នកអាចចុចប៊ូតុង "កែសម្រួលខ្លឹមសារ" ខាងលើដើម្បីផ្លាស់ប្ដូរអត្ថបទ ឬប្រើ AI ជំនួយ',
    moeysStandardNote: 'បង្ហាញតាមទម្រង់ផ្លូវការ គំរូកិច្ចតែងការក្រសួងអប់រំ យុវជន និងកីឡា',

    editContentBtn: 'កែសម្រួលខ្លឹមសារ',
    saveEditsBtn: 'រក្សាទុកការកែប្រែ',
    printFriendlyBtn: 'សន្សំទឹកថ្នាំ (Print)',
    fullscreenBtn: 'ពេញអេក្រង់',
    exitFullscreenBtn: 'បង្រួមអេក្រង់',
    saveToHistoryBtn: 'រក្សាទុកក្នុងប្រវត្តិ',
    exportPdfBtn: 'ទាញយកជា PDF',
    exportWordBtn: 'ទាញយកជា Word (.docx)',
    exportingPdf: 'កំពុងបង្កើត PDF...',
    exportingWord: 'កំពុងបង្កើត Word...',

    countryName: 'ព្រះរាជាណាចក្រកម្ពុជា',
    countryMotto: 'ជាតិ សាសនា ព្រះមហាក្សត្រ',
    schoolPrefix: 'កាលវិភាគបង្រៀន / សាលារៀន៖',
    teacherPrefix: 'គ្រូបង្រៀន៖',
    subjectPrefix: 'មុខវិជ្ជា៖',
    gradePrefix: 'ថ្នាក់ទី៖',
    datePrefix: 'កាលបរិច្ឆេទ៖',
    durationPrefix: 'រយៈពេល៖',
    chapterPrefix: 'ជំពូកទី៖',
    lessonPrefix: 'មេរៀនទី៖',
    topicPrefix: 'ប្រធានបទ៖',
    teachingMethodPrefix: 'វិធីសាស្ត្របង្រៀន៖',
    teachingStrategyPrefix: 'យុទ្ធវិធីបង្រៀន៖',
    integrationPrefix: 'ការបញ្ជ្រាបចំណេះដឹង៖',

    objectivesTitle: 'I. វត្ថុបំណងមេរៀន (Lesson Objectives)',
    knowledgeDomain: '១. ចំណេះដឹង (Knowledge)',
    skillsDomain: '២. បំណិន (Skills)',
    attitudeDomain: '៣. ឥរិយាបថ (Attitude)',
    materialsTitle: 'II. សម្ភារឧបទេស (Teaching Materials)',
    teacherMaterials: '១. ចំពោះគ្រូ (For Teacher)',
    studentMaterials: '២. ចំពោះសិស្ស (For Students)',

    processTitle: 'III. ដំណើរការបង្រៀន និងរៀន (Teaching and Learning Process)',
    stepCol: 'ជំហានបង្រៀន',
    durationCol: 'រយៈពេល',
    contentCol: 'ខ្លឹមសារមេរៀន (Lesson Content)',
    teacherActCol: 'សកម្មភាពគ្រូ (Teacher Activity)',
    studentActCol: 'សកម្មភាពសិស្ស (Student Activity)',

    step1Title: 'ជំហានទី ១: រដ្ឋបាលថ្នាក់',
    step2Title: 'ជំហានទី ២: រំលឹកមេរៀនចាស់ ឬ កែកិច្ចការផ្ទះ',
    step3Title: 'ជំហានទី ៣: មេរៀនថ្មី',
    step4Title: 'ជំហានទី ៤: ពង្រឹងចំណេះដឹង',
    step5Title: 'ជំហានទី ៥: បណ្ដាំផ្ញើ និងកិច្ចការផ្ទះ',

    practicalSectionTitle: 'IV. ការអនុវត្តជាក់ស្ដែងលើប្រធានបទ (Practical Application)',
    givenDataTitle: 'បម្រាប់ និងបរិបទនៃប្រធាន',
    formulaRuleTitle: 'រូបមន្ត / ក្បួនបច្ចេកទេស',
    stepByStepSolutionTitle: 'ដំណោះស្រាយលម្អិតមួយជំហានម្តងៗ',
    finalResultTitle: 'ចម្លើយ និងការសន្និដ្ឋានជាក់ស្ដែង',
    studentPracticeTitle: 'លំហាត់ / កិច្ចការអនុវត្តសម្រាប់សិស្ស',
    hintOrAnswerKey: 'គន្លឹះ ឬ ចម្លើយផ្ទៀងផ្ទាត់',

    vocabularyTitle: 'V. បញ្ជីវាក្យសព្ទ និងពាក្យគន្លឹះ (Vocabulary & Key Terms)',
    vocabTerm: 'ពាក្យគន្លឹះ',
    vocabPart: 'ថ្នាក់ពាក្យ',
    vocabDef: 'និយមន័យ',
    vocabExample: 'ឧទាហរណ៍ក្នុងមេរៀន',

    illustrationTitle: 'VI. រូបភាពឧបទេស និងដ្យាក្រាមពន្យល់ (Educational Illustration)',
    boardSummaryTitle: 'VII. ប្លង់ក្ដារខៀនសង្ខេប (Blackboard Summary)',
    reflectionTitle: 'VIII. ការឆ្លុះបញ្ចាំងក្រោយការបង្រៀន (Teacher Reflection)',
    reflectionStrengths: 'ចំណុចខ្លាំង៖',
    reflectionWeaknesses: 'ចំណុចខ្វះខាត៖',
    reflectionSolutions: 'ដំណោះស្រាយកែលម្អ៖',

    signatureDirector: 'បានឃើញ និងឯកភាព\nនាយកសាលា',
    signatureTeacher: 'ថ្ងៃទី........ខែ........ឆ្នាំ២០២....\nហត្ថលេខាគ្រូបង្រៀន',

    historyTitle: 'កិច្ចតែងការដែលបានរក្សាទុក',
    historySubtitle: 'បញ្ជីកិច្ចតែងការដែលបានបង្កើត និងរក្សាទុកក្នុងម៉ាស៊ីនរបស់អ្នក',
    historyEmpty: 'មិនទាន់មានកិច្ចតែងការដែលបានរក្សាទុកនៅឡើយទេ',
    historyDeleteTooltip: 'លុបកិច្ចតែងការនេះ',
    historyViewBtn: 'មើលកិច្ចតែងការនេះ',

    refineTitle: 'កែលម្អជំហានដោយ AI',
    refinePromptPlaceholder: 'បញ្ចូលសំណូមពរកែលម្អ ឧ. បន្ថែមការពន្យល់ពេលរៀនលម្អិត, បន្ថែមលំហាត់ក្រុម...',
    refineSuggestionsTitle: 'សំណូមពររហ័ស៖',
    refineAddDetail: 'បន្ថែមការពន្យល់ពេលរៀនលម្អិត និងកំហុសសិស្ស',
    refineAddSteps: 'បន្ថែមដំណោះស្រាយលម្អិតមួយជំហានម្តងៗ',
    refineSimplify: 'សម្រួលខ្លឹមសារឱ្យកាន់តែសាមញ្ញ ងាយយល់',
    refineAddGroupWork: 'បន្ថែមសកម្មភាពពិភាក្សាជាក្រុម',
    refineSubmitBtn: 'អនុវត្តការកែលម្អ',
    refineCancelBtn: 'បោះបង់',
    refiningBtn: 'កំពុងកែលម្អ...',

    footerRights: 'រក្សាសិទ្ធិគ្រប់យ៉ាង © ២០២៦ ដោយ ឡោម មនីវង្ស (Lorm Monyvong) • ម្ចាស់ និងអ្នកបង្កើតកម្មវិធី',
    footerCreatedBy: 'បង្កើតឡើងដោយ ឡោម មនីវង្ស ដើម្បីគាំទ្រលោកគ្រូ-អ្នកគ្រូទូទាំងប្រទេសកម្ពុជា',
    footerFormats: 'គាំទ្រការទាញយកជាទម្រង់ Microsoft Word (.docx) និង PDF',
  },

  en: {
    appTitle: 'Khmer Lesson Plan AI',
    appSubtitle: 'Automated Lesson Plan Generator Aligned with MoEYS Standards',
    moeysBadge: 'MoEYS Standard',
    quickSamples: 'Quick Samples:',
    sampleMath: 'Grade 9 Mathematics',
    sampleKhmer: 'Grade 8 Khmer',
    sampleScience: 'Grade 10 Physics',
    historyBtn: 'History',
    newPlanBtn: 'Create New',
    ownerBadge: 'Owner: Lorm Monyvong',
    aboutOwnerBtn: 'About Creator',

    ownerTitle: 'Creator & App Ownership Information',
    ownerName: 'Lorm Monyvong (ឡោម មនីវង្ស)',
    ownerRole: 'App Owner & Lead System Developer',
    ownerEmail: 'brossvong444@gmail.com',
    ownerMissionTitle: 'Mission & Purpose',
    ownerMissionDesc:
      'This Khmer Teacher Lesson Plan AI web application was conceived, designed, and developed by Lorm Monyvong to elevate education and pedagogical practices in the Kingdom of Cambodia. It empowers educators across the country to generate comprehensive, pedagogical, and 100% compliant lesson plans aligned with the Ministry of Education, Youth and Sport (MoEYS) standards.',
    ownerFeaturesTitle: 'Key Capabilities',
    ownerFeature1: 'Standard MoEYS 5-step instructional process and 3-domain learning objectives',
    ownerFeature2: 'Step-by-step concrete demonstration solutions and subject-specific practical tasks',
    ownerFeature3: 'High-fidelity export to Microsoft Word (.docx) and print-ready PDF formats',
    ownerFeature4: 'Khmer voice-to-text input and AI-powered per-step instructional refiner',
    ownerCopyrightNotice: 'All Rights Reserved by Lorm Monyvong © 2026. Unauthorized duplication or redistribution prohibited.',
    closeBtn: 'Close',

    section1Title: 'Select a Quick Lesson Template',
    section1Subtitle: 'Click on any sample card below to load a ready lesson plan or create your custom one',
    filterAll: 'All Subjects',
    filterPrimary: 'Primary (Grades 1-6)',
    filterLowerSec: 'Lower Secondary (Grades 7-9)',
    filterUpperSec: 'Upper Secondary (Grades 10-12)',
    loadSampleBtn: 'Load Template',

    section2Title: 'Enter Lesson Information for Automated Generation',
    section2Subtitle: 'The system will generate a complete, pedagogical MoEYS-compliant lesson plan',
    topicLabel: 'Lesson Topic / Title *',
    topicPlaceholder: 'e.g., Multiplication of Algebraic Expressions, Expository Essay, Newton\'s Second Law...',
    subjectLabel: 'Subject',
    gradeLabel: 'Grade Level',
    durationLabel: 'Teaching Duration',
    teachingMethodLabel: 'Teaching Method',
    teachingStrategyLabel: 'Teaching Strategy / Technique',
    difficultyLabel: 'Difficulty Level',
    focusKeywordsLabel: 'Key Terms / Special Instructional Focus',
    focusKeywordsPlaceholder: 'e.g., Key formulas, detailed classroom explanation, step-by-step solution...',
    teacherNameLabel: 'Teacher Name',
    schoolNameLabel: 'School Name',
    chapterLabel: 'Chapter No. (Optional)',
    lessonNoLabel: 'Lesson No. (Optional)',
    advancedOptionsToggle: 'Additional Options (Teacher, School, Chapter, Lesson)',
    generateBtn: 'Generate Lesson Plan',
    generatingBtn: 'Generating Lesson Plan...',
    clearBtn: 'Clear Form',

    section3Title: 'Lesson Plan Preview (A4 MoEYS Standard)',
    section3Subtitle: 'Official Ministry of Education, Youth and Sport lesson plan format',
    editingModeHint: 'Editing Mode Active: Click on any text box to modify the content directly',
    printFriendlyModeHint: 'Print-Friendly Mode Active: High-contrast black and white to save printer ink',
    normalModeHint: 'Click "Edit Content" above to modify text or use the AI Step Refiner',
    moeysStandardNote: 'Formatted according to official MoEYS Kingdom of Cambodia standards',

    editContentBtn: 'Edit Content',
    saveEditsBtn: 'Save Edits',
    printFriendlyBtn: 'Ink-Saver (Print)',
    fullscreenBtn: 'Fullscreen',
    exitFullscreenBtn: 'Exit Fullscreen',
    saveToHistoryBtn: 'Save to History',
    exportPdfBtn: 'Export as PDF',
    exportWordBtn: 'Export as Word (.docx)',
    exportingPdf: 'Generating PDF...',
    exportingWord: 'Generating Word...',

    countryName: 'Kingdom of Cambodia',
    countryMotto: 'Nation Religion King',
    schoolPrefix: 'School / Institution:',
    teacherPrefix: 'Teacher:',
    subjectPrefix: 'Subject:',
    gradePrefix: 'Grade:',
    datePrefix: 'Date:',
    durationPrefix: 'Duration:',
    chapterPrefix: 'Chapter:',
    lessonPrefix: 'Lesson:',
    topicPrefix: 'Topic:',
    teachingMethodPrefix: 'Teaching Method:',
    teachingStrategyPrefix: 'Teaching Strategy:',
    integrationPrefix: 'Cross-Curricular Integration:',

    objectivesTitle: 'I. Lesson Objectives',
    knowledgeDomain: '1. Knowledge',
    skillsDomain: '2. Skills',
    attitudeDomain: '3. Attitude',
    materialsTitle: 'II. Teaching Materials',
    teacherMaterials: '1. For Teacher',
    studentMaterials: '2. For Students',

    processTitle: 'III. Teaching and Learning Process (5 Steps)',
    stepCol: 'Instructional Step',
    durationCol: 'Duration',
    contentCol: 'Lesson Content',
    teacherActCol: 'Teacher Activity',
    studentActCol: 'Student Activity',

    step1Title: 'Step 1: Classroom Management & Administration',
    step2Title: 'Step 2: Review Previous Lesson / Homework Correction',
    step3Title: 'Step 3: New Lesson (Core Instructional Content)',
    step4Title: 'Step 4: Knowledge Consolidation & Quick Assessment',
    step5Title: 'Step 5: Summary, Homework & Assignment',

    practicalSectionTitle: 'IV. Subject-Specific Practical Application',
    givenDataTitle: 'Given Data & Problem Context',
    formulaRuleTitle: 'Formulas & Technical Rules',
    stepByStepSolutionTitle: 'Step-by-Step Demonstration Solution',
    finalResultTitle: 'Final Result & Practical Conclusion',
    studentPracticeTitle: 'Student Practice Task & Problem',
    hintOrAnswerKey: 'Hints / Answer Key',

    vocabularyTitle: 'V. Vocabulary & Key Terms',
    vocabTerm: 'Key Term',
    vocabPart: 'Part of Speech',
    vocabDef: 'Definition',
    vocabExample: 'Context / Example',

    illustrationTitle: 'VI. Pedagogical Illustration & Diagram',
    boardSummaryTitle: 'VII. Blackboard Summary',
    reflectionTitle: 'VIII. Post-Instruction Teacher Reflection',
    reflectionStrengths: 'Strengths:',
    reflectionWeaknesses: 'Areas for Improvement:',
    reflectionSolutions: 'Actionable Solutions:',

    signatureDirector: 'Seen and Approved\nSchool Director',
    signatureTeacher: 'Date: ...... / ...... / 202...\nTeacher Signature',

    historyTitle: 'Saved Lesson Plans',
    historySubtitle: 'List of lesson plans created and saved in your browser storage',
    historyEmpty: 'No saved lesson plans yet',
    historyDeleteTooltip: 'Delete this lesson plan',
    historyViewBtn: 'View this Lesson Plan',

    refineTitle: 'AI Step Refiner',
    refinePromptPlaceholder: 'Enter your refinement instructions (e.g., add detailed explanation, include group exercise)...',
    refineSuggestionsTitle: 'Quick Suggestions:',
    refineAddDetail: 'Add detailed classroom explanation and common misconceptions',
    refineAddSteps: 'Add step-by-step line-by-line solution',
    refineSimplify: 'Simplify explanation for easier comprehension',
    refineAddGroupWork: 'Add collaborative pair/group activity',
    refineSubmitBtn: 'Apply Refinement',
    refineCancelBtn: 'Cancel',
    refiningBtn: 'Refining...',

    footerRights: 'All Rights Reserved © 2026 by Lorm Monyvong (ឡោម មនីវង្ស) • Web App Owner & Lead Developer',
    footerCreatedBy: 'Crafted by Lorm Monyvong to empower teachers across the Kingdom of Cambodia',
    footerFormats: 'Supports high-fidelity export in Microsoft Word (.docx) and PDF formats',
  },
};
