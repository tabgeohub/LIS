import { Request, Response } from "express";
import { missingFields } from "../../helpers/http/routeResponses";
import {
  insertAndRespondFlightPlan,
  isValidCreateFlightPlanBody,
  respondCreateFlightPlanError,
} from "./createFlightPlanHelpers";
import { authorizeCreateRegion } from "./planAccess";

export async function createFlightPlan(
  req: Request,
  res: Response
): Promise<void> {
  if (!(await authorizeCreateRegion(req, res, req.body?.regio_id))) return;
  if (!isValidCreateFlightPlanBody(req.body)) {
    missingFields(res);
    return;
  }

  try {
    await insertAndRespondFlightPlan(req.body, res);
  } catch (err) {
    respondCreateFlightPlanError(res, err);
  }
}
