import { useEffect } from "react";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { AttachmentType } from "Types/finished_plans";

export function useFotoMapClickHandler(
  mapView: MapView | null | undefined,
  redGraphicsLayer: GraphicsLayer | null | undefined,
  validAttachments: AttachmentType[],
  setActiveIndex: (index: number) => void,
  setIsOpen: (open: boolean) => void
) {
  useEffect(() => {
    if (!mapView || !redGraphicsLayer || validAttachments.length === 0) return;

    const handleMapClick = async (event: __esri.ViewClickEvent) => {
      try {
        const hitTestResult = await mapView.hitTest(event, {
          include: [redGraphicsLayer],
        });

        const clickedGraphic = hitTestResult.results
          .filter(
            (result): result is __esri.GraphicHit =>
              result.type === "graphic" &&
              (result as __esri.GraphicHit).graphic !== undefined
          )
          .map((result) => (result as __esri.GraphicHit).graphic)
          .find(
            (graphic) =>
              graphic?.attributes?.type === "image-numbered-marker" ||
              graphic?.attributes?.type === "image-numbered-marker-label"
          );

        if (clickedGraphic) {
          const attachmentId = clickedGraphic.attributes?.attachmentId;

          if (attachmentId !== undefined) {
            const sortedIndex = [...validAttachments]
              .sort((a, b) => a.taken_at - b.taken_at)
              .findIndex((att) => att.id === attachmentId);

            if (sortedIndex !== -1) {
              setActiveIndex(sortedIndex);
              setIsOpen(true);
            }
          }
        }
      } catch (error) {
        console.error("Error handling marker click:", error);
      }
    };

    const handle = mapView.on("click", handleMapClick);

    return () => {
      handle.remove();
    };
  }, [mapView, validAttachments, redGraphicsLayer, setIsOpen, setActiveIndex]);
}
