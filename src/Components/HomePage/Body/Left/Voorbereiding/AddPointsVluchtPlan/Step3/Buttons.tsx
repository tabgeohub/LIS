import { useUpdateData } from "utils/useUpdateData";
import { useAddPointStates } from "../../../../../../../hooks/zustand/useAddPointStates";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { usePointsStore } from "hooks/features/usePointsStore";

export default function Buttons() {
  const { setPoints, dbPoints } = usePointsStore();
  const logAction = useLogAction();

  const {
    selectedPoints,
    setFilteredPoints,
    setSelectedPoints,
    setSelectedPoints2,
    selectedPlan,
    selectedPoints2,
    clear,
    setStep,
    setOpenFilter,
  } = useAddPointStates();

  const handleCancel = useHandleCancel();

  const { update, loading } = useUpdateData(`/flightPlans/vluchtplans/points`);

  function handleSubmit() {
    update(
      {
        points: [
          ...selectedPlan?.points.flatMap((p) => p.id)!,
          ...selectedPoints,
          ...selectedPoints2,
        ],
        id: selectedPlan?.id,
      },
      () => {
        setStep(1);
        setSelectedPoints2([]);
        setSelectedPoints([]);
        setFilteredPoints([]);
        clear();
      }
    );
  }

  const content = useContent();

  return (
    <>
      <div className="flex justify-end gap-x-1 text-[12px]">
        <button
          onClick={() => {
            setStep(2);

            logAction({
              message: "User clicked 'Next' button",
              step: "Third step",
            });
          }}
          className="gray-button"
        >
          {content.common.vorige}
        </button>

        <button
          onClick={() => {
            setOpenFilter(true);

            logAction({
              message: "User clicked 'Filter' button",
              step: "Third step",
            });
          }}
          className="gray-button"
        >
          {content.common.filteren}
        </button>

        <button
          onClick={() => {
            handleSubmit();

            logAction({
              message: "User clicked 'Save' button",
              step: "Third step",
            });
          }}
          className="gray-button"
        >
          {content.common.toevoegen}
        </button>

        <button
          onClick={() => {
            setPoints(dbPoints);

            handleCancel();
            clear();

            logAction({
              message: "User clicked 'Cancel' button",
              step: "Third step",
            });
          }}
          className="gray-button"
        >
          {content.common.annuleren}
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
          <LoadingBars />
        </div>
      )}
    </>
  );
}
