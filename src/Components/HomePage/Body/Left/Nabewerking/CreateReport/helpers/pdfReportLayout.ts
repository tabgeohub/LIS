import jsPDF from "jspdf";

export async function addPdfLogo(doc: jsPDF, preloadedLogoDataUrl?: string) {
  if (preloadedLogoDataUrl) {
    doc.addImage(preloadedLogoDataUrl, "PNG", 20, 15, 25, 25);
    return;
  }

  const logo = new Image();
  logo.src = `${window.location.origin}/logo.png`;
  await new Promise<void>((resolve) => {
    logo.onload = () => {
      doc.addImage(logo, "PNG", 20, 15, 25, 25);
      resolve();
    };
  });
}

export function addPdfHeader(doc: jsPDF) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Ministerie van Infrastructuur", 50, 22);
  doc.text("en Waterstaat", 50, 28);
  doc.setFontSize(18);
  doc.text("Waarnemingsrapport", 20, 50);
}

export function wrapPdfSection(doc: jsPDF, startY: number, height: number) {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(20, startY - 2, 170, height + 4);
}
