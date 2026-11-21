import Modal from "Components/Common/Modal";
import { useDeleteData } from "api-hooks/mutations";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { WaarnemerType } from "Types";
import Loading from "../Loading";

export default function DeleteWaarnemerModal({
  open,
  setOpen,
  selected,
  refetch,
  setSelected,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  selected: WaarnemerType;
  refetch: () => void;
  setSelected: (value: WaarnemerType | null) => void;
}) {
  const logAction = useLogAction();
  const content = useContent();
  const { deleteData, loading } = useDeleteData(`/waarnemers`);

  return (
    <Modal
      className="w-full max-w-md overflow-hidden rounded-xl bg-white p-0 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      unclosed={true}
      isOpen={open}
      setIsOpen={setOpen}
    >
      <div className="relative p-6 overflow-hidden">
        {content.tools.pilotenWaarnemers.waarnemers.deleteModal}

        <div className="mt-4 flex justify-end gap-x-2 pr-4">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logAction({
                message: "User clicked 'Cancel' button",
                step: "PilotenWaarnemers - Delete waarnemer",
              });
            }}
            className="gray-button"
          >
            {content.common.annuleren}
          </button>

          <button
            type="button"
            onClick={() => {
              deleteData({
                id: encodeURIComponent(selected.id),
                onSuccess: () => {
                  setOpen(false);
                  setSelected(null);
                  refetch();
                },
              });

              logAction({
                message: "User clicked 'Delete' button",
                step: "PilotenWaarnemers - Delete waarnemer",
                newData: { id: selected.id },
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
