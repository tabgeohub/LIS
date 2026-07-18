import { generatePdfReport } from "../generatePdfReport";
import { PDFPointDataType } from "Types";
import type { AttachmentWithMeta, ProcessedItem } from "./types";

export async function finalizeReportPdfItem(input: {
  filenamePrefix: "Point" | "Geometry";
  safeName: string;
  pointData: PDFPointDataType;
  overviewImage: ImageData;
  detailImage: ImageData;
  pilootOptions: { label: string; value: string }[];
  attachments: AttachmentWithMeta[];
  logoDataUrl: string | null;
}): Promise<ProcessedItem> {
  const pdfData = await generatePdfReport({
    pointData: input.pointData,
    overviewImage: input.overviewImage,
    detailImage: input.detailImage,
    pilootOptions: input.pilootOptions,
    attachments: input.attachments,
    preloadedLogoDataUrl: input.logoDataUrl || undefined,
  });
  return {
    filename: `Waarnemingsrapport_${input.filenamePrefix}_${input.safeName}.pdf`,
    pdfData: await pdfData.arrayBuffer(),
    attachments: input.attachments,
    pointName: input.safeName,
  };
}
