import type { EnrichedPointType } from "Types";

type ApplyDeletePointUpdateSuccessInput = {
  points: EnrichedPointType[];
  result: EnrichedPointType;
  setPoints: (points: EnrichedPointType[]) => void;
  mapView: __esri.MapView | null | undefined;
  redGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  yellowGraphicsLayer?: __esri.GraphicsLayer | null | undefined;
};

/** Shared post-update success path for delete-point edit Step1/Step2. */
export function applyDeletePointUpdateSuccess(
  input: ApplyDeletePointUpdateSuccessInput
): void {
  const updatedPoints = input.points.map((point) =>
    point.id === input.result.id ? { ...point, ...input.result } : point
  );

  input.setPoints(updatedPoints);
  input.mapView?.graphics.removeAll();
  input.redGraphicsLayer?.removeAll();
  input.yellowGraphicsLayer?.removeAll();
}
