import { type RequestHandler } from "express";
import { decodeJwtPayload } from "../jwt";

// @ts-ignore
export const meHandler: RequestHandler = (req, res) => {
  const auth = req.session.auth;

  if (!auth?.tokenSet?.access_token) {
    return res
      .status(401)
      .json({ user: null, roles: { realm: [], resource: {} } });
  }

  const idClaims = auth.tokenSet.claims?.() ?? {};
  const accessClaims = decodeJwtPayload<any>(auth.tokenSet.access_token);

  const username =
    idClaims.preferred_username ??
    accessClaims?.preferred_username ??
    auth.userInfo?.preferred_username ??
    auth.userInfo?.email ??
    null;

  const realmRoles: string[] =
    // @ts-ignore: keycloak realm_access is not typed
    accessClaims?.realm_access?.roles ?? idClaims?.realm_access?.roles ?? [];

  const resourceRoles =
    accessClaims?.resource_access ?? idClaims?.resource_access ?? {};

  res.json({
    user: {
      username,
      name: auth.userInfo?.name ?? idClaims.name ?? null,
      email: auth.userInfo?.email ?? idClaims.email ?? null,
      sub: idClaims.sub ?? accessClaims?.sub ?? null,
    },
    roles: {
      realm: realmRoles,
      resource: resourceRoles,
    },
    raw: {
      idToken: idClaims,
    },
  });
};
