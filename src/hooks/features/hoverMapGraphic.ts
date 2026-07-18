type HoveredGraphic = {
  id: number;
  label: string;
} | null;

function matchesPinGraphic(
  graphic: __esri.Graphic,
  pinRefs?: React.MutableRefObject<
    Map<number, { outerGraphic: __esri.Graphic; pinGraphic: __esri.Graphic }>
  >
): boolean {
  if (!pinRefs) return false;
  const id = graphic.attributes.id;
  return typeof id === "number" && pinRefs.current.has(id);
}

function matchesGraphicsLayer(
  graphic: __esri.Graphic,
  layer?: __esri.GraphicsLayer | null
): boolean {
  return !!layer && graphic.layer === layer;
}

export function isHoverableMapGraphic(
  graphic: __esri.Graphic,
  input: {
    pointsGraphicsLayer?: __esri.GraphicsLayer | null;
    geometriesGraphicsLayer?: __esri.GraphicsLayer | null;
    pinRefs?: React.MutableRefObject<
      Map<number, { outerGraphic: __esri.Graphic; pinGraphic: __esri.Graphic }>
    >;
  }
): boolean {
  if (!graphic?.attributes) return false;
  if (matchesPinGraphic(graphic, input.pinRefs)) return true;

  return (
    matchesGraphicsLayer(graphic, input.pointsGraphicsLayer) ||
    matchesGraphicsLayer(graphic, input.geometriesGraphicsLayer)
  );
}

export function findHoveredMapGraphic(input: {
  results: __esri.MapViewViewHit[];
  pointsGraphicsLayer?: __esri.GraphicsLayer | null;
  geometriesGraphicsLayer?: __esri.GraphicsLayer | null;
  pinRefs?: React.MutableRefObject<
    Map<number, { outerGraphic: __esri.Graphic; pinGraphic: __esri.Graphic }>
  >;
}): __esri.Graphic | null {
  for (const result of input.results) {
    if (result.type !== "graphic") continue;
    const graphic = result.graphic;
    if (isHoverableMapGraphic(graphic, input)) return graphic;
  }

  return null;
}

export function toHoveredState(graphic: __esri.Graphic): HoveredGraphic {
  const id = graphic.attributes.id || graphic.attributes.geometryId;
  if (id == null) return null;

  return {
    id,
    label: graphic.attributes.omschrijving || "",
  };
}
