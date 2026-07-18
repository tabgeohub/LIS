import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import { AttachmentType } from "Types/finished_plans";
import {
  createNumberedMarkerGraphic,
  createNumberedMarkerLabelGraphic,
} from "./createNumberedMarkerGraphics";

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
    const point = resolveMarkerPoint(attachment.location, locationMap);
    if (!point) return;
    graphics.push(
      ...createNumberedMarkerPair({
        point,
        displayNumber,
        originalIndex,
        attachmentId: attachment.id,
      })
    );
  });

  return graphics;
}

function resolveMarkerPoint(
  location: string | null | undefined,
  locationMap: Map<string, number>
) {
  if (!location) return null;
  const [latitude, longitude] = location.split(",").map(Number);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const locationKey = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
  const offsetCount = locationMap.get(locationKey) ?? 0;
  locationMap.set(locationKey, offsetCount + 1);
  const angle = offsetCount * 60 * (Math.PI / 180);
  const offsetDistance = 0.0001 * offsetCount;

  return new Point({
    longitude: longitude + offsetDistance * Math.sin(angle),
    latitude: latitude + offsetDistance * Math.cos(angle),
    spatialReference: { wkid: 4326 },
  });
}

function createNumberedMarkerPair(input: {
  point: Point;
  displayNumber: number;
  originalIndex: number;
  attachmentId: number;
}) {
  const attributes = {
    imageIndex: input.originalIndex,
    displayNumber: input.displayNumber,
    attachmentId: input.attachmentId,
  };
  return [
    createNumberedMarkerGraphic(input.point, attributes),
    createNumberedMarkerLabelGraphic(input.point, attributes),
  ];
}
