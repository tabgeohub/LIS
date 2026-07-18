import { createTimesliderPlanImagesHandler } from "./createTimesliderPlanImagesHandler";

export const getPointPlanImages = createTimesliderPlanImagesHandler({
  filter: "point",
  paramName: "point_id",
  responseIdKey: "point_id",
  invalidParamMessage:
    "Query param 'point_id' is required and must be a positive integer",
  logLabel: "❌ Error fetching timeslider point plan images:",
  failureMessage: "Failed to fetch point images for selected plans",
});
