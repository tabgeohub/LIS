import { appendRegioFilter } from "../shared/regioFilter";
import { DEFAULT_FINISHED_REGIO_FILTER } from "./buildFinishedPlansWithPointsHelpers";
import {
  buildFinishedFlightPlansListPointJson,
  buildFinishedFlightPlansListSelect,
} from "./buildFinishedFlightPlansListSelect";

export function buildFinishedFlightPlansListQuery(
  regio_id?: unknown
): { query: string; params: unknown[] } {
  const params: unknown[] = [];
  let query = buildFinishedFlightPlansListSelect(
    buildFinishedFlightPlansListPointJson()
  );
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
