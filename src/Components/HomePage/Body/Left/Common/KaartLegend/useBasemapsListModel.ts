import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { BasemapsType } from "Types";
import { useSelectedBasemapState } from "hooks/kaartlagen/useBasemapStore";
import {
  createBasemapsCatalog,
  shouldShowBasemapList,
  type UsedPlace,
} from "./basemapsListHelpers";
import { useMemo } from "react";

export type { UsedPlace } from "./basemapsListHelpers";
export {
  BASEMAP_OPTIONS,
  BASEMAP_THUMBNAILS,
} from "./basemapsListHelpers";

export function useBasemapsListModel(usedPlace: UsedPlace) {
  const state = useSelectedBasemapState();
  const { mapView } = useMapViewState();
  const basemaps = useMemo(() => createBasemapsCatalog(), []);

  const handleChangeBasemap = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.dataset.id as BasemapsType;
    if (!selected || !mapView?.map) return;
    state.setBasemap(selected);
    mapView.map.basemap = basemaps[selected];
    state.setSelectedBasemap(selected);
  };

  useEffect(() => {
    if (!mapView?.map) return;
    mapView.map.basemap?.baseLayers.forEach((lyr) => {
      lyr.visible = state.ondergrond;
    });
  }, [state.ondergrond, mapView, state.basemap]);

  return {
    usedPlace,
    ondergrond: state.ondergrond,
    setOndergrond: state.setOndergrond,
    basemap: state.basemap,
    openCheck: state.openCheck,
    setOpenCheck: state.setOpenCheck,
    handleChangeBasemap,
    showList: shouldShowBasemapList(state.openCheck, usedPlace),
  };
}
