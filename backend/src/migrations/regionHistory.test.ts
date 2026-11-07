import assert from "node:assert/strict";
import { selectFlightPlansByPointId } from "../helpers/repositories/flightPlansByPointQuery";

async function main() {
  const calls: Array<{ sql: string; values: unknown[] }> = [];
  const db = { async query(sql: string, values: unknown[]) { calls.push({ sql, values }); return { rows: [] }; } };
  await selectFlightPlansByPointId(db as any, 42, { is_admin: false, regio_id: "A" });
  await selectFlightPlansByPointId(db as any, 42, { is_admin: false, regio_id: null });
  await selectFlightPlansByPointId(db as any, 42, { is_admin: true, regio_id: null });
  assert.match(calls[0].sql, /\$2::boolean OR f\.regio_id = \$3/);
  assert.deepEqual(calls.map(call => call.values), [[42, false, "A"], [42, false, null], [42, true, null]]);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
