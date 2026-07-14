import { Pool } from "pg";
import { resolveRegioFilter } from "../src/helpers/queries/shared/resolveRegioFilter";
import { FLIGHT_PLAN_REGIO_CASES } from "./flightPlanRegioCaseDefinitions";
import { assertPlanRegiosWithDb } from "./regioPlanAssertions";
import { MockReqFactory, RegioTestReporter } from "./regioVerificationTypes";

export async function runFlightPlanRegioCases(input: {
  pool: Pool;
  reporter: RegioTestReporter;
  mockReq: MockReqFactory;
  expectedRegio: string;
}) {
  for (const testCase of FLIGHT_PLAN_REGIO_CASES) {
    const regional = resolveRegioFilter(input.mockReq({ roles: ["RWS NN"] }));
    const admin = resolveRegioFilter(input.mockReq({ roles: ["admin"] }));
    const regionalQuery = testCase.build(regional);
    const adminQuery = testCase.build(admin);
    const rowsRegio = await input.pool.query(regionalQuery.query, regionalQuery.params);
    const rowsAdmin = await input.pool.query(adminQuery.query, adminQuery.params);
    if (testCase.name.includes("getTimeRange")) {
      input.reporter.pass(testCase.name, `RWS NN range: ${rowsRegio.rows[0]?.from ?? "null"}-${rowsRegio.rows[0]?.to ?? "null"} | admin: ${rowsAdmin.rows[0]?.from ?? "null"}-${rowsAdmin.rows[0]?.to ?? "null"}`);
      continue;
    }
    await assertPlanRegiosWithDb(input.reporter, {
      pool: input.pool,
      endpoint: `${testCase.name} [RWS NN]`,
      rows: rowsRegio.rows,
      expectedRegio: input.expectedRegio,
      table: testCase.name.includes("templateFlight") ? "lis.template_plans" : "lis.flightplans",
    });
    const adminCount = rowsAdmin.rows.length;
    const regionalCount = rowsRegio.rows.length;
    const name = `${testCase.name} [admin >= regional]`;
    if (adminCount >= regionalCount) input.reporter.pass(name, `admin=${adminCount}, RWS NN=${regionalCount}`);
    else input.reporter.fail(name, `admin=${adminCount} < RWS NN=${regionalCount} (unexpected)`);
  }
}
