import { createPin } from "@helpers/ArcGISHelpers/createPin";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import { EnrichedPointType } from "Types";
import { SelectFromSourceItemPoint } from "./mapSourceItems";

export type PinRefMap = Map<
  number,
  { outerGraphic: __esri.Graphic; pinGraphic: __esri.Graphic }
>;

export function removeBlueGraphics(
  mapView: __esri.MapView | null | undefined,
  blueGraphicsRef: __esri.Graphic[]
) {
  if (!mapView || !blueGraphicsRef.length) return [];
  try {
    mapView.graphics.removeMany(blueGraphicsRef);
  } catch {
    /* ignore */
  }
  return [];
}

export function removeAllPins(
  mapView: __esri.MapView | null | undefined,
  pinRefs: PinRefMap
) {
  if (!mapView) return;
  pinRefs.forEach(({ outerGraphic, pinGraphic }) => {
    mapView.graphics.removeMany([outerGraphic, pinGraphic]);
  });
  pinRefs.clear();
}

function removeUnselectedPins(input: {
  mapView: __esri.MapView;
  pinRefs: PinRefMap;
  currentIds: Set<number>;
}) {
  input.pinRefs.forEach((value, key) => {
    if (input.currentIds.has(key)) return;
    input.mapView.graphics.removeMany([value.outerGraphic, value.pinGraphic]);
    input.pinRefs.delete(key);
  });
}

function addPinForSelectedPoint(input: {
  mapView: __esri.MapView;
  pt: SelectFromSourceItemPoint;
  dbPoints: EnrichedPointType[];
  pinRefs: PinRefMap;
  currentIds: Set<number>;
}) {
  const { mapView, pt, dbPoints, pinRefs, currentIds } = input;
  if (!currentIds.has(pt.id) || pinRefs.has(pt.id)) return;

  const fullPoint = dbPoints.find((dbPt) => dbPt.id === pt.id);
  if (!fullPoint) return;

  const coords = getPointCoordinates(fullPoint);
  if (!coords) return;

  const res = createPin({
    point: {
      id: fullPoint.id,
      longitude: coords.longitude,
      latitude: coords.latitude,
    } as EnrichedPointType,
    mapView,
    label: fullPoint.omschrijving,
  });
  pinRefs.set(fullPoint.id, res);
}

export function syncPinsForSelection(input: {
  mapView: __esri.MapView;
  selectedPointIds: number[];
  itemPoints: SelectFromSourceItemPoint[];
  dbPoints: EnrichedPointType[];
  pinRefs: PinRefMap;
}) {
  const { mapView, selectedPointIds, itemPoints, dbPoints, pinRefs } = input;
  const currentIds = new Set(selectedPointIds);

  removeUnselectedPins({ mapView, pinRefs, currentIds });
  itemPoints.forEach((pt) =>
    addPinForSelectedPoint({ mapView, pt, dbPoints, pinRefs, currentIds })
  );
}

function isHoverableGraphic(
  graphic: __esri.Graphic | undefined,
  pinRefs: PinRefMap,
  pointsGraphicsLayer: __esri.GraphicsLayer | null | undefined
): graphic is __esri.Graphic {
  if (!graphic?.attributes) return false;
  const id = graphic.attributes.id as number | undefined;
  const isPin = typeof id === "number" && pinRefs.has(id);
  const isBluePoint =
    !!pointsGraphicsLayer && graphic.layer === pointsGraphicsLayer;
  return isPin || isBluePoint;
}

export function findHoverableGraphic(input: {
  hitResults: unknown[];
  pinRefs: PinRefMap;
  pointsGraphicsLayer: __esri.GraphicsLayer | null | undefined;
}): __esri.Graphic | null {
  const { hitResults, pinRefs, pointsGraphicsLayer } = input;

  const match = (hitResults as { graphic?: __esri.Graphic }[]).find((r) =>
    isHoverableGraphic(r.graphic, pinRefs, pointsGraphicsLayer)
  );

  return match?.graphic ?? null;
}

export { createYellowPointGraphic } from "./createYellowPointGraphic";
export type { SubmitSelectedPointsInput } from "./submitSelectedPointsTypes";
export { buildSubmitSelectedPointsResult } from "./buildSubmitSelectedPointsResult";
