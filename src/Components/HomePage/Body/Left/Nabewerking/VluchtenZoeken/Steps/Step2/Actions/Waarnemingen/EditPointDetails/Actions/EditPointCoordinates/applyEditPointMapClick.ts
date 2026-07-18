import { applyCoordsFromMapClick } from "./applyCoordsFromMapClick";
import type { ApplyEditPointMapClickInput } from "./editPointMapClickTypes";

export type { EditPointMapClickInput, ApplyEditPointMapClickInput } from "./editPointMapClickTypes";

export function applyEditPointMapClick(input: ApplyEditPointMapClickInput) {
  input.event.stopPropagation?.();
  if (!input.event.mapPoint?.longitude || !input.event.mapPoint?.latitude) {
    return;
  }
  applyCoordsFromMapClick(input);
}
