import { KeycloakUser } from "@helpers/ZustandStates/usersManagementState";
import { submitEditUser, type EditUserFormData } from "./submitEditUser";
import { createDashboardFormHandlers } from "../shared/createDashboardFormHandlers";

export function buildEditUserFormHandlers(input: {
  selectedUser: KeycloakUser | null;
  formData: EditUserFormData;
  setFormData: React.Dispatch<React.SetStateAction<EditUserFormData>>;
  setLoading: (value: boolean) => void;
  handleEditSuccess: (user: KeycloakUser) => void;
}) {
  return createDashboardFormHandlers({
    setFormData: input.setFormData,
    hasSelection: Boolean(input.selectedUser),
    setLoading: input.setLoading,
    submit: async () => {
      if (!input.selectedUser) return;
      await submitEditUser({
        selectedUser: input.selectedUser,
        formData: input.formData,
        onSuccess: input.handleEditSuccess,
      });
    },
  });
}
