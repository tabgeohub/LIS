import SelectedPlansPointsList from "./SelectedPlansPointsList";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import ResizableSidebarPanel from "Components/HomePage/Body/Common/ResizableSidebarPanel";

export default function Right({
  bodyStyle,
}: {
  bodyStyle: React.CSSProperties;
}) {
  const { selectedTab } = useTabState();
  const { selectedPlanIds } = useTimesliderState();
  const showPanel =
    selectedTab === "timeslider" && selectedPlanIds.length > 0;

  return (
    <ResizableSidebarPanel
      visible={showPanel}
      bodyStyle={bodyStyle}
      wrapperClassName="relative flex-shrink-0"
      panelClassName="relative !h-full bg-white border-l border-gray-200 shadow-lg"
      handleSide="left"
      initialWidthRatio={0.28}
    >
      <SelectedPlansPointsList />
    </ResizableSidebarPanel>
  );
}
