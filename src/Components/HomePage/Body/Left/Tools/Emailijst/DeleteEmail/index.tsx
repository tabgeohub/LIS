import Modal from "Components/HomePage/Body/Common/Modal";
import Loading from "./Loading";
import { EmailType } from "Types";
import { useDeleteData } from "utils/useDeleteData";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function DeleteEmailModal({
  open,
  setOpen,
  selectedEmail,
  refetch,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedEmail: EmailType;
  refetch: () => void;
}) {
  const logAction = useLogAction();

  const { deleteData, loading } = useDeleteData(`/emails`);

  const content = useContent();

  return (
    <Modal
      className="w-full max-w-md overflow-hidden rounded-xl bg-white p-0 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      unclosed={true}
      isOpen={open}
      setIsOpen={setOpen}
    >
      <div className="relative p-6 overflow-hidden">
        {content.tools.emailijst.deleteModal.text}

        <div className="mt-4 flex justify-end gap-x-2 pr-4">
          <button
            onClick={() => {
              setOpen(false);

              logAction({
                message: "User clicked 'Cancel' button",
                step: "Emailijst - Delete email",
              });
            }}
            className="gray-button"
          >
            {content.common.annuleren}
          </button>

          <button
            onClick={() => {
              deleteData(selectedEmail.id, undefined, () => {
                setOpen(false);
                refetch();
              });

              logAction({
                message: "User clicked 'Delete' button",
                step: "Emailijst - Delete email",
              });
            }}
            className="gray-button"
          >
            {content.common.verwijderen}
          </button>
        </div>

        {loading && <Loading />}
      </div>
    </Modal>
  );
}
