import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

export async function exportLessonPlanToPdf(
  elementId: string,
  filename: string,
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('រកមិនឃើញផ្ទាំងកិច្ចតែងការបង្រៀន');
  }

  const safeFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  // Render element to canvas using html2canvas-pro (native support for oklch, lab, and CSS variables)
  const canvas = await html2canvas(element, {
    scale: 2, // 2x scale for crisp, professional print quality
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    ignoreElements: (el: Element) => el.classList.contains('no-print'),
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  // A4 dimensions in mm
  const pageWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pageHeight;

  // Subsequent pages if content exceeds 1 page
  while (heightLeft > 5) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
  }

  pdf.save(safeFilename);

  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
  });
}
