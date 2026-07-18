import toast from "react-hot-toast";
import { createKeycloakUser } from "../shared/keycloakUserApi";

export type AddUserFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

export const emptyAddUserForm: AddUserFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
};

export async function submitCreateUser(input: {
  formData: AddUserFormData;
  onSuccess: () => void;
}): Promise<boolean> {
  if (input.formData.password !== input.formData.confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  try {
    await createKeycloakUser({
      username: input.formData.username,
      email: input.formData.email || undefined,
      password: input.formData.password,
      role: input.formData.role || undefined,
    });
    toast.success("User created successfully");
    setTimeout(() => input.onSuccess(), 1000);
    return true;
  } catch (err: any) {
    toast.error(err?.message || "Failed to create user");
    return false;
  }
}
