import { FinishedPointType } from "Types/finished_plans";
import { fetchWithRetry } from "./utils";
import { attachmentDisplayUrl } from "@helpers/arcgis/attachmentDisplayUrl";
import type { AttachmentWithMeta } from "./types";

const proxyFetchInit: RequestInit = { credentials: "include" };

function attachmentNameFromUrl(rawUrl: string): string {
  try {
    const u = new URL(rawUrl);
    return decodeURIComponent(u.pathname.split("/").pop() || "attachment");
  } catch {
    return "attachment";
  }
}

export async function fetchAttachmentsForPoint(
  featureLayerUrl: string,
  objectId: number
): Promise<AttachmentWithMeta[]> {
  const metaUrl = attachmentDisplayUrl(
    `${featureLayerUrl}/0/${objectId}/attachments?f=json`
  );
  const metadataRes = await fetchWithRetry({ url: metaUrl, options: proxyFetchInit });
  const metadata = await metadataRes.json();

  if (!metadata.attachmentInfos) return [];

  const attachments = await Promise.allSettled(
    metadata.attachmentInfos.map(async (att: any) => {
      const url = attachmentDisplayUrl(
        `${featureLayerUrl}/0/${objectId}/attachments/${att.id}`
      );
      const fileRes = await fetchWithRetry({ url, options: proxyFetchInit });
      const blob = await fileRes.blob();
      const takenAt =
        att.uploadDate != null
          ? new Date(att.uploadDate).getTime()
          : att.creationDate != null
            ? new Date(att.creationDate).getTime()
            : undefined;
      return {
        name: att.name || `attachment_${att.id}`,
        blob,
        taken_at: takenAt,
      };
    })
  );

  return attachments
    .filter(
      (r): r is PromiseFulfilledResult<AttachmentWithMeta> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);
}

/** Prefer DB-backed plan attachment URLs so reports match VluchtenZoeken after edits. */
export async function fetchAttachmentsFromDbUrls(
  list: Array<{ url: string; taken_at?: number }>
): Promise<AttachmentWithMeta[]> {
  const results = await Promise.allSettled(
    list.map(async (att) => {
      const rawUrl = att.url;
      const fetchUrl = /arcgis\.com/i.test(rawUrl)
        ? attachmentDisplayUrl(rawUrl)
        : rawUrl;
      const res = await fetchWithRetry({
        url: fetchUrl,
        options: /arcgis\.com/i.test(rawUrl) ? proxyFetchInit : {},
      });
      const blob = await res.blob();
      return {
        name: attachmentNameFromUrl(rawUrl),
        blob,
        taken_at: att.taken_at,
      };
    })
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<AttachmentWithMeta> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);
}

export function dbAttachmentUrlList(point: FinishedPointType) {
  if (!Array.isArray(point.attachments) || point.attachments.length === 0) {
    return [];
  }
  return point.attachments.filter(
    (att: { url?: string }) =>
      typeof att?.url === "string" && att.url.length > 0
  ) as Array<{ url: string; taken_at?: number }>;
}
