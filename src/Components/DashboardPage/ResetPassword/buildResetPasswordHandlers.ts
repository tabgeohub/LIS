import { submitResetPassword } from "./submitResetPassword";
import { createDashboardFormHandlers } from "../shared/createDashboardFormHandlers";

type FormData = { password: string; confirmPassword: string };

export function buildResetPasswordHandlers(input: {
  selectedUser: { id: string } | null;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setLoading: (value: boolean) => void;
  handleBack: () => void;
}) {
  return createDashboardFormHandlers({
    setFormData: input.setFormData,
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
  });
}
