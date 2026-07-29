import { useOpeSideBarState } from "hooks/zustand/ui";
import { useSelectedBottomTabState } from "hooks/zustand/ui";
import { useOpenAllTable } from "hooks/zustand/ui";
import { useOpenResultTab } from "hooks/zustand/ui";
import { useOpenSearchedTab } from "hooks/zustand/ui";
import { useOpenTable } from "hooks/zustand/ui";
import { useTabState } from "hooks/zustand/ui";
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
