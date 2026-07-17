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

export function resolveAttachmentIds(
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
