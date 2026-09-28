import React, { useState } from 'react';
import { Sparkles, BookOpen, Clock, User, School, Wand2, ChevronDown, ChevronUp, CheckCircle2, Gauge, PenTool, Lightbulb, Users, Compass, Target, Image as ImageIcon } from 'lucide-react';
import { GenerateLessonPlanRequest } from '../types/lessonPlan';
import { calculateStepDurations } from '../utils/durationHelper';

interface LessonPlanFormProps {
  onGenerate: (data: GenerateLessonPlanRequest) => Promise<void>;
  isLoading: boolean;
}

export const DIFFICULTY_LEVELS = [
  {
    id: 'មូលដ្ឋាន (Basic)',
    label: 'មូលដ្ឋាន',
    sublabel: 'Basic',
    icon: '🌱',
    description: 'ចំណេះដឹងគ្រឹះ (Bloom 1-2) ពន្យល់សាមញ្ញ និយមន័យ និងលំហាត់គំរូងាយស្រួល',
  },
  {
    id: 'មធ្យម (Intermediate)',
    label: 'មធ្យម',
    sublabel: 'Intermediate',
    icon: '⚡',
    description: 'ស្តង់ដារកម្មវិធីសិក្សាជាតិ (Bloom 3-4) ទ្រឹស្ដី លំហាត់អនុវត្តគន្លឹះ និងពិភាក្សាជាក្រុម',
  },
  {
    id: 'កម្រិតខ្ពស់ (Advanced)',
    label: 'កម្រិតខ្ពស់',
    sublabel: 'Advanced',
    icon: '🚀',
    description: 'ការត្រិះរិះស៊ីជម្រៅ (Bloom 5-6) លំហាត់ស្មុគស្មាញ ចោទជាបញ្ហា និងស្រាវជ្រាវ',
  },
];

