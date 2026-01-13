import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { ActionType } from "../..";
import { useUpdateData } from "utils/useUpdateData";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

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

  const logAction = useLogAction();

  function handleSubmit() {
    if (!selectedPlan) return;

    const attributes = {
      vluchtnummer: selectedPlan.vluchtnummer,
      omschrijving,
      waarnemer,
      piloot,
      datum,
      vliegduur: geplandeVliegduur,
      luchtvaartuig: typeLuchtvaartuig,
      passagiers: aantalPassagiers,
      hoofdthema: doelEnHoofdthema,
      aanvullende: aanvullendeInfo,
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

    logAction({
      message: "User clicked 'Save' button to edit flight plan data",
      step: "Second step - Edit flight",
      newData: {
        omschrijving: selectedPlan.omschrijving,
        waarnemer: selectedPlan.waarnemer,
        piloot: selectedPlan.piloot,
        datum: selectedPlan.datum,
        vliegduur: selectedPlan.vliegduur,
        luchtvaartuig: selectedPlan.luchtvaartuig,
        passagiers: selectedPlan.passagiers,
        hoofdthema: selectedPlan.hoofdthema,
        aanvullende: selectedPlan.aanvullende,
      },
    });
  }

  const content = useContent();

  return (
    <>
      <div className="flex justify-end gap-x-1 text-[12px] mt-2">
        <button
          onClick={() => {
            setAction("none");

            logAction({
              message: "User clicked 'Previous' button",
              step: "Second step - Edit flight",
            });
          }}
          className="gray-button"
        >
          {content.common.vorige}
        </button>

        <button onClick={handleSubmit} className="gray-button">
          {content.common.opslaan}
        </button>

        <button
          onClick={() => {
            setAction("none");

            logAction({
              message: "User clicked 'Cancel' button",
              step: "Second step - Edit flight",
            });
          }}
          className="gray-button"
        >
          {content.common.annuleren}
        </button>
      </div>

      {loading && (
        <div className="absolute h-full w-full top-10 left-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
          <LoadingBars />
        </div>
      )}
    </>
  );
}
