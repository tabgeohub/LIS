import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
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
