import axios from "axios";
import { useAuth } from "hooks/zustand/ui";
import { assertCanEdit } from "helpers/auth/viewerAccess";

const WRITE_METHODS = new Set(["post", "put", "patch", "delete"]);

let installed = false;

/**
 * Blocks axios write calls for intern (viewer-only) users.
 * Complements useApiMutation for ad-hoc axios usage.
 */
export function installViewerMutationGuard() {
  if (installed) return;
  installed = true;

  axios.interceptors.request.use((config) => {
    const method = (config.method || "get").toLowerCase();
    if (!WRITE_METHODS.has(method)) return config;

    const url = String(config.url || "");
    // Allow auth logout / login flows
    if (url.includes("/auth/logout") || url.includes("/auth2/logout")) {
      return config;
    }

    const user = useAuth.getState().user;
    try {
      assertCanEdit(user);
    } catch (error) {
      return Promise.reject(error);
    }
    return config;
  });
}
