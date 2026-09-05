import { useState } from "react";
import { EmailListStepType } from "..";
import Loading from "./Loading";
import { EmailType } from "Types";
import { useUpdateData } from "api-hooks/mutations";
import { isValidEmail } from "helpers/dom/isValidEmail";
import InputComp from "Components/Common/FormComponents/InputComp";
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
  const content = useContent();

  function handleUpdate() {
    if (isValidEmail(emailToEdit.email)) {
      update({
        data: { id: selectedEmail.id, email: emailToEdit.email },
        onSuccess: () => {
          setStep("list");
          setSelectedEmail(null);
          toast.success(content.tools.emailijst.edit.successToast);
          refetch();
        },
      });
      logAction({
        message: "User clicked 'Save' button",
        step: "Emailijst - Edit email",
        newData: { email: emailToEdit.email },
      });
    } else {
      toast.error(content.tools.emailijst.edit.failToast);
    }
  }

  return (
    <div className="py-2 relative h-full">
      <div className="pr-10 pl-4 mt-4">
        <InputComp
          label={content.tools.emailijst.edit.emailadres}
          value={emailToEdit.email}
          setValue={(email) => setEmailToEdit({ ...emailToEdit, email })}
          type="text"
          inputClassName="!col-span-2"
        />
      </div>

      <div className="flex items-center justify-end gap-x-2 mt-4 mr-4">
        <button type="button" onClick={handleUpdate} className="gray-button">
          {content.common.wijzigen}
        </button>
        <button
          type="button"
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
