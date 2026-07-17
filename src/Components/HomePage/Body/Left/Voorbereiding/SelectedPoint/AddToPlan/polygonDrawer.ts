import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import Polygon from "@arcgis/core/geometry/Polygon";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Point from "@arcgis/core/geometry/Point";
import * as projection from "@arcgis/core/geometry/projection";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import { EnrichedPointType } from "Types";

export function isPointInPolygon(point: __esri.Point, ring: number[][]): boolean {
  const x = point.x;
  const y = point.y;

  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;

  for (const [px, py] of ring) {
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
  }

  if (x < minX || x > maxX || y < minY || y > maxY) {
    return false;
  }

  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0],
      yi = ring[i][1];
    const xj = ring[j][0],
      yj = ring[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

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
  const map = input.mapView.map;

  try {
    if (!projection.isLoaded()) {
      await projection.load();
    }
  } catch (error) {
    console.error("Failed to load projection module:", error);
    return;
  }

  input.cleanupSketch();

  const graphicsLayer = new GraphicsLayer({ listMode: "hide" });
  input.graphicsLayerRef.current = graphicsLayer;
  map.add(graphicsLayer);

  const sketchViewModel = new SketchViewModel({
    view: input.mapView,
    layer: graphicsLayer,
    defaultCreateOptions: { mode: "click" },
  });

  input.sketchRef.current = sketchViewModel;

  input.createHandleRef.current = sketchViewModel.on("create", (event) => {
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

  sketchViewModel.create("polygon");
}
