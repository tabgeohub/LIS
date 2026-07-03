import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsStore } from "hooks/features/usePointsStore";
import useLogAction from "hooks/useLogAction";
import { useEffect, useRef } from "react";
import { setupClickListener } from "./setupClickListener";
import { isPopupTabBlocked } from "./popupBlockedTabs";
import { clearPopupIfBlocked } from "./popupTabGuard";
import { openPopupForClickedPoint } from "./popupSelection";

export function usePopupMapClickEffect() {
  const { mapView, selectedPointGraphicsLayer, pointsGraphicsLayer } =
    useMapViewState();
  const { setClickedPointId, setClickedPoint, createNewPoint } = usePopUpState();
  const { selectedTab } = useTabState();

  const selectedTabRef = useRef(selectedTab);
  useEffect(() => {
    selectedTabRef.current = selectedTab;
  }, [selectedTab]);

  useEffect(() => {
    if (!mapView || !selectedPointGraphicsLayer) return;

    if (
      clearPopupIfBlocked({
        selectedTab,
        setClickedPointId,
        setClickedPoint,
        selectedPointGraphicsLayer,
      })
    ) {
      return;
    }

    const cleanup = setupClickListener({
      mapView,
      setClickedPointId,
      setClickedPoint,
      selectedPointGraphicsLayer,
      createNewPoint,
      pointsGraphicsLayer,
      isTabBlocked: () => isPopupTabBlocked(selectedTabRef.current),
    });

    return () => cleanup?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapView, selectedPointGraphicsLayer, selectedTab, createNewPoint]);
}

export function usePopupOpenEffect(setOpenModal: (open: boolean) => void) {
  const logAction = useLogAction();
  const { selectedPointGraphicsLayer } = useMapViewState();
  const { clickedPointId, setClickedPointId, setClickedPoint } = usePopUpState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { selectedTab, setSelectedTab } = useTabState();
  const { points } = usePointsStore();

  useEffect(() => {
    if (!selectedPointGraphicsLayer || !clickedPointId) return;

    if (
      clearPopupIfBlocked({
        selectedTab,
        setClickedPointId,
        setClickedPoint,
        selectedPointGraphicsLayer,
      })
    ) {
      return;
    }

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
      clearPopupIfBlocked({
        selectedTab,
        setClickedPointId,
        setClickedPoint,
        selectedPointGraphicsLayer,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedPointId, points, selectedTab]);
}

export function usePopupTabSyncEffects(setOpenModal: (open: boolean) => void) {
  const { selectedPointGraphicsLayer } = useMapViewState();
  const { clickedPointId, setClickedPointId, setClickedPoint } = usePopUpState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { selectedTab } = useTabState();

  useEffect(() => {
    if (clickedPointId === 0 && selectedTab === "none") {
      setOpenModal(false);
      setSelectedBottomTab("Kaartlagenlijst");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedPointId, selectedTab]);

  useEffect(() => {
    clearPopupIfBlocked({
      selectedTab,
      setClickedPointId,
      setClickedPoint,
      selectedPointGraphicsLayer,
      setOpenModal,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);
}
