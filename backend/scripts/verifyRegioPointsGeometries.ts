import { Pool } from "pg";
import { selectPointsIdRegio } from "../src/helpers/repositories/pointsRepo";
import { selectGeometriesWithPointRegio } from "../src/helpers/repositories/geometriesRepo";
import type { RegioTestReporter } from "./verifyRegioFlightPlanCases";

const ADMIN = "admin";

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

export async function runPointsRegioCheck(input: {
  reporter: RegioTestReporter;
  expectedRegio: string;
}): Promise<void> {
  const { reporter, expectedRegio } = input;
  const rows = (
    await withPool((pool) =>
      selectPointsIdRegio(pool, { regio: expectedRegio })
    )
  ).rows as Array<{ regio_id?: string }>;
  const bad = rows.filter(
    (r) => (r.regio_id ?? "").toLowerCase() !== expectedRegio.toLowerCase()
  );
  if (bad.length) {
    reporter.fail("GET /points [RWS NN]", `${bad.length} point(s) wrong regio`);
  } else {
    reporter.pass("GET /points [RWS NN]", `${rows.length} point(s), all regio_id=${expectedRegio}`);
  }

  const adminRows = (
    await withPool((pool) => selectPointsIdRegio(pool, { regio: ADMIN }))
  ).rows;
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
  const rows = (
    await withPool((pool) =>
      selectGeometriesWithPointRegio(pool, { regio: expectedRegio })
    )
  ).rows as Array<{
    point_regio_id?: string;
  }>;
  const bad = rows.filter(
    (r) =>
      (r.point_regio_id ?? "").toLowerCase() !== expectedRegio.toLowerCase()
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
