import { useMemo } from "react";
import useLogAction from "hooks/useLogAction";
import {
  createWizardLogStep,
  createWizardWithLog,
} from "./wizardButtonHelpers";

export function useWizardLogControls(step: string) {
  const logAction = useLogAction();

  const logStep = useMemo(
    () => createWizardLogStep({ logAction, step }),
    [logAction, step]
  );
  const withLog = useMemo(() => createWizardWithLog(logStep), [logStep]);

  return { logStep, withLog };
}
