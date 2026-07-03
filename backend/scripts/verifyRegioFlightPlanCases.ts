import { Pool } from "pg";
import { buildFlightPlanQuery } from "../src/helpers/queries/flight-plans/buildFlightPlanQuery";
import {
  buildFinishedFlightPlansListQuery,
  buildFinishedPlansTimeRangeQuery,
  buildFinishedPlansWithPointsQuery,
} from "../src/helpers/queries/finished-plans/buildFinishedPlanQuery";
import { appendRegioFilter } from "../src/helpers/queries/shared/regioFilter";
import { resolveRegioFilter } from "../src/helpers/queries/shared/resolveRegioFilter";

export type RegioTestReporter = {
  pass: (name: string, detail: string) => void;
  fail: (name: string, detail: string) => void;
};

export type MockReqFactory = (input: {
  roles: string[];
  query?: Record<string, string>;
}) => Parameters<typeof resolveRegioFilter>[0];

type FlightPlanCase = {
  name: string;
  build: (regio: string | undefined) => { query: string; params: unknown[] };
};

export const FLIGHT_PLAN_REGIO_CASES: FlightPlanCase[] = [
  {
    name: "GET /flightPlans",
    build: (regio) =>
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
    build: (regio) =>
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
    build: (regio) =>
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
    build: (regio) =>
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
    build: (regio) =>
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
    build: (regio) => buildFinishedPlansWithPointsQuery({ regio_id: regio }),
  },
  {
    name: "GET /finished_plans/",
    build: (regio) => buildFinishedFlightPlansListQuery(regio),
  },
  {
    name: "GET /timeslider/getTimeRange",
    build: (regio) => buildFinishedPlansTimeRangeQuery(regio),
  },
];

const PLAN_TABLE_BY_KEY = {
  "lis.flightplans": "lis.flightplans",
  "lis.template_plans": "lis.template_plans",
} as const;

type AssertPlanRegiosInput = {
  endpoint: string;
  rows: Array<{ id?: number; regio_id?: string }>;
  expectedRegio: string;
};

function assertPlanRegios(
  reporter: RegioTestReporter,
  input: AssertPlanRegiosInput
): boolean {
  const { endpoint, rows, expectedRegio } = input;
  const bad = rows.filter(
    (r) => (r.regio_id ?? "").toLowerCase() !== expectedRegio.toLowerCase()
  );
  if (bad.length > 0) {
    reporter.fail(
      endpoint,
      `${bad.length} plan(s) with wrong regio_id: ${bad
        .slice(0, 3)
        .map((r) => `${r.id}:${r.regio_id}`)
        .join(", ")}`
    );
    return false;
  }
  reporter.pass(endpoint, `${rows.length} plan(s), all regio_id=${expectedRegio}`);
  return true;
}

async function assertPlanRegiosWithDb(
  reporter: RegioTestReporter,
  input: {
    pool: Pool;
    endpoint: string;
    rows: Array<{ id?: number; regio_id?: string }>;
    expectedRegio: string;
    table?: keyof typeof PLAN_TABLE_BY_KEY;
  }
): Promise<boolean> {
  const { pool, endpoint, rows, expectedRegio, table = "lis.flightplans" } = input;
  if (rows.length === 0) {
    reporter.pass(endpoint, "0 plan(s)");
    return true;
  }

  const ids = rows.map((r) => r.id).filter((id): id is number => id != null);
  if (ids.length === 0) {
    reporter.fail(endpoint, "rows returned without plan ids");
    return false;
  }

  const tableName = PLAN_TABLE_BY_KEY[table];
  const r = await pool.query(
    "SELECT id, regio_id FROM " + tableName + " WHERE id = ANY($1::int[])",
    [ids]
  );
  return assertPlanRegios(reporter, { endpoint, rows: r.rows, expectedRegio });
}

