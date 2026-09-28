import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer as createHttpServer } from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import {
  toKhmerNumber,
  parseMinutes,
  getStepDurations,
  buildTopicAlignedLessonPlan,
  generateSubjectVocabulary,
} from './curriculumEngine.js';
import { generateTopicIllustration } from './src/utils/illustrationEngine.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Candidate models for graceful failover when one model is under high demand or rate limited
const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
];

async function generateContentWithFallback(aiClient: any, requestOptions: any) {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await aiClient.models.generateContent({
        ...requestOptions,
        model,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      lastError = err;
      const errStr = String(err?.message || err);
      const isQuota = errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED');
      const isUnavailable =
        errStr.includes('503') ||
        errStr.includes('UNAVAILABLE') ||
        errStr.includes('high demand') ||
        errStr.includes('DEADLINE_EXCEEDED');

      console.log(
        `[AI Gateway] Model '${model}' ${isQuota ? 'rate-limited (429)' : isUnavailable ? 'high demand (503)' : 'encountered issue'}, switching candidate...`
      );

      // If high demand (503) on first model, brief quick retry
      if (isUnavailable && !isQuota) {
        try {
          await new Promise((r) => setTimeout(r, 600));
          const retryResponse = await aiClient.models.generateContent({
            ...requestOptions,
            model,
          });
          if (retryResponse && retryResponse.text) {
            return retryResponse;
          }
        } catch {
          // Continue to next candidate model
        }
      }
    }
  }

  throw lastError || new Error('All candidate models exhausted');
}

function generateIntelligentFallback(body: any) {
  return buildTopicAlignedLessonPlan(body);
}

