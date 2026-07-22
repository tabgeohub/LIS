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

export function commitFotoAttachmentDelete(input: {
  context: FotoAttachmentDeleteInput;
  newAttachments: AttachmentType[];
  newIndex: number;
}) {
  const { context, newAttachments, newIndex } = input;
  context.update({
    data: {
      point_id: context.attachmentPoint.id,
      plan_id: context.selectedPlan.id,
      attachments_id: newAttachments.flatMap((a) => a.id),
    },
    onSuccess: () => {
      context.setActiveIndex(newIndex);
      context.onAttachmentsUpdated(newAttachments);
      context.setLoading(false);
    },
    onError: () => context.setLoading(false),
  });
}
