import { useEditUserFormModel } from "./useEditUserFormModel";
import NoUserSelectedPanel from "../shared/NoUserSelectedPanel";
import { EditUserForm } from "./EditUserForm";

export default function EditUser() {
  const model = useEditUserFormModel();
  if (!model.selectedUser) return <NoUserSelectedPanel />;
  return <EditUserForm {...model.formProps} />;
}
