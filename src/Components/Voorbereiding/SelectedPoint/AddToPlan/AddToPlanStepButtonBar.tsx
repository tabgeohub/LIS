import type { ReactNode } from "react";
import type { AddToPlanStepButtonsProps } from "./addToPlanStepButtonsProps";
import { AddToPlanWizardButtonBar } from "./AddToPlanWizardButtonBar";
import { useAddToPlanStepButtons } from "./useAddToPlanStepButtons";

type AddToPlanStepButtonBarProps = AddToPlanStepButtonsProps & {
  onNext: (actions: ReturnType<typeof useAddToPlanStepButtons>) => void;
  onBack?: (actions: ReturnType<typeof useAddToPlanStepButtons>) => void;
  onCancel?: (actions: ReturnType<typeof useAddToPlanStepButtons>) => void;
  children?: ReactNode;
};

/** Shared AddToPlan wizard button bar with step actions injected. */
export function AddToPlanStepButtonBar({
  onNext,
  onBack,
  onCancel,
  children,
  ...props
}: AddToPlanStepButtonBarProps) {
  const actions = useAddToPlanStepButtons(props);
  return (
    <>
      {children}
      <AddToPlanWizardButtonBar
        onBack={() => (onBack ? onBack(actions) : actions.setStep(1))}
        onNext={() => onNext(actions)}
        onCancel={() =>
          onCancel ? onCancel(actions) : actions.cancelToKaartlagenlijst()
        }
      />
    </>
  );
}
