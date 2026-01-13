import { useTabState } from "@helpers/ZustandStates/tabState";
import { EmailListStepType } from "..";
import { EmailType } from "Types";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function Buttons({
  setStep,
  selectedEmail,
  setOpenDeleteModal,
}: {
  setStep: (value: EmailListStepType) => void;
  selectedEmail: EmailType | null;
  setOpenDeleteModal: (value: boolean) => void;
}) {
  const logAction = useLogAction();

  const { setSelectedTab } = useTabState();

  const content = useContent();

  return (
    <>
      <button
        onClick={() => {
          setStep("add");

          logAction({
            message: "User clicked 'Add' button",
            step: "Emailijst - List",
          });
        }}
        className="gray-button"
      >
        {content.common.toevoegen}
      </button>

      <button
        disabled={selectedEmail === null}
        onClick={() => {
          setStep("edit");

          logAction({
            message: "User clicked 'Change' button",
            step: "Emailijst - List",
          });
        }}
        className="gray-button"
      >
        {content.common.wijzigen}
      </button>

      <button
        onClick={() => {
          setOpenDeleteModal(true);

          logAction({
            message: "User clicked 'Delete' button",
            step: "Emailijst - List",
          });
        }}
        disabled={selectedEmail === null}
        className="gray-button"
      >
        {content.common.verwijderen}
      </button>

      <button
        onClick={() => {
          setSelectedTab("none");

          logAction({
            message: "User clicked 'Cancel' button",
            step: "Emailijst - List",
          });
        }}
        className="gray-button"
      >
        {content.common.annuleren}
      </button>
    </>
  );
}
