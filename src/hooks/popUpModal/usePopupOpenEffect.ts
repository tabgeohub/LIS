import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsStore } from "hooks/features/usePointsStore";
import useLogAction from "hooks/useLogAction";
import { useEffect } from "react";
import { openPopupForClickedPoint } from "./popupSelection";
import { usePopupBlockedGuard } from "./usePopupBlockedGuard";

export function usePopupOpenEffect(setOpenModal: (open: boolean) => void) {
  const logAction = useLogAction();
  const { selectedPointGraphicsLayer } = useMapViewState();
  const { clickedPointId, setClickedPoint } = usePopUpState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { selectedTab, setSelectedTab } = useTabState();
  const { points } = usePointsStore();
  const clearIfBlocked = usePopupBlockedGuard();

  useEffect(() => {
    if (!selectedPointGraphicsLayer || !clickedPointId) return;
    if (clearIfBlocked()) return;

    const result = openPopupForClickedPoint({
      clickedPointId,
      points,
      selectedTab,
      selectedPointGraphicsLayer,
      setClickedPoint,
      setOpenModal,
      setSelectedBottomTab,
      setSelectedTab,
      setOpenSideBar,
      logAction,
    });

    if (result?.blocked) {
      clearIfBlocked();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedPointId, points, selectedTab]);
}
