import assert from "node:assert/strict";
import { isAdmin } from "./realmAdminAuth";
import { resolveAuthenticatedIdentity } from "../../routes/auth2/authIdentity";

function token(roles: string[]): string {
  return `e30.${Buffer.from(JSON.stringify({ realm_access: { roles } })).toString("base64url")}.signature`;
}

async function main() {
  for (const roles of [["RWS NN", "admin"], ["admin", "RWS NN"]]) {
    const access_token = token(roles);
    assert.equal(isAdmin({ session: { auth: { tokenSet: { access_token } } } } as any), true);
    const identity = await resolveAuthenticatedIdentity({ tokenSet: { access_token } as any, userInfo: { sub: "test-subject" } });
    assert.equal(identity?.is_admin, true);
  }
  for (const role of ["superadmin", "realm-admin", "Admin", "RWS NN"]) {
    const access_token = token([role]);
    assert.equal(isAdmin({ session: { auth: { tokenSet: { access_token } } } } as any), false);
    const identity = await resolveAuthenticatedIdentity({ tokenSet: { access_token } as any, userInfo: { sub: "test-subject" } });
    assert.equal(identity?.is_admin, false);
  }
  console.log("Migration admin role checks passed");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
