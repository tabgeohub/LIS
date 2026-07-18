import toast from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

async function putResetPassword(userId: string, password: string) {
  const response = await fetch(
    `${getBackEndUrl()}/api/keycloak/management/users/${userId}/reset-password`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password, temporary: false }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to reset password");
}

export async function submitResetPassword(input: {
  userId: string;
  password: string;
  confirmPassword: string;
  onSuccess: () => void;
}): Promise<boolean> {
  if (input.password !== input.confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }
  try {
    await putResetPassword(input.userId, input.password);
    toast.success("Password reset successfully");
    setTimeout(() => input.onSuccess(), 1000);
    return true;
  } catch (err: any) {
    toast.error(err?.message || "Failed to reset password");
    return false;
  }
}
