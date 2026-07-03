import { useDrawingStore } from "hooks/zustand/useDrawingStore";
import { useContent } from "hooks/useContent";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useCreateData } from "utils/useCreateData";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import {
  cleanupDrawingToolMap,
  clearCurrentlyDrawingGraphics,
} from "../helpers/drawingToolMapCleanup";
import { useOmschrijvingExists } from "../helpers/useOmschrijvingExists";
import {
  buildGeometryPointsFromDrawn,
  resolveCombinedGeometryType,
} from "../helpers/buildGeometryPointsFromDrawn";

export default function Buttons() {
  const {
    clear,
    omschrijving,
    organisatie,
    vertrouwelijk,
    herhalen,
    activiteit,
    specifiekLettenOp,
    graphicsDrawn,
  } = useDrawingStore();
  const { mapView } = useMapViewState();
  const { user } = useAuth();
  const content = useContent();
  const { create, loading } = useCreateData("/geometries");
  const { fetchGeometries } = useGeometriesStore();
  const omschrijvingExists = useOmschrijvingExists(omschrijving);

  function handleLeaveStep2() {
    cleanupDrawingToolMap(mapView);
    clear();
  }

  async function handleSubmit() {
    if (!graphicsDrawn?.length) return;

    const pointsArray = buildGeometryPointsFromDrawn({
      graphicsDrawn,
      omschrijving,
      userRole: user?.role,
      userId: user?.user_id,
      herhalen,
      organisatie,
      vertrouwelijk,
      activiteit,
      specifiekLettenOp,
    });

    const geometryType = resolveCombinedGeometryType(
      graphicsDrawn.map((shape) => shape.type)
    );

    const result = await create(
      {
        omschrijving,
        organisatie,
        vertrouwelijk,
        herhalen,
        activiteit,
        specifiekLettenOp,
        geometry_type: geometryType,
        regio_id: user?.role,
        points: pointsArray,
      },
      async () => {
        clearCurrentlyDrawingGraphics(mapView);
        clear();
        await fetchGeometries({
          regio: user?.role && user.role !== "admin" ? user.role : undefined,
        });
      }
    );

    if (result !== null) {
      // Success handled in create callback
    }
  }

  return (
    <div className="relative">
      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button
          onClick={handleLeaveStep2}
          disabled={loading}
          className="gray-button"
        >
          {content.common.vorige}
        </button>

        <button
          disabled={
            omschrijving === "" ||
            organisatie === "" ||
            loading ||
            omschrijvingExists
          }
          onClick={handleSubmit}
          className="gray-button"
        >
          {loading ? "Opslaan..." : content.common.opslaan}
        </button>

        <button
          onClick={handleLeaveStep2}
          disabled={loading}
          className="gray-button"
        >
          {content.common.annuleren}
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-sm z-10 flex justify-center items-center rounded">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-gray-600 text-sm">Bezig met opslaan...</p>
          </div>
        </div>
      )}
    </div>
  );
}