// Generate Lesson Plan Endpoint
app.post('/api/generate-lesson-plan', async (req, res) => {
  try {
    const {
      topic,
      subject = 'ភាសាខ្មែរ',
      grade = 'ថ្នាក់ទី ៩',
      duration = '៥០ នាទី (១ ម៉ោងសិក្សា)',
      chapter = '',
      lessonNo = '',
      teacherName = '',
      schoolName = '',
      focusKeywords = '',
      teachingMethod = 'វិធីសាស្ត្របង្រៀនតាមបែបសិស្សមជ្ឈមណ្ឌល (Student-Centered Learning)',
      teachingStrategy = 'យុទ្ធវិធី គិត-គូ-ចែករំលែក (Think-Pair-Share)',
      difficultyLevel = 'មធ្យម (Intermediate)',
    } = req.body;

    if (!topic || topic.trim() === '') {
      return res.status(400).json({ error: 'សូមបញ្ចូលប្រធានបទមេរៀន' });
    }

    if (!ai) {
      console.log('No Gemini API key found, generating with intelligent curriculum builder...');
      const fallback = generateIntelligentFallback(req.body);
      return res.json(fallback);
    }

    const totalMinutes = parseMinutes(duration);
    const stepTimes = getStepDurations(totalMinutes);

    const systemPrompt = `អ្នកគឺជាអ្នកជំនាញជាន់ខ្ពស់ផ្នែកអភិវឌ្ឍន៍កម្មវិធីសិក្សា និងគរុកោសល្យនៃក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS) នៃព្រះរាជាណាចក្រកម្ពុជា។
ភារកិច្ចរបស់អ្នកគឺបង្កើត "កិច្ចតែងការបង្រៀន" (Lesson Plan) ដ៏លម្អិត ត្រឹមត្រូវ និងប្រកបដោយស្តង់ដារវិជ្ជាជីវៈគរុកោសល្យខ្ពស់បំផុត តាមទម្រង់ផ្លូវការរបស់ក្រសួងអប់រំ។

*** គោលការណ៍គ្រឹះដាច់ខាត (STRICT ACCURACY & ANTI-GENERIC TEMPLATE DISCIPLINE):
១. ភាពស្របគ្នា ១០០% នឹងប្រធានបទ (Strict Topic Alignment):
   - ខ្លឹមសារមេរៀន ទ្រឹស្ដី និយមន័យ រូបមន្ត ឧទាហរណ៍គំរូ លំហាត់អនុវត្ត សកម្មភាពគ្រូ និងសកម្មភាពសិស្ស ត្រូវតែបង្កើតឡើងយ៉ាងសុក្រឹត ផ្ដោតចំលើប្រធានបទ «${topic}» នៃមុខវិជ្ជា «${subject}» សម្រាប់កម្រិត «${grade}» ជាដាច់ខាត។
   - ហាមដាច់ខាតមិនឱ្យយកគំរូដដែលៗ ឬគំរូដែលមិនត្រូវនឹងប្រធានបទមកដាក់ឡើយ (ឧទាហរណ៍៖ ប្រសិនបើប្រធានបទមិនមែនជាសមីការដឺក្រេទី ២ ហាមដាច់ខាតមិនត្រូវលើកយកសមីការដឺក្រេទី ២, ឌីសគ្រីមីណង់ ដេលតា, ឬរូបមន្តដែលមិនពាក់ព័ន្ធមកដាក់ឡើយ)។
   - លំហាត់គំរូ ឧទាហរណ៍ និងដំណោះស្រាយ ត្រូវតែជាលំហាត់ជាក់ស្ដែងនៃប្រធានបទ «${topic}» នោះពិតប្រាកដ។

២. ការហាមឃាត់ដាច់ខាតលើនិយមន័យគំរូទូទៅ និងការបង្កើតមេរៀនអនុវត្តជាក់ស្ដែង (STRICT PROHIBITION OF GENERIC TEMPLATES & MANDATORY PRACTICAL LESSON):
   - ហាមដាច់ខាតមិនត្រូវសរសេរតែពាក្យនិយមន័យគំរូទូទៅ ឬអត្ថបទអរូបី (generic boilerplate definition templates) ដូចជា "«ប្រធានបទ» គឺជាចំណេះដឹង និងបំណិនគន្លឹះក្នុងមុខវិជ្ជា...", "ផ្ដល់មូលដ្ឋានទ្រឹស្ដីរឹងមាំ...", "កំណត់បម្រាប់ និងទិន្នន័យចាំបាច់ទាំងអស់..." ជាដាច់ខាត!
   - ត្រូវតែបង្កើតជា "មេរៀនអនុវត្តជាក់ស្ដែងតាមប្រធានបទនោះ" (Concrete Practical Applied Lesson) ផ្ដោតលើចំណេះដឹងបច្ចេកទេសពិត សម្ភារ/ឧបករណ៍ពិត វិធានការប្រតិបត្តិពិត និងការអនុវត្តជាក់ស្ដែងដោយដៃផ្ទាល់ (Hands-on practice) នៃ «${topic}»!
   - ករណីសិក្សា ឬលំហាត់គំរូ ត្រូវតែជាស្ថានភាពពិត (Authentic Scenario) ដែលមានទិន្នន័យជាក់ស្ដែង ស្ថានភាពជាក់ស្ដែង ឬបញ្ហាប្រឈមជាក់ស្ដែងដែល���្រូវដោះស្រាយ!

៣. ភាពត្រឹមត្រូវតាមកម្រិតថ្នាក់ (Grade-Appropriate Accuracy):
   - ប្រសិនបើជាកម្រិតបឋមសិក្សា (ថ្នាក់ទី ១ ដល់ ទី ៦)៖ ខ្លឹមសារត្រូវសាមញ្ញ ងាយយល់ អមដោយរូបភាព ឬឧទាហរណ៍ក្នុងជីវភាពប្រចាំថ្ងៃ គ្មានរូបមន្តស្មុគស្មាញឡើយ។
   - ប្រសិនបើជាកម្រិតអនុវិទ្យាល័យ (ថ្នាក់ទី ៧ ដល់ ទី ៩)៖ ខ្លឹមសារត្រូវស្របតាមកម្មវិធីសិក្សាស្តង់ដារក្រសួងអប់រំ (MoEYS) មានទ្រឹស្ដីមូលដ្ឋាន និយមន័យ និងលំហាត់គំរូស្តង់ដារ។
   - ប្រសិនបើជាកម្រិតវិទ្យាល័យ (ថ្នាក់ទី ១០ ដល់ ទី ១២)៖ ខ្លឹមសារត្រូវស៊ីជម្រៅ មានទ្រឹស្ដីបទ និងការវិភាគវែកញែកកម្រិតខ្ពស់។

៤. ស្តង់ដារកិច្ចតែងការបង្រៀនរួមបញ្ចូល៖
   - ក្បាលទំព័រ (Header): ព្រះរាជាណាចក្រកម្ពុជា, ជាតិ សាសនា ព្រះមហាក្សត្រ, សាលារៀន, គ្រូបង្រៀន, មុខវិជ្ជា, ថ្នាក់ទី, កាលបរិច្ឆេទ, រយៈពេល (${duration}), ជំពូក, មេរៀន, ប្រធានបទ។
   - វត្ថុបំណង ៣ ដែន (3 Objectives Domains):
     + ចំណេះដឹង (Knowledge): សិស្សអាចប្រាប់ ពន្យល់ កំណត់ ឬរៀបរាប់ពីចំណុចស្នូលនៃ «${topic}»...
     + បំណិន (Skills): សិស្សអាចគណនា វិភាគ បកស្រាយ ឬដោះស្រាយកិច្ចការលើ «${topic}»...
     + ឥរិយាបថ (Attitude): បណ្ដុះស្មារតីស្រឡាញ់ការសិក្សា សាមគ្គីភាព ការទទួលខុសត្រូវ...
   - សម្ភារឧបទេស (Teaching Materials): ចំពោះគ្រូ និង ចំពោះសិស្ស ត្រូវសមស្របនឹងមេរៀន «${topic}»។
   - ដំណើរការបង្រៀន និងរៀន តាម ៥ ជំហាន (5 Steps of Instruction)៖
     + ជំហានទី ១: រដ្ឋបាលថ្នាក់ (${stepTimes.step1Str}) - ពិនិត្យវត្តមាន សណ្ដាប់ធ្នាប់ អនាម័យ
     + ជំហានទី ២: រំលឹកមេរៀនចាស់ ឬ កែកិច្ចការផ្ទះ (${stepTimes.step2Str}) - សំណួរ ឬលំហាត់រំលឹកដែលត្រួសត្រាយផ្លូវទៅកាន់ «${topic}»
      + ជំហានទី ៣: មេរៀនថ្មី (${stepTimes.step3Str}) - មេរៀនអនុវត្តជាក់ស្ដែងតាមប្រធានបទ «${topic}» ដែលត្រូវតែមាន [ការពន្យល់ពេលរៀនលម្អិត] លើទស្សនទាន និយមន័យ រូបមន្ត និងកំហុសដែលសិស្សឧស្សាហ៍ច្រឡំ ព្រមទាំង [ដំណោះស្រាយលម្អិតមួយជំហានម្តងៗ] ដែលមានប្រតិបត្តិការ line-by-line អមការពន្យល់ «ពន្យល់ពេលរៀន៖ ...» និង [លំហាត់អនុវត្តជាក្រុមអមដំណោះស្រាយផ្ទៀងផ្ទាត់]
     + ជំហានទី ៤: ពង្រឹងចំណេះដឹង (${stepTimes.step4Str}) - លំហាត់វាស់ស្ទង់ការយល់ដឹងរហ័សលើក្ដារឈ្នួន ឬការវាយតម្លៃចំៗលើ «${topic}» អមចម្លើយផ្ទៀងផ្ទាត់
     + ជំហានទី ៥: បណ្ដាំផ្ញើ និងកិច្ចការផ្ទះ (${stepTimes.step5Str}) - លំហាត់កិច្ចការផ្ទះជាក់ស្ដែងលើ «${topic}»
   
   *** លក្ខខណ្ឌតឹងរ៉ឹង៖ 
   - ផលបូកនាទីនៃជំហានទាំង ៥ ត្រូវតែស្មើនឹង ${totalMinutes} នាទីគត់ (${stepTimes.step1} + ${stepTimes.step2} + ${stepTimes.step3} + ${stepTimes.step4} + ${stepTimes.step5} = ${totalMinutes} នាទី)!
   - ទំហំ និងជម្រៅនៃខ្លឹមសារមេរៀន (Lesson Content Scope) ត្រូវតែសមាមាត្រទៅនឹងរយៈពេលបង្រៀន៖
     ${stepTimes.depth}

៥. ប្លង់ក្ដារខៀន (Board Summary) និងការឆ្លុះបញ្ចាំង (Teacher Reflection) ត្រូវឆ្លុះបញ្ចាំងពីមេរៀន «${topic}» ជាក់ស្ដែង។

*** សេចក្ដីណែនាំអំពីកម្រិតលំបាក (Difficulty Level: ${difficultyLevel}) ក្នុងការកែសម្រួលភាពស្មុគស្មាញនៃវត្ថុបំណង និងសកម្មភាព៖
- ប្រសិនបើជា "មូលដ្ឋាន (Basic)": ផ្ដោតលើ Bloom 1-2 (ការចងចាំ និងការយល់ដឹង), ការពន្យល់សាមញ្ញ ផ្ទាល់ ងាយយល់ មានការគាំទ្រខ្ពស់ពីគ្រូ (Scaffolding), លំហាត់គំរូសាមញ្ញៗគ្មានល្បិចស្មុគស្មាញ។
- ប្រសិនបើជា "មធ្យម (Intermediate)": ផ្ដោតលើ Bloom 3-4 (ការអនុវត្ត និងការវិភាគ), កម្រិតស្តង់ដារកម្មវិធីសិក្សាជាតិរបស់ MoEYS មានទ្រឹស្ដីគន្លឹះ លំហាត់អនុវត្តស្តង់ដារ និងការពិភាក្សាជាក្រុម។
- ប្រសិនបើជា "កម្រិតខ្ពស់ (Advanced)": ផ្ដោតលើ Bloom 5-6 (ការវាយតម្លៃ និងការត្រិះរិះពិចារណា HOTS), ខ្លឹមសារស៊ីជម្រៅ លំហាត់ចោទជាបញ្ហាប្រឈមពហុជំហាន (Multi-step problems) និងការការពារទឡ្ហីករណ៍។

*** ការគាំទ្រប្រធានបទសរសេរថ្មីដោយសេរី ឬមេរៀនក្រៅសៀវភៅពុម្ព (FREELY WRITTEN & NON-TEXTBOOK TOPICS):
- ប្រសិនបើប្រធានបទ «${topic}» ជាប្រធានបទសរសេរថ្មីដោយសេរីដោយលោកគ្រូ-អ្នកគ្រូ, ប្រធានបទដែលគ្មានចែងក្នុងសៀវភ��ពុម្ព ${grade} (ដូចជា បច្ចេកវិទ្យាបញ្ញាសិប្បនិម្មិត AI, ការសរសេរកូដ Coding, បំណិនជីវិត, ការគ្រប់គ្រងហិរញ្ញវត្ថុ, កសិកម្មឆ្លាតវៃ, ប���ិស្ថានក្នុងសហគមន៍, សុខភាពផ្លូវចិត្ត, ឬប្រធានបទច្នៃប្រឌិតនានា)៖
  + ហាមដាច់ខាតមិនត្រូវបដិសេធ មិនត្រូវកាត់ចោល និងមិនត្រូវបង្វែរប្រធានបទនេះទៅជាមេរៀនផ្សេងក្នុងសៀវភៅពុម្ពឡើយ!
  + ត្រូវតែទទួលយក និងបង្កើតកិច្ចតែងការបង្រៀនឱ្យស្របតាមប្រធានបទថ្មី «${topic}» នេះ ១០០% ពេញលេញ និងត្រឹមត្រូវតាមកម្រិតថ្នាក់ ${grade} និងមុខវិជ្ជា ${subject}។
  + រៀបចំវត្ថុបំណង ៣ ដែន (ចំណេះដឹង បំណិន ឥរិយាបថ), ខ្លឹមសារមេរៀន, ឧទាហរណ៍គំរូ/ករណីសិក្សាជាក់ស្ដែង, ដំណោះស្រាយមួយជំហានម្តងៗ, លំហាត់ពង្រឹងការយល់ដឹង, និងកិច្ចការផ្ទះ ផ្ដោតចំលើ «${topic}» ទាំងអស់។
  + ប្រសិនបើប្រធានបទនេះមិនមានជំពូក ឬមេរៀនទីក្នុងសៀវភៅពុម្ព ត្រូវកំណត់ជា «មេរៀនឯករាជ្យ / បំណិនអនុវត្តជាក់ស្ដែង»។

*** ការហាមឃាត់ដាច់ខាត (Output Cleanliness)៖
- ដាច់ខាតមិនត្រូវសរសេរពាក្យថា "កម្រិតលំបាក", "Basic", "Intermediate", "Advanced", ឬ "${difficultyLevel}" ចូលទៅក្នុងអត្ថបទកិច្ចតែងការដែលត្រូវបង្ហាញលើសន្លឹកការងារឡើយ។ សន្លឹកកិច្ចតែងការផ្លូវការត្រូវតែស្អាត និងគ្មានពាក្យសម្គាល់កម្រិតនេះឡើយ។

សូមសរសេរជាភាសាខ្មែរផ្លូវការ ត្រឹមត្រូវតាមអក្ខរាវិរុទ្ធវចនានុក្រមសម្ដេចព្រះសង្ឃរាជ ជួន ណាត និងពាក្យគរុកោសល្យខ្មែរ។`;

    const userPrompt = `ចូររៀបចំកិច្ចតែងការបង្រៀនពេញលេញ និងលម្អិតបំផុតសម្រាប់៖
- ប្រធានបទ/ចំណងជើងមេរៀន៖ ${topic}
- មុខវិជ្ជា៖ ${subject}
- ថ្នាក់ទី៖ ${grade}
- រយៈពេលបង្រៀនសរុប៖ ${duration} (ស្មើនឹង ${totalMinutes} នាទី)
- កម្រិតលំបាកដែលបានជ្រើសរើស៖ ${difficultyLevel} (កែសម្រួលភាពស្មុគស្មាញនៃវត្ថុបំណង និងសកម្មភាពឱ្យត្រូវនឹងកម្រិតនេះ ប៉ុន្តែកុំសរសេរពាក្យសម្គាល់កម្រិតនេះចូលក្នុងក្រដាសកិច្ចតែងការ)
- ជំពូកទី៖ ${chapter || (req.body.isCustomTopic ? 'មេរៀនឯករាជ្យ' : 'ស្របតាមកម្មវិធីសិក្សា')}
- មេរៀនទី៖ ${lessonNo || (req.body.isCustomTopic ? 'បំណិនអនុវត្ត' : 'ស្របតាមកម្មវិធីសិក្សា')}
- ឈ្មោះគ្រូបង្រៀន៖ ${teacherName || 'គ្រូបង្រៀន'}
- ឈ្មោះសាលារៀន៖ ${schoolName || 'វិទ្យាល័យ / អនុវិទ្យាល័យ'}
- ការផ្ដោតសំខាន់បន្ថែម៖ ${focusKeywords || 'ខ្លឹមសារស្នូល និងការអនុវត្តជាក់ស្ដែង'}
- វិធីសាស្ត្របង្រៀន៖ ${teachingMethod}
- យុទ្ធវិធីបង្រៀន (Teaching Strategy / Technique ស្របតាមក្រសួង MoEYS)៖ ${teachingStrategy}

*** ការអនុវត្តវិធីសាស្ត្រ និងយុទ្ធវិធីបង្រៀនស្របតាមក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS Pedagogy & Teaching Strategy):
- ក្នុងក្បាលទំព័រ (Header): ត្រូវបញ្ជាក់ 'teachingMethod' និង 'teachingStrategy' ឱ្យបានត្រឹមត្រូវ។
- ក្នុងដំណើរការបង្រៀន ៥ ជំហាន (ជាពិសេស ជំហានទី ២ រំលឹកមេរៀន, ជំហានទី ៣ មេរៀនថ្មី, និង ជំហានទី ៤ ពង្រឹងចំណេះដឹង)៖ សកម្មភាពគ្រូ និងសកម្មភាពសិស្ស ត្រូវតែអនុវត្តជាក់ស្ដែងតាម «${teachingMethod}» និង «${teachingStrategy}» នេះយ៉ាងប្រត្យក្ស (ឧទាហរណ៍៖ បើជ្រើសរើស គិត-គូ-ចែករំលែក ត្រូវឱ្យគ្រូដាក់សំណួរ/លំហាត់ សិស្សគិតម្នាក់ឯង ពិភាក្សាជាដៃគូ រួចចែករំលែករួមក្នុងថ្នាក់; បើជ្រើសរើស ដើរទស្សនវិចិត្រសាល Gallery Walk ត្រូវឱ្យសិស្សបិទស្នាដៃលើជញ្ជាំង និងដើរទស្សនាកត់ត្រា; បើជ្រើសរើស ផ្គុំបំណែក Jigsaw ត្រូវឱ្យបំបែកជាក្រុមអ្នកជំនាញ និងក្រុមដើម; បើជ្រើសរើស ក្ដារឈ្នួនឆ្លើយរហ័ស ត្រូវឱ្យសិស្សលើកក្ដារឈ្នួនបង្ហាញចម្លើយដំណាលគ្នា...)។

*** សេចក្ដីណែនាំពិសេសអំពីភាពសុក្រឹត និងការរៀបចំមេរៀនអនុវត្តជាក់ស្ដែងនៃ "ជំហានទី ៣: មេរៀនថ្មី" (STEP 3 PRACTICAL & APPLIED CONTENT REQUIREMENTS):
១. ជំហានទី ៣ (មេរៀនថ្មី) គឺជាបេះដូងចម្បងនៃកិច្ចតែងការបង្រៀន។ ខ្លឹមសារមេរៀន (content) ក្នុងជំហានទី ៣ ត្រូវតែជា "មេរៀនអនុវត្តជាក់ស្ដែងតាមប្រធានបទ «${topic}»" ដោយមិនបង្កើតតែនិយមន័យគំរូទូទៅឡើយ!
   - ហាមដាច់ខាតមិនត្រូវសរសេរពាក្យនិយមន័យអរូបីគំរូទូទៅ (generic boilerplate) ដូចជា "«ប្រធានបទ» គឺជាចំណេះដឹង និងបំណិនគន្លឹះ...", "ផ្ដល់មូលដ្ឋានទ្រឹស្ដីរឹងមាំ...", "កំណត់បម្រាប់ និងទិន្នន័យចាំបាច់ទាំងអស់..." ជាដាច់ខាត!
   - ត្រូវសរសេរជាចំណេះដឹងបច្ចេកទេសពិត សម្ភារ/ឧ���ករណ៍ពិត ក្បួនខ្នាតប្រតិបត្តិ និងការអនុវត្តដោយដៃផ្ទាល់តាមប្រធានបទ «${topic}» នោះពិតប្រាកដ។
២. ក្នុងជួរ "ខ្លឹមសារមេរៀន" (Content) នៃជំហានទី ៣ ត្រូវតែបែងចែកជា ៤ ផ្នែកជាក់ស្ដែង៖
   - ផ្នែកទី ១ (ខ្លឹមសារចំណេះដឹងស្នូល និង [ការពន្យល់ពេលរៀនលម្អិត] នៃ «${topic}»)៖ សរសេរចំណេះដឹងបច្ចេកទេសពិត ធាតុផ្សំ/សម្ភារចាំបាច់ លក្ខណៈសម្គាល់ និង [ការពន្យល់ពេលរៀនលម្អិត] យ៉ាងក្បោះក្បាយលើទស្សនទាន ហេតុផល និងកំហុសដែលសិស្សឧស្សាហ៍ច្រឡំ (មិនសរសេរជាគំរូនិយមន័យទូទៅឡើយ)។
   - ផ្នែកទី ២ (ក្បួនខ្នាត វិធានបច្ចេកទេស ឬដំណាក់កាលប្រតិបត្តិជាក់ស្ដែង)៖ សរសេររូបមន្តពិត ក្បួនច្បាប់ វិធានការសុវត្ថិភាព ឬជំហានបច្ចេកទេសប្រតិបត្តិជាក់ស្ដែងនៃ «${topic}» យ៉ាងក្បោះក្បាយ។
   - ផ្នែកទី ៣ (ករណីសិក្សា ឬលំហាត់គំរូអនុវត្តជាក់ស្ដែង និង [ដំណោះស្រាយលម្អិតជាជំហានៗ] - PRACTICAL DEMONSTRATION & STEP-BY-STEP SOLUTION)៖
     *** លក្ខខណ្ឌដាច់ខាត៖ ត្រូវតែមានការបកស្រាយនិយមន័យទៅលើប្រធាន និងដំណោះស្រាយលម្អិតមួយជំហានម្តងៗ ដើម្បីងាយស្រួលបង្រៀន និងសិស្សងាយយល់ក្នុងការអនុវត្ត ដោយត្រូវរៀបចំតាមលំដាប់លំដោយ៖
     + ១. ប្រធានលំហាត់គំរូ ឬករណីសិក្សាជាក់ស្ដែង (Authentic Scenario)៖ ជាស្ថានភាពជាក់ស្ដែងដែលមានតួលេខពិត សម្ភារពិត បញ្ហាពិត ឬលំហាត់ជាក់ស្ដែងនៃ «${topic}»
     + ២. [ការបកស្រាយនិយមន័យ និងពាក្យគន្លឹះនៃប្រធាន]៖ ពន្យល់យ៉ាងក្បោះក្បាយពីអត្ថន័យនៃពាក្យគន្លឹះ បម្រាប់ និងបរិបទនៃប្រធាន ដើម្បីឱ្យសិស្សយល់ច្បាស់ពីខ្លឹមសារមុននឹងចាប់ផ្តើមគណនា/ដោះស្រាយ
     + ៣. [ការបកស្រាយរូបមន្ត/ក្បួនបច្ចេកទេសប្រតិបត្តិ]៖ សរសេររូបមន្ត ឬក្បួនបច្ចេកទេស និងបកស្រាយអត្ថន័យនៃនិមិត្តសញ្ញា ឬវិធានការ (ឈ្មោះនិមិត្តសញ្ញា ខ្នាតគិត និងមូលហេតុដែលជ្រើសរើសក្បួននេះ)
     + ៤. [ដំណោះស្រាយលម្អិតជាជំហានៗ]៖ ដំណើរការគណនា ឬដំណោះស្រាយជា ៤ ជំហាន ដោយមានការពន្យល់គរុកោសល្យអម «ពន្យល់ពេលរៀន៖ ...» រាល់បន្ទាត់
     + ៥. [ការបកស្រាយអត្ថន័យនៃចម្លើយក្នុងការអនុវត្តជាក់ស្ដែង]៖ សន្និដ្ឋាន និងពន្យល់ពីតម្លៃជាក់ស្ដែងនៃលទ្ធផលក្នុងការរស់នៅ ការសិក្សា ឬបច្ចេកទេសវិជ្ជាជីវៈ។
   - ផ្នែកទី ៤ (សកម្មភាពអនុវត្តជាក្រុម និង [ដំណោះស្រាយផ្ទៀងផ្ទាត់])៖ កិច្ចការ ឬបញ្ហាជាក់ស្ដែងខុសគ្នាសម្រាប់ក្រុមទី ១ និងក្រុមទី ២ អមដោយដំណោះស្រាយគំរូសម្រាប់ផ្ទៀងផ្ទាត់។
៣. សកម្មភាពគ្រូ និងសកម្មភាពសិស្សក្នុងជំហានទី ៣ ត្រូវតែឆ្លុះបញ្ចាំងពី [ការពន្យល់ពេលរៀនលម្អិត] និង [ការដោះស្រាយលម្អិតមួយជំហានម្តងៗ] ឱ្យស៊ីគ្នានឹងខ្លឹមសារមេរៀនជាក់ស្ដែង។
៤. រយៈពេលជំហាននីមួយៗត្រូវដាក់ឱ្យត្រូវ៖
   - ជំហានទី ១: "${stepTimes.step1Str}"
   - ជំហានទី ២: "${stepTimes.step2Str}"
   - ជំហានទី ៣: "${stepTimes.step3Str}" (ខ្លឹមសារពេញលេញ និងស៊ីជម្រៅតាមពេលវេលាកំណត់)
   - ជំហានទី ៤: "${stepTimes.step4Str}" (លំហាត់វាស់ស្ទង់ជាក់ស្ដែង + ចម្លើយ)
   - ជំហានទី ៥: "${stepTimes.step5Str}" (កិច្ចការផ្ទះជាក់ស្ដែងលើ ${topic})
៥. *** ការអនុវត្តជាក់ស្ដែងពិសេសតាមមុខវិជ្ជា (MANDATORY SUBJECT-SPECIFIC PRACTICAL APPLICATION OBJECT):
   ត្រូវតែបង្កើតផ្នែក 'practicalApplication' ឱ្យស្របតាមមុខវិជ្ជា «${subject}» និងប្រធានបទ «${topic}» យ៉ាងប្រត្យក្ស៖
   - ប្រសិនបើជា គណិតវិទ្យា (Math)៖ subjectCategory='math' ត្រូវតែមានការគណនាប្រមាណវិធី (Arithmetic Operations / Equations / Geometry) ប្រធានលំហាត់ បម្រាប់ រូបមន្ត ដំណើរការជំនួសលេខ និងគណនាផលលេខ line-by-line និងលំហាត់សម្រាប់សិស្ស។
   - ប្រសិនបើជា រូបវិទ្យា (Physics)៖ subjectCategory='physics' ត្រូវតែមានរូបមន្ត (Physics Formulas e.g. v=d/t, F=ma, P=UI, W=Fd) និមិត្តសញ្ញា ខ្នាតអន្តរជាតិ SI បម្រាប់ ការទាញយករូបមន្ត ជំនួសលេខ និងលំហាត់សម្រាប់សិស្ស។
   - ប្រសិនបើជា ភាសាខ្មែរ (Khmer)៖ subjectCategory='khmer' ត្រូវតែមានតែងសេចក្ដី (Essay Structure: ប្រធានតែង, ប្រភេទតែង, សេចក្ដីផ្ដើម, តួសេចក្ដីអមឧទាហរណ៍, សេចក្ដីបញ្ចប់) ឬលំហាត់វេយ្យាករណ៍ជាក់ស្ដែង និងប្រធានតែងសម្រាប់សិស្ស។
   - ប្រសិនបើជា គីមីវិទ្យា (Chemistry)៖ subjectCategory='chemistry' ត្រូវតែមានលំហាត់គណនាបង្ហាញ សមីការតុល្យការ ប្រតិកម្ម រកម៉ាសម៉ូល ម៉ូល n=m/M កំហាប់ C=n/V និងលំហាត់អនុវត្តសិស្ស។
   - ប្រសិនបើជា ICT / AI / Coding៖ subjectCategory='ict' ត្រូវតែមានរូបមន្ត ICT (Spreadsheet e.g. =SUM(), =AVERAGE(), =IF(), =VLOOKUP()), វាក្យសម្ព័ន្ធកូដ (HTML tags, Python/Scratch), ឬក្បួនដោះស្រាយ/ជំហានអនុវត្តលើកម្មវិធីជាក់ស្ដែង និងលំហាត់សិស្ស។
   - ប្រសិនបើជា ជីវវិទ្យា ឬមុខវិជ្ជាផ្សេងៗ៖ subjectCategory='biology'/'general' ត្រូវតែមានការអនុវត្តពិសោធន៍ ករណីសិក្សា ឬការអង្កេតជាក់ស្ដែង។
៦. ប្រសិនបើ «${topic}» ជាប្រធានបទសរសេរថ្មី ឬគ្មានក្នុងសៀវភៅពុម្ពកម្រិតថ្នាក់ ${grade} នេះទេ ត្រូវតែបង្កើតកិច្ចតែងការបង្រៀនឱ្យស្របតាម «${topic}» នេះ ១០០% ដោយមិនយកគំរូប្រធានបទដដែលៗ ឬគំរូសៀវភៅពុម្ពមកជំនួសជាដាច់ខាត!`;

    const response = await generateContentWithFallback(ai, {
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            header: {
              type: Type.OBJECT,
              properties: {
                country: { type: Type.STRING },
                motto: { type: Type.STRING },
                schoolName: { type: Type.STRING },
                teacherName: { type: Type.STRING },
                subject: { type: Type.STRING },
                grade: { type: Type.STRING },
                date: { type: Type.STRING },
                duration: { type: Type.STRING },
                chapter: { type: Type.STRING },
                lessonNo: { type: Type.STRING },
                topic: { type: Type.STRING },
                teachingMethod: { type: Type.STRING },
                teachingStrategy: { type: Type.STRING },
                integration: { type: Type.STRING },
              },
              required: [
                'country',
                'motto',
                'schoolName',
                'teacherName',
                'subject',
                'grade',
                'date',
                'duration',
                'chapter',
                'lessonNo',
                'topic',
              ],
            },
            objectives: {
              type: Type.OBJECT,
              properties: {
                knowledge: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                skills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                attitude: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['knowledge', 'skills', 'attitude'],
            },
            materials: {
              type: Type.OBJECT,
              properties: {
                teacher: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                students: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['teacher', 'students'],
            },
            vocabularyList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  partOfSpeech: { type: Type.STRING },
                  definition: { type: Type.STRING },
                  exampleOrContext: { type: Type.STRING },
                },
                required: ['term', 'definition'],
              },
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.STRING },
                  stepTitle: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  content: { type: Type.STRING },
                  teacherActivity: { type: Type.STRING },
                  studentActivity: { type: Type.STRING },
                },
                required: [
                  'stepNumber',
                  'stepTitle',
                  'duration',
                  'content',
                  'teacherActivity',
                  'studentActivity',
                ],
              },
            },
            boardSummary: { type: Type.STRING },
            reflection: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.STRING },
                weaknesses: { type: Type.STRING },
                solutions: { type: Type.STRING },
              },
              required: ['strengths', 'weaknesses', 'solutions'],
            },
            practicalApplication: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subjectCategory: { type: Type.STRING },
                topic: { type: Type.STRING },
                problemStatement: { type: Type.STRING },
                givenDataOrContext: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                formulasOrRules: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.STRING },
                      stepName: { type: Type.STRING },
                      operationOrCode: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    },
                    required: ['stepNumber', 'stepName', 'explanation'],
                  },
                },
                finalResult: { type: Type.STRING },
                studentPracticeTask: {
                  type: Type.OBJECT,
                  properties: {
                    problem: { type: Type.STRING },
                    hintOrAnswerKey: { type: Type.STRING },
                  },
                  required: ['problem'],
                },
              },
              required: ['title', 'subjectCategory', 'problemStatement', 'steps', 'finalResult', 'studentPracticeTask'],
            },
          },
          required: ['header', 'objectives', 'materials', 'steps'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No text returned from Gemini API');
    }

    const parsed = JSON.parse(text);
    parsed.id = 'lp-' + Date.now();
    parsed.createdAt = new Date().toISOString();
    if (parsed.header) {
      if (!parsed.header.difficultyLevel) {
        parsed.header.difficultyLevel = difficultyLevel;
      }
      if (!parsed.header.teachingMethod) {
        parsed.header.teachingMethod = teachingMethod;
      }
      if (!parsed.header.teachingStrategy) {
        parsed.header.teachingStrategy = teachingStrategy;
      }
      if (!parsed.header.integration) {
        const fb = buildTopicAlignedLessonPlan(req.body);
        parsed.header.integration = fb.header?.integration || 'ការអប់រំបរិស្ថាន សុខភាព និងសីលធម៌រស់នៅស្អាត';
      }
    }
    if (!parsed.practicalApplication) {
      const fb = buildTopicAlignedLessonPlan(req.body);
      if (fb.practicalApplication) {
        parsed.practicalApplication = fb.practicalApplication;
      }
    }
    if (!parsed.vocabularyList || !Array.isArray(parsed.vocabularyList) || parsed.vocabularyList.length === 0) {
      parsed.vocabularyList = generateSubjectVocabulary(topic, subject, grade);
    }
    if (!parsed.illustration) {
      parsed.illustration = generateTopicIllustration(topic, subject, grade);
    }

    return res.json(parsed);
  } catch (err: any) {
    console.log('[AI Gateway] Utilizing high-quality pedagogical fallback engine due to upstream demand/quota.');
    // Graceful fallback guarantees user always gets a valid lesson plan
    const fallback = generateIntelligentFallback(req.body);
    return res.json(fallback);
  }
});

