/**
 * Verifies flight-plan, point, and geometry API queries + regio role filtering.
 * Run: npm run verify:regio-apis   (from backend/)
 *
 * Note: Sigrid pack cited verify-regio-apis.js (CWE-89) — that artifact is gone.
 * This TypeScript entrypoint and helpers use parameterized pg queries only.
 */
import "dotenv/config";
import { Pool } from "pg";
import { resolveRegioFilter } from "../src/helpers/queries/shared/resolveRegioFilter";
import {
  runFlightPlanRegioCases,
  runPreparedPlansRegioCheck,
  runSwaggerStyleRegioCheck,
} from "./verifyRegioFlightPlanCases";
import {
  runGeometriesRegioCheck,
  runPointsRegioCheck,
} from "./verifyRegioPointsGeometries";
import {
  REGIO,
  RESOLVE_REGIO_FILTER_CASES,
  fail,
  getVerifyResults,
  mockReq,
  pass,
  reporter,
} from "./verifyRegioApisHelpers";

function testResolveRegioFilter() {
  console.log("\n── resolveRegioFilter (unit) ──");

  for (const c of RESOLVE_REGIO_FILTER_CASES) {
    const got = resolveRegioFilter(
      mockReq({ roles: c.roles, query: c.query ?? {} })
    );
    if (got === c.expected) {
      pass(c.name, `→ "${got ?? "(none)"}"`);
    } else {
      fail(
        c.name,
        `expected "${c.expected ?? "(none)"}", got "${got ?? "(none)"}"`
      );
    }
  }
}

async function testDatabaseQueries() {
  console.log("\n── Database queries (regio filter) ──");

  const pool = new Pool();
  try {
    await runFlightPlanRegioCases({
      pool,
      reporter,
      mockReq,
      expectedRegio: REGIO,
    });
    await runPreparedPlansRegioCheck({
      pool,
      reporter,
      mockReq,
      expectedRegio: REGIO,
    });
    await runPointsRegioCheck({ reporter, expectedRegio: REGIO });
    await runGeometriesRegioCheck({ reporter, expectedRegio: REGIO });
    await runSwaggerStyleRegioCheck({
      pool,
      reporter,
      mockReq,
      expectedRegio: REGIO,
    });
  } finally {
    await pool.end();
  }
}

async function main() {
  console.log("LIS regio API verification");
  console.log(`Database: ${process.env.PGDATABASE} @ ${process.env.PGHOST}`);
  console.log(`Test regio: ${REGIO}`);

  testResolveRegioFilter();
  await testDatabaseQueries();

  const results = getVerifyResults();
  const failed = results.filter((r) => !r.ok);
  console.log("\n══════════════════════════════════════");
  console.log(
    `Total: ${results.length}  Passed: ${results.length - failed.length}  Failed: ${failed.length}`
  );

  if (failed.length) {
    console.log("\nFailed checks:");
    failed.forEach((f) => console.log(`  • ${f.name}: ${f.detail}`));
    process.exit(1);
  }

  console.log("\nAll checks passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
