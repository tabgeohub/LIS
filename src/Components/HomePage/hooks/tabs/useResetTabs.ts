import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useDeletePointState } from "Components/HomePage/hooks/zustand/tools/useDeletePointState";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";

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
