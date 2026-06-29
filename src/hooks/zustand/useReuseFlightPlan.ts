import { EnrichedPointType, FlightPlanType } from "Types";
import { create } from "zustand";
import {
  createFlightPlanFormFieldSetters,
  createPlanListFilterSetters,
  emptyFlightPlanFormFields,
  emptyPlanListFilter,
  FlightPlanFormFieldValues,
  PlanListFilterValues,
} from "hooks/zustand/shared/flightPlanFormFields";

interface ReUseFlightPlanState extends FlightPlanFormFieldValues, PlanListFilterValues {
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

  filteredPlans: FlightPlanType[];
  setFilteredPlans: (value: FlightPlanType[]) => void;

  filteredPoints: EnrichedPointType[];
  setFilteredPoints: (value: EnrichedPointType[]) => void;

  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;

  setOmschrijving: (value: string) => void;
  setWaarnemer: (value: string) => void;
  setPiloot: (value: string) => void;
  setDatum: (value: string) => void;
  setGeplandeVliegduur: (value: string) => void;
  setTypeLuchtvaartuig: (value: string) => void;
  setAantalPassagiers: (value: number | null | undefined) => void;
  setDoelEnHoofdthema: (value: string) => void;
  setAanvullendeInfo: (value: string) => void;
  setOpenFilter: (value: boolean) => void;
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
  filteredPlans: [] as FlightPlanType[],
  filteredPoints: [] as EnrichedPointType[],
  vluchtnummer: "",
  ...emptyPlanListFilter,
  ...emptyFlightPlanFormFields,
};

export const useReuseFlightPlan = create<ReUseFlightPlanState>((set) => ({
  ...initialState,
  setStep: (value) => set({ step: value }),
  setCurrentPoints: (value) => set({ currentPoints: value }),
  setCurrentGeometries: (value) => set({ currentGeometries: value }),
  setNewPoints: (value) => set({ newPoints: value }),
  setNewGeometries: (value) => set({ newGeometries: value }),
  setSelectedPlan: (value) => set({ selectedPlan: value }),
  setFilteredPlans: (value) => set({ filteredPlans: value }),
  setFilteredPoints: (value) => set({ filteredPoints: value }),
  setVluchtnummer: (value) => set({ vluchtnummer: value }),
  ...createFlightPlanFormFieldSetters(set),
  ...createPlanListFilterSetters(set),
  clear: () => set(initialState),
}));
