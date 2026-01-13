import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { FlightPlanType } from "Types";

export function usePlanClick() {
  const { graphicsLayer } = useMapViewState();

  function handleClick(
    plan: FlightPlanType,
    setSelectedPlan: (value: FlightPlanType | null) => void
  ) {
    if (!graphicsLayer) return;

    setSelectedPlan(plan);

    graphicsLayer.removeAll();

    const points = plan?.pointsObjects || plan?.points;
    if (!points || points.length === 0) return;

    const minLat = Math.min(...points.map((p) => p.latitude));
    const maxLat = Math.max(...points.map((p) => p.latitude));
    const minLon = Math.min(...points.map((p) => p.longitude));
    const maxLon = Math.max(...points.map((p) => p.longitude));

    const polygon = new Polygon({
      rings: [
        [
          [minLon, maxLat],
          [maxLon, maxLat],
          [maxLon, minLat],
          [minLon, minLat],
          [minLon, maxLat],
        ],
      ],
      spatialReference: { wkid: 4326 },
    });

    const fillSymbol = new SimpleFillSymbol({
      color: [227, 139, 79, 0],
      outline: { color: [0, 255, 0, 1], width: 2 },
    });

    const newPolygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
    });

    graphicsLayer.add(newPolygonGraphic);
  }

  return {
    handleClick,
  };
}