export const TEACHING_METHODS_LIST = [
  {
    id: 'វិធីសាស្ត្របង្រៀនតាមបែបសិស្សមជ្ឈមណ្ឌល (Student-Centered)',
    label: 'សិស្សមជ្ឈមណ្ឌល',
    en: 'Student-Centered Learning',
    description: 'ផ្ដោតលើសកម្មភាពសិស្សជាចម្បង គ្រូជាអ្នកសម្របសម្រួល ណែនាំ និងជំរុញការចូលរួម',
  },
  {
    id: 'វិធីសាស្ត្របង្រៀន 5E (Engage, Explore, Explain, Elaborate, Evaluate)',
    label: 'វិធីសាស្ត្រ 5E',
    en: '5E Instructional Model',
    description: 'ផ្សារភ្ជាប់ រុករក ពន្យល់ ពង្រីកចំណេះដឹង និងវាយតម្លៃ (ពេញនិយមក្នុងវិទ្យាសាស្ត្រ និងគណិត)',
  },
  {
    id: 'វិធីសាស្ត្របង្រៀនតាមបែបស្ថាបនានិយម/ពុទ្ធិនិយម (Constructivism)',
    label: 'ស្ថាបនានិយម / ពុទ្ធិនិយម',
    en: 'Constructivism Learning',
    description: 'សិស្សកសាងចំណេះដឹងថ្មីដោយខ្លួនឯង ផ្អែកលើការពិសោធន៍ និងបទពិសោធន៍ជាក់ស្ដែង',
  },
  {
    id: 'វិធីសាស្ត្របង្រៀនបែបស្វែងរកចំណេះដឹង / រិះរក (Inquiry-Based Learning)',
    label: 'ស្វែងរកចំណេះដឹង / រិះរក',
    en: 'Inquiry-Based Learning',
    description: 'ជំរុញសិស្សឱ្យបង្កើតសម្មតិកម្ម សាកសួរ ស្រាវជ្រាវ និងស្វែងរកការពិតដោយផ្ទាល់',
  },
  {
    id: 'វិធីសាស្ត្រសិក្សាផ្អែកលើបញ្ហា (Problem-Based Learning - PBL)',
    label: 'ផ្អែកលើបញ្ហា (PBL)',
    en: 'Problem-Based Learning',
    description: 'លើកយកបញ្ហាជាក់ស្ដែងក្នុងជីវភាពមកធ្វើជាប្រធានបទវិភាគ និងដោះស្រាយ',
  },
  {
    id: 'វិធីសាស្ត្រសិក្សាផ្អែកលើគម្រោង (Project-Based Learning - PjBL)',
    label: 'ផ្អែកលើគម្រោង (PjBL)',
    en: 'Project-Based Learning',
    description: 'សិស្សធ្វើការងារសិក្សាស្រាវជ្រាវរយៈពេលវែង និងបង្កើតជាស្នាដៃ/ផលិតផលពិត',
  },
  {
    id: 'វិធីសាស្ត្រ STEM / STEAM និងការអនុវត្តជាក់ស្ដែង',
    label: 'STEM / STEAM អនុវត្តជាក់ស្ដែង',
    en: 'STEM / STEAM Integration',
    description: 'សមាហរណកម្ម វិទ្យាសាស្ត្រ បច្ចេកវិទ្យា វិស្វកម្ម សិល្បៈ និងគណិតវិទ្យាក្នុងការដោះស្រាយបញ្ហា',
  },
  {
    id: 'វិធីសាស្ត្របង្រៀនបែបសហការ និងជាក្រុម (Cooperative & Collaborative)',
    label: 'សហការ និងជាក្រុម',
    en: 'Cooperative Learning',
    description: 'ធ្វើការជាក្រុម រួមគំនិតគ្នា ទទួលខុសត្រូវរួម និងជួយគ្នាទៅវិញទៅមក',
  },
  {
    id: 'វិធីសាស្ត្របង្រៀនបែបពិសោធន៍ និងបង្ហាញសកម្មភាព (Demonstration & Hands-on)',
    label: 'ពិសោធន៍ និងបង្ហាញសកម្មភាព',
    en: 'Demonstration & Hands-on',
    description: 'គ្រូបង្ហាញសកម្មភាព ឬពិសោធន៍ជាក់ស្ដែង រួចឱ្យសិស្សអនុវត្តតាមដោយដៃផ្ទាល់',
  },
  {
    id: 'វិធីសាស្ត្របង្រៀនបែបពិភាក្សា និងជជែកវែកញែក (Discussion & Debate)',
    label: 'ពិភាក្សា និងជជែកវែកញែក',
    en: 'Discussion & Debate',
    description: 'ផ្លាស់ប្តូរយោបល់ លើកទឡ្ហីករណ៍ និងវែកញែករកហេតុផលត្រឹមត្រូវតាមបែបវិទ្យាសាស្ត្រ',
  },
  {
    id: 'វិធីសាស្ត្របង្រៀនបែបវិចារណញាណ / អនុមានរួមនិងអនុមានញែក (Inductive & Deductive)',
    label: 'អនុមានរួម និងអនុមានញែក',
    en: 'Inductive & Deductive Method',
    description: 'ទាញរកក្បួន/រូបមន្តពីឧទាហរណ៍ជាក់ស្ដែង ឬយកក្បួនទៅអនុវត្តលើឧទាហរណ៍',
  },
  {
    id: 'វិធីសាស្ត្របង្រៀនបែបល្បែងសិក្សា និងសកម្ម (Gamification & Play-Based)',
    label: 'ល្បែងសិក្សា (Gamification)',
    en: 'Gamified & Play-Based',
    description: 'បញ្ចូលការប្រកួតប្រជែង ល្បងប្រាជ្ញា និងល្បែងអប់រំដើម្បីបង្កើនចំណាប់អារម្មណ៍',
  },
  {
    id: 'វិធីសាស្ត្របង្រៀនតាមបែបបំណិនជីវិត និងឆ្លុះបញ្ចាំង (Life Skills & Reflective)',
    label: 'បំណិនជីវិត និងឆ្លុះបញ្ចាំង',
    en: 'Life Skills & Reflective',
    description: 'ផ្សារភ្ជាប់ចំណេះដឹងទៅនឹងការអនុវត្តក្នុងជីវិតរស់នៅ ការគិតពិចារណា និងការកែលម្អខ្លួន',
  },
  {
    id: 'វិធីសាស្ត្របង្រៀនឆ្លើយតបតាមកម្រិតសមត្ថភាពសិស្ស (Differentiated Instruction)',
    label: 'ឆ្លើយតបតាមសមត្ថភាពសិស្ស',
    en: 'Differentiated Instruction',
    description: 'បត់បែនខ្លឹមសារ និងល្បឿនរៀនតាមតម្រូវការ និងពហុបញ្ញារបស់សិស្សម្នាក់ៗ',
  },
  {
    id: 'វិធីសាស្ត្របង្រៀនតាមបែបថ្នាក់រៀនត្រឡប់ (Flipped Classroom)',
    label: 'ថ្នាក់រៀនត្រឡប់ (Flipped)',
    en: 'Flipped Classroom Model',
    description: 'សិស្សស្វ័យសិក្សាទ្រឹស្ដីមុនពេលចូលរៀន ហើយប្រើម៉ោងក្នុងថ្នាក់ដើម្បីពិភាក្សា អនុវត្ត និងដោះស្រាយបញ្ហាជាក់ស្ដែង',
  },
  {
    id: 'វិធីសាស្ត្របង្រៀនបែបបង្ហាញសកម្មភាពជាលំដាប់ (I Do, We Do, You Do - Explicit Instruction)',
    label: 'I Do, We Do, You Do',
    en: 'Gradual Release / Explicit',
    description: 'គ្រូធ្វើគំរូជាមុន (I Do) រួចគ្រូនិងសិស្សធ្វើរួមគ្នា (We Do) និងសិស្សស្វ័យអនុវត្តផ្ទាល់ខ្លួន (You Do)',
  },
  {
    id: 'វិធីសាស្ត្របង្រៀនបែបឆ្លុះបញ្ចាំង និងស្រាវជ្រាវសកម្មភាព (Reflective & Action-Oriented)',
    label: 'ឆ្លុះបញ្ចាំង និងស្រាវជ្រាវសកម្មភាព',
    en: 'Reflective & Action Learning',
    description: 'លើកទឹកចិត្តសិស្សឱ្យពិចារណាលើការរៀនរបស់ខ្លួន កត់ត្រាកំណត់ហេតុ និងកែលម្អការយល់ដឹងជាប្រចាំ',
  },
  {
    id: 'វិធីសាស្ត្របង្រៀនបែបចុះសង្កេត និងអនុវត្តជាក់ស្ដែង (Field Observation & Experiential)',
    label: 'ចុះសង្កេត និងអនុវត្តជាក់ស្ដែង',
    en: 'Field Observation & Experiential',
    description: 'ផ្សារភ្ជាប់មេរៀនទៅនឹងបរិស្ថានជុំវិញខ្លួន វត្ថុធាតុពិត និងទិន្នន័យជាក់ស្ដែងក្នុងសហគមន៍',
  },
];

