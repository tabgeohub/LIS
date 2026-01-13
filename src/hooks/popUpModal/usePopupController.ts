import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { initialPointState } from "@helpers/ZustandStates/popUpState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { createYellowCircle } from "Components/HomePage/Body/Common/PopupModal/createYellowCircle";
import { setupClickListener } from "Components/HomePage/Body/Common/PopupModal/setupClickListener";
import useLogAction from "hooks/useLogAction";
import { usePointsStore } from "hooks/zustand/usePointsStore";
import { useEffect } from "react";

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

  // 1) Attach/detach click listener based on tab, not on clickedPointId
  useEffect(() => {
    if (!mapView || !selectedPointGraphicsLayer) return;

    const blockedTabs = new Set([
      "enrichedAddPoint",
      "flightPlan",
      "templateFlights",
      "addPoint",
    ]);
    if (blockedTabs.has(selectedTab)) return;

    const cleanup = setupClickListener(
      mapView,
      setClickedPointId,
      setClickedPoint,
      selectedPointGraphicsLayer,
      createNewPoint,
      pointsGraphicsLayer
    );

    return () => {
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapView, selectedPointGraphicsLayer, selectedTab, createNewPoint]);

  // 2) React to clickedPointId to open modal and highlight
  useEffect(() => {
    if (!mapView || !selectedPointGraphicsLayer) return;
    if (!clickedPointId) return;

    const foundPoint = points.find((point) => point.id === clickedPointId);
    if (!foundPoint) {
      setOpenModal(false);
      return;
    }

    // Clear previous yellow markers before creating a new one
    selectedPointGraphicsLayer.removeAll();

    setClickedPoint(foundPoint);
    setOpenModal(true);
    createYellowCircle(selectedPointGraphicsLayer, foundPoint);

    if (selectedTab === "none") {
      setSelectedBottomTab("viewSelectedPointDetails");
      setSelectedTab("none");
      setOpenSideBar(true);
    }

    logAction({
      message: "User clicked on a point",
      newData: { point: foundPoint },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedPointId, points]);

  // 2b) Close modal when selection is cleared (e.g., clicking empty map)
  useEffect(() => {
    if (clickedPointId === 0) {
      setOpenModal(false);
      setSelectedBottomTab("Kaartlagenlijst");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedPointId]);

  // 3) Clear selected point when switching to blocked tabs
  useEffect(() => {
    const blockedTabs = new Set([
      "enrichedAddPoint",
      "flightPlan",
      "templateFlights",
      "addPoint",
    ]);
    if (!blockedTabs.has(selectedTab)) return;

    // Clear popup selection and graphics
    setClickedPointId(0);
    setClickedPoint(initialPointState as any);
    selectedPointGraphicsLayer?.removeAll();
    setOpenModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);
}
