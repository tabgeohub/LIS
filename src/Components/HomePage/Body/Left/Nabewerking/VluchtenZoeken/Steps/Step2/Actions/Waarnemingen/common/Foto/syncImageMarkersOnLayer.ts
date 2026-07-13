import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { AttachmentType, FinishedPointType } from "Types/finished_plans";
import {
  buildImageMarkerGraphics,
  sortAttachmentsWithLocation,
} from "./buildImageMarkerGraphics";

export function syncImageMarkersOnLayer(input: {
  attachmentPoint: FinishedPointType;
  validAttachments: AttachmentType[];
  redGraphicsLayer: GraphicsLayer;
  previousMarkers: __esri.Graphic[];
}): __esri.Graphic[] {
  input.previousMarkers.forEach((marker) =>
    input.redGraphicsLayer.remove(marker)
  );

  const sorted = sortAttachmentsWithLocation(input.validAttachments);
  if (sorted.length === 0) return [];

  const graphics = buildImageMarkerGraphics(sorted);
  graphics.forEach((graphic) => input.redGraphicsLayer.add(graphic));
  return graphics;
}
