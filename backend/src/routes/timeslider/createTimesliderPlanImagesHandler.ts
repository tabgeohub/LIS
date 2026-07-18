import { Request, Response } from "express";
import {
  fetchTimesliderPlanImages,
  type FetchTimesliderPlanImagesOptions,
} from "../../helpers/queries/timeslider/timesliderPlanImages";

type TimesliderPlanImagesHandlerOptions = Omit<
  FetchTimesliderPlanImagesOptions,
  "req" | "res"
>;

export function createTimesliderPlanImagesHandler(
  options: TimesliderPlanImagesHandlerOptions
) {
  return async (req: Request, res: Response): Promise<void> => {
    await fetchTimesliderPlanImages({ req, res, ...options });
  };
}
