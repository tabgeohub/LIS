import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import MapView from "@arcgis/core/views/MapView";
import { resetMapCursor } from "./drawingToolMapCleanup";

export type DrawingToolType = "line" | "polygon" | null;

export interface ResetSketchSessionOptions {
  sketchViewModel: SketchViewModel | null;
  mapView?: MapView | null;
  setSketchViewModel?: (value: SketchViewModel | null) => void;
  setSelectedTool?: (value: DrawingToolType) => void;
  /** Wrap cancel/destroy in try/catch when sketch may already be torn down */
  tolerant?: boolean;
}

function cancelAndDestroySketch(
  sketchViewModel: SketchViewModel,
  tolerant: boolean
) {
  if (tolerant) {
    try {
      sketchViewModel.cancel();
    } catch {
      // Ignore errors if already cancelled
    }
    try {
      sketchViewModel.destroy();
    } catch {
      // Ignore errors if already destroyed
    }
    return;
  }

  sketchViewModel.cancel();
  sketchViewModel.destroy();
}

/** Cancel + destroy sketch, reset cursor, and clear local tool state. */
export function resetSketchSession({
  sketchViewModel,
  mapView,
  setSketchViewModel,
  setSelectedTool,
  tolerant = false,
}: ResetSketchSessionOptions) {
  if (mapView) {
    resetMapCursor(mapView);
  }

  if (sketchViewModel) {
    cancelAndDestroySketch(sketchViewModel, tolerant);
    setSketchViewModel?.(null);
  }

  setSelectedTool?.(null);
}

/** Destroy-only sketch cleanup (e.g. when switching tools in Options). */
export function destroySketchViewModel(
  sketchViewModel: SketchViewModel | null,
  setSketchViewModel?: (value: SketchViewModel | null) => void,
  mapView?: MapView | null
) {
  if (mapView) {
    resetMapCursor(mapView);
  }

  if (!sketchViewModel) return;

  sketchViewModel.destroy();
  setSketchViewModel?.(null);
}
