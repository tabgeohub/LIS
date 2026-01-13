import { useState } from "react";
import { EmailListStepType } from "..";
import Buttons from "./Buttons";
import DeleteEmailModal from "../DeleteEmail";
import { EmailType } from "Types";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import ScrollButtonsLayout from "../../../Common/ScrollButtonsLayout";

export default function List({
  selectedEmail,
  setSelectedEmail,
  setStep,
  emails,
  refetch,
}: {
  selectedEmail: EmailType | null;
  setSelectedEmail: (value: EmailType | null) => void;
  setStep: (value: EmailListStepType) => void;
  emails: EmailType[];
  refetch: () => void;
}) {
  const logAction = useLogAction();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const content = useContent();

  return (
    <div className="h-full">
      <div className="py-2 h-[90%]">
        <p className="text-[12px] border-b border-gray-200 px-2 pb-2">
          {content.tools.emailijst.list.text}
        </p>

        <ScrollButtonsLayout
          buttons={
            <Buttons
              setOpenDeleteModal={setOpenDeleteModal}
              selectedEmail={selectedEmail}
              setStep={setStep}
            />
          }
        >
          {emails.map((email, index) => (
            <div
              key={index}
              className={`text-[14px] pl-5 py-2 border-b border-gray-200 transition-all hover:bg-[#4ff1ff]/60 duration-500 cursor-pointer ${
                selectedEmail?.id === email?.id && "bg-gray-200"
              }`}
              onClick={() => {
                setSelectedEmail(email);

                logAction({
                  message: "User clicked on email",
                  step: "Emailijst",
                  newData: {
                    email: email.email,
                  },
                });
              }}
            >
              <p>{email.email}</p>
            </div>
          ))}
        </ScrollButtonsLayout>
      </div>

      {selectedEmail && (
        <DeleteEmailModal
          selectedEmail={selectedEmail}
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          refetch={refetch}
        />
      )}
    </div>
  );
}
