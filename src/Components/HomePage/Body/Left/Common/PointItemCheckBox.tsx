import { useConstSelectOptions } from "hooks/consts/useConstSelectOptions";
import CompactPointItem from "./CompactPointItem";
import DefaultPointItem from "./DefaultPointItem";
import { countPointAttachments, PointItemPoint } from "./pointItemTypes";

type PointItemCheckBoxProps = {
  point: PointItemPoint;
  isSelected: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onCheckboxClick?: (event: React.MouseEvent) => void;
  onItemClick?: () => void;
  showCheckbox?: boolean;
  variant?: "default" | "compact";
  showAttachments?: boolean;
};

export default function PointItemCheckBox({
  point,
  showCheckbox = true,
  variant = "default",
  showAttachments = false,
  ...events
}: PointItemCheckBoxProps) {
  const activities = useConstSelectOptions("activiteiten");
  const organizations = useConstSelectOptions("organisaties");
  const activityLabel =
    activities.find((item) => item.value === point.activiteit_id)?.label ||
    point.activiteit_id;
  const organizationLabel =
    organizations.find((item) => item.value === point.organisatie_id)?.label ||
    point.organisatie_id;
  const viewProps = {
    point,
    activityLabel,
    organizationLabel,
    attachmentCount: showAttachments ? countPointAttachments(point) : 0,
    ...events,
  };

  return variant === "compact" ? (
    <CompactPointItem {...viewProps} />
  ) : (
    <DefaultPointItem {...viewProps} showCheckbox={showCheckbox} />
  );
}
