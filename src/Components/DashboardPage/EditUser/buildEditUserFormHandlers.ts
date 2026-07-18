import { KeycloakUser } from "@helpers/ZustandStates/usersManagementState";
import { submitEditUser, type EditUserFormData } from "./submitEditUser";
import { createFormFieldChangeHandler } from "../shared/createFormFieldChangeHandler";

export function buildEditUserFormHandlers(input: {
  selectedUser: KeycloakUser | null;
  formData: EditUserFormData;
  setFormData: React.Dispatch<React.SetStateAction<EditUserFormData>>;
  setLoading: (value: boolean) => void;
  handleEditSuccess: (user: KeycloakUser) => void;
}) {
  return {
    onChange: createFormFieldChangeHandler(input.setFormData),
    onSubmit: async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.selectedUser) return;
      input.setLoading(true);
      await submitEditUser({
        selectedUser: input.selectedUser,
        formData: input.formData,
        onSuccess: input.handleEditSuccess,
      });
      input.setLoading(false);
    },
  };
}
