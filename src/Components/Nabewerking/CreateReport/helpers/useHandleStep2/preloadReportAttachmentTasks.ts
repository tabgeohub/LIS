import { FinishedPointType } from "Types/finished_plans";
import { ATTACHMENTS_FEATURE_LAYER_URL } from "@helpers/arcgis/deleteArcgisAttachment";
import { safeFetchPointAttachments } from "./attachments";
import type {
  AttachmentWithMeta,
  PreloadGeometryResult,
  PreloadPointResult,
} from "./types";

async function fetchPointAttachmentsSafe(
  point: FinishedPointType
): Promise<AttachmentWithMeta[]> {
  try {
    return await safeFetchPointAttachments(
      ATTACHMENTS_FEATURE_LAYER_URL,
      point
    );
  } catch {
    return [];
  }
}

export function buildPointPreloadTasks(
  selectedPointsData: FinishedPointType[]
) {
  return selectedPointsData.map((point) => async () => {
    const attachments = await fetchPointAttachmentsSafe(point);
    return { pointId: point.id, attachments } satisfies PreloadPointResult;
  });
}

export function buildGeometryPreloadTasks(
  selectedGeometriesData: Array<{ id: number; points?: FinishedPointType[] }>
) {
  return selectedGeometriesData.map((geometry) => async () => {
    const firstPoint = geometry.points?.[0];
    const attachments = firstPoint
      ? await fetchPointAttachmentsSafe(firstPoint)
      : [];
    return {
      geometryId: geometry.id,
      attachments,
    } satisfies PreloadGeometryResult;
  });
}

export function mapsFromPreloadResults(
  preloadedPoints: PreloadPointResult[],
  preloadedGeometries: PreloadGeometryResult[]
) {
  const attachmentsByPoint = new Map<number, AttachmentWithMeta[]>();
  for (const item of preloadedPoints) {
    attachmentsByPoint.set(item.pointId, item.attachments);
  }
  const attachmentsByGeometry = new Map<number, AttachmentWithMeta[]>();
  for (const item of preloadedGeometries) {
    attachmentsByGeometry.set(item.geometryId, item.attachments);
  }
  return { attachmentsByPoint, attachmentsByGeometry };
}
