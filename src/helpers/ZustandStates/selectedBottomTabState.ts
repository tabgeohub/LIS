import { create } from "zustand";

export const useSelectedBottomTabState = create<{
  selectedBottomTab: string;
  setSelectedBottomTab: (selectedBottomTab: string) => void;
}>((set) => ({
  selectedBottomTab: "Kaartlagenlijst",
  setSelectedBottomTab: (selectedBottomTab: string) =>
    set({ selectedBottomTab }),
}));