// Generate or Regenerate Topic Educational Illustration Endpoint
app.post('/api/generate-illustration', async (req, res) => {
  const { topic, subject = 'គណិតវិទ្យា', grade = 'ថ្នាក់ទី ៩', customPrompt = '' } = req.body;
  if (!topic || topic.trim() === '') {
    return res.status(400).json({ error: 'សូមបញ្ចូលប្រធានបទមេរៀន' });
  }

  // Base illustration from domain engine
  const baseIllustration = generateTopicIllustration(topic, subject, grade);

  if (!ai) {
    return res.json({ illustration: baseIllustration });
  }

  try {
    const prompt = `អ្នកជាអ្នកជំនាញគរុកោសល្យ និងការរចនារូបភាពឧបទេសបង្រៀននៃ MoEYS កម្ពុជា។
សូមផ្ដល់ចំណងជើង/ការពន្យល់រូបភាព (caption) និងការពិពណ៌នាគរុកោសល្យយ៉ាងច្បាស់លាស់ សម្រាប់រូបភាពឧបទេស ឬដ្យាក្រាមបង្រៀនលើប្រធានបទ៖
- ប្រធានបទ៖ ${topic}
- មុខវិជ្ជា៖ ${subject} (${grade})
${customPrompt ? `- សំណូមពរពិសេស៖ ${customPrompt}` : ''}

សូមបញ្ជូន JSON ត្រឡប់មកវិញនូវ៖
{
  "caption": "...",
  "pedagogicalNote": "..."
}`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.caption) {
      baseIllustration.caption = parsed.caption;
    }
    return res.json({ illustration: baseIllustration });
  } catch (err) {
    console.log('[AI Gateway] Illustration fallback.');
    return res.json({ illustration: baseIllustration });
  }
});

