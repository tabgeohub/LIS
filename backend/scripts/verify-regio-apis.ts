/**
 * Verifies flight-plan, point, and geometry API queries + regio role filtering.
 * Run: npm run verify:regio-apis   (from backend/)
 */
import "dotenv/config";
import { Pool } from "pg";
import { buildFlightPlanQuery } from "../src/helpers/queries/flight-plans/buildFlightPlanQuery";
import {
  buildFinishedFlightPlansListQuery,
  buildFinishedPlansTimeRangeQuery,
  buildFinishedPlansWithPointsQuery,
} from "../src/helpers/queries/finished-plans/buildFinishedPlanQuery";
import { appendRegioFilter } from "../src/helpers/queries/shared/regioFilter";
import { resolveRegioFilter } from "../src/helpers/resolveRegioFilter";

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

function makeFakeAccessToken(roles: string[]): string {
  const payload = Buffer.from(
    JSON.stringify({ realm_access: { roles } })
  ).toString("base64url");
  return `e30.${payload}.e30`;
}

function mockReq(roles: string[], query: Record<string, string> = {}) {
  return {
    query,
    session: {
      auth: {
        tokenSet: { access_token: makeFakeAccessToken(roles) },
      },
    },
  } as Parameters<typeof resolveRegioFilter>[0];
}

