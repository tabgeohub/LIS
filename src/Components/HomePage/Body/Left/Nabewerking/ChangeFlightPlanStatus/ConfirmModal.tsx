import Modal from "Components/HomePage/Body/Common/Modal";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { IoMdClose } from "react-icons/io";
import { useChangePlanStatusState } from "hooks/zustand/nabewerking/useChangePlanStatusState";
import { useUpdateData } from "utils/useUpdateData";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

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

  function handleSubmit() {
    update(
      {
        id: selectedPlan?.id,
        status: "finished",
      },
      () => {
        setSelectedPlan(null);
        setOpen(false);
      }
    );

    logAction({
      message: "User clicked 'Wijzigen' button",
      step: "Confirm modal",
    });
  }

  const content = useContent();

  return (
    <Modal
      className="w-full relative max-w-xl rounded bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      isOpen={open}
      setIsOpen={setOpen}
    >
      <div className="relative">
        <div className="flex justify-between items-center px-2 py-2">
          <p></p>

          <p className="text-gray-500 text-[16px]">
            {
              content.nabewerking.changeFlightPlanStatus.confirmStatusModal
                .title
            }
          </p>

          <button onClick={() => setOpen(false)}>
            <IoMdClose className="text-gray-500 text-lg" />
          </button>
        </div>

        <div className="w-full h-0.5 bg-gray-300" />

        <div className="py-2 px-3 space-y-2">
          <p className="text-[14px] text-gray-700">
            {content.nabewerking.changeFlightPlanStatus.confirmStatusModal.body.line1
              .split("'{plan}'")
              .at(0)}
            <span className="font-semibold text-gray-700">
              '{selectedPlan?.omschrijving}'
            </span>{" "}
            {content.nabewerking.changeFlightPlanStatus.confirmStatusModal.body.line1
              .split("'{plan}'")
              .at(1)
              ?.replace("'{status}'", "'uitgevoerd'")}
          </p>

          <p className="text-[14px] text-gray-700">
            {
              content.nabewerking.changeFlightPlanStatus.confirmStatusModal.body
                .line2
            }
            .{" "}
          </p>

          <p className="text-[14px] text-gray-700">
            {
              content.nabewerking.changeFlightPlanStatus.confirmStatusModal.body
                .line3
            }
          </p>

          <div className="flex justify-end mt-6 gap-x-2">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="gray-button"
            >
              {
                content.nabewerking.changeFlightPlanStatus.confirmStatusModal
                  .buttons.confirm
              }
            </button>

            <button
              onClick={() => {
                setOpen(false);

                logAction({
                  message: "User clicked 'Cancel' button",
                  step: "Confirm modal",
                });
              }}
              className="gray-button"
            >
              {
                content.nabewerking.changeFlightPlanStatus.confirmStatusModal
                  .buttons.cancel
              }
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="absolute h-full w-full top-0 left-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <LoadingBars />
          </div>
        </div>
      )}
    </Modal>
  );
}
