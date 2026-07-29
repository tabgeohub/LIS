import { useState } from "react";
import { useUsersManagementState } from "hooks/zustand/ui";
import RoleSelect from "../shared/RoleSelect";
import { useKeycloakRoles } from "../shared/useKeycloakRoles";
import PasswordConfirmFields from "../shared/PasswordConfirmFields";
import {
  emptyAddUserForm,
  submitCreateUser,
  type AddUserFormData,
} from "./submitCreateUser";

export default function AddUser() {
  const handleCreateSuccess = useUsersManagementState(
    (state) => state.handleCreateSuccess
  );
  const [formData, setFormData] = useState<AddUserFormData>(emptyAddUserForm);
  const { loadingRoles, filteredRealmRoles } = useKeycloakRoles();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await submitCreateUser({
      formData,
      onSuccess: handleCreateSuccess,
    });
    if (ok) setFormData(emptyAddUserForm);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Add User</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Username"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email"
            />
          </div>
        </div>

        <PasswordConfirmFields
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onChange={handleInputChange}
        />

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <RoleSelect
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            roles={filteredRealmRoles}
            loading={loadingRoles}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || loadingRoles}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:bg-blue-700/50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}

