import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useUpdateData } from "utils/useUpdateData";
import { useViewPlanState } from "../../helpers/useViewPlanState";
import useLogAction from "hooks/useLogAction";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";

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
  } = useViewPlanState();

  const { update } = useUpdateData(`/flightPlans/vluchtplans`);

  const { setPointsTable, setOpenTable } = useOpenTable();

  const { resetFeatures } = useResetFeatures();

  const { yellowGraphicsLayer } = useMapViewState();

  const submitStep2 = () => {
    if (selectedPlan) {
      const pointIds = selectedPlan.points.map((p) => Number(p.id));

      const payload = {
        vluchtnummer: vluchtnummer,
        omschrijving: omschrijving,
        waarnemer: waarnemer,
        piloot: piloot,
        datum: datum,
        vliegduur: geplandeVliegduur,
        luchtvaartuig: typeLuchtvaartuig,
        passagiers: aantalPassagiers,
        hoofdthema: doelEnHoofdthema,
        aanvullende: aanvullendeInfo,
        points: pointIds,
        id: selectedPlan.id,
        status: selectedPlan.status,
        user_id: 1,
      };

      update(payload);

      refetch();

      const updatedFilteredPlans = filteredPlans.map((plan) => {
        if (plan.id === selectedPlan.id) {
          return {
            ...plan,
            status: selectedPlan.status,
          };
        }
        return plan;
      });

      setFilteredPlans(updatedFilteredPlans);

      setStep(1);

      logAction({
        message: "User clicked 'Save' button",
        step: "View plan - Step 2",
      });
    }
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
