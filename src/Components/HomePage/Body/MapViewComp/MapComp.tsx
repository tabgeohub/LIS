/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect } from "react";
import { useAuth } from "hooks/zustand/ui/useAuth";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useMapInitialization } from "hooks/map/useMapInitialization";
import { useRenderPoints } from "hooks/features/useRenderPoints";
import { useRenderGeometries } from "hooks/features/useRenderGeometries";
import BasemapWidget from "./BasemapWidget";
import { resolveUserRegionGoTo } from "./mapRegionGoTo";
import { useMapHoverHighlight } from "./useMapHoverHighlight";

export default function MapComp({
  mapDiv,
}: {
  mapDiv: RefObject<HTMLDivElement>;
}) {
  const { user } = useAuth();
  const { map, mapView } = useMapViewState();

  useMapInitialization(mapDiv);
  useRenderPoints();
  useRenderGeometries();
  useMapHoverHighlight();

  useEffect(() => {
    if (user.user_id !== 0) return;
    map?.removeAll();
  }, [user.user_id]);

  useEffect(() => {
    if (user.user_id === 0 || !mapView) return;

    const timer = window.setTimeout(() => {
      mapView.goTo(resolveUserRegionGoTo(user.role));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [user.user_id, user.role, mapView]);

  return (
    <div className="mapView h-full w-full" ref={mapDiv}>
      <BasemapWidget />
    </div>
  );
}
