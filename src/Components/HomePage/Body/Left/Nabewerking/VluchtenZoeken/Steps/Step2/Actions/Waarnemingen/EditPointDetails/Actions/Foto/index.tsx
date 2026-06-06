import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { AttachmentType } from "Types/finished_plans";
import FotoPanel from "../../../common/Foto/FotoPanel";
import { syncPointAttachmentsInPlan } from "../../../common/Foto/syncAttachmentsInPlan";

export default function Foto({
  setAction,
}: {
  setAction: (value: string) => void;
}) {
  const { selectedPoint, selectedPlan, setSelectedPlan, setSelectedPoint } =
    useFinishedPlansState();

  const handleAttachmentsUpdated = (newAttachments: AttachmentType[]) => {
    if (!selectedPoint || !selectedPlan) return;

    const { updatedPlan, updatedPoint } = syncPointAttachmentsInPlan(
      selectedPlan,
      selectedPoint,
      newAttachments
    );

    setSelectedPlan(updatedPlan);
    setSelectedPoint(updatedPoint);
  };

  return (
    <FotoPanel
      setAction={setAction}
      attachmentPoint={selectedPoint}
      selectedPlan={selectedPlan}
      fileInputId="foto-images-point"
      onAttachmentsUpdated={handleAttachmentsUpdated}
    />
  );
}
