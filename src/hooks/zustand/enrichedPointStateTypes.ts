import { SpatialReference } from "Types";

export interface EnrichedPointValues {
  step: number;
  xCoord: number;
  yCoord: number;
  longitude: number;
  latitude: number;
  coordinateSystem: SpatialReference;
  vertrouwelijk: boolean;
  herhalen: boolean;
  omschrijving: string;
  activiteit: string;
  organisatie: string;
  specifiekLettenOp: string;
  currentPoint: { x: number; y: number };
  mapClickedNotify: number;
}

type SetterActions<T> = {
  [Key in keyof T as `set${Capitalize<string & Key>}`]: (value: T[Key]) => void;
};

export type EnrichedPointState = EnrichedPointValues &
  SetterActions<EnrichedPointValues> & { reset: () => void };
