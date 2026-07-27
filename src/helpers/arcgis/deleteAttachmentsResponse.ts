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

const BENIGN_MISSING_FRAGMENTS = [
  "cannot find",
  "not found",
  "does not exist",
] as const;

function isBenignMissingAttachmentError(description: string): boolean {
  const desc = description.toLowerCase();
  return BENIGN_MISSING_FRAGMENTS.some((fragment) => desc.includes(fragment));
}

function firstFailedDeleteResult(
  results: FeatureDeleteAttachmentsResponse["deleteResults"]
) {
  if (!Array.isArray(results) || results.length === 0) return undefined;
  return results.find((r) => r.success === false);
}

function failedDeleteDescription(
  failed: NonNullable<ReturnType<typeof firstFailedDeleteResult>>
): string {
  return failed.error?.description || "";
}

export function assertDeleteAttachmentsSuccess(
  payload: FeatureDeleteAttachmentsResponse
): void {
  if (payload.error) {
    throw new Error(formatArcgisDeleteError(payload.error));
  }

  const failed = firstFailedDeleteResult(payload.deleteResults);
  if (!failed) return;

  const description = failedDeleteDescription(failed);
  if (isBenignMissingAttachmentError(description)) return;

  throw new Error(description || "ArcGIS deleteAttachments mislukt");
}

export type { FeatureDeleteAttachmentsResponse };
