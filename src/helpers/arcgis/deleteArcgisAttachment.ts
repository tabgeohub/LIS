import { getBackEndUrl } from "@helpers/getBackEndUrl";

export const ATTACHMENTS_FEATURE_LAYER_URL =
  "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/attachments_layer/FeatureServer";

/**
 * Parse ArcGIS feature OBJECTID and attachment id from a hosted attachment URL.
 */
export function parseArcgisAttachmentIdsFromUrl(url: string): {
  objectId: number;
  attachmentId: number;
} | null {
  const pathOnly = url.split("?")[0];
  const m = pathOnly.match(
    /\/FeatureServer\/(\d+)\/(\d+)\/attachments\/(\d+)/i
  );
  if (!m) return null;
  return { objectId: Number(m[2]), attachmentId: Number(m[3]) };
}

function resolveIds(
  attachmentUrl: string,
  featureObjectIdFallback?: number | null
): { objectId: number; attachmentId: number } | null {
  const parsed = parseArcgisAttachmentIdsFromUrl(attachmentUrl);
  if (parsed) return parsed;
  if (featureObjectIdFallback != null) {
    return { objectId: featureObjectIdFallback, attachmentId: 1 };
  }
  return null;
}

type ArcgisError = {
  message?: string;
  details?: string | string[];
};

/**
 * Response for POST .../FeatureServer/{layerId}/{objectId}/deleteAttachments
 * (same pattern ArcGIS Online uses in the browser).
 */
type FeatureDeleteAttachmentsResponse = {
  error?: ArcgisError;
  deleteResults?: Array<{
    objectId?: number;
    success?: boolean;
    error?: { description?: string };
  }>;
};

function formatArcgisError(payload: ArcgisError | undefined): string {
  if (!payload) return "ArcGIS deleteAttachments fout";
  const details = payload.details;
  const detailStr = Array.isArray(details)
    ? details.join("; ")
    : details || "";
  return (
    [payload.message, detailStr].filter(Boolean).join(" ").trim() ||
    "ArcGIS deleteAttachments fout"
  );
}

/**
 * Deletes one attachment via the per-feature REST operation:
 * POST .../FeatureServer/{layerId}/{featureObjectId}/deleteAttachments
 * Body: attachmentIds, f=json (token added by session proxy in body).
 */
export async function deleteArcgisPointAttachment(
  attachmentUrl: string,
  featureObjectIdFallback?: number | null
): Promise<void> {
  const ids = resolveIds(attachmentUrl, featureObjectIdFallback);
  if (!ids) {
    throw new Error("Kon ArcGIS attachment niet vinden in URL.");
  }

  const targetArcgisUrl = `${ATTACHMENTS_FEATURE_LAYER_URL}/0/${ids.objectId}/deleteAttachments`;
  const proxyUrl = `${getBackEndUrl()}/api/arcgis/proxy?url=${encodeURIComponent(
    targetArcgisUrl
  )}`;

  const form = new URLSearchParams({
    f: "json",
    attachmentIds: String(ids.attachmentId),
  });

  const res = await fetch(proxyUrl, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  let payload: FeatureDeleteAttachmentsResponse;
  try {
    payload = (await res.json()) as FeatureDeleteAttachmentsResponse;
  } catch {
    throw new Error(`ArcGIS deleteAttachments: ongeldig antwoord (HTTP ${res.status})`);
  }

  if (payload.error) {
    throw new Error(formatArcgisError(payload.error));
  }

  const results = payload.deleteResults;
  if (Array.isArray(results) && results.length > 0) {
    const failed = results.find((r) => r.success === false);
    if (failed) {
      const desc = (failed.error?.description || "").toLowerCase();
      if (
        desc.includes("cannot find") ||
        desc.includes("not found") ||
        desc.includes("does not exist")
      ) {
        return;
      }
      throw new Error(
        failed.error?.description || "ArcGIS deleteAttachments mislukt"
      );
    }
  }
}
