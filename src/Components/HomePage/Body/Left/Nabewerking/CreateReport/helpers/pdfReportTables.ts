import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFPointDataType } from "Types";
import { wrapPdfSection } from "./pdfReportLayout";

function addWrappedTable(input: {
  doc: jsPDF;
  startY: number;
  body: any[][];
  textColor?: number;
}) {
  autoTable(input.doc, {
    startY: input.startY,
    margin: { left: 25 },
    styles: {
      fontSize: 11,
      halign: "left",
      cellPadding: 1,
      fillColor: [255, 255, 255],
      ...(input.textColor === undefined ? {} : { textColor: input.textColor }),
    },
    alternateRowStyles: { fillColor: [255, 255, 255] },
    body: input.body,
  });
  wrapPdfSection({
    doc: input.doc,
    startY: input.startY,
    height: input.doc.lastAutoTable.finalY - input.startY,
  });
}

export function addGeneralInfoTable(input: {
  doc: jsPDF;
  pointData: PDFPointDataType;
  pilootOptions: { label: string; value: string }[];
}) {
  const generalStart = 55;
  addWrappedTable({
    doc: input.doc,
    startY: generalStart,
    textColor: 0,
    body: [
      [
        { content: "Datum:", styles: { fontStyle: "bold" } },
        new Date(input.pointData.datum).toLocaleDateString(),
        { content: "Piloot:", styles: { fontStyle: "bold" } },
        input.pointData.piloot !== ""
          ? input.pilootOptions.find((p) => p.value === input.pointData.piloot)?.label || "-"
          : "-",
      ],
      [
        { content: "Luchtvaartuig:", styles: { fontStyle: "bold" } },
        input.pointData.luchtvaartuig || "-",
        { content: "Waarnemer:", styles: { fontStyle: "bold" } },
        input.pointData.waarnemer || "-",
      ],
    ],
  });
}

export function addCoordinatesTable(doc: jsPDF, pointData: PDFPointDataType) {
  const coordsStart = doc.lastAutoTable.finalY + 8;
  addWrappedTable({
    doc,
    startY: coordsStart,
    body: [
      [
        { content: "Tijd:", styles: { fontStyle: "bold" } },
        (pointData as { tijd?: string }).tijd || "-",
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
}

export function addDetailTable(doc: jsPDF, pointData: PDFPointDataType) {
  const detailStart = doc.lastAutoTable.finalY + 8;
  addWrappedTable({
    doc,
    startY: detailStart,
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
}
