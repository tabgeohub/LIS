import JSZip from "jszip";
import { FinishedPointType } from "Types/finished_plans";
import { runWithConcurrency, preloadLogoDataUrl } from "./utils";
import type { ProcessedItem } from "./types";
import {
  buildGeometryPreloadTasks,
  buildPointPreloadTasks,
  mapsFromPreloadResults,
} from "./preloadReportAttachmentTasks";

export async function preloadReportAttachments(input: {
  selectedPointsData: FinishedPointType[];
  selectedGeometriesData: Array<{ id: number; points?: FinishedPointType[] }>;
}) {
  const [preloadedPoints, preloadedGeometries, logoDataUrl] = await Promise.all(
    [
      runWithConcurrency({
        tasks: buildPointPreloadTasks(input.selectedPointsData),
        concurrency: 5,
      }),
      runWithConcurrency({
        tasks: buildGeometryPreloadTasks(input.selectedGeometriesData),
        concurrency: 5,
      }),
      preloadLogoDataUrl(),
    ]
  );
  return {
    ...mapsFromPreloadResults(preloadedPoints, preloadedGeometries),
    logoDataUrl,
  };
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
