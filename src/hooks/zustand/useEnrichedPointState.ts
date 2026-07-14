import { SpatialReference } from "Types";
import { create } from "zustand";

interface EnrichedPointState {
  step: number;
  setStep: (value: number) => void;

  xCoord: number;
  setXCoord: (value: number) => void;

  yCoord: number;
  setYCoord: (value: number) => void;

  longitude: number;
  setLongitude: (value: number) => void;

  latitude: number;
  setLatitude: (value: number) => void;

  coordinateSystem: SpatialReference;
  setCoordinateSystem: (value: SpatialReference) => void;

  vertrouwelijk: boolean;
  setVertrouwelijk: (value: boolean) => void;

  herhalen: boolean;
  setHerhalen: (value: boolean) => void;

  omschrijving: string;
  setOmschrijving: (value: string) => void;

  activiteit: string;
  setActiviteit: (value: string) => void;

  organisatie: string;
  setOrganisatie: (value: string) => void;

  specifiekLettenOp: string;
  setSpecifiekLettenOp: (value: string) => void;

  currentPoint: { x: number; y: number };
  setCurrentPoint: (value: { x: number; y: number }) => void;

  mapClickedNotify: number;
  setMapClickedNotify: (value: number) => void;

  reset: () => void;
}

type EnrichedPointValues = Pick<
  EnrichedPointState,
  | "step"
  | "xCoord"
  | "yCoord"
  | "longitude"
  | "latitude"
  | "coordinateSystem"
  | "vertrouwelijk"
  | "herhalen"
  | "omschrijving"
  | "activiteit"
  | "organisatie"
  | "specifiekLettenOp"
  | "currentPoint"
  | "mapClickedNotify"
>;

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

export const useEnrichedPointState = create<EnrichedPointState>((set) => ({
  ...initialEnrichedPointValues,
  setStep: (value: number) => set(() => ({ step: value })),

  setXCoord: (value: number) => set(() => ({ xCoord: value })),

  setYCoord: (value: number) => set(() => ({ yCoord: value })),

  setLongitude: (value: number) => set(() => ({ longitude: value })),

  setLatitude: (value: number) => set(() => ({ latitude: value })),

  setCoordinateSystem: (value: SpatialReference) =>
    set(() => ({ coordinateSystem: value })),

  setVertrouwelijk: (value: boolean) => set(() => ({ vertrouwelijk: value })),

  setHerhalen: (value: boolean) => set(() => ({ herhalen: value })),

  setOmschrijving: (value: string) => set(() => ({ omschrijving: value })),

  setActiviteit: (value: string) => set(() => ({ activiteit: value })),

  setOrganisatie: (value: string) => set(() => ({ organisatie: value })),

  setSpecifiekLettenOp: (value: string) =>
    set(() => ({ specifiekLettenOp: value })),

  setCurrentPoint: (value: { x: number; y: number }) =>
    set(() => ({ currentPoint: value })),

  setMapClickedNotify: (value: number) =>
    set(() => ({ mapClickedNotify: value })),

  reset: () => set(initialEnrichedPointValues),
}));
