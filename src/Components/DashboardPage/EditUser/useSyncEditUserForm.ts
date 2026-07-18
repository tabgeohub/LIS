import { useEffect } from "react";
import type { EditUserFormData } from "./submitEditUser";

export function useSyncEditUserForm(
  selectedUser: {
    username?: string;
    email?: string;
    realmRoles?: string[];
  } | null,
  setFormData: React.Dispatch<React.SetStateAction<EditUserFormData>>
) {
  useEffect(() => {
    if (!selectedUser) return;
    setFormData({
      username: selectedUser.username || "",
      email: selectedUser.email || "",
      role: selectedUser.realmRoles?.[0] || "",
    });
  }, [selectedUser, setFormData]);
}
