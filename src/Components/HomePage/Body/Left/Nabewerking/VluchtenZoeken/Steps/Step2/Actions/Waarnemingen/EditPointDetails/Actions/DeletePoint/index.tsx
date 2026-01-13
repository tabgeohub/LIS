import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import Modal from "Components/HomePage/Body/Common/Modal";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useState } from "react";
import { useDeleteData } from "utils/useDeleteData";

export default function DeletePoint({
  setOpenEdit,
}: {
  setOpenEdit: (value: boolean) => void;
}) {
  const logAction = useLogAction();

  const { selectedPoint, setSelectedPoint, selectedPlan, setSelectedPlan } =
    useFinishedPlansState();
  const [open, setOpen] = useState(false);

  const { deleteData, loading } = useDeleteData("/finished_plans/points");

  function handleDelete() {
    const point_id = selectedPoint?.id;
    const plan_id = selectedPlan?.id;
    const attachments = selectedPoint?.attachments.map(
      (attachment) => attachment.id
    );

    const data = JSON.stringify({
      point_id,
      plan_id,
      attachments,
    });

    deleteData(data, undefined, () => {
      setSelectedPlan({
        ...selectedPlan,
        // @ts-ignore
        points_data: selectedPlan?.points_data?.filter(
          (point) => point.id !== selectedPoint?.id
        ),
      });

      setOpenEdit(false);

      setSelectedPoint(null);
      setOpen(false);
    });

    logAction({
      message: "User clicked 'Delete' button",
      step: "Second step - Delete point",
    });
  }

  const content = useContent();

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);

          logAction({
            message: "User clicked 'Delete' button",
            step: "Second step - Edit point",
          });
        }}
        className="gray-button"
      >
        {content.common.verwijderen}
      </button>

      {/* Are you sure you want to delete this point? */}
      <Modal
        className="w-full max-h-[90vh] max-w-md rounded-xl bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
        isOpen={open}
        setIsOpen={setOpen}
      >
        <div className="flex relative flex-col items-center justify-center p-4">
          <p className="text-lg text-left font-semibold">
            {
              content.nabewerking.vluchtenZoeken.step2.waarnemingen
                .editPointDetails.deletePoint.text
            }
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setOpen(false);

                logAction({
                  message: "User clicked 'Delete' button",
                  step: "Second step - Edit point",
                });
              }}
              className="gray-button"
            >
              {content.common.annuleren}
            </button>

            <button
              onClick={() => {
                handleDelete();
              }}
              className="gray-button"
            >
              {content.common.verwijderen}
            </button>
          </div>
        </div>

        {loading && (
          <div className="absolute h-full w-full top-0 left-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
            <LoadingBars />
          </div>
        )}
      </Modal>
    </>
  );
}
