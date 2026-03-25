import Modal from "Components/HomePage/Body/Common/Modal";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { IoMdClose } from "react-icons/io";
import { Geometry } from "hooks/features/useGeometriesStore";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { geometryDisplayName } from "./EditForm/helpers/labels";

interface ConfirmationModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  selectedGeometry: Geometry | null;
  handleDelete: () => void;
  loading: boolean;
  isDeleting: boolean;
}

export default function ConfirmationModal({
  isOpen,
  setIsOpen,
  selectedGeometry,
  handleDelete,
  loading,
  isDeleting,
}: ConfirmationModalProps) {
  const logAction = useLogAction();
  const content = useContent();

  return (
    <Modal
      className="w-full max-w-md rounded relative bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className="">
        <div className="relative flex items-center justify-center px-2 py-2">
          <p className="text-gray-500 text-[16px]">
            {content.common.verwijderen}
          </p>
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5"
            onClick={() => setIsOpen(false)}
            aria-label="Sluiten"
          >
            <IoMdClose className="text-gray-500 text-lg" />
          </button>
        </div>

        <div className="w-full h-0.5 bg-gray-300" />

        <div className="py-2 px-3">
          <p className="text-[14px] text-gray-700">
            Weet je zeker dat je{" "}
            <strong>
              {selectedGeometry
                ? geometryDisplayName(selectedGeometry)
                : "deze geometrie"}
            </strong>{" "}
            wilt verwijderen?
          </p>

          <div className="flex justify-end mt-6 gap-x-2">
            <button onClick={handleDelete} className="gray-button">
              {content.common.ok}
            </button>

            <button
              onClick={() => {
                setIsOpen(false);

                logAction({
                  message: "User clicked 'Cancel' in delete confirmation modal",
                  step: "Edit Geometry",
                });
              }}
              className="gray-button"
            >
              {content.common.annuleren}
            </button>
          </div>
        </div>
      </div>

      {(loading || isDeleting) && (
        <div className="absolute top-0 left-0 w-full h-full ">
          <div className="relative h-full w-full">
            <div className="absolute top-0 left-0 h-full w-full bg-gray-500/20 bg-opacity-50 z-10" />

            <div className="absolute top-[30%] left-[50%] translate-x-[-50%] z-20">
              <LoadingBars />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

