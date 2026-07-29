import { KeycloakUser } from "hooks/zustand/ui/usersManagementState";
import { submitEditUser, type EditUserFormData } from "./submitEditUser";
import { createDashboardSubmitHandlers } from "../shared/createDashboardSubmitHandlers";

export function buildEditUserFormHandlers(input: {
  selectedUser: KeycloakUser | null;
  formData: EditUserFormData;
  setFormData: React.Dispatch<React.SetStateAction<EditUserFormData>>;
  setLoading: (value: boolean) => void;
  handleEditSuccess: (user: KeycloakUser) => void;
}) {
  return createDashboardSubmitHandlers({
    setFormData: input.setFormData,
    selected: input.selectedUser,
    setLoading: input.setLoading,
    submitSelected: async (selectedUser) => {
      await submitEditUser({
        selectedUser,
        formData: input.formData,
        onSuccess: input.handleEditSuccess,
      });
    },
  });
}
