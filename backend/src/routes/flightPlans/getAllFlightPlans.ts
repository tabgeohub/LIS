import { createRegionalFlightPlanListHandler } from "./createRegionalFlightPlanListHandler";
import { formatPlansWithGeometries } from "../../helpers/queries/geometries/formatPlanGeometries";

export const getAllFlightPlans = createRegionalFlightPlanListHandler({
  columnPreset: "all",
  pointPreset: "full",
  includeGeometryJoin: true,
  where: "fp.status <> 'inactief'",
  errorLogLabel: "❌ Error fetching flight plans:",
  errorMessage: "Failed to fetch flight plans",
  transform: (rows) =>
    formatPlansWithGeometries(rows as Record<string, unknown>[]),
});
