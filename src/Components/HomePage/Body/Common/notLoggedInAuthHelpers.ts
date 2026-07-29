import { getBackEndUrl } from "@helpers/http/getBackEndUrl";

export type BannerKind = "notLoggedIn" | "noRole" | null;

export function resolveBannerKind(user: {
  user_id: number;
  role: string | undefined;
}): BannerKind {
  if (user.user_id === 0) return "notLoggedIn";
  if (user.role === undefined) return "noRole";
  return null;
}

export function loginRedirect() {
  window.location.href = `${getBackEndUrl()}/auth/login`;
}

export async function logoutRequest(
  setUser: (user: { user_id: number; user_name: string; role: string }) => void
) {
  setUser({ user_id: 0, user_name: "", role: "" });
  const res = await fetch(`${getBackEndUrl()}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  try {
    await res.json();
  } catch (_) {
    // ignore
  }
}
