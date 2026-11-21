import { useSelectedBottomTabState } from "hooks/zustand/ui";
import { useTabState } from "hooks/zustand/ui";
import useLogAction from "hooks/useLogAction";
import { IconType } from "react-icons";
import { useContent } from "hooks/useContent";
import { usePilotenWaarnemersStep } from "Components/HomePageTools/PilotenWaarnemers/usePilotenWaarnemersStep";
import { resolvePilotenWaarnemersLabel } from "Components/HomePageTools/PilotenWaarnemers/resolvePilotenWaarnemersLabel";
import { resolveSelectedTabItem } from "./resolveSelectedTabItem";
import { SelectedTabButton } from "./SelectedTabButton";

export default function SelectedTab() {
  const { selectedTab } = useTabState();
  const { selectedBottomTab, setSelectedBottomTab } =
    useSelectedBottomTabState();
  const logAction = useLogAction();
  const content = useContent();
  const { step: pilotenWaarnemersStep } = usePilotenWaarnemersStep();
  const selectedTabItem = resolveSelectedTabItem(selectedTab, content);
  const tabName =
    selectedTab === "pilotenWaarnemers"
      ? resolvePilotenWaarnemersLabel(pilotenWaarnemersStep, content)
      : selectedTabItem?.label;

  if (
    selectedTab === "none" ||
    selectedBottomTab === "viewSelectedPointDetails"
  ) {
    return null;
  }

  return (
    <SelectedTabButton
      selectedBottomTab={selectedBottomTab}
      tabName={tabName}
      IconComponent={selectedTabItem?.icon as IconType}
      onSelect={() => {
        setSelectedBottomTab("topTabs");
        logAction({
          message: `User clicked on '${tabName}' in the 'SelectedTab' component`,
          step: "BottomTabs - SelectedTab",
        });
      }}
    />
  );
}
