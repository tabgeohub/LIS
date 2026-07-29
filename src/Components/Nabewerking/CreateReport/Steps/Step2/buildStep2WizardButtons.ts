import {
  resetCreateReportStep2,
} from "./resetCreateReportStep2";
import type { useStep2ButtonsModel } from "./useStep2ButtonsModel";
import { buildStep2NextButton } from "./buildStep2NextButton";

type Model = ReturnType<typeof useStep2ButtonsModel>;

export function buildStep2WizardButtons(model: Model) {
  const { withLog, labels, report, handleCancel } = model;
  return [
    {
      label: labels.vorige,
      onClick: withLog("User clicked 'Previous' button", () => {
        resetCreateReportStep2(model);
        report.setStep(1);
      }),
    },
    buildStep2NextButton(model),
    {
      label: labels.annuleren,
      onClick: withLog("User clicked 'Cancel' button", () => {
        resetCreateReportStep2(model);
        handleCancel();
      }),
    },
  ];
}