// Generate or Regenerate Vocabulary List Endpoint
app.post('/api/generate-vocabulary', async (req, res) => {
  const { topic, subject = 'ភាសាខ្មែរ', grade = 'ថ្នាក់ទី ៩' } = req.body;
  if (!topic || topic.trim() === '') {
    return res.status(400).json({ error: 'សូមបញ្ចូលប្រធានបទមេរៀន' });
  }

  if (!ai) {
    return res.json(generateSubjectVocabulary(topic, subject, grade));
  }

  try {
    const prompt = `អ្នកជាអ្នកជំនាញគរុកោសល្យខ្មែរនៃ MoEYS។ ចូរស្រង់ ឬបង្កើត "បញ្ជីវាក្យសព្ទ និងពាក្យគន្លឹះ" (Vocabulary List & Key Terms) ចំនួន ៤ ទៅ ៦ ពាក្យ ដ៏សំខាន់ និងសុក្រឹតបំផុតសម្រាប់មេរៀន៖
- ប្រធានបទ៖ ${topic}
- មុខវិជ្ជា៖ ${subject}
- ថ្នាក់ទី៖ ${grade}

*** លក្ខខណ្ឌតម្រូវ៖
ពាក្យនីមួយៗត្រូវតែពាក់ព័ន្ធផ្ទាល់នឹងប្រធានបទ «${topic}» ដោយមាន៖
- term: ពាក្យគន្លឹះ/វាក្យសព្ទ (អមពាក្យបច្ចេកទេសជាភាសាអង់គ្លេសប្រសិនបើមាន ឧ. "ឌីសគ្រីមីណង់ (Discriminant - Δ)")
- partOfSpeech: ថ្នាក់ពាក្យ (នាម, កិរិយា, គុណនាម, នាមបច្ចេកទេស...)
- definition: និយមន័យ ឬការពន្យល់ន័យជាភាសាខ្មែរឱ្យចំៗ ងាយយល់សម្រាប់សិស្ស
- exampleOrContext: ឧទាហរណ៍នៃការប្រើប្រាស់ ឬបរិបទក្នុងមេរៀនជាក់ស្ដែង`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING },
              partOfSpeech: { type: Type.STRING },
              definition: { type: Type.STRING },
              exampleOrContext: { type: Type.STRING },
            },
            required: ['term', 'definition'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      return res.json(parsed);
    }
    return res.json(generateSubjectVocabulary(topic, subject, grade));
  } catch (err) {
    console.log('[AI Gateway] Vocabulary generation using rule-based engine fallback.');
    return res.json(generateSubjectVocabulary(topic, subject, grade));
  }
});

