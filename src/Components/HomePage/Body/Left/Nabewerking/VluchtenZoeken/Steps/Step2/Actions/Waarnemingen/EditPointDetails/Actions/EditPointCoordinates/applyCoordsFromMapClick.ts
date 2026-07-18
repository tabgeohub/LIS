import useLogAction from "hooks/useLogAction";
import { coordsFromMapClick } from "./coordinateFinalize";
import { showRedMarkerAt } from "./pointMapGraphics";
import type { EditPointMapClickInput } from "./editPointMapClickTypes";

export function applyCoordsFromMapClick(input: {
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
  const { event, mapView, redGraphicsLayer, coordinateSystem, setters } =
    input;
  const next = coordsFromMapClick({
    coordinateSystem,
    clickedLon: event.mapPoint!.longitude!,
    clickedLat: event.mapPoint!.latitude!,
  });
  setters.setLongitude(next.longitude);
  setters.setLatitude(next.latitude);
  setters.setXCoordinaat_rd(next.xcoordinaat_rd);
  setters.setYCoordinaat_rd(next.ycoordinaat_rd);
  showRedMarkerAt({
    redGraphicsLayer,
    mapView,
    longitude: next.longitude,
    latitude: next.latitude,
  });
  input.logAction({
    message: "User clicked on map to update point coordinates",
    step: "Second step - Edit point coordinates",
    newData: { longitude: next.longitude, latitude: next.latitude },
  });
}
