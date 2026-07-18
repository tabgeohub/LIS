import { createTimesliderPlanImagesHandler } from "./createTimesliderPlanImagesHandler";

export const getGeometryPlanImages = createTimesliderPlanImagesHandler({
  filter: "geometry",
  paramName: "geometry_id",
  responseIdKey: "geometry_id",
  invalidParamMessage:
    "Query param 'geometry_id' is required and must be a positive integer",
  logLabel: "❌ Error fetching timeslider geometry plan images:",
  failureMessage: "Failed to fetch geometry images for selected plans",
});
