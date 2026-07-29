import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import { pickEnrichedCoordinateControls } from "hooks/zustand/pickEnrichedCoordinateControls";
import { createNewPoint } from "../../helpers/createNewPoint";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { syncEnrichedCoordsForPreview } from "./syncEnrichedCoordsForPreview";

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
