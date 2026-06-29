import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { KeycloakUser } from "@helpers/ZustandStates/usersManagementState";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { useUsersManagementState } from "@helpers/ZustandStates/usersManagementState";
import { IoIosArrowBack } from "react-icons/io";
import RoleSelect from "../shared/RoleSelect";
import { useKeycloakRoles } from "../shared/useKeycloakRoles";

type FormData = {
  username: string;
  email: string;
  role: string;
};

export default function EditUser() {
  const selectedUser = useUsersManagementState((state) => state.selectedUser);
  const handleEditSuccess = useUsersManagementState(
    (state) => state.handleEditSuccess
  );
  const handleBack = useUsersManagementState((state) => state.handleBack);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    role: "",
  });
  const { loadingRoles, filteredRealmRoles } = useKeycloakRoles();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username || "",
        email: selectedUser.email || "",
        role: selectedUser.realmRoles?.[0] || "",
      });
    }
  }, [selectedUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setLoading(true);

    try {
      // Update user info
      const updateResponse = await fetch(
        `${getBackEndUrl()}/api/keycloak/management/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: formData.username,
            email: formData.email || undefined,
          }),
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update user");
      }

      // Update user roles (single role)
      const rolesResponse = await fetch(
        `${getBackEndUrl()}/api/keycloak/management/users/${selectedUser.id}/roles`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            roles: formData.role ? [formData.role] : [],
          }),
        }
      );

      if (!rolesResponse.ok) {
        const errorData = await rolesResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update user roles");
      }

      toast.success("User updated successfully");

      // Update the user and navigate back
      if (selectedUser) {
        const updatedUser: KeycloakUser = {
          ...selectedUser,
          username: formData.username,
          email: formData.email,
          realmRoles: formData.role ? [formData.role] : [],
        };

        setTimeout(() => {
          handleEditSuccess(updatedUser);
        }, 1000);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!selectedUser) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">No user selected</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors"
        >
          <IoIosArrowBack className="w-5 h-5" />
          <span className="font-medium">All Users</span>
        </button>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
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
            placeholder="No role"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || loadingRoles}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:bg-blue-700/50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Updating..." : "Update User"}
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

