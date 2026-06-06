import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useUpdateData } from "utils/useUpdateData";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import useLogAction from "hooks/useLogAction";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import {
  buildUpdatedPlanFromForm,
  buildViewPlanUpdatePayload,
  replacePlanInList,
} from "./helpers/buildUpdatedPlanFromForm";

export default function Buttons({
  vluchtnummer,
  handleCancel,
  refetch,
}: {
  vluchtnummer: string;
  handleCancel: () => void;
  refetch: () => void;
}) {
  const logAction = useLogAction();
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

    const payload = buildViewPlanUpdatePayload(
      selectedPlan,
      form,
      pointsTable,
      geometriesTable,
      user.user_id
    );

    const updatedPlan = buildUpdatedPlanFromForm(
      selectedPlan,
      form,
      pointsTable,
      geometriesTable
    );

    update(payload, async () => {
      setFilteredPlans(replacePlanInList(filteredPlans, updatedPlan));
      setInitialPlans(replacePlanInList(initialPlans, updatedPlan));
      setSelectedPlan(updatedPlan);

      await refetch();

      setStep(1);

      logAction({
        message: "User clicked 'Save' button",
        step: "View plan - Step 2",
        newData: payload,
      });
    });
  };

  return (
    <>
      <button
        onClick={() => {
          resetFeatures();

          yellowGraphicsLayer?.graphics.removeAll();

          // @ts-ignore
          setSelectedPlan(null);

          setStep(1);
          setSelectedIndex(0);
          setPointsTable([]);
          setGeometriesTable([]);
          setOpenTable(false);

          logAction({
            message: "User clicked 'Back' button",
            step: "View plan - Step 2",
          });
        }}
        className="gray-button"
      >
        Vorige
      </button>

      <button
        className="gray-button"
        onClick={() => {
          setStep(3);

          logAction({
            message: "User clicked 'Edit point' button",
            step: "View plan - Step 2",
          });
        }}
      >
        Aandachtspunt bewerken
      </button>

      <button className="gray-button" onClick={submitStep2}>
        Opslaan
      </button>

      <button
        onClick={() => {
          resetFeatures();

          handleCancel();

          logAction({
            message: "User clicked 'Cancel' button",
            step: "View plan - Step 2",
          });
        }}
        className="gray-button"
      >
        Annuleren
      </button>
    </>
  );
}
