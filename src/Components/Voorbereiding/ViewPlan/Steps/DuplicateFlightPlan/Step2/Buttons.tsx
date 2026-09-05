import { useOpenTable } from "hooks/zustand/ui";
import { useViewPlanState } from "Components/Voorbereiding/ViewPlan/useViewPlanState";
import { usePlanDuplicateState } from "../../../helpers/usePlanDuplicateState";
import { useCreateData } from "api-hooks/mutations";
import { kaartlagenState } from "hooks/kaartlagen/kaartlagenState";
import { useSelectedBasemapState } from "hooks/kaartlagen/useBasemapStore";
import { useAuth } from "hooks/zustand/ui";
import { assembleFlightPlanCreateAttributes } from "Components/HomePage/hooks/flightPlan/assembleFlightPlanCreateAttributes";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";

export default function Buttons({
  handleCancel,
  refetch,
}: {
  handleCancel: () => void;
  refetch: () => void;
}) {
  const { setStep, setSelectedIndex } = useViewPlanState();
  const { selectedBasemap } = useSelectedBasemapState();
  const store = usePlanDuplicateState();
  const { duplicatedFlightPlan } = store;
  const { setPointsTable, setGeometriesTable, setOpenTable } = useOpenTable();
  const { create } = useCreateData("/flightPlans");
  const { user } = useAuth();
  const { selectedLayers } = kaartlagenState();
  const { labels } = useWizardButtons("View plan - Duplicate Step 2");

  const submitStep2 = () => {
    const attributes = assembleFlightPlanCreateAttributes({
      store,
      points: duplicatedFlightPlan?.points.flatMap((point) => point.id) ?? [],
      basemap: selectedBasemap,
      layers: selectedLayers,
      userId: user?.user_id,
      regioId: user.role,
    });

    create({
      data: attributes,
      onSuccess: () => {
        refetch();
        setStep(1);
      },
    });
  };

  return (
    <WizardButtonBar
      className=""
      buttons={[
        {
          label: labels.vorige,
          onClick: () =>
            runWizardCleanup({ actions: [
              () => setStep(1),
              () => setSelectedIndex(0),
              () => setPointsTable([]),
              () => setGeometriesTable([]),
              () => setOpenTable(false),
            ] }),
        },
        {
          label: labels.opslaan,
          onClick: submitStep2,
        },
        {
          label: labels.annuleren,
          onClick: handleCancel,
        },
      ]}
    />
  );
}
