import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import { useCreateData } from "utils/useCreateData";
import { kaartlagenState } from "hooks/kaartlagen/kaartlagenState";
import { useSelectedBasemapState } from "hooks/kaartlagen/useBasemapStore";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function Buttons() {
  const {
    clear,
    setStep,
    currentPoints,
    newPoints,
    omschrijving,
    waarnemer,
    piloot,
    datum,
    geplandeVliegduur,
    typeLuchtvaartuig,
    aantalPassagiers,
    doelEnHoofdthema,
    aanvullendeInfo,
    vluchtnummer,
    selectedPlan,
  } = useReuseFlightPlan();
  const { user } = useAuth();

  const { create, loading } = useCreateData(`/flightPlans`);

  const { selectedLayers } = kaartlagenState();
  const { selectedBasemap } = useSelectedBasemapState();
  const { graphicsLayer } = useMapViewState();

  const handleCancel = useHandleCancel();

  const logAction = useLogAction();

  const handleSubmit = async () => {
    const newPlan = {
      vluchtnummer,
      omschrijving,
      waarnemer,
      piloot,
      datum,
      vliegduur: geplandeVliegduur,
      luchtvaartuig: typeLuchtvaartuig,
      passagiers: aantalPassagiers,
      hoofdthema: doelEnHoofdthema,
      aanvullende: aanvullendeInfo,
      points: [...currentPoints, ...newPoints],
      basemap: selectedBasemap,
      layers: selectedLayers.join(","),
      user_id: user.user_id,
      status: "pre-prepared",
      copiedFrom: selectedPlan?.id,
      regio_id: user.role,
    };

    create(newPlan, () => {
      graphicsLayer?.graphics.removeAll();
      clear();
    });

    logAction({
      message: "User clicked 'Save' button to save copied flight plan data",
      step: "Second step",
      newData: {
        ...newPlan,
      },
    });
  };

  const content = useContent();

  return (
    <>
      <div className="flex justify-end gap-x-2">
        <button
          className="gray-button"
          onClick={() => {
            graphicsLayer?.graphics.removeAll();
            setStep(1);
            clear();
          }}
        >
          {content.common.vorige}
        </button>

        <button
          disabled={!vluchtnummer || !datum}
          onClick={handleSubmit}
          className="gray-button"
        >
          {content.common.opslaan}
        </button>

        <button
          className="gray-button"
          onClick={() => {
            handleCancel();
            clear();
          }}
        >
          {content.common.annuleren}
        </button>
      </div>

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full ">
          <div className="relative h-full w-full">
            <div className="absolute top-0 left-0 h-full w-full bg-gray-500/20 bg-opacity-50 z-10" />

            <div className="absolute top-[30%] left-[50%] translate-x-[-50%] z-20">
              <LoadingBars />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
