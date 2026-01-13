import { useHoveredPlanState } from "hooks/zustand/hoveredPlanState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleStep2 } from "../helpers/useHandleStep2";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import { usePointsStore } from "hooks/zustand/usePointsStore";
import useLogAction from "hooks/useLogAction";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";
import { useContent } from "hooks/useContent";

export default function Buttons() {
  const logAction = useLogAction();
  const activities = useGetActiviteiten();
  const organizations = useGetOrganisaties();

  const { graphicsLayerHover, graphicsLayer } = useMapViewState();
  const { setHoveredPoints } = useHoveredPlanState();
  const { setPoints, dbPoints } = usePointsStore();
  const handleCancel = useHandleCancel();

  const {
    step,
    selectedPlan,
    selectedPoints,
    setZipFile,
    setZippingStatus,
    setStep,
    setOpenFilter,
    clear,
  } = useCreateReportState();

  const handleStep2 = useHandleStep2(
    selectedPlan!,
    selectedPoints!,
    setZipFile,
    setZippingStatus,
    activities,
    organizations
  );

  async function handleNext() {
    graphicsLayerHover?.removeAll();
    graphicsLayer?.removeAll();
    setHoveredPoints(null);

    if (step === 1) {
      setStep(2);
    }

    if (step === 2) {
      setStep(3);
      handleStep2();
    }

    logAction({
      message: "User clicked 'Next' button",
      step: "First step",
    });
  }

  const content = useContent();

  return (
    <>
      {step === 2 && (
        <button
          className="gray-button"
          onClick={() => {
            setStep(1);
            setPoints(dbPoints);

            logAction({
              message: "User clicked 'Previous' button",
              step: "First step",
            });
          }}
        >
          {content.common.vorige}
        </button>
      )}

      {step === 1 && (
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
      )}

      {(step === 1 || step === 2) && (
        <>
          <button
            disabled={!selectedPlan}
            onClick={handleNext}
            className="gray-button"
          >
            {content.common.volgende}
          </button>

          <button
            className="gray-button"
            onClick={() => {
              setPoints(dbPoints);
              clear();

              handleCancel();

              logAction({
                message: "User clicked 'Cancel' button",
                step: "First step",
              });
            }}
          >
            {content.common.annuleren}
          </button>
        </>
      )}
    </>
  );
}
