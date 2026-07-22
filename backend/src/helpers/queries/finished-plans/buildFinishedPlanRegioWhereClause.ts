import {
  buildRegioWhereClause,
  RegioFilterOptions,
} from "../shared/regioFilter";

export type FinishedPlanRegioWhereInput = {
  regio_id: unknown;
  params: unknown[];
  column: string;
  regioFilter?: RegioFilterOptions;
};

export function buildFinishedPlanRegioWhereClause(
  input: FinishedPlanRegioWhereInput
): string {
  const {
    regio_id,
    params,
    column,
    regioFilter = {
      caseInsensitiveAdmin: true,
      when: "provided",
      castAsText: true,
    },
  } = input;

  return buildRegioWhereClause({
    regio_id,
    params,
    column,
    options: regioFilter,
    prefix: "AND",
  });
}
