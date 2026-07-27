import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  blobToDataUrl,
  drawTakenAtCaption,
  loadScaledImage,
  resolveTakenAt,
} from "./pdfReportAttachmentImage";

type PdfAttachment = { name: string; blob: Blob; taken_at?: number };

async function addImageAttachmentPage(input: {
  doc: jsPDF;
  att: PdfAttachment;
  index: number;
}) {
  const { doc, att, index } = input;
  let rawUrl = "";
  try {
    rawUrl = await blobToDataUrl(att.blob);
  } catch {
    return;
  }
  const { w: drawW, h: drawH, dataUrl: scaledUrl } =
    await loadScaledImage(rawUrl);
  doc.addPage();
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Bijlage ${index + 1}: ${att.name}`, 25, 20);
  doc.addImage(scaledUrl, "JPEG", 25, 24, drawW, drawH);
  const takenAt = resolveTakenAt(att);
  if (takenAt != null) drawTakenAtCaption({ doc, takenAt, drawH });
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
    await addImageAttachmentPage({ doc, att: imageAtts[i], index: i });
  }
  if (otherAtts.length > 0) addOtherAttachmentsTable(doc, otherAtts);
}
