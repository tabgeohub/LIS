import useLogAction from "hooks/useLogAction";
import {
  applyEditPointMapClick,
  type EditPointMapClickInput,
} from "./applyEditPointMapClick";

export function registerEditPointMapClick(
  input: EditPointMapClickInput & {
    mapView: __esri.MapView;
    redGraphicsLayer: __esri.GraphicsLayer;
    logAction: ReturnType<typeof useLogAction>;
  }
) {
  const { mapView, redGraphicsLayer, coordinateSystem, logAction } = input;
  return mapView.on("click", (event) => {
    applyEditPointMapClick({
      event,
      mapView,
      redGraphicsLayer,
      coordinateSystem,
      setters: input,
      logAction,
    });
  });
}
