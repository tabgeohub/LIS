import jsPDF from "jspdf";
import { fitImageToBox } from "./pdfReportMapPages";

type PdfAttachment = { name: string; blob: Blob; taken_at?: number };

export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

export function resolveTakenAt(att: PdfAttachment): number | undefined {
  if (att.taken_at != null && !Number.isNaN(att.taken_at)) return att.taken_at;
  const match = att.name?.match(/attachment-(\d+)\./);
  return match ? parseInt(match[1], 10) : undefined;
}

export function drawTakenAtCaption(
  doc: jsPDF,
  takenAt: number,
  drawH: number
) {
  const date = new Date(takenAt);
  const formatted =
    date.toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) || date.toISOString();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(formatted, 25, 24 + drawH + 8);
  doc.setTextColor(0, 0, 0);
}

function paintScaledCanvas(img: HTMLImageElement) {
  const target = fitImageToBox({
    imgW: img.width,
    imgH: img.height,
    maxW: 160,
    maxH: 220,
  });
  const scale = Math.min(1, 1400 / img.width);
  const canvasW = Math.max(1, Math.round(img.width * scale));
  const canvasH = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  canvas.getContext("2d")?.drawImage(img, 0, 0, canvasW, canvasH);
  return { ...target, dataUrl: canvas.toDataURL("image/jpeg", 0.85) };
}

export async function loadScaledImage(rawUrl: string) {
  const img = new Image();
  return new Promise<{ w: number; h: number; dataUrl: string }>((resolve) => {
    img.onload = () => resolve(paintScaledCanvas(img));
    img.src = rawUrl;
  });
}
