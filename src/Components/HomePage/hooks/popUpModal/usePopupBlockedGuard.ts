import { usePopUpState } from "hooks/zustand/ui";
import { useTabState } from "hooks/zustand/ui";
import { useMapViewState } from "hooks/zustand/ui";
import { useCallback } from "react";
import { clearPopupIfBlocked } from "./popupTabGuard";

export function usePopupBlockedGuard() {
  const { selectedPointGraphicsLayer } = useMapViewState();
  const { setClickedPointId, setClickedPoint } = usePopUpState();
  const { selectedTab } = useTabState();

  return useCallback(
    (extra?: { setOpenModal?: (open: boolean) => void }) =>
      clearPopupIfBlocked({
        selectedTab,
        setClickedPointId,
        setClickedPoint,
        selectedPointGraphicsLayer,
        ...extra,
      }),
    [
      selectedTab,
      setClickedPointId,
      setClickedPoint,
      selectedPointGraphicsLayer,
    ]
  );
}
