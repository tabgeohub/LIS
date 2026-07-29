import type { EnrichedPointType } from "Types";
import {
  clearDeletePointMapLayers,
  deletePointsCollectingIds,
} from "./deletePointsHelpers";

type DeleteFn = (args: { id: number }) => Promise<unknown>;

export type MultiPointDeleteInput = {
  selectedPoints: EnrichedPointType[];
  deleteData: DeleteFn;
  points: EnrichedPointType[];
  setPoints: (points: EnrichedPointType[]) => void;
  setSelectedPoints: (points: EnrichedPointType[]) => void;
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined;
  mapView: __esri.MapView | null | undefined;
  setShowConfirmModal: (open: boolean) => void;
  logStep: (message: string, data?: Record<string, unknown>) => void;
};

export async function runMultiPointDelete(input: MultiPointDeleteInput) {
  const deletedIds = await deletePointsCollectingIds(
    input.selectedPoints,
    input.deleteData
  );
  if (deletedIds.length > 0) {
    input.setPoints(input.points.filter((p) => !deletedIds.includes(p.id)));
  }
  input.setSelectedPoints([]);
  clearDeletePointMapLayers(input);
  input.setShowConfirmModal(false);
  input.logStep("User clicked 'Delete' button to delete multiple points", {
    deletedPoints: input.selectedPoints
      .filter((p) => deletedIds.includes(p.id))
      .map((p) => p.omschrijving),
    count: deletedIds.length,
  });
}
