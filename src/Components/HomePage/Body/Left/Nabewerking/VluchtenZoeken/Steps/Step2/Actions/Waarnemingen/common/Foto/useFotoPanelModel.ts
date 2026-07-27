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
import { useFotoMapClickHandler } from "./useFotoMapClickHandler";
import { useImageMarkersOnMap } from "./useImageMarkersOnMap";
import { navigateToLocation } from "./navigateToLocation";
import { runFotoAttachmentDelete } from "./runFotoAttachmentDelete";

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

  useFotoMapClickHandler({
    mapView,
    redGraphicsLayer,
    validAttachments,
    setActiveIndex,
    setIsOpen,
  });
  useImageMarkersOnMap({
    attachmentPoint: input.attachmentPoint,
    validAttachments,
    mapView,
    redGraphicsLayer,
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
    handleNavigateToLocation: (location: string | null | undefined) => {
      navigateToLocation({ location, mapView, redGraphicsLayer });
    },
    deleteImage: async (attachmentId: number) => {
      if (!input.attachmentPoint || !input.selectedPlan) return;
      await runFotoAttachmentDelete({
        attachmentId,
        validAttachments,
        attachmentPoint: input.attachmentPoint,
        selectedPlan: input.selectedPlan,
        activeIndex,
        setLoading,
        setIsOpen,
        setActiveIndex,
        onAttachmentsUpdated: input.onAttachmentsUpdated,
        update,
      });
    },
  };
}
