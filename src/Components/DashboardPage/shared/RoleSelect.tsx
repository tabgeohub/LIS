import { AvailableRole } from "./keycloakRoleTypes";

type RoleSelectProps = {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  roles: AvailableRole[];
  loading?: boolean;
  placeholder?: string;
};

export default function RoleSelect({
  id,
  name,
  value,
  onChange,
  roles,
  loading = false,
  placeholder = "Select a role",
}: RoleSelectProps) {
  if (loading) {
    return <div className="text-sm text-gray-500 py-2">Loading roles...</div>;
  }

  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">{placeholder}</option>
      {roles.map((role) => (
        <option key={role.id} value={role.name}>
          {role.name}
        </option>
      ))}
    </select>
  );
}
