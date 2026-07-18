import { IconType } from "react-icons";

export function SelectedTabButton(props: {
  selectedBottomTab: string;
  tabName: string | undefined;
  IconComponent: IconType;
  onSelect: () => void;
}) {
  const { selectedBottomTab, tabName, IconComponent, onSelect } = props;
  return (
    <button
      className={`
        px-3 flex items-center gap-x-3
      ${selectedBottomTab === "topTabs" && "bg-white shadow"}
    `}
      onClick={onSelect}
    >
      <IconComponent className="size-6 text-blue-500" />
      <span className="text-xs capitalize font-semibold">{tabName}</span>
    </button>
  );
}
