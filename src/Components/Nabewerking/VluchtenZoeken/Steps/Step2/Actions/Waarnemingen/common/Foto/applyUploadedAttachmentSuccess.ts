import type { AttachmentType, FinishedPointType } from "Types/finished_plans";
import { buildAttachmentFromUploadResponse } from "./attachmentUploadHelpers";

type UploadFirst = { objectId: number; taken_at: number };
type CreateResponse = { result: { id: number; url: string } };

export function buildAttachmentsAfterUpload(input: {
  first: UploadFirst;
  responseData: CreateResponse;
  attachmentPoint: FinishedPointType;
}) {
  const uploaded = buildAttachmentFromUploadResponse({
    objectId: input.first.objectId,
    responseId: input.responseData.result.id,
    responseUrl: input.responseData.result.url,
    pointId: input.attachmentPoint.id,
    takenAt: input.first.taken_at,
  });
  const isFirst =
    input.attachmentPoint.attachments?.at(0) === null ||
    !input.attachmentPoint.attachments?.length;
  const newAttachments = isFirst
    ? [uploaded]
    : [...input.attachmentPoint.attachments, uploaded];
  const attachmentsIds = isFirst
    ? [input.responseData.result.id]
    : [
        ...input.attachmentPoint.attachments.flatMap((a) => a.id),
        input.responseData.result.id,
      ];
  return { newAttachments, attachmentsIds };
}

export function applyUploadedAttachmentSuccess(input: {
  first: UploadFirst;
  responseData: CreateResponse;
  attachmentPoint: FinishedPointType;
  selectedPlanId: number;
  update: (args: { data: Record<string, unknown> }) => void;
  onAttachmentsUpdated: (attachments: AttachmentType[]) => void;
  setLoading: (value: boolean) => void;
  setNewImage: (value: null) => void;
}) {
  const { newAttachments, attachmentsIds } = buildAttachmentsAfterUpload(input);
  input.update({
    data: {
      point_id: input.attachmentPoint.id,
      plan_id: input.selectedPlanId,
      attachments_id: attachmentsIds,
    },
  });
  input.onAttachmentsUpdated(newAttachments);
  input.setLoading(false);
  input.setNewImage(null);
}
