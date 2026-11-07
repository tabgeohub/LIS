import { buildPointsUnnestJoin } from "../flight-plans/flightPlanJoin";
import { buildPointJsonObject } from "./pointJson";
import { buildPointSearchQuerySql } from "../../repositories/flightPlanJoinSql";

export type PointSearchFilter = "omschrijving" | "planId";

export function buildPointSearchQuery(filter: PointSearchFilter): string {
  const pointJson = buildPointJsonObject("search");
  const joins = buildPointsUnnestJoin("fp", false);

  const whereClause =
    filter === "omschrijving"
      ? "LOWER(pt.omschrijving) LIKE LOWER($1) AND ($2::boolean OR (fp.regio_id = $3 AND pt.regio_id = $3))"
      : "fp.id = $1";

  return buildPointSearchQuerySql({ pointJson, joins, whereClause });
}
