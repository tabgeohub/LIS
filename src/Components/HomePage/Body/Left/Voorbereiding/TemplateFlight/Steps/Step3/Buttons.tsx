import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useCreateData } from "utils/useCreateData";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useCancelCreateFlightPlan } from "hooks/handleCancel/useCancelCreateFlightPlan";
import { useTemplateFlightState } from "../../templateFlightStates";
import useLogAction from "hooks/useLogAction";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";

export default function Buttons({
  setOpenFilter,
  name,
}: {
  setOpenFilter: (value: boolean) => void;
  name: string;
}) {
  const { resetFilters } = usePointsFilterStore();
  const handleCancel = useCancelCreateFlightPlan();
  const { yellowGraphicsLayer, clearGraphics, mapView } = useMapViewState();
  const { resetFeatures } = useResetFeatures();

  const { create, loading } = useCreateData("/templateFlight");

  const logAction = useLogAction();
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

    const attributes = {
      points: uniquePointIds,
      name,
      regio_id: user.role,
    };

    logAction({
      message: "User clicked 'Save' button to save flight template data",
      step: "Third step",
      newData: {
        name: name,
        points: uniquePointIds,
        geometries: uniqueSelectedGeometryIds,
      },
    });

    create(attributes, () => {
      clear();
      clearGraphics();
    });
  };

  const handlePrevious = () => {
    setStep(2);
    resetFilters();
    setSelectedPoints2([]);
    setSelectedGeometries2([]);

    resetFeatures();
    clearGraphics();

    selectedGraphics.forEach((g) => mapView?.graphics.remove(g));
    setSelectedGraphics([]);

    if (hoveredGraphic) {
      mapView?.graphics.remove(hoveredGraphic);
      setHoveredGraphic(null);
    }
  };

  const handleCancelClick = () => {
    resetFeatures();
    handleCancel();
    resetFilters();
    clear();
    clearGraphics();

    selectedGraphics.forEach((g) => mapView?.graphics.remove(g));
    setSelectedGraphics([]);

    if (hoveredGraphic) {
      mapView?.graphics.remove(hoveredGraphic);
      setHoveredGraphic(null);
    }
  };

  return (
    <>
      <button onClick={handlePrevious} className="gray-button">
        Vorige
      </button>

      <button onClick={() => setOpenFilter(true)} className="gray-button">
        Filteren
      </button>

      <button onClick={handleSubmit} className="gray-button">
        Opslaan
      </button>

      <button onClick={handleCancelClick} className="gray-button">
        Annuleren
      </button>

      {loading && (
        <div className="absolute inset-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
          <LoadingBars />
        </div>
      )}
    </>
  );
}
