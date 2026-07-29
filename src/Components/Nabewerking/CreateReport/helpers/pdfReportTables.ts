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

function boldCell(content: string) {
  return { content, styles: { fontStyle: "bold" as const } };
}

function italicCell(content: string) {
  return { content, styles: { fontStyle: "italic" as const } };
}

function pilootLabel(
  pointData: PDFPointDataType,
  pilootOptions: { label: string; value: string }[]
): string {
  if (pointData.piloot === "") return "-";
  return (
    pilootOptions.find((p) => p.value === pointData.piloot)?.label || "-"
  );
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
        boldCell("Datum:"),
        new Date(input.pointData.datum).toLocaleDateString(),
        boldCell("Piloot:"),
        pilootLabel(input.pointData, input.pilootOptions),
      ],
      [
        boldCell("Luchtvaartuig:"),
        input.pointData.luchtvaartuig || "-",
        boldCell("Waarnemer:"),
        input.pointData.waarnemer || "-",
      ],
    ],
  });
}

export function addCoordinatesTable(input: {
  doc: jsPDF;
  pointData: PDFPointDataType;
}) {
  const coordsStart = input.doc.lastAutoTable.finalY + 8;
  addWrappedTable({
    doc: input.doc,
    startY: coordsStart,
    body: [
      [
        boldCell("Tijd:"),
        (input.pointData as { tijd?: string }).tijd || "-",
        "",
        "",
      ],
      [
        boldCell("Coördinaten:"),
        italicCell("RD:"),
        `X: ${input.pointData.rdX?.toFixed(3)}  Y: ${input.pointData.rdY?.toFixed(3)}`,
        "",
      ],
      [
        "",
        italicCell("WGS:"),
        `NB: ${input.pointData.lat?.toFixed(3)}  OL: ${input.pointData.long?.toFixed(3)}`,
        "",
      ],
    ],
  });
}

function orDash(value: string | null | undefined): string {
  return value || "-";
}

function detailTableRows(pointData: PDFPointDataType) {
  return [
    [boldCell("Activiteit:"), orDash(pointData.activiteit)],
    [boldCell("Organisatie:"), orDash(pointData.organisatie)],
    [boldCell("Regio:"), orDash(pointData.regio)],
    [boldCell("Omschrijving:"), orDash(pointData.omschrijving)],
    [boldCell("Aanvullende informatie:"), orDash(pointData.aanvullende)],
  ];
}

export function addDetailTable(input: {
  doc: jsPDF;
  pointData: PDFPointDataType;
}) {
  const detailStart = input.doc.lastAutoTable.finalY + 8;
  addWrappedTable({
    doc: input.doc,
    startY: detailStart,
    body: detailTableRows(input.pointData),
  });
}
