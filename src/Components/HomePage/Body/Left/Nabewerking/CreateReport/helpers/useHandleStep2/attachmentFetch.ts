import { FinishedPointType } from "Types/finished_plans";
import { fetchWithRetry } from "./utils";
import { attachmentDisplayUrl } from "@helpers/arcgis/attachmentDisplayUrl";
import type { AttachmentWithMeta } from "./types";

const proxyFetchInit: RequestInit = { credentials: "include" };

type AttachmentMeta = {
  id: number;
  name?: string;
  uploadDate?: number | string | null;
  creationDate?: number | string | null;
};

function attachmentNameFromUrl(rawUrl: string): string {
  try {
    const u = new URL(rawUrl);
    return decodeURIComponent(u.pathname.split("/").pop() || "attachment");
  } catch {
    return "attachment";
  }
}

function takenAtFromAttachmentMeta(att: AttachmentMeta): number | undefined {
  if (att.uploadDate != null) return new Date(att.uploadDate).getTime();
  if (att.creationDate != null) return new Date(att.creationDate).getTime();
  return undefined;
}

async function fetchOnePointAttachment(input: {
  featureLayerUrl: string;
  objectId: number;
  att: AttachmentMeta;
}): Promise<AttachmentWithMeta> {
  const { featureLayerUrl, objectId, att } = input;
  const url = attachmentDisplayUrl(
    `${featureLayerUrl}/0/${objectId}/attachments/${att.id}`
  );
  const fileRes = await fetchWithRetry({ url, options: proxyFetchInit });
  return {
    name: att.name || `attachment_${att.id}`,
    blob: await fileRes.blob(),
    taken_at: takenAtFromAttachmentMeta(att),
  };
}

export async function fetchAttachmentsForPoint(
  featureLayerUrl: string,
  objectId: number
): Promise<AttachmentWithMeta[]> {
  const metaUrl = attachmentDisplayUrl(
    `${featureLayerUrl}/0/${objectId}/attachments?f=json`
  );
  const metadata = await (
    await fetchWithRetry({ url: metaUrl, options: proxyFetchInit })
  ).json();
  if (!metadata.attachmentInfos) return [];

  const attachments = await Promise.allSettled(
    metadata.attachmentInfos.map((att: AttachmentMeta) =>
      fetchOnePointAttachment({ featureLayerUrl, objectId, att })
    )
  );
  return attachments
    .filter(
      (r): r is PromiseFulfilledResult<AttachmentWithMeta> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);
}

async function fetchOneDbAttachment(att: {
  url: string;
  taken_at?: number;
}): Promise<AttachmentWithMeta> {
  const rawUrl = att.url;
  const isArcgis = /arcgis\.com/i.test(rawUrl);
  const res = await fetchWithRetry({
    url: isArcgis ? attachmentDisplayUrl(rawUrl) : rawUrl,
    options: isArcgis ? proxyFetchInit : {},
  });
  return {
    name: attachmentNameFromUrl(rawUrl),
    blob: await res.blob(),
    taken_at: att.taken_at,
  };
}

/** Prefer DB-backed plan attachment URLs so reports match VluchtenZoeken after edits. */
export async function fetchAttachmentsFromDbUrls(
  list: Array<{ url: string; taken_at?: number }>
): Promise<AttachmentWithMeta[]> {
  const results = await Promise.allSettled(list.map(fetchOneDbAttachment));
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
