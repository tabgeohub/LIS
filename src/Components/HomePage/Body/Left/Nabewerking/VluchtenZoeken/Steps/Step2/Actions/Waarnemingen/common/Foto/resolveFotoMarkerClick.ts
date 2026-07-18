import type { AttachmentType } from "Types/finished_plans";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { findFotoMarkerAttachmentIndex } from "./findFotoMarkerAttachmentIndex";

export async function resolveFotoMarkerClick(input: {
  event: __esri.ViewClickEvent;
  mapView: MapView;
  redGraphicsLayer: GraphicsLayer;
  validAttachments: AttachmentType[];
}): Promise<number | null> {
  const hitTestResult = await input.mapView.hitTest(input.event, {
    include: [input.redGraphicsLayer],
  });
  return findFotoMarkerAttachmentIndex(
    hitTestResult,
    input.validAttachments
  );
}
