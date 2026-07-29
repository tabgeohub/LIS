import { toEditPointCoordinatesView } from "./toEditPointCoordinatesView";
import { useEditPointCoordinateActions } from "./useEditPointCoordinateActions";
import { useEditPointCoordinateStores } from "./useEditPointCoordinateStores";

export function useEditPointCoordinates(setAction: (value: string) => void) {
  const s = useEditPointCoordinateStores();
  const { loading, handleSubmit } = useEditPointCoordinateActions(
    setAction,
    s
  );
  return toEditPointCoordinatesView({
    selectedPoint: s.selectedPoint,
    loading,
    inputs: s.inputs,
    handleSubmit,
  });
}
