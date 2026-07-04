import MapView from "@arcgis/core/views/MapView";
import {
  createGeometryGraphic,
  GeometrySymbolOptions,
} from "@helpers/ArcGISHelpers/createGeometryGraphic";
import {
  ClickableGeometry,
  normalizeGeometryData,
} from "@helpers/ArcGISHelpers/createGeometryMapGraphics";

export type HoverableGeometry = ClickableGeometry;

export const GEOMETRY_HOVER_LABEL = "hovered-geometry";
export const GEOMETRY_EDIT_HIGHLIGHT_LABEL = "edit-geometry-highlight";

const YELLOW_GEOMETRY_SYMBOL: GeometrySymbolOptions = {
  fillColor: [0, 0, 0, 0],
  outlineColor: [255, 213, 0, 0.9],
  lineColor: [255, 213, 0, 0.9],
  outlineWidth: 3,
  lineWidth: 4,
};

export function removeGeometryGraphicsByLabel(mapView: MapView, label: string) {
  mapView.graphics
    .toArray()
    .filter((graphic) => graphic.attributes?.label === label)
    .forEach((graphic) => mapView.graphics.remove(graphic));
}

export function createGeometryHighlightGraphic(
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

export function buildGeometryHoverState(geometry: HoverableGeometry) {
  return {
    id: geometry.id,
    label:
      geometry.omschrijving ||
      geometry.geometry_omschrijving ||
      `Geometrie ${geometry.id}`,
    point: {
      ...geometry,
      type: "geometry",
      geometryType:
        (geometry.type || geometry.geometry_type) === "polygon"
          ? "polygon"
          : "line",
    },
  };
}

export function addGeometryHighlight(input: {
  mapView: MapView;
  geometry: HoverableGeometry;
  label: string;
}) {
  removeGeometryGraphicsByLabel(input.mapView, input.label);
  const graphic = createGeometryHighlightGraphic(input.geometry, input.label);
  if (graphic) {
    input.mapView.graphics.add(graphic);
  }
  return graphic;
}
