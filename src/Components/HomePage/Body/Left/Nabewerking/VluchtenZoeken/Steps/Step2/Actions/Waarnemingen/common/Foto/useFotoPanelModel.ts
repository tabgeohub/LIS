import { useState } from "react";
import { useContent } from "hooks/useContent";
import { useUpdateData } from "utils/useUpdateData";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import { filterValidAttachments } from "./filterValidAttachments";
import {
  createFotoDeleteHandler,
  createFotoNavigateHandler,
  useFotoPanelMapBindings,
} from "./fotoPanelModelHelpers";

export function useFotoPanelModel(input: {
  attachmentPoint: FinishedPointType | null;
  selectedPlan: FinishedFlightPlanType | null;
  onAttachmentsUpdated: (newAttachments: AttachmentType[]) => void;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const content = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { update } = useUpdateData(
    `/finished_plans/points/finishedPointAttachments`
  );
  const validAttachments = filterValidAttachments({
    attachments: input.attachmentPoint?.attachments,
  });

  useFotoPanelMapBindings({
    mapView,
    redGraphicsLayer,
    attachmentPoint: input.attachmentPoint,
    validAttachments,
    setActiveIndex,
    setIsOpen,
  });

  return {
    content,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    loading,
    setLoading,
    validAttachments,
    handleNavigateToLocation: createFotoNavigateHandler({
      mapView,
      redGraphicsLayer,
    }),
    deleteImage: createFotoDeleteHandler({
      attachmentPoint: input.attachmentPoint,
      selectedPlan: input.selectedPlan,
      validAttachments,
      activeIndex,
      setLoading,
      setIsOpen,
      setActiveIndex,
      onAttachmentsUpdated: input.onAttachmentsUpdated,
      update: update as never,
    }),
  };
}
