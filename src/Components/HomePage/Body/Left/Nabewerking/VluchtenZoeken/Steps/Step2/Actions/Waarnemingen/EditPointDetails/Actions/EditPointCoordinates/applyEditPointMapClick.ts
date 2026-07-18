import useLogAction from "hooks/useLogAction";
import { applyCoordsFromMapClick } from "./applyCoordsFromMapClick";
import type { EditPointMapClickInput } from "./editPointMapClickTypes";

export type { EditPointMapClickInput } from "./editPointMapClickTypes";

export function applyEditPointMapClick(input: {
  event: __esri.ViewClickEvent;
  mapView: __esri.MapView;
  redGraphicsLayer: __esri.GraphicsLayer;
  coordinateSystem: string;
  setters: Pick<
    EditPointMapClickInput,
    | "setLongitude"
    | "setLatitude"
    | "setXCoordinaat_rd"
    | "setYCoordinaat_rd"
  >;
  logAction: ReturnType<typeof useLogAction>;
}) {
  input.event.stopPropagation?.();
  if (!input.event.mapPoint?.longitude || !input.event.mapPoint?.latitude) {
    return;
  }
  applyCoordsFromMapClick(input);
}
