import type { EnrichedPointState } from "./enrichedPointStateTypes";

/** Coordinate fields + setters used by enriched add-point Step 2 flows. */
export function pickEnrichedCoordinateControls(state: EnrichedPointState) {
  return {
    xCoord: state.xCoord,
    yCoord: state.yCoord,
    coordinateSystem: state.coordinateSystem,
    latitude: state.latitude,
    setLatitude: state.setLatitude,
    longitude: state.longitude,
    setLongitude: state.setLongitude,
    setXCoord: state.setXCoord,
    setYCoord: state.setYCoord,
  };
}
