import { Request, Response } from "express";
import { denyMissingPlanIdentity, resolvePlanPrincipal } from "../flightPlans/planAccess";
import {
  queryFlightPlansByPoint,
  sendFlightPlansByPointError,
} from "./getFlightPlansByPointHelpers";

export async function getFlightPlansByPoint(
  req: Request,
  res: Response
): Promise<void> {
  const { pointId } = req.params;

  if (!pointId) {
    res.status(400).json({ message: "Missing pointId parameter" });
    return;
  }

  try {
    const principal = await resolvePlanPrincipal(req);
    if (!principal) { denyMissingPlanIdentity(res); return; }
    const rows = await queryFlightPlansByPoint(pointId, principal);
    res.status(200).json(rows);
  } catch (err) {
    sendFlightPlansByPointError(res, err);
  }
}
