import { FinishedPointType } from "Types/finished_plans";
import { fetchWithRetry } from "./utils";
import { refreshToken } from "@helpers/refreshToken";

export async function fetchAttachmentsForPoint(
  featureLayerUrl: string,
  objectId: number
): Promise<{ name: string; blob: Blob }[]> {
  let token = localStorage.getItem("credential_token");
  if (!token) {
    try {
      await refreshToken();
      token = localStorage.getItem("credential_token");
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

      return { name: att.name || `attachment_${att.id}`, blob };
    })
  );

  const ok = attachments
    .filter(
      (r): r is PromiseFulfilledResult<{ name: string; blob: Blob }> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);

  return ok;
}

export async function safeFetchPointAttachments(
  featureLayerUrl: string,
  point: FinishedPointType
): Promise<{ name: string; blob: Blob }[]> {
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
      .map((att: any) => att?.url)
      .filter((u: string | undefined) => typeof u === "string" && u.length > 0);

    const results = await Promise.allSettled(
      list.map(async (rawUrl: string) => {
        let token = localStorage.getItem("credential_token");
        if (!token) {
          try {
            await refreshToken();
            token = localStorage.getItem("credential_token");
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
        return { name: nameFromUrl, blob };
      })
    );

    const ok = results
      .filter(
        (r): r is PromiseFulfilledResult<{ name: string; blob: Blob }> =>
          r.status === "fulfilled"
      )
      .map((r) => r.value);
    return ok;
  }

  return [];
}

