import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { PilootType } from "Types";
import type { PilotenWaarnemersStep } from "../..";
import type { PilotenStep } from "..";

export default function Buttons({
  selected,
  setPilotenStep,
  setStep,
  setOpenDeleteModal,
}: {
  selected: PilootType | null;
  setPilotenStep: (value: PilotenStep) => void;
  setStep: (value: PilotenWaarnemersStep) => void;
  setOpenDeleteModal: (value: boolean) => void;
}) {
  const { withLog, labels, content } = useWizardButtons(
    "PilotenWaarnemers - Piloten list"
  );

  return (
    <WizardButtonBar
      className=""
      buttons={[
        {
          label: labels.toevoegen,
          onClick: withLog("User clicked 'Add' button", () =>
            setPilotenStep("add")
          ),
        },
        {
          label: content.common.wijzigen,
          onClick: withLog("User clicked 'Change' button", () =>
            setPilotenStep("edit")
          ),
          disabled: selected === null,
        },
        {
          label: content.common.verwijderen,
          onClick: withLog("User clicked 'Delete' button", () =>
            setOpenDeleteModal(true)
          ),
          disabled: selected === null,
        },
        {
          label: labels.annuleren,
          onClick: withLog("User clicked 'Back' button", () =>
            setStep("chooser")
          ),
        },
      ]}
    />
  );
}
