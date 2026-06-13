import { Response } from "express";

export function finishedPlanOk(res: Response, data: unknown, status = 200) {
  return res.status(status).json(data);
}

export function finishedPlanFail(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown
) {
  return res.status(status).json({ error: { code, message, details } });
}

type FinishedPlanAttachment = {
  url: string;
  objectId?: number | string | null;
  taken_at?: string | Date | null;
  long?: number | null;
  lat?: number | null;
};

type IncomingPoint = {
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

function isNonEmptyArray<T>(x: unknown): x is T[] {
  return Array.isArray(x) && x.length >= 0;
}

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

  if (!isNonEmptyArray<IncomingPoint>(typedPlan.points))
    return {
      ok: false,
      reason: "`plan.points` must be an array (can be empty if needed).",
    };

  for (let i = 0; i < typedPlan.points.length; i++) {
    const p = typedPlan.points[i];
    if (typeof p !== "object")
      return { ok: false, reason: `points[${i}] must be an object.` };
    if (typeof p.id !== "number")
      return { ok: false, reason: `points[${i}].id must be a number.` };
    if (typeof p.omschrijving !== "string")
      return {
        ok: false,
        reason: `points[${i}].omschrijving must be a string.`,
      };
  }

  return { ok: true, plan: typedPlan };
}
