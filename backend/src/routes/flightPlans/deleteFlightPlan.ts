import { Request, Response } from "express";
import {
  deleteFlightPlanByStatus,
  requireFlightPlanId,
  sendDeleteFlightPlanError,
} from "./deleteFlightPlanHelpers";

export async function deleteFlightPlan(req: Request, res: Response) {
  const id = requireFlightPlanId(req, res);
  if (!id) return;

  try {
    await deleteFlightPlanByStatus(id, res);
  } catch (err) {
    sendDeleteFlightPlanError(res, err);
  }
}
