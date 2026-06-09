import { EnrichedPointType } from "Types";
import { create } from "zustand";

interface FlightPlanState {
  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;

  omschrijving: string;
  setOmschrijving: (value: string) => void;

  waarnemer: string;
  setWaarnemer: (value: string) => void;

  piloot: string;
  setPiloot: (value: string) => void;

  datum: string;
  setDatum: (value: string) => void;

  geplandeVliegduur: string;
  setGeplandeVliegduur: (value: string) => void;

  typeLuchtvaartuig: string;
  setTypeLuchtvaartuig: (value: string) => void;

  aantalPassagiers: number | null;
  setAantalPassagiers: (value: number | null) => void;

  doelEnHoofdthema: string;
  setDoelEnHoofdthema: (value: string) => void;

  aanvullendeInfo: string;
  setAanvullendeInfo: (value: string) => void;

  step: number;
  setStep: (value: number) => void;

  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;

  selectedPoints2: number[];
  setSelectedPoints2: (value: number[]) => void;

  selectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;

  selectedGeometries2: number[];
  setSelectedGeometries2: (value: number[]) => void;

  hoveredGraphic: __esri.Graphic | null;
  setHoveredGraphic: (value: __esri.Graphic | null) => void;

  selectedGraphics: __esri.Graphic[];
  setSelectedGraphics: (value: __esri.Graphic[]) => void;

  points: EnrichedPointType[];
  setPoints: (value: EnrichedPointType[]) => void;

  clear: () => void;
}

const initialState = {
  vluchtnummer: "",
  omschrijving: "",
  waarnemer: "",
  piloot: "",
  datum: "",
  geplandeVliegduur: "0:00",
  typeLuchtvaartuig: "",
  aantalPassagiers: null as number | null,
  doelEnHoofdthema: "",
  aanvullendeInfo: "",
  step: 1,
  selectedPoints: [] as number[],
  selectedPoints2: [] as number[],
  selectedGeometries: [] as number[],
  selectedGeometries2: [] as number[],
  hoveredGraphic: null as __esri.Graphic | null,
  selectedGraphics: [] as __esri.Graphic[],
  points: [] as EnrichedPointType[],
};

export const useFlightPlanState = create<FlightPlanState>((set) => ({
  ...initialState,
  setVluchtnummer: (value) => set({ vluchtnummer: value }),
  setOmschrijving: (value) => set({ omschrijving: value }),
  setWaarnemer: (value) => set({ waarnemer: value }),
  setPiloot: (value) => set({ piloot: value }),
  setDatum: (value) => set({ datum: value }),
  setGeplandeVliegduur: (value) => set({ geplandeVliegduur: value }),
  setTypeLuchtvaartuig: (value) => set({ typeLuchtvaartuig: value }),
  setAantalPassagiers: (value) => set({ aantalPassagiers: value }),
  setDoelEnHoofdthema: (value) => set({ doelEnHoofdthema: value }),
  setAanvullendeInfo: (value) => set({ aanvullendeInfo: value }),
  setStep: (value) => set({ step: value }),
  setSelectedPoints: (value) => set({ selectedPoints: value }),
  setSelectedPoints2: (value) => set({ selectedPoints2: value }),
  setSelectedGeometries: (value) => set({ selectedGeometries: value }),
  setSelectedGeometries2: (value) => set({ selectedGeometries2: value }),
  setHoveredGraphic: (value) => set({ hoveredGraphic: value }),
  setSelectedGraphics: (value) => set({ selectedGraphics: value }),
  setPoints: (value) => set({ points: value }),
  clear: () => set(initialState),
}));
