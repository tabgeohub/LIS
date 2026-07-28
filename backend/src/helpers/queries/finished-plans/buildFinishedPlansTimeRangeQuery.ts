import {
  appendRegioFilter,
  RegioFilterOptions,
} from "../shared/regioFilter";
import { buildFinishedPlansTimeRangeSelectSql } from "../../repositories/finishedPlansQuerySql";

export function buildFinishedPlansTimeRangeQuery(
  regio_id: unknown,
  regioFilter: RegioFilterOptions = {
    caseInsensitiveAdmin: true,
    when: "provided",
  }
): { query: string; params: unknown[] } {
  const params: unknown[] = [];

  let query = buildFinishedPlansTimeRangeSelectSql();

  query = appendRegioFilter({
    sql: query,
    params,
    regio_id,
    column: "fp.regio_id",
    options: regioFilter,
  });

  return { query, params };
}
