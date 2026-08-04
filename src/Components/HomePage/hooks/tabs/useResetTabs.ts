import { useMapViewState } from "hooks/zustand/ui";
import { useDeletePointState } from "Components/HomePageTools/AandachtspuntenVerwijderen/state/useDeletePointState";
import { useEnrichedPointState } from "Components/Voorbereiding/EnrichedAddPoint/state/useEnrichedPointState";

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
