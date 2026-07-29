import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { useState } from "react";
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

export function useFotoPanelUiState() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  return { isOpen, setIsOpen, activeIndex, setActiveIndex, loading, setLoading };
}

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

export function buildFotoPanelModelApi(args: {
  content: unknown;
  ui: ReturnType<typeof useFotoPanelUiState>;
  validAttachments: AttachmentType[];
  mapView: MapView | null | undefined;
  redGraphicsLayer: GraphicsLayer | null | undefined;
  attachmentPoint: FinishedPointType | null;
  selectedPlan: FinishedFlightPlanType | null;
  onAttachmentsUpdated: (newAttachments: AttachmentType[]) => void;
  update: FotoAttachmentDeleteInput["update"];
}) {
  const { ui } = args;
  return {
    content: args.content,
    isOpen: ui.isOpen,
    setIsOpen: ui.setIsOpen,
    activeIndex: ui.activeIndex,
    setActiveIndex: ui.setActiveIndex,
    loading: ui.loading,
    setLoading: ui.setLoading,
    validAttachments: args.validAttachments,
    handleNavigateToLocation: createFotoNavigateHandler({
      mapView: args.mapView,
      redGraphicsLayer: args.redGraphicsLayer,
    }),
    deleteImage: createFotoDeleteHandler({
      attachmentPoint: args.attachmentPoint,
      selectedPlan: args.selectedPlan,
      validAttachments: args.validAttachments,
      activeIndex: ui.activeIndex,
      setLoading: ui.setLoading,
      setIsOpen: ui.setIsOpen,
      setActiveIndex: ui.setActiveIndex,
      onAttachmentsUpdated: args.onAttachmentsUpdated,
      update: args.update,
    }),
  };
}

/** Bind map effects then build the panel API object. */
export function useAssembledFotoPanelModel(args: {
  content: unknown;
  ui: ReturnType<typeof useFotoPanelUiState>;
  validAttachments: AttachmentType[];
  mapView: MapView | null | undefined;
  redGraphicsLayer: GraphicsLayer | null | undefined;
  input: {
    attachmentPoint: FinishedPointType | null;
    selectedPlan: FinishedFlightPlanType | null;
    onAttachmentsUpdated: (newAttachments: AttachmentType[]) => void;
  };
  update: FotoAttachmentDeleteInput["update"];
}) {
  useFotoPanelMapBindings({
    mapView: args.mapView,
    redGraphicsLayer: args.redGraphicsLayer,
    attachmentPoint: args.input.attachmentPoint,
    validAttachments: args.validAttachments,
    setActiveIndex: args.ui.setActiveIndex,
    setIsOpen: args.ui.setIsOpen,
  });
  return buildFotoPanelModelApi({
    content: args.content,
    ui: args.ui,
    validAttachments: args.validAttachments,
    mapView: args.mapView,
    redGraphicsLayer: args.redGraphicsLayer,
    attachmentPoint: args.input.attachmentPoint,
    selectedPlan: args.input.selectedPlan,
    onAttachmentsUpdated: args.input.onAttachmentsUpdated,
    update: args.update,
  });
}
