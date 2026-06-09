import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useCreateData } from "utils/useCreateData";
import { useCancelCreateFlightPlan } from "hooks/handleCancel/useCancelCreateFlightPlan";
import { useTemplateFlightState } from "../../templateFlightStates";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import WizardLoadingOverlay from "Components/HomePage/Body/Common/Wizard/WizardLoadingOverlay";
import type Graphic from "@arcgis/core/Graphic";
import type MapView from "@arcgis/core/views/MapView";

function clearTemplateSelectionGraphics(
  mapView: MapView | null,
  selectedGraphics: Graphic[],
  setSelectedGraphics: (graphics: Graphic[]) => void,
  hoveredGraphic: Graphic | null,
  setHoveredGraphic: (graphic: Graphic | null) => void
) {
  selectedGraphics.forEach((graphic) => mapView?.graphics.remove(graphic));
  setSelectedGraphics([]);

  if (hoveredGraphic) {
    mapView?.graphics.remove(hoveredGraphic);
    setHoveredGraphic(null);
  }
}

export default function Buttons({
  setOpenFilter,
  name,
}: {
  setOpenFilter: (value: boolean) => void;
  name: string;
}) {
  const { resetFilters } = usePointsFilterStore();
  const handleCancel = useCancelCreateFlightPlan();
  const { clearGraphics, mapView } = useMapViewState();
  const { resetFeatures } = useResetFeatures();
  const { create, loading } = useCreateData("/templateFlight");
  const { logStep, labels } = useWizardButtons("Third step");
  const { user } = useAuth();
  const {
    selectedPoints2,
    selectedPoints,
    setSelectedPoints2,
    setStep,
    clear,
    selectedGraphics,
    setSelectedGraphics,
    hoveredGraphic,
    setHoveredGraphic,
    selectedGeometries,
    selectedGeometries2,
    setSelectedGeometries2,
  } = useTemplateFlightState();
  const { dbGeometries } = useGeometriesStore();

  const clearSelectionGraphics = () =>
    clearTemplateSelectionGraphics(
      mapView,
      selectedGraphics,
      setSelectedGraphics,
      hoveredGraphic,
      setHoveredGraphic
    );

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
    const uniqueSelectedGeometryIds = Array.from(new Set(allSelectedGeometryIds));
    const selectedGeometryObjects = dbGeometries.filter((geometry) =>
      uniqueSelectedGeometryIds.includes(geometry.id)
    );
    const geometryPointIds = selectedGeometryObjects.flatMap((geometry) =>
      geometry.points.map((point) => point.id)
    );
    const safeSelectedPoints = Array.isArray(selectedPoints) ? selectedPoints : [];
    const safeSelectedPoints2 = Array.isArray(selectedPoints2) ? selectedPoints2 : [];
    const allPointIds = [...safeSelectedPoints, ...safeSelectedPoints2, ...geometryPointIds];
    const uniquePointIds = Array.from(new Set(allPointIds));

    logStep("User clicked 'Save' button to save flight template data", {
      name,
      points: uniquePointIds,
      geometries: uniqueSelectedGeometryIds,
    });

    create(
      {
        points: uniquePointIds,
        name,
        regio_id: user.role,
      },
      () => {
        clear();
        clearGraphics();
      }
    );
  };

  const handlePrevious = () =>
    runWizardCleanup([
      () => setStep(2),
      resetFilters,
      () => setSelectedPoints2([]),
      () => setSelectedGeometries2([]),
      resetFeatures,
      clearGraphics,
      clearSelectionGraphics,
    ]);

  const handleCancelClick = () =>
    runWizardCleanup([
      resetFeatures,
      handleCancel,
      resetFilters,
      clear,
      clearGraphics,
      clearSelectionGraphics,
    ]);

  return (
    <>
      <WizardButtonBar
        className=""
        buttons={[
          { label: labels.vorige, onClick: handlePrevious },
          { label: labels.filteren, onClick: () => setOpenFilter(true) },
          { label: labels.opslaan, onClick: handleSubmit },
          { label: labels.annuleren, onClick: handleCancelClick },
        ]}
      />
      <WizardLoadingOverlay show={loading} />
    </>
  );
}
