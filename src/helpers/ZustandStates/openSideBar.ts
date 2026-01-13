import { create } from "zustand";

export const useOpeSideBarState = create<{
  openSideBar: boolean;
  setOpenSideBar: (openSideBar: boolean) => void;
}>((set) => ({
  openSideBar: false,
  setOpenSideBar: (openSideBar: boolean) => set({ openSideBar }),
}));
