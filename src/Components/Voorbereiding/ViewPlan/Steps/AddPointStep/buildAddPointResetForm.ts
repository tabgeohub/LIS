import { resetAddPointFormState } from "./resetAddPointStepState";
import type { useAddPointStepStores } from "./useAddPointStepStores";

type Stores = ReturnType<typeof useAddPointStepStores>;

export function buildAddPointResetForm(s: Stores) {
  return () =>
    resetAddPointFormState({
      graphicsLayer: s.map.graphicsLayer,
      graphicsLayerHover: s.map.graphicsLayerHover,
      setOpenTable: s.setOpenTable,
      setOpenFilter: s.setOpenFilter,
      setAddPointStep: s.setAddPointStep,
      setXCoord: s.point.setXCoord,
      setYCoord: s.point.setYCoord,
      setLatitude: s.point.setLatitude,
      setLongitude: s.point.setLongitude,
      setCoordinateSystem: s.point.setCoordinateSystem,
      setVertrouwelijk: s.point.setVertrouwelijk,
      setHerhalen: s.point.setHerhalen,
      setOmschrijving: s.point.setOmschrijving,
      setActiviteit: s.point.setActiviteit,
      setOrganisatie: s.point.setOrganisatie,
      setSpecifiekLettenOp: s.point.setSpecifiekLettenOp,
      setCurrentPoint: s.point.setCurrentPoint,
    });
}
