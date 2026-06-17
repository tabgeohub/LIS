import type { Response } from "express";
import type { DeviceCommand } from "./types";
import {
  getDeviceById,
  queueDeviceCommand,
  releaseStaleCommands,
} from "./db";

export async function queueDeviceCommandWhenIdle(
  id: string,
  command: DeviceCommand,
  res: Response,
  errorLogLabel: string,
  errorMessage: string
): Promise<void> {
  await releaseStaleCommands(1, id);
  const device = await getDeviceById(id);

  if (!device) {
    res.status(404).json({ error: "Device not found" });
    return;
  }

  if (
    device.command_status === "queued" ||
    device.command_status === "in_progress"
  ) {
    res.status(409).json({
      error: "Device already has a pending command",
      device,
    });
    return;
  }

  try {
    const updated = await queueDeviceCommand(id, command);
    res.json({ device: updated });
  } catch (err) {
    console.error(errorLogLabel, err);
    res.status(500).json({ error: errorMessage });
  }
}
