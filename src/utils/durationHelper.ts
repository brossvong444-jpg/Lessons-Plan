// Duration and pedagogical step time calculator

// Map Khmer digits to Latin digits
const KHMER_TO_LATIN: Record<string, string> = {
  '០': '0',
  '១': '1',
  '២': '2',
  '៣': '3',
  '៤': '4',
  '៥': '5',
  '៦': '6',
  '៧': '7',
  '៨': '8',
  '៩': '9',
};

// Map Latin digits to Khmer digits
const LATIN_TO_KHMER: Record<string, string> = {
  '0': '០',
  '1': '១',
  '2': '២',
  '3': '៣',
  '4': '៤',
  '5': '៥',
  '6': '៦',
  '7': '៧',
  '8': '៨',
  '9': '៩',
};

/**
 * Convert any integer into a Khmer numeral string
 */
export function toKhmerNumber(num: number): string {
  return String(Math.round(num))
    .split('')
    .map((char) => LATIN_TO_KHMER[char] || char)
    .join('');
}

/**
 * Parse a duration string (e.g. "៥០ នាទី (១ ម៉ោងសិក្សា)", "40 នាទី", "១០០ នាទី") into an integer in minutes
 */
export function parseDurationMinutes(durationStr?: string): number {
  if (!durationStr || typeof durationStr !== 'string') return 50;

  // Convert Khmer numerals to Latin numerals
  const normalized = durationStr
    .split('')
    .map((char) => KHMER_TO_LATIN[char] || char)
    .join('');

  // Extract the first number found before any other words or parentheses
  const match = normalized.match(/(\d+)\s*(?:mn|min|នាទី)?/i);
  if (match && match[1]) {
    const val = parseInt(match[1], 10);
    if (!isNaN(val) && val > 0 && val <= 300) {
      return val;
    }
  }

  return 50;
}

export interface StepDurationBreakdown {
  totalMinutes: number;
  step1: number; // រដ្ឋបាលថ្នាក់
  step2: number; // រំលឹកមេរៀនចាស់ ឬ កែកិច្ចការផ្ទះ
  step3: number; // មេរៀនថ្មី (ទ្រឹស្ដី + ការអនុវត្ត)
  step4: number; // ពង្រឹងចំណេះដឹង
  step5: number; // បណ្ដាំផ្ញើ និងកិច្ចការផ្ទះ
  step1Str: string;
  step2Str: string;
  step3Str: string;
  step4Str: string;
  step5Str: string;
  depthGuidance: string; // Guidance on how deep lesson content should be
}

/**
 * Calculate the pedagogical time breakdown across 5 steps based on total minutes
 */
export function calculateStepDurations(totalMinutesInput: number | string): StepDurationBreakdown {
  const total = typeof totalMinutesInput === 'number'
    ? totalMinutesInput
    : parseDurationMinutes(totalMinutesInput);

  let step1: number;
  let step2: number;
  let step4: number;
  let step5: number;
  let depthGuidance = '';

  if (total <= 40) {
    // 40 minutes (Primary / short secondary period)
    step1 = 2; // រដ្ឋបាលថ្នាក់
    step2 = 5; // រំលឹកមេរៀនចាស់
    step4 = 6; // ពង្រឹងចំណេះដឹង
    step5 = 3; // បណ្ដាំផ្ញើ
    depthGuidance = 'ខ្លឹមសារខ្លីល្មម ផ្ដោតលើគោលគំនិតគន្លឹះ ១ និងលំហាត់គំរូសាមញ្ញ (ជំហានទី៣៖ ២៤ នាទី)';
  } else if (total <= 50) {
    // 50 minutes (Standard 1 secondary / high school period)
    step1 = 3;
    step2 = 5;
    step4 = 8;
    step5 = 4;
    depthGuidance = 'ខ្លឹមសារស្តង់ដារ ១ ម៉ោងសិក្សា៖ ទ្រឹស្ដី ឧទាហរណ៍ និងសកម្មភាពក្រុម (ជំហានទី៣៖ ៣០ នាទី)';
  } else if (total <= 60) {
    // 60 minutes
    step1 = 3;
    step2 = 7;
    step4 = 10;
    step5 = 5;
    depthGuidance = 'ខ្លឹមសារមធ្យមទូលំទូលាយ មានការអនុវត្ត និងលំហាត់វាស់ស្ទង់ជាក់ស្ដែង (ជំហានទី៣៖ ៣៥ នាទី)';
  } else if (total <= 90) {
    // 90 minutes (Block period / university)
    step1 = 5;
    step2 = 10;
    step4 = 15;
    step5 = 5;
    depthGuidance = 'ខ្លឹមសារស៊ីជម្រៅកម្រិតខ្ពស់ មានការបែងចែកដំណាក់កាលសិក្សា ការពិភាក្សា និងបទបង្ហាញជាក្រុម (ជំហានទី៣៖ ៥៥ នាទី)';
  } else {
    // 100+ minutes (Double period / 2 ម៉ោងសិក្សាជាប់គ្នា)
    step1 = 5;
    step2 = 10;
    step4 = 20;
    step5 = 5;
    depthGuidance = 'ខ្លឹមសារលម្អិតពេញលេញ ២ ម៉ោងសិក្សាជាប់គ្នា៖ ទ្រឹស្ដីស៊ីជម្រៅ ឧទាហរណ៍ពហុទម្រង់ សកម្មភាពពិសោធន៍/ស្រាវជ្រាវ និងការការពារលទ្ធផលជាក្រុម (ជំហានទី៣៖ ៦០+ នាទី)';
  }

  // Step 3 gets the remainder so total is guaranteed 100% exact!
  const step3 = total - (step1 + step2 + step4 + step5);

  return {
    totalMinutes: total,
    step1,
    step2,
    step3,
    step4,
    step5,
    step1Str: `${toKhmerNumber(step1)} នាទី`,
    step2Str: `${toKhmerNumber(step2)} នាទី`,
    step3Str: `${toKhmerNumber(step3)} នាទី`,
    step4Str: `${toKhmerNumber(step4)} នាទី`,
    step5Str: `${toKhmerNumber(step5)} នាទី`,
    depthGuidance,
  };
}

/**
 * Sum minutes from an array of steps
 */
export function sumStepsMinutes(steps: { duration: string }[]): number {
  return steps.reduce((acc, step) => {
    return acc + parseDurationMinutes(step.duration);
  }, 0);
}
