import type { RequestHandler } from "express";
import { randomUUID } from "crypto";
import { registerDevice } from "../db";

export const registerAgent: RequestHandler = async (req, res) => {
  const machineId = String(req.body?.machine_id || "").trim();
  const hostname = String(req.body?.hostname || "").trim();
  const windowsVersion = req.body?.windows_version
    ? String(req.body.windows_version)
    : undefined;
  const osBuild = req.body?.os_build ? String(req.body.os_build) : undefined;

  if (!machineId || !hostname) {
    res.status(400).json({ error: "machine_id and hostname are required" });
    return;
  }

  try {
    const { device, deviceToken } = await registerDevice({
      machineId,
      hostname,
      deviceToken: randomUUID(),
      windowsVersion,
      osBuild,
    });

    res.status(201).json({
      device_token: deviceToken,
      device,
    });
  } catch (err) {
    console.error("Agent registration failed:", err);
    res.status(500).json({ error: "Failed to register device" });
  }
};
