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

  hoveredGraphic: __esri.Graphic | null;
  setHoveredGraphic: (value: __esri.Graphic | null) => void;

  selectedGraphics: __esri.Graphic[];
  setSelectedGraphics: (value: __esri.Graphic[]) => void;

  points: EnrichedPointType[];
  setPoints: (value: EnrichedPointType[]) => void;

  clear: () => void;
}

export const useFlightPlanState = create<FlightPlanState>((set) => ({
  vluchtnummer: "",
  setVluchtnummer: (value) => set({ vluchtnummer: value }),

  omschrijving: "",
  setOmschrijving: (value) => set({ omschrijving: value }),

  waarnemer: "",
  setWaarnemer: (value) => set({ waarnemer: value }),

  piloot: "",
  setPiloot: (value) => set({ piloot: value }),

  datum: "",
  setDatum: (value) => set({ datum: value }),

  geplandeVliegduur: "0:00",
  setGeplandeVliegduur: (value) => set({ geplandeVliegduur: value }),

  typeLuchtvaartuig: "",
  setTypeLuchtvaartuig: (value) => set({ typeLuchtvaartuig: value }),

  aantalPassagiers: null,
  setAantalPassagiers: (value) => set({ aantalPassagiers: value }),

  doelEnHoofdthema: "",
  setDoelEnHoofdthema: (value) => set({ doelEnHoofdthema: value }),

  aanvullendeInfo: "",
  setAanvullendeInfo: (value) => set({ aanvullendeInfo: value }),

  step: 1,
  setStep: (value) => set({ step: value }),

  selectedPoints: [],
  setSelectedPoints: (value) => set({ selectedPoints: value }),

  selectedPoints2: [],
  setSelectedPoints2: (value) => set({ selectedPoints2: value }),

  hoveredGraphic: null,
  setHoveredGraphic: (value) => set({ hoveredGraphic: value }),

  selectedGraphics: [],
  setSelectedGraphics: (value) => set({ selectedGraphics: value }),

  points: [],
  setPoints: (value) => set({ points: value }),

  clear: () =>
    set({
      vluchtnummer: "",
      setVluchtnummer: (value) => set({ vluchtnummer: value }),

      omschrijving: "",
      setOmschrijving: (value) => set({ omschrijving: value }),

      waarnemer: "",
      setWaarnemer: (value) => set({ waarnemer: value }),

      piloot: "",
      setPiloot: (value) => set({ piloot: value }),

      datum: "",
      setDatum: (value) => set({ datum: value }),

      geplandeVliegduur: "0:00",
      setGeplandeVliegduur: (value) => set({ geplandeVliegduur: value }),

      typeLuchtvaartuig: "",
      setTypeLuchtvaartuig: (value) => set({ typeLuchtvaartuig: value }),

      aantalPassagiers: null,
      setAantalPassagiers: (value) => set({ aantalPassagiers: value }),

      doelEnHoofdthema: "",
      setDoelEnHoofdthema: (value) => set({ doelEnHoofdthema: value }),

      aanvullendeInfo: "",
      setAanvullendeInfo: (value) => set({ aanvullendeInfo: value }),

      step: 1,
      setStep: (value) => set({ step: value }),

      selectedPoints: [],
      setSelectedPoints: (value) => set({ selectedPoints: value }),

      selectedPoints2: [],
      setSelectedPoints2: (value) => set({ selectedPoints2: value }),

      hoveredGraphic: null,
      setHoveredGraphic: (value) => set({ hoveredGraphic: value }),

      selectedGraphics: [],
      setSelectedGraphics: (value) => set({ selectedGraphics: value }),

      points: [],
      setPoints: (value) => set({ points: value }),
    }),
}));
