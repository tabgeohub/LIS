import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import Polygon from "@arcgis/core/geometry/Polygon";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Point from "@arcgis/core/geometry/Point";
import * as projection from "@arcgis/core/geometry/projection";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import { EnrichedPointType } from "Types";
import { isPointInPolygon } from "./isPointInPolygon";

export { isPointInPolygon } from "./isPointInPolygon";

export function selectPointsInPolygonRing(
  points: EnrichedPointType[],
  ring: number[][]
): EnrichedPointType[] {
  const selected: EnrichedPointType[] = [];

  points.forEach((point) => {
    if (
      typeof point.longitude !== "number" ||
      typeof point.latitude !== "number"
    ) {
      return;
    }

    const pt = new Point({
      longitude: point.longitude,
      latitude: point.latitude,
    });

    if (isPointInPolygon(pt as __esri.Point, ring)) {
      selected.push(point);
    }
  });

  return selected;
}

async function ensureProjectionLoaded(): Promise<boolean> {
  try {
    if (!projection.isLoaded()) {
      await projection.load();
    }
    return true;
  } catch (error) {
    console.error("Failed to load projection module:", error);
    return false;
  }
}

export function attachPolygonCreateHandler(input: {
  sketchViewModel: SketchViewModel;
  points: EnrichedPointType[];
  setPolygonPoints: (points: EnrichedPointType[]) => void;
}): __esri.Handle {
  return input.sketchViewModel.on("create", (event) => {
    if (event.state !== "complete") return;
    const polygon = event.graphic.geometry as __esri.Polygon;
    if (!polygon) return;

    const projectedPolygon = projection.project(
      polygon,
      new SpatialReference({ wkid: 4326 })
    ) as Polygon;
    const ring = projectedPolygon?.rings?.[0];
    if (!ring) return;

    input.setPolygonPoints(selectPointsInPolygonRing(input.points, ring));
  });
}

export async function startPolygonDrawer(input: {
  mapView: __esri.MapView;
  cleanupSketch: () => void;
  sketchRef: { current: SketchViewModel | null };
  graphicsLayerRef: { current: GraphicsLayer | null };
  createHandleRef: { current: __esri.Handle | null };
  points: EnrichedPointType[];
  setPolygonPoints: (points: EnrichedPointType[]) => void;
}): Promise<void> {
  if (!input.mapView.map) return;
  if (!(await ensureProjectionLoaded())) return;

  input.cleanupSketch();
  const graphicsLayer = new GraphicsLayer({ listMode: "hide" });
  input.graphicsLayerRef.current = graphicsLayer;
  input.mapView.map.add(graphicsLayer);

  const sketchViewModel = new SketchViewModel({
    view: input.mapView,
    layer: graphicsLayer,
    defaultCreateOptions: { mode: "click" },
  });
  input.sketchRef.current = sketchViewModel;
  input.createHandleRef.current = attachPolygonCreateHandler({
    sketchViewModel,
    points: input.points,
    setPolygonPoints: input.setPolygonPoints,
  });
  sketchViewModel.create("polygon");
}
