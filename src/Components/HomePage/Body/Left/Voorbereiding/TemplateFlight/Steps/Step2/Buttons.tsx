import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useTemplateFlightState } from "../../templateFlightStates";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

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
  } = useTemplateFlightState();

  const logAction = useLogAction();

  const { mapView, yellowGraphicsLayer } = useMapViewState();
  const resetFilters = usePointsFilterStore((s) => s.resetFilters);
  const handleCancel = useHandleCancel();

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

  return (
    <>
      <button onClick={() => setStep(1)} className="gray-button">
        {content.common.vorige}
      </button>

      <button onClick={() => setOpenFilter(true)} className="gray-button">
        {content.common.filteren}
      </button>

      <button onClick={handleNext} className="gray-button">
        {content.common.volgende}
      </button>

      <button
        onClick={() => {
          clear();
          handleCancel();
          resetFilters();
        }}
        className="gray-button"
      >
        {content.common.annuleren}
      </button>
    </>
  );
}
