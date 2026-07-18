import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useOpenSearchedTab } from "@helpers/ZustandStates/showSearchedTab";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
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
