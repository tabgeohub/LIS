import { submitResetPassword } from "./submitResetPassword";
import { createDashboardSubmitHandlers } from "../shared/createDashboardSubmitHandlers";

type FormData = { password: string; confirmPassword: string };

export function buildResetPasswordHandlers(input: {
  selectedUser: { id: string } | null;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setLoading: (value: boolean) => void;
  handleBack: () => void;
}) {
  return createDashboardSubmitHandlers({
    setFormData: input.setFormData,
    selected: input.selectedUser,
    setLoading: input.setLoading,
    submitSelected: async (selectedUser) => {
      const ok = await submitResetPassword({
        userId: selectedUser.id,
        password: input.formData.password,
        confirmPassword: input.formData.confirmPassword,
        onSuccess: input.handleBack,
      });
      if (ok) input.setFormData({ password: "", confirmPassword: "" });
    },
  });
}
