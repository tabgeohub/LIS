import { Pool } from "pg";
import { selectPointsIdRegio } from "../src/helpers/repositories/pointsRepo";
import { selectGeometriesWithPointRegio } from "../src/helpers/repositories/geometriesRepo";
import type { RegioTestReporter } from "./verifyRegioFlightPlanCases";

const ADMIN = "admin";

type RegioCheckInput = {
  reporter: RegioTestReporter;
  expectedRegio: string;
};

async function withPool<T>(
  work: (pool: Pool) => Promise<T>
): Promise<T> {
  const pool = new Pool();
  try {
    return await work(pool);
  } finally {
    await pool.end();
  }
}

async function fetchRowsWithPool<T>(
  work: (pool: Pool) => Promise<{ rows: T[] }>
): Promise<T[]> {
  return (await withPool(work)).rows;
}

function filterWrongRegio<T>(
  rows: T[],
  expectedRegio: string,
  getRegio: (row: T) => string | undefined
): T[] {
  const expected = expectedRegio.toLowerCase();
  return rows.filter((row) => (getRegio(row) ?? "").toLowerCase() !== expected);
}

function reportRegioMatch(
  reporter: RegioTestReporter,
  label: string,
  badCount: number,
  passDetail: string,
  failDetail: string
): void {
  if (badCount) {
    reporter.fail(label, failDetail);
  } else {
    reporter.pass(label, passDetail);
  }
}

export async function runPointsRegioCheck(
  input: RegioCheckInput
): Promise<void> {
  const { reporter, expectedRegio } = input;
  const rows = await fetchRowsWithPool<{ regio_id?: string }>((pool) =>
    selectPointsIdRegio(pool, { regio: expectedRegio })
  );
  const bad = filterWrongRegio(rows, expectedRegio, (r) => r.regio_id);
  reportRegioMatch(
    reporter,
    "GET /points [RWS NN]",
    bad.length,
    `${rows.length} point(s), all regio_id=${expectedRegio}`,
    `${bad.length} point(s) wrong regio`
  );

  const adminRows = await fetchRowsWithPool((pool) =>
    selectPointsIdRegio(pool, { regio: ADMIN })
  );
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

export async function runGeometriesRegioCheck(
  input: RegioCheckInput
): Promise<void> {
  const { reporter, expectedRegio } = input;
  const rows = await fetchRowsWithPool<{ point_regio_id?: string }>((pool) =>
    selectGeometriesWithPointRegio(pool, { regio: expectedRegio })
  );
  const bad = filterWrongRegio(rows, expectedRegio, (r) => r.point_regio_id);
  reportRegioMatch(
    reporter,
    "GET /geometries [RWS NN]",
    bad.length,
    `${rows.length} geometry-point row(s), all point regio=${expectedRegio}`,
    `${bad.length} row(s) wrong point regio`
  );
}
