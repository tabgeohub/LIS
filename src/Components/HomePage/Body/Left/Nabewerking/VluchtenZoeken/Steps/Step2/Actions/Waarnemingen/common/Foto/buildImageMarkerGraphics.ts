import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import { AttachmentType } from "Types/finished_plans";

type SortedAttachment = {
  attachment: AttachmentType;
  displayNumber: number;
  originalIndex: number;
};

export function sortAttachmentsWithLocation(
  attachments: AttachmentType[]
): SortedAttachment[] {
  return [...attachments]
    .sort((a, b) => a.taken_at - b.taken_at)
    .map((attachment, originalIndex) => ({
      attachment,
      displayNumber: originalIndex + 1,
      originalIndex,
    }))
    .filter((item) => item.attachment.location);
}

export function buildImageMarkerGraphics(
  sortedAttachments: SortedAttachment[]
): Graphic[] {
  const graphics: Graphic[] = [];
  const locationMap = new Map<string, number>();

  sortedAttachments.forEach(({ attachment, displayNumber, originalIndex }) => {
    if (!attachment.location) return;

    try {
      const [lat, long] = attachment.location.split(",").map(Number);
      if (isNaN(lat) || isNaN(long)) return;

      const locationKey = `${lat.toFixed(6)},${long.toFixed(6)}`;
      const offsetCount = locationMap.get(locationKey) || 0;
      locationMap.set(locationKey, offsetCount + 1);

      const offsetDistance = 0.0001;
      const angle = offsetCount * 60 * (Math.PI / 180);
      const offsetLat = lat + offsetDistance * Math.cos(angle) * offsetCount;
      const offsetLong = long + offsetDistance * Math.sin(angle) * offsetCount;

      const point = new Point({
        longitude: offsetLong,
        latitude: offsetLat,
        spatialReference: { wkid: 4326 },
      });

      const circleGraphic = new Graphic({
        geometry: point,
        symbol: new SimpleMarkerSymbol({
          color: [59, 130, 246, 0.9],
          size: 18,
          style: "circle",
          outline: { color: [255, 255, 255, 1], width: 1.5 },
        }),
        attributes: {
          type: "image-numbered-marker",
          imageIndex: originalIndex,
          displayNumber,
          attachmentId: attachment.id,
        },
      });

      const textGraphic = new Graphic({
        geometry: point,
        symbol: new TextSymbol({
          text: String(displayNumber),
          color: [255, 255, 255, 1],
          font: { size: 10, family: "Arial", weight: "bold" },
          haloColor: [59, 130, 246, 0.8],
          haloSize: 1,
          xoffset: 0,
          yoffset: 0,
        }),
        attributes: {
          type: "image-numbered-marker-label",
          imageIndex: originalIndex,
          displayNumber,
          attachmentId: attachment.id,
        },
      });

      graphics.push(circleGraphic, textGraphic);
    } catch (error) {
      console.error("Error creating marker for image:", error);
    }
  });

  return graphics;
}
