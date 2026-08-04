import { useHoveredPlanState } from "hooks/zustand/hoveredPlanState";
import { useMapViewState } from "hooks/zustand/ui";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useCreateReportState } from "Components/Nabewerking/CreateReport/state/useCreateReportState";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";

export default function Step1Buttons() {
  const { withLog, labels } = useWizardButtons("First step");
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

  function handleNext() {
    graphicsLayerHover?.removeAll();
    graphicsLayer?.removeAll();
    setHoveredPoints(null);
    setStep(2);
  }

  function handleCancelClick() {
    setSelectedGeometries([]);
    geometriesGraphicsLayer?.removeAll();
    resetFeatures();
    clear();
    handleCancel();
  }

  return (
    <WizardButtonBar
      className=""
      buttons={[
        {
          label: labels.filteren,
          onClick: withLog("User clicked 'Filter' button", () => setOpenFilter(true)),
        },
        {
          label: labels.volgende,
          onClick: withLog("User clicked 'Next' button", handleNext),
          disabled: !selectedPlan,
        },
        {
          label: labels.annuleren,
          onClick: withLog("User clicked 'Cancel' button", handleCancelClick),
        },
      ]}
    />
  );
}
