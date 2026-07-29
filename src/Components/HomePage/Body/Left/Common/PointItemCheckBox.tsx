import { useConstSelectOptions } from "Components/HomePage/hooks/consts/useConstSelectOptions";
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

type SelectOption = { value: unknown; label: string };

function resolveOptionLabel(
  options: SelectOption[],
  value: unknown
): unknown {
  return options.find((item) => item.value === value)?.label || value;
}

export default function PointItemCheckBox({
  point,
  showCheckbox = true,
  variant = "default",
  showAttachments = false,
  ...events
}: PointItemCheckBoxProps) {
  const activities = useConstSelectOptions("activiteiten");
  const organizations = useConstSelectOptions("organisaties");
  const viewProps = {
    point,
    activityLabel: resolveOptionLabel(activities, point.activiteit_id),
    organizationLabel: resolveOptionLabel(organizations, point.organisatie_id),
    attachmentCount: showAttachments ? countPointAttachments(point) : 0,
    ...events,
  };

  if (variant === "compact") {
    return <CompactPointItem {...viewProps} />;
  }
  return <DefaultPointItem {...viewProps} showCheckbox={showCheckbox} />;
}
