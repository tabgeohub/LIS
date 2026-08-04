import { buildArcgisProxyDisplayUrl } from "./buildArcgisProxyDisplayUrl";
import {
  stripTokenFromAbsoluteUrl,
  stripTokenFromRawUrl,
} from "./stripAttachmentToken";

/** Build the backend proxy URL used to display an ArcGIS attachment safely. */
export function attachmentDisplayUrl(raw: string): string {
  if (!raw) return "";

  const cleaned =
    stripTokenFromAbsoluteUrl(raw) ?? stripTokenFromRawUrl(raw);
  return buildArcgisProxyDisplayUrl(cleaned);
}
