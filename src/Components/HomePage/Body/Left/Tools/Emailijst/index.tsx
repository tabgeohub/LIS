import { useState } from "react";
import List from "./List";
import EditEmail from "./EditEmail";
import AddEmail from "./AddEmail";
import { EmailType } from "Types";
import { useReadData } from "utils/useReadData";

export type EmailListStepType = "list" | "edit" | "add";

export default function Emailijst() {
  const [step, setStep] = useState<EmailListStepType>("list");
  const [selectedEmail, setSelectedEmail] = useState<EmailType | null>(null);

  const { data: emails, refetch } = useReadData<EmailType[]>(`/emails`);

  return (
    <div className="h-full">
      {step === "list" && emails && (
        <List
          selectedEmail={selectedEmail}
          setSelectedEmail={setSelectedEmail}
          setStep={setStep}
          emails={emails}
          refetch={refetch}
        />
      )}

      {step === "edit" && selectedEmail && (
        <EditEmail
          setSelectedEmail={setSelectedEmail}
          setStep={setStep}
          selectedEmail={selectedEmail}
          refetch={refetch}
        />
      )}

      {step === "add" && <AddEmail refetch={refetch} setStep={setStep} />}
    </div>
  );
}
