import { Request, Response } from "express";
import { fetchRegionalFlightPlanList } from "../../helpers/queries/flight-plans/fetchFlightPlanList";

export async function getFullPreparedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  await fetchRegionalFlightPlanList({
    req,
    res,
    columnPreset: "prepared",
    pointPreset: "minimal",
    where: "fp.status = 'prepared'",
    errorMessage: "Failed to fetch partial flight plans",
    appendErrorToMessage: false,
    includeErrorField: true,
  });
}
