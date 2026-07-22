import {
  appendRegioFilter,
  assertSafeSqlColumn,
  RegioFilterOptions,
  shouldFilterByRegio,
} from "../shared/regioFilter";

function appendWhereWithOptionalRegio(input: {
  query: string;
  params: unknown[];
  where: string;
  regio_id?: unknown;
  regioColumn?: string;
  regioFilter: RegioFilterOptions;
  planAlias: string;
}): string {
  let query = `${input.query}
      WHERE ${input.where}`;
  if (input.regio_id === undefined) return query;
  return appendRegioFilter({
    sql: query,
    params: input.params,
    regio_id: input.regio_id,
    column: input.regioColumn ?? `${input.planAlias}.regio_id`,
    options: input.regioFilter,
  });
}

function appendRegioOnlyWhere(input: {
  query: string;
  params: unknown[];
  regio_id: unknown;
  regioColumn?: string;
  regioFilter: RegioFilterOptions;
  planAlias: string;
}): string {
  if (!shouldFilterByRegio(input.regio_id, input.regioFilter)) {
    return input.query;
  }
  input.params.push(input.regio_id);
  const regioColumn = assertSafeSqlColumn(
    input.regioColumn ?? `${input.planAlias}.regio_id`
  );
  return `${input.query}
      WHERE ${regioColumn} = $${input.params.length}`;
}

export function appendFlightPlanWhereClause(input: {
  query: string;
  params: unknown[];
  where?: string;
  regio_id?: unknown;
  regioColumn?: string;
  regioFilter: RegioFilterOptions;
  planAlias: string;
}): string {
  if (input.where) {
    return appendWhereWithOptionalRegio({
      query: input.query,
      params: input.params,
      where: input.where,
      regio_id: input.regio_id,
      regioColumn: input.regioColumn,
      regioFilter: input.regioFilter,
      planAlias: input.planAlias,
    });
  }

  if (input.regio_id === undefined) return input.query;

  return appendRegioOnlyWhere({
    query: input.query,
    params: input.params,
    regio_id: input.regio_id,
    regioColumn: input.regioColumn,
    regioFilter: input.regioFilter,
    planAlias: input.planAlias,
  });
}
