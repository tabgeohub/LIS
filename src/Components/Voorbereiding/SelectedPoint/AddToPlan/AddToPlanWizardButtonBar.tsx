import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";
import { WIZARD_BUTTON_BAR_CLASS } from "Components/Common/Wizard/wizardButtonBarClass";

/** Shared Vorige / Volgende / Annuleren bar for AddToPlan step buttons. */
export function AddToPlanWizardButtonBar(props: {
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
}) {
  return (
    <WizardButtonBar
      className={WIZARD_BUTTON_BAR_CLASS}
      buttons={[
        { label: "Vorige", onClick: props.onBack },
        { label: "Volgende", onClick: props.onNext },
        { label: "Annuleren", onClick: props.onCancel },
      ]}
    />
  );
}
