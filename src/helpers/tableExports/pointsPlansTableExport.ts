import { saveAs } from "file-saver";
import * as XLSX from "@e965/xlsx";
import JSZip from "jszip";
import shpwrite from "@mapbox/shp-write";
import type { Feature, FeatureCollection, Point as GeoPoint, Polygon } from "geojson";
import type { EnrichedPointType, FlightPlanType } from "Types";
import { getBboxPolygon } from "@helpers/geo/bboxPolygon";

export function buildCsvFromRows<T extends object>(rows: T[], excludeKeys: string[] = []) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]).filter((key) => !excludeKeys.includes(key));
  return [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => `"${(row as Record<string, unknown>)[h] ?? ""}"`).join(",")
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
  const worksheet = XLSX.utils.json_to_sheet(input.rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, input.sheetName);
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([buffer], { type: "application/octet-stream" }),
    input.filename
  );
}

export function enrichedPointsToFeatureCollection(
  points: EnrichedPointType[]
): FeatureCollection<GeoPoint> {
  return {
    type: "FeatureCollection",
    features: points.map((point) => {
      const feature: Feature<GeoPoint> = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [point.longitude, point.latitude],
        },
        properties: { ...point },
      };
      return feature;
    }),
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
  const wsPoints = XLSX.utils.json_to_sheet(input.points);
  const wbPoints = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wbPoints, wsPoints, "Points");
  input.zip.file(
    "points_export.xlsx",
    XLSX.write(wbPoints, { bookType: "xlsx", type: "array" })
  );

  const cleanedPlans = input.plans.map(({ points, ...rest }) => rest);
  const wsPlans = XLSX.utils.json_to_sheet(cleanedPlans);
  const wbPlans = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wbPlans, wsPlans, "FlightPlans");
  input.zip.file(
    "plans_export.xlsx",
    XLSX.write(wbPlans, { bookType: "xlsx", type: "array" })
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
    const wsPoints = XLSX.utils.json_to_sheet(input.points);
    const wbPoints = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wbPoints, wsPoints, "Points");
    const buffer = XLSX.write(wbPoints, { bookType: "xlsx", type: "array" });
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
    const wsPlans = XLSX.utils.json_to_sheet(cleanedPlans);
    const wbPlans = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wbPlans, wsPlans, "FlightPlans");
    const buffer = XLSX.write(wbPlans, { bookType: "xlsx", type: "array" });
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
    features: points.map((p) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [p.longitude, p.latitude],
      },
      properties: {
        id: p.id,
        omschrijving: p.omschrijving,
        regio_id: p.regio_id,
        datum: p.datum,
        vertrouwelijk: p.vertrouwelijk,
        order: p.order,
        region: p.region,
      },
    })),
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
        features: input.points.map((p) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [p.longitude, p.latitude],
          },
          properties: {
            id: p.id,
            omschrijving: p.omschrijving,
            regio_id: p.regio_id,
            datum: p.datum,
            vertrouwelijk: p.vertrouwelijk,
            order: p.order,
            region: p.region,
          },
        })),
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
