import { PageType, TabType } from "Types";
import { create } from "zustand";

export const useTabState = create<{
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;

  selectedPage: PageType;
  setSelectedPage: (selectedPage: PageType) => void;

  openBevragen: boolean;
  setOpenBevragen: (openBevragen: boolean) => void;
}>((set) => ({
  selectedTab: "none",
  setSelectedTab: (tab: TabType) => set({ selectedTab: tab }),

  selectedPage: "voorbereiding",
  setSelectedPage: (selectedPage: PageType) => set({ selectedPage }),

  openBevragen: false,
  setOpenBevragen: (openBevragen: boolean) => set({ openBevragen }),
}));
