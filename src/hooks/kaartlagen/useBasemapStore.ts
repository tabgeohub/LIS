import { create } from "zustand";

interface BasemapStore {
  selectedBasemap: string;
  setSelectedBasemap: (selectedBasemap: string) => void;

  ondergrond: boolean;
  setOndergrond: (ondergrond: boolean) => void;

  basemap: string;
  setBasemap: (basemap: string) => void;

  openCheck: boolean;
  setOpenCheck: (openCheck: boolean) => void;
}

export const useSelectedBasemapState = create<BasemapStore>((set) => ({
  selectedBasemap: "topo-vector",
  setSelectedBasemap: (selectedBasemap: string) => set({ selectedBasemap }),

  ondergrond: true,
  setOndergrond: (ondergrond: boolean) => set({ ondergrond }),

  basemap: "topo-vector",
  setBasemap: (basemap: string) => set({ basemap }),

  openCheck: true,
  setOpenCheck: (openCheck: boolean) => set({ openCheck }),
}));
