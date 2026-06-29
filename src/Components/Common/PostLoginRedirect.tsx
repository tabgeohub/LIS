import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * After OIDC callback the backend redirects to a fixed frontend URL and exposes
 * the validated return path once via /auth/me as pendingClientPath.
 */
export default function PostLoginRedirect({
  pendingClientPath,
}: {
  pendingClientPath: string | null;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!pendingClientPath) return;

    const targetPath = pendingClientPath.split("?")[0];
    const currentPath = location.pathname;
    if (targetPath === currentPath && pendingClientPath === location.pathname + location.search) {
      return;
    }

    navigate(pendingClientPath, { replace: true });
  }, [pendingClientPath, navigate, location.pathname, location.search]);

  return null;
}