export const TEACHING_STRATEGIES_LIST = [
  {
    id: 'យុទ្ធវិធី គិត-គូ-ចែករំលែក (Think-Pair-Share)',
    label: 'គិត-គូ-ចែករំលែក',
    en: 'Think-Pair-Share',
    icon: '👥',
    description: 'សិស្សគិតម្នាក់ឯង (Think) ពិភាក្សាជាមួយដៃគូ (Pair) និងចែករំលែករួមក្នុងថ្នាក់ (Share)',
  },
  {
    id: 'យុទ្ធវិធី ដើរទស្សនវិចិត្រសាល (Gallery Walk)',
    label: 'ដើរទស្សនវិចិត្រសាល',
    en: 'Gallery Walk',
    icon: '🖼️',
    description: 'ក្រុមបិទបង្ហាញស្នាដៃលើជញ្ជាំង សមាជិកដើរទស្សនា កត់ត្រា និងផ្តល់មតិកែលម្អលើក្រដាសស្អិត',
  },
  {
    id: 'យុទ្ធវិធី ផ្គុំបំណែក / ផ្គុំរូប (Jigsaw Technique)',
    label: 'ផ្គុំបំណែក (Jigsaw)',
    en: 'Jigsaw Technique',
    icon: '🧩',
    description: 'បំបែកក្រុមអ្នកជំនាញ (Expert Group) ទៅសិក្សាផ្នែកនីមួយៗ រួចត្រឡប់មកបង្រៀនក្រុមដើម (Home Group)',
  },
  {
    id: 'យុទ្ធវិធី តុកូដកម្ម / តុពិភាក្សាតុមូល (Round Table / Round Robin)',
    label: 'តុពិភាក្សាតុមូល',
    en: 'Round Table / Round Robin',
    icon: '🔄',
    description: 'សមាជិកក្រុមសរសេរ ឬនិយាយប្តូរវេនគ្នាតាមទ្រនិចនាឡិកាលើក្រដាសតែមួយដោយគ្មានការរំលង',
  },
  {
    id: 'យុទ្ធវិធី ផែនទីគំនិត / ផែនទីពុទ្ធិ (Mind Mapping)',
    label: 'ផែនទីគំនិត (Mind Mapping)',
    en: 'Mind / Concept Mapping',
    icon: '🧠',
    description: 'រៀបចំគំនិតសំខាន់ៗជាមែកធាង និងរូបភាពតភ្ជាប់ពីចំណុចស្នូលទៅចំណុចរង',
  },
  {
    id: 'យុទ្ធវិធី ក្ដារឈ្នួនឆ្លើយរហ័ស (Quick Slates / Mini-Whiteboards)',
    label: 'ក្ដារឈ្នួនឆ្លើយរហ័ស',
    en: 'Quick Slates / Whiteboards',
    icon: '📋',
    description: 'សិស្សទាំងអស់សរសេរចម្លើយលើក្ដារឈ្នួន ហើយលើកបង្ហាញដំណាលគ្នាដើម្បីគ្រូវាយតម្លៃរហ័ស',
  },
  {
    id: 'យុទ្ធវិធី បំផុសគំនិត (Brainstorming)',
    label: 'បំផុសគំនិត (Brainstorming)',
    en: 'Brainstorming',
    icon: '💡',
    description: 'ប្រមូលរាល់គំនិត និងទស្សនៈរបស់សិស្សឱ្យបានច្រើនបំផុតដោយសេរី មុននឹងចាត់ថ្នាក់ និងវិភាគ',
  },
  {
    id: 'យុទ្ធវិធី សំណួរចម្លើយតាមកម្រិតប្លូម (Bloom Questioning)',
    label: 'សំណួរចម្លើយតាមកម្រិតប្លូម',
    en: "Bloom's Taxonomy Questioning",
    icon: '❓',
    description: 'សួរសំណួរតាមលំដាប់លំដោយ ពីការចងចាំ យល់ដឹង អនុវត្ត រហូតដល់ការវិភាគ និងវាយតម្លៃខ្ពស់',
  },
  {
    id: 'យុទ្ធវិធី តារាង KWL (ដឹង - ចង់ដឹង - បានរៀន)',
    label: 'តារាង KWL (ដឹង-ចង់ដឹង-បានរៀន)',
    en: 'KWL Chart',
    icon: '📊',
    description: 'សិស្សបំពេញតារាង ៣ ជួរ៖ K (អ្វីដែលដឹងរួច), W (អ្វីដែលចង់ដឹង), L (អ្វីដែលបានរៀនក្រោយចប់មេរៀន)',
  },
  {
    id: 'យុទ្ធវិធី ដើរតួ និងត្រាប់តាម (Role Play & Simulation)',
    label: 'ដើរតួ និងត្រាប់តាម',
    en: 'Role Play & Simulation',
    icon: '🎭',
    description: 'សម្តែងតួអង្គ ឬបង្កើតស្ថានភាពក្លែងជាក់ស្តែងដើម្បីស្វែងយល់ពីអារម្មណ៍ និងដំណោះស្រាយបញ្ហា',
  },
  {
    id: 'យុទ្ធវិធី ជ្រុងទាំង ៤ (Four Corners)',
    label: 'ជ្រុងទាំង ៤ (Four Corners)',
    en: 'Four Corners',
    icon: '🧭',
    description: 'សិស្សដើរទៅជ្រុងបន្ទប់ទាំង ៤ (យល់ស្របទាំងស្រុង, យល់ស្រប, មិនយល់ស្រប, ជំទាស់) និងការពារទស្សនៈ',
  },
  {
    id: 'យុទ្ធវិធី អាងចិញ្ចឹមត្រី / ត្រីក្នុងថូ (Fishbowl Discussion)',
    label: 'អាងចិញ្ចឹមត្រី (Fishbowl)',
    en: 'Fishbowl Discussion',
    icon: '🐟',
    description: 'ក្រុមខាងក្នុងពិភាក្សាជជែកគ្នា ខណៈក្រុមខាងក្រៅអង្គុយស្តាប់ កត់ត្រា និងត្រៀមផ្លាស់ប្តូរចូល',
  },
  {
    id: 'យុទ្ធវិធី បាល់ព្រិល (Snowballing)',
    label: 'បាល់ព្រិល (Snowballing)',
    en: 'Snowballing Discussion',
    icon: '❄️',
    description: 'ចាប់ផ្តើមគិតម្នាក់ឯង រួចផ្គូផ្គងជា ២ នាក់ ពង្រីកជា ៤ នាក់ និងចុងក្រោយចែករំលែកពេញមួយថ្នាក់',
  },
  {
    id: 'យុទ្ធវិធី បង្រៀនមិត្តភក្តិ / មិត្តជួយមិត្ត (Peer Tutoring)',
    label: 'មិត្តជួយមិត្ត (Peer Tutoring)',
    en: 'Peer Tutoring / Reciprocal',
    icon: '🤝',
    description: 'សិស្សពូកែជួយពន្យល់ និងណែនាំមិត្តភក្តិ ឬផ្លាស់ប្តូរវេនគ្នាបង្រៀនមេរៀនទៅវិញទៅមក',
  },
  {
    id: 'យុទ្ធវិធី សន្លឹកកិច្ចការល្បាក់ (Tiered Worksheets)',
    label: 'សន្លឹកកិច្ចការល្បាក់',
    en: 'Tiered Worksheets / Scaffolding',
    icon: '📝',
    description: 'ផ្ដល់លំហាត់ជាលំដាប់កម្រិតលំបាក ផ្ដើមពីកម្រិតគាំទ្រខ្ពស់ រហូតដល់កម្រិតស្វ័យអនុវត្តពេញលេញ',
  },
  {
    id: 'យុទ្ធវិធី សំបុត្រចេញពីថ្នាក់ / បណ្ណចេញ (Exit Ticket)',
    label: 'សំបុត្រចេញពីថ្នាក់ (Exit Ticket)',
    en: 'Exit Ticket Assessment',
    icon: '🎫',
    description: 'សិស្សឆ្លើយសំណួរគន្លឹះ ឬបញ្ជាក់ការយល់ដឹងលើក្រដាសតូចមួយមុនពេលចាកចេញពីបន្ទប់រៀនដើម្បីគ្រូវាយតម្លៃរហ័ស',
  },
  {
    id: 'យុទ្ធវិធី ការរៀនតាមស្ថានីយ (Learning Stations / Station Rotation)',
    label: 'រៀនតាមស្ថានីយ (Stations)',
    en: 'Station Rotation / Stations',
    icon: '🎪',
    description: 'រៀបចំតុជាស្ថានីយផ្សេងៗគ្នា សិស្សផ្លាស់ប្តូរវេនទៅអនុវត្តសកម្មភាព និងជំនាញខុសៗគ្នាតាមពេលកំណត់',
  },
  {
    id: 'យុទ្ធវិធី កែសេចក្ដី និងវាយតម្លៃរួម (Peer Assessment & Rubric)',
    label: 'កែសេចក្ដី និងវាយតម្លៃរួម',
    en: 'Peer Assessment & Rubric',
    icon: '⚖️',
    description: 'សិស្សផ្លាស់ប្តូរកិច្ចការគ្នាទៅវិញទៅមកដើម្បីពិនិត្យ ផ្ដល់ពិន្ទុ និងមតិស្ថាបនាតាមតារាងរង្វាយតម្លៃ (Rubric)',
  },
  {
    id: 'យុទ្ធវិធី សំណួររហ័ស 3-2-1 (3-2-1 Reflection Strategy)',
    label: 'សំណួររហ័ស 3-2-1',
    en: '3-2-1 Reflection Strategy',
    icon: '🎯',
    description: 'សិស្សសរសេរ ៣ ចំណុចដែលបានរៀន, ២ ចំណុចដែលចាប់អារម្មណ៍បំផុត, និង ១ សំណួរដែលនៅសេសសល់',
  },
  {
    id: 'យុទ្ធវិធីចម្រុះស្របតាមសកម្មភាពជាក់ស្ដែង (Blended MoEYS Techniques)',
    label: 'យុទ្ធវិធីចម្រុះតាមសកម្មភាព',
    en: 'Blended MoEYS Techniques',
    icon: '✨',
    description: 'រួមបញ្ចូលគ្នានូវយុទ្ធវិធីជាច្រើនតាមភាពសមស្របនៃដំណាក់កាលនីមួយៗក្នុងជំហានទាំង ៥',
  },
];

