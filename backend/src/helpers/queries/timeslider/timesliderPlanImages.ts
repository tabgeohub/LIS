import { Request, Response } from "express";
import {
  buildTimesliderPlanImagesQuery,
  parsePositiveIntQueryParam,
  TIMESLIDER_REGIO_FILTER,
  type FetchTimesliderPlanImagesOptions,
} from "./timesliderPlanImagesQuery";
import { parseTimesliderPlanImagesRequest } from "./timesliderPlanImagesParse";
import { queryTimesliderPlanImages } from "./timesliderPlanImagesFetch";
import {
  mapTimesliderPlanImagesResponse,
  sendTimesliderPlanImagesError,
} from "./timesliderPlanImagesMap";

export type { FetchTimesliderPlanImagesOptions };
export {
  buildTimesliderPlanImagesQuery,
  parsePositiveIntQueryParam,
  TIMESLIDER_REGIO_FILTER,
} from "./timesliderPlanImagesQuery";

export type FetchTimesliderPlanImagesInput = {
  req: Request;
  res: Response;
} & FetchTimesliderPlanImagesOptions;

export async function fetchTimesliderPlanImages(
  input: FetchTimesliderPlanImagesInput
): Promise<void> {
  const { req, res, ...options } = input;
  try {
    const parsed = parseTimesliderPlanImagesRequest({ req, res, options });
    if (!parsed) return;
    const { result } = await queryTimesliderPlanImages({
      parsed,
      filter: options.filter,
    });
    mapTimesliderPlanImagesResponse({
      res,
      options,
      parsed,
      rows: result.rows,
    });
  } catch (error: unknown) {
    sendTimesliderPlanImagesError({ res, options, error });
  }
}
