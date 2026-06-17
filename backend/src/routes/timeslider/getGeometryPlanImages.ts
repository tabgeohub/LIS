import { Request, Response } from "express";
import { fetchTimesliderPlanImages } from "../../helpers/queries/timesliderPlanImages";

export async function getGeometryPlanImages(
  req: Request,
  res: Response
): Promise<void> {
  await fetchTimesliderPlanImages(req, res, {
    filter: "geometry",
    paramName: "geometry_id",
    responseIdKey: "geometry_id",
    invalidParamMessage:
      "Query param 'geometry_id' is required and must be a positive integer",
    logLabel: "❌ Error fetching timeslider geometry plan images:",
    failureMessage: "Failed to fetch geometry images for selected plans",
  });
}
