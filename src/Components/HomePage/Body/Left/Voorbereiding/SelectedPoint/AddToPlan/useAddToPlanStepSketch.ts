/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsStore } from "hooks/features/usePointsStore";

export function useAddToPlanStepSketch(
  step: number,
  initPolygonDrawer: () => Promise<void>,
  cleanupSketch: () => void
) {
  const { setTopMessage } = useMapViewState();
  const { setPolygonPoints } = usePointsStore();

  useEffect(() => {
    if (step === 3) {
      setTopMessage({
        message: "Schets veelhoek op de kaart. Sluit af met dubbelklik.",
        show: true,
      });
      setPolygonPoints([]);
      initPolygonDrawer();
    } else {
      setTopMessage({ message: "", show: false });
      cleanupSketch();
    }
  }, [step]);
}
