import { create } from "zustand";
import axios from "axios";
import { EnrichedPointType } from "Types";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

type PointsFilters = {
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
};

interface PointsState {
  points: EnrichedPointType[];
  setPoints: (points: EnrichedPointType[]) => void;

  dbPoints: EnrichedPointType[];
  setDbPoints: (dbPoints: EnrichedPointType[]) => void;

  polygonPoints: EnrichedPointType[];
  setPolygonPoints: (filteredPoints: EnrichedPointType[]) => void;

  lastFetchFilters: PointsFilters | null;
  refetchPoints: () => Promise<void>;

  fetchPoints: (filters?: PointsFilters) => Promise<void>;

  fetchDBPoints: (filters?: PointsFilters) => Promise<void>;

  clearPoints: () => void;
}

async function loadPoints(
  filters: PointsFilters,
  set: (partial: Partial<PointsState>) => void
): Promise<void> {
  try {
    const url = `${getBackEndUrl()}/api/points?hasGeometry=false`;

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
    set({ points: res.data, dbPoints: res.data });
  } catch (error) {
    console.error("Failed to fetch points:", error);
  }
}

export const usePointsStore = create<PointsState>((set, get) => ({
  points: [],
  setPoints: (points) => set({ points }),

  dbPoints: [],
  setDbPoints: (dbPoints) => set({ dbPoints }),

  polygonPoints: [],
  setPolygonPoints: (polygonPoints) => set({ polygonPoints }),

  lastFetchFilters: null,

  refetchPoints: async () => {
    const { lastFetchFilters } = get();
    await loadPoints(lastFetchFilters ?? {}, set);
  },

  fetchPoints: async (filters = {}) => {
    set({ lastFetchFilters: filters });
    await loadPoints(filters, set);
  },

  fetchDBPoints: async (filters = {}) => {
    set({ lastFetchFilters: filters });
    await loadPoints(filters, set);
  },

  clearPoints: () => set({ points: [] }),
}));

