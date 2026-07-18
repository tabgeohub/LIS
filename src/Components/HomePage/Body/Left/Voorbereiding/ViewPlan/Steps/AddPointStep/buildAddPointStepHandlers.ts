import { removeAddPointMapGraphics } from "./resetAddPointStepState";
import { buildAddPointResetForm } from "./buildAddPointResetForm";
import type { useAddPointStepStores } from "./useAddPointStepStores";

type Stores = ReturnType<typeof useAddPointStepStores>;

export function buildAddPointStepHandlers(s: Stores) {
  const resetFormAndState = buildAddPointResetForm(s);
  function handleCancel() {
    removeAddPointMapGraphics({
      mapView: s.map.mapView,
      currentPoint: s.point.currentPoint,
      xCoord: s.point.xCoord,
      yCoord: s.point.yCoord,
    });
    s.setSelectedTab("none");
    resetFormAndState();
  }
  return { resetFormAndState, handleCancel };
}
