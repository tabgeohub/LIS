import type { RequestHandler } from "express";
import { queueDeviceCommandWhenIdle } from "./commandGuard";

export const triggerDeviceUpdate: RequestHandler = async (req, res) => {
  const id = String(req.params.id || "");
  await queueDeviceCommandWhenIdle(
    id,
    "UPDATE",
    res,
    "Failed to queue device update:",
    "Failed to queue device update"
  );
};
