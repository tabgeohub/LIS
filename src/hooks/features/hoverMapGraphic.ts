type HoveredGraphic = {
  id: number;
  label: string;
} | null;

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
    if (!graphic?.attributes) continue;

    if (input.pinRefs) {
      const id = graphic.attributes.id;
      if (typeof id === "number" && input.pinRefs.current.has(id)) {
        return graphic;
      }
    }

    const isBluePoint =
      !!input.pointsGraphicsLayer &&
      graphic.layer === input.pointsGraphicsLayer;
    const isBlueGeometry =
      !!input.geometriesGraphicsLayer &&
      graphic.layer === input.geometriesGraphicsLayer;

    if (isBluePoint || isBlueGeometry) return graphic;
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
