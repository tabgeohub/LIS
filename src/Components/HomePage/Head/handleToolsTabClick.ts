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

export function handleToolsTabClick(input: HandleToolsTabClickInput) {
  if (input.item.disabled) return;

  if (input.item.id === "startgebied") goToStartgebied(input);
  else if (input.item.id === "exporteer") input.setOpenExporter(true);
  else if (input.item.id === "uploaden") input.setOpenUploader(true);
  else if (input.item.id === "bevragen") input.setOpenBevragen(true);
  else openToolSideTab(input);

  if (input.item.id !== "bevragen") input.setOpenBevragen(false);
}
