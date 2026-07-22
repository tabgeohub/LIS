import { computeActiveIndexAfterDelete } from "./computeActiveIndexAfterDelete";
import { deleteFotoFromArcgis } from "./deleteFotoFromArcgis";
import {
  commitFotoAttachmentDelete,
  type FotoAttachmentDeleteInput,
} from "./commitFotoAttachmentDelete";

export async function runFotoAttachmentDelete(
  input: FotoAttachmentDeleteInput
): Promise<void> {
  const removed = input.validAttachments.find(
    (a) => a.id === input.attachmentId
  );
  if (!removed?.url) return;

  input.setLoading(true);
  const ok = await deleteFotoFromArcgis(removed, input.setLoading);
  if (!ok) return;

  const newAttachments = input.validAttachments.filter(
    (attachment) => attachment.id !== input.attachmentId
  );
  const { newIndex, closeGallery } = computeActiveIndexAfterDelete(
    input.activeIndex,
    newAttachments.length
  );
  if (closeGallery) input.setIsOpen(false);

  commitFotoAttachmentDelete({
    context: input,
    newAttachments,
    newIndex,
  });
}
