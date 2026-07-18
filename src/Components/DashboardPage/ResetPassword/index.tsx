import { useResetPasswordModel } from "./useResetPasswordModel";
import NoUserSelectedPanel from "../shared/NoUserSelectedPanel";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default function ResetPassword() {
  const model = useResetPasswordModel();
  if (!model.selectedUser) return <NoUserSelectedPanel />;
  return <ResetPasswordForm {...model.formProps} />;
}
