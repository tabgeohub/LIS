import type { RequestHandler } from "express";
import { decodeJwtPayload } from "../auth/jwt";
import { getDeviceByToken } from "./db";

type AccessClaims = {
  realm_access?: {
    roles?: string[];
  };
};

export function getRealmRoles(req: Parameters<RequestHandler>[0]): string[] {
  const token = req.session?.auth?.tokenSet?.access_token;
  const claims = decodeJwtPayload<AccessClaims>(token);
  return claims?.realm_access?.roles ?? [];
}

export function isAdmin(req: Parameters<RequestHandler>[0]): boolean {
  return getRealmRoles(req).some((role) => role.toLowerCase().includes("admin"));
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (!isAdmin(req)) {
    res.status(403).json({ error: "Admin role required" });
    return;
  }
  next();
};

export const requireDeviceToken: RequestHandler = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!token) {
    res.status(401).json({ error: "Device token required" });
    return;
  }

  try {
    const device = await getDeviceByToken(token);
    if (!device) {
      res.status(401).json({ error: "Invalid device token" });
      return;
    }

    req.device = {
      id: device.id,
      token: device.device_token,
      hostname: device.hostname,
      machineId: device.machine_id,
    };
    next();
  } catch (err) {
    console.error("Device token auth failed:", err);
    res.status(500).json({ error: "Failed to authenticate device" });
  }
};

declare global {
  namespace Express {
    interface Request {
      device?: {
        id: string;
        token: string;
        hostname: string;
        machineId: string;
      };
    }
  }
}
