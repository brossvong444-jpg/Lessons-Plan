import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
} from 'docx';
import { LessonPlanData } from '../types/lessonPlan';
import { generateSubjectPracticalApplication, generateSubjectVocabulary } from '../../curriculumEngine';

function formatDocxCellParagraphs(text: string, isLessonContent: boolean = false): Paragraph[] {
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  return lines.map((line) => {
    const trimmed = line.trim();

    // 1. Heading
    const isHeading =
      /^(?:[០-៩0-9]+[.)]|I[VX]|VI{0,3}|[ក-អ][.)]|ជំពូកទី|មេរៀនទី)/.test(trimmed) ||
      /^\*\s*(?:ប្រធាន|ដំណោះស្រាយ|លំហាត់|កិច្ចការ|ក្រុមទី|សន្និដ្ឋាន|ចំណាំ|រូបមន្ត|វិធាន)/.test(trimmed);
    if (isHeading) {
      const cleanHeading = trimmed.replace(/^\*\s*/, '');
      return new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [new TextRun({ text: cleanHeading, font: 'Kantumruy Pro', bold: true, color: '0F172A' })],
      });
    }

    // 2. Pedagogical callout header [ការពន្យល់ពេលរៀនលម្អិត...], [ដំណោះស្រាយលម្អិត...]
    const isPedagogical = /^[-•*]?\s*\[.*\]/.test(trimmed);
    if (isPedagogical) {
      const badgeText = trimmed.replace(/^[-•*]?\s*\[\s*/, '').replace(/\]\s*[:៖]?\s*$/, '').trim();
      const isExpl = badgeText.includes('ពន្យល់') || badgeText.includes('និយមន័យ');
      const isSol = badgeText.includes('ដំណោះស្រាយ') || badgeText.includes('គណនា');
      return new Paragraph({
        spacing: { before: 100, after: 40 },
        children: [
          new TextRun({
            text: `[${badgeText}]`,
            font: 'Kantumruy Pro',
            bold: true,
            color: isExpl ? '312E81' : isSol ? '065F46' : '1E3A8A',
          }),
        ],
      });
    }

    // 3. Inline explanation (ពន្យល់ពេលរៀន៖ ...)
    const isExpl = /^[-•*]?\s*(?:ពន្យល់ពេលរៀន|ពន្យល់|មូលហេតុ|ហេតុអ្វី)(?:៖|:)/i.test(trimmed);
    if (isExpl) {
      const cleanExpl = trimmed.replace(/^[-•*]\s*/, '').trim();
      return new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({ text: '💡 ', font: 'Kantumruy Pro' }),
          new TextRun({ text: cleanExpl, font: 'Kantumruy Pro', italics: true, color: '78350F' }),
        ],
      });
    }

    // 4. Mathematical Equation / Formula line
    const isMath = /^(?:=|=>|→|x[₁₂12]?\s*=|Δ\s*=|a\s*=|b\s*=|c\s*=|F\s*=|m\s*=|v\s*=|A\s*=|B\s*=|C\s*=)/.test(trimmed);
    if (isMath && isLessonContent) {
      return new Paragraph({
        indent: { left: 240 },
        children: [new TextRun({ text: trimmed, font: 'Consolas', bold: true, color: '1E293B' })],
      });
    }

    // 5. Standard bullet point
    const clean = trimmed.replace(/^[-•*]\s*/, '').trim();
    return new Paragraph({
      children: [new TextRun({ text: `• ${clean}`, font: 'Kantumruy Pro' })],
    });
  });
}

