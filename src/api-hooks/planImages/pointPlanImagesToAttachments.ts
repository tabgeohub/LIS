import type { AttachmentType } from "Types/finished_plans";
import type { PointPlanImageRow } from "./types";

/** Map timeslider API rows to the attachment model used by image galleries. */
export function pointPlanImagesToAttachments(
  rows: PointPlanImageRow[]
): AttachmentType[] {
  const mapped = rows.map((image) => {
    let takenAt = 0;
    if (image.taken_at) {
      const milliseconds = Date.parse(image.taken_at);
      if (Number.isFinite(milliseconds)) takenAt = milliseconds;
    }

    return {
      id: image.id,
      url: image.url,
      point_id: image.point_id,
      attachmentid: image.attachmentid ?? undefined,
      taken_at: takenAt,
      location: image.location ?? undefined,
    } satisfies AttachmentType;
  });

  return [...mapped].sort(
    (first, second) => first.taken_at - second.taken_at || first.id - second.id
  );
}
