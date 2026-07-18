import { createRegionalFlightPlanListHandler } from "./createRegionalFlightPlanListHandler";

export const getPrepreparedFlightPlans = createRegionalFlightPlanListHandler({
  columnPreset: "search",
  pointPreset: "search",
  where: "fp.status = 'pre-prepared'",
  errorLogLabel: "❌ Error fetching pre-prepared flight plans:",
  errorMessage: "Failed to fetch pre-prepared flight plans",
});
