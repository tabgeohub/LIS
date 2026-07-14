import assert from "assert";
import { Response } from "undici";
import { requestAdminTokenWithRetry } from "./keycloakAdminTokenRequest";
import { parseKeycloakAdminTokenResponse } from "./parseKeycloakAdminTokenResponse";

async function run() {
  let attempts = 0;
  const response = await requestAdminTokenWithRetry({
    tokenUrl: "https://keycloak.invalid/token",
    tokenParams: new URLSearchParams(),
    timeoutMs: 100,
    fetchImpl: (async () => {
      attempts += 1;
      if (attempts === 1) throw new Error("transient");
      return new Response(JSON.stringify({ access_token: "ok", expires_in: 60 }), { status: 200 });
    }) as typeof import("undici").fetch,
  });
  assert.equal(attempts, 2);
  assert.deepEqual(await parseKeycloakAdminTokenResponse(response), { token: "ok", expiresInSeconds: 60 });

  await assert.rejects(() => requestAdminTokenWithRetry({
    tokenUrl: "https://keycloak.invalid/token",
    tokenParams: new URLSearchParams(),
    timeoutMs: 100,
    fetchImpl: (async () => { throw Object.assign(new Error("offline"), { code: "ECONNRESET" }); }) as typeof import("undici").fetch,
  }), /Failed to connect.*offline.*ECONNRESET/);
  await assert.rejects(
    () => parseKeycloakAdminTokenResponse(new Response(JSON.stringify({}), { status: 200 })),
    /missing access_token/
  );
  console.log("keycloakAdminTokenRequest tests passed");
}

void run();