// Refine Step / Section Endpoint
app.post('/api/refine-step', async (req, res) => {
  const { step, instruction, subject, grade, topic, totalDuration } = req.body;
  try {
    const isDetailReq =
      (instruction || '').includes('ការពន្យល់ពេលរៀន') ||
      (instruction || '').includes('ដំណោះស្រាយ') ||
      (instruction || '').includes('ជំហានទី៣') ||
      (instruction || '').includes('ជំហានទី ៣');

    if (!ai) {
      if (isDetailReq) {
        return res.json({
          content:
            step.content +
            `\n\n[ការពន្យល់ពេលរៀនលម្អិត]៖\n- ពន្យល់យ៉ាងក្បោះក្បាយពីគោលការណ៍គ្រឹះ និយមន័យ និងក្បួនបច្ចេកទេសនៃ «${topic}» ឱ្យសិស្សងាយយល់\n- ចង្អុលបង្ហាញពីចំណុចប្រយ័ត្ន និងកំហុសដែលសិស្សឧស្សាហ៍ជួបប្រទះ\n\n[ដំណោះស្រាយលម្អិតជាជំហានៗ]៖\n* ប្រធានលំហាត់/កិច្ចការគំរូជាក់ស្ដែងលើ «${topic}»\n- ជំហានទី ១ (កំណត់បម្រាប់ និងរូបមន្ត)៖ ពន្យល់ពេលរៀន៖ កំណត់ទិន្នន័យចា��បាច់ទាំងអស់\n- ជំហានទី ២ (ប្រតិបត្តិការដោះស្រាយ)៖ ពន្យល់ពេលរៀន៖ អនុវត្តគណនា ឬប្រតិបត្តិមួយបន្ទាត់ម្តងៗ\n- ជំហានទី ៣ (��ារផ្ទៀងផ្ទាត់ និងសន្និដ្ឋាន)៖ ពន្យល់ពេលរៀន៖ បកស្រាយអត្ថន័យនៃចម្លើយក្នុងការអនុវត្ត\n\n[លំហាត់អនុវត្តជាក្រុម និងដំណោះស្រាយផ្ទៀងផ្ទាត់]៖\n* ក្រុមទី ១ និង ក្រុមទី ២ អនុវត្តដោះស្រាយ និងផ្ទៀងផ្ទាត់ចម្លើយគំរូ`,
          teacherActivity:
            step.teacherActivity +
            `\n- គ្រូធ្វើការពន្យល់ពេលរៀនយ៉ាងលម្អិតលើទស្សនទាន និងចង្អុលបង្ហាញកំហុសដែលសិស្សឧស្សាហ៍ច្រឡំ\n- គ្រូបង្ហាញដំណោះស្រាយលម្អិតមួយជំហានម្តងៗលើក្ដារខៀន និងដឹកនាំសិស្សផ្ទៀងផ្ទាត់លទ្ធផល`,
          studentActivity:
            step.studentActivity +
            `\n- សិស្សយកចិត្តទុកដាក់ស្ដាប់ការពន្យល់ពេលរៀនលម្អិត និងកត់ត្រាចំណុចគន្លឹះ\n- សិស្សសង្កេត និងកត់ត្រាដំណោះស្រាយលម្អិតជាជំហានៗ ព្រមទាំងចូលរួមដោះស្រាយលំហាត់អនុវត្ត`,
        });
      }
      return res.json({
        content: step.content + '\n- កែសម្រួលបន្ថែម៖ ' + (instruction || 'ពង្រឹងសកម្មភាព'),
        teacherActivity: step.teacherActivity + '\n- ណែនាំបន្ថែមតាមការស្នើសុំ',
        studentActivity: step.studentActivity + '\n- អនុវត្តសកម្មភាពបន្ថែម',
      });
    }

    const durationNotice = step.duration
      ? `\n- រយៈពេលកំណត់សម្រាប់ជំហាននេះ៖ ${step.duration} (ក្នុងចំណោមម៉ោងបង្រៀនសរុប ${totalDuration || ''})`
      : '';

    const prompt = `អ្នកជាអ្នកជំនាញគរុកោសល្យខ្មែរនៃ MoEYS។ សូមកែសម្រួល ឬបង្កើនប្រសិទ្ធភាពសម្រាប់ ${step.stepNumber} (${step.stepTitle})
មុខវិជ្ជា៖ ${subject} ${grade}
ប្រធានបទ៖ ${topic}${durationNotice}
ការណែនាំកែលម្អ៖ ${instruction}

*** សេចក្ដីណែនាំពិសេស៖
១. ខ្លឹមសារមេរៀន សកម្មភាពគ្រូ និងសកម្មភាពសិស្សត្រូវតែសមាមាត្រទៅនឹងរយៈពេលកំណត់ (${step.duration || 'ពេលកំណត់'})។
២. ប្រសិនបើការណែនាំស្នើសុំ "ការពន្យល់ពេលរៀនលម្អិត និងដំណោះស្រាយ" ឬប្រសិនបើជា ${step.stepNumber} (ជំហានទី ៣: មេរៀនថ្មី)៖
   - ត្រូវតែរួមបញ្ចូល [ការពន្យល់ពេលរៀនលម្អិត] យ៉ាងក្បោះក្បាយលើទស្សនទាន និយមន័យ រូបមន្ត ហេតុផល និងកំហុសដែលសិស្សឧស្សាហ៍ច្រឡំ។
   - ត្រូវតែរួមបញ្ចូល [ដំណោះស្រាយលម្អិតជាជំហានៗ] ដែលមានប្រធានជាក់ស្ដែង ដំណោះស្រាយជាជំហានៗ line-by-line អមការពន្យល់គរុកោសល្យ «ពន្យល់ពេលរៀន៖ ...» រាល់បន្ទាត់ និងការបកស្រាយអត្ថន័យនៃចម្លើយ។
   - ត្រូវតែរួមបញ្ចូល [លំហាត់អនុវត្តជាក្រុម និងដំណោះស្រាយផ្ទៀងផ្ទាត់] សម្រាប់ក្រុមទី ១ និង ក្រុមទី ២។
   - សកម្មភាពគ្រូ និងសកម្មភាពសិស្សត្រូវតែឆ្លុះបញ្ចាំងពីការពន្យល់ពេលរៀនលម្អិត និងដំណោះស្រាយមួយជំហានម្តងៗ។

ខ្លឹមសារបច្ចុប្បន្ន៖
- ខ្លឹមសារមេរៀន៖ ${step.content}
- សកម្មភាពគ្រូ៖ ${step.teacherActivity}
- សកម្មភាពសិស្ស៖ ${step.studentActivity}

សូមបញ្ជូន JSON ត្រឡប់មកវិញនូវ៖
{
  "content": "...",
  "teacherActivity": "...",
  "studentActivity": "..."
}`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.log('[AI Gateway] Step refinement using rule-based pedagogical enhancement.');
    const isDetailReq =
      (instruction || '').includes('ការពន្យល់ពេលរៀន') ||
      (instruction || '').includes('ដំណោះស្រាយ') ||
      (instruction || '').includes('ជំហានទី៣') ||
      (instruction || '').includes('ជំហានទី ៣');

    if (isDetailReq) {
      return res.json({
        content:
          step.content +
          `\n\n[ការពន្យល់ពេលរៀនលម្អិត]៖\n- ពន្យល់យ៉ាងក្បោះក្បាយពីគោលការណ៍គ្រឹះ និយមន័យ និងក្បួនបច្ចេកទេសនៃ «${topic}» ឱ្យសិស្សងាយយល់\n- ចង្អុលបង្ហាញពីចំណុចប្រយ័ត្ន និងកំហុសដែលសិស្សឧស្សាហ៍ជួបប្រទះ\n\n[ដំណោះស្រាយលម្អិតជាជំហានៗ]៖\n* ប្រធានលំហាត់/កិច្ចការគំរូជាក់ស្ដែងលើ «${topic}»\n- ជំហានទី ១ (កំណត់បម្រាប់ និងរូបមន្ត)៖ ពន្យល់ពេលរៀន៖ កំណត់ទិន្នន័យចាំបាច់ទាំងអស់\n- ជំហានទី ២ (ប្រតិបត្តិការដោះស្រាយ)៖ ពន្យល់ពេលរៀន៖ អនុវត្តគណនា ឬប្រតិបត្តិមួយបន្ទាត់ម្តងៗ\n- ជំហានទី ៣ (ការផ្ទៀងផ្ទាត់ និងសន្និដ្ឋាន)៖ ពន្យល់ពេលរៀន៖ បកស្រាយអត្ថន័យនៃចម្លើយក្នុងការអនុវត្ត\n\n[លំហាត់អនុវត្តជាក្រុម និងដំណោះស្រាយផ្ទៀងផ្ទាត់]៖\n* ក្រុមទី ១ និង ក្រុមទី ២ អនុវត្តដោះស្រាយ និងផ្ទៀងផ្ទាត់ចម្លើយគំរូ`,
        teacherActivity:
          step.teacherActivity +
          `\n- គ្រូធ្វើការពន្យល់ពេលរៀនយ៉ាងលម្អិតលើទស្សនទាន និងច���្អុលបង្ហាញកំហុសដែលសិស្សឧស្សាហ៍ច្រឡំ\n- គ្រូបង្ហាញដំណោះស្រាយលម្អិតមួយជំហានម្តងៗលើក្ដារខៀន និងដឹកនាំសិស្សផ្ទៀងផ្ទាត់លទ្ធផល`,
        studentActivity:
          step.studentActivity +
          `\n- សិស្សយកចិត្តទុកដាក់ស្ដាប់ការពន្យល់ពេលរៀនលម្អិត និងកត់ត្រាចំណុចគន្លឹះ\n- សិស្សសង្កេត និងកត់ត្រាដំណោះស្រាយលម្អិតជាជំហានៗ ព្រមទាំងចូលរួមដោះស្រាយលំហាត់អនុវត្ត`,
      });
    }

    return res.json({
      content: step.content + (instruction ? `\n- ចំណុចកែលម្អ៖ ${instruction}` : ''),
      teacherActivity: step.teacherActivity + (instruction ? `\n- ណែនាំបន្ថែម៖ ${instruction}` : ''),
      studentActivity: step.studentActivity + (instruction ? `\n- អនុវត្តតាមការណែនាំ៖ ${instruction}` : ''),
    });
  }
});

// Create the HTTP server explicitly so Vite's HMR WebSocket can attach to it.
const httpServer = createHttpServer(app);

// Mount Vite or serve static
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      // Attach the HMR WebSocket to the same HTTP server so the upgrade is
      // handled on the same port (required behind the v0 preview proxy).
      ws: { server: httpServer },
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${port}`);
});
