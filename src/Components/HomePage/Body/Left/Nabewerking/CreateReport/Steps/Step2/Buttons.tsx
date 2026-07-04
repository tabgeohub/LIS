import { useConstSelectOptions } from "hooks/consts/useConstSelectOptions";
import { useHoveredPlanState } from "hooks/zustand/hoveredPlanState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleStep2 } from "../../helpers/useHandleStep2";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";

export default function Step2Buttons() {
  const { withLog, labels } = useWizardButtons("Second step");
  const activities = useConstSelectOptions("activiteiten");
  const organizations = useConstSelectOptions("organisaties");
  const { graphicsLayerHover, graphicsLayer, geometriesGraphicsLayer } =
    useMapViewState();
  const { setHoveredPoints } = useHoveredPlanState();
  const { resetFeatures } = useResetFeatures();
  const handleCancel = useHandleCancel();
  const {
    selectedPlan,
    selectedPoints,
    selectedGeometries,
    setSelectedPoints,
    setSelectedGeometries,
    setZipFile,
    setZippingStatus,
    setStep,
    setFilteredPlans,
    setFilterTerm,
    clear,
  } = useCreateReportState();

  const handleStep2 = useHandleStep2({
    selectedPlan: selectedPlan!,
    selectedPoints: selectedPoints!,
    selectedGeometries: selectedGeometries!,
    setZipFile,
    setZippingStatus,
    activities,
    organizations,
  });

  function resetStep2State() {
    graphicsLayerHover?.removeAll();
    graphicsLayer?.removeAll();
    setHoveredPoints(null);
    geometriesGraphicsLayer?.removeAll();
    resetFeatures();
    setSelectedPoints([]);
    setSelectedGeometries([]);
    setZipFile(null);
    setZippingStatus("");
    setFilteredPlans([]);
    setFilterTerm("");
    clear();
  }

  return (
    <WizardButtonBar
      className=""
      buttons={[
        {
          label: labels.vorige,
          onClick: withLog("User clicked 'Previous' button", () => {
            resetStep2State();
            setStep(1);
          }),
        },
        {
          label: labels.volgende,
          onClick: withLog("User clicked 'Next' button", () => {
            graphicsLayerHover?.removeAll();
            graphicsLayer?.removeAll();
            setHoveredPoints(null);
            setStep(3);
            handleStep2();
          }),
        },
        {
          label: labels.annuleren,
          onClick: withLog("User clicked 'Cancel' button", () => {
            resetStep2State();
            handleCancel();
          }),
        },
      ]}
    />
  );
}
