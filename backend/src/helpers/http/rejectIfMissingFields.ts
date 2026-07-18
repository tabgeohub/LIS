import { Response } from "express";
import { getMissingFields } from "./validateBody";
import { missingFields } from "./routeResponses";

/** Respond 400 when required body fields are missing. Returns true if rejected. */
export function rejectIfMissingFields(
  res: Response,
  body: Record<string, unknown>,
  fields: string[],
  message?: string
): boolean {
  if (getMissingFields(body, fields).length === 0) {
    return false;
  }
  missingFields(res, message);
  return true;
}
