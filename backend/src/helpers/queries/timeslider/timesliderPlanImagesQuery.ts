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

export type FetchTimesliderPlanImagesOptions = {
  filter: TimesliderImageFilter;
  paramName: "point_id" | "geometry_id";
  responseIdKey: "point_id" | "geometry_id";
  invalidParamMessage: string;
  logLabel: string;
  failureMessage: string;
};

function timesliderEntityJoinSql(filter: TimesliderImageFilter): string {
  if (filter !== "geometry") return "";
  return `INNER JOIN lis.points p
        ON p.id = fp.point_id
        AND p.geometry_id = $1`;
}

function timesliderEntityWhereSql(filter: TimesliderImageFilter): string {
  return filter === "geometry" ? "" : "fp.point_id = $1\n        AND ";
}

export function buildTimesliderPlanImagesQuery(
  options: BuildTimesliderPlanImagesQueryOptions
): string {
  const entityJoin = timesliderEntityJoinSql(options.filter);
  const whereEntity = timesliderEntityWhereSql(options.filter);
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
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}
