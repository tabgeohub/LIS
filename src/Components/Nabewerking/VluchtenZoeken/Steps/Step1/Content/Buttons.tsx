/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "hooks/zustand/ui";
import { useTabState } from "hooks/zustand/ui";
import {
  calculateCenterAndZoom,
  collectPointsForCenterAndZoom,
  goToLonLatZoom,
} from "@helpers/ArcGISHelpers/calculateCenterAndZoom";
import { useFinishedPlansState } from "Components/HomePage/hooks/zustand/nabewerking/useFinishedPlansState";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "Components/HomePage/hooks/wizard/useWizardButtons";

export default function Buttons() {
  const { withLog, labels } = useWizardButtons("First step");
  const { step, setStep, selectedPlan, setOpenFilter } = useFinishedPlansState();
  const { setSelectedTab } = useTabState();
  const { graphicsLayer, graphicsLayerHover, redGraphicsLayer, mapView } =
    useMapViewState();

  useEffect(() => {
    if (step === 1) {
      graphicsLayer?.removeAll();
      graphicsLayerHover?.removeAll();
    }
  }, [step]);

  function handleNext() {
    if (!mapView || !graphicsLayer || !selectedPlan) return;

    setStep(2);
    graphicsLayer?.removeAll();
    graphicsLayerHover?.removeAll();

    const points = collectPointsForCenterAndZoom(selectedPlan);
    if (points.length > 0) {
      const { center, zoom } = calculateCenterAndZoom(points);
      goToLonLatZoom({ mapView, center, zoom });
    }
  }

  function handleCancel() {
    graphicsLayer?.removeAll();
    graphicsLayerHover?.removeAll();
    redGraphicsLayer?.removeAll();
    setSelectedTab("none");
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
          onClick: withLog("User clicked 'Cancel' button", handleCancel),
        },
      ]}
    />
  );
}
