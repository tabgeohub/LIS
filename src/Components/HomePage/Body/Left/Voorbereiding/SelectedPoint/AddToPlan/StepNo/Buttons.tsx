import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import useLogAction from "hooks/useLogAction";
import { FlightPlanType } from "Types";
import { useUpdateData } from "utils/useUpdateData";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { WIZARD_BUTTON_BAR_CLASS } from "Components/HomePage/Body/Common/Wizard/wizardButtonBarClass";

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
    <WizardButtonBar
      className={WIZARD_BUTTON_BAR_CLASS}
      buttons={[
        {
          label: "Vorige",
          onClick: () => {
            setStep(1);
            logAction({
              message: "User clicked 'Back' button",
              step: "Add to plan - Step no",
            });
          },
        },
        { label: "Volgende", onClick: handleSubmit },
        {
          label: "Annuleren",
          onClick: () => {
            setSelectedTab("none");
            setSelectedBottomTab("Kaartlagenlijst");
            logAction({
              message: "User clicked 'Cancel' button",
              step: "Add to plan - Step no",
            });
          },
        },
      ]}
    />
  );
}
