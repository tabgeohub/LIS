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
} as const;

export type PointJsonPreset =
  | "search"
  | "minimal"
  | "full"
  | "byId"
  | "template";

const POINT_JSON_PRESETS: Record<PointJsonPreset, (keyof typeof POINT_JSON_FIELDS)[]> =
  {
    search: [
      "id",
      "omschrijving",
      "xcoordinaat_rd",
      "ycoordinaat_rd",
      "latitude",
      "longitude",
      "regio_id",
      "herhalen",
      "vertrouwelijk",
      "user_id",
      "specifiek_letten_op",
    ],
    minimal: [
      "id",
      "omschrijving",
      "xcoordinaat_rd",
      "ycoordinaat_rd",
      "latitude",
      "longitude",
      "regio_id",
    ],
    full: [
      "id",
      "omschrijving",
      "xcoordinaat_rd",
      "ycoordinaat_rd",
      "latitude",
      "longitude",
      "regio_id",
      "herhalen",
      "vertrouwelijk",
      "user_id",
      "organisatie_id",
      "specifiek_letten_op",
      "activiteit_id",
      "created_at",
      "geometry_id",
      "geometry_type",
      "geometry_omschrijving",
    ],
    byId: [
      "id",
      "omschrijving",
      "xcoordinaat_rd",
      "ycoordinaat_rd",
      "latitude",
      "longitude",
      "herhalen",
      "vertrouwelijk",
      "activiteit_id",
      "organisatie_id",
      "specifiek_letten_op",
      "geometry_id",
      "geometry_type",
      "geometry_omschrijving",
    ],
    template: [
      "id",
      "omschrijving",
      "xcoordinaat_rd",
      "ycoordinaat_rd",
      "latitude",
      "longitude",
      "regio_id",
      "geometry_id",
      "geometry_type",
      "geometry_omschrijving",
    ],
  };

export function buildPointJsonObject(preset: PointJsonPreset): string {
  const fields = POINT_JSON_PRESETS[preset].map(
    (key) => POINT_JSON_FIELDS[key]
  );

  return `JSON_BUILD_OBJECT(
            ${fields.join(",\n            ")}
          )`;
}

const FINISHED_PLAN_POINT_JSONB_FIELDS = [
  "'id', pt.id",
  "'omschrijving', pt.omschrijving",
  "'regio_id', pt.regio_id",
  "'xcoordinaat_rd', pt.xcoordinaat_rd",
  "'ycoordinaat_rd', pt.ycoordinaat_rd",
  "'latitude', pt.latitude",
  "'longitude', pt.longitude",
  "'herhalen', pt.herhalen",
  "'user_id', pt.user_id",
  "'datum', pt.created_at",
  "'organisatie_id', pt.organisatie_id",
  "'geometry_id', pt.geometry_id",
  "'geometry_type', g.type",
  "'geometry_omschrijving', g.omschrijving",
] as const;

export function buildFinishedPlanPointJsonbObject(): string {
  return `jsonb_build_object(
              ${FINISHED_PLAN_POINT_JSONB_FIELDS.join(",\n              ")}
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

const FINISHED_PLAN_DETAIL_POINT_BASE_FIELDS = [
  "'id', pt.id",
  "'omschrijving', pt.omschrijving",
  "'regio_id', pt.regio_id",
  "'xcoordinaat_rd', pt.xcoordinaat_rd",
  "'ycoordinaat_rd', pt.ycoordinaat_rd",
  "'latitude', pt.latitude",
  "'longitude', pt.longitude",
  "'vertrouwelijk', pt.vertrouwelijk",
  "'herhalen', pt.herhalen",
  "'user_id', pt.user_id",
  "'activiteit_id', pt.activiteit_id",
  "'organisatie_id', pt.organisatie_id",
  "'specifiek_letten_op', pt.specifiek_letten_op",
  "'datum', pt.created_at",
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
    ...FINISHED_PLAN_DETAIL_POINT_BASE_FIELDS,
    `'point_order', ${options.pointOrderExpr}`,
    `'point_comment', ${options.pointCommentExpr}`,
    `'attachments', ${options.attachmentsExpr}`,
  ];

  if (options.includeGeometry) {
    fields.push(
      "'geometry_id', pt.geometry_id",
      "'geometry_type', g.type",
      "'geometry_omschrijving', g.omschrijving"
    );
  }

  return `jsonb_build_object(
              ${fields.join(",\n              ")}
            )`;
}
