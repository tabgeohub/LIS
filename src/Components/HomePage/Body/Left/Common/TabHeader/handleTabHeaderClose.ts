import type { TabType } from "Types";

export function handleTabHeaderClose(input: {
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;
  setSelectedIndex: (index: number) => void;
  resetFeatures: () => void;
  resetPointFilters: () => void;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined;
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
}) {
  input.setSelectedTab("none");
  if (input.selectedTab === "viewPlan") {
    input.setSelectedIndex(0);
    input.resetFeatures();
    input.graphicsLayer?.removeAll();
    input.graphicsLayerHover?.removeAll();
  }
  if (input.selectedTab === "aandachtspuntenFilteren") {
    input.resetPointFilters();
  }
  input.yellowGraphicsLayer?.graphics.removeAll();
}
