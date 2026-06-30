import { Request, Response } from "express";
import { fetchFlightPlanList } from "../../helpers/queries/flight-plans/fetchFlightPlanList";

export async function getFullPreparedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  await fetchFlightPlanList(req, res, {
    columnPreset: "prepared",
    pointPreset: "minimal",
    where: "fp.status = 'prepared'",
    regioFilter: { caseInsensitiveAdmin: true },
    useRegioFilter: true,
    errorMessage: "Failed to fetch partial flight plans",
    appendErrorToMessage: false,
    includeErrorField: true,
  });
}
