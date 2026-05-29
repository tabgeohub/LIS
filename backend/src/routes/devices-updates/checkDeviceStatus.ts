import type { RequestHandler } from "express";
import { getDeviceById, queueDeviceCommand } from "./db";

export const checkDeviceStatus: RequestHandler = async (req, res) => {
  const id = String(req.params.id || "");
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
