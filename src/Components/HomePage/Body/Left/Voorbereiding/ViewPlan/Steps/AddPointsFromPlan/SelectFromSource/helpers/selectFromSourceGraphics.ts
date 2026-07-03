import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { createPin } from "@helpers/ArcGISHelpers/createPin";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import { EnrichedPointType, FlightPlanType } from "Types";
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

export function syncPinsForSelection(input: {
  mapView: __esri.MapView;
  selectedPointIds: number[];
  itemPoints: SelectFromSourceItemPoint[];
  dbPoints: EnrichedPointType[];
  pinRefs: PinRefMap;
}) {
  const { mapView, selectedPointIds, itemPoints, dbPoints, pinRefs } = input;
  const currentIds = new Set(selectedPointIds);

  pinRefs.forEach((value, key) => {
    if (currentIds.has(key)) return;
    mapView.graphics.removeMany([value.outerGraphic, value.pinGraphic]);
    pinRefs.delete(key);
  });

  itemPoints.forEach((pt) => {
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
  });
}

export function findHoverableGraphic(input: {
  hitResults: unknown[];
  pinRefs: PinRefMap;
  pointsGraphicsLayer: __esri.GraphicsLayer | null | undefined;
}): __esri.Graphic | null {
  const { hitResults, pinRefs, pointsGraphicsLayer } = input;

  const match = (hitResults as { graphic?: __esri.Graphic }[]).find((r) => {
    const gr = r.graphic;
    if (!gr?.attributes) return false;
    const id = gr.attributes.id as number | undefined;
    const isPin = typeof id === "number" && pinRefs.has(id);
    const isBluePoint = !!pointsGraphicsLayer && gr.layer === pointsGraphicsLayer;
    return isPin || isBluePoint;
  });

  return match?.graphic ?? null;
}

export function createYellowPointGraphic(point: SelectFromSourceItemPoint) {
  const coords = getPointCoordinates(point as EnrichedPointType);
  if (!coords) return null;

  const yellow = new SimpleMarkerSymbol({
    color: "yellow",
    size: 12,
    style: "circle",
    outline: { color: "white", width: 1 },
  });

  return new Graphic({
    geometry: new Point({
      longitude: coords.longitude,
      latitude: coords.latitude,
      spatialReference: { wkid: 4326 },
    }),
    symbol: yellow,
    attributes: point,
  });
}

export type SubmitSelectedPointsInput = {
  selectedPlan: FlightPlanType;
  checkedPoints: SelectFromSourceItemPoint[];
  dbPoints: EnrichedPointType[];
  filteredPlans: FlightPlanType[];
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
};

export function buildSubmitSelectedPointsResult(input: SubmitSelectedPointsInput) {
  const {
    selectedPlan,
    checkedPoints,
    dbPoints,
    filteredPlans,
    yellowGraphicsLayer,
  } = input;

  const mergedIds = [
    ...selectedPlan.points.map((p) => p.id),
    ...checkedPoints.map((p) => p.id),
  ];
  const uniqueIds = Array.from(new Set(mergedIds));
  const updatedPoints = dbPoints.filter((p) => uniqueIds.includes(p.id));

  const updatedPlan: FlightPlanType = {
    ...selectedPlan,
    points: updatedPoints,
    pointsObjects: updatedPoints,
  };

  const updatedFilteredPlans = filteredPlans.map((p) =>
    p.id === selectedPlan.id
      ? { ...p, points: updatedPoints, pointsObjects: updatedPoints }
      : p
  );

  const yellowGraphics = checkedPoints
    .map(createYellowPointGraphic)
    .filter((g): g is Graphic => g !== null);

  yellowGraphics.forEach((graphic) => yellowGraphicsLayer?.add(graphic));

  return {
    payload: { points: uniqueIds, id: selectedPlan.id },
    updatedPlan,
    updatedPoints,
    updatedFilteredPlans,
  };
}
