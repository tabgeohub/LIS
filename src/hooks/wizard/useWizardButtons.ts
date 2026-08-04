import { useContent } from "hooks/useContent";
import { pickWizardButtonLabels } from "./wizardButtonHelpers";
import { useWizardLogControls } from "./useWizardLogControls";

export function useWizardButtons(step: string) {
  const content = useContent();
  const { logStep, withLog } = useWizardLogControls(step);

  return {
    step,
    logStep,
    withLog,
    labels: pickWizardButtonLabels(content.common),
    content,
  };
}
