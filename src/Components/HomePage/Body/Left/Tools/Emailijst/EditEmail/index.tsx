import { useState } from "react";
import { EmailListStepType } from "..";
import Loading from "./Loading";
import { EmailType } from "Types";
import { useUpdateData } from "utils/useUpdateData";
import { isValidEmail } from "@helpers/isValidEmail";
import toast from "react-hot-toast";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function EditEmail({
  selectedEmail,
  setSelectedEmail,
  setStep,
  refetch,
}: {
  selectedEmail: EmailType;
  setSelectedEmail: (value: EmailType | null) => void;
  setStep: (value: EmailListStepType) => void;
  refetch: () => void;
}) {
  const logAction = useLogAction();

  const [emailToEdit, setEmailToEdit] = useState(selectedEmail);

  const { update, loading } = useUpdateData(`/emails/${selectedEmail.id}`);

  function handleUpdate() {
    if (isValidEmail(emailToEdit.email)) {
      update({ id: selectedEmail.id, email: emailToEdit.email }, () => {
        setStep("list");
        setSelectedEmail(null);
        toast.success(content.tools.emailijst.edit.successToast);
        refetch();
      });

      logAction({
        message: "User clicked 'Save' button",
        step: "Emailijst - Edit email",
        newData: {
          email: emailToEdit.email,
        },
      });
    } else {
      toast.error(content.tools.emailijst.edit.failToast);
    }
  }

  const content = useContent();

  return (
    <div className="py-2 relative h-full">
      <div className="grid grid-cols-3 gap-x-10 pr-10 pl-4 mt-4">
        <p className="labelClass">{content.tools.emailijst.edit.emailadres}</p>

        <input
          value={emailToEdit.email}
          type="text"
          onChange={(e) => {
            setEmailToEdit({ ...emailToEdit, email: e.target.value });
          }}
          placeholder="E-mailadres"
          className="inputClass col-span-2"
        />
      </div>

      <div className="flex items-center justify-end gap-x-2 mt-4 mr-4">
        <button onClick={handleUpdate} className="gray-button">
          {content.common.wijzigen}
        </button>

        <button
          onClick={() => {
            setStep("list");

            logAction({
              message: "User clicked 'Cancel' button",
              step: "Emailijst - Edit email",
            });
          }}
          className="gray-button"
        >
          {content.common.annuleren}
        </button>
      </div>

      {loading && <Loading />}
    </div>
  );
}