const SUBJECT_LIST = [
  'ភាសាខ្មែរ',
  'គណិតវិទ្យា',
  'រូបវិទ្យា',
  'គីមីវិទ្យា',
  'ជីវវិទ្យា',
  'ប្រវត្តិវិទ្យា',
  'ភូមិវិទ្យា',
  'ផែនដី និងបរិស្ថានវិទ្យា',
  'ភាសាអង់គ្លេស',
  'សីលធម៌-ពលរដ្ឋវិទ្យា',
  'បច្ចេកវិទ្យា និងព័ត៌មានវិទ្យា (ICT)',
  'គេហវិទ្យា',
  'វិទ្យាសាស្ត្រ (បឋមសិក្សា)',
  'សិក្សាសង្គម (បឋមសិក្សា)',
  'សិល្បៈ និងគំនូរ',
];

const GRADE_LIST = [
  'ថ្នាក់ទី ១',
  'ថ្នាក់ទី ២',
  'ថ្នាក់ទី ៣',
  'ថ្នាក់ទី ៤',
  'ថ្នាក់ទី ៥',
  'ថ្នាក់ទី ៦',
  'ថ្នាក់ទី ៧',
  'ថ្នាក់ទី ៨',
  'ថ្នាក់ទី ៩',
  'ថ្នាក់ទី ១០',
  'ថ្នាក់ទី ១១',
  'ថ្នាក់ទី ១២',
];

