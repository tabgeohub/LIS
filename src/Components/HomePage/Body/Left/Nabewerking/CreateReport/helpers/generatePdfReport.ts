import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFPointDataType } from "Types";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

// helper: Blob -> data URL
async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

// helper: fit an image into a box while preserving aspect ratio
function fitToBox(
  imgW: number,
  imgH: number,
  maxW: number,
  maxH: number
): { w: number; h: number } {
  const ratio = Math.min(maxW / imgW, maxH / imgH);
  return { w: imgW * ratio, h: imgH * ratio };
}

export async function generatePdfReport(
  pointData: PDFPointDataType,
  overviewImage: ImageData,
  detailImage: ImageData,
  pilootOptions: {
    label: string;
    value: string;
  }[],
  attachments?: { name: string; blob: Blob; taken_at?: number }[],
  preloadedLogoDataUrl?: string
): Promise<Blob> {
  const doc = new jsPDF();

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, "F");

  if (preloadedLogoDataUrl) {
    // Use preloaded data URL (fast path)
    doc.addImage(preloadedLogoDataUrl, "PNG", 20, 15, 25, 25);
  } else {
    // Fallback to on-demand loading (slower)
    const logo = new Image();
    logo.src = `${window.location.origin}/logo.png`;
    await new Promise((resolve) => {
      logo.onload = () => {
        doc.addImage(logo, "PNG", 20, 15, 25, 25);
        resolve(true);
      };
    });
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Ministerie van Infrastructuur", 50, 22);
  doc.text("en Waterstaat", 50, 28);

  doc.setFontSize(18);
  doc.text("Waarnemingsrapport", 20, 50);

  function wrapInBox(startY: number, height: number) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(20, startY - 2, 170, height + 4);
  }

  const generalStart = 55;
  autoTable(doc, {
    startY: generalStart,
    margin: { left: 25 },
    styles: {
      fontSize: 11,
      halign: "left",
      cellPadding: 1,
      fillColor: [255, 255, 255],
      textColor: 0,
    },
    alternateRowStyles: { fillColor: [255, 255, 255] },
    body: [
      [
        { content: "Datum:", styles: { fontStyle: "bold" } },
        new Date(pointData.datum).toLocaleDateString(),
        { content: "Piloot:", styles: { fontStyle: "bold" } },
        pointData.piloot !== ""
          ? pilootOptions.find((p) => p.value === pointData.piloot)?.label ||
            "-"
          : "-",
      ],
      [
        { content: "Luchtvaartuig:", styles: { fontStyle: "bold" } },
        pointData.luchtvaartuig || "-",
        { content: "Waarnemer:", styles: { fontStyle: "bold" } },
        pointData.waarnemer || "-",
      ],
    ],
  });
  wrapInBox(generalStart, doc.lastAutoTable.finalY - generalStart);

  const coordsStart = doc.lastAutoTable.finalY + 8;
  autoTable(doc, {
    startY: coordsStart,
    margin: { left: 25 },
    styles: {
      fontSize: 11,
      halign: "left",
      cellPadding: 1,
      fillColor: [255, 255, 255],
    },
    alternateRowStyles: { fillColor: [255, 255, 255] },
    body: [
      [
        { content: "Tijd:", styles: { fontStyle: "bold" } },
        (pointData as any).tijd || "-",
        "",
        "",
      ],
      [
        { content: "Coördinaten:", styles: { fontStyle: "bold" } },
        { content: "RD:", styles: { fontStyle: "italic" } },
        `X: ${pointData.rdX?.toFixed(3)}  Y: ${pointData.rdY?.toFixed(3)}`,
        "",
      ],
      [
        "",
        { content: "WGS:", styles: { fontStyle: "italic" } },
        `NB: ${pointData.lat?.toFixed(3)}  OL: ${pointData.long?.toFixed(3)}`,
        "",
      ],
    ],
  });
  wrapInBox(coordsStart, doc.lastAutoTable.finalY - coordsStart);

  const detailStart = doc.lastAutoTable.finalY + 8;
  autoTable(doc, {
    startY: detailStart,
    margin: { left: 25 },
    styles: {
      fontSize: 11,
      halign: "left",
      cellPadding: 1,
      fillColor: [255, 255, 255],
    },
    alternateRowStyles: { fillColor: [255, 255, 255] },
    body: [
      [
        { content: "Activiteit:", styles: { fontStyle: "bold" } },
        pointData.activiteit || "-",
      ],
      [
        { content: "Organisatie:", styles: { fontStyle: "bold" } },
        pointData.organisatie || "-",
      ],
      [
        { content: "Regio:", styles: { fontStyle: "bold" } },
        pointData.regio || "-",
      ],
      [
        { content: "Omschrijving:", styles: { fontStyle: "bold" } },
        pointData.omschrijving || "-",
      ],
      [
        { content: "Aanvullende informatie:", styles: { fontStyle: "bold" } },
        pointData.aanvullende || "-",
      ],
    ],
  });
  wrapInBox(detailStart, doc.lastAutoTable.finalY - detailStart);

  // Optimize map images: downscale and JPEG-compress before embedding
  async function imageDataToJpegDataUrl(
    img: ImageData,
    targetW: number,
    targetH: number,
    quality: number
  ): Promise<string> {
    const srcCanvas = document.createElement("canvas");
    srcCanvas.width = img.width;
    srcCanvas.height = img.height;
    const srcCtx = srcCanvas.getContext("2d");
    srcCtx?.putImageData(img, 0, 0);

    const dstCanvas = document.createElement("canvas");
    dstCanvas.width = targetW;
    dstCanvas.height = targetH;
    const dstCtx = dstCanvas.getContext("2d");
    if (dstCtx) {
      dstCtx.drawImage(
        srcCanvas,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        targetW,
        targetH
      );
    }
    return dstCanvas.toDataURL("image/jpeg", quality);
  }

  const y1 = doc.lastAutoTable.finalY + 10;
  doc.text("Overzichtkaart", 25, y1);
  const overviewUrl = await imageDataToJpegDataUrl(
    overviewImage,
    1200,
    675,
    0.85
  );
  doc.addImage(overviewUrl, "JPEG", 25, y1 + 2, 160, 90);

  doc.addPage();
  doc.text("Detailkaart", 25, 20);
  const detailUrl = await imageDataToJpegDataUrl(detailImage, 1200, 675, 0.9);
  doc.addImage(detailUrl, "JPEG", 25, 22, 160, 90);

  // ===== NEW: attachments embedded into the PDF =====
  if (attachments && attachments.length > 0) {
    // Separate image vs non-image for better rendering
    const imageAtts = attachments.filter((a) =>
      a.blob.type?.startsWith("image/")
    );
    const otherAtts = attachments.filter(
      (a) => !a.blob.type?.startsWith("image/")
    );

    // Render each image attachment on its own page
    for (let i = 0; i < imageAtts.length; i++) {
      const att = imageAtts[i];

      let rawUrl = "";
      try {
        rawUrl = await blobToDataUrl(att.blob);
      } catch {
        continue;
      }

      const img = new Image();
      const {
        w: drawW,
        h: drawH,
        dataUrl: scaledUrl,
      } = await new Promise<{
        w: number;
        h: number;
        dataUrl: string;
      }>((resolve) => {
        img.onload = () => {
          const target = fitToBox(img.width, img.height, 160, 220);

          const maxCanvasW = 1400;
          const scale = Math.min(1, maxCanvasW / img.width);
          const canvasW = Math.max(1, Math.round(img.width * scale));
          const canvasH = Math.max(1, Math.round(img.height * scale));

          const canvas = document.createElement("canvas");
          canvas.width = canvasW;
          canvas.height = canvasH;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvasW, canvasH);
          const url = canvas.toDataURL("image/jpeg", 0.85);
          resolve({ w: target.w, h: target.h, dataUrl: url });
        };
        img.src = rawUrl;
      });

      doc.addPage();
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Bijlage ${i + 1}: ${att.name}`, 25, 20);
      doc.addImage(scaledUrl, "JPEG", 25, 24, drawW, drawH);

      const imgBottomY = 24 + drawH;
      let takenAt = att.taken_at;
      if ((takenAt == null || Number.isNaN(takenAt)) && att.name) {
        const match = att.name.match(/attachment-(\d+)\./);
        if (match) {
          takenAt = parseInt(match[1], 10);
        }
      }
      if (takenAt != null && !Number.isNaN(takenAt)) {
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
        doc.text(formatted, 25, imgBottomY + 8);
        doc.setTextColor(0, 0, 0);
      }
    }

    // If there are non-image attachments, list them on a summary page
    if (otherAtts.length > 0) {
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
  }

  const pdfBlob = doc.output("blob");
  return pdfBlob;
}
