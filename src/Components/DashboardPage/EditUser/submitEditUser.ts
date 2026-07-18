import toast from "react-hot-toast";
import { KeycloakUser } from "@helpers/ZustandStates/usersManagementState";
import {
  assignKeycloakUserRoles,
  updateKeycloakUserProfile,
} from "../shared/keycloakUserApi";

export type EditUserFormData = {
  username: string;
  email: string;
  role: string;
};

async function persistEditUser(
  selectedUser: KeycloakUser,
  formData: EditUserFormData
) {
  await updateKeycloakUserProfile({
    userId: selectedUser.id,
    username: formData.username,
    email: formData.email,
  });
  await assignKeycloakUserRoles({
    userId: selectedUser.id,
    roles: formData.role ? [formData.role] : [],
  });
  return {
    ...selectedUser,
    username: formData.username,
    email: formData.email,
    realmRoles: formData.role ? [formData.role] : [],
  } as KeycloakUser;
}

export async function submitEditUser(input: {
  selectedUser: KeycloakUser;
  formData: EditUserFormData;
  onSuccess: (user: KeycloakUser) => void;
}): Promise<void> {
  try {
    const updatedUser = await persistEditUser(
      input.selectedUser,
      input.formData
    );
    toast.success("User updated successfully");
    setTimeout(() => input.onSuccess(updatedUser), 1000);
  } catch (err: any) {
    toast.error(err?.message || "Failed to update user");
  }
}
