import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { ActionType } from ".";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useHandleClearFinishedPlan } from "hooks/handleCancel/useHandleClearFinishedPlan";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";

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

  async function handlePrevious() {
    if (!mapView) return;

    const layers = mapView.map?.layers.filter((l) => l.title === "PathPoints");
    if (layers && layers.length > 0) {
      layers.forEach((layer) => mapView.map?.remove(layer));
    }

    graphicsLayer?.removeAll();
    graphicsLayerHover?.removeAll();
    redGraphicsLayer?.removeAll();
    geometriesGraphicsLayer?.removeAll();
    resetFeatures();
    handleClear();
    setStep(1);
  }

  function handleCancel() {
    setStep(1);
    graphicsLayer?.removeAll();
    graphicsLayerHover?.removeAll();
    redGraphicsLayer?.removeAll();
    geometriesGraphicsLayer?.removeAll();
    resetFeatures();
    handleClear();
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
