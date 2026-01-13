import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { useUsersManagementState } from "@helpers/ZustandStates/usersManagementState";

type AvailableRole = {
  id: string;
  name: string;
};

type AvailableRoles = {
  realmRoles: AvailableRole[];
  clientRoles: Record<string, AvailableRole[]>;
};

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

const unwantedRoles = [
  "default-roles-",
  "offline_access",
  "uma_authorization",
  "manage-account",
  "manage-account-links",
  "view-profile",
  "manage-realm",
];

function isUnwantedRole(role: string): boolean {
  return unwantedRoles.some((unwanted) => role.includes(unwanted));
}

export default function AddUser() {
  const handleCreateSuccess = useUsersManagementState(
    (state) => state.handleCreateSuccess
  );
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [availableRoles, setAvailableRoles] = useState<AvailableRoles>({
    realmRoles: [],
    clientRoles: {},
  });
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      setLoadingRoles(true);
      try {
        const response = await fetch(
          `${getBackEndUrl()}/api/keycloak/management/roles`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch roles");
        }

        setAvailableRoles(data);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load roles");
      } finally {
        setLoadingRoles(false);
      }
    };

    loadRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${getBackEndUrl()}/api/keycloak/management/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: formData.username,
            email: formData.email || undefined,
            password: formData.password,
            role: formData.role || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      toast.success("User created successfully");

      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });

      // Navigate to all users table after a short delay
      setTimeout(() => {
        handleCreateSuccess();
      }, 1000);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const filteredRealmRoles = availableRoles.realmRoles.filter(
    (role) => !isUnwantedRole(role.name)
  );

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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm Password"
            />
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          {loadingRoles ? (
            <div className="text-sm text-gray-500 py-2">Loading roles...</div>
          ) : (
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a role</option>
              {filteredRealmRoles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          )}
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

