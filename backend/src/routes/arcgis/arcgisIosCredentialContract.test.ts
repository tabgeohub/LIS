import assert from "node:assert/strict";
import http, { type Server } from "node:http";
import express from "express";
import { requireSessionAuth } from "../../helpers/auth/requireSessionAuth";
import arcgisRouter from ".";
import { sendArcgisProxyError } from "./arcgisGetProxyHelpers";

type Result = { status: number; body: Record<string, unknown> };

function listen(app: express.Express): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1", () => resolve(server));
    server.once("error", reject);
  });
}

function request(server: Server, identity: "none" | "missing" | "regional"): Promise<Result> {
  const address = server.address();
  assert(address && typeof address !== "string");
  return new Promise((resolve, reject) => {
    const req = http.request({
      host: "127.0.0.1",
      port: address.port,
      path: "/api/arcgis/ios/credential",
      headers: { "x-fixture-identity": identity },
    }, (res) => {
      let text = "";
      res.setEncoding("utf8");
      res.on("data", (chunk: string) => (text += chunk));
      res.on("end", () => resolve({ status: res.statusCode ?? 0, body: text ? JSON.parse(text) : {} }));
    });
    req.once("error", reject);
    req.end();
  });
}

async function run() {
  const app = express();
  app.use((req, _res, next) => {
    const identity = req.header("x-fixture-identity");
    if (identity !== "none") {
      (req as any).session = {
        auth: {
          tokenSet: { access_token: "fixture-access", expires_at: Math.floor(Date.now() / 1000) + 3600 },
          userInfo: {},
          ...(identity === "regional"
            ? { identity: { subject: "fixture-subject", regio_id: "RWS FIXTURE", is_admin: false } }
            : {}),
        },
      };
    }
    next();
  });
  app.use("/api/arcgis", requireSessionAuth, arcgisRouter);

  const server = await listen(app);
  try {
    const unauthorized = await request(server, "none");
    assert.equal(unauthorized.status, 401);
    assert.deepEqual(unauthorized.body, { message: "Authentication required" });

    const missingIdentity = await request(server, "missing");
    assert.equal(missingIdentity.status, 403);
    assert.equal(missingIdentity.body.code, "ARCGIS_IDENTITY_UNAVAILABLE");

    const granted = await request(server, "regional");
    assert.equal(granted.status, 200);
    assert.deepEqual(granted.body, {
      version: 2,
      mode: "server_proxy",
      get_proxy_path: "api/arcgis/proxy",
      upload_contract: "existing_records_v2",
      max_photo_bytes: 16 * 1024 * 1024,
      persistent_claims: false,
      durable_operation_receipts: false,
      uncertain_writes: "reconcile_or_review",
      first_write_permits: "process_bound_single_use",
    });
    const responseText = JSON.stringify(granted.body).toLowerCase();
    assert.equal(responseText.includes("token"), false);
    assert.equal(responseText.includes("secret"), false);
    assert.equal(responseText.includes("fixture-subject"), false);

    let status = 0;
    let body: Record<string, unknown> = {};
    const response = {
      status(value: number) { status = value; return this; },
      json(value: Record<string, unknown>) { body = value; return this; },
    };
    sendArcgisProxyError(response as any, new Error("synthetic provider secret"));
    assert.equal(status, 500);
    assert.deepEqual(body, {
      code: "ARCGIS_PROXY_UNAVAILABLE",
      message: "ArcGIS proxy request failed",
    });
    assert.equal(JSON.stringify(body).includes("synthetic"), false);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

run()
  .then(() => console.log("arcgis iOS credential contract: passed"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
