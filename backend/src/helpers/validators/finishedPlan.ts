import { Response } from "express";
import { validateFinishedPlanPoint } from "./validateFinishedPlanPoint";
import type { IncomingPointCoreFields } from "./incomingPointCoreFields";

export type FinishedPlanOkInput = {
  res: Response;
  data: unknown;
  status?: number;
};

export function finishedPlanOk(input: FinishedPlanOkInput) {
  const { res, data, status = 200 } = input;
  return res.status(status).json(data);
}

export type FinishedPlanFailInput = {
  res: Response;
  status: number;
  code: string;
  message: string;
  details?: unknown;
};

export function finishedPlanFail(input: FinishedPlanFailInput) {
  const { res, status, code, message, details } = input;
  return res.status(status).json({ error: { code, message, details } });
}

type FinishedPlanAttachment = {
  url: string;
  objectId?: number | string | null;
  taken_at?: string | Date | null;
  long?: number | null;
  lat?: number | null;
};

export type IncomingPoint = IncomingPointCoreFields & {
  id: number;
  attachments?: FinishedPlanAttachment[] | null;
  order?: number | null;
  comment: string | null;
  spoed?: number | null;
  sendToEmail?: string | null;
};

export type IncomingPlan = {
  id: number;
  user_id: number;
  points: IncomingPoint[];
  pathData?: unknown;
  flightTime?: string | number | null;
};

type ValidateResult =
  | { ok: true; plan: IncomingPlan }
  | { ok: false; reason: string };

function fail(reason: string): ValidateResult {
  return { ok: false, reason };
}

function asObject(value: unknown): object | null {
  if (!value || typeof value !== "object") return null;
  return value;
}

function validatePlanShell(plan: IncomingPlan): ValidateResult | null {
  if (typeof plan.id !== "number" || !Number.isInteger(plan.id)) {
    return fail("`plan.id` must be an integer.");
  }
  if (!Array.isArray(plan.points)) {
    return fail("`plan.points` must be an array (can be empty if needed).");
  }
  return null;
}

function validatePlanPoints(points: IncomingPoint[]): ValidateResult | null {
  for (let i = 0; i < points.length; i++) {
    const pointResult = validateFinishedPlanPoint(points[i], i);
    if (!pointResult.ok) return pointResult;
  }
  return null;
}

export function validateFinishedPlan(raw: unknown): ValidateResult {
  if (!asObject(raw)) return fail("Request body must be a JSON object.");

  const { plan } = raw as { plan?: unknown };
  if (!asObject(plan)) return fail("`plan` is required and must be an object.");

  const typedPlan = plan as IncomingPlan;
  const shellError = validatePlanShell(typedPlan);
  if (shellError) return shellError;

  const pointsError = validatePlanPoints(typedPlan.points);
  if (pointsError) return pointsError;

  return { ok: true, plan: typedPlan };
}
