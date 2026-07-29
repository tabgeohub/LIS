import { useTabState } from "hooks/zustand/ui/tabState";
import { EmailListStepType } from "..";
import { EmailType } from "Types";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "Components/HomePage/hooks/wizard/useWizardButtons";

export default function Buttons({
  setStep,
  selectedEmail,
  setOpenDeleteModal,
}: {
  setStep: (value: EmailListStepType) => void;
  selectedEmail: EmailType | null;
  setOpenDeleteModal: (value: boolean) => void;
}) {
  const { withLog, labels, content } = useWizardButtons("Emailijst - List");
  const { setSelectedTab } = useTabState();

  return (
    <WizardButtonBar
      className=""
      buttons={[
        {
          label: labels.toevoegen,
          onClick: withLog("User clicked 'Add' button", () => setStep("add")),
        },
        {
          label: content.common.wijzigen,
          onClick: withLog("User clicked 'Change' button", () => setStep("edit")),
          disabled: selectedEmail === null,
        },
        {
          label: content.common.verwijderen,
          onClick: withLog("User clicked 'Delete' button", () =>
            setOpenDeleteModal(true)
          ),
          disabled: selectedEmail === null,
        },
        {
          label: labels.annuleren,
          onClick: withLog("User clicked 'Cancel' button", () =>
            setSelectedTab("none")
          ),
        },
      ]}
    />
  );
}
