import { EnrichedPointType, FlightPlanType } from "Types";
import { create } from "zustand";
import { Geometry } from "hooks/features/useGeometriesStore";

export const useOpenTable = create<{
  openTable: boolean;
  setOpenTable: (openTable: boolean) => void;

  pointsTable: EnrichedPointType[];
  setPointsTable: (pointsTable: EnrichedPointType[]) => void;

  geometriesTable: Geometry[];
  setGeometriesTable: (geometriesTable: Geometry[]) => void;

  flightPlans: FlightPlanType[];
  setFlightPlans: (flightPlans: FlightPlanType[]) => void;

  view: "" | "flightPlans" | "points";
  setView: (tab: "" | "flightPlans" | "points") => void;

  flightPlanData: FlightPlanType | null;
  setFlightPlanData: (flightPlanData: FlightPlanType | null) => void;
}>((set) => ({
  openTable: false,
  setOpenTable: (openTable: boolean) => set({ openTable }),

  pointsTable: [],
  setPointsTable: (pointsTable: EnrichedPointType[]) => set({ pointsTable }),

  geometriesTable: [],
  setGeometriesTable: (geometriesTable: Geometry[]) => set({ geometriesTable }),

  flightPlans: [],
  setFlightPlans: (flightPlans: FlightPlanType[]) => set({ flightPlans }),

  view: "",
  setView: (view: "" | "flightPlans" | "points") => set({ view }),

  flightPlanData: null,
  setFlightPlanData: (flightPlanData: FlightPlanType | null) =>
    set({ flightPlanData }),
}));
