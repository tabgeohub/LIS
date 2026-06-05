import type { RequestHandler } from "express";
import { getDeviceById, queueDeviceCommand, releaseStaleCommands, resetDeviceCommand } from "./db";

export const checkDeviceStatus: RequestHandler = async (req, res) => {
  const id = String(req.params.id || "");
  await releaseStaleCommands(1, id);
  const device = await getDeviceById(id);

  if (!device) {
    res.status(404).json({ error: "Device not found" });
    return;
  }

  if (device.command_status === "queued" || device.command_status === "in_progress") {
    res.status(409).json({
      error: "Device already has a pending command",
      device,
    });
    return;
  }

  try {
    const updated = await queueDeviceCommand(id, "CHECK_STATUS");
    res.json({ device: updated });
  } catch (err) {
    console.error("Failed to queue check status:", err);
    res.status(500).json({ error: "Failed to queue status check" });
  }
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
