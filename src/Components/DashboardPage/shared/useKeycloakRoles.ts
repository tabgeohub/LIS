import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import {
  AvailableRoles,
  filterRealmRoles,
} from "./keycloakRoleTypes";

export function useKeycloakRoles() {
  const [availableRoles, setAvailableRoles] = useState<AvailableRoles>({
    realmRoles: [],
    clientRoles: {},
  });
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      setLoadingRoles(true);
      try {
        const response = await fetch(
          `${getBackEndUrl()}/api/keycloak/management/roles`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch roles");
        }
        setAvailableRoles(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load roles";
        toast.error(message);
      } finally {
        setLoadingRoles(false);
      }
    };

    loadRoles();
  }, []);

  const filteredRealmRoles = useMemo(
    () => filterRealmRoles(availableRoles.realmRoles),
    [availableRoles.realmRoles]
  );

  return { availableRoles, loadingRoles, filteredRealmRoles };
}
