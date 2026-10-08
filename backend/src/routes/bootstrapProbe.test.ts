import assert from "assert";
import http, { type IncomingHttpHeaders, type Server } from "http";
import express from "express";
import { configureExpressApp } from "../configureExpressApp";
import {
  BOOTSTRAP_PROBE_PATH,
  BOOTSTRAP_PROBE_RESPONSE,
} from "./bootstrapProbe";

type HttpResult = {
  statusCode: number;
  headers: IncomingHttpHeaders;
  body: string;
};

function listen(app: express.Express): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1", () => resolve(server));
    server.once("error", reject);
  });
}

function close(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

function request(
  server: Server,
  path: string,
  headers: http.OutgoingHttpHeaders = {}
): Promise<HttpResult> {
  const address = server.address();
  assert(address && typeof address !== "string");

  return new Promise((resolve, reject) => {
    const req = http.get(
      {
        host: "127.0.0.1",
        port: address.port,
        path,
        headers,
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk: string) => (body += chunk));
        res.on("end", () =>
          resolve({
            statusCode: res.statusCode ?? 0,
            headers: res.headers,
            body,
          })
        );
      }
    );
    req.once("error", reject);
  });
}

async function run() {
  process.env.AUTH2_RATE_LIMIT_STORE = "memory";
  process.env.SESSION_STORE = "memory";
  process.env.SESSION_SECRET = "bootstrap-probe-test-secret";

  const app = express();
  await configureExpressApp(app);
  const server = await listen(app);

  try {
    const probe = await request(server, BOOTSTRAP_PROBE_PATH, {
      Origin: "http://localhost:5173",
    });
    assert.equal(probe.statusCode, 200);
    assert.match(String(probe.headers["content-type"]), /application\/json/);
    assert.equal(probe.headers["access-control-allow-origin"], "http://localhost:5173");
    assert.equal(probe.headers["access-control-allow-credentials"], "true");
    assert.equal(probe.headers["set-cookie"], undefined);
    assert.deepEqual(JSON.parse(probe.body), BOOTSTRAP_PROBE_RESPONSE);

    const protectedRoute = await request(
      server,
      "/api/flightPlans/preparedFlighPlans"
    );
    assert.equal(protectedRoute.statusCode, 401);
    assert.deepEqual(JSON.parse(protectedRoute.body), {
      message: "Authentication required",
    });

    const unknownRoute = await request(server, "/not-a-route");
    assert.equal(unknownRoute.statusCode, 404);
  } finally {
    await close(server);
  }
}

run()
  .then(() => console.log("bootstrap probe integration tests passed"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
