import { Request, Response } from "express";
import { fetchRegionalFlightPlanList } from "../../helpers/queries/flight-plans/fetchFlightPlanList";

export async function getUnPreparedPlans(
  req: Request,
  res: Response
): Promise<void> {
  await fetchRegionalFlightPlanList({
    req,
    res,
    columnPreset: "minimal",
    pointPreset: "minimal",
    where: "fp.status = 'pre-prepared'",
    errorMessage: "Failed to fetch partial flight plans",
    appendErrorToMessage: false,
    includeErrorField: true,
  });
}
