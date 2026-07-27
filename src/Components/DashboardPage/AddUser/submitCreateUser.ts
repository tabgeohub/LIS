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

function createUserPayload(formData: AddUserFormData) {
  return {
    username: formData.username,
    email: formData.email || undefined,
    password: formData.password,
    role: formData.role || undefined,
  };
}

function toastCreateUserError(err: any) {
  toast.error(err?.message || "Failed to create user");
}

export async function submitCreateUser(input: {
  formData: AddUserFormData;
  onSuccess: () => void;
}): Promise<boolean> {
  if (input.formData.password !== input.formData.confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  try {
    await createKeycloakUser(createUserPayload(input.formData));
    toast.success("User created successfully");
    setTimeout(() => input.onSuccess(), 1000);
    return true;
  } catch (err: unknown) {
    toastCreateUserError(err);
    return false;
  }
}
