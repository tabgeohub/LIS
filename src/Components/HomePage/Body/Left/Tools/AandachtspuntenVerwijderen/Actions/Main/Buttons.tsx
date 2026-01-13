import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";

export default function Buttons() {
  const logAction = useLogAction();

  const { setMainStep, clear } = useDeletePointState();
  const { setSelectedTab } = useTabState();
  const { graphicsLayer, graphicsLayerHover, yellowGraphicsLayer } =
    useMapViewState();

  const content = useContent();

  function handleCancel() {
    clear();
    yellowGraphicsLayer?.removeAll();
    graphicsLayer?.removeAll();
    graphicsLayerHover?.removeAll();

    setSelectedTab("none");

    logAction({
      message: "User clicked 'Cancel' button",
      step: "Main step",
    });
  }

  return (
    <>
      <button className="gray-button">{content.common.verwijderen}</button>

      <button
        onClick={() => {
          setMainStep("filter");

          logAction({
            message: "User clicked 'Filter' button",
            step: "Main step",
          });
        }}
        className="gray-button"
      >
        {content.common.kaartfilter}
      </button>

      <button onClick={handleCancel} className="gray-button">
        {content.common.annuleren}
      </button>
    </>
  );
}
