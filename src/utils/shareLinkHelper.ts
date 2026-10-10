import QRCode from 'qrcode';
import { LessonPlanData } from '../types/lessonPlan';

// Generates a scannable share URL for a given lesson plan.
// Attempts to store on backend for a concise, high-scannability URL.
// Falls back to URL-safe compressed hash encoding if backend is unreachable.
export async function generateShareUrl(plan: LessonPlanData): Promise<{ url: string; isShort: boolean }> {
  const origin = window.location.origin;
  const pathname = window.location.pathname;

  try {
    const res = await fetch('/api/share-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.shareId) {
        return {
          url: `${origin}${pathname}?share=${encodeURIComponent(data.shareId)}`,
          isShort: true,
        };
      }
    }
  } catch (e) {
    console.warn('Backend share endpoint unavailable, falling back to client-side encoded URL:', e);
  }

  // Client-side fallback: encode plan JSON
  try {
    const compactPlan = {
      id: plan.id,
      header: plan.header,
      objectives: plan.objectives,
      materials: plan.materials,
      steps: plan.steps,
      boardSummary: plan.boardSummary,
      reflection: plan.reflection,
      vocabularyList: plan.vocabularyList,
      practicalApplication: plan.practicalApplication,
    };
    const jsonStr = JSON.stringify(compactPlan);
    const b64 = btoa(encodeURIComponent(jsonStr));
    return {
      url: `${origin}${pathname}#shared_data=${b64}`,
      isShort: false,
    };
  } catch (e) {
    console.error('Failed to create fallback client-side share url:', e);
    return {
      url: `${origin}${pathname}`,
      isShort: false,
    };
  }
}

// Fetches a shared lesson plan either by server ID or from inline payload
export async function resolveSharedPlan(shareIdOrPayload: string): Promise<LessonPlanData | null> {
  if (!shareIdOrPayload) return null;

  // 1. Try server endpoint if it's a short ID (e.g. starts with lp)
  if (shareIdOrPayload.startsWith('lp')) {
    try {
      const res = await fetch(`/api/shared-plan/${encodeURIComponent(shareIdOrPayload)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.plan) {
          return data.plan;
        }
      }
    } catch (e) {
      console.error('Failed to fetch plan from server:', e);
    }
  }

  // 2. Try decoding inline data
  try {
    const decodedStr = decodeURIComponent(atob(shareIdOrPayload));
    const parsed = JSON.parse(decodedStr);
    if (parsed && parsed.header && parsed.steps) {
      return parsed;
    }
  } catch {
    // Not inline base64
  }

  return null;
}

// Generates QR Code data URL with MoEYS styling colors
export async function generateQRCodeDataUrl(
  text: string,
  options?: {
    darkColor?: string;
    lightColor?: string;
    size?: number;
  }
): Promise<string> {
  const darkColor = options?.darkColor || '#1e3a8a'; // MoEYS Dark Blue
  const lightColor = options?.lightColor || '#ffffff';
  const size = options?.size || 320;

  return QRCode.toDataURL(text, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: size,
    color: {
      dark: darkColor,
      light: lightColor,
    },
  });
}

// Generates and triggers download of a high-resolution branded QR Code voucher/badge
export async function downloadQRCodeBadge(
  plan: LessonPlanData,
  qrDataUrl: string,
  shareUrl: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Card dimensions: 600 x 780 px (high resolution card)
      canvas.width = 600;
      canvas.height = 780;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Card border
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 4;
      ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

      // Inner thin border
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1;
      ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

      // Header Banner (MoEYS Blue)
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(20, 20, canvas.width - 40, 110);

      // Header Text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 20px "Kantumruy Pro", "Battambang", sans-serif';
      ctx.fillText('ព្រះរាជាណាចក្រកម្ពុជា', canvas.width / 2, 54);

      ctx.font = 'bold 15px "Kantumruy Pro", "Battambang", sans-serif';
      ctx.fillText('ជាតិ សាសនា ព្រះមហាក្សត្រ', canvas.width / 2, 80);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '13px "Kantumruy Pro", sans-serif';
      ctx.fillText('𖧷 កិច្ចតែងការបង្រៀនស្តង់ដារ MoEYS 𖧷', canvas.width / 2, 108);

      // Lesson Info Summary Box
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(36, 146, canvas.width - 72, 120);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(36, 146, canvas.width - 72, 120);

      // Topic Title
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.font = 'bold 19px "Kantumruy Pro", "Battambang", sans-serif';
      const topicText = plan.header.topic || 'កិច្ចតែងការបង្រៀន';
      ctx.fillText(topicText.substring(0, 36), canvas.width / 2, 180);

      // Subject & Grade
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 14px "Kantumruy Pro", sans-serif';
      ctx.fillText(
        `មុខវិជ្ជា៖ ${plan.header.subject || 'ទូទៅ'}  |  ${plan.header.grade || 'ថ្នាក់ទី'}`,
        canvas.width / 2,
        210
      );

      // Teacher & School
      ctx.fillStyle = '#64748b';
      ctx.font = '13px "Kantumruy Pro", sans-serif';
      ctx.fillText(
        `គ្រូបង្រៀន៖ ${plan.header.teacherName || 'គ្រូបង្រៀន'}  •  ${plan.header.duration || '៥០ នាទី'}`,
        canvas.width / 2,
        240
      );

      // Draw QR Code Image
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.onload = () => {
        const qrSize = 320;
        const qrX = (canvas.width - qrSize) / 2;
        const qrY = 286;

        // QR Code white container frame
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

        // Instruction below QR code
        ctx.fillStyle = '#1e3a8a';
        ctx.textAlign = 'center';
        ctx.font = 'bold 15px "Kantumruy Pro", "Battambang", sans-serif';
        ctx.fillText('ស្កេន QR Code ដើម្បីបើកកិច្ចតែងការបង្រៀន', canvas.width / 2, 650);

        ctx.fillStyle = '#64748b';
        ctx.font = '12px "Kantumruy Pro", sans-serif';
        ctx.fillText('ប្រើប្រាស់ Camera ទូរស័ព្ទដៃ ឬកម្មវិធី QR Scanner', canvas.width / 2, 674);

        // Footer note
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "Kantumruy Pro", sans-serif';
        ctx.fillText(
          'ប្រព័ន្ធបញ្ញាសិប្បនិម្មិតជំនួយគ្រូបង្រៀនកម្ពុជា • ត្រឹមត្រូវតាមស្តង់ដារ MoEYS',
          canvas.width / 2,
          730
        );

        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const safeTopic = (plan.header.topic || 'lesson_plan').replace(/[/\\?%*:|"<>]/g, '_').substring(0, 30);
            a.href = url;
            a.download = `QRCode_កិច្ចតែងការ_${safeTopic}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            resolve();
          } else {
            reject(new Error('Canvas blob generation failed'));
          }
        }, 'image/png');
      };

      qrImg.onerror = () => {
        reject(new Error('Failed to load QR image on canvas'));
      };

      qrImg.src = qrDataUrl;
    } catch (err) {
      reject(err);
    }
  });
}
