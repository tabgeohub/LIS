import { getBackEndUrl } from "@helpers/http/getBackEndUrl";
import {
  assertDeleteAttachmentsSuccess,
  type FeatureDeleteAttachmentsResponse,
} from "./deleteAttachmentsResponse";

export const ATTACHMENTS_FEATURE_LAYER_URL =
  "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/attachments_layer/FeatureServer";

export function buildDeleteAttachmentsProxyUrl(objectId: number) {
  const targetArcgisUrl = `${ATTACHMENTS_FEATURE_LAYER_URL}/0/${objectId}/deleteAttachments`;
  return `${getBackEndUrl()}/api/arcgis/proxy?url=${encodeURIComponent(
    targetArcgisUrl
  )}`;
}

export async function postDeleteAttachmentsRequest(input: {
  objectId: number;
  attachmentId: number;
}): Promise<FeatureDeleteAttachmentsResponse> {
  const form = new URLSearchParams({
    f: "json",
    attachmentIds: String(input.attachmentId),
  });

  const res = await fetch(buildDeleteAttachmentsProxyUrl(input.objectId), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  try {
    return (await res.json()) as FeatureDeleteAttachmentsResponse;
  } catch {
    throw new Error(
      `ArcGIS deleteAttachments: ongeldig antwoord (HTTP ${res.status})`
    );
  }
}

export async function applyDeleteAttachments(input: {
  objectId: number;
  attachmentId: number;
}): Promise<void> {
  const payload = await postDeleteAttachmentsRequest(input);
  assertDeleteAttachmentsSuccess(payload);
}
