import type { RequestHandler } from "express";
import { getDeviceById, queueDeviceCommand, releaseStaleCommands } from "./db";

export const triggerDeviceUpdate: RequestHandler = async (req, res) => {
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
    const updated = await queueDeviceCommand(id, "UPDATE");
    res.json({ device: updated });
  } catch (err) {
    console.error("Failed to queue device update:", err);
    res.status(500).json({ error: "Failed to queue device update" });
  }
};
