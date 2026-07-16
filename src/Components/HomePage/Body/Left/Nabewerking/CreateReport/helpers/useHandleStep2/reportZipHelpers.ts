import JSZip from "jszip";
import { FinishedPointType } from "Types/finished_plans";
import { ATTACHMENTS_FEATURE_LAYER_URL } from "@helpers/arcgis/deleteArcgisAttachment";
import { runWithConcurrency, preloadLogoDataUrl } from "./utils";
import { safeFetchPointAttachments } from "./attachments";
import type {
  AttachmentWithMeta,
  PreloadGeometryResult,
  PreloadPointResult,
  ProcessedItem,
} from "./types";

export async function preloadReportAttachments(input: {
  selectedPointsData: FinishedPointType[];
  selectedGeometriesData: Array<{ id: number; points?: FinishedPointType[] }>;
}) {
  const pointPreloadTasks = input.selectedPointsData.map((point) => async () => {
    try {
      const list = await safeFetchPointAttachments(
        ATTACHMENTS_FEATURE_LAYER_URL,
        point
      );
      return { pointId: point.id, attachments: list } satisfies PreloadPointResult;
    } catch {
      return { pointId: point.id, attachments: [] } satisfies PreloadPointResult;
    }
  });

  const geometryPreloadTasks = input.selectedGeometriesData.map(
    (geometry) => async () => {
      try {
        const firstPoint = geometry.points?.[0];
        if (!firstPoint) {
          return { geometryId: geometry.id, attachments: [] } satisfies PreloadGeometryResult;
        }
        const list = await safeFetchPointAttachments(
          ATTACHMENTS_FEATURE_LAYER_URL,
          firstPoint
        );
        return { geometryId: geometry.id, attachments: list } satisfies PreloadGeometryResult;
      } catch {
        return { geometryId: geometry.id, attachments: [] } satisfies PreloadGeometryResult;
      }
    }
  );

  const [preloadedPoints, preloadedGeometries, logoDataUrl] = await Promise.all([
    runWithConcurrency({ tasks: pointPreloadTasks, concurrency: 5 }),
    runWithConcurrency({ tasks: geometryPreloadTasks, concurrency: 5 }),
    preloadLogoDataUrl(),
  ]);

  const attachmentsByPoint = new Map<number, AttachmentWithMeta[]>();
  for (const item of preloadedPoints) {
    attachmentsByPoint.set(item.pointId, item.attachments);
  }

  const attachmentsByGeometry = new Map<number, AttachmentWithMeta[]>();
  for (const item of preloadedGeometries) {
    attachmentsByGeometry.set(item.geometryId, item.attachments);
  }

  return { attachmentsByPoint, attachmentsByGeometry, logoDataUrl };
}

export function addProcessedItemsToZip(
  zip: InstanceType<typeof JSZip>,
  processedItems: ProcessedItem[]
) {
  const attachmentsFolder = zip.folder("attachments");

  for (const result of processedItems) {
    zip.file(result.filename, result.pdfData);
    if (!result.attachments.length) continue;

    const itemFolder = attachmentsFolder?.folder(result.pointName);
    result.attachments.forEach((attr, index) => {
      const extension =
        (attr.blob.type.split("/")[1] || "").split(";")[0] || "bin";
      itemFolder?.file(`attachment_${index + 1}.${extension}`, attr.blob);
    });
  }
}
