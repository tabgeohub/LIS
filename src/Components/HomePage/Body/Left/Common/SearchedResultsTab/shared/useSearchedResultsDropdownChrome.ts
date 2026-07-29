import { useOpeSideBarState } from "hooks/zustand/ui/openSideBar";
import { useOpenSearchedTab } from "hooks/zustand/ui/showSearchedTab";
import { useOpenTable } from "hooks/zustand/ui/showTable";
import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";
import { useTabState } from "hooks/zustand/ui/tabState";
import { useContent } from "hooks/useContent";

/** Shared chrome/hooks for SearchedResults FlightPlans + Points dropdown menus. */
export function useSearchedResultsDropdownChrome() {
  const table = useOpenTable();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setSelectedTab } = useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setOpenSearchedTab } = useOpenSearchedTab();
  const labels = useContent().layout.searchResult.listPointFunctions;
  const noop = () => {};

  function closeSearchedAndOpenTable() {
    setSelectedBottomTab("topTabs");
    setSelectedTab("none");
    setOpenSearchedTab(false);
    setOpenSideBar(false);
  }

  return {
    table,
    labels,
    noop,
    closeSearchedAndOpenTable,
  };
}
