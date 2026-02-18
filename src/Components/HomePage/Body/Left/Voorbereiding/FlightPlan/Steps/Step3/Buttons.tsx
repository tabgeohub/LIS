import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useFlightPlanState } from "../../helpers/flightPlanStates";
import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useCreateData } from "utils/useCreateData";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useCancelCreateFlightPlan } from "hooks/handleCancel/useCancelCreateFlightPlan";
import { kaartlagenState } from "hooks/kaartlagen/kaartlagenState";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { usePointsStore } from "hooks/features/usePointsStore";
import toast from "react-hot-toast";

export default function Buttons({
  setOpenFilter,
  basemapString,
}: {
  setOpenFilter: (value: boolean) => void;
  basemapString: string;
}) {
  const { user } = useAuth();
  const { resetFilters } = usePointsFilterStore();
  const handleCancel = useCancelCreateFlightPlan();
  const { yellowGraphicsLayer, clearGraphics } = useMapViewState();

  const { setPoints, dbPoints } = usePointsStore();

  const { create, loading } = useCreateData("/flightPlans");
  const { selectedLayers } = kaartlagenState();

  const logAction = useLogAction();

  const {
    selectedPoints2,
    selectedPoints,
    setStep,
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
    clear,
  } = useFlightPlanState();

  const { map } = useMapViewState();

  const handleSubmit = () => {
    const attributes = {
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
      points: [...selectedPoints, ...selectedPoints2],
      regio_id: user?.role,
      basemap: basemapString,
      layers: selectedLayers.join(","),
      user_id: user?.user_id,
      status: "pre-prepared",
    };

    logAction({
      message: "User clicked 'Save' button to save flight plan data",
      step: "Third step",
      newData: {
        ...attributes,
      },
    });

    create(attributes, () => {
      setTimeout(() => {
        toast(
          "Ga naar “Vluchtplan-informatie” om je vlucht te controleren of bij te werken.",
          {
            duration: 5000,
          }
        );
      }, 1000);

      clear();
      clearGraphics();
    });
  };

  const content = useContent();

  return (
    <>
      <button
        onClick={() => {
          setStep(3);
          resetFilters();

          logAction({
            message: "User clicked 'Next' button",
            step: "Third step",
          });

          yellowGraphicsLayer?.graphics.removeAll();
        }}
        className="gray-button"
      >
        {content.common.vorige}
      </button>

      <button
        onClick={() => {
          setOpenFilter(true);
          logAction({
            message: "User clicked 'Filter' button",
            step: "Third step",
          });
        }}
        className="gray-button"
      >
        {content.common.filteren}
      </button>

      <button
        onClick={() => {
          handleSubmit();

          logAction({
            message: "User clicked 'Save' button",
            step: "Third step",
          });

          const layersToRemove = map?.layers.filter(
            (layer) => layer.type !== "graphics"
          );

          layersToRemove?.forEach((layer) => {
            map?.remove(layer);
          });
        }}
        className="gray-button"
      >
        {content.common.opslaan}
      </button>

      <button
        onClick={() => {
          setPoints(dbPoints);

          handleCancel();
          resetFilters();
          clear();

          logAction({
            message: "User clicked 'Cancel' button",
            step: "Third step",
          });
        }}
        className="gray-button"
      >
        {content.common.annuleren}
      </button>

      {loading && (
        <div className="absolute inset-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
          <LoadingBars />
        </div>
      )}
    </>
  );
}
