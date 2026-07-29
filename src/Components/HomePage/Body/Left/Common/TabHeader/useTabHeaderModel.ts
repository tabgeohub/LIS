import { useTabState } from "hooks/zustand/ui/tabState";
import { useViewPlanState } from "Components/HomePage/hooks/zustand/voorbereiding/useViewPlanState";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";
import { useContent } from "hooks/useContent";
import { useResetFeatures } from "Components/HomePage/hooks/features/useResetFeatures";
import { useResetPointFilters } from "Components/HomePage/hooks/features/useResetPointFilters";
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
