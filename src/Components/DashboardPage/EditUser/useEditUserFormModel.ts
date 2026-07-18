import { useState } from "react";
import { useUsersManagementState } from "@helpers/ZustandStates/usersManagementState";
import { useKeycloakRoles } from "../shared/useKeycloakRoles";
import type { EditUserFormData } from "./submitEditUser";
import { buildEditUserFormHandlers } from "./buildEditUserFormHandlers";
import { useSyncEditUserForm } from "./useSyncEditUserForm";

export function useEditUserFormModel() {
  const selectedUser = useUsersManagementState((s) => s.selectedUser);
  const handleEditSuccess = useUsersManagementState((s) => s.handleEditSuccess);
  const handleBack = useUsersManagementState((s) => s.handleBack);
  const [formData, setFormData] = useState<EditUserFormData>({
    username: "",
    email: "",
    role: "",
  });
  const { loadingRoles, filteredRealmRoles } = useKeycloakRoles();
  const [loading, setLoading] = useState(false);
  useSyncEditUserForm(selectedUser, setFormData);
  return {
    selectedUser,
    formProps: {
      formData,
      loading,
      loadingRoles,
      roles: filteredRealmRoles,
      onBack: handleBack,
      ...buildEditUserFormHandlers({
        selectedUser,
        formData,
        setFormData,
        setLoading,
        handleEditSuccess,
      }),
    },
  };
}
