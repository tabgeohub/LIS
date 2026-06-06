import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export function useUploadAttachmentForPoint() {
  const attachmentsLayerArcgis = new FeatureLayer({
    url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/attachments_layer/FeatureServer",
  });

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  return async function uploadAttachmentForPoint(
    pointId: number,
    image: { image: File | Blob; timestamp: number }
  ): Promise<
    {
      url: string;
      attachmentId: number;
      objectId: number;
      taken_at: number;
    }[]
  > {
    const attachments: {
      url: string;
      attachmentId: number;
      objectId: number;
      taken_at: number;
    }[] = [];

    const dummyGraphic = new Graphic({ geometry: null, attributes: {} });
    const { addFeatureResults } = await attachmentsLayerArcgis.applyEdits({
      addFeatures: [dummyGraphic],
    });

    const addedFeature = addFeatureResults?.[0];
    if (!addedFeature?.objectId) {
      console.error("❌ Failed to create dummy feature for attachments.");
      return attachments;
    }

    const objectId = addedFeature.objectId;

    const formData = new FormData();
    formData.append("attachment", image.image);

    const graphicWithObjectId = new Graphic({
      attributes: { OBJECTID: objectId },
    });

    try {
      await attachmentsLayerArcgis.addAttachment(graphicWithObjectId, formData);

      await sleep(1000);

      const queryResult = await attachmentsLayerArcgis.queryAttachments({
        objectIds: [objectId],
      });

      const allAttachments = queryResult[objectId];
      if (allAttachments && allAttachments.length > 0) {
        const latest = allAttachments[allAttachments.length - 1];

        const url = `${attachmentsLayerArcgis.url}/0/${objectId}/attachments/${latest.id}?token=`;

        attachments.push({
          url,
          attachmentId: latest.id,
          objectId,
          taken_at: image.timestamp,
        });
      } else {
        console.warn(
          `⚠️ No attachment ID found after upload for point ${pointId}`
        );
      }
    } catch (uploadError) {
      console.error("❌ Attachment upload error:", uploadError);
    }

    return attachments;
  };
}
