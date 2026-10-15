import assert from "node:assert/strict";
import test from "node:test";
import { buildFinishedPlansWithPointsQuery } from "./buildFinishedPlanQuery";

test("partial finished-plan query defines geometry member order from flight-plan membership", () => {
  const { query, params } = buildFinishedPlansWithPointsQuery({
    regio_id: "admin",
  });

  assert.deepEqual(params, []);
  assert.match(
    query,
    /JOIN LATERAL UNNEST\(fp\.points\) WITH ORDINALITY\s+AS plan_member\(point_id, member_order\) ON TRUE/
  );
  assert.match(
    query,
    /JOIN points_per_plan ppp\s+ON ppp\.plan_id = fp\.id\s+AND ppp\.point_id = plan_member\.point_id/
  );
  assert.match(query, /'geometry_member_order', plan_member\.member_order/);
});
