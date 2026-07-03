import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { setupClickListener } from "hooks/popUpModal/setupClickListener";
import useLogAction from "hooks/useLogAction";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useEffect, useRef } from "react";
import { isPopupTabBlocked } from "./popupBlockedTabs";
import { clearPopupSelection, openPopupForClickedPoint } from "./popupSelection";

export default function usePopupController(
  setOpenModal: (open: boolean) => void
) {
  const logAction = useLogAction();
  const { mapView, selectedPointGraphicsLayer, pointsGraphicsLayer } =
    useMapViewState();
  const { clickedPointId, setClickedPointId, setClickedPoint, createNewPoint } =
    usePopUpState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { selectedTab, setSelectedTab } = useTabState();
  const { points } = usePointsStore();

  const selectedTabRef = useRef(selectedTab);
  useEffect(() => {
    selectedTabRef.current = selectedTab;
  }, [selectedTab]);

  useEffect(() => {
    if (!mapView || !selectedPointGraphicsLayer) return;

    if (isPopupTabBlocked(selectedTab)) {
      clearPopupSelection({
        setClickedPointId,
        setClickedPoint,
        selectedPointGraphicsLayer,
      });
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

  useEffect(() => {
    if (!mapView || !selectedPointGraphicsLayer || !clickedPointId) return;

    if (isPopupTabBlocked(selectedTab)) {
      clearPopupSelection({
        setClickedPointId,
        setClickedPoint,
        selectedPointGraphicsLayer,
      });
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
      clearPopupSelection({
        setClickedPointId,
        setClickedPoint,
        selectedPointGraphicsLayer,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedPointId, points, selectedTab]);

  useEffect(() => {
    if (clickedPointId === 0 && selectedTab === "none") {
      setOpenModal(false);
      setSelectedBottomTab("Kaartlagenlijst");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedPointId, selectedTab]);

  useEffect(() => {
    if (!isPopupTabBlocked(selectedTab)) return;

    clearPopupSelection({
      setClickedPointId,
      setClickedPoint,
      selectedPointGraphicsLayer,
    });
    setOpenModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);
}
