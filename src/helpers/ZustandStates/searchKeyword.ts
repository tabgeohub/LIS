import { create } from "zustand";

export const useSearchKeyword = create<{
  searchKeyword: string;
  setSearchKeyword: (searchKeyword: string) => void;
}>((set) => ({
  searchKeyword: "",
  setSearchKeyword: (searchKeyword: string) => set({ searchKeyword }),
}));
