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

const LABEL_ATTRIBUTE_KEYS = [
  "omschrijving",
  "name",
  "label",
  "title",
] as const;

const UNKNOWN_LABEL_BY_TYPE: Record<string, string> = {
  polygon: "Onbekend veelhoek",
  polyline: "Onbekend lijn",
};

function firstTruthyAttribute(
  attributes: Record<string, unknown>,
  keys: readonly string[]
): unknown {
  for (const key of keys) {
    if (attributes[key]) return attributes[key];
  }
  return "";
}

export function resolveMapHoverLabel(input: {
  geometryType: string;
  attributes: Record<string, unknown>;
}) {
  const text = firstTruthyAttribute(input.attributes, LABEL_ATTRIBUTE_KEYS);
  if (text) return String(text);
  return UNKNOWN_LABEL_BY_TYPE[input.geometryType] ?? "Onbekend punt";
}

function firstAttribute(input: {
  attributes: Record<string, unknown>;
  keys: string[];
  fallback: number;
}): unknown {
  for (const key of input.keys) {
    if (input.attributes[key] != null) return input.attributes[key];
  }
  return input.fallback;
}

export function resolveMapHoverId(attributes: Record<string, unknown>) {
  return firstAttribute({
    attributes,
    keys: ["id", "geometryId", "objectid", "objectId", "OBJECTID"],
    fallback: Date.now(),
  });
}

export function createMapHoverGraphic(geometry: __esri.Geometry) {
  const type = geometry.type;
  let symbol: SimpleMarkerSymbol | SimpleFillSymbol | SimpleLineSymbol =
    POINT_HOVER_SYMBOL;

  if (type === "polygon") symbol = POLYGON_HOVER_SYMBOL;
  else if (type === "polyline") symbol = LINE_HOVER_SYMBOL;

  return new Graphic({ geometry, symbol });
}
