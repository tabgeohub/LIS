import Modal from "Components/Common/Modal";
import ConfirmModalChrome from "Components/Common/ConfirmModalChrome";
import WizardLoadingOverlay from "Components/Common/Wizard/WizardLoadingOverlay";
import { useChangePlanStatusState } from "Components/Nabewerking/ChangeFlightPlanStatus/useChangePlanStatusState";
import { useUpdateData } from "api-hooks/mutations";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { formatConfirmMessage } from "helpers/format/formatConfirmMessage";

export default function ConfirmModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const logAction = useLogAction();
  const { update, loading } = useUpdateData(
    "/flightPlans/updateFlightPlanStatus"
  );
  const { selectedPlan, setSelectedPlan } = useChangePlanStatusState();
  const content = useContent();
  const modal = content.nabewerking.changeFlightPlanStatus.confirmStatusModal;

  function handleSubmit() {
    update({
      data: {
        id: selectedPlan?.id,
        status: "finished",
      },
      onSuccess: () => {
        setSelectedPlan(null);
        setOpen(false);
      },
    });
    logAction({
      message: "User clicked 'Wijzigen' button",
      step: "Confirm modal",
    });
  }

  const line1 = formatConfirmMessage(modal.body.line1, {
    plan: selectedPlan?.omschrijving ?? "",
    status: "uitgevoerd",
  });

  return (
    <Modal
      className="w-full relative max-w-xl rounded bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      isOpen={open}
      setIsOpen={setOpen}
    >
      <div className="relative">
        <ConfirmModalChrome
          title={modal.title}
          onClose={() => setOpen(false)}
          actions={
            <>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="gray-button"
              >
                {modal.buttons.confirm}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logAction({
                    message: "User clicked 'Cancel' button",
                    step: "Confirm modal",
                  });
                }}
                className="gray-button"
              >
                {modal.buttons.cancel}
              </button>
            </>
          }
        >
          <div className="space-y-2">
            <p className="text-[14px] text-gray-700">{line1}</p>
            <p className="text-[14px] text-gray-700">{modal.body.line2}.</p>
            <p className="text-[14px] text-gray-700">{modal.body.line3}</p>
          </div>
        </ConfirmModalChrome>
        <WizardLoadingOverlay show={loading} />
      </div>
    </Modal>
  );
}
