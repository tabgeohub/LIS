import { FinishedPointType } from "Types/finished_plans";
import { fetchWithRetry } from "./utils";
import { attachmentDisplayUrl } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/attachmentDisplayUrl";
import type { AttachmentWithMeta } from "./types";

const proxyFetchInit: RequestInit = { credentials: "include" };

export async function fetchAttachmentsForPoint(
  featureLayerUrl: string,
  objectId: number
): Promise<AttachmentWithMeta[]> {
  const metaUrl = attachmentDisplayUrl(
    `${featureLayerUrl}/0/${objectId}/attachments?f=json`
  );
  const metadataRes = await fetchWithRetry(metaUrl, proxyFetchInit);
  const metadata = await metadataRes.json();

  if (!metadata.attachmentInfos) return [];

  const attachments = await Promise.allSettled(
    metadata.attachmentInfos.map(async (att: any) => {
      const url = attachmentDisplayUrl(
        `${featureLayerUrl}/0/${objectId}/attachments/${att.id}`
      );
      const fileRes = await fetchWithRetry(url, proxyFetchInit);
      const blob = await fileRes.blob();
      const takenAt =
        att.uploadDate != null
          ? new Date(att.uploadDate).getTime()
          : att.creationDate != null
            ? new Date(att.creationDate).getTime()
            : undefined;
      return { name: att.name || `attachment_${att.id}`, blob, taken_at: takenAt };
    })
  );

  const ok = attachments
    .filter(
      (r): r is PromiseFulfilledResult<AttachmentWithMeta> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);

  return ok;
}

export async function safeFetchPointAttachments(
  featureLayerUrl: string,
  point: FinishedPointType
): Promise<AttachmentWithMeta[]> {
  const list =
    Array.isArray(point.attachments) && point.attachments.length > 0
      ? (point.attachments.filter(
          (att: { url?: string }) =>
            typeof att?.url === "string" && att.url.length > 0
        ) as Array<{ url: string; taken_at?: number }>)
      : [];

  // Prefer DB-backed rows (URLs on the plan) so reports match VluchtenZoeken after edits.
  // ArcGIS feature enumeration can still list attachments that were removed from lis.finished_plans only.
  if (list.length > 0) {
    const results = await Promise.allSettled(
      list.map(async (att) => {
        const rawUrl = att.url;
        const fetchUrl = /arcgis\.com/i.test(rawUrl)
          ? attachmentDisplayUrl(rawUrl)
          : rawUrl;
        const res = await fetchWithRetry(
          fetchUrl,
          /arcgis\.com/i.test(rawUrl) ? proxyFetchInit : {}
        );
        const blob = await res.blob();
        const nameFromUrl = (() => {
          try {
            const u = new URL(rawUrl);
            return decodeURIComponent(
              u.pathname.split("/").pop() || "attachment"
            );
          } catch {
            return "attachment";
          }
        })();
        return {
          name: nameFromUrl,
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

