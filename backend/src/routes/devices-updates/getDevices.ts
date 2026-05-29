import type { RequestHandler } from "express";
import { listDevices } from "./db";

export const getDevices: RequestHandler = async (_req, res) => {
  try {
    const devices = await listDevices();
    res.json({ devices });
  } catch (err) {
    console.error("Failed to list devices:", err);
    res.status(500).json({ error: "Failed to list devices" });
  }
};