const DURATION_LIST = [
  '៤០ នាទី',
  '៥០ នាទី (១ ម៉ោងសិក្សា)',
  '៩០ នាទី',
  '១០០ នាទី (២ ម៉ោងសិក្សា)',
];

export const LessonPlanForm: React.FC<LessonPlanFormProps> = ({
  onGenerate,
  isLoading,
}) => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('គណិតវិទ្យា');
  const [grade, setGrade] = useState('ថ្នាក់ទី ៩');
  const [duration, setDuration] = useState('៥០ នាទី (១ ម៉ោងសិក្សា)');
  const [chapter, setChapter] = useState('');
  const [lessonNo, setLessonNo] = useState('');
  const [teacherName, setTeacherName] = useState(() => localStorage.getItem('khmer_teacher_name') || 'គ្រូបង្រៀន');
  const [schoolName, setSchoolName] = useState(() => localStorage.getItem('khmer_school_name') || 'វិទ្យាល័យ / អនុវិទ្យាល័យ');
  const [focusKeywords, setFocusKeywords] = useState('');
  const [teachingMethod, setTeachingMethod] = useState(TEACHING_METHODS_LIST[0].id);
  const [teachingStrategy, setTeachingStrategy] = useState(TEACHING_STRATEGIES_LIST[0].id);
  const [difficultyLevel, setDifficultyLevel] = useState('មធ្យម (Intermediate)');
  const [integration, setIntegration] = useState('ការអប់រំបរិស្ថាន សុខភាព និងសីលធម៌រស់នៅស្អាត');
  const [includeIllustration, setIncludeIllustration] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    // Save defaults to localStorage for convenience
    localStorage.setItem('khmer_teacher_name', teacherName);
    localStorage.setItem('khmer_school_name', schoolName);

    await onGenerate({
      topic: topic.trim(),
      subject,
      grade,
      duration,
      chapter: chapter.trim(),
      lessonNo: lessonNo.trim(),
      teacherName: teacherName.trim(),
      schoolName: schoolName.trim(),
      focusKeywords: focusKeywords.trim(),
      teachingMethod,
      teachingStrategy,
      integration,
      difficultyLevel,
      isCustomTopic: true,
      includeIllustration,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-7">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              ១
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              សរសេរប្រធានបទមេរៀន និង បង្កើតកិច្ចតែងការ
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 pl-9">
            បញ្ចូលប្រធានបទ ឬចំណងជើងមេរៀនដោយការសរសេរផ្ទាល់ (<strong>មិនត្រូវការគំរូស្រាប់ឡើយ</strong>)។ ប្រព័ន្ធនឹងរៀបចំកិច្ចតែងការបង្រៀនស្តង់ដារ ៥ ជំហាន MoEYS ផ្ដោតចំលើប្រធានបទដែលលោកគ្រូ-អ្នកគ្រូបានសរសេរនេះ ១០០%។
          </p>
        </div>
        <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-amber-50 text-amber-800 text-xs px-3 py-1.5 rounded-full border border-amber-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
          <span>ស្តង់ដារ ៥ ជំហាន MoEYS</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Main Topic Field - Purely Written Input, No Preset Suggestions Needed */}
        <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
              <PenTool className="w-4 h-4 text-blue-600" />
              <span>ប្រធានបទ ឬ ចំណងជើងមេរៀន (បញ្ចូលដោយការសរសេរផ្ទាល់)</span>
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>សរសេរដោយសេរី មិនត្រូវការគំរូស្រាប់</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            លោកគ្រូ-អ្នកគ្រូវាយបញ្ចូលចំណងជើង ឬប្រធានបទថ្មីដែលចង់បង្រៀនចូលក្នុងប្រអប់ខាងក្រោមនេះ ប្រព័ន្ធនឹងបង្កើតកិច្ចតែងការបង្រៀនស្របតាមប្រធានបទនោះភ្លាមៗ៖
          </p>

          <div className="relative">
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="សូមសរសេរប្រធានបទ ឬចំណងជើងមេរៀននៅទីនេះ... (ឧ. ការប្រើ AI ក្នុងការស្រាវជ្រាវ, វិធីដោះស្រាយសមីការ, បំណិនជីវិត...)"
              className="w-full px-4 py-3.5 text-base rounded-xl border-2 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none transition bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal shadow-2xs"
            />
            {topic && (
              <button
                type="button"
                onClick={() => setTopic('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-md transition"
              >
                សម្អាតអក្សរ
              </button>
            )}
          </div>

          {/* Real-time topic confirmation banner */}
          {topic.trim() ? (
            <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-900 flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">ប្រធានបទដែលបានបញ្ចូល៖</span> «<strong className="text-emerald-950 font-bold underline decoration-emerald-400 underline-offset-2">{topic.trim()}</strong>»
                <p className="mt-1 text-emerald-800 text-xs">
                  កិច្ចតែងការបង្រៀននឹងត្រូវបង្កើតឡើងផ្ដោតចំលើចំណងជើងនេះសុទ្ធសាធ ដោយមានវត្ថុបំណង ខ្លឹមសារទ្រឹស្ដី ឧទាហរណ៍គំរូ និងលំហាត់អនុវត្តជាក់ស្ដែងស្របតាមប្រធានបទនេះ ១០០%។
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-2.5 text-xs text-slate-400 flex items-center gap-1.5">
              <span>💡</span>
              <span>លោកគ្រូ-អ្នកគ្រូអាចសរសេរប្រធានបទថ្មីៗ ឬប្រធានបទដែលគ្មានក្នុងសៀវភៅពុម្ពបានដោយសេរី។</span>
            </div>
          )}
        </div>

        {/* Row: Subject, Grade, Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              មុខវិជ្ជា
            </label>
            <div className="relative">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none pr-8 cursor-pointer"
              >
                {SUBJECT_LIST.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Grade */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              កម្រិតថ្នាក់
            </label>
            <div className="relative">
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none pr-8 cursor-pointer"
              >
                {GRADE_LIST.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              រយៈពេល / ម៉ោងបង្រៀន
            </label>
            <div className="relative">
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none pr-8 cursor-pointer font-medium text-slate-800"
              >
                {DURATION_LIST.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Difficulty Level Selector */}
        <div className="pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Gauge className="w-3.5 h-3.5 text-blue-600" />
              <span>កម្រិតលំបាកនៃមេរៀន (Difficulty Level)</span>
            </label>
            <span className="text-[11px] text-slate-500 font-medium">
              កំណត់ភាពស៊ីជម្រៅនៃការបង្រៀន (កំណត់នៅខាងក្រៅ មិនបង្ហាញលើសន្លឹកកិច្ចតែងការឡើយ)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {DIFFICULTY_LEVELS.map((lvl) => {
              const isSelected = difficultyLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setDifficultyLevel(lvl.id)}
                  className={`relative p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900">
                      <span className="text-base">{lvl.icon}</span>
                      <span>{lvl.label}</span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        ({lvl.sublabel})
                      </span>
                    </span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {lvl.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Duration & Steps Breakdown Banner */}
        {(() => {
          const breakdown = calculateStepDurations(duration);
          return (
            <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs">
              <div className="flex flex-wrap items-center justify-between gap-1.5 font-semibold text-blue-900 mb-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  ការបែងចែកនាទីតាម ៥ ជំហាន (ម៉ោងសរុប {breakdown.totalMinutes} នាទី)៖
                </span>
                <span className="text-emerald-700 bg-emerald-100/90 font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-200">
                  ✓ បូកស្មើ {breakdown.totalMinutes} នាទីគត់ (១០០%)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-slate-700 text-[11px]">
                <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
                  <span className="text-slate-500 block text-[10px]">ជំហានទី ១ (រដ្ឋបាល)</span>
                  <span className="font-bold text-slate-900 text-xs">{breakdown.step1Str}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
                  <span className="text-slate-500 block text-[10px]">ជំហានទី ២ (រំលឹក)</span>
                  <span className="font-bold text-slate-900 text-xs">{breakdown.step2Str}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border-2 border-blue-400 shadow-xs col-span-2 sm:col-span-1 bg-blue-50/40">
                  <span className="text-blue-700 font-bold block text-[10px]">ជំហានទី ៣ (មេរៀនថ្មី)</span>
                  <span className="font-extrabold text-blue-900 text-xs">{breakdown.step3Str}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
                  <span className="text-slate-500 block text-[10px]">ជំហានទី ៤ (ពង្រឹង)</span>
                  <span className="font-bold text-slate-900 text-xs">{breakdown.step4Str}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
                  <span className="text-slate-500 block text-[10px]">ជំហានទី ៥ (បណ្ដាំ)</span>
                  <span className="font-bold text-slate-900 text-xs">{breakdown.step5Str}</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-blue-900/90 font-medium flex items-center gap-1">
                <span>💡 <strong>មាត្រដ្ឋានខ្លឹមសារ៖</strong> {breakdown.depthGuidance} (រួមបញ្ចូលលំហាត់គំរូ និងការបកស្រាយដំណោះស្រាយគណនាជាលេខមួយជំហានម្តងៗ)</span>
              </div>
            </div>
          );
        })()}

        {/* Teaching Methods & Strategies Section (MoEYS Standard) */}
        <div className="pt-2 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                ២
              </span>
              <label className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>វិធីសាស្ត្រ និងយុទ្ធវិធីបង្រៀន (Methods & Strategies - MoEYS)</span>
              </label>
            </div>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 self-start sm:self-auto">
              <span>✓ ស្របតាមក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* 1. Teaching Method */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>វិធីសាស្ត្របង្រៀន (Teaching Methodology)</span>
                </label>
                <span className="text-[10px] text-slate-500 font-medium">{TEACHING_METHODS_LIST.length} វិធីសាស្ត្រ</span>
              </div>

              <div className="relative">
                <select
                  value={teachingMethod}
                  onChange={(e) => setTeachingMethod(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none pr-8 cursor-pointer font-medium text-slate-800"
                >
                  {TEACHING_METHODS_LIST.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Quick Pills for Popular Methods */}
              <div className="flex flex-wrap gap-1 pt-1">
                {['សិស្សមជ្ឈមណ្ឌល', '5E', 'ស្ថាបនានិយម', 'ស្វែងរកចំណេះដឹង', 'PBL', 'STEM'].map((shortName) => {
                  const target = TEACHING_METHODS_LIST.find((m) => m.label.includes(shortName) || m.id.includes(shortName));
                  if (!target) return null;
                  const isSel = teachingMethod === target.id;
                  return (
                    <button
                      key={shortName}
                      type="button"
                      onClick={() => setTeachingMethod(target.id)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                        isSel
                          ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {shortName}
                    </button>
                  );
                })}
              </div>

              {/* Method description */}
              {(() => {
                const curM = TEACHING_METHODS_LIST.find((m) => m.id === teachingMethod);
                if (!curM) return null;
                return (
                  <p className="text-[11px] text-slate-600 bg-white/90 p-2 rounded-lg border border-slate-200/60 leading-relaxed">
                    💡 <strong>{curM.label} ({curM.en})៖</strong> {curM.description}
                  </p>
                );
              })()}
            </div>

            {/* 2. Teaching Strategy / Technique */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-purple-600" />
                  <span>យុទ្ធវិធីបង្រៀន (Teaching Strategy / Technique)</span>
                </label>
                <span className="text-[10px] text-slate-500 font-medium">{TEACHING_STRATEGIES_LIST.length} យុទ្ធវិធី</span>
              </div>

              <div className="relative">
                <select
                  value={teachingStrategy}
                  onChange={(e) => setTeachingStrategy(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none pr-8 cursor-pointer font-medium text-slate-800"
                >
                  {TEACHING_STRATEGIES_LIST.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.id}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Quick Pills for Popular Strategies */}
              <div className="flex flex-wrap gap-1 pt-1">
                {['គិត-គូ-ចែករំលែក', 'ដើរទស្សនវិចិត្រសាល', 'ផ្គុំបំណែក', 'ក្ដារឈ្នួនឆ្លើយរហ័ស', 'តុពិភាក្សាតុមូល', 'ផែនទីគំនិត'].map((shortName) => {
                  const target = TEACHING_STRATEGIES_LIST.find((s) => s.label.includes(shortName) || s.id.includes(shortName));
                  if (!target) return null;
                  const isSel = teachingStrategy === target.id;
                  return (
                    <button
                      key={shortName}
                      type="button"
                      onClick={() => setTeachingStrategy(target.id)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                        isSel
                          ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span>{target.icon}</span>
                      <span>{shortName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Strategy description */}
              {(() => {
                const curS = TEACHING_STRATEGIES_LIST.find((s) => s.id === teachingStrategy);
                if (!curS) return null;
                return (
                  <p className="text-[11px] text-purple-950 bg-purple-50/70 p-2 rounded-lg border border-purple-200/70 leading-relaxed">
                    <span>{curS.icon} </span>
                    <strong>{curS.label} ({curS.en})៖ </strong>
                    <span>{curS.description}</span>
                  </p>
                );
              })()}
            </div>
          </div>
        </div>

        {/* AI Auto Topic Illustration Toggle Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          includeIllustration
            ? 'bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-cyan-50/80 border-emerald-300/80 shadow-2xs'
            : 'bg-slate-50/80 border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                includeIllustration ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
              }`}>
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    រូបភាពឧបទេស AI Auto ទៅតាមប្រធានបទ (AI Topic Visual Aid)
                  </h4>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300/80">
                    ✨ AI Auto
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed">
                  ប្រព័ន្ធនឹងរៀបចំ និងបង្កើតរូបភាពឧបទេស/ដ្យាក្រាមគរុកោសល្យ AI ផ្ដោតចំលើប្រធានបទ «{topic || 'មេរៀន'}» ស្វ័យប្រវត្តិ សម្រាប់បិទបង្ហាញលើក្ដារខៀន និងប្រើប្រាស់ក្នុងជំហានទី ៣ (មេរៀនថ្មី)។
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 self-end sm:self-center">
              <input
                type="checkbox"
                checked={includeIllustration}
                onChange={(e) => setIncludeIllustration(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-2 text-xs font-semibold text-slate-700">
                {includeIllustration ? 'បើកដំណើរការ' : 'បិទ'}
              </span>
            </label>
          </div>
        </div>

        {/* Toggle Advanced Options */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium py-1"
          >
            <span>{showAdvanced ? 'លាក់ព័ត៌មានលម្អិតបន្ថែម' : 'បង្ហាញព័ត៌មានបន្ថែម (ឈ្មោះសាលា ឈ្មោះគ្រូ ជំពូក និងការផ្ដោត)'}</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Advanced Section */}
        {showAdvanced && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ឈ្មោះសាលារៀន
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="ឧ. វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ឈ្មោះគ្រូបង្រៀន
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="ឧ. លោកគ្រូ / អ្នកគ្រូ..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ជំពូកទី (ស្រេចចិត្ត)
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="ឧ. ជំពូកទី ៣៖ សមីការ"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  មេរៀនទី (ស្រេចចិត្ត)
                </label>
                <input
                  type="text"
                  value={lessonNo}
                  onChange={(e) => setLessonNo(e.target.value)}
                  placeholder="ឧ. មេរៀនទី ១"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ការបញ្ជ្រាប (Integration ឧ. បរិស្ថាន, សុខភាព, សីលធម៌, សុវត្ថិភាពចរាចរណ៍)
              </label>
              <input
                type="text"
                value={integration}
                onChange={(e) => setIntegration(e.target.value)}
                placeholder="ឧ. ការអប់រំបរិស្ថាន សុខភាព និងសីលធម៌រស់នៅស្អាត..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {[
                  'បរិស្ថាន & ជីវចម្រុះ',
                  'សុខភាព & អនាម័យ',
                  'សីលធម៌ & ពលរដ្ឋល្អ',
                  'សុវត្ថិភាពចរាចរណ៍',
                  'បច្ចេកវិទ្យាឌីជីថល',
                  'សមភាពយេនឌ័រ',
                  'អក្ខរកម្មហិរញ្ញវត្ថុ',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setIntegration(chip)}
                    className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ការផ្ដោតសំខាន់ ឬសម្គាល់បន្ថែម (ស្រេចចិត្ត)
              </label>
              <input
                type="text"
                value={focusKeywords}
                onChange={(e) => setFocusKeywords(e.target.value)}
                placeholder="ឧ. ផ្ដោតលើការងារជាក្រុម, សិស្សអនុវត្តលំហាត់ជាក់ស្ដែង, ប្រើក្ដារឈ្នួន..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Generate Action Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg shadow-blue-500/20 transition-all text-base sm:text-lg"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>កំពុងបង្កើតកិច្ចតែងការដោយ AI...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>បង្កើតកិច្ចតែងការបង្រៀនភ្លាមៗ</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
