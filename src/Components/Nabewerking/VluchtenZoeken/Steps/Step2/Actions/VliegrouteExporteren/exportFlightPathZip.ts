import { FeatureCollection, LineString } from "geojson";
import JSZip from "jszip";
import shpwrite from "@mapbox/shp-write";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { getBackEndUrl } from "@helpers/http/getBackEndUrl";

export function buildFlightPathGeoJson(
  plan: FinishedFlightPlanType
): FeatureCollection<LineString> {
  const coords: [number, number][] = plan.path.map((pt) => [
    pt.longitude,
    pt.latitude,
  ]);

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coords,
        },
        properties: {
          id: plan.id,
          name: plan.vluchtnummer,
          date: plan.datum,
        },
      },
    ],
  };
}

export async function buildFlightPathZipBlob(
  plan: FinishedFlightPlanType
): Promise<{ blob: Blob; filename: string }> {
  const zip = new JSZip();
  const flightPathZip = shpwrite.zip(buildFlightPathGeoJson(plan), {
    compression: "DEFLATE",
    outputType: "blob",
  });

  zip.file("path.zip", flightPathZip);
  const blob = await zip.generateAsync({ type: "blob" });
  return { blob, filename: `path_${plan.vluchtnummer}.zip` };
}

export async function uploadFlightPathZip(input: {
  blob: Blob;
  filename: string;
}): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append("report", input.blob, input.filename);

  const res = await fetch(`${getBackEndUrl()}/api/upload-report`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const result = await res.json();
  return { url: result.url, filename: input.filename };
}
