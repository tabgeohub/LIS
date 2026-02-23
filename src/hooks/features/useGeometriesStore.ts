import { create } from "zustand";
import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

interface GeometryPoint {
  id: number;
  longitude: number;
  latitude: number;
  [key: string]: any;
}

export interface Geometry {
  id: number;
  omschrijving: string;
  type: "polygon" | "line";
  points: GeometryPoint[];
  organisatie?: string;
  vertrouwelijk?: boolean | number;
  herhalen?: boolean | number;
  activiteit?: string;
  specifiek_letten_op?: string;
  regio_id?: string;
  [key: string]: any;
}

interface GeometriesState {
  geometries: Geometry[];
  setGeometries: (geometries: Geometry[]) => void;

  dbGeometries: Geometry[];
  setDbGeometries: (dbGeometries: Geometry[]) => void;

  fetchGeometries: (filters?: {
    regio?: string | number;
  }) => Promise<void>;

  fetchDBGeometries: (filters?: {
    regio?: string | number;
  }) => Promise<void>;

  clearGeometries: () => void;
}

export const useGeometriesStore = create<GeometriesState>((set) => ({
  geometries: [],
  setGeometries: (geometries) => set({ geometries }),

  dbGeometries: [],
  setDbGeometries: (dbGeometries) => set({ dbGeometries }),

  fetchGeometries: async (filters = {}) => {
    try {
      const url = `${getBackEndUrl()}/api/geometries`;

      // Only send defined, non-empty values as query params
      const params: Record<string, string | number> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params[key] = typeof value === "number" ? value : String(value);
        }
      });

      const res = await axios.get<Geometry[]>(url, { params });

      // Populate both geometries and dbGeometries with the same data to avoid duplicate API calls
      set({ geometries: res.data, dbGeometries: res.data });
    } catch (error) {
      console.error("Failed to fetch geometries:", error);
    }
  },

  fetchDBGeometries: async (filters = {}) => {
    try {
      const url = `${getBackEndUrl()}/api/geometries`;

      // Only send defined, non-empty values as query params
      const params: Record<string, string | number> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params[key] = typeof value === "number" ? value : String(value);
        }
      });

      const res = await axios.get<Geometry[]>(url, { params });

      // Populate both geometries and dbGeometries with the same data to avoid duplicate API calls
      set({ geometries: res.data, dbGeometries: res.data });
    } catch (error) {
      console.error("Failed to fetch geometries:", error);
    }
  },

  clearGeometries: () => set({ geometries: [] }),
}));

