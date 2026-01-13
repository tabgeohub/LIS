// src/routes/auth/authKeycloak/resolveProfile.ts
type Profile = "public" | "intranet";

export function resolveProfile(req: any): Profile {
  const ref = (req.get("referer") || req.get("origin") || "").toLowerCase();
  return ref.includes(".intranet.") ? "intranet" : "public";
}
