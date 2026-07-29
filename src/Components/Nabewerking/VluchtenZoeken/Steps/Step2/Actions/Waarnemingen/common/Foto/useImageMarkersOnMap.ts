import { useEffect, useRef } from "react";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { AttachmentType, FinishedPointType } from "Types/finished_plans";
import { syncImageMarkersOnLayer } from "./syncImageMarkersOnLayer";

export type UseImageMarkersOnMapInput = {
  attachmentPoint: FinishedPointType | null;
  validAttachments: AttachmentType[];
  mapView: MapView | null | undefined;
  redGraphicsLayer: GraphicsLayer | null | undefined;
};

export function useImageMarkersOnMap(input: UseImageMarkersOnMapInput) {
  const imageMarkersRef = useRef<__esri.Graphic[]>([]);
  const { attachmentPoint, validAttachments, mapView, redGraphicsLayer } =
    input;

  useEffect(() => {
    if (!attachmentPoint || !mapView || !redGraphicsLayer) return;

    imageMarkersRef.current = syncImageMarkersOnLayer({
      attachmentPoint,
      validAttachments,
      redGraphicsLayer,
      previousMarkers: imageMarkersRef.current,
    });

    return () => {
      imageMarkersRef.current.forEach((marker) =>
        redGraphicsLayer.remove(marker)
      );
      imageMarkersRef.current = [];
    };
  }, [validAttachments, attachmentPoint, mapView, redGraphicsLayer]);
}
