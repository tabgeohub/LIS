import { useCallback } from "react";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export function useWizardButtons(step: string) {
  const logAction = useLogAction();
  const content = useContent();

  const logStep = useCallback(
    (message: string, newData?: unknown) => {
      logAction({
        message,
        step,
        ...(newData !== undefined ? { newData } : {}),
      });
    },
    [logAction, step]
  );

  const withLog = useCallback(
    (message: string, action: () => void, newData?: unknown) => {
      return () => {
        action();
        logStep(message, newData);
      };
    },
    [logStep]
  );

  return {
    step,
    logStep,
    withLog,
    labels: {
      vorige: content.common.vorige,
      volgende: content.common.volgende,
      opslaan: content.common.opslaan,
      annuleren: content.common.annuleren,
      filteren: content.common.filteren,
      update: content.common.update,
      toevoegen: content.common.toevoegen,
    },
    content,
  };
}
