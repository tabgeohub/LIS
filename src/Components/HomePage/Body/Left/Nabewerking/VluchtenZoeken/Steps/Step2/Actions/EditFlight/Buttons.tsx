import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { ActionType } from "../..";
import { buildFlightPlanPayloadFields } from "hooks/flightPlan/usePopulateFlightPlanFormEffect";
import { useUpdateData } from "utils/useUpdateData";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import WizardLoadingOverlay from "Components/HomePage/Body/Common/Wizard/WizardLoadingOverlay";

export default function Buttons({
  setAction,
}: {
  setAction: (action: ActionType) => void;
}) {
  const {
    selectedPlan,
    setSelectedPlan,
    omschrijving,
    waarnemer,
    piloot,
    datum,
    geplandeVliegduur,
    typeLuchtvaartuig,
    aantalPassagiers,
    doelEnHoofdthema,
    aanvullendeInfo,
  } = useFinishedPlansState();
  const { user } = useAuth();
  const { update, loading } = useUpdateData(`/flightPlans/vluchtplans`);
  const { logStep, withLog, labels } = useWizardButtons("Second step - Edit flight");

  function handleSubmit() {
    if (!selectedPlan) return;

    const attributes = {
      vluchtnummer: selectedPlan.vluchtnummer,
      ...buildFlightPlanPayloadFields({
        omschrijving,
        waarnemer,
        piloot,
        datum,
        geplandeVliegduur,
        typeLuchtvaartuig,
        aantalPassagiers,
        doelEnHoofdthema,
        aanvullendeInfo,
      }),
      points: selectedPlan.points_data.flatMap((point) => point.id),
      user_id: user.user_id,
      status: selectedPlan.status,
      id: selectedPlan.id,
    };

    update(attributes, (responseData) => {
      setSelectedPlan({
        ...selectedPlan,
        omschrijving: responseData.result.omschrijving,
        waarnemer: responseData.result.waarnemer,
        piloot: responseData.result.piloot,
        datum: responseData.result.datum,
        vliegduur: responseData.result.vliegduur,
        luchtvaartuig: responseData.result.luchtvaartuig,
        passagiers: responseData.result.passagiers,
        hoofdthema: responseData.result.hoofdthema,
        aanvullende: responseData.result.aanvullende,
      });
      setAction("none");
    });

    logStep("User clicked 'Save' button to edit flight plan data", {
      omschrijving: selectedPlan.omschrijving,
      waarnemer: selectedPlan.waarnemer,
      piloot: selectedPlan.piloot,
      datum: selectedPlan.datum,
      vliegduur: selectedPlan.vliegduur,
      luchtvaartuig: selectedPlan.luchtvaartuig,
      passagiers: selectedPlan.passagiers,
      hoofdthema: selectedPlan.hoofdthema,
      aanvullende: selectedPlan.aanvullende,
    });
  }

  return (
    <>
      <WizardButtonBar
        className="flex justify-end gap-x-1 text-[12px] mt-2"
        buttons={[
          {
            label: labels.vorige,
            onClick: withLog("User clicked 'Previous' button", () => setAction("none")),
          },
          {
            label: labels.opslaan,
            onClick: handleSubmit,
          },
          {
            label: labels.annuleren,
            onClick: withLog("User clicked 'Cancel' button", () => setAction("none")),
          },
        ]}
      />
      <WizardLoadingOverlay show={loading} variant="offset" />
    </>
  );
}
