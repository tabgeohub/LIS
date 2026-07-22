type Profile = "public" | "intranet";

export function toOidcProfile(hostLike: string): Profile {
  return (hostLike || "").toLowerCase().includes(".intranet.")
    ? "intranet"
    : "public";
}

function firstNonEmpty(...candidates: Array<string | undefined>): string {
  return candidates.find((value) => Boolean(value)) || "";
}

function readRequestHostCandidates(req: {
  get?: (name: string) => string | undefined;
  headers?: Record<string, unknown>;
}): string {
  return firstNonEmpty(
    req.get?.("referer"),
    req.get?.("origin"),
    (req.headers?.["x-forwarded-host"] as string) || undefined,
    req.get?.("host")
  );
}

export function resolveOidcRequestProfile(req: {
  session?: { oidcProfile?: Profile };
  get?: (name: string) => string | undefined;
  headers?: Record<string, unknown>;
}): Profile {
  const sessionProfile = req.session?.oidcProfile;
  if (sessionProfile) return sessionProfile;
  return toOidcProfile(readRequestHostCandidates(req));
}
