import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { ActionType } from ".";
import { useFinishedPlansState } from "Components/HomePage/hooks/zustand/nabewerking/useFinishedPlansState";
import { useHandleClearFinishedPlan } from "hooks/handleCancel/useHandleClearFinishedPlan";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "Components/HomePage/hooks/wizard/useWizardButtons";
import { clearFinishedPlanStep2Layers } from "./clearFinishedPlanStep2Layers";
import { runFinishedPlanStep2ExitCleanup } from "./runFinishedPlanStep2ExitCleanup";

export default function Buttons({
  setAction,
}: {
  setAction: (value: ActionType) => void;
}) {
  const { withLog, labels, content } = useWizardButtons("Second step");
  const { setStep } = useFinishedPlansState();
  const { resetFeatures } = useResetFeatures();
  const {
    graphicsLayer,
    graphicsLayerHover,
    redGraphicsLayer,
    geometriesGraphicsLayer,
    mapView,
  } = useMapViewState();
  const handleClear = useHandleClearFinishedPlan();

  const clearOverlayLayers = () =>
    clearFinishedPlanStep2Layers({
      graphicsLayer,
      graphicsLayerHover,
      redGraphicsLayer,
      geometriesGraphicsLayer,
    });

  const exitCleanup = () =>
    runFinishedPlanStep2ExitCleanup({
      clearOverlayLayers,
      resetFeatures,
      handleClear,
    });

  async function handlePrevious() {
    if (!mapView) return;

    const layers = mapView.map?.layers.filter((l) => l.title === "PathPoints");
    if (layers && layers.length > 0) {
      layers.forEach((layer) => mapView.map?.remove(layer));
    }

    exitCleanup();
    setStep(1);
  }

  function handleCancel() {
    setStep(1);
    exitCleanup();
  }

  const step2 = content.nabewerking.vluchtenZoeken.step2;

  return (
    <WizardButtonBar
      className="mt-10 text-xs flex flex-wrap text-[12px] justify-end gap-2"
      buttons={[
        {
          label: labels.vorige,
          onClick: withLog("User clicked 'Previous' button", handlePrevious),
        },
        {
          label: step2.waarnemingenBtn,
          onClick: withLog("User clicked 'Waarnemingen' button", () =>
            setAction("waarnemingen")
          ),
        },
        {
          label: step2.vluchtBewerken,
          onClick: withLog("User clicked 'Vlucht bewerken' button", () =>
            setAction("vluchtBewerken")
          ),
        },
        {
          label: step2.vliegrouteExporteren,
          onClick: withLog("User clicked 'Vliegroute exporteren' button", () =>
            setAction("vliegroute")
          ),
        },
        {
          label: labels.annuleren,
          onClick: handleCancel,
        },
      ]}
    />
  );
}
