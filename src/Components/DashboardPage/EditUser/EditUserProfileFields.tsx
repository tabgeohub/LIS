import type { EditUserFormData } from "./submitEditUser";
import { EditUserTextField } from "./EditUserTextField";

export function EditUserProfileFields(props: {
  formData: EditUserFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <EditUserTextField
        id="username"
        label="Username"
        value={props.formData.username}
        onChange={props.onChange}
        disabled
      />
      <EditUserTextField
        id="email"
        label="Email"
        type="email"
        value={props.formData.email}
        onChange={props.onChange}
      />
    </div>
  );
}
