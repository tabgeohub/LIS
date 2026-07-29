import { useDrawingStore } from "hooks/zustand/useDrawingStore";
import { useMapViewState } from "hooks/zustand/ui";
import { useAuth } from "hooks/zustand/ui";
import { useCreateData } from "api-hooks/mutations";
import { useGeometriesStore } from "hooks/features";
import {
  cleanupDrawingToolMap,
  clearCurrentlyDrawingGraphics,
} from "../helpers/drawingToolMapCleanup";
import { useOmschrijvingExists } from "../helpers/useOmschrijvingExists";
import {
  buildGeometryPointsFromDrawn,
  resolveCombinedGeometryType,
} from "../helpers/buildGeometryPointsFromDrawn";
import { pickDrawingGeometryFormFields } from "../helpers/pickDrawingGeometryFormFields";
import { useWizardButtons } from "Components/HomePage/hooks/wizard/useWizardButtons";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { WIZARD_BUTTON_BAR_CLASS } from "Components/HomePage/Body/Common/Wizard/wizardButtonBarClass";

export default function Buttons() {
  const store = useDrawingStore();
  const { clear, graphicsDrawn } = store;
  const formFields = pickDrawingGeometryFormFields(store);
  const { mapView } = useMapViewState();
  const { user } = useAuth();
  const { labels } = useWizardButtons("Drawing tool - Step 2");
  const { create, loading } = useCreateData("/geometries");
  const { fetchGeometries } = useGeometriesStore();
  const omschrijvingExists = useOmschrijvingExists(formFields.omschrijving);

  function handleLeaveStep2() {
    cleanupDrawingToolMap(mapView);
    clear();
  }

  async function handleSubmit() {
    if (!graphicsDrawn?.length) return;

    const pointsArray = buildGeometryPointsFromDrawn({
      graphicsDrawn,
      omschrijving: formFields.omschrijving,
      userRole: user?.role,
      userId: user?.user_id,
      herhalen: formFields.herhalen,
      organisatie: formFields.organisatie,
      vertrouwelijk: formFields.vertrouwelijk,
      activiteit: formFields.activiteit,
      specifiekLettenOp: formFields.specifiekLettenOp,
    });

    const geometryType = resolveCombinedGeometryType(
      graphicsDrawn.map((shape) => shape.type)
    );

    await create({
      data: {
        ...formFields,
        geometry_type: geometryType,
        regio_id: user?.role,
        points: pointsArray,
      },
      onSuccess: async () => {
        clearCurrentlyDrawingGraphics(mapView);
        clear();
        await fetchGeometries({
          regio: user?.role && user.role !== "admin" ? user.role : undefined,
        });
      },
    });
  }

  return (
    <div className="relative">
      <WizardButtonBar
        className={WIZARD_BUTTON_BAR_CLASS}
        buttons={[
          {
            label: labels.vorige,
            onClick: handleLeaveStep2,
            disabled: loading,
          },
          {
            label: loading ? "Opslaan..." : labels.opslaan,
            onClick: handleSubmit,
            disabled:
              formFields.omschrijving === "" ||
              formFields.organisatie === "" ||
              loading ||
              omschrijvingExists,
          },
          {
            label: labels.annuleren,
            onClick: handleLeaveStep2,
            disabled: loading,
          },
        ]}
      />

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
