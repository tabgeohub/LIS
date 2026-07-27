import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import CreateImageBtn from "./CreateImageBtn";

export function FotoPanelBackFooter(input: {
  vorigeLabel: string;
  onBack: () => void;
}) {
  return (
    <div className="flex bg-white absolute left-0 bottom-0 items-center border-t border-gray-300 justify-end w-full gap-x-2 py-1 pr-3">
      <button onClick={input.onBack} className="gray-button">
        {input.vorigeLabel}
      </button>
    </div>
  );
}

export function FotoPanelActionsFooter(input: {
  vorigeLabel: string;
  onBack: () => void;
  setLoading: (value: boolean) => void;
  attachmentPoint: FinishedPointType;
  selectedPlan: FinishedFlightPlanType | null;
  fileInputId: string;
  onAttachmentsUpdated: (newAttachments: AttachmentType[]) => void;
}) {
  return (
    <div className="flex bg-white absolute left-0 bottom-0 items-center border-t border-gray-300 justify-end w-full gap-x-2 py-1 pr-3">
      <CreateImageBtn
        setLoading={input.setLoading}
        attachmentPoint={input.attachmentPoint}
        selectedPlan={input.selectedPlan}
        fileInputId={input.fileInputId}
        onAttachmentsUpdated={input.onAttachmentsUpdated}
      />
      <button onClick={input.onBack} className="gray-button">
        {input.vorigeLabel}
      </button>
    </div>
  );
}

export function FotoPanelLoadingOverlay() {
  return (
    <div className="absolute top-0 left-0 h-full w-full bg-white/40 backdrop-blur-sm z-10 flex items-center justify-center">
      <LoadingBars />
    </div>
  );
}
