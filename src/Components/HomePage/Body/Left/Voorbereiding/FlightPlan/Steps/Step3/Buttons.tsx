import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useCreateData } from "utils/useCreateData";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useCancelCreateFlightPlan } from "hooks/handleCancel/useCancelCreateFlightPlan";
import { kaartlagenState } from "hooks/kaartlagen/kaartlagenState";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
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
  const { yellowGraphicsLayer, yellowGeometriesGraphicsLayer, clearGraphics } = useMapViewState();

  const { resetFeatures } = useResetFeatures();

  const { create, loading } = useCreateData("/flightPlans");
  const { selectedLayers } = kaartlagenState();

  const logAction = useLogAction();

  const {
    selectedPoints2,
    selectedPoints,
    selectedGeometries,
    selectedGeometries2,
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
  const { dbGeometries } = useGeometriesStore();

  const handleSubmit = () => {
    // Get all selected geometries (ensure they are arrays)
    const safeSelectedGeometries = Array.isArray(selectedGeometries) ? selectedGeometries : [];
    const safeSelectedGeometries2 = Array.isArray(selectedGeometries2) ? selectedGeometries2 : [];
    const allSelectedGeometryIds = [...safeSelectedGeometries, ...safeSelectedGeometries2];

    // Get the actual geometry objects
    const selectedGeometryObjects = dbGeometries.filter((geometry) =>
      allSelectedGeometryIds.includes(geometry.id)
    );

    // Extract all point IDs from selected geometries
    const geometryPointIds = selectedGeometryObjects.flatMap((geometry) =>
      geometry.points.map((point) => point.id)
    );

    // Combine all point IDs (selected points + points from selected geometries)
    const safeSelectedPoints = Array.isArray(selectedPoints) ? selectedPoints : [];
    const safeSelectedPoints2 = Array.isArray(selectedPoints2) ? selectedPoints2 : [];
    const allPointIds = [...safeSelectedPoints, ...safeSelectedPoints2, ...geometryPointIds];

    // Remove duplicates
    const uniquePointIds = Array.from(new Set(allPointIds));

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
      points: uniquePointIds,
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
          yellowGeometriesGraphicsLayer?.graphics.removeAll();
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
          resetFeatures();

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
