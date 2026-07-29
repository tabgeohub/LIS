import { UserType } from "Types";
import { create } from "zustand";

export const useAuth = create<{
  user: UserType;
  setUser: (user: UserType) => void;
}>((set) => ({
  user: { user_id: 0, user_name: "", role: "" },
  setUser: (tab: UserType) => set({ user: tab }),
}));
