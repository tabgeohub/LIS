import { Request, Response } from "express";
import { fetchFlightPlanList } from "../../helpers/queries/flight-plans/fetchFlightPlanList";

export async function getPrepreparedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  await fetchFlightPlanList({
    req,
    res,
    columnPreset: "search",
    pointPreset: "search",
    where: "fp.status = 'pre-prepared'",
    regioFilter: { caseInsensitiveAdmin: true },
    useRegioFilter: true,
    errorLogLabel: "❌ Error fetching pre-prepared flight plans:",
    errorMessage: "Failed to fetch pre-prepared flight plans",
  });
}
