import { useState } from "react";
import { EmailListStepType } from "..";
import Loading from "./Loading";
import { useCreateData } from "api-hooks/mutations";
import { isValidEmail } from "helpers/dom/isValidEmail";
import InputComp from "Components/Common/FormComponents/InputComp";
import toast from "react-hot-toast";
import { useAuth } from "hooks/zustand/ui";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function AddEmail({
  setStep,
  refetch,
}: {
  setStep: (value: EmailListStepType) => void;
  refetch: () => void;
}) {
  const logAction = useLogAction();

  const [emailToAdd, setEmailToAdd] = useState("");

  const { user } = useAuth();

  const { create, loading } = useCreateData("/emails");

  const content = useContent();

  function handleCreate() {
    if (isValidEmail(emailToAdd)) {
      create({ data: { email: emailToAdd, regio: user.role }, onSuccess: () => {
        setStep("list");
        refetch();
      },});

      logAction({
        message: "User clicked 'Save' button to add email",
        step: "Emailijst - Add email",
        newData: {
          email: emailToAdd,
        },
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
          value={emailToAdd}
          setValue={setEmailToAdd}
          type="text"
          inputClassName="!col-span-2"
        />
      </div>

      <div className="flex items-center justify-end gap-x-2 mt-4 mr-4">
        <button
          disabled={emailToAdd === ""}
          onClick={handleCreate}
          className="gray-button"
        >
          {content.common.toevoegen}
        </button>

        <button
          onClick={() => {
            setStep("list");

            logAction({
              message: "User clicked 'Cancel' button",
              step: "Emailijst - Add email",
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
