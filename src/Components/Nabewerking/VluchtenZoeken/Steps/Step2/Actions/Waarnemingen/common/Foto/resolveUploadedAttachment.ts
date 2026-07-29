import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import type { AttachmentUploadResult } from "./uploadAttachmentForPointHelpers";

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function queryLatestAttachmentResult(input: {
  layer: FeatureLayer;
  objectId: number;
  timestamp: number;
  pointId: number;
}): Promise<AttachmentUploadResult[]> {
  const { layer, objectId, timestamp, pointId } = input;
  const queryResult = await layer.queryAttachments({
    objectIds: [objectId],
  });
  const allAttachments = queryResult[objectId];
  if (!allAttachments?.length) {
    console.warn(
      `⚠️ No attachment ID found after upload for point ${pointId}`
    );
    return [];
  }
  const latest = allAttachments[allAttachments.length - 1];
  return [
    {
      url: `${layer.url}/0/${objectId}/attachments/${latest.id}?token=`,
      attachmentId: latest.id,
      objectId,
      taken_at: timestamp,
    },
  ];
}

export async function resolveUploadedAttachment(input: {
  layer: FeatureLayer;
  objectId: number;
  image: { image: File | Blob; timestamp: number };
  pointId: number;
}): Promise<AttachmentUploadResult[]> {
  const { layer, objectId, image, pointId } = input;
  const formData = new FormData();
  formData.append("attachment", image.image);
  try {
    await layer.addAttachment(
      new Graphic({ attributes: { OBJECTID: objectId } }),
      formData
    );
    await sleep(1000);
    return queryLatestAttachmentResult({
      layer,
      objectId,
      timestamp: image.timestamp,
      pointId,
    });
  } catch (uploadError) {
    console.error("❌ Attachment upload error:", uploadError);
    return [];
  }
}
