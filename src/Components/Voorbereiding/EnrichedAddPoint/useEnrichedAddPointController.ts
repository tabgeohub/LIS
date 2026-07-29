import { useMapViewState } from "hooks/zustand/ui";
import { useTabState } from "hooks/zustand/ui";
import { useEnrichedAddPointMapWiring } from "./useEnrichedAddPointMapWiring";

export function useEnrichedAddPointController() {
  const { redGraphicsLayer } = useMapViewState();
  const { setSelectedTab } = useTabState();
  const state = useEnrichedAddPointMapWiring();

  return {
    step: state.step,
    handleCancel: () => {
      redGraphicsLayer?.removeAll();
      setSelectedTab("none");
      state.reset();
    },
  };
}
