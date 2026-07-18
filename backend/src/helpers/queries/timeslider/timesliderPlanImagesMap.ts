import { Response } from "express";
import type { FetchTimesliderPlanImagesOptions } from "./timesliderPlanImagesQuery";
import type { ParsedTimesliderPlanImagesRequest } from "./timesliderPlanImagesParse";

export function mapTimesliderPlanImagesResponse(input: {
  res: Response;
  options: FetchTimesliderPlanImagesOptions;
  parsed: ParsedTimesliderPlanImagesRequest;
  rows: unknown[];
}) {
  input.res.status(200).json({
    [input.options.responseIdKey]: input.parsed.entityId,
    plan_ids: input.parsed.planIds,
    images: input.rows,
  });
}

export function sendTimesliderPlanImagesError(input: {
  res: Response;
  options: FetchTimesliderPlanImagesOptions;
  error: unknown;
}) {
  console.error(input.options.logLabel, input.error);
  input.res.status(500).json({
    message: input.options.failureMessage,
    error:
      input.error instanceof Error
        ? { name: input.error.name, message: input.error.message }
        : String(input.error),
  });
}
