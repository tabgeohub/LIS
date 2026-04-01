import type { AttachmentType } from "Types/finished_plans";
import type { PointPlanImageRow } from "./usePointPlanImages";

/** Map timeslider API rows to AttachmentType for ImageGallery. */
export function pointPlanImagesToAttachments(
  rows: PointPlanImageRow[]
): AttachmentType[] {
  const mapped = rows.map((img) => {
    let taken_at = 0;
    if (img.taken_at) {
      const ms = Date.parse(img.taken_at);
      if (Number.isFinite(ms)) taken_at = ms;
    }
    return {
      id: img.id,
      url: img.url,
      point_id: img.point_id,
      attachmentid: img.attachmentid ?? undefined,
      taken_at,
      location: img.location ?? undefined,
    } satisfies AttachmentType;
  });
  return [...mapped].sort((a, b) => a.taken_at - b.taken_at || a.id - b.id);
}
