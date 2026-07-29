import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useOpenTable } from "hooks/zustand/ui/showTable";
import useLogAction from "hooks/useLogAction";
import { runPointListBuffer } from "./runPointListBuffer";

export function usePointListBufferActions(input: {
  distance: number;
  unit: "kilometers" | "meters";
  setFase: (value: string) => void;
}) {
  const logAction = useLogAction();
  const { mapView, graphicsLayer } = useMapViewState();
  const { pointsTable } = useOpenTable();

  return {
    onClear: () => graphicsLayer?.removeAll(),
    onCancel: () => input.setFase("list"),
    onBuffer: () =>
      runPointListBuffer({
        graphicsLayer,
        pointsTable,
        distance: input.distance,
        unit: input.unit,
        spatialReference: mapView?.spatialReference,
        setFase: input.setFase,
        logAction,
      }),
  };
}
