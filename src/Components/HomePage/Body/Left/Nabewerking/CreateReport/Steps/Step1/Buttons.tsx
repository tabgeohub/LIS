import { useHoveredPlanState } from "hooks/zustand/hoveredPlanState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function Step1Buttons() {
  const logAction = useLogAction();
  const { graphicsLayerHover, graphicsLayer, geometriesGraphicsLayer } =
    useMapViewState();
  const { setHoveredPoints } = useHoveredPlanState();
  const { resetFeatures } = useResetFeatures();
  const handleCancel = useHandleCancel();

  const {
    selectedPlan,
    selectedGeometries,
    setSelectedGeometries,
    setStep,
    setOpenFilter,
    clear,
  } = useCreateReportState();

  const content = useContent();

  function handleNext() {
    graphicsLayerHover?.removeAll();
    graphicsLayer?.removeAll();
    setHoveredPoints(null);
    setStep(2);

    logAction({
      message: "User clicked 'Next' button",
      step: "First step",
    });
  }

  function handleCancelClick() {
    setSelectedGeometries([]);
    // Clear layer and reset features - global hook will re-render all geometries
    geometriesGraphicsLayer?.removeAll();
    resetFeatures();
    clear();
    handleCancel();

    logAction({
      message: "User clicked 'Cancel' button",
      step: "First step",
    });
  }

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
        onClick={handleNext}
        className="gray-button"
      >
        {content.common.volgende}
      </button>

      <button className="gray-button" onClick={handleCancelClick}>
        {content.common.annuleren}
      </button>
    </>
  );
}

