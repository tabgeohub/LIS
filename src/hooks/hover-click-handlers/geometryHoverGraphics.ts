import type { HoverableGeometry } from "./geometryHighlightGraphic";
import {
  addGeometryHighlight,
  createGeometryHighlightGraphic,
  GEOMETRY_EDIT_HIGHLIGHT_LABEL,
  GEOMETRY_HOVER_LABEL,
  removeGeometryGraphicsByLabel,
} from "./geometryHighlightGraphic";

export type { HoverableGeometry };

export {
  addGeometryHighlight,
  createGeometryHighlightGraphic,
  GEOMETRY_EDIT_HIGHLIGHT_LABEL,
  GEOMETRY_HOVER_LABEL,
  removeGeometryGraphicsByLabel,
};

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
