import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";

export default function Buttons() {
  const { graphicsLayer } = useMapViewState();
  const { setOpenFilter, clear, setStep, selectedPlan } = useReuseFlightPlan();

  const handleCancel = useHandleCancel();

  function handleNext() {
    if (!graphicsLayer) return;

    graphicsLayer.graphics.removeAll();

    setStep(2);
  }

  const logAction = useLogAction();

  const content = useContent();

  return (
    <>
      <button
        className="gray-button"
        onClick={() => {
          setOpenFilter(true);
          logAction({
            message: "User clicked 'Filter' button",
            step: "First step",
          });
        }}
      >
        {content.common.filteren}
      </button>

      <button
        disabled={!selectedPlan}
        onClick={() => {
          handleNext();

          logAction({
            message: "User clicked 'Next' button",
            step: "First step",
          });
        }}
        className="gray-button"
      >
        {content.voorbereiding.vluchtplanHergebruiken.step1.kopieerVluchtplan}
      </button>

      <button
        className="gray-button"
        onClick={() => {
          handleCancel();
          clear();

          logAction({
            message: "User clicked 'Cancel' button",
            step: "First step",
          });
        }}
      >
        {content.common.annuleren}
      </button>
    </>
  );
}
