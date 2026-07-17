import { Request, Response } from "express";
import { pool } from "../../../db";
import { buildFinishedPlanRegioWhereClause } from "../finished-plans/buildFinishedPlanQuery";
import { parsePlanIds } from "../shared/parsePlanIds";
import { resolveRegioFilter } from "../shared/resolveRegioFilter";
import {
  buildTimesliderPlanImagesQuery,
  parsePositiveIntQueryParam,
  TIMESLIDER_REGIO_FILTER,
  type FetchTimesliderPlanImagesOptions,
} from "./timesliderPlanImagesQuery";

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
    const entityId = parsePositiveIntQueryParam(
      req.query[options.paramName],
      options.paramName
    );

    if (entityId == null) {
      res.status(400).json({ message: options.invalidParamMessage });
      return;
    }

    const planIds = parsePlanIds(req.query.plan_ids);
    if (planIds.length === 0) {
      res.status(400).json({
        message:
          "Query param 'plan_ids' is required (comma-separated plan ids, e.g. plan_ids=1,2,3)",
      });
      return;
    }

    const regioId = resolveRegioFilter(req);
    const params: unknown[] = [entityId, planIds];
    const regioClause = buildFinishedPlanRegioWhereClause({
      regio_id: regioId,
      params,
      column: "fl.regio_id",
      regioFilter: TIMESLIDER_REGIO_FILTER,
    });

    const sql = buildTimesliderPlanImagesQuery({
      filter: options.filter,
      entityId,
      planIds,
      regioClause,
    });

    const result = await pool.query(sql, params);

    res.status(200).json({
      [options.responseIdKey]: entityId,
      plan_ids: planIds,
      images: result.rows,
    });
  } catch (error: unknown) {
    console.error(options.logLabel, error);
    res.status(500).json({
      message: options.failureMessage,
      error:
        error instanceof Error
          ? { name: error.name, message: error.message }
          : String(error),
    });
  }
}
