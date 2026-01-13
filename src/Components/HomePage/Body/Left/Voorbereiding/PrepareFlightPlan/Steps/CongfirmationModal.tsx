import Modal from "Components/HomePage/Body/Common/Modal";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { IoMdClose } from "react-icons/io";
import { FlightPlanType } from "Types";

export default function CongfirmationModal({
  openModal,
  setOpenModal,
  selectedPlan,
  handleConfirm,
}: {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  selectedPlan: FlightPlanType | null;
  handleConfirm: () => void;
}) {
  const logAction = useLogAction();
  const content = useContent();

  return (
    <Modal
      className="w-full max-w-md rounded bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      isOpen={openModal}
      setIsOpen={setOpenModal}
    >
      <div>
        <div className="flex justify-between items-center px-2 py-2">
          <p></p>

          <p className="text-gray-500 text-[16px]">
            {content.voorbereiding.vluchtplanVoorbereiding.confirmModal.title}
          </p>

          <button onClick={() => setOpenModal(false)}>
            <IoMdClose className="text-gray-500 text-lg" />
          </button>
        </div>

        <div className="w-full h-0.5 bg-gray-300" />

        <div className="py-2 px-3">
          <p className="text-[14px] text-gray-700">
            {
              content.voorbereiding.vluchtplanVoorbereiding.confirmModal
                .messageP1
            }{" "}
            <strong>{selectedPlan?.vluchtnummer}</strong>{" "}
            {
              content.voorbereiding.vluchtplanVoorbereiding.confirmModal
                .messageP2
            }
          </p>

          <div className="flex justify-end mt-6 gap-x-2">
            <button
              onClick={() => {
                handleConfirm();

                logAction({
                  message:
                    "User clicked 'Confirm' button to prepare the flight plan",
                  step: "Confirm modal",
                });
              }}
              className="gray-button"
            >
              {content.voorbereiding.vluchtplanVoorbereiding.confirmModal.ok}
            </button>

            <button
              onClick={() => {
                setOpenModal(false);
                logAction({
                  message: "User clicked 'Cancel' button",
                  step: "Confirm modal",
                });
              }}
              className="gray-button"
            >
              {
                content.voorbereiding.vluchtplanVoorbereiding.confirmModal
                  .annuleren
              }
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
