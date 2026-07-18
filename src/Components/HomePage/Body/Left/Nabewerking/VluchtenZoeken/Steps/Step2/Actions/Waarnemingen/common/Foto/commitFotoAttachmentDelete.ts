import type {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";

export type FotoAttachmentDeleteInput = {
  attachmentId: number;
  validAttachments: AttachmentType[];
  attachmentPoint: FinishedPointType;
  selectedPlan: FinishedFlightPlanType;
  activeIndex: number;
  setLoading: (value: boolean) => void;
  setIsOpen: (value: boolean) => void;
  setActiveIndex: (value: number) => void;
  onAttachmentsUpdated: (newAttachments: AttachmentType[]) => void;
  update: (args: {
    data: {
      point_id: number;
      plan_id: number;
      attachments_id: number[];
    };
    onSuccess: () => void;
    onError: () => void;
  }) => void;
};

export function commitFotoAttachmentDelete(
  input: FotoAttachmentDeleteInput,
  newAttachments: AttachmentType[],
  newIndex: number
) {
  input.update({
    data: {
      point_id: input.attachmentPoint.id,
      plan_id: input.selectedPlan.id,
      attachments_id: newAttachments.flatMap((a) => a.id),
    },
    onSuccess: () => {
      input.setActiveIndex(newIndex);
      input.onAttachmentsUpdated(newAttachments);
      input.setLoading(false);
    },
    onError: () => input.setLoading(false),
  });
}
