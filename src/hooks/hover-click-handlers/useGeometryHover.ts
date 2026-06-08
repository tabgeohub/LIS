import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import MapView from "@arcgis/core/views/MapView";
import {
  createGeometryGraphic,
  GeometrySymbolOptions,
} from "@helpers/ArcGISHelpers/createGeometryGraphic";
import {
  ClickableGeometry,
  normalizeGeometryData,
} from "@helpers/ArcGISHelpers/createGeometryMapGraphics";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";

type HoverableGeometry = ClickableGeometry;

const HOVER_LABEL = "hovered-geometry";
const EDIT_HIGHLIGHT_LABEL = "edit-geometry-highlight";

const YELLOW_GEOMETRY_SYMBOL: GeometrySymbolOptions = {
  fillColor: [0, 0, 0, 0],
  outlineColor: [255, 213, 0, 0.9],
  lineColor: [255, 213, 0, 0.9],
  outlineWidth: 3,
  lineWidth: 4,
};

function removeGraphicsByLabel(mapView: MapView, label: string) {
  mapView.graphics
    .toArray()
    .filter((graphic) => graphic.attributes?.label === label)
    .forEach((graphic) => mapView.graphics.remove(graphic));
}

function createYellowHighlightGraphic(
  geometry: HoverableGeometry,
  label: string
) {
  if (!geometry.points || geometry.points.length === 0) return null;

  return createGeometryGraphic(normalizeGeometryData(geometry), {
    symbolOptions: YELLOW_GEOMETRY_SYMBOL,
    attributes: {
      label,
      geometryId: geometry.id,
    },
  });
}

/**
 * Hook for geometry hover (similar to usePointHover)
 * Handles hover effects for geometries on the map
 */
export default function useGeometryHover() {
  const { mapView } = useMapViewState();
  const setHovered = useHoveredGraphicState.getState().setHovered;

  function handleHoveredGeometry(geometry: HoverableGeometry | null | undefined) {
    if (!validateMapView(mapView) || !geometry) return;

    removeGraphicsByLabel(mapView!, HOVER_LABEL);

    const hoverGraphic = createYellowHighlightGraphic(geometry, HOVER_LABEL);

    if (hoverGraphic) {
      mapView!.graphics.add(hoverGraphic);
      setHovered({
        id: geometry.id,
        label: geometry.omschrijving || geometry.geometry_omschrijving || `Geometrie ${geometry.id}`,
        point: {
          ...geometry,
          type: "geometry",
          geometryType:
            (geometry.type || geometry.geometry_type) === "polygon" ? "polygon" : "line",
        },
      });
    }
  }

  function handleRemoveHoveredGeometry() {
    if (!validateMapView(mapView)) return;

    removeGraphicsByLabel(mapView!, HOVER_LABEL);

    setHovered(null);
  }

  /** Yellow outline for the geometry currently open in the edit form (not list hover). */
  function addEditGeometryHighlight(geometry: HoverableGeometry | null | undefined) {
    if (!validateMapView(mapView) || !geometry) return;

    removeGraphicsByLabel(mapView!, EDIT_HIGHLIGHT_LABEL);

    const graphic = createYellowHighlightGraphic(geometry, EDIT_HIGHLIGHT_LABEL);
    if (graphic) {
      mapView!.graphics.add(graphic);
    }
  }

  function removeEditGeometryHighlight() {
    if (!validateMapView(mapView)) return;

    removeGraphicsByLabel(mapView!, EDIT_HIGHLIGHT_LABEL);
  }

  return {
    handleHoveredGeometry,
    handleRemoveHoveredGeometry,
    addEditGeometryHighlight,
    removeEditGeometryHighlight,
  };
}

