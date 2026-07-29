import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useOpeSideBarState } from "hooks/zustand/ui/openSideBar";
import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";
import { useTabState } from "hooks/zustand/ui/tabState";
import { useTimesliderState } from "hooks/zustand/ui/useTimesliderState";
import { clearRightListHover, removeTimesliderHighlights } from "@helpers/timeslider";
import useLogAction from "hooks/useLogAction";
import { PageType } from "Types";

export function usePageSelection() {
  const tabs = useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const resetTimeslider = useTimesliderState((state) => state.reset);
  const yellowGraphicsLayer = useMapViewState((state) => state.yellowGraphicsLayer);
  const graphicsLayerHover = useMapViewState((state) => state.graphicsLayerHover);
  const logAction = useLogAction();

  const leaveTimeslider = () => {
    if (yellowGraphicsLayer) removeTimesliderHighlights(yellowGraphicsLayer);
    if (graphicsLayerHover) clearRightListHover(graphicsLayerHover);
    resetTimeslider();
    setOpenSideBar(false);
    tabs.setSelectedTab("none");
    setSelectedBottomTab("Kaartlagenlijst");
  };

  const selectPage = (page: PageType, label: string) => {
    if (tabs.selectedPage === "timeslider" && page !== "timeslider") {
      leaveTimeslider();
    }
    tabs.setSelectedPage(page);
    if (page === "timeslider") {
      if (tabs.selectedTab !== "timeslider") tabs.setSelectedTab("timeslider");
      setOpenSideBar(true);
    }
    logAction({ message: `User selected ${label} page` });
  };

  return { selectedPage: tabs.selectedPage, selectPage };
}
