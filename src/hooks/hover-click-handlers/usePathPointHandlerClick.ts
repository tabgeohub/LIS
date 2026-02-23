import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { getDistanceMeters } from "@helpers/getDistanceMeters";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePathPointState } from "@helpers/ZustandStates/pathPointState";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";

type PathPoint = {
  longitude: number;
  latitude: number;
  altitude?: number;
  speed?: number;
  rotationAngle?: number;
};

export default function usePathPointHandlerClick() {
  const { selectedPlan } = useFinishedPlansState();
  const { mapView, redGraphicsLayer } = useMapViewState();
  const { setSelectedPathPoint } = usePathPointState();

  if (!mapView || !redGraphicsLayer || !selectedPlan) return;

  const rawPath = (selectedPlan as any).path;
  let planPath: PathPoint[] = [];

  if (Array.isArray(rawPath)) {
    planPath = rawPath as PathPoint[];
  } else if (typeof rawPath === "string") {
    try {
      const parsed = JSON.parse(rawPath);
      if (Array.isArray(parsed)) planPath = parsed as PathPoint[];
    } catch {}
  }

  if (planPath.length === 0) return;

  const MAX_CLICK_DISTANCE_M = 20; // clicks farther than this from any point will clear the marker

  const handle = mapView.on("click", async (event) => {
    if (!redGraphicsLayer) return;

    mapView.map.reorder(redGraphicsLayer, mapView.map.layers.length - 1);

    const { mapPoint } = event;
    if (!mapPoint) return;

    let nearestPoint: PathPoint | null = null;
    let minDistance = Infinity;

    for (const p of planPath) {
      const dist = getDistanceMeters(
        p.latitude,
        p.longitude,
        Number(mapPoint.latitude),
        Number(mapPoint.longitude)
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearestPoint = p;
      }
    }

    // If the nearest point is still too far, clear selection and remove highlight
    if (!nearestPoint || minDistance > MAX_CLICK_DISTANCE_M) {
      setSelectedPathPoint(null);
      redGraphicsLayer.graphics.removeMany(
        redGraphicsLayer.graphics.filter(
          (g) => g.attributes?.title === "selected-path-point"
        )
      );
      return;
    }

    redGraphicsLayer.graphics.removeMany(
      redGraphicsLayer.graphics.filter(
        (g) => g.attributes?.title === "selected-path-point"
      )
    );

    setSelectedPathPoint({
      longitude: nearestPoint.longitude,
      latitude: nearestPoint.latitude,
      altitude: nearestPoint.altitude ?? 0,
      speed: nearestPoint.speed ?? 0,
      rotationAngle: nearestPoint.rotationAngle ?? 0,
      planId: String((selectedPlan as any).id ?? ""),
      vluchtnummer: (selectedPlan as any).vluchtnummer ?? "",
    });

    const highlight = new Graphic({
      geometry: new Point({
        longitude: nearestPoint.longitude,
        latitude: nearestPoint.latitude,
      }),
      symbol: new SimpleMarkerSymbol({
        color: "blue",
        outline: { color: "black", width: 0.5 },
        size: "8px",
      }),
      attributes: { title: "selected-path-point" },
    });

    redGraphicsLayer.add(highlight);
  });

  return () => handle.remove();
}
