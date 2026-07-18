import { createRegionalFlightPlanListHandler } from "./createRegionalFlightPlanListHandler";
import { PARTIAL_FLIGHT_PLAN_LIST_ERROR_OPTIONS } from "./partialFlightPlanListErrorOptions";

export const getUnPreparedPlans = createRegionalFlightPlanListHandler({
  columnPreset: "minimal",
  pointPreset: "minimal",
  where: "fp.status = 'pre-prepared'",
  ...PARTIAL_FLIGHT_PLAN_LIST_ERROR_OPTIONS,
});
