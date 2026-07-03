import jsPDF from "jspdf";
import { PDFPointDataType } from "Types";
import { addPdfHeader, addPdfLogo } from "./pdfReportLayout";
import {
  addCoordinatesTable,
  addDetailTable,
  addGeneralInfoTable,
} from "./pdfReportTables";
import { addMapPages } from "./pdfReportMapPages";
import { addAttachmentPages } from "./pdfReportAttachments";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

export type GeneratePdfReportInput = {
  pointData: PDFPointDataType;
  overviewImage: ImageData;
  detailImage: ImageData;
  pilootOptions: { label: string; value: string }[];
  attachments?: { name: string; blob: Blob; taken_at?: number }[];
  preloadedLogoDataUrl?: string;
};

export async function generatePdfReport(
  input: GeneratePdfReportInput
): Promise<Blob> {
  const {
    pointData,
    overviewImage,
    detailImage,
    pilootOptions,
    attachments,
    preloadedLogoDataUrl,
  } = input;

  const doc = new jsPDF();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, "F");

  await addPdfLogo(doc, preloadedLogoDataUrl);
  addPdfHeader(doc);
  addGeneralInfoTable(doc, pointData, pilootOptions);
  addCoordinatesTable(doc, pointData);
  addDetailTable(doc, pointData);
  await addMapPages(doc, overviewImage, detailImage);

  if (attachments && attachments.length > 0) {
    await addAttachmentPages(doc, attachments);
  }

  return doc.output("blob");
}
