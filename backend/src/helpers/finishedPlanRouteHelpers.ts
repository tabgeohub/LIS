import { Response } from "express";

export function sendFinishedPlanFetchError(res: Response, error: unknown): void {
  console.error("❌ Error fetching finished flightplans:", error);
  res.status(500).json({
    message: "Failed to fetch finished flightplans",
    error: formatFinishedPlanErrorDetails(error),
  });
}

export function sendSingleFinishedPlanFetchError(
  res: Response,
  error: unknown
): void {
  console.error("❌ Error fetching finished flightplan:", error);
  res.status(500).json({
    message: "Failed to fetch finished flightplan",
    error: formatFinishedPlanErrorDetails(error),
  });
}

function formatFinishedPlanErrorDetails(error: unknown) {
  if (!error || typeof error !== "object") {
    return error;
  }

  const err = error as Record<string, unknown>;
  return {
    name: err.name,
    code: err.code,
    hint: err.hint,
    position: err.position,
    detail: err.detail,
    stack: err.stack,
  };
}
