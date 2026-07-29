import { usePopUpState } from "hooks/zustand/ui/popUpState";
import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";
import { useTabState } from "hooks/zustand/ui/tabState";
import { useEffect } from "react";
import { usePopupBlockedGuard } from "./usePopupBlockedGuard";

export function usePopupTabSyncEffects(setOpenModal: (open: boolean) => void) {
  const { clickedPointId } = usePopUpState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { selectedTab } = useTabState();
  const clearIfBlocked = usePopupBlockedGuard();

  useEffect(() => {
    if (clickedPointId === 0 && selectedTab === "none") {
      setOpenModal(false);
      setSelectedBottomTab("Kaartlagenlijst");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedPointId, selectedTab]);

  useEffect(() => {
    clearIfBlocked({ setOpenModal });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);
}
