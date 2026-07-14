import { Request, Response } from "express";
import { fetchRegionalFlightPlanList } from "../../helpers/queries/flight-plans/fetchFlightPlanList";

export async function getPrepreparedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  await fetchRegionalFlightPlanList({
    req,
    res,
    columnPreset: "search",
    pointPreset: "search",
    where: "fp.status = 'pre-prepared'",
    errorLogLabel: "❌ Error fetching pre-prepared flight plans:",
    errorMessage: "Failed to fetch pre-prepared flight plans",
  });
}
