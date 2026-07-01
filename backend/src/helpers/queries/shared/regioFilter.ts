export type RegioFilterWhen = "truthy" | "provided";

export type RegioFilterOptions = {
  caseInsensitiveAdmin?: boolean;
  when?: RegioFilterWhen;
  castAsText?: boolean;
  compareLowercase?: boolean;
};

export type AppendRegioFilterInput = {
  sql: string;
  params: unknown[];
  regio_id: unknown;
  column?: string;
  options?: RegioFilterOptions;
};

export type BuildRegioWhereClauseInput = {
  regio_id: unknown;
  params: unknown[];
  column: string;
  options?: RegioFilterOptions;
  prefix?: "AND" | "WHERE";
};

function isAdminRegio(
  regio_id: unknown,
  caseInsensitiveAdmin: boolean
): boolean {
  if (regio_id == null || regio_id === "") {
    return false;
  }

  if (caseInsensitiveAdmin) {
    return regio_id.toString().toLowerCase() === "admin";
  }

  return regio_id === "admin";
}

function hasRegioParam(regio_id: unknown, when: RegioFilterWhen): boolean {
  return when === "provided" ? regio_id != null : !!regio_id;
}

export function shouldFilterByRegio(
  regio_id: unknown,
  options: RegioFilterOptions = {}
): boolean {
  const { caseInsensitiveAdmin = true, when = "truthy" } = options;

  return (
    hasRegioParam(regio_id, when) &&
    !isAdminRegio(regio_id, caseInsensitiveAdmin)
  );
}

function buildRegioMatchClause(
  column: string,
  paramIndex: number,
  options: RegioFilterOptions
): string {
  const { castAsText = false, compareLowercase = true } = options;

  if (compareLowercase || castAsText) {
    return `LOWER(${column}::text) = LOWER($${paramIndex}::text)`;
  }

  return `${column} = $${paramIndex}`;
}

export function appendRegioFilter(input: AppendRegioFilterInput): string {
  const {
    sql,
    params,
    regio_id,
    column = "fp.regio_id",
    options = {},
  } = input;

  if (!shouldFilterByRegio(regio_id, options)) {
    return sql;
  }

  const { castAsText = false } = options;
  const value = castAsText ? String(regio_id) : regio_id;

  params.push(value);

  return `${sql} AND ${buildRegioMatchClause(column, params.length, options)}`;
}

export function buildRegioWhereClause(input: BuildRegioWhereClauseInput): string {
  const {
    regio_id,
    params,
    column,
    options = {},
    prefix = "AND",
  } = input;

  if (!shouldFilterByRegio(regio_id, options)) {
    return "";
  }

  const { castAsText = false } = options;
  const value = castAsText ? String(regio_id) : regio_id;

  params.push(value);

  return `${prefix} ${buildRegioMatchClause(column, params.length, options)}`;
}
