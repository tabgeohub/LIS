import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { FlightPlanType } from "Types";
import { useUpdateData } from "utils/useUpdateData";

export default function Buttons({
  setSubStep,
  selectedPlan,
}: {
  setSubStep: (step: number) => void;
  selectedPlan: FlightPlanType;
}) {
  const logAction = useLogAction();

  const content = useContent();

  const { setSelectedPoint, setMainStep, selectedPoint } =
    useDeletePointState();

  const { update } = useUpdateData(`/flightPlans/vluchtplans/points`);

  function handleSubmit() {
    update(
      {
        id: selectedPlan.id,
        points: [
          ...selectedPlan.points.flatMap((point) => point.id),
          selectedPoint?.id,
        ],
      },
      () => {
        setSubStep(2);
      }
    );

    logAction({
      message: "User clicked 'Save' button",
      step: "Add to plan - Step no",
      newData: {
        point: selectedPoint?.omschrijving,
      },
    });
  }

  return (
    <div className="flex justify-end gap-x-1 text-[12px] mr-4 mb-0">
      <button
        disabled={selectedPlan === null}
        onClick={handleSubmit}
        className="gray-button"
      >
        {content.common.volgende}
      </button>

      <button
        onClick={() => {
          setMainStep("main");
          setSelectedPoint(null);

          logAction({
            message: "User clicked 'Cancel' button",
            step: "Add to plan - Step no",
          });
        }}
        className="gray-button"
      >
        {content.common.annuleren}
      </button>
    </div>
  );
}
