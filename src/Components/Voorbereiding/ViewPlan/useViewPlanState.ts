import { FlightPlanType } from "Types";
import { create } from "zustand";
import {
  createFlightPlanFormFieldSettersWithZeroPassagiers,
  FlightPlanFormFieldSetters,
  FlightPlanFormFieldValues,
  viewPlanFlightPlanFormDefaults,
} from "hooks/zustand/shared/flightPlanFormFields";
import {
  createPlanSelectionCoreSetters,
  emptyPlanSelectionCore,
  PlanSelectionCoreSetters,
  PlanSelectionCoreValues,
} from "hooks/zustand/shared/planWizardCore";

interface ViewPlanState
  extends FlightPlanFormFieldValues,
    FlightPlanFormFieldSetters,
    PlanSelectionCoreValues<FlightPlanType>,
    PlanSelectionCoreSetters<FlightPlanType> {
  initialPlans: FlightPlanType[];
  setInitialPlans: (initialPlans: FlightPlanType[]) => void;

  openFilter: boolean;
  setOpenFilter: (openFilter: boolean) => void;

  dateVan: string;
  setDateVan: (dateVan: string) => void;

  dateTot: string;
  setDateTot: (dateTot: string) => void;

  filterInput: string;
  setFilterInput: (filterInput: string) => void;

  selectedIndex: number;
  setSelectedIndex: (selectedIndex: number) => void;

  clickedPoint: number;
  setClickedPoint: (clickedPoint: number) => void;

  clickedGeometry: number | null;
  setClickedGeometry: (clickedGeometry: number | null) => void;
}

export const useViewPlanState = create<ViewPlanState>((set) => ({
  initialPlans: [],
  setInitialPlans: (initialPlans) => set({ initialPlans }),

  ...emptyPlanSelectionCore<FlightPlanType>(),
  ...createPlanSelectionCoreSetters<FlightPlanType>(set),

  openFilter: false,
  setOpenFilter: (openFilter) => set({ openFilter }),

  dateVan: "",
  setDateVan: (dateVan) => set({ dateVan }),

  dateTot: "",
  setDateTot: (dateTot) => set({ dateTot }),

  filterInput: "",
  setFilterInput: (filterInput) => set({ filterInput }),

  selectedIndex: 0,
  setSelectedIndex: (selectedIndex) => set({ selectedIndex }),

  ...viewPlanFlightPlanFormDefaults,
  ...createFlightPlanFormFieldSettersWithZeroPassagiers(set),

  clickedPoint: 0,
  setClickedPoint: (clickedPoint) => set({ clickedPoint }),

  clickedGeometry: null,
  setClickedGeometry: (clickedGeometry) => set({ clickedGeometry }),
}));
