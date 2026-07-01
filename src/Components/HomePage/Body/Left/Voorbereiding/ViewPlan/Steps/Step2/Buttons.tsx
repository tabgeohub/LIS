import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useUpdateData } from "utils/useUpdateData";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import {
  buildUpdatedPlanFromForm,
  buildViewPlanUpdatePayload,
  replacePlanInList,
} from "./helpers/buildUpdatedPlanFromForm";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";

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
  const {
    setStep,
    omschrijving,
    waarnemer,
    piloot,
    datum,
    geplandeVliegduur,
    typeLuchtvaartuig,
    aantalPassagiers,
    doelEnHoofdthema,
    aanvullendeInfo,
    selectedPlan,
    setSelectedIndex,
    setFilteredPlans,
    filteredPlans,
    setSelectedPlan,
    setInitialPlans,
    initialPlans,
  } = useViewPlanState();
  const { update } = useUpdateData(`/flightPlans/vluchtplans`);
  const { pointsTable, geometriesTable, setPointsTable, setGeometriesTable, setOpenTable } =
    useOpenTable();
  const { resetFeatures } = useResetFeatures();
  const { yellowGraphicsLayer } = useMapViewState();

  const submitStep2 = () => {
    if (!selectedPlan || user.user_id === undefined || user.user_id === 0) {
      return;
    }

    const form = {
      vluchtnummer,
      omschrijving,
      waarnemer,
      piloot,
      datum,
      geplandeVliegduur,
      typeLuchtvaartuig,
      aantalPassagiers,
      doelEnHoofdthema,
      aanvullendeInfo,
    };

    const payload = buildViewPlanUpdatePayload({
      selectedPlan,
      form,
      pointsTable,
      geometriesTable,
      userId: user.user_id,
    });

    const updatedPlan = buildUpdatedPlanFromForm({
      selectedPlan,
      form,
      pointsTable,
      geometriesTable,
    });

    update(payload, async () => {
      setFilteredPlans(replacePlanInList(filteredPlans, updatedPlan));
      setInitialPlans(replacePlanInList(initialPlans, updatedPlan));
      setSelectedPlan(updatedPlan);
      await refetch();
      setStep(1);
      logStep("User clicked 'Save' button", payload);
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
