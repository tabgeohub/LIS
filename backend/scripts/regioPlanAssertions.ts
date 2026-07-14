import { Pool } from "pg";
import { RegioTestReporter } from "./regioVerificationTypes";

const PLAN_TABLE_BY_KEY = {
  "lis.flightplans": "lis.flightplans",
  "lis.template_plans": "lis.template_plans",
} as const;
type PlanRow = { id?: number; regio_id?: string };

function assertPlanRegios(reporter: RegioTestReporter, input: {
  endpoint: string;
  rows: PlanRow[];
  expectedRegio: string;
}) {
  const bad = input.rows.filter((row) =>
    (row.regio_id ?? "").toLowerCase() !== input.expectedRegio.toLowerCase()
  );
  if (bad.length) {
    reporter.fail(input.endpoint, `${bad.length} plan(s) with wrong regio_id: ${bad.slice(0, 3).map((row) => `${row.id}:${row.regio_id}`).join(", ")}`);
    return false;
  }
  reporter.pass(input.endpoint, `${input.rows.length} plan(s), all regio_id=${input.expectedRegio}`);
  return true;
}

export async function assertPlanRegiosWithDb(reporter: RegioTestReporter, input: {
  pool: Pool;
  endpoint: string;
  rows: PlanRow[];
  expectedRegio: string;
  table?: keyof typeof PLAN_TABLE_BY_KEY;
}) {
  if (input.rows.length === 0) {
    reporter.pass(input.endpoint, "0 plan(s)");
    return true;
  }
  const ids = input.rows.map((row) => row.id).filter((id): id is number => id != null);
  if (!ids.length) {
    reporter.fail(input.endpoint, "rows returned without plan ids");
    return false;
  }
  const result = await input.pool.query(
    "SELECT id, regio_id FROM " + PLAN_TABLE_BY_KEY[input.table ?? "lis.flightplans"] + " WHERE id = ANY($1::int[])",
    [ids]
  );
  return assertPlanRegios(reporter, { ...input, rows: result.rows });
}
