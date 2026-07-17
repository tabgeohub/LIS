type Profile = "public" | "intranet";

export function toOidcProfile(hostLike: string): Profile {
  return (hostLike || "").toLowerCase().includes(".intranet.")
    ? "intranet"
    : "public";
}

export function resolveOidcRequestProfile(req: {
  session?: { oidcProfile?: Profile };
  get?: (name: string) => string | undefined;
  headers?: Record<string, unknown>;
}): Profile {
  const sessionProfile = req.session?.oidcProfile;
  if (sessionProfile) return sessionProfile;

  const referer = req.get?.("referer");
  const origin = req.get?.("origin");
  const xfHost = (req.headers?.["x-forwarded-host"] as string) || undefined;
  const host = req.get?.("host");

  return toOidcProfile(referer || origin || xfHost || host || "");
}
