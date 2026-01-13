import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useDeletePointState } from "./zustand/tools/useDeletePointState";
import { useEnrichedPointState } from "./zustand/useEnrichedPointState";

export default function useResetTabs() {
  const { reset } = useEnrichedPointState();
  const { clear } = useDeletePointState();

  const { redGraphicsLayer, yellowGraphicsLayer } = useMapViewState();

  return () => {
    reset();
    clear();

    redGraphicsLayer?.removeAll();
    yellowGraphicsLayer?.removeAll();
  };
}
