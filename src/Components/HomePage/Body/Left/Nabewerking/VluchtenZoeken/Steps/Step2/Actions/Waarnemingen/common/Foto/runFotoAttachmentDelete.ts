import type {
  AttachmentType,
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import { deleteArcgisPointAttachment } from "@helpers/arcgis/deleteArcgisAttachment";
import toast from "react-hot-toast";
import { computeActiveIndexAfterDelete } from "./computeActiveIndexAfterDelete";

export async function runFotoAttachmentDelete(input: {
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
}): Promise<void> {
  const removed = input.validAttachments.find(
    (a) => a.id === input.attachmentId
  );
  if (!removed?.url) return;

  input.setLoading(true);
  try {
    await deleteArcgisPointAttachment(
      removed.url,
      removed.attachmentid ?? null
    );
  } catch (e) {
    toast.error(
      e instanceof Error ? e.message : "Verwijderen op kaartlaag mislukt"
    );
    input.setLoading(false);
    return;
  }

  const newAttachments = input.validAttachments.filter(
    (attachment) => attachment.id !== input.attachmentId
  );

  const { newIndex, closeGallery } = computeActiveIndexAfterDelete(
    input.activeIndex,
    newAttachments.length
  );

  if (closeGallery) {
    input.setIsOpen(false);
  }

  input.update({
    data: {
      point_id: input.attachmentPoint.id,
      plan_id: input.selectedPlan.id,
      attachments_id: newAttachments.flatMap((attachment) => attachment.id),
    },
    onSuccess: () => {
      input.setActiveIndex(newIndex);
      input.onAttachmentsUpdated(newAttachments);
      input.setLoading(false);
    },
    onError: () => input.setLoading(false),
  });
}
