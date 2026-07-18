import { useAddPointStepMapClick } from "./useAddPointStepMapClick";
import { useAddPointStepBaseStores } from "./useAddPointStepBaseStores";

export function useAddPointStepStores() {
  const stores = useAddPointStepBaseStores();
  useAddPointStepMapClick({
    addPointStep: stores.addPointStep,
    mapClickedNotify: stores.point.mapClickedNotify,
    setMapClickedNotify: stores.point.setMapClickedNotify,
    setCurrentPoint: stores.point.setCurrentPoint,
    setXCoord: stores.point.setXCoord,
    setYCoord: stores.point.setYCoord,
    setLatitude: stores.point.setLatitude,
    setLongitude: stores.point.setLongitude,
    setAddPointStep: stores.setAddPointStep,
  });
  return stores;
}
