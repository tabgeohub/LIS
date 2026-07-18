import { Request, Response } from "express";
import { missingFields } from "../../helpers/http/routeResponses";
import {
  insertAndRespondFlightPlan,
  isValidCreateFlightPlanBody,
  respondCreateFlightPlanError,
} from "./createFlightPlanHelpers";

export async function createFlightPlan(
  req: Request,
  res: Response
): Promise<void> {
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
