import { buildFinishedPlanPointJsonbObject } from "../points/pointJson";
import {
  appendRegioFilter,
  type RegioFilterOptions,
} from "../shared/regioFilter";
import { buildFinishedPlansSelectBody as buildFinishedPlansSelectBodySql } from "../../repositories/finishedPlansQuerySql";

export const DEFAULT_FINISHED_REGIO_FILTER: RegioFilterOptions = {
  caseInsensitiveAdmin: true,
  when: "truthy",
};

export type BuildFinishedPlansQueryOptions = {
  params?: unknown[];
  regio_id?: unknown;
  regioFilter?: RegioFilterOptions;
  dateRange?: { from: string; to: string };
  orderBy?: string;
};

export function appendFinishedDateRange(input: {
  whereClause: string;
  params: unknown[];
  dateRange?: { from: string; to: string };
}): string {
  if (!input.dateRange) {
    return input.whereClause;
  }
  input.params.push(input.dateRange.from, input.dateRange.to);
  return `${input.whereClause}
        AND fp.datum IS NOT NULL
        AND fp.datum::date >= $1::date
        AND fp.datum::date <= $2::date`;
}

export function buildFinishedPlansSelectBody(whereClause: string): string {
  return buildFinishedPlansSelectBodySql(
    whereClause,
    buildFinishedPlanPointJsonbObject()
  );
}

export function appendFinishedRegioAndOrder(input: {
  query: string;
  params: unknown[];
  regio_id: unknown;
  regioFilter: RegioFilterOptions;
  orderBy?: string;
}): string {
  let query = input.query;
  if (input.regio_id !== undefined) {
    query = appendRegioFilter({
      sql: query,
      params: input.params,
      regio_id: input.regio_id,
      column: "fp.regio_id",
      options: input.regioFilter,
    });
  }
  query += `
      GROUP BY fp.id`;
  if (input.orderBy) {
    query += `
      ORDER BY ${input.orderBy}`;
  }
  return query;
}
