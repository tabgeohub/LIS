import { useEffect } from "react";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { AttachmentType } from "Types/finished_plans";
import { resolveFotoMarkerClick } from "./resolveFotoMarkerClick";

export type UseFotoMapClickHandlerInput = {
  mapView: MapView | null | undefined;
  redGraphicsLayer: GraphicsLayer | null | undefined;
  validAttachments: AttachmentType[];
  setActiveIndex: (index: number) => void;
  setIsOpen: (open: boolean) => void;
};

export function useFotoMapClickHandler(input: UseFotoMapClickHandlerInput) {
  const {
    mapView,
    redGraphicsLayer,
    validAttachments,
    setActiveIndex,
    setIsOpen,
  } = input;

  useEffect(() => {
    if (!mapView || !redGraphicsLayer || validAttachments.length === 0) return;

    const handleMapClick = async (event: __esri.ViewClickEvent) => {
      try {
        const sortedIndex = await resolveFotoMarkerClick({
          event,
          mapView,
          redGraphicsLayer,
          validAttachments,
        });
        if (sortedIndex !== null) {
          setActiveIndex(sortedIndex);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error handling marker click:", error);
      }
    };

    const handle = mapView.on("click", handleMapClick);
    return () => handle.remove();
  }, [mapView, validAttachments, redGraphicsLayer, setIsOpen, setActiveIndex]);
}
