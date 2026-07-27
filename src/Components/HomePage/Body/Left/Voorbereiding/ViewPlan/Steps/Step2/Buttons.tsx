import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useUpdateData } from "utils/useUpdateData";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import {
  applyViewPlanStep2SaveSuccess,
  buildViewPlanStep2SubmitContext,
  canSubmitViewPlanStep2,
} from "./submitViewPlanStep2";

export default function Buttons({
  vluchtnummer,
  handleCancel,
  refetch,
}: {
  vluchtnummer: string;
  handleCancel: () => void;
  refetch: () => void;
}) {
  const { logStep, withLog } = useWizardButtons("View plan - Step 2");
  const { user } = useAuth();
  const store = useViewPlanState();
  const {
    setStep,
    selectedPlan,
    setSelectedIndex,
    setFilteredPlans,
    filteredPlans,
    setSelectedPlan,
    setInitialPlans,
    initialPlans,
  } = store;
  const { update } = useUpdateData(`/flightPlans/vluchtplans`);
  const { pointsTable, geometriesTable, setPointsTable, setGeometriesTable, setOpenTable } =
    useOpenTable();
  const { resetFeatures } = useResetFeatures();
  const { yellowGraphicsLayer } = useMapViewState();

  const submitStep2 = () => {
    if (!canSubmitViewPlanStep2({ selectedPlan, userId: user.user_id })) {
      return;
    }

    const { payload, updatedPlan } = buildViewPlanStep2SubmitContext({
      store,
      vluchtnummer,
      pointsTable,
      geometriesTable,
      userId: user.user_id,
    });

    update({
      data: payload,
      onSuccess: applyViewPlanStep2SaveSuccess({
        updatedPlan,
        filteredPlans,
        initialPlans,
        payload,
        setFilteredPlans,
        setInitialPlans,
        setSelectedPlan,
        refetch,
        setStep,
        logStep,
      }),
    });
  };

  const resetViewPlanStep = () =>
    runWizardCleanup([
      resetFeatures,
      () => yellowGraphicsLayer?.graphics.removeAll(),
      // @ts-ignore
      () => setSelectedPlan(null),
      () => setStep(1),
      () => setSelectedIndex(0),
      () => setPointsTable([]),
      () => setGeometriesTable([]),
      () => setOpenTable(false),
    ]);

  return (
    <WizardButtonBar
      className=""
      buttons={[
        {
          label: "Vorige",
          onClick: withLog("User clicked 'Back' button", resetViewPlanStep),
        },
        {
          label: "Aandachtspunt bewerken",
          onClick: withLog("User clicked 'Edit point' button", () => setStep(3)),
        },
        {
          label: "Opslaan",
          onClick: submitStep2,
        },
        {
          label: "Annuleren",
          onClick: withLog("User clicked 'Cancel' button", () =>
            runWizardCleanup([resetFeatures, handleCancel])
          ),
        },
      ]}
    />
  );
}
