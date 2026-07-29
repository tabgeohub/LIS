import { useSelectedBottomTabState } from "hooks/zustand/ui";
import { useTabState } from "hooks/zustand/ui";
import useLogAction from "hooks/useLogAction";
import { IconType } from "react-icons";
import { useContent } from "hooks/useContent";
import { resolveSelectedTabItem } from "./resolveSelectedTabItem";
import { SelectedTabButton } from "./SelectedTabButton";

export default function SelectedTab() {
  const { selectedTab } = useTabState();
  const { selectedBottomTab, setSelectedBottomTab } =
    useSelectedBottomTabState();
  const logAction = useLogAction();
  const content = useContent();
  const selectedTabItem = resolveSelectedTabItem(selectedTab, content);

  if (
    selectedTab === "none" ||
    selectedBottomTab === "viewSelectedPointDetails"
  ) {
    return null;
  }

  return (
    <SelectedTabButton
      selectedBottomTab={selectedBottomTab}
      tabName={selectedTabItem?.label}
      IconComponent={selectedTabItem?.icon as IconType}
      onSelect={() => {
        setSelectedBottomTab("topTabs");
        logAction({
          message: `User clicked on '${selectedTabItem?.label}' in the 'SelectedTab' component`,
          step: "BottomTabs - SelectedTab",
        });
      }}
    />
  );
}
