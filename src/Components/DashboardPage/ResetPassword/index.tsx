import { useState } from "react";
import toast from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { useUsersManagementState } from "@helpers/ZustandStates/usersManagementState";
import NoUserSelectedPanel from "../shared/NoUserSelectedPanel";
import PasswordConfirmFields from "../shared/PasswordConfirmFields";

type FormData = {
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const selectedUser = useUsersManagementState((state) => state.selectedUser);
  const handleBack = useUsersManagementState((state) => state.handleBack);
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${getBackEndUrl()}/api/keycloak/management/users/${selectedUser.id}/reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            password: formData.password,
            temporary: false,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      toast.success("Password reset successfully");

      // Reset form and go back
      setFormData({
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        handleBack();
      }, 1000);
    } catch (err: any) {
      toast.error(err?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!selectedUser) {
    return <NoUserSelectedPanel />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Reset Password for {selectedUser.username || selectedUser.email}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <PasswordConfirmFields
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onChange={handleInputChange}
          passwordLabel="New Password *"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:bg-blue-700/50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Resetting..." : "Reset Password"}
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

