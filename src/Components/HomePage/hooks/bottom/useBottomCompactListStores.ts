import { useOpeSideBarState } from "hooks/zustand/ui/openSideBar";
import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";
import { useOpenAllTable } from "hooks/zustand/ui/showAllTable";
import { useOpenResultTab } from "hooks/zustand/ui/showResultTab";
import { useOpenSearchedTab } from "hooks/zustand/ui/showSearchedTab";
import { useOpenTable } from "hooks/zustand/ui/showTable";
import { useTabState } from "hooks/zustand/ui/tabState";
import useLogAction from "hooks/useLogAction";

export function useBottomCompactListStores() {
  const logAction = useLogAction();
  const { setOpenTable } = useOpenTable();
  const { setOpenResultTab } = useOpenResultTab();
  const { setOpenSearchedTab } = useOpenSearchedTab();
  const { setOpenAllTable } = useOpenAllTable();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { selectedTab } = useTabState();

  return {
    selectedTab,
    setSelectedBottomTab,
    setOpenSearchedTab,
    setOpenResultTab,
    setOpenSideBar,
    setOpenAllTable,
    setOpenTable,
    logAction,
  };
}
