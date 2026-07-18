import { type RequestHandler } from "express";
import {
  performDirectLogin,
  requireDirectLoginCredentials,
  sendDirectLoginError,
} from "./loginDirectHelpers";

// @ts-ignore
export const loginDirectHandler: RequestHandler = async (req, res) => {
  const credentials = requireDirectLoginCredentials(req, res);
  if (!credentials) return;

  try {
    const payload = await performDirectLogin(req, credentials);
    return res.json(payload);
  } catch (error: unknown) {
    sendDirectLoginError(res, error);
  }
};
