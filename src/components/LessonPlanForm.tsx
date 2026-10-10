import React, { useState, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  Clock,
  User,
  School,
  Wand2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Gauge,
  PenTool,
  Lightbulb,
  Users,
  Compass,
  Target,
  Image as ImageIcon,
  FileText,
  RotateCcw,
  UploadCloud,
  FileUp,
  X,
  File,
  AlertCircle,
  Check,
  Loader2,
  BookMarked,
  Search,
  Layers,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';
import { GenerateLessonPlanRequest, UploadedLessonFile, BookOutlineItem } from '../types/lessonPlan';
import { calculateStepDurations } from '../utils/durationHelper';
import { useLanguage } from '../i18n/LanguageContext';
import { VoiceMicButton } from './VoiceMicButton';

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
  const { t, language } = useLanguage();
  const [topic, setTopic] = useState('');
  const [contentMode, setContentMode] = useState<'file' | 'text' | 'both'>('file');
  const [customLessonContent, setCustomLessonContent] = useState('');
  const [subject, setSubject] = useState('គណិតវិទ្យា');
  const [grade, setGrade] = useState('ថ្នាក់ទី ៩');
  const [duration, setDuration] = useState('៥០ នាទី (១ ម៉ោងសិក្សា)');
  const [chapter, setChapter] = useState('');
  const [lessonNo, setLessonNo] = useState('');
  const [targetPage, setTargetPage] = useState('');
  const [teacherName, setTeacherName] = useState(() => localStorage.getItem('khmer_teacher_name') || 'គ្រូបង្រៀន');
  const [schoolName, setSchoolName] = useState(() => localStorage.getItem('khmer_school_name') || 'វិទ្យាល័យ / អនុវិទ្យាល័យ');
  const [focusKeywords, setFocusKeywords] = useState('');
  const [teachingMethod, setTeachingMethod] = useState(TEACHING_METHODS_LIST[0].id);
  const [teachingStrategy, setTeachingStrategy] = useState(TEACHING_STRATEGIES_LIST[0].id);
  const [difficultyLevel, setDifficultyLevel] = useState('មធ្យម (Intermediate)');
  const [integration, setIntegration] = useState('ការអប់រំបរិស្ថាន សុខភាព និងសីលធម៌រស់នៅស្អាត');
  const [includeIllustration, setIncludeIllustration] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // File Upload State
  const [uploadedFiles, setUploadedFiles] = useState<UploadedLessonFile[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [selectedOutlineIdx, setSelectedOutlineIdx] = useState<number | null>(null);
  const [showExtractedPreview, setShowExtractedPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsScanning(true);
    setScanError(null);

    const newFiles: UploadedLessonFile[] = [...uploadedFiles];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const res = (reader.result as string) || '';
            const commaIdx = res.indexOf(',');
            resolve(commaIdx >= 0 ? res.substring(commaIdx + 1) : res);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const mime = file.type || (
          file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' :
          file.name.toLowerCase().endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
          file.name.toLowerCase().endsWith('.txt') ? 'text/plain' :
          file.name.toLowerCase().endsWith('.md') ? 'text/markdown' : 'application/octet-stream'
        );

        const item: UploadedLessonFile = {
          name: file.name,
          type: mime,
          size: file.size,
          base64Data,
        };

        // Call backend /api/parse-lesson-file to parse outline and preview
        try {
          const res = await fetch('/api/parse-lesson-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: item.name,
              fileType: item.type,
              fileBase64: item.base64Data,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            item.extractedText = data.extractedPreview || '';
            item.detectedOutline = data.detectedOutline || [];
            item.detectedTopic = data.detectedTopic || '';

            if (data.detectedTopic && !topic) {
              setTopic(data.detectedTopic);
            }
            if (data.detectedOutline && data.detectedOutline.length > 0) {
              const first = data.detectedOutline[0];
              if (!chapter && first.chapter) setChapter(first.chapter);
              if (!lessonNo && first.lesson) setLessonNo(first.lesson);
              if (!topic && first.topic) setTopic(first.topic);
              if (!targetPage && first.page) setTargetPage(first.page);
            }
          }
        } catch (e) {
          console.warn('Scan notice:', e);
        }

        newFiles.push(item);
      } catch (err: any) {
        console.error('File load error:', err);
        setScanError('មិនអាចផ្ទុក file នេះបានទេ៖ ' + (err?.message || ''));
      }
    }

    setUploadedFiles(newFiles);
    setIsScanning(false);
  };

  const handleSelectOutline = (item: BookOutlineItem, idx: number) => {
    setSelectedOutlineIdx(idx);
    if (item.chapter) setChapter(item.chapter);
    if (item.lesson) setLessonNo(item.lesson);
    if (item.topic) setTopic(item.topic);
    if (item.page) setTargetPage(item.page);
  };

  const handleRemoveFile = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
    if (uploadedFiles.length <= 1) {
      setSelectedOutlineIdx(null);
    }
  };

  const handleCopyExtractedToCustom = () => {
    const combined = uploadedFiles
      .map((f) => (f.extractedText ? f.extractedText : ''))
      .filter(Boolean)
      .join('\n\n');
    if (combined) {
      setCustomLessonContent((prev) => (prev ? `${prev}\n\n${combined}` : combined));
      setContentMode('text');
    }
  };

  const handleApplySampleContent = (type: 'khmer' | 'math' | 'physics' | 'agri') => {
    setContentMode('text');
    if (type === 'khmer') {
      setTopic('ការតែងសេចក្តីបែបពន្យល់ «ចំណេះវិជ្ជាជាទ្រព្យមិនចេះរលាយ»');
      setSubject('ភាសាខ្មែរ');
      setGrade('ថ្នាក់ទី ៨');
      setCustomLessonContent(`សុភាសិតខ្មែរពោលថា «ចំណេះវិជ្ជាជាទ្រព្យមិនចេះរលាយ»។
សេចក្ដីពន្យល់ពីអត្ថន័យ៖
១. ពាក្យគន្លឹះ៖ "ចំណេះវិជ្ជា" គឺជាការចេះដឹង ការយល់ដឹងលើក្បួនខ្នាត និងវិជ្ជាជីវៈផ្សេងៗ; "ទ្រព្យមិនចេះរលាយ" គឺជាទ្រព្យសម្បត្តិដ៏គង់វង្ស ជាប់នឹងខ្លួន គ្មានចោរណាម្នាក់អាចលួចប្លន់បានឡើយ។
២. ខ្លឹមសារពន្យល់៖ ទ្រព្យសម្បត្តិក្រៅខ្លួនដូចជាមាស ប្រាក់ ដីធ្លី អាចបាត់បង់ដោយសារភ្លើងឆេះ ទឹកជំនន់ ឬចោរលួច ប៉ុន្តែចំណេះវិជ្ជានៅតែស្ថិតស្ថេរជាប់នឹងខ្លួនជានិច្ច។
៣. ឧទាហរណ៍ជាក់ស្ដែង៖ បុគ្គលដែលមានចំណេះដឹង ទោះបីធ្លាក់ទៅដល់ទីណាក៏អាចប្រើចំណេះដឹងមកកសាងជីវិតឡើងវិញ និងជួយសង្គមជាតិបានដែរ។
៤. សន្និដ្ឋាន៖ សិស្សានុសិស្សត្រូវខិតខំរៀនសូត្រឱ្យអស់ពីសមត្ថភាព ព្រោះចំណេះវិជ្ជាគឺជាស្ពានឆ្ពោះទៅកាន់អនាគតភ្លឺស្វាង។`);
    } else if (type === 'math') {
      setTopic('ទ្រឹស្ដីបទពីតាក័រ និងការអនុវត្តគណនាប្រវែងជ្រុងក្នុងត្រីកោណកែង');
      setSubject('គណិតវិទ្យា');
      setGrade('ថ្នាក់ទី ៩');
      setCustomLessonContent(`ទ្រឹស្ដីបទពីតាក័រ (Pythagorean Theorem)៖
ក្នុងត្រីកោណកែងមួយ ការ៉េនៃអ៊ីប៉ូតេនុសស្មើនឹងផលបូកការ៉េនៃជ្រុងមុំកែងពីរទៀត។
រូបមន្ត៖ BC² = AB² + AC² (បើកែងត្រង់ A នោះ BC ជាអ៊ីប៉ូតេនុស) => BC = √(AB² + AC²)

លំហាត់គំរូសៀវភៅពុម្ព៖
ត្រីកោណ ABC កែងត្រង់ A ដែលមានប្រវែងជ្រុងមុំកែង AB = 6 cm និង AC = 8 cm។
ចូរគណនាប្រវែងអ៊ីប៉ូតេនុស BC។
ដំណោះស្រាយគំរូ៖
- តាមទ្រឹស្ដីបទពីតាក័រ៖ BC² = AB² + AC²
- ជំនួសលេខ៖ BC² = 6² + 8² = 36 + 64 = 100
- នាំឱ្យ៖ BC = √100 = 10 cm។
ចម្លើយ៖ អ៊ីប៉ូតេនុស BC = 10 cm។

លំហាត់អនុវត្តសិស្ស៖ គណនា BC បើ AB = 5 cm និង AC = 12 cm។`);
    } else if (type === 'physics') {
      setTopic('ច្បាប់ទី ២ ញូតុន និងការគណនាកម្លាំងចលករ');
      setSubject('រូបវិទ្យា');
      setGrade('ថ្នាក់ទី ១០');
      setCustomLessonContent(`ច្បាប់ទី ២ ញូតុន (Newton's Second Law of Motion)៖
សំទុះនៃអង្គធាតុមួយសមាមាត្រនឹងកម្លាំងផ្គួបមានទិសដៅដូចកម្លាំង និងច្រាសសមាមាត្រនឹងម៉ាសរបស់អង្គធាតុ។
រូបមន្ត៖ F = m × a
ក្នុងនោះ៖
- F ៖ កម្លាំងចលករ គិតជា ញូតុន (N)
- m ៖ ម៉ាសអង្គធាតុ គិតជា គីឡូក្រាម (kg)
- a ៖ សំទុះ គិតជា ម៉ែត្រក្នុងមួយវិនាទីការ៉េ (m/s²)

លំហាត់ជាក់ស្ដែងសៀវភៅពុម្ព៖
រថយន្តមួយមានម៉ាស m = 1200 kg ចាប់ផ្ដើមរត់ចេញពីស្ងៀម (v₀ = 0) ដោយសំទុះ a = 2.5 m/s² ក្នុងរយៈពេល t = 10 s។
ចូរគណនា៖
១. កម្លាំងចលករ F ដែលម៉ាស៊ីនរថយន្តបង្កើតឡើង
២. ល្បឿន v របស់រថយន្តនៅចុងវិនាទីទី ១០ (គិតជា m/s និង km/h)។
ក្បួនគណនា៖ F = 1200 × 2.5 = 3000 N; v = a × t = 2.5 × 10 = 25 m/s (ស្មើ 90 km/h)។`);
    } else if (type === 'agri') {
      setTopic('វិធីសាស្ត្រផលិតជីកំប៉ុសធម្មជាតិពីសំណល់សរីរាង្គក្នុងសហគមន៍');
      setSubject('កសិកម្ម');
      setGrade('ថ្នាក់ទី ៧');
      setCustomLessonContent(`បច្ចេកទេសផលិតជីកំប៉ុសធម្មជាតិ (Compost Production)៖
១. វត្ថុធាតុដើមចាំបាច់៖
- ធាតុបៃតង (អាសូតខ្ពស់)៖ កាកសំណល់បន្លែ ផ្លែឈើ សំបកចេក ស្មៅស្រស់
- ធាតុត្នោត (កាបូនខ្ពស់)៖ ស្លឹកឈើស្ងួត ចំបើង កម្ទេចកំប្លោក អង្កាម
២. ដំណាក់កាលអនុវត្ត ៤ ជំហាន៖
- ជំហាន ១៖ រៀបចំកន្លែងដាក់ (រណ្ដៅ ឬកញ្ច្រែងទំហំ ១m × ១m)
- ជំហាន ២៖ រៀបស្រទាប់ឆ្លាស់គ្នា (ស្រទាប់ត្នោតកម្រាស់ ១០cm រួចស្រទាប់បៃតង ៥cm)
- ជំហាន ៣៖ ស្រោចទឹកល្មមសើម (កម្រិតសំណើម ៥០-៦០%)
- ជំហាន ៤៖ ច្របល់ខ្យល់រៀងរាល់ ៧ ថ្ងៃម្តងដើម្បីឱ្យបាក់តេរីដង្ហើមល្អ។
៣. លទ្ធផលរំពឹងទុក៖ ក្រោយរយៈពេល ៣០ ទៅ ៤៥ ថ្ងៃ ជីកំប៉ុសនឹងមានពណ៌ត្នោតចាស់ ក្លិនដូចដីព្រៃ និងគ្មានក្លិនស្អុយ ត្រៀមប្រើប្រាស់សម្រាប់ដាំបន្លែសរីរាង្គ។`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const primaryFile = uploadedFiles[0];
    const finalTopic =
      topic.trim() ||
      (lessonNo.trim()
        ? `មេរៀន ${lessonNo.trim()}`
        : chapter.trim()
        ? `ជំពូក ${chapter.trim()}`
        : primaryFile?.detectedTopic ||
          (customLessonContent.trim() ? customLessonContent.trim().split('\n')[0].replace(/^[#*\-•\s]+/, '').slice(0, 60) : '') ||
          'មេរៀនតាមសៀវភៅពុម្ព');

    if (!finalTopic.trim()) return;

    // Save defaults to localStorage for convenience
    localStorage.setItem('khmer_teacher_name', teacherName);
    localStorage.setItem('khmer_school_name', schoolName);

    await onGenerate({
      topic: finalTopic.trim(),
      subject,
      grade,
      duration,
      chapter: chapter.trim(),
      lessonNo: lessonNo.trim(),
      targetPage: targetPage.trim(),
      teacherName: teacherName.trim(),
      schoolName: schoolName.trim(),
      focusKeywords: focusKeywords.trim(),
      customLessonContent: customLessonContent.trim(),
      uploadedFile: primaryFile,
      uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      teachingMethod,
      teachingStrategy,
      integration,
      difficultyLevel,
      isCustomTopic: uploadedFiles.length === 0,
      includeIllustration,
    });
  };

  const allDetectedOutline: Array<{ item: BookOutlineItem; fileIdx: number }> = [];
  uploadedFiles.forEach((file, fIdx) => {
    if (file.detectedOutline && Array.isArray(file.detectedOutline)) {
      file.detectedOutline.forEach((item) => {
        allDetectedOutline.push({ item, fileIdx: fIdx });
      });
    }
  });

  const canSubmit =
    !isLoading &&
    (topic.trim().length > 0 ||
      customLessonContent.trim().length > 0 ||
      (uploadedFiles.length > 0 &&
        (chapter.trim().length > 0 || lessonNo.trim().length > 0 || (uploadedFiles[0]?.detectedTopic?.length || 0) > 0)));

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
              ប្រធានបទមេរៀន និង ឯកសារជំនួយ (សៀវភៅពុម្ព)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 pl-9">
            បញ្ចូលប្រធានបទមេរៀនដោយផ្ទាល់ ឬ/និង Upload file សៀវភៅពុម្ព (PDF, Word, TXT, រូបភាព) ដើម្បីបង្កើតកិច្ចតែងការបង្រៀនស្តង់ដារ ៥ ជំហាន MoEYS យ៉ាងសុក្រឹត ១០០%។
          </p>
        </div>
        <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-amber-50 text-amber-800 text-xs px-3 py-1.5 rounded-full border border-amber-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
          <span>ស្តង់ដារ ៥ ជំហាន MoEYS</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {/* UNIFIED LESSON TOPIC & TEXTBOOK INTEGRATION SECTION (រួមគ្នាតែមួយ) */}
        <div className="bg-gradient-to-br from-slate-50/90 via-blue-50/30 to-indigo-50/20 p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-4">
          {/* Main Topic Input Field */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
                <PenTool className="w-4 h-4 text-blue-600" />
                <span>ប្រធានបទ ឬ ចំណងជើងមេរៀន (Lesson Topic / Title)</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-semibold text-blue-800 bg-blue-100/80 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>សរសេរផ្ទាល់ ឬស្រង់ស្វ័យប្រវត្តពីសៀវភៅ</span>
              </span>
            </div>

            <p className="text-xs text-slate-500">
              លោកគ្រូ-អ្នកគ្រូវាយបញ្ចូលប្រធានបទមេរៀននៅទីនេះ ឬជ្រើសរើសចេញពីបញ្ជីមេរៀនក្នុង file សៀវភៅពុម្ពខាងក្រោម៖
            </p>

            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="ឧ. ទ្រឹស្ដីបទពីតាក័រ, កម្លាំងចលករ, សមីការដឺក្រេទី២, វិធីផលិតជីកំប៉ុស... (ឬទុកឱ្យ AI ស្រង់ស្វ័យប្រវត្តពីសៀវភៅ)"
                className="w-full px-4 py-3 text-sm sm:text-base rounded-xl border-2 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none transition bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal shadow-2xs"
              />
              {topic && (
                <button
                  type="button"
                  onClick={() => setTopic('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-md transition"
                >
                  សម្អាត
                </button>
              )}
            </div>

            {/* Real-time topic confirmation banner */}
            {topic.trim() && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">ប្រធានបទដែលបានកំណត់៖</span> «<strong className="text-emerald-950 font-bold underline decoration-emerald-400 underline-offset-2">{topic.trim()}</strong>»
                  <p className="mt-0.5 text-emerald-800 text-[11px]">
                    កិច្ចតែងការបង្រៀននឹងត្រូវបង្កើតឡើងផ្ដោតចំលើចំណងជើងនេះសុទ្ធសាធ ដោយមានវត្ថុបំណង ខ្លឹមសារទ្រឹស្ដី ឧទាហរណ៍គំរូ និងលំហាត់អនុវត្តជាក់ស្ដែងស្របតាមប្រធានបទនេះ ១០០%។
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Chapter, Lesson Number & Page Precision Matcher */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white/85 border border-blue-100/90 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>ជំពូក មេរៀន និង ទំព័រសៀវភៅ (Chapter, Lesson & Page)</span>
              </label>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                ស្រេចចិត្ត (Optional)
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              {t.bookTargetNote}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Target Chapter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {t.targetChapterLabel}
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder={t.targetChapterPlaceholder}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                />
              </div>

              {/* Target Lesson */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {t.targetLessonLabel}
                </label>
                <input
                  type="text"
                  value={lessonNo}
                  onChange={(e) => setLessonNo(e.target.value)}
                  placeholder={t.targetLessonPlaceholder}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                />
              </div>

              {/* Target Page */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {t.targetPageLabel}
                </label>
                <input
                  type="text"
                  value={targetPage}
                  onChange={(e) => setTargetPage(e.target.value)}
                  placeholder={t.targetPagePlaceholder}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* UNIFIED FILE & TEXT CONTENT SECTION (កន្លែងតែមួយ - អាចបញ្ចូល File ក៏បាន ជាអត្ថបទក៏បាន) */}
        <div className={`rounded-2xl border-2 transition-all p-4 sm:p-5 space-y-4 ${
          uploadedFiles.length > 0 || customLessonContent.trim()
            ? 'bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-white border-blue-300 shadow-xs'
            : 'bg-gradient-to-br from-slate-50/90 via-blue-50/20 to-white border-slate-200'
        }`}>
          {/* Header & Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shadow-2xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    ឯកសារយោង និង ខ្លឹមសារមេរៀន (File ឬ អត្ថបទ)
                  </h3>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    បញ្ចូល File ក៏បាន ជាអត្ថបទក៏បាន
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1 pl-10 leading-relaxed">
                លោកគ្រូ-អ្នកគ្រូអាចជ្រើសរើស <strong>បញ្ចូលជា File</strong> (PDF, Word, TXT, រូបភាព) ក៏បាន ឬ <strong>បញ្ចូលជាអត្ថបទ</strong> (Text) ក៏បាន ឬប្រើទាំងពីររួមគ្នា។
              </p>
            </div>

            {/* Segmented Mode Selector Buttons */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl self-start sm:self-auto border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setContentMode('file')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  contentMode === 'file'
                    ? 'bg-white text-blue-700 shadow-2xs border border-blue-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>បញ្ចូលជា File</span>
                {uploadedFiles.length > 0 && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                    {uploadedFiles.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setContentMode('text')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  contentMode === 'text'
                    ? 'bg-white text-indigo-700 shadow-2xs border border-indigo-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>បញ្ចូលជាអត្ថបទ</span>
                {customLessonContent.trim().length > 0 && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                    {customLessonContent.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setContentMode('both')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  contentMode === 'both'
                    ? 'bg-white text-purple-700 shadow-2xs border border-purple-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>ប្រើទាំងពីរ (File + Text)</span>
              </button>
            </div>
          </div>

          {/* Joint Indicator when both File and Text have content */}
          {uploadedFiles.length > 0 && customLessonContent.trim().length > 0 && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>បានបញ្ចូលទាំងពីរ៖</strong> ភ្ជាប់ {uploadedFiles.length} file និងអត្ថបទ {customLessonContent.length} តួអក្សរ។ AI នឹងសំយោគខ្លឹមសារទាំងពីររួមគ្នា ១០០% ដើម្បីបង្កើតកិច្ចតែងការបង្រៀនឱ្យកាន់តែសុក្រឹត!
                </span>
              </div>
              {contentMode !== 'both' && (
                <button
                  type="button"
                  onClick={() => setContentMode('both')}
                  className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline shrink-0 cursor-pointer"
                >
                  មើលទាំងពីរ →
                </button>
              )}
            </div>
          )}

          {/* PART 1: FILE UPLOAD (Visible in 'file' or 'both' mode) */}
          {(contentMode === 'file' || contentMode === 'both') && (
            <div className="space-y-3 pt-1 animate-fadeIn">
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
                  <UploadCloud className="w-4 h-4 text-blue-600" />
                  <span>ឯកសារសៀវភៅពុម្ព ឬ ឯកសារមេរៀន (PDF, Word, TXT, រូបភាព)</span>
                </label>
                {uploadedFiles.length > 0 ? (
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{uploadedFiles.length} file បានភ្ជាប់</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    ស្រេចចិត្ត (Optional)
                  </span>
                )}
              </div>

              {/* Dropzone Card */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files) {
                    handleFiles(e.dataTransfer.files);
                  }
                }}
                className={`p-4 sm:p-5 rounded-xl border-2 border-dashed transition-all text-center ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                    : uploadedFiles.length > 0
                    ? 'border-blue-300 bg-gradient-to-br from-blue-50/50 to-white'
                    : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-blue-50/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.txt,.md,image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFiles(e.target.files);
                    }
                  }}
                  className="hidden"
                />

                <div className="max-w-xl mx-auto flex flex-col items-center">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 shadow-2xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>

                  <h4 className="text-xs sm:text-base font-bold text-slate-800 mb-0.5">
                    {t.uploadFileLabel}
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                    {t.uploadFileSub}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                    <span className="text-[10px] font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                      📄 PDF (.pdf)
                    </span>
                    <span className="text-[10px] font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                      📝 Word (.docx)
                    </span>
                    <span className="text-[10px] font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                      📃 អត្ថបទ (.txt)
                    </span>
                    <span className="text-[10px] font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                      🖼️ រូបភាពសៀវភៅ (.jpg, .png)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <FileUp className="w-4 h-4" />
                    <span>{uploadedFiles.length > 0 ? '+ បន្ថែម File សៀវភៅ / មេរៀនទៀត' : t.uploadFileBtn}</span>
                  </button>
                </div>
              </div>

              {/* Scanning indicator */}
              {isScanning && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2.5 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
                  <span className="font-medium">{t.uploadScanning}</span>
                </div>
              )}

              {/* Scan Error */}
              {scanError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{scanError}</span>
                </div>
              )}

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                    <span>ឯកសារដែលបាន Upload ({uploadedFiles.length})៖</span>
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{t.uploadSuccess}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {uploadedFiles.map((f, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 shadow-2xs hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-[11px]">
                            {f.name.toLowerCase().endsWith('.pdf') ? 'PDF' : f.name.toLowerCase().endsWith('.docx') ? 'DOC' : 'TXT'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate" title={f.name}>
                              {f.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {Math.round(f.size / 1024)} KB
                              {f.detectedTopic && ` • ${f.detectedTopic}`}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer shrink-0"
                          title={t.uploadRemove}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detected Outline Navigator (Table of Contents extracted from Book) */}
              {allDetectedOutline.length > 0 && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                      <BookMarked className="w-4 h-4 text-indigo-600" />
                      <span>{t.bookScanOutlineTitle}</span>
                    </div>
                    <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                      រកឃើញ {allDetectedOutline.length} មេរៀន
                    </span>
                  </div>

                  <p className="text-[11px] text-indigo-900/80 leading-relaxed">
                    ចុចលើមេរៀនណាមួយខាងក្រោមដើម្បីបំពេញស្វ័យប្រវត្តនូវ <strong>ប្រធានបទ</strong>, <strong>ជំពូក</strong>, និង <strong>មេរៀន</strong> ខាងលើ៖
                  </p>

                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {allDetectedOutline.map(({ item }, idx) => {
                      const isSelected = selectedOutlineIdx === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectOutline(item, idx)}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                              : 'bg-white hover:bg-indigo-50/80 border-indigo-100 text-slate-800 hover:border-indigo-300'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              {item.chapter && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                  isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {item.chapter}
                                </span>
                              )}
                              <span className="font-semibold">{item.lesson || `មេរៀន ${idx + 1}`}</span>
                              {item.page && (
                                <span className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                                  ({item.page})
                                </span>
                              )}
                            </div>
                            {item.topic && (
                              <p className={`text-xs mt-0.5 truncate ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                                {item.topic}
                              </p>
                            )}
                          </div>

                          <span className={`shrink-0 text-xs ${isSelected ? 'text-white' : 'text-indigo-600'}`}>
                            {isSelected ? '✓ ជ្រើសរើស' : 'ជ្រើសរើស ->'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Text Excerpt Preview from Book */}
              {uploadedFiles.some((f) => f.extractedText) && (
                <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setShowExtractedPreview(!showExtractedPreview)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{showExtractedPreview ? 'បង្រួមអត្ថបទដែលបានស្រង់ពីសៀវភៅ' : 'មើលអត្ថបទដែលបានស្រង់ចេញពី file សៀវភៅ'}</span>
                    {showExtractedPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyExtractedToCustom}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>ចម្លងអត្ថបទចេញពី File ទៅកាន់ប្រអប់អត្ថបទ →</span>
                  </button>

                  {showExtractedPreview && (
                    <div className="w-full mt-2 p-3 bg-white border border-slate-200 rounded-xl max-h-48 overflow-y-auto text-xs text-slate-700 whitespace-pre-line font-sans leading-relaxed animate-fadeIn">
                      {uploadedFiles
                        .map((f) => (f.extractedText ? `[${f.name}]:\n${f.extractedText}` : ''))
                        .filter(Boolean)
                        .join('\n\n')}
                    </div>
                  )}
                </div>
              )}

              {/* Quick switch to Text mode link */}
              {contentMode === 'file' && (
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>ឬចង់វាយ ឬចម្លងជាអត្ថបទផ្ទាល់?</span>
                  <button
                    type="button"
                    onClick={() => setContentMode('text')}
                    className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>ប្ដូរទៅវាយជាអត្ថបទ (Text)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PART 2: TEXT CONTENT (Visible in 'text' or 'both' mode) */}
          {(contentMode === 'text' || contentMode === 'both') && (
            <div className={`space-y-3 animate-fadeIn ${contentMode === 'both' ? 'pt-4 border-t-2 border-slate-200/80' : 'pt-1'}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>{t.customLessonContentLabel} (សរសេរ ឬ ចម្លងអត្ថបទ)</span>
                </label>
                <div className="flex items-center gap-2">
                  {uploadedFiles.some((f) => f.extractedText) && (
                    <button
                      type="button"
                      onClick={handleCopyExtractedToCustom}
                      className="text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition"
                    >
                      <FileCheck2 className="w-3 h-3 text-blue-600" />
                      <span>ចម្លងអត្ថបទពី File មកទីនេះ</span>
                    </button>
                  )}
                  <span className="text-[11px] font-bold text-indigo-800 bg-indigo-100/90 border border-indigo-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span>{t.customLessonContentBadge}</span>
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {t.customLessonContentDesc}
              </p>

              {/* Quick Pre-filled Lesson Samples */}
              <div className="flex items-center flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-500 mr-1">{t.customLessonContentSamples}</span>
                <button
                  type="button"
                  onClick={() => handleApplySampleContent('khmer')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 font-medium transition shadow-2xs cursor-pointer"
                >
                  📖 តែងសេចក្តី/អំណានខ្មែរ
                </button>
                <button
                  type="button"
                  onClick={() => handleApplySampleContent('math')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 font-medium transition shadow-2xs cursor-pointer"
                >
                  📐 ទ្រឹស្ដីបទ និងលំហាត់គណិត
                </button>
                <button
                  type="button"
                  onClick={() => handleApplySampleContent('physics')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 font-medium transition shadow-2xs cursor-pointer"
                >
                  ⚡ ច្បាប់ញូតុន និងរូបវិទ្យា
                </button>
                <button
                  type="button"
                  onClick={() => handleApplySampleContent('agri')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 font-medium transition shadow-2xs cursor-pointer"
                >
                  🌱 ពិសោធន៍ ឬបំណិនជីវិត
                </button>
              </div>

              {/* Textarea Container with Voice Dictation Button & Stats */}
              <div className="relative">
                <textarea
                  rows={4}
                  value={customLessonContent}
                  onChange={(e) => setCustomLessonContent(e.target.value)}
                  placeholder={t.customLessonContentPlaceholder}
                  className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border-2 border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 outline-none transition bg-white text-slate-900 leading-relaxed font-sans placeholder:text-slate-400 shadow-2xs"
                />

                {/* Bottom bar inside/under textarea */}
                <div className="flex items-center justify-between pt-1 px-1 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <VoiceMicButton
                      onTranscript={(transcript) => {
                        setCustomLessonContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
                      }}
                      size="xs"
                      title={t.customLessonVoiceInput}
                    />
                    <span className="text-[11px] text-slate-400">
                      {customLessonContent.length} {t.customLessonCharCount}
                    </span>
                  </div>

                  {customLessonContent && (
                    <button
                      type="button"
                      onClick={() => setCustomLessonContent('')}
                      className="text-[11px] text-rose-600 hover:text-rose-700 hover:underline font-medium cursor-pointer"
                    >
                      {t.customLessonClear}
                    </button>
                  )}
                </div>
              </div>

              {customLessonContent.trim() && (
                <div className="p-3 bg-indigo-50/90 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-start gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">កិច្ចតែងការបង្រៀននឹងបង្កើតឡើងផ្អែកលើអត្ថបទជាក់លាក់នេះ ១០០%៖</span>
                    <p className="mt-0.5 text-indigo-800 text-[11px]">
                      ប្រព័ន្ធ AI នឹងស្រង់យកចំណុចស្នូល និយមន័យ រូបមន្ត ដំណោះស្រាយមួយជំហានម្តងៗ និងសំណួរវាស់ស្ទង់ចេញពីខ្លឹមសារដែលលោកគ្រូ-អ្នកគ្រូបានផ្ដល់ជូននេះដោយផ្ទាល់។
                    </p>
                  </div>
                </div>
              )}

              {/* Quick switch to File mode link */}
              {contentMode === 'text' && (
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>ឬចង់ Upload ឯកសារសៀវភៅពុម្ព (PDF, Word, រូបភាព)?</span>
                  <button
                    type="button"
                    onClick={() => setContentMode('file')}
                    className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>ប្ដូរទៅបញ្ចូលជា File</span>
                  </button>
                </div>
              )}
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
            disabled={!canSubmit}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg shadow-blue-500/20 transition-all text-base sm:text-lg cursor-pointer"
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
                <span>{t.generatingBtn || 'កំពុងបង្កើតកិច្ចតែងការដោយ AI...'}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>
                  {uploadedFiles.length > 0
                    ? 'បង្កើតកិច្ចតែងការស្រង់ចេញពីសៀវភៅពុម្ព'
                    : 'បង្កើតកិច្ចតែងការបង្រៀនភ្លាមៗ'}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
