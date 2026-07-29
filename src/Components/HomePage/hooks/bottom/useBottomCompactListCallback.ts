import { useCallback } from "react";
import { openBottomCompactListView } from "./openBottomCompactListView";
import { useBottomCompactListStores } from "./useBottomCompactListStores";

export function useBottomCompactListCallback(logMessage?: string) {
  const s = useBottomCompactListStores();
  return useCallback(
    () => openBottomCompactListView({ ...s, logMessage }),
    [
      s.selectedTab,
      s.setSelectedBottomTab,
      s.setOpenSearchedTab,
      s.setOpenResultTab,
      s.setOpenSideBar,
      s.setOpenAllTable,
      s.setOpenTable,
      s.logAction,
      logMessage,
    ]
  );
}
