import type { EnrichedPointType } from "Types";

type DeleteFn = (args: { id: number }) => Promise<unknown>;

export async function deletePointsCollectingIds(
  selectedPoints: EnrichedPointType[],
  deleteData: DeleteFn
): Promise<number[]> {
  const deletedIds: number[] = [];
  for (const point of selectedPoints) {
    try {
      await deleteData({ id: point.id });
      deletedIds.push(point.id);
    } catch (error) {
      console.error(`Error deleting point ${point.id}:`, error);
    }
  }
  return deletedIds;
}

export function clearDeletePointMapLayers(input: {
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined;
  mapView: __esri.MapView | null | undefined;
}) {
  input.yellowGraphicsLayer?.removeAll();
  input.graphicsLayer?.removeAll();
  input.graphicsLayerHover?.removeAll();
  input.mapView?.graphics.removeAll();
}
