import type { ToolsTabsType } from "Types";
import type { IconType } from "react-icons";

type ToolsTabItem = {
  id: ToolsTabsType;
  label: string;
  icon: IconType;
  disabled: boolean;
};

type HandleToolsTabClickInput = {
  item: ToolsTabItem;
  mapView: __esri.MapView | null | undefined;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined;
  redGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  resetFeatures: () => void;
  setOpenExporter: (v: boolean) => void;
  setOpenUploader: (v: boolean) => void;
  setOpenBevragen: (v: boolean) => void;
  setSelectedTab: (id: ToolsTabsType) => void;
  setOpenSideBar: (v: boolean) => void;
};

export function goToStartgebied(input: HandleToolsTabClickInput) {
  input.resetFeatures();
  input.graphicsLayer?.removeAll();
  input.graphicsLayerHover?.removeAll();
  input.redGraphicsLayer?.removeAll();
  input.mapView?.goTo(
    { target: [4.9041, 52.3676], zoom: 7 },
    { duration: 2000 }
  );
}

export function openToolSideTab(input: HandleToolsTabClickInput) {
  input.setSelectedTab(input.item.id);
  input.setOpenSideBar(true);
  input.resetFeatures();
  input.graphicsLayer?.removeAll();
  input.redGraphicsLayer?.removeAll();
  input.graphicsLayerHover?.removeAll();
}

const TOOL_TAB_ACTIONS: Partial<
  Record<ToolsTabsType, (input: HandleToolsTabClickInput) => void>
> = {
  startgebied: goToStartgebied,
  exporteer: (input) => input.setOpenExporter(true),
  uploaden: (input) => input.setOpenUploader(true),
  bevragen: (input) => input.setOpenBevragen(true),
};

export function handleToolsTabClick(input: HandleToolsTabClickInput) {
  if (input.item.disabled) return;

  const action = TOOL_TAB_ACTIONS[input.item.id] ?? openToolSideTab;
  action(input);

  if (input.item.id !== "bevragen") input.setOpenBevragen(false);
}
