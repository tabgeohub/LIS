import { usePopUpState } from "hooks/zustand/ui";
import { useTabState } from "hooks/zustand/ui";
import { useMapViewState } from "hooks/zustand/ui";
import { useEffect, useRef } from "react";
import { setupClickListener } from "./setupClickListener";
import { isPopupTabBlocked } from "./popupBlockedTabs";
import { usePopupBlockedGuard } from "./usePopupBlockedGuard";

export function usePopupMapClickEffect() {
  const { mapView, selectedPointGraphicsLayer, pointsGraphicsLayer } =
    useMapViewState();
  const { setClickedPointId, setClickedPoint, createNewPoint } = usePopUpState();
  const { selectedTab } = useTabState();
  const clearIfBlocked = usePopupBlockedGuard();

  const selectedTabRef = useRef(selectedTab);
  useEffect(() => {
    selectedTabRef.current = selectedTab;
  }, [selectedTab]);

  useEffect(() => {
    if (!mapView || !selectedPointGraphicsLayer) return;
    if (clearIfBlocked()) return;

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
