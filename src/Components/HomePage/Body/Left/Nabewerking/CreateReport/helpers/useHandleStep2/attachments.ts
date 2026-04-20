import { FinishedPointType } from "Types/finished_plans";
import { fetchWithRetry } from "./utils";
import { refreshToken } from "@helpers/refreshToken";
import { getArcGISToken } from "@helpers/arcgisTokenStore";
import type { AttachmentWithMeta } from "./types";

export async function fetchAttachmentsForPoint(
  featureLayerUrl: string,
  objectId: number
): Promise<AttachmentWithMeta[]> {
  let token = getArcGISToken();
  if (!token) {
    try {
      await refreshToken();
      token = getArcGISToken();
    } catch {}
  }

  const metaUrl = `${featureLayerUrl}/0/${objectId}/attachments?f=json${
    token ? `&token=${token}` : ""
  }`;
  const metadataRes = await fetchWithRetry(metaUrl);
  const metadata = await metadataRes.json();

  if (!metadata.attachmentInfos) return [];

  const attachments = await Promise.allSettled(
    metadata.attachmentInfos.map(async (att: any) => {
      const url = `${featureLayerUrl}/0/${objectId}/attachments/${att.id}${
        token ? `?token=${token}` : ""
      }`;
      const fileRes = await fetchWithRetry(url);
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
  const first = point.attachments?.[0];
  if (first && (first as any)?.attachmentid) {
    try {
      return await fetchAttachmentsForPoint(
        featureLayerUrl,
        (first as any).attachmentid as number
      );
    } catch {}
  }

  if (Array.isArray(point.attachments) && point.attachments.length > 0) {
    const list = point.attachments
      .filter(
        (att: any) =>
          typeof att?.url === "string" && (att.url as string).length > 0
      ) as Array<{ url: string; taken_at?: number }>;

    const results = await Promise.allSettled(
      list.map(async (att) => {
        const rawUrl = att.url;
        let token = getArcGISToken();
        if (!token) {
          try {
            await refreshToken();
            token = getArcGISToken();
          } catch {}
        }
        const needsToken = token && /arcgis\.com/.test(rawUrl);
        const finalUrl = needsToken
          ? `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}token=${token}`
          : rawUrl;
        const res = await fetchWithRetry(finalUrl);
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

    const ok = results
      .filter(
        (r): r is PromiseFulfilledResult<AttachmentWithMeta> =>
          r.status === "fulfilled"
      )
      .map((r) => r.value);
    return ok;
  }

  return [];
}

