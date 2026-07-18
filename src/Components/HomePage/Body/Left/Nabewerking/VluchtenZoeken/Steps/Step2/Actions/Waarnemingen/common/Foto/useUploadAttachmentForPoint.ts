import {
  createAttachmentsFeatureLayer,
  createDummyAttachmentObjectId,
} from "./uploadAttachmentForPointHelpers";
import { resolveUploadedAttachment } from "./resolveUploadedAttachment";

export function useUploadAttachmentForPoint() {
  const attachmentsLayerArcgis = createAttachmentsFeatureLayer();

  return async function uploadAttachmentForPoint(
    pointId: number,
    image: { image: File | Blob; timestamp: number }
  ) {
    const objectId = await createDummyAttachmentObjectId(
      attachmentsLayerArcgis
    );
    if (!objectId) return [];
    return resolveUploadedAttachment({
      layer: attachmentsLayerArcgis,
      objectId,
      image,
      pointId,
    });
  };
}
