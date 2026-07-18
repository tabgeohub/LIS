import { applyUploadedAttachmentSuccess } from "./applyUploadedAttachmentSuccess";
import type { CreateImageUploadInput } from "./createImageUploadTypes";
import type { FinishedPointType } from "Types/finished_plans";

function createAttachmentPayload(
  point: FinishedPointType,
  first: { url: string; objectId: number; taken_at: number }
) {
  return {
    url: first.url,
    pointId: point.id,
    attachmentId: first.objectId,
    taken_at: first.taken_at,
    long: point.longitude,
    lat: point.latitude,
  };
}

export async function runCreateImageUpload(input: CreateImageUploadInput) {
  const attachments = await input.uploadAttachmentForPoint(
    input.attachmentPoint.id,
    input.newImage
  );
  const first = attachments[0];
  if (!first?.url || first.objectId == null) {
    input.setLoading(false);
    input.setNewImage(null);
    return;
  }
  input.create({
    data: createAttachmentPayload(input.attachmentPoint, {
      url: first.url,
      objectId: first.objectId,
      taken_at: first.taken_at,
    }),
    onSuccess: (responseData) =>
      applyUploadedAttachmentSuccess({
        first: { objectId: first.objectId!, taken_at: first.taken_at },
        responseData,
        attachmentPoint: input.attachmentPoint,
        selectedPlanId: input.selectedPlan.id,
        update: input.update,
        onAttachmentsUpdated: input.onAttachmentsUpdated,
        setLoading: input.setLoading,
        setNewImage: input.setNewImage,
      }),
  });
}