export async function runFlightPlanRegioCases(input: {
  pool: Pool;
  reporter: RegioTestReporter;
  mockReq: MockReqFactory;
  expectedRegio: string;
}): Promise<void> {
  const { pool, reporter, mockReq, expectedRegio } = input;

  for (const c of FLIGHT_PLAN_REGIO_CASES) {
    const regional = resolveRegioFilter(mockReq({ roles: ["RWS NN"] }));
    const admin = resolveRegioFilter(mockReq({ roles: ["admin"] }));

    const { query: qRegio, params: pRegio } = c.build(regional);
    const { query: qAdmin, params: pAdmin } = c.build(admin);

    const rowsRegio = await pool.query(qRegio, pRegio);
    const rowsAdmin = await pool.query(qAdmin, pAdmin);

    if (c.name.includes("getTimeRange")) {
      reporter.pass(
        c.name,
        `RWS NN range: ${rowsRegio.rows[0]?.from ?? "null"}–${rowsRegio.rows[0]?.to ?? "null"} | admin: ${rowsAdmin.rows[0]?.from ?? "null"}–${rowsAdmin.rows[0]?.to ?? "null"}`
      );
      continue;
    }

    const table = c.name.includes("templateFlight")
      ? "lis.template_plans"
      : "lis.flightplans";

    await assertPlanRegiosWithDb(reporter, {
      pool,
      endpoint: `${c.name} [RWS NN]`,
      rows: rowsRegio.rows as Array<{ id?: number; regio_id?: string }>,
      expectedRegio,
      table,
    });

    const adminCount = rowsAdmin.rows.length;
    const regioCount = rowsRegio.rows.length;
    if (adminCount >= regioCount) {
      reporter.pass(
        `${c.name} [admin >= regional]`,
        `admin=${adminCount}, RWS NN=${regioCount}`
      );
    } else {
      reporter.fail(
        `${c.name} [admin >= regional]`,
        `admin=${adminCount} < RWS NN=${regioCount} (unexpected)`
      );
    }
  }
}

export async function runPreparedPlansRegioCheck(input: {
  pool: Pool;
  reporter: RegioTestReporter;
  mockReq: MockReqFactory;
  expectedRegio: string;
}): Promise<void> {
  const { pool, reporter, mockReq, expectedRegio } = input;
  const regional = resolveRegioFilter(mockReq({ roles: ["RWS NN"] }))!;
  const params: unknown[] = [];
  let query = `SELECT id, regio_id FROM lis.flightPlans WHERE status = 'prepared'`;
  query = appendRegioFilter({
    sql: query,
    params,
    regio_id: regional,
    column: "regio_id",
    options: { caseInsensitiveAdmin: true },
  });
  const r = await pool.query(query, params);
  await assertPlanRegiosWithDb(reporter, {
    pool,
    endpoint: "GET /flightPlans/preparedFlighPlans [RWS NN]",
    rows: r.rows,
    expectedRegio,
  });
}

export async function runSwaggerStyleRegioCheck(input: {
  pool: Pool;
  reporter: RegioTestReporter;
  mockReq: MockReqFactory;
  expectedRegio: string;
}): Promise<void> {
  const { pool, reporter, mockReq, expectedRegio } = input;
  const resolved = resolveRegioFilter(mockReq({ roles: ["RWS NN"], query: {} }));
  const { query, params } = buildFinishedPlansWithPointsQuery({ regio_id: resolved });
  const r = await pool.query(query, params);
  await assertPlanRegiosWithDb(reporter, {
    pool,
    endpoint: "Swagger-style: RWS NN session, no regio_id param",
    rows: r.rows as Array<{ id?: number; regio_id?: string }>,
    expectedRegio,
  });

  const adminResolved = resolveRegioFilter(mockReq({ roles: ["admin"], query: {} }));
  const { query: qAdmin, params: pAdmin } = buildFinishedPlansWithPointsQuery({
    regio_id: adminResolved,
  });
  const rAdmin = await pool.query(qAdmin, pAdmin);
  if (rAdmin.rows.length >= r.rows.length) {
    reporter.pass(
      "Swagger-style: admin session, no param",
      `admin=${rAdmin.rows.length} plans (unfiltered), RWS NN=${r.rows.length}`
    );
  }
}
