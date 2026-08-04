import { useTabState } from "hooks/zustand/ui";
import { useViewPlanState } from "Components/Voorbereiding/ViewPlan/useViewPlanState";
import { useMapViewState } from "hooks/zustand/ui";
import { useSelectedBottomTabState } from "hooks/zustand/ui";
import { useContent } from "hooks/useContent";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useResetPointFilters } from "hooks/features/useResetPointFilters";
import { handleTabHeaderClose } from "./handleTabHeaderClose";
import { resolveTabHeaderText } from "./resolveTabHeaderText";

export function useTabHeaderModel() {
  const { selectedTab, setSelectedTab } = useTabState();
  const { graphicsLayerHover, graphicsLayer, yellowGraphicsLayer } =
    useMapViewState();
  const { setSelectedIndex } = useViewPlanState();
  const { resetFeatures } = useResetFeatures();
  const { resetPointFilters } = useResetPointFilters();
  const content = useContent();
  const { selectedBottomTab } = useSelectedBottomTabState();

  return {
    visible:
      selectedTab !== "none" &&
      selectedBottomTab !== "result" &&
      selectedBottomTab !== "searched",
    title: resolveTabHeaderText(selectedTab, content),
    onClose: () =>
      handleTabHeaderClose({
        selectedTab,
        setSelectedTab,
        setSelectedIndex,
        resetFeatures,
        resetPointFilters,
        graphicsLayer,
        graphicsLayerHover,
        yellowGraphicsLayer,
      }),
  };
}
