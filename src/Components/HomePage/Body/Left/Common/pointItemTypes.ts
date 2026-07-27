import { EnrichedPointType } from "Types";
import { FinishedPointType } from "Types/finished_plans";

export type PointItemPoint = EnrichedPointType | FinishedPointType;

export type PointItemViewProps = {
  point: PointItemPoint;
  isSelected: boolean;
  activityLabel: string;
  organizationLabel: string;
  attachmentCount: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onCheckboxClick?: (event: React.MouseEvent) => void;
  onItemClick?: () => void;
};

function hasAttachmentsArray(
  point: PointItemPoint
): point is PointItemPoint & { attachments: unknown[] } {
  return "attachments" in point && Array.isArray(point.attachments);
}

function isValidAttachmentUrl(attachment: unknown): boolean {
  if (attachment == null || typeof attachment !== "object") return false;
  const url = (attachment as { url?: unknown }).url;
  return typeof url === "string" && Boolean(url);
}

export function countPointAttachments(point: PointItemPoint) {
  if (!hasAttachmentsArray(point)) return 0;
  return point.attachments.filter(isValidAttachmentUrl).length;
}
