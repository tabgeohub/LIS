import { useCallback } from "react";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useOpenAllTable } from "@helpers/ZustandStates/showAllTable";
import { useOpenResultTab } from "@helpers/ZustandStates/showResultTab";
import { useOpenSearchedTab } from "@helpers/ZustandStates/showSearchedTab";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useTabState } from "@helpers/ZustandStates/tabState";
import useLogAction from "hooks/useLogAction";

export function useBottomCompactListView(input?: { logMessage?: string }) {
  const logAction = useLogAction();
  const { setOpenTable } = useOpenTable();
  const { setOpenResultTab } = useOpenResultTab();
  const { setOpenSearchedTab } = useOpenSearchedTab();
  const { setOpenAllTable } = useOpenAllTable();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { selectedTab } = useTabState();

  return useCallback(() => {
    if (selectedTab === "none") {
      setSelectedBottomTab("searched");
      setOpenSearchedTab(true);
    } else {
      setSelectedBottomTab("result");
      setOpenResultTab(true);
    }
    setOpenSideBar(true);
    setOpenAllTable(false);
    setOpenTable(false);

    if (input?.logMessage) {
      logAction({
        message: input.logMessage,
        step: "Clicked table functions",
      });
    }
  }, [
    selectedTab,
    setSelectedBottomTab,
    setOpenSearchedTab,
    setOpenResultTab,
    setOpenSideBar,
    setOpenAllTable,
    setOpenTable,
    logAction,
    input?.logMessage,
  ]);
}
