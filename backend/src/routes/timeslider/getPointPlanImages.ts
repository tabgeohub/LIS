import { Request, Response } from "express";
import { fetchTimesliderPlanImages } from "../../helpers/queries/timesliderPlanImages";

export async function getPointPlanImages(
  req: Request,
  res: Response
): Promise<void> {
  await fetchTimesliderPlanImages(req, res, {
    filter: "point",
    paramName: "point_id",
    responseIdKey: "point_id",
    invalidParamMessage:
      "Query param 'point_id' is required and must be a positive integer",
    logLabel: "❌ Error fetching timeslider point plan images:",
    failureMessage: "Failed to fetch point images for selected plans",
  });
}
