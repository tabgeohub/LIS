import { getBackEndUrl } from "@helpers/getBackEndUrl";

/** Same pattern as ImageGallery: append ArcGIS-style token query param. */
export function attachmentDisplayUrl(raw: string): string {
  if (!raw) return "";
  const backendUrl = getBackEndUrl();
  try {
    const parsed = new URL(raw);
    parsed.searchParams.delete("token");
    return `${backendUrl}/api/arcgis/proxy?url=${encodeURIComponent(parsed.toString())}`;
  } catch {
    const cleanUrl = raw.replace(/[?&]token=[^&]*/g, "").replace(/[?&]$/, "");
    return `${backendUrl}/api/arcgis/proxy?url=${encodeURIComponent(cleanUrl)}`;
  }
}
