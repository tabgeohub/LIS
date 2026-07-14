import { Request, Response } from "express";
import { fetchRegionalFlightPlanList } from "../../helpers/queries/flight-plans/fetchFlightPlanList";
import { formatPlansWithGeometries } from "../../helpers/queries/geometries/formatPlanGeometries";

export async function getAllFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  await fetchRegionalFlightPlanList({
    req,
    res,
    columnPreset: "all",
    pointPreset: "full",
    includeGeometryJoin: true,
    where: "fp.status <> 'inactief'",
    errorLogLabel: "❌ Error fetching flight plans:",
    errorMessage: "Failed to fetch flight plans",
    transform: (rows) =>
      formatPlansWithGeometries(rows as Record<string, unknown>[]),
  });
}
