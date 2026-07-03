import { getBackEndUrl } from "@helpers/getBackEndUrl";
import {
  assertDeleteAttachmentsSuccess,
  type FeatureDeleteAttachmentsResponse,
} from "./deleteAttachmentsResponse";

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

/**
 * Deletes one attachment via the per-feature REST operation.
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

  assertDeleteAttachmentsSuccess(payload);
}
