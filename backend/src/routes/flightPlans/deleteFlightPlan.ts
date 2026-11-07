import { Request, Response } from "express";
import {
  deleteFlightPlanByStatus,
  requireFlightPlanId,
  sendDeleteFlightPlanError,
} from "./deleteFlightPlanHelpers";
import { authorizeFlightPlan } from "./planAccess";

export async function deleteFlightPlan(req: Request, res: Response) {
  const id = requireFlightPlanId(req, res);
  if (!id) return;
  if (!(await authorizeFlightPlan(req, res, id))) return;

  try {
    await deleteFlightPlanByStatus(id, res);
  } catch (err) {
    sendDeleteFlightPlanError(res, err);
  }
}
