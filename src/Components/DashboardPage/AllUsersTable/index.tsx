import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { KeycloakUser } from "@helpers/ZustandStates/usersManagementState";
import Table from "./Table";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { useUsersManagementState } from "@helpers/ZustandStates/usersManagementState";

const unwantedRoles = [
  "default-roles-",
  "offline_access",
  "uma_authorization",
  "manage-account",
  "manage-account-links",
  "view-profile",
  "manage-realm",
];

function filterUnwantedRoles(roles: string[]): string[] {
  return roles.filter(
    (role) => !unwantedRoles.some((unwanted) => role.includes(unwanted))
  );
}

function mapKeycloakUserToUser(keycloakUser: KeycloakUser): KeycloakUser {
  const realmRoles = keycloakUser.realmRoles || [];
  const clientRoles = keycloakUser.clientRoles || {};
  const allClientRoles = Object.values(clientRoles).flat();

  const allRoles = Array.from(new Set([...realmRoles, ...allClientRoles]));
  const filteredRoles = filterUnwantedRoles(allRoles);

  return {
    ...keycloakUser,
    realmRoles: filteredRoles,
  };
}

export default function AllUsersTable() {
  const refreshTrigger = useUsersManagementState(
    (state) => state.refreshTrigger
  );
  const handleEditUser = useUsersManagementState(
    (state) => state.handleEditUser
  );
  const handleResetPassword = useUsersManagementState(
    (state) => state.handleResetPassword
  );
  const [users, setUsers] = useState<KeycloakUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<KeycloakUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${getBackEndUrl()}/api/keycloak/management/users`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to fetch users (${response.status})`
        );
      }

      const keycloakUsers = data as KeycloakUser[];
      const mappedUsers = keycloakUsers.map(mapKeycloakUserToUser);

      setUsers(mappedUsers);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [refreshTrigger]);

  const handleDeleteClick = (user: KeycloakUser) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `${getBackEndUrl()}/api/keycloak/management/users/${userToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      toast.success("User deleted successfully");

      // Remove user from state
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">All Users</h1>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : (
          <Table
            users={users}
            onEditUser={handleEditUser}
            onResetPassword={handleResetPassword}
            onDeleteUser={handleDeleteClick}
          />
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.username || userToDelete?.email || "Unknown"}
        loading={deleting}
      />
    </div>
  );
}

