import { Pool } from "pg";
import { selectFlightPlansByIds } from "../src/helpers/repositories/flightPlansRepo";
import { selectTemplatePlansByIds } from "../src/helpers/repositories/templatePlansRepo";
import { RegioTestReporter } from "./regioVerificationTypes";

type PlanRow = { id?: number; regio_id?: string };
export type PlanTableKind = "flightplans" | "template_plans";

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

function collectPlanIds(rows: PlanRow[]): number[] {
  return rows.map((row) => row.id).filter((id): id is number => id != null);
}

export async function assertPlanRegiosWithDb(reporter: RegioTestReporter, input: {
  pool: Pool;
  endpoint: string;
  rows: PlanRow[];
  expectedRegio: string;
  table?: PlanTableKind;
}) {
  if (input.rows.length === 0) {
    reporter.pass(input.endpoint, "0 plan(s)");
    return true;
  }
  const ids = collectPlanIds(input.rows);
  if (!ids.length) {
    reporter.fail(input.endpoint, "rows returned without plan ids");
    return false;
  }
  const result =
    input.table === "template_plans"
      ? await selectTemplatePlansByIds(input.pool, ids)
      : await selectFlightPlansByIds(input.pool, ids);
  return assertPlanRegios(reporter, { ...input, rows: result.rows });
}
