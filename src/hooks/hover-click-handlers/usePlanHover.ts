import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { FlightPlanType } from "Types";

export default function usePlanHover() {
  const { graphicsLayerHover } = useMapViewState();

  function handleHover(plan: FlightPlanType) {
    if (!graphicsLayerHover) return;

    let points = plan?.points;

    if (!points) return;

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
      outline: { color: [227, 139, 79, 1], width: 2 },
    });

    const newPolygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
    });

    graphicsLayerHover.add(newPolygonGraphic);
  }

  function handleMouseLeave() {
    if (graphicsLayerHover) {
      graphicsLayerHover.removeAll();
    }
  }

  return {
    handleHover,
    handleMouseLeave,
  };
}
