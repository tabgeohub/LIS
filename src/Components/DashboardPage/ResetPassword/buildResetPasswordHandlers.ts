import { submitResetPassword } from "./submitResetPassword";
import { createFormFieldChangeHandler } from "../shared/createFormFieldChangeHandler";
import { createAsyncFormSubmitHandler } from "../shared/createAsyncFormSubmitHandler";

type FormData = { password: string; confirmPassword: string };

export function buildResetPasswordHandlers(input: {
  selectedUser: { id: string } | null;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setLoading: (value: boolean) => void;
  handleBack: () => void;
}) {
  return {
    onChange: createFormFieldChangeHandler(input.setFormData),
    onSubmit: createAsyncFormSubmitHandler({
      hasSelection: Boolean(input.selectedUser),
      setLoading: input.setLoading,
      submit: async () => {
        if (!input.selectedUser) return;
        const ok = await submitResetPassword({
          userId: input.selectedUser.id,
          password: input.formData.password,
          confirmPassword: input.formData.confirmPassword,
          onSuccess: input.handleBack,
        });
        if (ok) input.setFormData({ password: "", confirmPassword: "" });
      },
    }),
  };
}
