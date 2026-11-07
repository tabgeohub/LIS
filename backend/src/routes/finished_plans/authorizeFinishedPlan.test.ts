import assert from "node:assert/strict";
import { pool } from "../../db";
import { authorizeFinishedPlan } from "./authorizeFinishedPlan";

function request(roles: string[]) {
  const token = `e30.${Buffer.from(JSON.stringify({ realm_access: { roles } })).toString("base64url")}.signature`;
  return { session: { auth: { tokenSet: { access_token: token }, userInfo: { sub: "user" } } } } as any;
}
function response() {
  return { statusCode: 200, status(code: number) { this.statusCode = code; return this; }, json(_value: unknown) { return this; } } as any;
}
async function main() {
  const original = pool.query;
  try {
    (pool as any).query = async () => ({ rows: [{ regio_id: "RWS A" }] });
    for (const [roles, allowed] of [[ ["RWS A"], true ], [ ["RWS B"], false ], [ ["RWS B", "admin"], true ], [ ["superadmin"], false ], [ [], false ]] as Array<[string[], boolean]>) {
      const res = response();
      assert.equal(await authorizeFinishedPlan(request(roles), res, 1), allowed);
      assert.equal(res.statusCode, allowed ? 200 : 403);
    }
    (pool as any).query = async () => ({ rows: [] });
    const missing = response();
    assert.equal(await authorizeFinishedPlan(request(["admin"]), missing, 1), false);
    assert.equal(missing.statusCode, 404);
    const noIdentity = response();
    assert.equal(await authorizeFinishedPlan({ session: {} } as any, noIdentity, 1), false);
    assert.equal(noIdentity.statusCode, 403);
  } finally {
    pool.query = original;
    await pool.end();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
