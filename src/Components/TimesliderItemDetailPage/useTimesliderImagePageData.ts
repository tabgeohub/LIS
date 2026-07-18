import { useClampedImageIndex } from "./useTimesliderSelection";
import { buildTimesliderPageView } from "./buildTimesliderPageView";
import { useTimesliderImagePageCore } from "./useTimesliderImagePageCore";
import { toTimesliderPageViewInput } from "./toTimesliderPageViewInput";

export function useTimesliderImagePageData() {
  const core = useTimesliderImagePageCore();
  const { selectedIndex, setSelectedIndex } = useClampedImageIndex(
    core.rowsForSelectedPlan.length
  );
  const view = buildTimesliderPageView(toTimesliderPageViewInput(core));
  return {
    ...view,
    selectedPlan: core.selectedPlan,
    setSelectedPlan: core.setSelectedPlan,
    selectedIndex,
    setSelectedIndex,
  };
}
