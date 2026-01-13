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

export const useEnrichedPointState = create<EnrichedPointState>((set) => ({
  step: 1,
  setStep: (value: number) => set(() => ({ step: value })),

  xCoord: 0,
  setXCoord: (value: number) => set(() => ({ xCoord: value })),

  yCoord: 0,
  setYCoord: (value: number) => set(() => ({ yCoord: value })),

  longitude: 0,
  setLongitude: (value: number) => set(() => ({ longitude: value })),

  latitude: 0,
  setLatitude: (value: number) => set(() => ({ latitude: value })),

  coordinateSystem: "RD",
  setCoordinateSystem: (value: SpatialReference) =>
    set(() => ({ coordinateSystem: value })),

  vertrouwelijk: false,
  setVertrouwelijk: (value: boolean) => set(() => ({ vertrouwelijk: value })),

  herhalen: false,
  setHerhalen: (value: boolean) => set(() => ({ herhalen: value })),

  omschrijving: "",
  setOmschrijving: (value: string) => set(() => ({ omschrijving: value })),

  activiteit: "",
  setActiviteit: (value: string) => set(() => ({ activiteit: value })),

  organisatie: "",
  setOrganisatie: (value: string) => set(() => ({ organisatie: value })),

  specifiekLettenOp: "",
  setSpecifiekLettenOp: (value: string) =>
    set(() => ({ specifiekLettenOp: value })),

  currentPoint: { x: 0, y: 0 },
  setCurrentPoint: (value: { x: number; y: number }) =>
    set(() => ({ currentPoint: value })),

  mapClickedNotify: 0,
  setMapClickedNotify: (value: number) =>
    set(() => ({ mapClickedNotify: value })),

  reset: () =>
    set(() => ({
      step: 1,
      setStep: (value: number) => set(() => ({ step: value })),

      xCoord: 0,
      setXCoord: (value: number) => set(() => ({ xCoord: value })),

      yCoord: 0,
      setYCoord: (value: number) => set(() => ({ yCoord: value })),

      longitude: 0,
      setLongitude: (value: number) => set(() => ({ longitude: value })),

      latitude: 0,
      setLatitude: (value: number) => set(() => ({ latitude: value })),

      coordinateSystem: "RD",
      setCoordinateSystem: (value: SpatialReference) =>
        set(() => ({ coordinateSystem: value })),

      vertrouwelijk: false,
      setVertrouwelijk: (value: boolean) =>
        set(() => ({ vertrouwelijk: value })),

      herhalen: false,
      setHerhalen: (value: boolean) => set(() => ({ herhalen: value })),

      omschrijving: "",
      setOmschrijving: (value: string) => set(() => ({ omschrijving: value })),

      activiteit: "",
      setActiviteit: (value: string) => set(() => ({ activiteit: value })),

      organisatie: "",
      setOrganisatie: (value: string) => set(() => ({ organisatie: value })),

      specifiekLettenOp: "",
      setSpecifiekLettenOp: (value: string) =>
        set(() => ({ specifiekLettenOp: value })),

      currentPoint: { x: 0, y: 0 },
      setCurrentPoint: (value: { x: number; y: number }) =>
        set(() => ({ currentPoint: value })),

      mapClickedNotify: 0,
      setMapClickedNotify: (value: number) =>
        set(() => ({ mapClickedNotify: value })),
    })),
}));
