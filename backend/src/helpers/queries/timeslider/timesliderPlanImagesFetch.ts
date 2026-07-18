import { pool } from "../../../db";
import { buildFinishedPlanRegioWhereClause } from "../finished-plans/buildFinishedPlanQuery";
import {
  buildTimesliderPlanImagesQuery,
  TIMESLIDER_REGIO_FILTER,
  type FetchTimesliderPlanImagesOptions,
} from "./timesliderPlanImagesQuery";
import type { ParsedTimesliderPlanImagesRequest } from "./timesliderPlanImagesParse";

export async function queryTimesliderPlanImages(input: {
  parsed: ParsedTimesliderPlanImagesRequest;
  filter: FetchTimesliderPlanImagesOptions["filter"];
}) {
  const params: unknown[] = [input.parsed.entityId, input.parsed.planIds];
  const regioClause = buildFinishedPlanRegioWhereClause({
    regio_id: input.parsed.regioId,
    params,
    column: "fl.regio_id",
    regioFilter: TIMESLIDER_REGIO_FILTER,
  });
  const sql = buildTimesliderPlanImagesQuery({
    filter: input.filter,
    entityId: input.parsed.entityId,
    planIds: input.parsed.planIds,
    regioClause,
  });
  return { result: await pool.query(sql, params), params };
}
