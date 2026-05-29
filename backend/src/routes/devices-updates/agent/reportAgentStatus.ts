import type { RequestHandler } from "express";
import { applyAgentReport } from "../db";
import type { AgentReportBody, DeviceCommand, DeviceStatus } from "../types";

const VALID_STATUSES = new Set<DeviceStatus>([
  "unknown",
  "checking",
  "up_to_date",
  "updates_available",
  "updating",
  "reboot_required",
  "failed",
]);

export const reportAgentStatus: RequestHandler = async (req, res) => {
  const device = req.device;
  if (!device) {
    res.status(401).json({ error: "Device not authenticated" });
    return;
  }

  const status = String(req.body?.status || "") as DeviceStatus;
  if (!VALID_STATUSES.has(status)) {
    res.status(400).json({ error: "Invalid status value" });
    return;
  }

  const completedCommand = req.body?.completed_command
    ? (String(req.body.completed_command) as DeviceCommand)
    : null;

  const report: AgentReportBody = {
    status,
    windows_version: req.body?.windows_version
      ? String(req.body.windows_version)
      : undefined,
    os_build: req.body?.os_build ? String(req.body.os_build) : undefined,
    pending_update_count:
      req.body?.pending_update_count !== undefined
        ? Number(req.body.pending_update_count)
        : undefined,
    reboot_required: Boolean(req.body?.reboot_required),
    error: req.body?.error ? String(req.body.error) : undefined,
    command_completed: Boolean(req.body?.command_completed),
  };

  try {
    const updated = await applyAgentReport(device.id, report, completedCommand);
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
