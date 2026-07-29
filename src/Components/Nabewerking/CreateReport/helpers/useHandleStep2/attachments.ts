import { FinishedPointType } from "Types/finished_plans";
import type { AttachmentWithMeta } from "./types";
import {
  dbAttachmentUrlList,
  fetchAttachmentsForPoint,
  fetchAttachmentsFromDbUrls,
} from "./attachmentFetch";

export async function safeFetchPointAttachments(
  featureLayerUrl: string,
  point: FinishedPointType
): Promise<AttachmentWithMeta[]> {
  const list = dbAttachmentUrlList(point);

  // Prefer DB-backed rows (URLs on the plan) so reports match VluchtenZoeken after edits.
  // ArcGIS feature enumeration can still list attachments that were removed from lis.finished_plans only.
  if (list.length > 0) {
    return fetchAttachmentsFromDbUrls(list);
  }

  const first = point.attachments?.[0];
  if (first?.attachmentid != null) {
    try {
      return await fetchAttachmentsForPoint(
        featureLayerUrl,
        first.attachmentid
      );
    } catch {
      /* fall through */
    }
  }

  return [];
}
