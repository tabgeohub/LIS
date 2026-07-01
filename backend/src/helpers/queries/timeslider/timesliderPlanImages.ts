import { Request, Response } from "express";
import { pool } from "../../../db";
import { buildFinishedPlanRegioWhereClause } from "../finished-plans/buildFinishedPlanQuery";
import { parsePlanIds } from "../shared/parsePlanIds";
import { resolveRegioFilter } from "../shared/resolveRegioFilter";

export const TIMESLIDER_REGIO_FILTER = {
  caseInsensitiveAdmin: true,
  when: "provided" as const,
  castAsText: true,
};

type TimesliderImageFilter = "point" | "geometry";

type BuildTimesliderPlanImagesQueryOptions = {
  filter: TimesliderImageFilter;
  entityId: number;
  planIds: number[];
  regioClause: string;
};

export function buildTimesliderPlanImagesQuery(
  options: BuildTimesliderPlanImagesQueryOptions
): string {
  const entityJoin =
    options.filter === "geometry"
      ? `INNER JOIN lis.points p
        ON p.id = fp.point_id
        AND p.geometry_id = $1`
      : "";

  const whereEntity =
    options.filter === "geometry"
      ? ""
      : "fp.point_id = $1\n        AND ";

  return `
      SELECT DISTINCT ON (a.id)
        a.id,
        a.url,
        a.point_id,
        a.attachmentid AS "attachmentid",
        a.taken_at,
        a.location,
        fp.plan_id
      FROM lis.finished_plans fp
      INNER JOIN lis.flightplans fl
        ON fl.id = fp.plan_id
        AND fl.status = 'finished'
      ${entityJoin}
      INNER JOIN lis.attachments a
        ON a.id = ANY(COALESCE(fp.attachments_id, ARRAY[]::integer[]))
        AND a.point_id = fp.point_id
      WHERE ${whereEntity}fp.plan_id = ANY($2::int[])
        ${options.regioClause}
      ORDER BY a.id ASC, fp.plan_id ASC;
    `;
}

export function parsePositiveIntQueryParam(
  raw: unknown,
  paramName: string
): number | null {
  const value =
    typeof raw === "string"
      ? parseInt(raw, 10)
      : Array.isArray(raw)
        ? parseInt(String(raw[0]), 10)
        : NaN;

  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return value;
}

type FetchTimesliderPlanImagesOptions = {
  filter: TimesliderImageFilter;
  paramName: "point_id" | "geometry_id";
  responseIdKey: "point_id" | "geometry_id";
  invalidParamMessage: string;
  logLabel: string;
  failureMessage: string;
};

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
