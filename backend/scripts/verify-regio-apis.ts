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

const REGIO = "RWS NN";
const ADMIN = "admin";

type Result = { name: string; ok: boolean; detail: string };

const results: Result[] = [];

function pass(name: string, detail: string) {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name} — ${detail}`);
}

function fail(name: string, detail: string) {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name} — ${detail}`);
}

const reporter = { pass, fail };

function makeFakeAccessToken(roles: string[]): string {
  const payload = Buffer.from(
    JSON.stringify({ realm_access: { roles } })
  ).toString("base64url");
  return `e30.${payload}.e30`;
}

function mockReq(input: { roles: string[]; query?: Record<string, string> }) {
  const { roles, query = {} } = input;
  return {
    query,
    session: {
      auth: {
        tokenSet: { access_token: makeFakeAccessToken(roles) },
      },
    },
  } as Parameters<typeof resolveRegioFilter>[0];
}

const RESOLVE_REGIO_FILTER_CASES: Array<{
  name: string;
  roles: string[];
  query?: Record<string, string>;
  expected: string | undefined;
}> = [
  {
    name: "RWS NN session, no query",
    roles: ["RWS NN", "offline_access"],
    expected: REGIO,
  },
  {
    name: "RWS NN session, query admin (no escalation)",
    roles: ["RWS NN"],
    query: { regio_id: "admin" },
    expected: REGIO,
  },
  {
    name: "RWS NN session, query other regio (no escalation)",
    roles: ["RWS NN"],
    query: { regio_id: "RWS WNN" },
    expected: REGIO,
  },
  {
    name: "admin session, no query",
    roles: ["admin"],
    expected: ADMIN,
  },
  {
    name: "admin session, query RWS NN",
    roles: ["admin"],
    query: { regio_id: REGIO },
    expected: REGIO,
  },
  {
    name: "no session, query RWS NN",
    roles: [],
    query: { regio_id: REGIO },
    expected: REGIO,
  },
  {
    name: "no session, no query",
    roles: [],
    expected: undefined,
  },
];

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
