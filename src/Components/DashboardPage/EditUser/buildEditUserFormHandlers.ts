import { KeycloakUser } from "@helpers/ZustandStates/usersManagementState";
import { submitEditUser, type EditUserFormData } from "./submitEditUser";
import { createFormFieldChangeHandler } from "../shared/createFormFieldChangeHandler";
import { createAsyncFormSubmitHandler } from "../shared/createAsyncFormSubmitHandler";

export function buildEditUserFormHandlers(input: {
  selectedUser: KeycloakUser | null;
  formData: EditUserFormData;
  setFormData: React.Dispatch<React.SetStateAction<EditUserFormData>>;
  setLoading: (value: boolean) => void;
  handleEditSuccess: (user: KeycloakUser) => void;
}) {
  return {
    onChange: createFormFieldChangeHandler(input.setFormData),
    onSubmit: createAsyncFormSubmitHandler({
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
    }),
  };
}
