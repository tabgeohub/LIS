import Modal from "Components/Common/Modal";
import ConfirmModalChrome from "Components/Common/ConfirmModalChrome";
import WizardLoadingOverlay from "Components/Common/Wizard/WizardLoadingOverlay";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useDeleteFlightPlan } from "Components/Voorbereiding/RemoveFlightPlan/useDeleteFlightPlan";
import { useDeleteData } from "api-hooks/mutations";

export default function CongfirmationModal({
  refetch,
}: {
  refetch: () => void;
}) {
  const logAction = useLogAction();
  const { selectedPlan, setOpenDeleteModal, openDeleteModal } =
    useDeleteFlightPlan();
  const { deleteData, loading } = useDeleteData("/flightPlans");
  const content = useContent();
  const modal = content.voorbereiding.vluchtplanVerwijderen.comfirmModal;

  function handleDeletePlan() {
    deleteData({
      id: String(selectedPlan?.id),
      onSuccess: () => {
        refetch();
        setOpenDeleteModal(false);
      },
    });
    logAction({
      message: `User clicked 'Delete' button to delete flight plan  : ${selectedPlan?.vluchtnummer}`,
      step: "Confirm modal",
    });
  }

  return (
    <Modal
      className="w-full max-w-md rounded relative bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      isOpen={openDeleteModal}
      setIsOpen={setOpenDeleteModal}
    >
      <ConfirmModalChrome
        title={modal.header}
        onClose={() => setOpenDeleteModal(false)}
        actions={
          <>
            <button
              type="button"
              onClick={handleDeletePlan}
              className="gray-button"
            >
              {content.common.ok}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpenDeleteModal(false);
                logAction({
                  message: "User clicked 'Cancel' button",
                  step: "Confirm modal",
                });
              }}
              className="gray-button"
            >
              {content.common.annuleren}
            </button>
          </>
        }
      >
        <p className="text-[14px] text-gray-700">
          {modal.messageP1} <strong>{selectedPlan?.vluchtnummer}</strong>
          {modal.messageP2}
        </p>
      </ConfirmModalChrome>
      <WizardLoadingOverlay show={loading} variant="stacked" />
    </Modal>
  );
}
