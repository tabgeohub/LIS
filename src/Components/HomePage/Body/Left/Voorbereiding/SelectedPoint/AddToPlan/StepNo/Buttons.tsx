import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import useLogAction from "hooks/useLogAction";
import { useUpdateData } from "utils/useUpdateData";
import type { AddToPlanStepButtonsProps } from "../addToPlanStepButtonsProps";
import { useAddToPlanWizardNavigation } from "../addToPlanWizardNavigation";
import { AddToPlanWizardButtonBar } from "../AddToPlanWizardButtonBar";

export default function Buttons({
  setSubStep,
  setStep,
  selectedPlan,
}: AddToPlanStepButtonsProps) {
  const { cancelToKaartlagenlijst, setSelectedBottomTab } =
    useAddToPlanWizardNavigation();
  const { clickedPoint } = usePopUpState();
  const { update } = useUpdateData(`/flightPlans/vluchtplans/points`);
  const logAction = useLogAction();

  function handleSubmit() {
    if (selectedPlan === null) return;

    setSubStep(2);
    update({
      data: {
        id: selectedPlan.id,
        points: [
          ...selectedPlan.points.flatMap((point) => point.id),
          clickedPoint?.id,
        ],
      },
      onSuccess: () => setSelectedBottomTab("Kaartlagenlijst"),
    });

    logAction({
      message: "User clicked 'Add' button",
      step: "Add to plan - Step no",
    });
  }

  return (
    <AddToPlanWizardButtonBar
      onBack={() => {
        setStep(1);
        logAction({
          message: "User clicked 'Back' button",
          step: "Add to plan - Step no",
        });
      }}
      onNext={handleSubmit}
      onCancel={() => {
        cancelToKaartlagenlijst();
        logAction({
          message: "User clicked 'Cancel' button",
          step: "Add to plan - Step no",
        });
      }}
    />
  );
}
