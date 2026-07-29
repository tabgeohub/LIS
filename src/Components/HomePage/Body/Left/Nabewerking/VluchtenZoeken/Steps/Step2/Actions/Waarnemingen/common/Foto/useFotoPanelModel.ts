import { useContent } from "hooks/useContent";
import { useUpdateData } from "utils/useUpdateData";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import { filterValidAttachments } from "./filterValidAttachments";
import {
  useAssembledFotoPanelModel,
  useFotoPanelUiState,
} from "./fotoPanelModelHelpers";

export function useFotoPanelModel(input: {
  attachmentPoint: FinishedPointType | null;
  selectedPlan: FinishedFlightPlanType | null;
  onAttachmentsUpdated: (newAttachments: AttachmentType[]) => void;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const content = useContent();
  const ui = useFotoPanelUiState();
  const { update } = useUpdateData(
    `/finished_plans/points/finishedPointAttachments`
  );
  return useAssembledFotoPanelModel({
    content,
    ui,
    validAttachments: filterValidAttachments({
      attachments: input.attachmentPoint?.attachments,
    }),
    mapView,
    redGraphicsLayer,
    input,
    update: update as never,
  });
}
