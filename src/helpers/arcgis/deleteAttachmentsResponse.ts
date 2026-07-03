type ArcgisError = {
  message?: string;
  details?: string | string[];
};

type FeatureDeleteAttachmentsResponse = {
  error?: ArcgisError;
  deleteResults?: Array<{
    objectId?: number;
    success?: boolean;
    error?: { description?: string };
  }>;
};

export function formatArcgisDeleteError(payload: ArcgisError | undefined): string {
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

export function assertDeleteAttachmentsSuccess(
  payload: FeatureDeleteAttachmentsResponse
): void {
  if (payload.error) {
    throw new Error(formatArcgisDeleteError(payload.error));
  }

  const results = payload.deleteResults;
  if (!Array.isArray(results) || results.length === 0) return;

  const failed = results.find((r) => r.success === false);
  if (!failed) return;

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

export type { FeatureDeleteAttachmentsResponse };
