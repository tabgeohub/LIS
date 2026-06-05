import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useTemplateFlightState } from "../../templateFlightStates";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { useResetFeatures } from "hooks/features/useResetFeatures";

export default function Buttons({
  setOpenFilter,
}: {
  setOpenFilter: (value: boolean) => void;
}) {
  const {
    step,
    setStep,
    selectedGraphics,
    setSelectedGraphics,
    hoveredGraphic,
    setHoveredGraphic,
    clear,
    setSelectedPoints,
    setSelectedGeometries,
  } = useTemplateFlightState();

  const logAction = useLogAction();

  const { mapView, yellowGraphicsLayer, geometriesGraphicsLayer, clearGraphics } = useMapViewState();
  const resetFilters = usePointsFilterStore((s) => s.resetFilters);
  const handleCancel = useHandleCancel();
  const { resetFeatures } = useResetFeatures();

  const content = useContent();

  const handleNext = () => {
    setStep(step + 1);
    resetFilters();

    selectedGraphics.forEach((g) => mapView?.graphics.remove(g));
    setSelectedGraphics([]);

    logAction({
      message: "User clicked 'Next' button",
      step: "Second step",
    });

    if (hoveredGraphic) {
      mapView?.graphics.remove(hoveredGraphic);
      setHoveredGraphic(null);
    }

    yellowGraphicsLayer?.graphics.removeAll();
  };

  const handlePrevious = () => {
    setStep(1);
    resetFilters();
    setSelectedPoints([]);
    setSelectedGeometries([]);

    // Reset features back to initial DB state
    resetFeatures();

    clearGraphics();

    selectedGraphics.forEach((g) => mapView?.graphics.remove(g));
    setSelectedGraphics([]);

    if (hoveredGraphic) {
      mapView?.graphics.remove(hoveredGraphic);
      setHoveredGraphic(null);
    }
  };

  const handleCancelClick = () => {
    // Reset features back to initial DB state
    resetFeatures();

    clear();
    setSelectedGeometries([]);
    handleCancel();
    resetFilters();
    clearGraphics();

    selectedGraphics.forEach((g) => mapView?.graphics.remove(g));
    setSelectedGraphics([]);

    if (hoveredGraphic) {
      mapView?.graphics.remove(hoveredGraphic);
      setHoveredGraphic(null);
    }
  };

  return (
    <>
      <button onClick={handlePrevious} className="gray-button">
        {content.common.vorige}
      </button>

      <button onClick={() => setOpenFilter(true)} className="gray-button">
        {content.common.filteren}
      </button>

      <button onClick={handleNext} className="gray-button">
        {content.common.volgende}
      </button>

      <button
        onClick={handleCancelClick}
        className="gray-button"
      >
        {content.common.annuleren}
      </button>
    </>
  );
}
