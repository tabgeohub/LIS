import Modal from "Components/HomePage/Body/Common/Modal";
import { IoMdClose } from "react-icons/io";
import useLogAction from "hooks/useLogAction";

interface ConfirmationModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  handleConfirm: () => void;
}

export default function ConfirmationModal({
  isOpen,
  setIsOpen,
  handleConfirm,
}: ConfirmationModalProps) {
  const logAction = useLogAction();

  return (
    <Modal
      className="w-full max-w-md rounded relative bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className="">
        <div className="flex justify-between items-center px-2 py-2">
          <p></p>

          <p className="text-gray-500 text-[16px]">Bevestiging</p>

          <button onClick={() => setIsOpen(false)}>
            <IoMdClose className="text-gray-500 text-lg" />
          </button>
        </div>

        <div className="w-full h-0.5 bg-gray-300" />

        <div className="py-2 px-3">
          <p className="text-[14px] text-gray-700">
            De getekende geometrie wordt verwijderd, weet je zeker dat je wilt vertrekken?
          </p>

          <div className="flex justify-end mt-6 gap-x-2">
            <button
              onClick={() => {
                setIsOpen(false);

                logAction({
                  message: "User clicked 'Blijven' (Stay) in cancel confirmation modal",
                  step: "DrawingTool Step2",
                });
              }}
              className="gray-button"
            >
              Blijven
            </button>

            <button
              onClick={() => {
                handleConfirm();

                logAction({
                  message: "User clicked 'Ja' (Yes) in cancel confirmation modal",
                  step: "DrawingTool Step2",
                });
              }}
              className="gray-button"
            >
              Ja
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

