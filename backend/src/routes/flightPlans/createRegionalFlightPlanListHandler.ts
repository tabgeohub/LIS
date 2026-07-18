import { Request, Response } from "express";
import {
  fetchRegionalFlightPlanList,
  RegionalFlightPlanListOptions,
} from "../../helpers/queries/flight-plans/fetchFlightPlanList";

/** Shared Express handler factory for regio-filtered flight plan list routes. */
export function createRegionalFlightPlanListHandler(
  options: RegionalFlightPlanListOptions
) {
  return async (req: Request, res: Response): Promise<void> => {
    await fetchRegionalFlightPlanList({ req, res, ...options });
  };
}
