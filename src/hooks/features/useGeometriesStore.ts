import { create } from "zustand";
import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import type { Geometry } from "Types/geometry";

export type { Geometry } from "Types/geometry";

type GeometryFilters = {
  regio?: string | number;
};

interface GeometriesState {
  geometries: Geometry[];
  setGeometries: (geometries: Geometry[]) => void;

  dbGeometries: Geometry[];
  setDbGeometries: (dbGeometries: Geometry[]) => void;

  lastFetchFilters: GeometryFilters | null;
  refetchGeometries: () => Promise<void>;

  fetchGeometries: (filters?: GeometryFilters) => Promise<void>;

  fetchDBGeometries: (filters?: GeometryFilters) => Promise<void>;

  clearGeometries: () => void;
}

async function loadGeometries(
  filters: GeometryFilters,
  set: (partial: Partial<GeometriesState>) => void
): Promise<void> {
  try {
    const url = `${getBackEndUrl()}/api/geometries`;

    const params: Record<string, string | number> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params[key] = typeof value === "number" ? value : String(value);
      }
    });

    const res = await axios.get<Geometry[]>(url, { params });
    set({ geometries: res.data, dbGeometries: res.data });
  } catch (error) {
    console.error("Failed to fetch geometries:", error);
  }
}

export const useGeometriesStore = create<GeometriesState>((set, get) => ({
  geometries: [],
  setGeometries: (geometries) => set({ geometries }),

  dbGeometries: [],
  setDbGeometries: (dbGeometries) => set({ dbGeometries }),

  lastFetchFilters: null,

  refetchGeometries: async () => {
    const { lastFetchFilters } = get();
    await loadGeometries(lastFetchFilters ?? {}, set);
  },

  fetchGeometries: async (filters = {}) => {
    set({ lastFetchFilters: filters });
    await loadGeometries(filters, set);
  },

  fetchDBGeometries: async (filters = {}) => {
    set({ lastFetchFilters: filters });
    await loadGeometries(filters, set);
  },

  clearGeometries: () => set({ geometries: [] }),
}));
