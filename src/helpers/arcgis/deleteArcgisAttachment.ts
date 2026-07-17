import { applyDeleteAttachments } from "./deleteAttachmentsRequest";
import { resolveAttachmentIds } from "./deleteAttachmentsParse";

export { ATTACHMENTS_FEATURE_LAYER_URL } from "./deleteAttachmentsRequest";
export { parseArcgisAttachmentIdsFromUrl } from "./deleteAttachmentsParse";

/**
 * Deletes one attachment via the per-feature REST operation.
 */
export async function deleteArcgisPointAttachment(
  attachmentUrl: string,
  featureObjectIdFallback?: number | null
): Promise<void> {
  const ids = resolveAttachmentIds(attachmentUrl, featureObjectIdFallback);
  if (!ids) {
    throw new Error("Kon ArcGIS attachment niet vinden in URL.");
  }
  await applyDeleteAttachments(ids);
}
