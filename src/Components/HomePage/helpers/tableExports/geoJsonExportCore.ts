import { saveAs } from "file-saver";
import JSZip from "jszip";
import type { EnrichedPointType, FlightPlanType } from "Types";
import { enrichedPointToExportFeature } from "./pointGeoJson";

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
        features: input.plans.map(({ points, ...plan }) => ({
          type: "Feature",
          geometry: null,
          properties: plan,
        })),
      },
      null,
      2
    )
  );
  saveAs(await zip.generateAsync({ type: "blob" }), "exports_geojson.zip");
}
