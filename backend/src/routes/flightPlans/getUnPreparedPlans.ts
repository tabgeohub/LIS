import { Request, Response } from "express";
import { fetchFlightPlanList } from "../../helpers/queries/fetchFlightPlanList";

export async function getUnPreparedPlans(
  req: Request,
  res: Response
): Promise<void> {
  await fetchFlightPlanList(req, res, {
    columnPreset: "minimal",
    pointPreset: "minimal",
    where: "fp.status = 'pre-prepared'",
    regioFilter: { caseInsensitiveAdmin: true },
    useRegioFilter: true,
    errorMessage: "Failed to fetch partial flight plans",
    appendErrorToMessage: false,
    includeErrorField: true,
  });
}