function testResolveRegioFilter() {
  console.log("\n── resolveRegioFilter (unit) ──");

  const cases: Array<{
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

  for (const c of cases) {
    const got = resolveRegioFilter(mockReq(c.roles, c.query ?? {}));
    if (got === c.expected) {
      pass(c.name, `→ "${got ?? "(none)"}"`);
    } else {
      fail(c.name, `expected "${c.expected ?? "(none)"}", got "${got ?? "(none)"}"`);
    }
  }
}

function assertPlanRegios(
  endpoint: string,
  rows: Array<{ id?: number; regio_id?: string }>,
  expectedRegio: string
): boolean {
  const bad = rows.filter(
    (r) => (r.regio_id ?? "").toLowerCase() !== expectedRegio.toLowerCase()
  );
  if (bad.length > 0) {
    fail(
      endpoint,
      `${bad.length} plan(s) with wrong regio_id: ${bad
        .slice(0, 3)
        .map((r) => `${r.id}:${r.regio_id}`)
        .join(", ")}`
    );
    return false;
  }
  pass(endpoint, `${rows.length} plan(s), all regio_id=${expectedRegio}`);
  return true;
}

const PLAN_TABLE_BY_KEY = {
  "lis.flightplans": "lis.flightplans",
  "lis.template_plans": "lis.template_plans",
} as const;

async function assertPlanRegiosWithDb(
  pool: Pool,
  endpoint: string,
  rows: Array<{ id?: number; regio_id?: string }>,
  expectedRegio: string,
  table: keyof typeof PLAN_TABLE_BY_KEY = "lis.flightplans"
): Promise<boolean> {
  if (rows.length === 0) {
    pass(endpoint, "0 plan(s)");
    return true;
  }

  const ids = rows.map((r) => r.id).filter((id): id is number => id != null);
  if (ids.length === 0) {
    fail(endpoint, "rows returned without plan ids");
    return false;
  }

  const tableName = PLAN_TABLE_BY_KEY[table];
  const r = await pool.query(
    "SELECT id, regio_id FROM " + tableName + " WHERE id = ANY($1::int[])",
    [ids]
  );
  return assertPlanRegios(endpoint, r.rows, expectedRegio);
}

async function runPointsQuery(regio: string | undefined): Promise<unknown[]> {
  const params: unknown[] = [];
  let query = "SELECT id, regio_id FROM lis.points";
  if (regio && regio !== ADMIN) {
    params.push(regio.toLowerCase());
    query += ` WHERE LOWER(regio_id) = $${params.length}`;
  }
  query += " ORDER BY id DESC LIMIT 5000";
  const pool = new Pool();
  try {
    const r = await pool.query(query, params);
    return r.rows;
  } finally {
    await pool.end();
  }
}

async function runGeometriesQuery(regio: string | undefined): Promise<unknown[]> {
  const params: unknown[] = [];
  let query = `
    SELECT g.id, g.regio_id, p.regio_id AS point_regio_id
    FROM lis.geometries g
    JOIN lis.points p ON p.geometry_id = g.id`;
  const conditions: string[] = [];
  if (regio && regio !== ADMIN) {
    params.push(regio.toLowerCase());
    conditions.push(`LOWER(p.regio_id) = $${params.length}`);
  }
  if (conditions.length) {
    query += " WHERE " + conditions.join(" AND ");
  }
  query += " ORDER BY g.id DESC LIMIT 5000";
  const pool = new Pool();
  try {
    const r = await pool.query(query, params);
    return r.rows;
  } finally {
    await pool.end();
  }
}

async function runQuery(
  label: string,
  sql: string,
  params: unknown[]
): Promise<unknown[]> {
  const pool = new Pool();
  try {
    const r = await pool.query(sql, params);
    return r.rows;
  } catch (e) {
    fail(label, `SQL error: ${e instanceof Error ? e.message : String(e)}`);
    return [];
  } finally {
    await pool.end();
  }
}

async function testDatabaseQueries() {
  console.log("\n── Database queries (regio filter) ──");

  const pool = new Pool();

  const flightPlanCases = [
    {
      name: "GET /flightPlans",
      build: (regio: string | undefined) =>
        buildFlightPlanQuery({
          columnPreset: "all",
          pointPreset: "full",
          includeGeometryJoin: true,
          where: "fp.status <> 'inactief'",
          regio_id: regio,
          regioFilter: { caseInsensitiveAdmin: true },
        }),
    },
    {
      name: "GET /flightPlans/prepreparedFlightPlans",
      build: (regio: string | undefined) =>
        buildFlightPlanQuery({
          columnPreset: "search",
          pointPreset: "search",
          where: "fp.status = 'pre-prepared'",
          regio_id: regio,
          regioFilter: { caseInsensitiveAdmin: true },
        }),
    },
    {
      name: "GET /flightPlans/fullPreparedFlightPlans",
      build: (regio: string | undefined) =>
        buildFlightPlanQuery({
          columnPreset: "prepared",
          pointPreset: "minimal",
          where: "fp.status = 'prepared'",
          regio_id: regio,
          regioFilter: { caseInsensitiveAdmin: true },
        }),
    },
    {
      name: "GET /flightPlans/unPreparedPlans",
      build: (regio: string | undefined) =>
        buildFlightPlanQuery({
          columnPreset: "minimal",
          pointPreset: "minimal",
          where: "fp.status = 'pre-prepared'",
          regio_id: regio,
          regioFilter: { caseInsensitiveAdmin: true },
        }),
    },
    {
      name: "GET /templateFlight",
      build: (regio: string | undefined) =>
        buildFlightPlanQuery({
          planTable: "lis.template_plans",
          planAlias: "tp",
          columnPreset: "template",
          pointPreset: "template",
          includeGeometryJoin: true,
          regio_id: regio,
          regioColumn: "tp.regio_id",
          regioFilter: { caseInsensitiveAdmin: true },
        }),
    },
    {
      name: "GET /finished_plans/getPartialFinishedFlightPlans",
      build: (regio: string | undefined) =>
        buildFinishedPlansWithPointsQuery({ regio_id: regio }),
    },
    {
      name: "GET /finished_plans/",
      build: (regio: string | undefined) =>
        buildFinishedFlightPlansListQuery(regio),
    },
    {
      name: "GET /timeslider/getTimeRange",
      build: (regio: string | undefined) =>
        buildFinishedPlansTimeRangeQuery(regio),
    },
  ];

  try {
    for (const c of flightPlanCases) {
      const regional = resolveRegioFilter(mockReq(["RWS NN"]));
      const admin = resolveRegioFilter(mockReq(["admin"]));

      const { query: qRegio, params: pRegio } = c.build(regional);
      const { query: qAdmin, params: pAdmin } = c.build(admin);

      const rowsRegio = await pool.query(qRegio, pRegio);
      const rowsAdmin = await pool.query(qAdmin, pAdmin);

      if (c.name.includes("getTimeRange")) {
        pass(
          c.name,
          `RWS NN range: ${rowsRegio.rows[0]?.from ?? "null"}–${rowsRegio.rows[0]?.to ?? "null"} | admin: ${rowsAdmin.rows[0]?.from ?? "null"}–${rowsAdmin.rows[0]?.to ?? "null"}`
        );
        continue;
      }

      const table = c.name.includes("templateFlight")
        ? "lis.template_plans"
        : "lis.flightplans";

      await assertPlanRegiosWithDb(
        pool,
        `${c.name} [RWS NN]`,
        rowsRegio.rows as Array<{ id?: number; regio_id?: string }>,
        REGIO,
        table
      );

      const adminCount = rowsAdmin.rows.length;
      const regioCount = rowsRegio.rows.length;
      if (adminCount >= regioCount) {
        pass(
          `${c.name} [admin >= regional]`,
          `admin=${adminCount}, RWS NN=${regioCount}`
        );
      } else {
        fail(
          `${c.name} [admin >= regional]`,
          `admin=${adminCount} < RWS NN=${regioCount} (unexpected)`
        );
      }
    }

    // preparedFlighPlans — raw SQL route
    {
      const regional = resolveRegioFilter(mockReq(["RWS NN"]))!;
      const params: unknown[] = [];
      let query = `SELECT id, regio_id FROM lis.flightPlans WHERE status = 'prepared'`;
      query = appendRegioFilter(query, params, regional, "regio_id", {
        caseInsensitiveAdmin: true,
      });
      const r = await pool.query(query, params);
      await assertPlanRegiosWithDb(
        pool,
        "GET /flightPlans/preparedFlighPlans [RWS NN]",
        r.rows,
        REGIO
      );
    }

    // Points
    {
      const regional = resolveRegioFilter(mockReq(["RWS NN"]))!;
      const rows = (await runPointsQuery(regional)) as Array<{
        regio_id?: string;
      }>;
      const bad = rows.filter(
        (r) => (r.regio_id ?? "").toLowerCase() !== REGIO.toLowerCase()
      );
      if (bad.length) {
        fail("GET /points [RWS NN]", `${bad.length} point(s) wrong regio`);
      } else {
        pass("GET /points [RWS NN]", `${rows.length} point(s), all regio_id=${REGIO}`);
      }

      const adminRows = (await runPointsQuery(ADMIN)) as unknown[];
      if (adminRows.length >= rows.length) {
        pass(
          "GET /points [admin >= regional]",
          `admin=${adminRows.length}, RWS NN=${rows.length}`
        );
      } else {
        fail("GET /points [admin >= regional]", `admin=${adminRows.length} < RWS NN=${rows.length}`);
      }
    }

    // Geometries (filtered via point regio)
    {
      const regional = resolveRegioFilter(mockReq(["RWS NN"]))!;
      const rows = (await runGeometriesQuery(regional)) as Array<{
        point_regio_id?: string;
      }>;
      const bad = rows.filter(
        (r) => (r.point_regio_id ?? "").toLowerCase() !== REGIO.toLowerCase()
      );
      if (bad.length) {
        fail("GET /geometries [RWS NN]", `${bad.length} row(s) wrong point regio`);
      } else {
        pass(
          "GET /geometries [RWS NN]",
          `${rows.length} geometry-point row(s), all point regio=${REGIO}`
        );
      }
    }

    // Session → query wiring (simulates Swagger without query param)
    {
      const resolved = resolveRegioFilter(mockReq(["RWS NN"], {}));
      const { query, params } = buildFinishedPlansWithPointsQuery({
        regio_id: resolved,
      });
      const r = await pool.query(query, params);
      await assertPlanRegiosWithDb(
        pool,
        "Swagger-style: RWS NN session, no regio_id param",
        r.rows as Array<{ id?: number; regio_id?: string }>,
        REGIO
      );

      const adminResolved = resolveRegioFilter(mockReq(["admin"], {}));
      const { query: qAdmin, params: pAdmin } = buildFinishedPlansWithPointsQuery({
        regio_id: adminResolved,
      });
      const rAdmin = await pool.query(qAdmin, pAdmin);
      if (rAdmin.rows.length >= r.rows.length) {
        pass(
          "Swagger-style: admin session, no param",
          `admin=${rAdmin.rows.length} plans (unfiltered), RWS NN=${r.rows.length}`
        );
      }
    }
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
  console.log(`Total: ${results.length}  Passed: ${results.length - failed.length}  Failed: ${failed.length}`);

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
