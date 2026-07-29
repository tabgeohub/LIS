import { useSelectedBottomTabState } from "hooks/zustand/ui";
import { useTabState } from "hooks/zustand/ui";

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
