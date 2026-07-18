import { useContent } from "hooks/useContent";
import { useTemplateFlightState } from "../templateFlightStates";

/** Shared TemplateFlight Step2/Step3 wiring into TemplateSelectionStep. */
export function useTemplateFlightSelectionStepProps(step: 2 | 3) {
  const state = useTemplateFlightState();
  const content = useContent();
  const isStep2 = step === 2;

  return {
    repeat: isStep2,
    text: isStep2
      ? content.voorbereiding.vluchtenTemplate.step2.text
      : content.voorbereiding.vluchtenTemplate.step3.text,
    step,
    selectedPoints: isStep2 ? state.selectedPoints : state.selectedPoints2,
    setSelectedPoints: isStep2
      ? state.setSelectedPoints
      : state.setSelectedPoints2,
    selectedGeometries: isStep2
      ? state.selectedGeometries
      : state.selectedGeometries2,
    setSelectedGeometries: isStep2
      ? state.setSelectedGeometries
      : state.setSelectedGeometries2,
  };
}
