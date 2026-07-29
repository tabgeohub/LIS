import { create } from "zustand";

export const useOpenAllTable = create<{
  openAllTable: boolean;
  setOpenAllTable: (openAllTable: boolean) => void;
}>((set) => ({
  openAllTable: false,
  setOpenAllTable: (openAllTable: boolean) => set({ openAllTable }),
}));
