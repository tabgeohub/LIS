import { EnrichedPointValues } from "./enrichedPointStateTypes";

export const initialEnrichedPointValues: EnrichedPointValues = {
  step: 1,
  xCoord: 0,
  yCoord: 0,
  longitude: 0,
  latitude: 0,
  coordinateSystem: "RD",
  vertrouwelijk: false,
  herhalen: false,
  omschrijving: "",
  activiteit: "",
  organisatie: "",
  specifiekLettenOp: "",
  currentPoint: { x: 0, y: 0 },
  mapClickedNotify: 0,
};
