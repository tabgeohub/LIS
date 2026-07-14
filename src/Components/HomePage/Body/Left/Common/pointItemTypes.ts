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

export function countPointAttachments(point: PointItemPoint) {
  if (!("attachments" in point) || !Array.isArray(point.attachments)) return 0;
  return point.attachments.filter(
    (attachment) =>
      attachment != null &&
      typeof attachment === "object" &&
      typeof (attachment as { url?: unknown }).url === "string" &&
      Boolean((attachment as { url: string }).url)
  ).length;
}
