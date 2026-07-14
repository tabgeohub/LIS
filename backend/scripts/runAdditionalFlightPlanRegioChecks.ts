import { Pool } from "pg";
import { appendRegioFilter } from "../src/helpers/queries/shared/regioFilter";
import { resolveRegioFilter } from "../src/helpers/queries/shared/resolveRegioFilter";
import { buildFinishedPlansWithPointsQuery } from "../src/helpers/queries/finished-plans/buildFinishedPlanQuery";
import { assertPlanRegiosWithDb } from "./regioPlanAssertions";
import { MockReqFactory, RegioTestReporter } from "./regioVerificationTypes";

type Input = { pool: Pool; reporter: RegioTestReporter; mockReq: MockReqFactory; expectedRegio: string };

export async function runPreparedPlansRegioCheck(input: Input) {
  const regional = resolveRegioFilter(input.mockReq({ roles: ["RWS NN"] }))!;
  const params: unknown[] = [];
  const query = appendRegioFilter({
    sql: "SELECT id, regio_id FROM lis.flightPlans WHERE status = 'prepared'",
    params,
    regio_id: regional,
    column: "regio_id",
    options: { caseInsensitiveAdmin: true },
  });
  const result = await input.pool.query(query, params);
  await assertPlanRegiosWithDb(input.reporter, { pool: input.pool, endpoint: "GET /flightPlans/preparedFlighPlans [RWS NN]", rows: result.rows, expectedRegio: input.expectedRegio });
}

export async function runSwaggerStyleRegioCheck(input: Input) {
  const regional = resolveRegioFilter(input.mockReq({ roles: ["RWS NN"], query: {} }));
  const regionalQuery = buildFinishedPlansWithPointsQuery({ regio_id: regional });
  const regionalResult = await input.pool.query(regionalQuery.query, regionalQuery.params);
  await assertPlanRegiosWithDb(input.reporter, { pool: input.pool, endpoint: "Swagger-style: RWS NN session, no regio_id param", rows: regionalResult.rows, expectedRegio: input.expectedRegio });
  const admin = resolveRegioFilter(input.mockReq({ roles: ["admin"], query: {} }));
  const adminQuery = buildFinishedPlansWithPointsQuery({ regio_id: admin });
  const adminResult = await input.pool.query(adminQuery.query, adminQuery.params);
  if (adminResult.rows.length >= regionalResult.rows.length) {
    input.reporter.pass("Swagger-style: admin session, no param", `admin=${adminResult.rows.length} plans (unfiltered), RWS NN=${regionalResult.rows.length}`);
  }
}
