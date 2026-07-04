import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
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
