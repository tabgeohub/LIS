import { create } from "zustand";

export const useOpenResultTab = create<{
  openResultTab: boolean;
  setOpenResultTab: (openResultTab: boolean) => void;
}>((set) => ({
  openResultTab: false,
  setOpenResultTab: (openResultTab: boolean) => set({ openResultTab }),
}));