export async function exportLessonPlanToDocx(plan: LessonPlanData): Promise<Blob> {
  const h = plan.header;
  const obj = plan.objectives;
  const mat = plan.materials;

  const practicalApp =
    plan.practicalApplication ||
    generateSubjectPracticalApplication(h.topic, h.subject, h.grade);

  const vocabList =
    plan.vocabularyList ||
    generateSubjectVocabulary(h.topic, h.subject, h.grade);

  const step3Index = plan.steps.findIndex(
    (s, i) =>
      i === 2 ||
      Boolean(s.stepNumber && (s.stepNumber.includes('៣') || s.stepNumber.includes('3'))) ||
      Boolean(s.stepTitle && s.stepTitle.includes('មេរៀនថ្មី')),
  );
  const targetStep3Idx = step3Index !== -1 ? step3Index : 2;

  // Thin border for tables
  const thinBorder = {
    style: BorderStyle.SINGLE,
    size: 1,
    color: '999999',
  };

  const tableBorders = {
    top: thinBorder,
    bottom: thinBorder,
    left: thinBorder,
    right: thinBorder,
    insideHorizontal: thinBorder,
    insideVertical: thinBorder,
  };

  // Header paragraphs
  const doc = new Document({
    creator: 'ឡោម មនីវង្ស (Lorm Monyvong)',
    title: `កិច្ចតែងការបង្រៀន - ${h.topic || ''} - ឡោម មនីវង្ស`,
    description: 'កិច្ចតែងការបង្រៀនស្តង់ដារ MoEYS បង្កើតដោយកម្មវិធី Khmer Teacher Lesson Plan AI របស់ ឡោម មនីវង្ស',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1200,
              bottom: 1000,
              left: 1200,
            },
          },
        },
        children: [
          // National Motto
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'ព្រះរាជាណាចក្រកម្ពុជា',
                font: 'Moul',
                bold: true,
                size: 26,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'ជាតិ សាសនា ព្រះមហាក្សត្រ',
                font: 'Moul',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '𖧷 𖧷 𖧷',
                size: 20,
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Document Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'កិច្ចតែងការបង្រៀន',
                font: 'Moul',
                bold: true,
                size: 32,
                color: '1A365D',
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Unified Info Table directly under "កិច្ចតែងការបង្រៀន"
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 6, color: '333333' },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: '333333' },
              left: { style: BorderStyle.SINGLE, size: 6, color: '333333' },
              right: { style: BorderStyle.SINGLE, size: 6, color: '333333' },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
              insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
            },
            rows: [
              // Row 1: Subject | Grade
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'មុខវិជ្ជា៖ ', bold: true, font: 'Kantumruy Pro', size: 22 }),
                          new TextRun({ text: h.subject || '............................', font: 'Kantumruy Pro', size: 22 }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'ថ្នាក់ទី៖ ', bold: true, font: 'Kantumruy Pro', size: 22 }),
                          new TextRun({ text: h.grade || '............................', font: 'Kantumruy Pro', size: 22 }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),

              // Row 2: Date | Duration
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'កាលបរិច្ឆេទ៖ ', bold: true, font: 'Kantumruy Pro', size: 22 }),
                          new TextRun({ text: h.date || '............................', font: 'Kantumruy Pro', size: 22 }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'រយៈពេល៖ ', bold: true, font: 'Kantumruy Pro', size: 22 }),
                          new TextRun({ text: h.duration || '៥០ នាទី', font: 'Kantumruy Pro', size: 22 }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),

              // Row 3: Chapter | Lesson No
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'ជំពូកទី៖ ', bold: true, font: 'Kantumruy Pro', size: 22 }),
                          new TextRun({ text: h.chapter || '—', font: 'Kantumruy Pro', size: 22 }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'មេរៀនទី៖ ', bold: true, font: 'Kantumruy Pro', size: 22 }),
                          new TextRun({ text: h.lessonNo || '—', font: 'Kantumruy Pro', size: 22 }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),

              // Row 4: Lesson Topic (Full Width)
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 2,
                    shading: { fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'ប្រធានបទ/ចំណងជើងមេរៀន៖ ', bold: true, font: 'Kantumruy Pro', size: 24 }),
                          new TextRun({ text: h.topic || '', bold: true, font: 'Moul', size: 24, color: '1A365D' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),

              // Row 5: Teaching Method | Teaching Strategy
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'វិធីសាស្ត្របង្រៀន៖ ', bold: true, font: 'Kantumruy Pro', size: 20 }),
                          new TextRun({ text: h.teachingMethod || 'វិធីសាស្ត្របង្រៀនតាមបែបសិស្សមជ្ឈមណ្ឌល (Student-Centered)', font: 'Kantumruy Pro', size: 20 }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'យុទ្ធវិធីបង្រៀន៖ ', bold: true, font: 'Kantumruy Pro', size: 20, color: '4C1D95' }),
                          new TextRun({ text: h.teachingStrategy || 'យុទ្ធវិធី គិត-គូ-ចែករំលែក (Think-Pair-Share)', font: 'Kantumruy Pro', size: 20, color: '4C1D95' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),

              // Row 6: Integration | Teacher & School
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'ការបញ្ជ្រាប៖ ', bold: true, font: 'Kantumruy Pro', size: 20, color: '065F46' }),
                          new TextRun({ text: h.integration || 'ការអប់រំបរិស្ថាន សុខភាព និងសីលធម៌រស់នៅស្អាត', font: 'Kantumruy Pro', size: 20, color: '065F46' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'គ្រូបង្រៀន៖ ', bold: true, font: 'Kantumruy Pro', size: 20 }),
                          new TextRun({ text: h.teacherName || '............................', font: 'Kantumruy Pro', size: 20 }),
                          new TextRun({ text: '  |  សាលារៀន៖ ', bold: true, font: 'Kantumruy Pro', size: 20 }),
                          new TextRun({ text: h.schoolName || '............................', font: 'Kantumruy Pro', size: 20 }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),

          // Section I: Objectives
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'I. វត្ថុបំណង (Objectives)',
                font: 'Moul',
                bold: true,
                size: 22,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: '១. ចំណេះដឹង (Knowledge)៖', bold: true, font: 'Kantumruy Pro' })],
          }),
          ...(obj.knowledge || []).map(
            (k) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: k, font: 'Kantumruy Pro' })],
              }),
          ),
          new Paragraph({
            children: [new TextRun({ text: '២. បំណិន (Skills)៖', bold: true, font: 'Kantumruy Pro' })],
          }),
          ...(obj.skills || []).map(
            (s) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: s, font: 'Kantumruy Pro' })],
              }),
          ),
          new Paragraph({
            children: [new TextRun({ text: '៣. ឥរិយាបថ (Attitude)៖', bold: true, font: 'Kantumruy Pro' })],
          }),
          ...(obj.attitude || []).map(
            (a) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: a, font: 'Kantumruy Pro' })],
              }),
          ),

          new Paragraph({ text: '' }),

          // Section II: Teaching Materials
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'II. សម្ភារឧបទេស (Teaching Materials)',
                font: 'Moul',
                bold: true,
                size: 22,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: '- ចំពោះគ្រូ៖ ', bold: true, font: 'Kantumruy Pro' }), new TextRun({ text: (mat.teacher || []).join(', '), font: 'Kantumruy Pro' })],
          }),
          new Paragraph({
            children: [new TextRun({ text: '- ចំពោះសិស្ស៖ ', bold: true, font: 'Kantumruy Pro' }), new TextRun({ text: (mat.students || []).join(', '), font: 'Kantumruy Pro' })],
          }),
          ...(plan.illustration
            ? [
                new Paragraph({
                  children: [
                    new TextRun({ text: '- រូបភាពឧបទេស AI Auto ទៅតាមប្រធានបទ៖ ', bold: true, font: 'Kantumruy Pro', color: '047857' }),
                    new TextRun({
                      text: plan.illustration.caption || `រូបភាពឧបទេស និងដ្យាក្រាមគរុកោសល្យ៖ ${h.topic}`,
                      font: 'Kantumruy Pro',
                      italics: true,
                      color: '065F46',
                    }),
                  ],
                }),
              ]
            : []),
          ...(vocabList && vocabList.length > 0
            ? [
                new Paragraph({
                  children: [
                    new TextRun({ text: '- វាក្យសព្ទគន្លឹះក្នុងមេរៀន៖ ', bold: true, font: 'Kantumruy Pro' }),
                    new TextRun({
                      text: vocabList.map((v) => v.term).join(' • '),
                      font: 'Kantumruy Pro',
                      color: '1E3A8A',
                    }),
                  ],
                }),
              ]
            : []),

          new Paragraph({ text: '' }),

          // Section III: Teaching & Learning Process Table
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'III. ដំណើរការបង្រៀន និងរៀន (Teaching and Learning Process)',
                font: 'Moul',
                bold: true,
                size: 22,
                color: '1E3A8A',
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
              // Table Header (3 columns: Teacher Activity, Content, Student Activity)
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    width: { size: 33, type: WidthType.PERCENTAGE },
                    shading: { fill: 'FEF3C7' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: 'សកម្មភាពគ្រូ', bold: true, font: 'Moul', size: 20 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 34, type: WidthType.PERCENTAGE },
                    shading: { fill: 'FEF3C7' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: 'ខ្លឹមសារមេរៀន', bold: true, font: 'Moul', size: 20 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 33, type: WidthType.PERCENTAGE },
                    shading: { fill: 'FEF3C7' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: 'សកម្មភាពសិស្ស', bold: true, font: 'Moul', size: 20 })],
                      }),
                    ],
                  }),
                ],
              }),
              // Table Step Rows:
              // 1. Merged header row (columnSpan: 3)
              // 2. Data row (Teacher, Content, Student)
              ...plan.steps.flatMap((step) => {
                return [
                  new TableRow({
                    children: [
                      new TableCell({
                        columnSpan: 3,
                        shading: { fill: 'FFFBEB' },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: `${step.stepNumber ? `${step.stepNumber}៖ ` : ''}${step.stepTitle} ${step.duration ? `(${step.duration})` : ''}`,
                                bold: true,
                                font: 'Moul',
                                size: 20,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      // Column 1: សកម្មភាពគ្រូ
                      new TableCell({
                        width: { size: 33, type: WidthType.PERCENTAGE },
                        children: formatDocxCellParagraphs(step.teacherActivity, false),
                      }),
                      // Column 2: ខ្លឹមសារមេរៀន
                      new TableCell({
                        width: { size: 34, type: WidthType.PERCENTAGE },
                        children: formatDocxCellParagraphs(step.content, true),
                      }),
                      // Column 3: សកម្មភាពសិស្ស
                      new TableCell({
                        width: { size: 33, type: WidthType.PERCENTAGE },
                        children: formatDocxCellParagraphs(step.studentActivity, false),
                      }),
                    ],
                  }),
                ];
              }),
            ],
          }),

          new Paragraph({ text: '' }),

          // Section IV: Board Summary
          ...(plan.boardSummary
            ? [
                new Paragraph({
                  heading: HeadingLevel.HEADING_2,
                  children: [
                    new TextRun({
                      text: 'IV. ប្លង់ក្ដារខៀន (Board Summary)',
                      font: 'Moul',
                      bold: true,
                      size: 22,
                      color: '1E3A8A',
                    }),
                  ],
                }),
                ...plan.boardSummary.split('\n').map(
                  (line) =>
                    new Paragraph({
                      children: [new TextRun({ text: line, font: 'Kantumruy Pro' })],
                    }),
                ),
                new Paragraph({ text: '' }),
              ]
            : []),

          // Section V: Reflection
          ...(plan.reflection
            ? [
                new Paragraph({
                  heading: HeadingLevel.HEADING_2,
                  children: [
                    new TextRun({
                      text: 'V. ការស្វ័យតម្លៃ និងការឆ្លុះបញ្ចាំងរបស់គ្រូ (Teacher Reflection)',
                      font: 'Moul',
                      bold: true,
                      size: 22,
                      color: '1E3A8A',
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: '- ចំណុចខ្លាំង៖ ', bold: true, font: 'Kantumruy Pro' }),
                    new TextRun({ text: plan.reflection.strengths, font: 'Kantumruy Pro' }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: '- ចំណុចខ្វះខាត៖ ', bold: true, font: 'Kantumruy Pro' }),
                    new TextRun({ text: plan.reflection.weaknesses, font: 'Kantumruy Pro' }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: '- វិធានការដោះស្រាយ៖ ', bold: true, font: 'Kantumruy Pro' }),
                    new TextRun({ text: plan.reflection.solutions, font: 'Kantumruy Pro' }),
                  ],
                }),
                new Paragraph({ text: '' }),
              ]
            : []),

          new Paragraph({ text: '' }),

          // Signatures Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'បានឃើញ និងឯកភាព', bold: true, font: 'Kantumruy Pro' }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'នាយកសាលា', font: 'Moul', size: 20 }),
                        ],
                      }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ text: '' }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: '............................................', font: 'Kantumruy Pro' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: h.date || 'ថ្ងៃទី..... ខែ..... ឆ្នាំ២០២....', font: 'Kantumruy Pro' }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'ហត្ថលេខាគ្រូបង្រៀន', font: 'Moul', size: 20 }),
                        ],
                      }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ text: '' }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: h.teacherName || '............................................', font: 'Kantumruy Pro', bold: true }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Supplementary Annex: Key Vocabulary Annex
          ...(vocabList && vocabList.length > 0
            ? [
                new Paragraph({ text: '' }),
                new Paragraph({ text: '' }),
                new Paragraph({
                  heading: HeadingLevel.HEADING_2,
                  children: [
                    new TextRun({
                      text: 'ឧបសម្ព័ន្ធ៖ បញ្ជីវាក្យសព្ទគន្លឹះក្នុងមេរៀន (Key Terms & Vocabulary Reference)',
                      font: 'Moul',
                      bold: true,
                      size: 22,
                      color: '1E3A8A',
                    }),
                  ],
                }),
                ...vocabList.map(
                  (v, vIdx) =>
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${vIdx + 1}. ${v.term}`,
                          bold: true,
                          font: 'Kantumruy Pro',
                          color: '1E3A8A',
                        }),
                        new TextRun({
                          text: v.partOfSpeech ? ` (${v.partOfSpeech})` : '',
                          italics: true,
                          font: 'Kantumruy Pro',
                        }),
                        new TextRun({
                          text: `៖ ${v.definition}`,
                          font: 'Kantumruy Pro',
                        }),
                        ...(v.exampleOrContext
                          ? [
                              new TextRun({
                                text: ` [ឧទាហរណ៍/បរិបទ៖ ${v.exampleOrContext}]`,
                                font: 'Kantumruy Pro',
                                italics: true,
                                color: '4B5563',
                              }),
                            ]
                          : []),
                      ],
                    }),
                ),
              ]
            : []),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 60 },
            children: [
              new TextRun({
                text: '— កម្មវិធីបង្កើតកិច្ចតែងការបង្រៀន AI • រក្សាសិទ្ធិដោយ ឡោម មនីវង្ស (Lorm Monyvong) —',
                font: 'Kantumruy Pro',
                size: 16,
                italics: true,
                color: '64748B',
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
