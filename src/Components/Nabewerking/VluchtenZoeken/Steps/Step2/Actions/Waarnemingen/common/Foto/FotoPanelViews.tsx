import {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import FotoEmptyState from "./FotoEmptyState";
import FotoAttachmentGrid from "./FotoAttachmentGrid";
import {
  FotoPanelActionsFooter,
  FotoPanelBackFooter,
  FotoPanelLoadingOverlay,
} from "./FotoPanelChrome";

type FotoPanelModel = {
  content: { common: { vorige: string } };
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  activeIndex: number;
  setActiveIndex: (value: number) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  validAttachments: AttachmentType[];
  handleNavigateToLocation: (location: string | null | undefined) => void;
  deleteImage: (attachmentId: number) => Promise<void>;
};

export function FotoPanelEmptyView(input: {
  model: FotoPanelModel;
  onBack: () => void;
}) {
  return (
    <div className="h-full">
      <FotoEmptyState />
      <FotoPanelBackFooter
        vorigeLabel={input.model.content.common.vorige}
        onBack={input.onBack}
      />
    </div>
  );
}

export function FotoPanelFilledView(input: {
  model: FotoPanelModel;
  onBack: () => void;
  attachmentPoint: FinishedPointType;
  selectedPlan: FinishedFlightPlanType | null;
  fileInputId: string;
  onAttachmentsUpdated: (newAttachments: AttachmentType[]) => void;
}) {
  const { model } = input;
  return (
    <div className="h-full">
      <div className="overflow-y-scroll pb-20 thin-scrollbar flex-grow">
        <FotoAttachmentGrid
          validAttachments={model.validAttachments}
          isOpen={model.isOpen}
          setIsOpen={model.setIsOpen}
          activeIndex={model.activeIndex}
          setActiveIndex={model.setActiveIndex}
          onDelete={model.deleteImage}
          onShowLocation={model.handleNavigateToLocation}
        />
      </div>
      <FotoPanelActionsFooter
        vorigeLabel={model.content.common.vorige}
        onBack={input.onBack}
        setLoading={model.setLoading}
        attachmentPoint={input.attachmentPoint}
        selectedPlan={input.selectedPlan}
        fileInputId={input.fileInputId}
        onAttachmentsUpdated={input.onAttachmentsUpdated}
      />
      {model.loading && <FotoPanelLoadingOverlay />}
    </div>
  );
}
