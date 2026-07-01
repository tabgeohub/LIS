import { FINISHED_PLANS_POINTS_CTE } from "../flight-plans/flightPlanJoin";
import {
  buildAttachmentsAggregationExpr,
  buildAttachmentsLateralJoin,
  buildFinishedPlanDetailsPointJsonbObject,
  buildFinishedPlanPointJsonbObject,
} from "../points/pointJson";
import {
  appendRegioFilter,
  buildRegioWhereClause,
  RegioFilterOptions,
} from "../shared/regioFilter";

export type BuildFinishedPlansQueryOptions = {
  params?: unknown[];
  regio_id?: unknown;
  regioFilter?: RegioFilterOptions;
  dateRange?: { from: string; to: string };
  orderBy?: string;
};

const DEFAULT_FINISHED_REGIO_FILTER: RegioFilterOptions = {
  caseInsensitiveAdmin: true,
  when: "truthy",
};

export function buildFinishedPlansWithPointsQuery(
  options: BuildFinishedPlansQueryOptions = {}
): { query: string; params: unknown[] } {
  const {
    params = [],
    regio_id,
    regioFilter = DEFAULT_FINISHED_REGIO_FILTER,
    dateRange,
    orderBy,
  } = options;

  const pointJson = buildFinishedPlanPointJsonbObject();

  let whereClause = "WHERE fp.status = 'finished'";

  if (dateRange) {
    whereClause += `
        AND fp.datum IS NOT NULL
        AND fp.datum::date >= $1::date
        AND fp.datum::date <= $2::date`;
    params.push(dateRange.from, dateRange.to);
  }

  let query = `${FINISHED_PLANS_POINTS_CTE}
      SELECT
        fp.*,
        jsonb_agg(
          jsonb_strip_nulls(
            ${pointJson}
          )
          ORDER BY pt.created_at, pt.id
        ) AS points_data
      FROM lis.flightplans fp
      JOIN points_per_plan ppp ON ppp.plan_id = fp.id
      JOIN lis.points pt ON pt.id = ppp.point_id
      LEFT JOIN lis.geometries g ON g.id = pt.geometry_id
      ${whereClause}`;

  if (regio_id !== undefined) {
    query = appendRegioFilter({
      sql: query,
      params,
      regio_id,
      column: "fp.regio_id",
      options: regioFilter,
    });
  }

  query += `
      GROUP BY fp.id`;

  if (orderBy) {
    query += `
      ORDER BY ${orderBy}`;
  }

  return { query, params };
}

export function buildFinishedPlansTimeRangeQuery(
  regio_id: unknown,
  regioFilter: RegioFilterOptions = {
    caseInsensitiveAdmin: true,
    when: "provided",
  }
): { query: string; params: unknown[] } {
  const params: unknown[] = [];

  let query = `${FINISHED_PLANS_POINTS_CTE}
      SELECT
        MIN(fp.datum::date) AS "from",
        MAX(fp.datum::date) AS "to"
      FROM lis.flightplans fp
      JOIN points_per_plan ppp ON ppp.plan_id = fp.id
      JOIN lis.points pt ON pt.id = ppp.point_id
      WHERE fp.status = 'finished'
        AND fp.datum IS NOT NULL`;

  query = appendRegioFilter({
    sql: query,
    params,
    regio_id,
    column: "fp.regio_id",
    options: regioFilter,
  });

  return { query, params };
}

export type FinishedPlanRegioWhereInput = {
  regio_id: unknown;
  params: unknown[];
  column: string;
  regioFilter?: RegioFilterOptions;
};

export function buildFinishedPlanRegioWhereClause(
  input: FinishedPlanRegioWhereInput
): string {
  const {
    regio_id,
    params,
    column,
    regioFilter = {
      caseInsensitiveAdmin: true,
      when: "provided",
      castAsText: true,
    },
  } = input;

  return buildRegioWhereClause({
    regio_id,
    params,
    column,
    options: regioFilter,
    prefix: "AND",
  });
}

export function buildFinishedFlightPlansListQuery(
  regio_id?: unknown
): { query: string; params: unknown[] } {
  const params: unknown[] = [];
  const pointJson = buildFinishedPlanDetailsPointJsonbObject({
    pointOrderExpr: "ffp.point_order",
    pointCommentExpr: "ffp.pointComment",
    attachmentsExpr: "att_list.attachments",
  });

  let query = `
      SELECT
        fp.*,
        jsonb_agg(
          jsonb_strip_nulls(
            ${pointJson}
          )
        ) AS points_data,
        fpp.path AS path
      FROM lis.flightplans fp
      JOIN lis.finished_plans ffp ON ffp.plan_id = fp.id
      JOIN lis.points pt ON pt.id = ffp.point_id
      ${buildAttachmentsLateralJoin("ffp.attachments_id", "att_list")}
      LEFT JOIN lis.finished_plans_path fpp ON fpp.planid = fp.id
      WHERE fp.status = 'finished'`;

  query = appendRegioFilter({
    sql: query,
    params,
    regio_id,
    column: "fp.regio_id",
    options: DEFAULT_FINISHED_REGIO_FILTER,
  });

  query += `
      GROUP BY fp.id, fpp.path;`;

  return { query, params };
}

export function buildSingleFinishedFlightPlanQuery(): string {
  const pointJson = buildFinishedPlanDetailsPointJsonbObject({
    pointOrderExpr: "ppp.point_order",
    pointCommentExpr: "ppp.point_comment",
    attachmentsExpr: "ap.attachments",
    includeGeometry: true,
  });

  return `
      WITH ffp_rows AS (
        SELECT *
        FROM lis.finished_plans
        WHERE plan_id = $1
      ),
      points_per_plan AS (
        SELECT
          plan_id,
          point_id,
          MAX(point_order) AS point_order,
          MAX(pointcomment) AS point_comment
        FROM ffp_rows
        GROUP BY plan_id, point_id
      ),
      fp_point_attachments AS (
        SELECT DISTINCT ON (point_id)
          point_id,
          attachments_id
        FROM ffp_rows
        ORDER BY point_id, point_order DESC NULLS LAST
      ),
      attachments_per_point AS (
        SELECT
          fpa.point_id,
          ${buildAttachmentsAggregationExpr("fpa.attachments_id")} AS attachments
        FROM fp_point_attachments fpa
      )
      SELECT
        fp.*,
        fpp.path AS path,
        fpp.flighttime AS flighttime,
        jsonb_agg(
          jsonb_strip_nulls(
            ${pointJson}
          )
          ORDER BY ppp.point_order NULLS LAST, pt.id
        ) AS points_data
      FROM lis.flightplans fp
      JOIN points_per_plan ppp
        ON ppp.plan_id = fp.id
      JOIN lis.points pt
        ON pt.id = ppp.point_id
      LEFT JOIN attachments_per_point ap
        ON ap.point_id = ppp.point_id
      LEFT JOIN lis.geometries g
        ON g.id = pt.geometry_id
      LEFT JOIN lis.finished_plans_path fpp
        ON fpp.planid = fp.id
      WHERE fp.status = 'finished'
        AND fp.id = $1
      GROUP BY fp.id, fpp.path, fpp.flighttime;
      `;
}
