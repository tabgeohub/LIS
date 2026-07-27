import {
  appendRegioFilter,
  assertSafeSqlColumn,
  RegioFilterOptions,
  shouldFilterByRegio,
} from "../shared/regioFilter";

type FlightPlanWhereBase = {
  query: string;
  params: unknown[];
  regio_id?: unknown;
  regioColumn?: string;
  regioFilter: RegioFilterOptions;
  planAlias: string;
};

function resolveRegioColumn(input: FlightPlanWhereBase): string {
  return input.regioColumn ?? `${input.planAlias}.regio_id`;
}

function appendWhereWithOptionalRegio(
  input: FlightPlanWhereBase & { where: string }
): string {
  let query = `${input.query}
      WHERE ${input.where}`;
  if (input.regio_id === undefined) return query;
  return appendRegioFilter({
    sql: query,
    params: input.params,
    regio_id: input.regio_id,
    column: resolveRegioColumn(input),
    options: input.regioFilter,
  });
}

function appendRegioOnlyWhere(input: FlightPlanWhereBase): string {
  if (!shouldFilterByRegio(input.regio_id, input.regioFilter)) {
    return input.query;
  }
  input.params.push(input.regio_id);
  const regioColumn = assertSafeSqlColumn(resolveRegioColumn(input));
  return `${input.query}
      WHERE ${regioColumn} = $${input.params.length}`;
}

export function appendFlightPlanWhereClause(
  input: FlightPlanWhereBase & { where?: string }
): string {
  if (input.where) {
    return appendWhereWithOptionalRegio({ ...input, where: input.where });
  }

  if (input.regio_id === undefined) return input.query;

  return appendRegioOnlyWhere(input);
}
