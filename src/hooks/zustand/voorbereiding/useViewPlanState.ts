import { FlightPlanType } from "Types";
import { create } from "zustand";
import {
  createFlightPlanFormFieldSetters,
  emptyFlightPlanFormFields,
  FlightPlanFormFieldSetters,
  FlightPlanFormFieldValues,
} from "hooks/zustand/shared/flightPlanFormFields";

interface ViewPlanState
  extends FlightPlanFormFieldValues,
    FlightPlanFormFieldSetters {
  initialPlans: FlightPlanType[];
  setInitialPlans: (initialPlans: FlightPlanType[]) => void;

  step: number;
  setStep: (step: number) => void;

  openFilter: boolean;
  setOpenFilter: (openFilter: boolean) => void;

  dateVan: string;
  setDateVan: (dateVan: string) => void;

  dateTot: string;
  setDateTot: (dateTot: string) => void;

  filterInput: string;
  setFilterInput: (filterInput: string) => void;

  filteredPlans: FlightPlanType[];
  setFilteredPlans: (filteredPlans: FlightPlanType[]) => void;

  selectedPlan: FlightPlanType | null;
  setSelectedPlan: (selectedPlan: FlightPlanType) => void;

  selectedIndex: number;
  setSelectedIndex: (selectedIndex: number) => void;

  clickedPoint: number;
  setClickedPoint: (clickedPoint: number) => void;

  clickedGeometry: number | null;
  setClickedGeometry: (clickedGeometry: number | null) => void;
}

const viewPlanFormDefaults = {
  ...emptyFlightPlanFormFields,
  geplandeVliegduur: "0:00",
  aantalPassagiers: 0 as number,
};

export const useViewPlanState = create<ViewPlanState>((set) => ({
  initialPlans: [],
  setInitialPlans: (initialPlans: FlightPlanType[]) =>
    set(() => ({ initialPlans })),

  step: 1,
  setStep: (step: number) => set(() => ({ step })),

  openFilter: false,
  setOpenFilter: (openFilter: boolean) => set(() => ({ openFilter })),

  dateVan: "",
  setDateVan: (dateVan: string) => set(() => ({ dateVan })),

  dateTot: "",
  setDateTot: (dateTot: string) => set(() => ({ dateTot })),

  filterInput: "",
  setFilterInput: (filterInput: string) => set(() => ({ filterInput })),

  filteredPlans: [],
  setFilteredPlans: (filteredPlans: FlightPlanType[]) =>
    set(() => ({ filteredPlans })),

  selectedIndex: 0,
  setSelectedIndex: (selectedIndex: number) => set(() => ({ selectedIndex })),

  ...viewPlanFormDefaults,
  ...createFlightPlanFormFieldSetters((partial) =>
    set((state) => ({
      ...state,
      ...partial,
      aantalPassagiers:
        partial.aantalPassagiers !== undefined
          ? (partial.aantalPassagiers ?? 0)
          : state.aantalPassagiers,
    }))
  ),

  clickedPoint: 0,
  setClickedPoint: (clickedPoint: number) => set(() => ({ clickedPoint })),

  clickedGeometry: null,
  setClickedGeometry: (clickedGeometry: number | null) =>
    set(() => ({ clickedGeometry })),

  selectedPlan: null,
  setSelectedPlan: (selectedPlan: FlightPlanType) =>
    set(() => ({ selectedPlan })),
}));
