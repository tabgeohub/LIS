import type { AvailableRole } from "../shared/keycloakRoleTypes";
import type { EditUserFormData } from "./submitEditUser";
import { EditUserFormFields } from "./EditUserFormFields";
import {
  EditUserFormActions,
  EditUserFormHeader,
} from "./EditUserFormChrome";

type Props = {
  formData: EditUserFormData;
  loading: boolean;
  loadingRoles: boolean;
  roles: AvailableRole[];
  onBack: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function EditUserForm(props: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <EditUserFormHeader onBack={props.onBack} />
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit User</h2>
      <form onSubmit={props.onSubmit} className="space-y-6">
        <EditUserFormFields {...props} />
        <EditUserFormActions {...props} />
      </form>
    </div>
  );
}
