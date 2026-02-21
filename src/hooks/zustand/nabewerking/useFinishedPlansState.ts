import {
  FinishedFlightPlanType,
  FinishedPointType,
  FinishedGeometryType,
} from "Types/finished_plans";
import { create } from "zustand";

interface FinishedPlansState {
  step: number;
  setStep: (value: number) => void;

  selectedPlan: FinishedFlightPlanType | null;
  setSelectedPlan: (value: FinishedFlightPlanType | null) => void;

  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;

  filteredPoints: FinishedPointType[];
  setFilteredPoints: (value: FinishedPointType[]) => void;

  filteredPlans: FinishedFlightPlanType[];
  setFilteredPlans: (value: FinishedFlightPlanType[]) => void;

  periode: string;
  setPeriode: (value: string) => void;

  dateFrom: string;
  setDateFrom: (value: string) => void;

  dateTo: string;
  setDateTo: (value: string) => void;

  selectedPoint: FinishedPointType | null;
  setSelectedPoint: (value: FinishedPointType | null) => void;

  selectedGeometry: FinishedGeometryType | null;
  setSelectedGeometry: (value: FinishedGeometryType | null) => void;

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

export const useFinishedPlansState = create<FinishedPlansState>((set) => ({
  step: 1,
  setStep: (value) => set({ step: value }),

  selectedPlan: null,
  setSelectedPlan: (value) => set({ selectedPlan: value }),

  openFilter: false,
  setOpenFilter: (value) => set({ openFilter: value }),

  filteredPoints: [],
  setFilteredPoints: (value) => set({ filteredPoints: value }),

  filteredPlans: [],
  setFilteredPlans: (value) => set({ filteredPlans: value }),

  periode: "Alle",
  setPeriode: (value) => set({ periode: value }),

  dateFrom: "",
  setDateFrom: (value) => set({ dateFrom: value }),

  dateTo: "",
  setDateTo: (value) => set({ dateTo: value }),

  selectedPoint: null,
  setSelectedPoint: (value) => set({ selectedPoint: value }),

  selectedGeometry: null,
  setSelectedGeometry: (value) => set({ selectedGeometry: value }),

  omschrijving: "",
  setOmschrijving: (value) => set({ omschrijving: value }),

  waarnemer: "",
  setWaarnemer: (value) => set({ waarnemer: value }),

  piloot: "",
  setPiloot: (value) => set({ piloot: value }),

  datum: "",
  setDatum: (value) => set({ datum: value }),

  geplandeVliegduur: "",
  setGeplandeVliegduur: (value) => set({ geplandeVliegduur: value }),

  typeLuchtvaartuig: "",
  setTypeLuchtvaartuig: (value) => set({ typeLuchtvaartuig: value }),

  aantalPassagiers: null,
  setAantalPassagiers: (value) => set({ aantalPassagiers: value }),

  doelEnHoofdthema: "",
  setDoelEnHoofdthema: (value) => set({ doelEnHoofdthema: value }),

  aanvullendeInfo: "",
  setAanvullendeInfo: (value) => set({ aanvullendeInfo: value }),

  filterTerm: "",
  setFilterTerm: (value) => set({ filterTerm: value }),

  clear: () =>
    set({
      step: 1,
      setStep: (value) => set({ step: value }),

      selectedPlan: null,
      setSelectedPlan: (value) => set({ selectedPlan: value }),

      openFilter: false,
      setOpenFilter: (value) => set({ openFilter: value }),

      filteredPoints: [],
      setFilteredPoints: (value) => set({ filteredPoints: value }),
    }),
}));
