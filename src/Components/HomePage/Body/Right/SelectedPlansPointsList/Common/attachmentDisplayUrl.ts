import { getArcGISToken } from "@helpers/arcgisTokenStore";

/** Same pattern as ImageGallery: append ArcGIS-style token query param. */
export function attachmentDisplayUrl(raw: string): string {
  if (!raw) return "";
  const token = getArcGISToken();
  const base = raw.split("token=").at(0) ?? raw;
  return `${base}token=${token ?? ""}`;
}
