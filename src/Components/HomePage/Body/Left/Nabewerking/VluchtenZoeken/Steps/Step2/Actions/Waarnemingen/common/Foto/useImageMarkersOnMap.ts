import { useEffect, useRef } from "react";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { AttachmentType, FinishedPointType } from "Types/finished_plans";

export function useImageMarkersOnMap(
  attachmentPoint: FinishedPointType | null,
  validAttachments: AttachmentType[],
  mapView: MapView | null | undefined,
  redGraphicsLayer: GraphicsLayer | null | undefined
) {
  const imageMarkersRef = useRef<Graphic[]>([]);

  useEffect(() => {
    if (!attachmentPoint || !mapView || !redGraphicsLayer) {
      return;
    }

    imageMarkersRef.current.forEach((marker) => {
      redGraphicsLayer.remove(marker);
    });
    imageMarkersRef.current = [];

    const sortedAttachments = [...validAttachments]
      .sort((a, b) => a.taken_at - b.taken_at)
      .map((attachment, originalIndex) => ({
        attachment,
        displayNumber: originalIndex + 1,
        originalIndex,
      }))
      .filter((item) => item.attachment.location);

    if (sortedAttachments.length === 0) return;

    const locationMap = new Map<string, number>();

    sortedAttachments.forEach(
      ({ attachment, displayNumber, originalIndex }) => {
        if (!attachment.location) return;

        try {
          const [lat, long] = attachment.location.split(",").map(Number);
          if (isNaN(lat) || isNaN(long)) return;

          const locationKey = `${lat.toFixed(6)},${long.toFixed(6)}`;
          const offsetCount = locationMap.get(locationKey) || 0;
          locationMap.set(locationKey, offsetCount + 1);

          const offsetDistance = 0.0001;
          const angle = offsetCount * 60 * (Math.PI / 180);
          const offsetLat =
            lat + offsetDistance * Math.cos(angle) * offsetCount;
          const offsetLong =
            long + offsetDistance * Math.sin(angle) * offsetCount;

          const point = new Point({
            longitude: offsetLong,
            latitude: offsetLat,
            spatialReference: { wkid: 4326 },
          });

          const circleSymbol = new SimpleMarkerSymbol({
            color: [59, 130, 246, 0.9],
            size: 18,
            style: "circle",
            outline: {
              color: [255, 255, 255, 1],
              width: 1.5,
            },
          });

          const circleGraphic = new Graphic({
            geometry: point,
            symbol: circleSymbol,
            attributes: {
              type: "image-numbered-marker",
              imageIndex: originalIndex,
              displayNumber,
              attachmentId: attachment.id,
            },
          });

          const textSymbol = new TextSymbol({
            text: String(displayNumber),
            color: [255, 255, 255, 1],
            font: {
              size: 10,
              family: "Arial",
              weight: "bold",
            },
            haloColor: [59, 130, 246, 0.8],
            haloSize: 1,
            xoffset: 0,
            yoffset: 0,
          });

          const textGraphic = new Graphic({
            geometry: point,
            symbol: textSymbol,
            attributes: {
              type: "image-numbered-marker-label",
              imageIndex: originalIndex,
              displayNumber,
              attachmentId: attachment.id,
            },
          });

          redGraphicsLayer.add(circleGraphic);
          redGraphicsLayer.add(textGraphic);

          imageMarkersRef.current.push(circleGraphic, textGraphic);
        } catch (error) {
          console.error("Error creating marker for image:", error);
        }
      }
    );

    return () => {
      imageMarkersRef.current.forEach((marker) => {
        redGraphicsLayer.remove(marker);
      });
      imageMarkersRef.current = [];
    };
  }, [validAttachments, attachmentPoint, mapView, redGraphicsLayer]);
}
