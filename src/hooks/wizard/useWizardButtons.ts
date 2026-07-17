import { useMemo } from "react";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import {
  createWizardLogStep,
  createWizardWithLog,
  pickWizardButtonLabels,
} from "./wizardButtonHelpers";

export function useWizardButtons(step: string) {
  const logAction = useLogAction();
  const content = useContent();

  const logStep = useMemo(
    () => createWizardLogStep(logAction, step),
    [logAction, step]
  );
  const withLog = useMemo(() => createWizardWithLog(logStep), [logStep]);

  return {
    step,
    logStep,
    withLog,
    labels: pickWizardButtonLabels(content.common),
    content,
  };
}
