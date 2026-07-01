import type { RequestHandler } from "express";
import { queueDeviceCommandWhenIdle } from "./commandGuard";

export const triggerDeviceUpdate: RequestHandler = async (req, res) => {
  const id = String(req.params.id || "");
  await queueDeviceCommandWhenIdle({
    deviceId: id,
    command: "UPDATE",
    res,
    errorLogLabel: "Failed to queue device update:",
    errorMessage: "Failed to queue device update",
  });
};
