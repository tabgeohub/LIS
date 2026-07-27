import type { NextFunction, Request, RequestHandler, Response } from "express";
import { getDeviceByToken } from "./db";
import { requireAdmin } from "../../helpers/auth/realmAdminAuth";

export { requireAdmin } from "../../helpers/auth/realmAdminAuth";

function extractBearerToken(authorizationHeader: string | undefined): string {
  const header = authorizationHeader || "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

async function attachDeviceFromToken(
  req: Request,
  res: Response,
  token: string,
  next: NextFunction
): Promise<void> {
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
}

export const requireDeviceToken: RequestHandler = async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    res.status(401).json({ error: "Device token required" });
    return;
  }
  await attachDeviceFromToken(req, res, token, next);
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
