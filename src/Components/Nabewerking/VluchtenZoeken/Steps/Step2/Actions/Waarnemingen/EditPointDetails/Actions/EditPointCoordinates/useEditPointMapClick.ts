import { useEffect, useRef } from "react";
import useLogAction from "hooks/useLogAction";
import type { EditPointMapClickInput } from "./applyEditPointMapClick";
import { registerEditPointMapClick } from "./registerEditPointMapClick";

export function useEditPointMapClick(input: EditPointMapClickInput) {
  const logAction = useLogAction();
  const clickHandleRef = useRef<__esri.Handle | null>(null);

  useEffect(() => {
    if (!input.mapView || !input.redGraphicsLayer) return;
    const clickHandle = registerEditPointMapClick({
      ...input,
      mapView: input.mapView,
      redGraphicsLayer: input.redGraphicsLayer,
      logAction,
    });
    clickHandleRef.current = clickHandle;
    return () => clickHandle.remove();
  }, [
    input.mapView,
    input.redGraphicsLayer,
    input.coordinateSystem,
    input.setLongitude,
    input.setLatitude,
    input.setXCoordinaat_rd,
    input.setYCoordinaat_rd,
    logAction,
  ]);

  return clickHandleRef;
}
