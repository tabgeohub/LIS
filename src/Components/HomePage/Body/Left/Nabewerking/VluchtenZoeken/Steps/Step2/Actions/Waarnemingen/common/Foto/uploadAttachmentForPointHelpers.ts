import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";

export type AttachmentUploadResult = {
  url: string;
  attachmentId: number;
  objectId: number;
  taken_at: number;
};

export function createAttachmentsFeatureLayer() {
  return new FeatureLayer({
    url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/attachments_layer/FeatureServer",
  });
}

export async function createDummyAttachmentObjectId(
  layer: FeatureLayer
): Promise<number | null> {
  const dummyGraphic = new Graphic({ geometry: null, attributes: {} });
  const { addFeatureResults } = await layer.applyEdits({
    addFeatures: [dummyGraphic],
  });
  const objectId = addFeatureResults?.[0]?.objectId;
  if (!objectId) {
    console.error("❌ Failed to create dummy feature for attachments.");
    return null;
  }
  return objectId;
}
