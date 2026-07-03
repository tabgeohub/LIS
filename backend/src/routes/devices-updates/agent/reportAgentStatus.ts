import type { RequestHandler } from "express";
import { applyAgentReport } from "../db";
import {
  parseAgentReportBody,
  parseCompletedCommand,
  parseDeviceStatus,
} from "./parseAgentReport";

export const reportAgentStatus: RequestHandler = async (req, res) => {
  const device = req.device;
  if (!device) {
    res.status(401).json({ error: "Device not authenticated" });
    return;
  }

  const status = parseDeviceStatus(req.body?.status);
  if (!status) {
    res.status(400).json({ error: "Invalid status value" });
    return;
  }

  const report = parseAgentReportBody({ ...req.body, status });
  const completedCommand = parseCompletedCommand(req.body?.completed_command);

  try {
    const updated = await applyAgentReport({
      deviceId: device.id,
      report,
      completedCommand,
    });

    if (!updated) {
      res.status(404).json({ error: "Device not found" });
      return;
    }

    res.json({ device: updated });
  } catch (err) {
    console.error("Failed to apply agent report:", err);
    res.status(500).json({ error: "Failed to save device status" });
  }
};
