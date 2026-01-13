import { useState } from "react";
import { EmailListStepType } from "..";
import Loading from "./Loading";
import { useCreateData } from "utils/useCreateData";
import { isValidEmail } from "@helpers/isValidEmail";
import toast from "react-hot-toast";
import { useAuth } from "@helpers/ZustandStates/useAuth";
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
      create({ email: emailToAdd, regio: user.role }, () => {
        setStep("list");
        refetch();
      });

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
      <div className="grid grid-cols-3 gap-x-10 pr-10 pl-4 mt-4">
        <p className="labelClass">{content.tools.emailijst.edit.emailadres}</p>

        <input
          value={emailToAdd}
          type="text"
          onChange={(e) => setEmailToAdd(e.target.value)}
          placeholder="E-mailadres"
          className="inputClass col-span-2"
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
