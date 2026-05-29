import type { RequestHandler } from "express";
import { claimPendingCommand, touchDeviceSeen } from "../db";

export const getAgentCommands: RequestHandler = async (req, res) => {
  const device = req.device;
  if (!device) {
    res.status(401).json({ error: "Device not authenticated" });
    return;
  }

  try {
    await touchDeviceSeen(device.id);
    const command = await claimPendingCommand(device.id);
    res.json({ command });
  } catch (err) {
    console.error("Failed to fetch agent commands:", err);
    res.status(500).json({ error: "Failed to fetch commands" });
  }
};
