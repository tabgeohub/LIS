import crypto from "node:crypto";
import type { ArcgisPhotoProvider, PhotoOperationInput, PhotoReceipt } from "./iosPhotoOperations";

// Existing website attachment service. Tokens never leave this adapter.
export const ATTACHMENT_LAYER = "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/attachments_layer/FeatureServer/0";
type Fetcher = typeof fetch;
function providerRejection(code: unknown, status: number): Error {
  return Object.assign(new Error("ARCGIS_REQUEST_UNCERTAIN"), {
    code: [401, 403, 498, 499].includes(Number(code)) || [401, 403].includes(status) ? "ARCGIS_AUTH_REJECTED" : "ARCGIS_REQUEST_REJECTED",
  });
}
export function makeArcgisPhotoProvider(token: () => Promise<string>, request: Fetcher = fetch): ArcgisPhotoProvider {
  async function form(path: string, fields: Record<string, string>): Promise<any> {
    const body = new URLSearchParams({ f: "json", token: await token(), ...fields });
    const response = await request(ATTACHMENT_LAYER + path, { method: "POST", body, signal: AbortSignal.timeout(30000) });
    const result: any = await response.json();
    if (!response.ok || result.error) throw providerRejection(result.error?.code, response.status);
    return result;
  }
  return {
    async createFeature() {
      const layer = await form("", {});
      if (layer.hasAttachments !== true || typeof layer.capabilities !== "string" || !layer.capabilities.split(",").includes("Create")) throw new Error("ARCGIS_LAYER_UNSUPPORTED");
      const result = await form("/addFeatures", { features: JSON.stringify([{ geometry: null, attributes: {} }]), rollbackOnFailure: "true" });
      if (result.addResults?.length !== 1 || !result.addResults[0].success) throw providerRejection(result.addResults?.[0]?.error?.code, 200);
      return result.addResults[0].objectId;
    },
    async addAttachment(featureID, input) {
      if (!input.bytes) throw new Error("IMAGE_REQUIRED");
      const body = new FormData(); body.append("f", "json"); body.append("token", await token());
      const extension = input.mime_type === "image/png" ? "png" : input.mime_type === "image/jpeg" ? "jpg" : "heic";
      body.append("attachment", new Blob([new Uint8Array(input.bytes)], { type: input.mime_type }), `${input.local_attachment_id}.${extension}`);
      const response = await request(`${ATTACHMENT_LAYER}/${featureID}/addAttachment`, { method: "POST", body, signal: AbortSignal.timeout(30000) });
      const result: any = await response.json();
      if (!response.ok || !result.addAttachmentResult?.success || !Number.isSafeInteger(result.addAttachmentResult.objectId) || result.addAttachmentResult.objectId <= 0) throw providerRejection(result.error?.code ?? result.addAttachmentResult?.error?.code, response.status);
      return result.addAttachmentResult.objectId;
    },
    async read(featureID: number, attachmentID: number | undefined, input: PhotoOperationInput): Promise<PhotoReceipt | null> {
      if (!Number.isSafeInteger(featureID) || featureID <= 0) return null;
      const result = await form(`/${featureID}/attachments`, {});
      const candidates = (result.attachmentInfos || []).filter((a: any) => Number.isSafeInteger(a.id) && a.id > 0 && (attachmentID == null || a.id === attachmentID) && a.size === input.byte_count && a.contentType === input.mime_type);
      const matches: PhotoReceipt[] = [];
      for (const attachment of candidates) {
        const url = `${ATTACHMENT_LAYER}/${featureID}/attachments/${attachment.id}`;
        // POST form authentication avoids secrets in URLs, logs and receipts.
        const response = await request(url, { method: "POST", body: new URLSearchParams({ token: await token() }), signal: AbortSignal.timeout(30000) });
        if (!response.ok) continue;
        if (!response.body) continue;
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = []; let size = 0;
        while (true) {
          const chunk = await reader.read();
          if (chunk.done) break;
          size += chunk.value.length;
          if (size > input.byte_count) { await reader.cancel(); break; }
          chunks.push(chunk.value);
        }
        if (size !== input.byte_count) continue;
        const bytes = Buffer.concat(chunks);
        if (bytes.length !== input.byte_count || crypto.createHash("sha256").update(bytes).digest("hex") !== input.attachment_sha256) continue;
        matches.push({ feature_object_id: featureID, attachment_id: attachment.id, url, evidence: { attachment_sha256: input.attachment_sha256, byte_count: input.byte_count, mime_type: input.mime_type } });
      }
      // Never choose MAX/latest. Ambiguous duplicate content requires review.
      return matches.length === 1 ? matches[0] : null;
    },
  };
}
export const arcgisPhotoProvider = makeArcgisPhotoProvider(async () => {
  try { return (await require("../../services/arcgis").getValidToken()).access_token; }
  catch (error) {
    if (error instanceof Error && ["Missing ArcGIS clientId (set ARCGIS_CLIENT_ID)", "Missing ArcGIS clientSecret (set ARCGIS_CLIENT_SECRET)"].includes(error.message)) {
      throw new Error("ARCGIS_PROVIDER_UNCONFIGURED");
    }
    throw error;
  }
});
