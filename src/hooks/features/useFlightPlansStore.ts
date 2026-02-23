import { create } from "zustand";
import axios from "axios";
import { FlightPlanType } from "Types";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

interface FlightPlansState {
  flightPlans: FlightPlanType[];
  setFlightPlans: (plans: FlightPlanType[]) => void;

  // Cache: regio_id -> { data, timestamp }
  cache: Record<string, { data: FlightPlanType[]; timestamp: number }>;
  
  // Cache duration in milliseconds (5 minutes)
  cacheDuration: number;

  fetchFlightPlans: (regio_id: string | number) => Promise<void>;
  refetchFlightPlans: (regio_id: string | number) => Promise<void>;
  clearFlightPlans: () => void;
}

export const useFlightPlansStore = create<FlightPlansState>((set, get) => ({
  flightPlans: [],
  setFlightPlans: (plans) => set({ flightPlans: plans }),

  cache: {},
  cacheDuration: 5 * 60 * 1000, // 5 minutes

  fetchFlightPlans: async (regio_id: string | number) => {
    const state = get();
    const cacheKey = String(regio_id);
    const now = Date.now();
    const cached = state.cache[cacheKey];

    // Check if we have cached data that's still fresh
    if (cached && now - cached.timestamp < state.cacheDuration) {
      // Data is cached and fresh, use cached data
      set({ flightPlans: cached.data });
      return;
    }

    try {
      const url = `${getBackEndUrl()}/api/flightPlans?regio_id=${regio_id}`;
      const res = await axios.get<FlightPlanType[]>(url);

      set({
        flightPlans: res.data,
        cache: {
          ...state.cache,
          [cacheKey]: { data: res.data, timestamp: now },
        },
      });
    } catch (error) {
      console.error("Failed to fetch flight plans:", error);
    }
  },

  refetchFlightPlans: async (regio_id: string | number) => {
    const state = get();
    const cacheKey = String(regio_id);
    const now = Date.now();

    try {
      const url = `${getBackEndUrl()}/api/flightPlans?regio_id=${regio_id}`;
      const res = await axios.get<FlightPlanType[]>(url);

      set({
        flightPlans: res.data,
        cache: {
          ...state.cache,
          [cacheKey]: { data: res.data, timestamp: now },
        },
      });
    } catch (error) {
      console.error("Failed to refetch flight plans:", error);
    }
  },

  clearFlightPlans: () => set({ flightPlans: [], cache: {} }),
}));

