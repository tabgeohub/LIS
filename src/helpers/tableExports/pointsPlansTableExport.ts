import { saveAs } from "file-saver";
import * as XLSX from "@e965/xlsx";
import JSZip from "jszip";
import shpwrite from "@mapbox/shp-write";
import type { Feature, FeatureCollection, Point as GeoPoint, Polygon } from "geojson";
import type { EnrichedPointType, FlightPlanType } from "Types";
import { getBboxPolygon } from "@helpers/geo/bboxPolygon";

/** RFC 4180 cell escaping — neutralizes quotes and formula injection in spreadsheet apps. */
export function escapeCsvCell(value: unknown): string {
  const str = String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
}

export function buildCsvFromRows<T extends object>(rows: T[], excludeKeys: string[] = []) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]).filter((key) => !excludeKeys.includes(key));
  return [
    // nosemgrep: javascript.lang.security.audit.xss.direct-response-write / CWE-79 — CSV cell escape, not HTML
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) =>
      headers
        .map((h) => escapeCsvCell((row as Record<string, unknown>)[h]))
        .join(",")
    ),
  ].join("\n");
}

export function downloadCsvFromRows<T extends object>(input: {
  rows: T[];
  filename: string;
  excludeKeys?: string[];
}) {
  const blob = new Blob([buildCsvFromRows(input.rows, input.excludeKeys ?? [])], {
    type: "text/csv;charset=utf-8;",
  });
  saveAs(blob, input.filename);
}

export function downloadXlsxFromRows<T extends object>(input: {
  rows: T[];
  filename: string;
  sheetName: string;
}) {
  const buffer = buildXlsxBuffer(input.rows, input.sheetName);
  saveAs(
    new Blob([buffer], { type: "application/octet-stream" }),
    input.filename
  );
}

function buildXlsxBuffer<T extends object>(rows: T[], sheetName: string) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return XLSX.write(workbook, { bookType: "xlsx", type: "array" });
}

export function enrichedPointsToFeatureCollection(
  points: EnrichedPointType[]
): FeatureCollection<GeoPoint> {
  return {
    type: "FeatureCollection",
    features: points.map(enrichedPointToFeature),
  };
}

function enrichedPointToFeature(
  point: EnrichedPointType
): Feature<GeoPoint> {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [point.longitude, point.latitude],
    },
    properties: { ...point },
  };
}

function enrichedPointExportProperties(point: EnrichedPointType) {
  return {
    id: point.id,
    omschrijving: point.omschrijving,
    regio_id: point.regio_id,
    datum: point.datum,
    vertrouwelijk: point.vertrouwelijk,
    order: point.order,
    region: point.region,
  };
}

function enrichedPointToExportFeature(point: EnrichedPointType) {
  return {
    ...enrichedPointToFeature(point),
    properties: enrichedPointExportProperties(point),
  };
}

export function downloadEnrichedPointsShapefile(points: EnrichedPointType[]) {
  shpwrite.download(enrichedPointsToFeatureCollection(points), {
    compression: "DEFLATE",
    outputType: "blob",
  });
}

export async function exportFlightPlansShapefile(plans: FlightPlanType[]) {
  const zip = new JSZip();

  const geojsonPlans: FeatureCollection<Polygon> = {
    type: "FeatureCollection",
    features: plans.map((plan) => {
      const coords: [number, number][] = plan.points.map((pt) => [
        pt.longitude,
        pt.latitude,
      ]);
      return {
        type: "Feature",
        geometry: getBboxPolygon(coords),
        properties: {
          id: plan.id,
          name: plan.vluchtnummer,
          date: plan.datum,
        },
      };
    }),
  };

  const plansZip = shpwrite.zip(geojsonPlans, {
    compression: "DEFLATE",
    outputType: "blob",
  });

  zip.file("plans.zip", plansZip);
  saveAs(await zip.generateAsync({ type: "blob" }), "exports_shapefiles.zip");
}

function buildPointsPlansZipCsv(input: {
  points: EnrichedPointType[];
  plans: FlightPlanType[];
}) {
  const zip = new JSZip();
  zip.file("points_export.csv", buildCsvFromRows(input.points));
  zip.file("plans_export.csv", buildCsvFromRows(input.plans, ["points"]));
  return zip.generateAsync({ type: "blob" });
}

export async function exportPointsPlansCsv(input: {
  points: EnrichedPointType[];
  plans: FlightPlanType[];
}) {
  const hasPoints = input.points.length > 0;
  const hasPlans = input.plans.length > 0;

  if (hasPoints && hasPlans) {
    const zipBlob = await buildPointsPlansZipCsv(input);
    saveAs(zipBlob, "exports.zip");
    return;
  }

  if (hasPoints) {
    const blob = new Blob([buildCsvFromRows(input.points)], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "points_export.csv");
    return;
  }

  if (hasPlans) {
    const blob = new Blob([buildCsvFromRows(input.plans, ["points"])], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "plans_export.csv");
  }
}

function appendXlsxToZip(input: {
  zip: JSZip;
  points: EnrichedPointType[];
  plans: FlightPlanType[];
}) {
  input.zip.file(
    "points_export.xlsx",
    buildXlsxBuffer(input.points, "Points")
  );

  const cleanedPlans = input.plans.map(({ points, ...rest }) => rest);
  input.zip.file(
    "plans_export.xlsx",
    buildXlsxBuffer(cleanedPlans, "FlightPlans")
  );
}

export async function exportPointsPlansXlsx(input: {
  points: EnrichedPointType[];
  plans: FlightPlanType[];
}) {
  const hasPoints = input.points.length > 0;
  const hasPlans = input.plans.length > 0;

  if (hasPoints && hasPlans) {
    const zip = new JSZip();
    appendXlsxToZip({ zip, points: input.points, plans: input.plans });
    saveAs(await zip.generateAsync({ type: "blob" }), "exports_xlsx.zip");
    return;
  }

  if (hasPoints) {
    const buffer = buildXlsxBuffer(input.points, "Points");
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "points_export.xlsx"
    );
    return;
  }

  if (hasPlans) {
    const cleanedPlans = input.plans.map(({ points, ...rest }) => rest);
    const buffer = buildXlsxBuffer(cleanedPlans, "FlightPlans");
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "plans_export.xlsx"
    );
  }
}

export async function exportPointsShapefile(points: EnrichedPointType[]) {
  if (!points.length) {
    alert("No points to export.");
    return;
  }

  const geojsonPoints: FeatureCollection<GeoPoint> = {
    type: "FeatureCollection",
    features: points.map(enrichedPointToExportFeature),
  };

  const zip = new JSZip();
  zip.file(
    "points.zip",
    shpwrite.zip(geojsonPoints, { compression: "DEFLATE", outputType: "blob" })
  );
  saveAs(await zip.generateAsync({ type: "blob" }), "exports_shapefiles.zip");
}

export async function exportPointsPlansGeoJsonZip(input: {
  points: EnrichedPointType[];
  plans: FlightPlanType[];
}) {
  const zip = new JSZip();

  zip.file(
    "points.geojson",
    JSON.stringify(
      {
        type: "FeatureCollection",
        features: input.points.map(enrichedPointToExportFeature),
      },
      null,
      2
    )
  );

  zip.file(
    "plans.geojson",
    JSON.stringify(
      {
        type: "FeatureCollection",
        features: input.plans.map(({ points, ...rest }) => ({
          type: "Feature",
          geometry: null,
          properties: rest,
        })),
      },
      null,
      2
    )
  );

  saveAs(await zip.generateAsync({ type: "blob" }), "exports_geojson.zip");
}
