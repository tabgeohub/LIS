import { create } from "zustand";
import axios from "axios";
import { EnrichedPointType } from "Types";
import { getBackEndUrl } from "@helpers/http/getBackEndUrl";

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

function isBlankFilterValue(value: unknown): boolean {
  return value === undefined || value === "";
}

function appendArrayFilterParam(input: {
  params: Record<string, string | number>;
  key: string;
  value: unknown[];
}): void {
  if (input.value.length === 0) return;
  input.params[input.key] = input.value.join(",");
}

function appendScalarFilterParam(input: {
  params: Record<string, string | number>;
  key: string;
  value: unknown;
}): void {
  input.params[input.key] =
    typeof input.value === "number" ? input.value : String(input.value);
}

function appendFilterParam(input: {
  params: Record<string, string | number>;
  key: string;
  value: unknown;
}): void {
  if (isBlankFilterValue(input.value)) return;
  if (Array.isArray(input.value)) {
    appendArrayFilterParam({
      params: input.params,
      key: input.key,
      value: input.value,
    });
    return;
  }
  appendScalarFilterParam(input);
}

function buildPointsQueryParams(
  filters: PointsFilters
): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  const mergedFilters = {
    status: ["bezocht", "niet bezocht"],
    ...filters,
  };
  Object.entries(mergedFilters).forEach(([key, value]) => {
    appendFilterParam({ params, key, value });
  });
  return params;
}

async function loadPoints(input: {
  filters: PointsFilters;
  set: (partial: Partial<PointsState>) => void;
}): Promise<void> {
  const { filters, set } = input;
  try {
    const url = `${getBackEndUrl()}/api/points?hasGeometry=false`;
    const res = await axios.get<EnrichedPointType[]>(url, {
      params: buildPointsQueryParams(filters),
    });
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
    await loadPoints({ filters: lastFetchFilters ?? {}, set });
  },

  fetchPoints: async (filters = {}) => {
    set({ lastFetchFilters: filters });
    await loadPoints({ filters, set });
  },

  fetchDBPoints: async (filters = {}) => {
    set({ lastFetchFilters: filters });
    await loadPoints({ filters, set });
  },

  clearPoints: () => set({ points: [] }),
}));

