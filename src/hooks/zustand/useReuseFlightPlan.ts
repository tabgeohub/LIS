import { EnrichedPointType, FlightPlanType } from "Types";
import { create } from "zustand";

interface ReUseFlightPlanState {
  step: number;
  setStep: (value: number) => void;

  currentPoints: number[];
  setCurrentPoints: (value: number[]) => void;

  currentGeometries: number[];
  setCurrentGeometries: (value: number[]) => void;

  newPoints: number[];
  setNewPoints: (value: number[]) => void;

  newGeometries: number[];
  setNewGeometries: (value: number[]) => void;

  selectedPlan: FlightPlanType | null;
  setSelectedPlan: (value: FlightPlanType | null) => void;

  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;

  filteredPlans: FlightPlanType[];
  setFilteredPlans: (value: FlightPlanType[]) => void;

  filteredPoints: EnrichedPointType[];
  setFilteredPoints: (value: EnrichedPointType[]) => void;

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

  aantalPassagiers: number | null | undefined;
  setAantalPassagiers: (value: number | null | undefined) => void;

  doelEnHoofdthema: string;
  setDoelEnHoofdthema: (value: string) => void;

  aanvullendeInfo: string;
  setAanvullendeInfo: (value: string) => void;

  filterTerm: string;
  setFilterTerm: (value: string) => void;

  clear: () => void;
}

const initialState = {
  step: 1,
  currentPoints: [] as number[],
  currentGeometries: [] as number[],
  newPoints: [] as number[],
  newGeometries: [] as number[],
  selectedPlan: null as FlightPlanType | null,
  openFilter: false,
  filteredPlans: [] as FlightPlanType[],
  filteredPoints: [] as EnrichedPointType[],
  vluchtnummer: "",
  filterTerm: "",
  omschrijving: "",
  waarnemer: "",
  piloot: "",
  datum: "",
  geplandeVliegduur: "",
  typeLuchtvaartuig: "",
  aantalPassagiers: null as number | null | undefined,
  doelEnHoofdthema: "",
  aanvullendeInfo: "",
};

export const useReuseFlightPlan = create<ReUseFlightPlanState>((set) => ({
  ...initialState,
  setStep: (value) => set({ step: value }),
  setCurrentPoints: (value) => set({ currentPoints: value }),
  setCurrentGeometries: (value) => set({ currentGeometries: value }),
  setNewPoints: (value) => set({ newPoints: value }),
  setNewGeometries: (value) => set({ newGeometries: value }),
  setSelectedPlan: (value) => set({ selectedPlan: value }),
  setOpenFilter: (value) => set({ openFilter: value }),
  setFilteredPlans: (value) => set({ filteredPlans: value }),
  setFilteredPoints: (value) => set({ filteredPoints: value }),
  setVluchtnummer: (value) => set({ vluchtnummer: value }),
  setFilterTerm: (value) => set({ filterTerm: value }),
  setOmschrijving: (value) => set({ omschrijving: value }),
  setWaarnemer: (value) => set({ waarnemer: value }),
  setPiloot: (value) => set({ piloot: value }),
  setDatum: (value) => set({ datum: value }),
  setGeplandeVliegduur: (value) => set({ geplandeVliegduur: value }),
  setTypeLuchtvaartuig: (value) => set({ typeLuchtvaartuig: value }),
  setAantalPassagiers: (value) => set({ aantalPassagiers: value }),
  setDoelEnHoofdthema: (value) => set({ doelEnHoofdthema: value }),
  setAanvullendeInfo: (value) => set({ aanvullendeInfo: value }),
  clear: () => set(initialState),
}));
