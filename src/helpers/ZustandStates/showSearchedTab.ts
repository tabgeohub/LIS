import { create } from "zustand";

export const useOpenSearchedTab = create<{
  openSearchedTab: boolean;
  setOpenSearchedTab: (openSearchedTab: boolean) => void;
}>((set) => ({
  openSearchedTab: false,
  setOpenSearchedTab: (openSearchedTab: boolean) => set({ openSearchedTab }),
}));
