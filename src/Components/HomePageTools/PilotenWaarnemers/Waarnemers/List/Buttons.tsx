import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { WaarnemerType } from "Types";
import type { PilotenWaarnemersStep } from "../..";
import type { WaarnemersStep } from "..";

export default function Buttons({
  selected,
  setWaarnemersStep,
  setStep,
  setOpenDeleteModal,
}: {
  selected: WaarnemerType | null;
  setWaarnemersStep: (value: WaarnemersStep) => void;
  setStep: (value: PilotenWaarnemersStep) => void;
  setOpenDeleteModal: (value: boolean) => void;
}) {
  const { withLog, labels, content } = useWizardButtons(
    "PilotenWaarnemers - Waarnemers list"
  );

  return (
    <WizardButtonBar
      className=""
      buttons={[
        {
          label: labels.toevoegen,
          onClick: withLog("User clicked 'Add' button", () =>
            setWaarnemersStep("add")
          ),
        },
        {
          label: content.common.wijzigen,
          onClick: withLog("User clicked 'Change' button", () =>
            setWaarnemersStep("edit")
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
