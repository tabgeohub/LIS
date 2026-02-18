import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { ActionType } from ".";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useHandleClearFinishedPlan } from "hooks/handleCancel/useHandleClearFinishedPlan";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function Buttons({
  setAction,
}: {
  setAction: (value: ActionType) => void;
}) {
  const { setStep } = useFinishedPlansState();
  const { resetFeatures } = useResetFeatures();

  const logAction = useLogAction();

  const { graphicsLayer, graphicsLayerHover, redGraphicsLayer, mapView } =
    useMapViewState();

  const handleClear = useHandleClearFinishedPlan();

  async function handlePrevious() {
    if (!mapView) return;

    const layers = mapView.map.layers.filter((l) => l.title === "PathPoints");

    if (layers.length > 0) {
      layers.forEach((layer) => {
        mapView.map.remove(layer);
      });
    }

    graphicsLayer?.removeAll();
    graphicsLayerHover?.removeAll();
    redGraphicsLayer?.removeAll();

    handleClear();
    setStep(1);
  }

  const content = useContent();

  return (
    <div className="mt-10 text-xs flex flex-wrap text-[12px] justify-end gap-2">
      <button
        onClick={() => {
          handlePrevious();

          logAction({
            message: "User clicked 'Previous' button",
            step: "Second step",
          });
        }}
        className="gray-button"
      >
        {content.common.vorige}{" "}
      </button>

      <button
        onClick={() => {
          setAction("waarnemingen");

          logAction({
            message: "User clicked 'Waarnemingen' button",
            step: "Second step",
          });
        }}
        className="gray-button"
      >
        {content.nabewerking.vluchtenZoeken.step2.waarnemingenBtn}
      </button>

      <button
        onClick={() => {
          setAction("vluchtBewerken");

          logAction({
            message: "User clicked 'Vlucht bewerken' button",
            step: "Second step",
          });
        }}
        className="gray-button"
      >
        {content.nabewerking.vluchtenZoeken.step2.vluchtBewerken}
      </button>

      <button
        onClick={() => {
          setAction("vliegroute");

          logAction({
            message: "User clicked 'Vliegroute exporteren' button",
            step: "Second step",
          });
        }}
        className="gray-button"
      >
        {content.nabewerking.vluchtenZoeken.step2.vliegrouteExporteren}
      </button>

      <button
        onClick={() => {
          setStep(1);
          graphicsLayer?.removeAll();
          graphicsLayerHover?.removeAll();
          redGraphicsLayer?.removeAll();

          resetFeatures();

          handleClear();
        }}
        className="gray-button"
      >
        {content.common.annuleren}
      </button>
    </div>
  );
}
