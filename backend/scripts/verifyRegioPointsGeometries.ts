import { Pool } from "pg";
import type { RegioTestReporter } from "./verifyRegioFlightPlanCases";

const ADMIN = "admin";

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

export async function runPointsRegioCheck(input: {
  reporter: RegioTestReporter;
  expectedRegio: string;
}): Promise<void> {
  const { reporter, expectedRegio } = input;
  const rows = (await runPointsQuery(expectedRegio)) as Array<{ regio_id?: string }>;
  const bad = rows.filter(
    (r) => (r.regio_id ?? "").toLowerCase() !== expectedRegio.toLowerCase()
  );
  if (bad.length) {
    reporter.fail("GET /points [RWS NN]", `${bad.length} point(s) wrong regio`);
  } else {
    reporter.pass("GET /points [RWS NN]", `${rows.length} point(s), all regio_id=${expectedRegio}`);
  }

  const adminRows = (await runPointsQuery(ADMIN)) as unknown[];
  if (adminRows.length >= rows.length) {
    reporter.pass(
      "GET /points [admin >= regional]",
      `admin=${adminRows.length}, RWS NN=${rows.length}`
    );
  } else {
    reporter.fail(
      "GET /points [admin >= regional]",
      `admin=${adminRows.length} < RWS NN=${rows.length}`
    );
  }
}

export async function runGeometriesRegioCheck(input: {
  reporter: RegioTestReporter;
  expectedRegio: string;
}): Promise<void> {
  const { reporter, expectedRegio } = input;
  const rows = (await runGeometriesQuery(expectedRegio)) as Array<{
    point_regio_id?: string;
  }>;
  const bad = rows.filter(
    (r) => (r.point_regio_id ?? "").toLowerCase() !== expectedRegio.toLowerCase()
  );
  if (bad.length) {
    reporter.fail("GET /geometries [RWS NN]", `${bad.length} row(s) wrong point regio`);
  } else {
    reporter.pass(
      "GET /geometries [RWS NN]",
      `${rows.length} geometry-point row(s), all point regio=${expectedRegio}`
    );
  }
}
