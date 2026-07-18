import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

const POINT_HOVER_SYMBOL = new SimpleMarkerSymbol({
  style: "circle",
  color: [255, 213, 0, 0.9],
  size: 12,
  outline: { color: [255, 255, 255, 1], width: 1.5 },
});

const POLYGON_HOVER_SYMBOL = new SimpleFillSymbol({
  color: [0, 0, 0, 0],
  outline: { color: [255, 213, 0, 0.9], width: 3 },
});

const LINE_HOVER_SYMBOL = new SimpleLineSymbol({
  color: [255, 213, 0, 0.9],
  width: 4,
});

const HOVER_GEOMETRY_TYPES = new Set(["point", "polygon", "polyline"]);

export function isMapHoverGraphicHit(
  result: __esri.MapViewViewHit
): result is __esri.MapViewGraphicHit {
  if (result.type !== "graphic" || !result.graphic?.geometry) return false;
  return HOVER_GEOMETRY_TYPES.has(result.graphic.geometry.type);
}

export function resolveMapHoverLabel(input: {
  geometryType: string;
  attributes: Record<string, unknown>;
}) {
  const attrs = input.attributes;
  const text =
    attrs.omschrijving ||
    attrs.name ||
    attrs.label ||
    attrs.title ||
    "";

  if (text) return String(text);

  if (input.geometryType === "polygon") return "Onbekend veelhoek";
  if (input.geometryType === "polyline") return "Onbekend lijn";
  return "Onbekend punt";
}

function firstAttribute(
  attributes: Record<string, unknown>,
  keys: string[],
  fallback: number
): unknown {
  for (const key of keys) {
    if (attributes[key] != null) return attributes[key];
  }
  return fallback;
}

export function resolveMapHoverId(attributes: Record<string, unknown>) {
  return firstAttribute(
    attributes,
    ["id", "geometryId", "objectid", "objectId", "OBJECTID"],
    Date.now()
  );
}

export function createMapHoverGraphic(geometry: __esri.Geometry) {
  const type = geometry.type;
  let symbol: SimpleMarkerSymbol | SimpleFillSymbol | SimpleLineSymbol =
    POINT_HOVER_SYMBOL;

  if (type === "polygon") symbol = POLYGON_HOVER_SYMBOL;
  else if (type === "polyline") symbol = LINE_HOVER_SYMBOL;

  return new Graphic({ geometry, symbol });
}
