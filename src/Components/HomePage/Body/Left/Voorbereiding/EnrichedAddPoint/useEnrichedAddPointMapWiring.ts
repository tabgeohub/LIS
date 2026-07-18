import { useEnrichedPointState } from "../../../../../../hooks/zustand/useEnrichedPointState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useContent } from "hooks/useContent";
import { useEnrichedAddPointMapClick } from "./useEnrichedAddPointMapClick";

export function useEnrichedAddPointMapWiring() {
  const { points } = usePointsStore();
  const nearPointToast =
    useContent().voorbereiding.aandachtspuntAanmaken.step1.nearPointToast;
  const state = useEnrichedPointState();
  useEnrichedAddPointMapClick({
    step: state.step,
    points,
    mapClickedNotify: state.mapClickedNotify,
    nearPointToast,
    setMapClickedNotify: state.setMapClickedNotify,
    setXCoord: state.setXCoord,
    setYCoord: state.setYCoord,
    setLatitude: state.setLatitude,
    setLongitude: state.setLongitude,
    setCurrentPoint: state.setCurrentPoint,
    setStep: state.setStep,
  });
  return state;
}
