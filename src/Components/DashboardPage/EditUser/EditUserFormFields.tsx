import RoleSelect from "../shared/RoleSelect";
import type { AvailableRole } from "../shared/keycloakRoleTypes";
import type { EditUserFormData } from "./submitEditUser";
import { EditUserProfileFields } from "./EditUserProfileFields";

type Props = {
  formData: EditUserFormData;
  loadingRoles: boolean;
  roles: AvailableRole[];
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

export function EditUserFormFields(props: Props) {
  return (
    <>
      <EditUserProfileFields
        formData={props.formData}
        onChange={props.onChange}
      />
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <RoleSelect
          id="role"
          name="role"
          value={props.formData.role}
          onChange={props.onChange}
          roles={props.roles}
          loading={props.loadingRoles}
          placeholder="No role"
        />
      </div>
    </>
  );
}
