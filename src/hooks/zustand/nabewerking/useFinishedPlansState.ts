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

const initialState = {
  step: 1,
  selectedPlan: null as FinishedFlightPlanType | null,
  openFilter: false,
  filteredPoints: [] as FinishedPointType[],
  filteredPlans: [] as FinishedFlightPlanType[],
  periode: "Alle",
  dateFrom: "",
  dateTo: "",
  selectedPoint: null as FinishedPointType | null,
  selectedGeometry: null as FinishedGeometryType | null,
  omschrijving: "",
  waarnemer: "",
  piloot: "",
  datum: "",
  geplandeVliegduur: "",
  typeLuchtvaartuig: "",
  aantalPassagiers: null as number | null | undefined,
  doelEnHoofdthema: "",
  aanvullendeInfo: "",
  filterTerm: "",
};

/** Subset reset when leaving the search flow (preserves form/filter fields). */
const clearState = {
  step: initialState.step,
  selectedPlan: initialState.selectedPlan,
  openFilter: initialState.openFilter,
  filteredPoints: initialState.filteredPoints,
};

export const useFinishedPlansState = create<FinishedPlansState>((set) => ({
  ...initialState,
  setStep: (value) => set({ step: value }),
  setSelectedPlan: (value) => set({ selectedPlan: value }),
  setOpenFilter: (value) => set({ openFilter: value }),
  setFilteredPoints: (value) => set({ filteredPoints: value }),
  setFilteredPlans: (value) => set({ filteredPlans: value }),
  setPeriode: (value) => set({ periode: value }),
  setDateFrom: (value) => set({ dateFrom: value }),
  setDateTo: (value) => set({ dateTo: value }),
  setSelectedPoint: (value) => set({ selectedPoint: value }),
  setSelectedGeometry: (value) => set({ selectedGeometry: value }),
  setOmschrijving: (value) => set({ omschrijving: value }),
  setWaarnemer: (value) => set({ waarnemer: value }),
  setPiloot: (value) => set({ piloot: value }),
  setDatum: (value) => set({ datum: value }),
  setGeplandeVliegduur: (value) => set({ geplandeVliegduur: value }),
  setTypeLuchtvaartuig: (value) => set({ typeLuchtvaartuig: value }),
  setAantalPassagiers: (value) => set({ aantalPassagiers: value }),
  setDoelEnHoofdthema: (value) => set({ doelEnHoofdthema: value }),
  setAanvullendeInfo: (value) => set({ aanvullendeInfo: value }),
  setFilterTerm: (value) => set({ filterTerm: value }),
  clear: () => set(clearState),
}));
