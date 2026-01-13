import { create } from "zustand";
import axios from "axios";
import { EnrichedPointType } from "Types";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

interface PointsState {
  points: EnrichedPointType[];
  setPoints: (points: EnrichedPointType[]) => void;

  dbPoints: EnrichedPointType[];
  setDbPoints: (dbPoints: EnrichedPointType[]) => void;

  polygonPoints: EnrichedPointType[];
  setPolygonPoints: (filteredPoints: EnrichedPointType[]) => void;

  fetchPoints: (filters?: {
    activiteit?: string;
    organisatie?: string;
    status?: string | string[];
    periodFilter?: string;
    van?: string;
    tot?: string;
    herhalen?: string | number;
    filterText?: string;
    regio?: string | number;
    naamAandachtspunt?: string;
  }) => Promise<void>;

  fetchDBPoints: (filters?: {
    activiteit?: string;
    organisatie?: string;
    status?: string | string[];
    periodFilter?: string;
    van?: string;
    tot?: string;
    herhalen?: string | number;
    filterText?: string;
    regio?: string | number;
    naamAandachtspunt?: string;
  }) => Promise<void>;

  clearPoints: () => void;
}

export const usePointsStore = create<PointsState>((set) => ({
  points: [],
  setPoints: (points) => set({ points }),

  dbPoints: [],
  setDbPoints: (dbPoints) => set({ dbPoints }),

  polygonPoints: [],
  setPolygonPoints: (polygonPoints) => set({ polygonPoints }),

  fetchPoints: async (filters = {}) => {
    try {
      const url = `${getBackEndUrl()}/api/points`;

      // Only send defined, non-empty values as query params
      const params: Record<string, string | number> = {};
      const mergedFilters = {
        status: ["bezocht", "niet bezocht"],
        ...filters,
      };
      Object.entries(mergedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          if (Array.isArray(value)) {
            if (value.length > 0) params[key] = value.join(",");
          } else {
            params[key] = typeof value === "number" ? value : String(value);
          }
        }
      });

      const res = await axios.get<EnrichedPointType[]>(url, { params });

      set({ points: res.data });
    } catch (error) {
      console.error("Failed to fetch points:", error);
    }
  },

  fetchDBPoints: async (filters = {}) => {
    try {
      const url = `${getBackEndUrl()}/api/points`;

      // Only send defined, non-empty values as query params
      const params: Record<string, string | number> = {};
      const mergedFilters = {
        status: ["bezocht", "niet bezocht"],
        ...filters,
      };
      Object.entries(mergedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          if (Array.isArray(value)) {
            if (value.length > 0) params[key] = value.join(",");
          } else {
            params[key] = typeof value === "number" ? value : String(value);
          }
        }
      });

      const res = await axios.get<EnrichedPointType[]>(url, { params });

      set({ dbPoints: res.data });
    } catch (error) {
      console.error("Failed to fetch points:", error);
    }
  },

  clearPoints: () => set({ points: [] }),
}));
