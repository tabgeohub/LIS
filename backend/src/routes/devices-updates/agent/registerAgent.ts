import type { RequestHandler } from "express";
import { randomUUID } from "crypto";
import { registerDevice } from "../db";

function optionalString(value: unknown): string | undefined {
  return value ? String(value) : undefined;
}

function parseRegisterBody(body: {
  machine_id?: unknown;
  hostname?: unknown;
  windows_version?: unknown;
  os_build?: unknown;
}) {
  return {
    machineId: String(body?.machine_id || "").trim(),
    hostname: String(body?.hostname || "").trim(),
    windowsVersion: optionalString(body?.windows_version),
    osBuild: optionalString(body?.os_build),
  };
}

export const registerAgent: RequestHandler = async (req, res) => {
  const parsed = parseRegisterBody(req.body ?? {});

  if (!parsed.machineId || !parsed.hostname) {
    res.status(400).json({ error: "machine_id and hostname are required" });
    return;
  }

  try {
    const { device, deviceToken } = await registerDevice({
      machineId: parsed.machineId,
      hostname: parsed.hostname,
      deviceToken: randomUUID(),
      windowsVersion: parsed.windowsVersion,
      osBuild: parsed.osBuild,
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
