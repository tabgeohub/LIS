import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { AttachmentType } from "Types/finished_plans";
import FotoPanel from "../../../common/Foto/FotoPanel";
import { syncGeometryAttachmentsInPlan } from "../../../common/Foto/syncAttachmentsInPlan";

export default function Foto({
  setAction,
}: {
  setAction: (value: string) => void;
}) {
  const {
    selectedGeometry,
    selectedPlan,
    setSelectedPlan,
    setSelectedGeometry,
  } = useFinishedPlansState();

  const firstPoint = selectedGeometry?.points?.[0] ?? null;

  const handleAttachmentsUpdated = (newAttachments: AttachmentType[]) => {
    if (!firstPoint || !selectedGeometry || !selectedPlan) return;

    const { updatedPlan, updatedGeometry } = syncGeometryAttachmentsInPlan(
      selectedPlan,
      selectedGeometry,
      firstPoint.id,
      newAttachments
    );

    setSelectedPlan(updatedPlan);
    setSelectedGeometry(updatedGeometry);
  };

  return (
    <FotoPanel
      setAction={setAction}
      attachmentPoint={firstPoint}
      selectedPlan={selectedPlan}
      fileInputId="foto-images-geometry"
      onAttachmentsUpdated={handleAttachmentsUpdated}
    />
  );
}
