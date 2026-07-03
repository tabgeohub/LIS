import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fitImageToBox } from "./pdfReportMapPages";

type PdfAttachment = { name: string; blob: Blob; taken_at?: number };

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

function resolveTakenAt(att: PdfAttachment): number | undefined {
  if (att.taken_at != null && !Number.isNaN(att.taken_at)) return att.taken_at;
  const match = att.name?.match(/attachment-(\d+)\./);
  return match ? parseInt(match[1], 10) : undefined;
}

async function loadScaledImage(rawUrl: string) {
  const img = new Image();
  return new Promise<{ w: number; h: number; dataUrl: string }>((resolve) => {
    img.onload = () => {
      const target = fitImageToBox(img.width, img.height, 160, 220);
      const maxCanvasW = 1400;
      const scale = Math.min(1, maxCanvasW / img.width);
      const canvasW = Math.max(1, Math.round(img.width * scale));
      const canvasH = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = canvasW;
      canvas.height = canvasH;
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvasW, canvasH);
      resolve({ ...target, dataUrl: canvas.toDataURL("image/jpeg", 0.85) });
    };
    img.src = rawUrl;
  });
}

async function addImageAttachmentPage(
  doc: jsPDF,
  att: PdfAttachment,
  index: number
) {
  let rawUrl = "";
  try {
    rawUrl = await blobToDataUrl(att.blob);
  } catch {
    return;
  }

  const { w: drawW, h: drawH, dataUrl: scaledUrl } = await loadScaledImage(rawUrl);
  doc.addPage();
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Bijlage ${index + 1}: ${att.name}`, 25, 20);
  doc.addImage(scaledUrl, "JPEG", 25, 24, drawW, drawH);

  const takenAt = resolveTakenAt(att);
  if (takenAt == null) return;

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

function addOtherAttachmentsTable(doc: jsPDF, otherAtts: PdfAttachment[]) {
  doc.addPage();
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Overige bijlagen", 25, 20);

  autoTable(doc, {
    startY: 26,
    margin: { left: 25, right: 25 },
    styles: { fontSize: 11, cellPadding: 2 },
    head: [["Bestandsnaam", "Type", "Opmerking"]],
    body: otherAtts.map((a) => [
      a.name,
      a.blob.type || "-",
      "Niet-beeldbijlage (niet inline weergegeven)",
    ]),
  });
}

export async function addAttachmentPages(
  doc: jsPDF,
  attachments: PdfAttachment[]
) {
  const imageAtts = attachments.filter((a) => a.blob.type?.startsWith("image/"));
  const otherAtts = attachments.filter((a) => !a.blob.type?.startsWith("image/"));

  for (let i = 0; i < imageAtts.length; i++) {
    await addImageAttachmentPage(doc, imageAtts[i], i);
  }

  if (otherAtts.length > 0) {
    addOtherAttachmentsTable(doc, otherAtts);
  }
}
