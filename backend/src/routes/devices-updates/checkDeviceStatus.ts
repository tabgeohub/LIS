import type { RequestHandler } from "express";
import { resetDeviceCommand } from "./db";
import { queueDeviceCommandWhenIdle } from "./commandGuard";

export const checkDeviceStatus: RequestHandler = async (req, res) => {
  const id = String(req.params.id || "");
  await queueDeviceCommandWhenIdle({
    deviceId: id,
    command: "CHECK_STATUS",
    res,
    errorLogLabel: "Failed to queue check status:",
    errorMessage: "Failed to queue status check",
  });
};

export const resetDeviceStatus: RequestHandler = async (req, res) => {
  const id = String(req.params.id || "");

  try {
    const updated = await resetDeviceCommand(id);
    if (!updated) {
      res.status(404).json({ error: "Device not found" });
      return;
    }
    res.json({ device: updated });
  } catch (err) {
    console.error("Failed to reset device command:", err);
    res.status(500).json({ error: "Failed to reset device command" });
  }
};
