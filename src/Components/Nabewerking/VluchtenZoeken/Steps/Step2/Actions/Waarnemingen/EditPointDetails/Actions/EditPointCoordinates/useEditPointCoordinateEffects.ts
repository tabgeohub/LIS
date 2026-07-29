import {
  useEditPointCleanup,
  useEditPointMapClick,
  useEditPointPreviewGraphics,
} from "./useEditPointMapEffects";
import { useInitialEditPointMarker } from "./useEditPointCoordinateInputs";
import {
  toEditPointCleanupInput,
  toEditPointMapClickInput,
  toEditPointPreviewGraphicsInput,
  toInitialEditPointMarkerInput,
} from "./editPointCoordinateEffectInputs";
import type { EditPointCoordinateEffectsInput } from "./editPointCoordinateEffectsTypes";

export type { EditPointCoordinateEffectsInput } from "./editPointCoordinateEffectsTypes";

export function useEditPointCoordinateEffects(
  input: EditPointCoordinateEffectsInput
) {
  useInitialEditPointMarker(toInitialEditPointMarkerInput(input));
  const clickHandleRef = useEditPointMapClick(toEditPointMapClickInput(input));
  useEditPointPreviewGraphics(toEditPointPreviewGraphicsInput(input));
  useEditPointCleanup({
    ...toEditPointCleanupInput(input),
    clickHandleRef,
  });
}
