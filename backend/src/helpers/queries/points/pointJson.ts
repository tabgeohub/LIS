const POINT_JSON_FIELDS = {
  id: "'id', pt.id",
  omschrijving: "'omschrijving', pt.omschrijving",
  xcoordinaat_rd: "'xcoordinaat_rd', pt.xcoordinaat_rd",
  ycoordinaat_rd: "'ycoordinaat_rd', pt.ycoordinaat_rd",
  latitude: "'latitude', pt.latitude",
  longitude: "'longitude', pt.longitude",
  regio_id: "'regio_id', pt.regio_id",
  herhalen: "'herhalen', pt.herhalen",
  vertrouwelijk: "'vertrouwelijk', pt.vertrouwelijk",
  user_id: "'user_id', pt.user_id",
  specifiek_letten_op: "'specifiek_letten_op', pt.specifiek_letten_op",
  activiteit_id: "'activiteit_id', pt.activiteit_id",
  organisatie_id: "'organisatie_id', pt.organisatie_id",
  created_at: "'created_at', pt.created_at",
  geometry_id: "'geometry_id', pt.geometry_id",
  geometry_type: "'geometry_type', g.type",
  geometry_omschrijving: "'geometry_omschrijving', g.omschrijving",
  datum: "'datum', pt.created_at",
} as const;

type PointJsonFieldKey = keyof typeof POINT_JSON_FIELDS;

const POINT_CORE_FIELDS = [
  "id",
  "omschrijving",
  "xcoordinaat_rd",
  "ycoordinaat_rd",
  "latitude",
  "longitude",
] as const satisfies readonly PointJsonFieldKey[];

const POINT_REGIO_FIELDS = ["regio_id"] as const satisfies readonly PointJsonFieldKey[];
const POINT_FLAG_FIELDS = [
  "herhalen",
  "vertrouwelijk",
  "user_id",
] as const satisfies readonly PointJsonFieldKey[];
const POINT_ORG_ACTIVITY_FIELDS = [
  "organisatie_id",
  "activiteit_id",
  "specifiek_letten_op",
] as const satisfies readonly PointJsonFieldKey[];
const POINT_GEOMETRY_FIELDS = [
  "geometry_id",
  "geometry_type",
  "geometry_omschrijving",
] as const satisfies readonly PointJsonFieldKey[];
const POINT_META_FIELDS = ["created_at"] as const satisfies readonly PointJsonFieldKey[];

function mergePointFieldKeys(
  ...groups: readonly (readonly PointJsonFieldKey[])[]
): PointJsonFieldKey[] {
  return groups.flatMap((group) => [...group]);
}

function pointJsonPairs(keys: readonly PointJsonFieldKey[]): string[] {
  return keys.map((key) => POINT_JSON_FIELDS[key]);
}

export type PointJsonPreset =
  | "search"
  | "minimal"
  | "full"
  | "byId"
  | "template";

const POINT_JSON_PRESETS: Record<PointJsonPreset, PointJsonFieldKey[]> = {
  search: mergePointFieldKeys(
    POINT_CORE_FIELDS,
    POINT_REGIO_FIELDS,
    POINT_FLAG_FIELDS,
    ["specifiek_letten_op"]
  ),
  minimal: mergePointFieldKeys(POINT_CORE_FIELDS, POINT_REGIO_FIELDS),
  full: mergePointFieldKeys(
    POINT_CORE_FIELDS,
    POINT_REGIO_FIELDS,
    POINT_FLAG_FIELDS,
    ["organisatie_id", "specifiek_letten_op", "activiteit_id"],
    POINT_META_FIELDS,
    POINT_GEOMETRY_FIELDS
  ),
  byId: mergePointFieldKeys(
    POINT_CORE_FIELDS,
    POINT_FLAG_FIELDS,
    ["activiteit_id", "organisatie_id", "specifiek_letten_op"],
    POINT_GEOMETRY_FIELDS
  ),
  template: mergePointFieldKeys(
    POINT_CORE_FIELDS,
    POINT_REGIO_FIELDS,
    POINT_GEOMETRY_FIELDS
  ),
};

export function buildPointJsonObject(preset: PointJsonPreset): string {
  const fields = pointJsonPairs(POINT_JSON_PRESETS[preset]);

  return `JSON_BUILD_OBJECT(
            ${fields.join(",\n            ")}
          )`;
}

const FINISHED_PLAN_LIST_POINT_KEYS = mergePointFieldKeys(
  ["id", "omschrijving"],
  POINT_REGIO_FIELDS,
  POINT_CORE_FIELDS.filter((key) => key !== "id" && key !== "omschrijving"),
  ["herhalen", "user_id", "organisatie_id"],
  ["datum"],
  POINT_GEOMETRY_FIELDS
);

const FINISHED_PLAN_DETAIL_POINT_KEYS = mergePointFieldKeys(
  ["id", "omschrijving"],
  POINT_REGIO_FIELDS,
  POINT_CORE_FIELDS.filter((key) => key !== "id" && key !== "omschrijving"),
  POINT_FLAG_FIELDS,
  POINT_ORG_ACTIVITY_FIELDS,
  ["datum"]
);

export function buildFinishedPlanPointJsonbObject(): string {
  const fields = pointJsonPairs(FINISHED_PLAN_LIST_POINT_KEYS);

  return `jsonb_build_object(
              ${fields.join(",\n              ")}
            )`;
}

const FINISHED_PLAN_ATTACHMENT_JSONB_FIELDS = [
  "'id', a.id",
  "'url', a.url",
  "'point_id', a.point_id",
  "'attachmentid', a.attachmentid",
  "'taken_at', a.taken_at",
  "'location', a.location",
] as const;

export function buildAttachmentsAggregationExpr(
  attachmentsIdExpr: string
): string {
  return `COALESCE(
            (
              SELECT jsonb_agg(obj ORDER BY ord)
              FROM (
                SELECT
                  u.ord,
                  jsonb_build_object(
                    ${FINISHED_PLAN_ATTACHMENT_JSONB_FIELDS.join(",\n                    ")}
                  ) AS obj
                FROM unnest(COALESCE(${attachmentsIdExpr}, ARRAY[]::integer[]))
                  WITH ORDINALITY AS u(att_id, ord)
                JOIN lis.attachments a ON a.id = u.att_id
              ) sub
            ),
            '[]'::jsonb
          )`;
}

export function buildAttachmentsLateralJoin(
  attachmentsIdExpr: string,
  alias: string
): string {
  return `LEFT JOIN LATERAL (
        SELECT ${buildAttachmentsAggregationExpr(attachmentsIdExpr)} AS attachments
      ) AS ${alias} ON true`;
}

export type FinishedPlanDetailsPointJsonOptions = {
  pointOrderExpr: string;
  pointCommentExpr: string;
  attachmentsExpr: string;
  includeGeometry?: boolean;
};

export function buildFinishedPlanDetailsPointJsonbObject(
  options: FinishedPlanDetailsPointJsonOptions
): string {
  const fields = [
    ...pointJsonPairs(FINISHED_PLAN_DETAIL_POINT_KEYS),
    `'point_order', ${options.pointOrderExpr}`,
    `'point_comment', ${options.pointCommentExpr}`,
    `'attachments', ${options.attachmentsExpr}`,
  ];

  if (options.includeGeometry) {
    fields.push(...pointJsonPairs(POINT_GEOMETRY_FIELDS));
  }

  return `jsonb_build_object(
              ${fields.join(",\n              ")}
            )`;
}
