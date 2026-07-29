import { useCallback } from "react";
import { useOpenTable } from "hooks/zustand/ui";
import { useOpenResultTab } from "hooks/zustand/ui";
import { useTabState } from "hooks/zustand/ui";
import { useSelectedBottomTabState } from "hooks/zustand/ui";
import useLogAction from "hooks/useLogAction";

export function useResultTabTableView() {
  const logAction = useLogAction();
  const { setOpenResultTab } = useOpenResultTab();
  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setOpenTable, setView } = useOpenTable();

  return useCallback(() => {
    setOpenResultTab(false);
    setSelectedBottomTab("topTabs");
    setView("points");
    setSelectedTab("viewPlan");
    setOpenTable(true);

    logAction({
      message: "User changed view to 'Points' in the 'ResultTab' component",
      step: "ResultTab",
    });
  }, [
    logAction,
    setOpenResultTab,
    setOpenTable,
    setSelectedBottomTab,
    setSelectedTab,
    setView,
  ]);
}
