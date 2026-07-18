import { useState } from "react";
import { useUsersManagementState } from "@helpers/ZustandStates/usersManagementState";
import { buildResetPasswordHandlers } from "./buildResetPasswordHandlers";

export function useResetPasswordModel() {
  const selectedUser = useUsersManagementState((s) => s.selectedUser);
  const handleBack = useUsersManagementState((s) => s.handleBack);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const handlers = buildResetPasswordHandlers({
    selectedUser,
    formData,
    setFormData,
    setLoading,
    handleBack,
  });

  return {
    selectedUser,
    formProps: {
      username: selectedUser?.username || selectedUser?.email,
      formData,
      loading,
      onBack: handleBack,
      ...handlers,
    },
  };
}
