import { useEffect } from "react";
import { TbLine, TbPolygon } from "react-icons/tb";
import { FinishedGeometryType } from "Types/finished_plans";
import useLogAction from "hooks/useLogAction";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";

// Hook for geometry hover (similar to usePointHover)
function useGeometryHover() {
  const { mapView } = useMapViewState();
  const setHovered = useHoveredGraphicState.getState().setHovered;

  function handleHoveredGeometry(geometry: FinishedGeometryType | null | undefined) {
    if (!mapView || !geometry) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes?.label === "hovered-geometry")
      .forEach((graphic) => mapView.graphics.remove(graphic));

    // Create hover graphic for geometry
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
        color: [0, 0, 0, 0], // Transparent fill
        outline: {
          color: [255, 213, 0, 0.9], // Yellow outline
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
        color: [255, 213, 0, 0.9], // Yellow
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
      setHovered({
        id: geometry.id,
        label: geometry.geometry_omschrijving || `Geometrie ${geometry.id}`,
        point: {
          ...geometry,
          type: "geometry",
          geometryType: geometry.geometry_type === "polygon" ? "polygon" : "line",
        },
      });
    }
  }

  function handleRemoveHoveredGeometry() {
    if (!mapView) return;

    const graphicsArray = mapView.graphics.toArray();

    graphicsArray
      .filter((graphic) => graphic.attributes?.label === "hovered-geometry")
      .forEach((graphic) => mapView.graphics.remove(graphic));

    setHovered(null);
  }

  return {
    handleHoveredGeometry,
    handleRemoveHoveredGeometry,
  };
}

// Hook for geometry click (similar to usePointClick)
function useGeometryClick(selectedGeometry: FinishedGeometryType | null) {
  const { mapView, yellowGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!mapView || !yellowGraphicsLayer || !selectedGeometry) return;

    yellowGraphicsLayer.removeAll();

    if (!selectedGeometry.points || selectedGeometry.points.length === 0) return;

    const coordinates = selectedGeometry.points.map((point) => [
      point.longitude,
      point.latitude,
    ]);

    let graphic: Graphic | null = null;

    if (selectedGeometry.geometry_type === "polygon") {
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

      const yellowSymbol = new SimpleFillSymbol({
        color: [0, 0, 0, 0], // Transparent fill
        outline: {
          color: [255, 255, 0, 1], // Yellow outline
          width: 3,
        },
      });

      graphic = new Graphic({
        geometry: polygon,
        symbol: yellowSymbol,
        attributes: selectedGeometry,
      });
    } else if (selectedGeometry.geometry_type === "line") {
      const polyline = new Polyline({
        paths: [coordinates],
        spatialReference: { wkid: 4326 },
      });

      const yellowSymbol = new SimpleLineSymbol({
        color: [255, 255, 0, 1], // Yellow
        width: 4,
      });

      graphic = new Graphic({
        geometry: polyline,
        symbol: yellowSymbol,
        attributes: selectedGeometry,
      });
    }

    if (graphic) {
      yellowGraphicsLayer.add(graphic);
    }

    return () => {
      yellowGraphicsLayer.removeAll();
    };
  }, [selectedGeometry, mapView, yellowGraphicsLayer]);
}

export default function SingleGeometry({
  geometry,
  selectedGeometry,
  setSelectedGeometry,
}: {
  geometry: FinishedGeometryType;
  selectedGeometry: FinishedGeometryType | null;
  setSelectedGeometry: (value: FinishedGeometryType) => void;
}) {
  const { handleHoveredGeometry, handleRemoveHoveredGeometry } = useGeometryHover();
  // @ts-ignore
  useGeometryClick(selectedGeometry);

  const logAction = useLogAction();

  const geometryTypeLabel =
    geometry.geometry_type === "polygon" ? "Veelhoek" : "Lijn";

  return (
    <div
      onMouseEnter={() => {
        handleHoveredGeometry(geometry);
      }}
      onMouseLeave={handleRemoveHoveredGeometry}
      className={`p-1.5 relative ${selectedGeometry?.id === geometry.id ? "bg-gray-100" : "hover:bg-gray-50"
        } transition-all cursor-pointer`}
      onClick={() => {
        setSelectedGeometry(geometry);

        logAction({
          message: `User clicked on geometry ${geometry.geometry_omschrijving}`,
          step: "Second step - Edit point",
        });
      }}
    >
      <div className="flex items-center gap-x-2">
        {geometry.geometry_type === "polygon" ? (
          <TbPolygon className="size-6 text-yellow-500" />
        ) : (
          <TbLine className="size-6 text-green-500" />
        )}
        <p className="text-[12px]">
          {geometry.geometry_omschrijving || `Geometrie ${geometry.id}`}
        </p>
      </div>

      <div className="text-[10px] text-gray-500 mt-2">
        <p>Type: {geometryTypeLabel}</p>
        <p>Aantal punten: {geometry.points?.length || 0}</p>


        <p>Organisatie: {geometry.points.at(0)?.organisatie_id}</p>
        <p>Specifiek letten op: {geometry.points.at(0)?.specifiek_letten_op}</p>
        <p>Activiteit: {geometry.points.at(0)?.activiteit_id}</p>
      </div>
    </div>
  );
}

