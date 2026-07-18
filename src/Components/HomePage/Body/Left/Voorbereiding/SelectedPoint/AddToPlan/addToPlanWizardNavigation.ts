import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";

/** Shared cancel navigation for SelectedPoint AddToPlan step button bars. */
export function useAddToPlanWizardNavigation() {
  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();

  function cancelToKaartlagenlijst() {
    setSelectedTab("none");
    setSelectedBottomTab("Kaartlagenlijst");
  }

  return { setSelectedBottomTab, cancelToKaartlagenlijst };
}
