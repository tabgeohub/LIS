import { Response } from "express";
import { validateFinishedPlanPoint } from "./validateFinishedPlanPoint";

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

export type IncomingPoint = {
  id: number;
  omschrijving: string;
  regio_id?: string;
  xcoordinaat_rd?: number;
  ycoordinaat_rd?: number;
  latitude?: number;
  longitude?: number;
  vertrouwelijk?: number;
  herhalen?: number;
  user_id?: number;
  activiteit_id?: string;
  organisatie_id?: string;
  specifiek_letten_op?: string;
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

export function validateFinishedPlan(
  raw: unknown
): { ok: true; plan: IncomingPlan } | { ok: false; reason: string } {
  if (!raw || typeof raw !== "object")
    return { ok: false, reason: "Request body must be a JSON object." };

  const { plan } = raw as { plan?: unknown };
  if (!plan || typeof plan !== "object")
    return { ok: false, reason: "`plan` is required and must be an object." };

  const typedPlan = plan as IncomingPlan;

  if (typeof typedPlan.id !== "number" || !Number.isInteger(typedPlan.id))
    return { ok: false, reason: "`plan.id` must be an integer." };

  if (!Array.isArray(typedPlan.points)) {
    return {
      ok: false,
      reason: "`plan.points` must be an array (can be empty if needed).",
    };
  }

  for (let i = 0; i < typedPlan.points.length; i++) {
    const pointResult = validateFinishedPlanPoint(typedPlan.points[i], i);
    if (!pointResult.ok) return pointResult;
  }

  return { ok: true, plan: typedPlan };
}
