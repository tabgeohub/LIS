import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { FinishedGeometryType } from "Types/finished_plans";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";

export function useGeometryHandlers() {
  const { mapView } = useMapViewState();

  function handleHoveredGeometry(geometry: FinishedGeometryType) {
    if (!mapView || !geometry) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes?.label === "hovered-geometry")
      .forEach((graphic) => mapView.graphics.remove(graphic));

    if (!geometry.points || geometry.points.length === 0) return;

    const coordinates = geometry.points.map((point) => [
      point.longitude,
      point.latitude,
    ]);

    let hoverGraphic: Graphic | null = null;

    if (geometry.geometry_type === "polygon") {
      const ring = [...coordinates];
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        ring.push([first[0], first[1]]);
      }

      const polygon = new Polygon({
        rings: [ring],
        spatialReference: { wkid: 4326 },
      });

      const hoverSymbol = new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: {
          color: [255, 213, 0, 0.9],
          width: 3,
        },
      });

      hoverGraphic = new Graphic({
        geometry: polygon,
        symbol: hoverSymbol,
        attributes: {
          label: "hovered-geometry",
          geometryId: geometry.id,
        },
      });
    } else if (geometry.geometry_type === "line") {
      const polyline = new Polyline({
        paths: [coordinates],
        spatialReference: { wkid: 4326 },
      });

      const hoverSymbol = new SimpleLineSymbol({
        color: [255, 213, 0, 0.9],
        width: 4,
      });

      hoverGraphic = new Graphic({
        geometry: polyline,
        symbol: hoverSymbol,
        attributes: {
          label: "hovered-geometry",
          geometryId: geometry.id,
        },
      });
    }

    if (hoverGraphic) {
      mapView.graphics.add(hoverGraphic);
    }
  }

  function handleRemoveHoveredGeometry() {
    if (!mapView) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes?.label === "hovered-geometry")
      .forEach((graphic) => mapView.graphics.remove(graphic));
  }

  return {
    handleHoveredGeometry,
    handleRemoveHoveredGeometry,
  };
}



