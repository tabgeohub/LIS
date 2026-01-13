import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import Modal from "Components/HomePage/Body/Common/Modal";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useDeleteFlightPlan } from "hooks/zustand/useDeleteFlightPlan";
import { IoMdClose } from "react-icons/io";
import { useDeleteData } from "utils/useDeleteData";

export default function CongfirmationModal({
  refetch,
}: {
  refetch: () => void;
}) {
  const logAction = useLogAction();

  const { selectedPlan, setOpenDeleteModal, openDeleteModal } =
    useDeleteFlightPlan();

  const { deleteData, loading } = useDeleteData("/flightPlans");

  function handleDeletePlan() {
    deleteData(String(selectedPlan?.id), undefined, () => {
      refetch();
      setOpenDeleteModal(false);
    });

    logAction({
      message: `User clicked 'Delete' button to delete flight plan  : ${selectedPlan?.vluchtnummer}`,
      step: "Confirm modal",
    });
  }

  const content = useContent();

  return (
    <Modal
      className="w-full max-w-md rounded relative bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      isOpen={openDeleteModal}
      setIsOpen={setOpenDeleteModal}
    >
      <div className="">
        <div className="flex justify-between items-center px-2 py-2">
          <p></p>

          <p className="text-gray-500 text-[16px]">
            {content.voorbereiding.vluchtplanVerwijderen.comfirmModal.header}
          </p>

          <button onClick={() => setOpenDeleteModal(false)}>
            <IoMdClose className="text-gray-500 text-lg" />
          </button>
        </div>

        <div className="w-full h-0.5 bg-gray-300" />

        <div className="py-2 px-3">
          <p className="text-[14px] text-gray-700">
            {content.voorbereiding.vluchtplanVerwijderen.comfirmModal.messageP1}{" "}
            <strong>{selectedPlan?.vluchtnummer}</strong>
            {content.voorbereiding.vluchtplanVerwijderen.comfirmModal.messageP2}
          </p>

          <div className="flex justify-end mt-6 gap-x-2">
            <button onClick={handleDeletePlan} className="gray-button">
              {content.common.ok}
            </button>

            <button
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
          </div>
        </div>
      </div>

      {loading && (
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
