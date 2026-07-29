import { useHoveredPlanState } from "hooks/zustand/hoveredPlanState";
import { useMapViewState } from "hooks/zustand/ui";
import { useHandleCancel } from "Components/HomePage/hooks/handleCancel/useHandleCancel";
import { useResetFeatures } from "Components/HomePage/hooks/features/useResetFeatures";
import { useWizardButtons } from "Components/HomePage/hooks/wizard/useWizardButtons";
import { useStep2ReportActions } from "./useStep2ReportActions";

export function useStep2ButtonsModel() {
  const { withLog, labels } = useWizardButtons("Second step");
  const { graphicsLayerHover, graphicsLayer, geometriesGraphicsLayer } =
    useMapViewState();
  const { setHoveredPoints } = useHoveredPlanState();
  const { resetFeatures } = useResetFeatures();
  const handleCancel = useHandleCancel();
  const { report, handleStep2 } = useStep2ReportActions();

  return {
    withLog,
    labels,
    graphicsLayerHover,
    graphicsLayer,
    geometriesGraphicsLayer,
    setHoveredPoints,
    resetFeatures,
    handleCancel,
    handleStep2,
    report,
  };
}
