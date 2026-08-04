import { getBackEndUrl } from "@helpers/http/getBackEndUrl";

/** Wrap a cleaned attachment URL in the backend ArcGIS proxy path. */
export function buildArcgisProxyDisplayUrl(cleanUrl: string): string {
  return `${getBackEndUrl()}/api/arcgis/proxy?url=${encodeURIComponent(cleanUrl)}`;
}
