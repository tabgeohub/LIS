import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { useFotoMapClickHandler } from "./useFotoMapClickHandler";
import { useImageMarkersOnMap } from "./useImageMarkersOnMap";
import { navigateToLocation } from "./navigateToLocation";
import { runFotoAttachmentDelete } from "./runFotoAttachmentDelete";
import type { FotoAttachmentDeleteInput } from "./commitFotoAttachmentDelete";
import {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";

export function useFotoPanelMapBindings(input: {
  mapView: MapView | null | undefined;
  redGraphicsLayer: GraphicsLayer | null | undefined;
  attachmentPoint: FinishedPointType | null;
  validAttachments: AttachmentType[];
  setActiveIndex: (value: number) => void;
  setIsOpen: (value: boolean) => void;
}) {
  useFotoMapClickHandler({
    mapView: input.mapView,
    redGraphicsLayer: input.redGraphicsLayer,
    validAttachments: input.validAttachments,
    setActiveIndex: input.setActiveIndex,
    setIsOpen: input.setIsOpen,
  });
  useImageMarkersOnMap({
    attachmentPoint: input.attachmentPoint,
    validAttachments: input.validAttachments,
    mapView: input.mapView,
    redGraphicsLayer: input.redGraphicsLayer,
  });
}

export function createFotoDeleteHandler(input: {
  attachmentPoint: FinishedPointType | null;
  selectedPlan: FinishedFlightPlanType | null;
  validAttachments: AttachmentType[];
  activeIndex: number;
  setLoading: (value: boolean) => void;
  setIsOpen: (value: boolean) => void;
  setActiveIndex: (value: number) => void;
  onAttachmentsUpdated: (newAttachments: AttachmentType[]) => void;
  update: FotoAttachmentDeleteInput["update"];
}) {
  return async (attachmentId: number) => {
    if (!input.attachmentPoint || !input.selectedPlan) return;
    await runFotoAttachmentDelete({
      attachmentId,
      validAttachments: input.validAttachments,
      attachmentPoint: input.attachmentPoint,
      selectedPlan: input.selectedPlan,
      activeIndex: input.activeIndex,
      setLoading: input.setLoading,
      setIsOpen: input.setIsOpen,
      setActiveIndex: input.setActiveIndex,
      onAttachmentsUpdated: input.onAttachmentsUpdated,
      update: input.update,
    });
  };
}

export function createFotoNavigateHandler(input: {
  mapView: MapView | null | undefined;
  redGraphicsLayer: GraphicsLayer | null | undefined;
}) {
  return (location: string | null | undefined) => {
    navigateToLocation({
      location,
      mapView: input.mapView,
      redGraphicsLayer: input.redGraphicsLayer,
    });
  };
}
