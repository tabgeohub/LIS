import { buildPointsUnnestJoin } from "../flight-plans/flightPlanJoin";
import { buildPointJsonObject } from "./pointJson";
import { buildPointSearchQuerySql } from "../../repositories/flightPlanJoinSql";

export type PointSearchFilter = "omschrijving" | "planId";

export function buildPointSearchQuery(filter: PointSearchFilter): string {
  const pointJson = buildPointJsonObject("search");
  const joins = buildPointsUnnestJoin("fp", false);

  const whereClause =
    filter === "omschrijving"
      ? "LOWER(pt.omschrijving) LIKE LOWER($1)"
      : "fp.id = $1";

  return buildPointSearchQuerySql({ pointJson, joins, whereClause });
}
