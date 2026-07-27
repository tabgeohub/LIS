import {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import { useFotoPanelModel } from "./useFotoPanelModel";
import { FotoPanelEmptyView, FotoPanelFilledView } from "./FotoPanelViews";

export default function FotoPanel({
  setAction,
  attachmentPoint,
  selectedPlan,
  fileInputId,
  onAttachmentsUpdated,
}: {
  setAction: (value: string) => void;
  attachmentPoint: FinishedPointType | null;
  selectedPlan: FinishedFlightPlanType | null;
  fileInputId: string;
  onAttachmentsUpdated: (newAttachments: AttachmentType[]) => void;
}) {
  const model = useFotoPanelModel({
    attachmentPoint,
    selectedPlan,
    onAttachmentsUpdated,
  });
  const onBack = () => setAction("form");

  if (!attachmentPoint) {
    return <FotoPanelEmptyView model={model} onBack={onBack} />;
  }

  return (
    <FotoPanelFilledView
      model={model}
      onBack={onBack}
      attachmentPoint={attachmentPoint}
      selectedPlan={selectedPlan}
      fileInputId={fileInputId}
      onAttachmentsUpdated={onAttachmentsUpdated}
    />
  );
}
