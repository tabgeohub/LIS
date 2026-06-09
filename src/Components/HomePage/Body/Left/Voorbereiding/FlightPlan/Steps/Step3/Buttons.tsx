import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useCreateData } from "utils/useCreateData";
import { useCancelCreateFlightPlan } from "hooks/handleCancel/useCancelCreateFlightPlan";
import { kaartlagenState } from "hooks/kaartlagen/kaartlagenState";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import toast from "react-hot-toast";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import WizardLoadingOverlay from "Components/HomePage/Body/Common/Wizard/WizardLoadingOverlay";

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
  const {
    yellowGraphicsLayer,
    yellowGeometriesGraphicsLayer,
    clearGraphics,
    map,
  } = useMapViewState();
  const { resetFeatures } = useResetFeatures();
  const { create, loading } = useCreateData("/flightPlans");
  const { selectedLayers } = kaartlagenState();
  const { logStep, withLog, labels } = useWizardButtons("Third step");
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
  const { dbGeometries } = useGeometriesStore();

  const handleSubmit = () => {
    const safeSelectedGeometries = Array.isArray(selectedGeometries)
      ? selectedGeometries
      : [];
    const safeSelectedGeometries2 = Array.isArray(selectedGeometries2)
      ? selectedGeometries2
      : [];
    const allSelectedGeometryIds = [
      ...safeSelectedGeometries,
      ...safeSelectedGeometries2,
    ];
    const selectedGeometryObjects = dbGeometries.filter((geometry) =>
      allSelectedGeometryIds.includes(geometry.id)
    );
    const geometryPointIds = selectedGeometryObjects.flatMap((geometry) =>
      geometry.points.map((point) => point.id)
    );
    const safeSelectedPoints = Array.isArray(selectedPoints)
      ? selectedPoints
      : [];
    const safeSelectedPoints2 = Array.isArray(selectedPoints2)
      ? selectedPoints2
      : [];
    const allPointIds = [
      ...safeSelectedPoints,
      ...safeSelectedPoints2,
      ...geometryPointIds,
    ];
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

    logStep("User clicked 'Save' button to save flight plan data", {
      ...attributes,
    });

    create(attributes, () => {
      setTimeout(() => {
        toast(
          "Ga naar “Vluchtplan-informatie” om je vlucht te controleren of bij te werken.",
          { duration: 5000 }
        );
      }, 1000);
      clear();
      clearGraphics();
    });
  };

  const handleSaveClick = () => {
    handleSubmit();
    logStep("User clicked 'Save' button");

    const layersToRemove = map?.layers.filter(
      (layer) => layer.type !== "graphics"
    );
    layersToRemove?.forEach((layer) => {
      map?.remove(layer);
    });
  };

  return (
    <>
      <WizardButtonBar
        className=""
        buttons={[
          {
            label: labels.vorige,
            onClick: withLog("User clicked 'Next' button", () =>
              runWizardCleanup([
                () => setStep(3),
                resetFilters,
                () => yellowGraphicsLayer?.graphics.removeAll(),
                () => yellowGeometriesGraphicsLayer?.graphics.removeAll(),
              ])
            ),
          },
          {
            label: labels.filteren,
            onClick: withLog("User clicked 'Filter' button", () =>
              setOpenFilter(true)
            ),
          },
          {
            label: labels.opslaan,
            onClick: handleSaveClick,
          },
          {
            label: labels.annuleren,
            onClick: withLog("User clicked 'Cancel' button", () =>
              runWizardCleanup([
                resetFeatures,
                handleCancel,
                resetFilters,
                clear,
              ])
            ),
          },
        ]}
      />
      <WizardLoadingOverlay show={loading} />
    </>
  );
}
