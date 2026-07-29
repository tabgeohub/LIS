import { create } from "zustand";
import type { KeycloakUser } from "Types/keycloakUser";

export type { KeycloakUser };

type UsersTabType = "all" | "create" | "edit" | "reset" | "roles";

export const useUsersManagementState = create<{
  activeTab: UsersTabType;
  setActiveTab: (tab: UsersTabType) => void;
  selectedUser: KeycloakUser | null;
  setSelectedUser: (user: KeycloakUser | null) => void;
  refreshTrigger: number;
  incrementRefreshTrigger: () => void;
  // Helper functions
  handleCreateSuccess: () => void;
  handleEditUser: (user: KeycloakUser) => void;
  handleResetPassword: (user: KeycloakUser) => void;
  handleEditSuccess: (updatedUser: KeycloakUser) => void;
  handleBack: () => void;
}>((set) => ({
  activeTab: "all",
  setActiveTab: (tab: UsersTabType) => set({ activeTab: tab }),
  selectedUser: null,
  setSelectedUser: (user: KeycloakUser | null) => set({ selectedUser: user }),
  refreshTrigger: 0,
  incrementRefreshTrigger: () =>
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
  handleCreateSuccess: () => {
    set((state) => ({
      refreshTrigger: state.refreshTrigger + 1,
      activeTab: "all",
    }));
  },
  handleEditUser: (user: KeycloakUser) => {
    set({ selectedUser: user, activeTab: "edit" });
  },
  handleResetPassword: (user: KeycloakUser) => {
    set({ selectedUser: user, activeTab: "reset" });
  },
  handleEditSuccess: (updatedUser: KeycloakUser) => {
    set((state) => ({
      refreshTrigger: state.refreshTrigger + 1,
      activeTab: "all",
    }));
  },
  handleBack: () => {
    set({ activeTab: "all" });
  },
}));

