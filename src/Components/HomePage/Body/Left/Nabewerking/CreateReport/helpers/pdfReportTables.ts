import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFPointDataType } from "Types";
import { wrapPdfSection } from "./pdfReportLayout";

export function addGeneralInfoTable(
  doc: jsPDF,
  pointData: PDFPointDataType,
  pilootOptions: { label: string; value: string }[]
) {
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
          ? pilootOptions.find((p) => p.value === pointData.piloot)?.label || "-"
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
  wrapPdfSection(generalStart, doc.lastAutoTable.finalY - generalStart);
}

export function addCoordinatesTable(doc: jsPDF, pointData: PDFPointDataType) {
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
  wrapPdfSection(coordsStart, doc.lastAutoTable.finalY - coordsStart);
}

export function addDetailTable(doc: jsPDF, pointData: PDFPointDataType) {
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
  wrapPdfSection(detailStart, doc.lastAutoTable.finalY - detailStart);
}
