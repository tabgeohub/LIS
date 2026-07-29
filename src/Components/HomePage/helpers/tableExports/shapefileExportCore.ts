import { saveAs } from "file-saver";
import JSZip from "jszip";
import shpwrite from "@mapbox/shp-write";
import type { FeatureCollection, Point as GeoPoint, Polygon } from "geojson";
import type { EnrichedPointType, FlightPlanType } from "Types";
import { getBboxPolygon } from "@helpers/geo/bboxPolygon";
import {
  enrichedPointsToFeatureCollection,
  enrichedPointToExportFeature,
} from "./pointGeoJson";

export function downloadEnrichedPointsShapefile(points: EnrichedPointType[]) {
  shpwrite.download(enrichedPointsToFeatureCollection(points), {
    compression: "DEFLATE",
    outputType: "blob",
  });
}

export async function exportFlightPlansShapefile(plans: FlightPlanType[]) {
  const planFeatures: FeatureCollection<Polygon> = {
    type: "FeatureCollection",
    features: plans.map((plan) => ({
      type: "Feature",
      geometry: getBboxPolygon(
        plan.points.map((point) => [point.longitude, point.latitude])
      ),
      properties: {
        id: plan.id,
        name: plan.vluchtnummer,
        date: plan.datum,
      },
    })),
  };

  const zip = new JSZip();
  zip.file(
    "plans.zip",
    shpwrite.zip(planFeatures, {
      compression: "DEFLATE",
      outputType: "blob",
    })
  );
  saveAs(await zip.generateAsync({ type: "blob" }), "exports_shapefiles.zip");
}

export async function exportPointsShapefile(points: EnrichedPointType[]) {
  if (!points.length) {
    alert("No points to export.");
    return;
  }

  const pointFeatures: FeatureCollection<GeoPoint> = {
    type: "FeatureCollection",
    features: points.map(enrichedPointToExportFeature),
  };
  const zip = new JSZip();
  zip.file(
    "points.zip",
    shpwrite.zip(pointFeatures, {
      compression: "DEFLATE",
      outputType: "blob",
    })
  );
  saveAs(await zip.generateAsync({ type: "blob" }), "exports_shapefiles.zip");
}
