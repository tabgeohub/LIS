import type { AttachmentType } from "Types/finished_plans";
import type { PointPlanImageRow } from "./types";

function coalesceUndefined<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined;
}

function parseTakenAt(takenAt: string | null | undefined): number {
  if (!takenAt) return 0;
  const milliseconds = Date.parse(takenAt);
  return Number.isFinite(milliseconds) ? milliseconds : 0;
}

function mapRowToAttachment(image: PointPlanImageRow): AttachmentType {
  return {
    id: image.id,
    url: image.url,
    point_id: image.point_id,
    attachmentid: coalesceUndefined(image.attachmentid),
    taken_at: parseTakenAt(image.taken_at),
    location: coalesceUndefined(image.location),
  };
}

function compareAttachments(
  first: AttachmentType,
  second: AttachmentType
): number {
  return first.taken_at - second.taken_at || first.id - second.id;
}

/** Map timeslider API rows to the attachment model used by image galleries. */
export function pointPlanImagesToAttachments(
  rows: PointPlanImageRow[]
): AttachmentType[] {
  return rows.map(mapRowToAttachment).sort(compareAttachments);
}
