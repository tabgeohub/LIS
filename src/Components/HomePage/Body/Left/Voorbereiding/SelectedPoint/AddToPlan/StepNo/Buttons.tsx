import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import useLogAction from "hooks/useLogAction";
import { FlightPlanType } from "Types";
import { useUpdateData } from "utils/useUpdateData";

export default function Buttons({
  setSubStep,
  setStep,
  selectedPlan,
}: {
  setSubStep: (step: number) => void;
  setStep: (step: number) => void;
  selectedPlan: FlightPlanType | null;
}) {
  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { clickedPoint } = usePopUpState();

  const { update } = useUpdateData(`/flightPlans/vluchtplans/points`);

  const logAction = useLogAction();

  function handleSubmit() {
    if (selectedPlan === null) return;

    setSubStep(2);

    update(
      {
        id: selectedPlan.id,
        points: [
          ...selectedPlan.points.flatMap((point) => point.id),
          clickedPoint?.id,
        ],
      },
      () => {
        setSelectedBottomTab("Kaartlagenlijst");
      }
    );

    logAction({
      message: "User clicked 'Add' button",
      step: "Add to plan - Step no",
    });
  }

  return (
    <div className="flex justify-end gap-x-1 text-[12px] mt-6">
      <button
        className="gray-button"
        onClick={() => {
          setStep(1);

          logAction({
            message: "User clicked 'Back' button",
            step: "Add to plan - Step no",
          });
        }}
      >
        Vorige
      </button>

      <button onClick={handleSubmit} className="gray-button">
        Volgende
      </button>

      <button
        onClick={() => {
          setSelectedTab("none");
          setSelectedBottomTab("Kaartlagenlijst");

          logAction({
            message: "User clicked 'Cancel' button",
            step: "Add to plan - Step no",
          });
        }}
        className="gray-button"
      >
        Annuleren
      </button>
    </div>
  );
}
