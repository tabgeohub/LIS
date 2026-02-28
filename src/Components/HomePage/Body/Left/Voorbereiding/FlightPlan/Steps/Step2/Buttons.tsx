import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useFlightPlanState } from "../../helpers/flightPlanStates";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import useLogAction from "hooks/useLogAction";
import { useResetFeatures } from "hooks/features/useResetFeatures";

export default function Buttons({
  setOpenFilter,
}: {
  setOpenFilter: (value: boolean) => void;
}) {
  const logAction = useLogAction();

  const { resetFeatures } = useResetFeatures();

  const {
    step,
    setStep,
    selectedGraphics,
    setSelectedGraphics,
    hoveredGraphic,
    setHoveredGraphic,
    setSelectedPoints,
    clear,
  } = useFlightPlanState();

  const { mapView, yellowGraphicsLayer, yellowGeometriesGraphicsLayer, clearGraphics } = useMapViewState();
  const resetFilters = usePointsFilterStore((s) => s.resetFilters);
  const handleCancel = useHandleCancel();

  const handleNext = () => {
    setStep(step + 1);
    resetFilters();

    selectedGraphics.forEach((g) => mapView?.graphics.remove(g));
    setSelectedGraphics([]);

    if (hoveredGraphic) {
      mapView?.graphics.remove(hoveredGraphic);
      setHoveredGraphic(null);
    }

    logAction({
      message: "User clicked 'Next' button",
      step: "Second step",
    });

    yellowGraphicsLayer?.graphics.removeAll();
    yellowGeometriesGraphicsLayer?.graphics.removeAll();
  };

  const handleBack = () => {
    setStep(2);
    resetFilters();
    setSelectedPoints([]);

    resetFeatures();

    clearGraphics();
  };

  return (
    <>
      <button onClick={handleBack} className="gray-button">
        Vorige
      </button>

      <button onClick={() => setOpenFilter(true)} className="gray-button">
        Filteren
      </button>

      <button onClick={handleNext} className="gray-button">
        Volgende
      </button>

      <button
        onClick={() => {
          resetFeatures();

          clear();
          handleCancel();
          resetFilters();
        }}
        className="gray-button"
      >
        Annuleren
      </button>
    </>
  );
}
