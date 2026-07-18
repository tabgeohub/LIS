import Basemap from "@arcgis/core/Basemap";
import WMTSLayer from "@arcgis/core/layers/WMTSLayer";
import { BasemapsType } from "Types";

export type UsedPlace = "Map" | "Kaartlagen";

export const BASEMAP_OPTIONS: Array<{ id: BasemapsType; label: string }> = [
  { id: "topo-vector", label: "Topo Vector" },
  { id: "luchtfoto", label: "Luchtfoto" },
  { id: "open-topo", label: "Open Topo" },
];

export const BASEMAP_THUMBNAILS: Record<BasemapsType, string> = {
  "topo-vector": "/basemaps/topo-vector.png",
  luchtfoto: "/basemaps/luchtfoto.png",
  "open-topo": "/basemaps/open-topo.png",
};

export function createBasemapsCatalog() {
  const wmts = new Basemap({
    baseLayers: [
      new WMTSLayer({
        url: "https://api.ellipsis-drive.com/v3/ogc/wmts/28fb0f5f-e367-4265-b84b-1b8f1a8a6409?request=getCapabilities&requestedEpsg=28992",
      }),
    ],
    title: "Open Topo",
    id: "open-topo",
  });
  return {
    "topo-vector": "topo-vector" as const,
    luchtfoto: "hybrid" as const,
    "open-topo": wmts,
  };
}

export function shouldShowBasemapList(
  openCheck: boolean,
  usedPlace: UsedPlace
) {
  if (openCheck) return true;
  return usedPlace === "Map";
}
