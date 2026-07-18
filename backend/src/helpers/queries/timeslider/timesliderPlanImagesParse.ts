import { Request, Response } from "express";
import { parsePlanIds } from "../shared/parsePlanIds";
import { resolveRegioFilter } from "../shared/resolveRegioFilter";
import {
  parsePositiveIntQueryParam,
  type FetchTimesliderPlanImagesOptions,
} from "./timesliderPlanImagesQuery";

export type ParsedTimesliderPlanImagesRequest = {
  entityId: number;
  planIds: number[];
  regioId: ReturnType<typeof resolveRegioFilter>;
};

export function parseTimesliderPlanImagesRequest(input: {
  req: Request;
  res: Response;
  options: FetchTimesliderPlanImagesOptions;
}): ParsedTimesliderPlanImagesRequest | null {
  const entityId = parsePositiveIntQueryParam(
    input.req.query[input.options.paramName],
    input.options.paramName
  );
  if (entityId == null) {
    input.res.status(400).json({ message: input.options.invalidParamMessage });
    return null;
  }
  const planIds = parsePlanIds(input.req.query.plan_ids);
  if (planIds.length === 0) {
    input.res.status(400).json({
      message:
        "Query param 'plan_ids' is required (comma-separated plan ids, e.g. plan_ids=1,2,3)",
    });
    return null;
  }
  return {
    entityId,
    planIds,
    regioId: resolveRegioFilter(input.req),
  };
}
