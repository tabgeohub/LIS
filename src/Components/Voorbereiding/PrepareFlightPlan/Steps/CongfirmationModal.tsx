import Modal from "Components/Common/Modal";
import ConfirmModalChrome from "Components/Common/ConfirmModalChrome";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
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
  const modal = content.voorbereiding.vluchtplanVoorbereiding.confirmModal;

  return (
    <Modal
      className="w-full max-w-md rounded bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      isOpen={openModal}
      setIsOpen={setOpenModal}
    >
      <ConfirmModalChrome
        title={modal.title}
        onClose={() => setOpenModal(false)}
        actions={
          <>
            <button
              type="button"
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
              {modal.ok}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpenModal(false);
                logAction({
                  message: "User clicked 'Cancel' button",
                  step: "Confirm modal",
                });
              }}
              className="gray-button"
            >
              {modal.annuleren}
            </button>
          </>
        }
      >
        <p className="text-[14px] text-gray-700">
          {modal.messageP1} <strong>{selectedPlan?.vluchtnummer}</strong>{" "}
          {modal.messageP2}
        </p>
      </ConfirmModalChrome>
    </Modal>
  );
}
