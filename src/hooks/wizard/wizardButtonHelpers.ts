import { useCallback } from "react";
import useLogAction from "hooks/useLogAction";

export function createWizardLogStep(
  logAction: ReturnType<typeof useLogAction>,
  step: string
) {
  return (message: string, newData?: unknown) => {
    logAction({
      message,
      step,
      ...(newData !== undefined ? { newData } : {}),
    });
  };
}

export function createWizardWithLog(
  logStep: (message: string, newData?: unknown) => void
) {
  return (message: string, action: () => void, newData?: unknown) => {
    return () => {
      action();
      logStep(message, newData);
    };
  };
}

type CommonLabels = {
  vorige: string;
  volgende: string;
  opslaan: string;
  annuleren: string;
  filteren: string;
  update: string;
  toevoegen: string;
};

export function pickWizardButtonLabels(common: CommonLabels) {
  return {
    vorige: common.vorige,
    volgende: common.volgende,
    opslaan: common.opslaan,
    annuleren: common.annuleren,
    filteren: common.filteren,
    update: common.update,
    toevoegen: common.toevoegen,
  };
}
