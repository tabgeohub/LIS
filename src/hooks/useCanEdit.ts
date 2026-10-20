import { useAuth } from "hooks/zustand/ui";
import { canEdit, isViewerOnly } from "helpers/auth/viewerAccess";

/** False when the signed-in user has intern (viewer-only) affiliation. */
export function useCanEdit(): boolean {
  const { user } = useAuth();
  return canEdit(user);
}

export function useIsViewerOnly(): boolean {
  const { user } = useAuth();
  return isViewerOnly(user);
}
