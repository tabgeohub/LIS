import type { Response } from "express";
import type { DeviceCommand } from "./types";
import {
  getDeviceById,
  queueDeviceCommand,
  releaseStaleCommands,
} from "./db";

export type QueueDeviceCommandInput = {
  deviceId: string;
  command: DeviceCommand;
  res: Response;
  errorLogLabel: string;
  errorMessage: string;
};

export async function queueDeviceCommandWhenIdle(
  input: QueueDeviceCommandInput
): Promise<void> {
  const { deviceId, command, res, errorLogLabel, errorMessage } = input;

  await releaseStaleCommands(1, deviceId);
  const device = await getDeviceById(deviceId);

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
    const updated = await queueDeviceCommand(deviceId, command);
    res.json({ device: updated });
  } catch (err) {
    console.error(errorLogLabel, err);
    res.status(500).json({ error: errorMessage });
  }
}
