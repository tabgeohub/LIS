import { useContent } from "hooks/useContent";
import { useTemplateFlightState } from "../templateFlightStates";

type TemplateFlightState = ReturnType<typeof useTemplateFlightState>;

function pickStepSelection(
  state: TemplateFlightState,
  isStep2: boolean
) {
  return {
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

function pickStepText(input: {
  content: ReturnType<typeof useContent>;
  isStep2: boolean;
}) {
  return input.isStep2
    ? input.content.voorbereiding.vluchtenTemplate.step2.text
    : input.content.voorbereiding.vluchtenTemplate.step3.text;
}

/** Shared TemplateFlight Step2/Step3 wiring into TemplateSelectionStep. */
export function useTemplateFlightSelectionStepProps(step: 2 | 3) {
  const state = useTemplateFlightState();
  const content = useContent();
  const isStep2 = step === 2;

  return {
    repeat: isStep2,
    text: pickStepText({ content, isStep2 }),
    step,
    ...pickStepSelection(state, isStep2),
  };
}
