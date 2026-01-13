import { create } from "zustand";

export const useStarredAll = create<{
  starredAll: boolean;
  setStarredAll: (starredAll: boolean) => void;
}>((set) => ({
  starredAll: false,
  setStarredAll: (starredAll: boolean) => set({ starredAll }),
}));
