import { useMapViewState } from "hooks/zustand/ui";
import { useEnrichedPointState } from "Components/Voorbereiding/EnrichedAddPoint/state/useEnrichedPointState";
import { pickEnrichedCoordinateControls } from "Components/Voorbereiding/EnrichedAddPoint/state/pickEnrichedCoordinateControls";
import { createNewPoint } from "Components/Voorbereiding/common/createNewPoint";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { syncEnrichedCoordsForPreview } from "Components/Voorbereiding/common/syncEnrichedCoordsForPreview";

export default function UpdateBtn() {
  const { redGraphicsLayer } = useMapViewState();
  const state = useEnrichedPointState();
  const coords = pickEnrichedCoordinateControls(state);

  const logAction = useLogAction();
  const content = useContent();

  function handleUpdate() {
    if (!redGraphicsLayer) return;

    const { drawLon, drawLat } = syncEnrichedCoordsForPreview(coords);

    redGraphicsLayer.removeAll();

    createNewPoint({
      redGraphicsLayer,
      setCurrentPoint: state.setCurrentPoint,
      xCoord: drawLon,
      yCoord: drawLat,
    });

    logAction({
      message: "User clicked 'Update' button",
      step: "Second step",
      newData: {
        latitude: drawLat,
        longitude: drawLon,
      },
    });
  }

  return (
    <button onClick={handleUpdate} className="gray-button">
      {content.common.update}
    </button>
  );
}
