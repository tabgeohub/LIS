import assert from "node:assert/strict";
import { spawn, ChildProcess } from "node:child_process";
import { once } from "node:events";
import http from "node:http";
import net from "node:net";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import express from "express";
import { configureRequestMiddlewareIos } from "./configure/configureRequestMiddleware-ios";
import { registerApplicationRoutesIos } from "./configure/registerApplicationRoutes-ios";
import { createAppIos } from "./app-ios";
import { IOS_PROBE_ROUTE, IOS_PROBE_RESPONSE } from "./configure/registerApplicationRoutes-ios";
import { composeBackendUrlIos, readServerConfigIos, ACCEPTANCE_BASE_URL_IOS } from "./serverEnv-ios";

const cleanEnv = { PATH: process.env.PATH, NODE_ENV: "test" };
async function freePort() {
  const server = net.createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = (server.address() as net.AddressInfo).port;
  await new Promise<void>(resolve => server.close(() => resolve()));
  return port;
}
function launch(entry: string, env: NodeJS.ProcessEnv, cwd: string = os.tmpdir()) {
  const child = spawn(process.execPath, [require.resolve(entry)], { cwd, env: { ...cleanEnv, ...env } });
  let output = "";
  child.stdout.on("data", value => { output += value.toString(); });
  child.stderr.on("data", value => { output += value.toString(); });
  const exited = new Promise<{ code: number | null; signal: string | null }>((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve({ code, signal }));
  });
  return { child, exited, output: () => output };
}
async function ready(child: ChildProcess, port: number, route = IOS_PROBE_ROUTE) {
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw new Error("fixture_child_failed");
    try {
      const response = await fetch(`http://127.0.0.1:${port}${route}`, { signal: AbortSignal.timeout(500) });
      if (response.ok) return;
    } catch { /* listener not ready */ }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error("fixture_start_timeout");
}
async function stop(run: ReturnType<typeof launch>, signal: NodeJS.Signals = "SIGTERM") {
  run.child.kill(signal);
  const result = await Promise.race([run.exited, new Promise<never>((_, reject) => {
    const timer = setTimeout(() => { run.child.kill("SIGKILL"); reject(new Error("fixture_stop_timeout")); }, 12_000);
    timer.unref();
  })]);
  assert.equal(result.code, 0);
  assert.equal(result.signal, null);
}

test("config and URL composition keep /backend/ and reject unsafe inputs", () => {
  const before = { ...process.env };
  try {
    for (const name of Object.keys(process.env)) if (name.startsWith("IOS_")) delete process.env[name];
    assert.equal(readServerConfigIos().port, 5001);
    assert.equal(readServerConfigIos().host, "127.0.0.1");
    assert.equal(composeBackendUrlIos(ACCEPTANCE_BASE_URL_IOS, "api/ios/bootstrap/probe"),
      "http://acc-lis.rws.nl/backend/api/ios/bootstrap/probe");
    for (const route of ["/api/ios/bootstrap/probe", "../auth", "https://example.com", "api//ios", "api?x=1"]) {
      assert.throws(() => composeBackendUrlIos(ACCEPTANCE_BASE_URL_IOS, route));
    }
    for (const port of ["0", "80", "5001x", "65536", "1.5"]) {
      process.env.IOS_PORT = port;
      assert.throws(readServerConfigIos);
    }
    delete process.env.IOS_PORT;
    for (const base of ["http://example.com/", "http://example.com/backend", "http://user:pass@example.com/backend/", "http://example.com/backend/?x=1"]) {
      process.env.IOS_PUBLIC_BASE_URL = base;
      assert.throws(readServerConfigIos);
    }
  } finally { process.env = before; }
});

test("real middleware: probe, cookie isolation, CORS, methods and planned routes", async () => {
  const server = http.createServer(createAppIos());
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${(server.address() as net.AddressInfo).port}`;
  try {
    const response = await fetch(base + IOS_PROBE_ROUTE, { headers: {
      Cookie: "lis.sid=synthetic-existing-cookie", "X-Forwarded-Proto": "https", Origin: "http://localhost:5173",
    } });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), IOS_PROBE_RESPONSE);
    assert.equal(response.headers.get("set-cookie"), null);
    assert.equal(response.headers.get("x-powered-by"), null);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:5173");
    const denied = await fetch(base + IOS_PROBE_ROUTE, { headers: { Origin: "https://untrusted.example" } });
    assert.equal(denied.headers.get("access-control-allow-origin"), null);
    const preflight = await fetch(base + IOS_PROBE_ROUTE, { method: "OPTIONS", headers: {
      Origin: "http://localhost:5173", "Access-Control-Request-Method": "GET", "Access-Control-Request-Headers": "x-lis-client",
    } });
    assert.equal(preflight.status, 204);
    assert.match(preflight.headers.get("access-control-allow-headers") || "", /x-lis-client/i);
    const head = await fetch(base + IOS_PROBE_ROUTE, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    for (const route of ["/auth2-ios/me", "/api/ios/flightPlans", "/api/flightPlans/preparedFlighPlans", "/api/arcgis/proxy", "/backend" + IOS_PROBE_ROUTE]) {
      const missing = await fetch(base + route);
      assert.equal(missing.status, 404);
      assert.deepEqual(await missing.json(), { error: "not_found", version: 1 });
    }
    assert.equal((await fetch(base + IOS_PROBE_ROUTE, { method: "POST" })).status, 404);
  } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
});

test("body parser precedes routes and errors are bounded and sanitized", async () => {
  const app = createAppIos();
  const server = http.createServer(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${(server.address() as net.AddressInfo).port}`;
  try {
    for (const [body, status, error] of [["{\"synthetic-sensitive-field\":", 400, "invalid_request"], [JSON.stringify({ value: "x".repeat(17_000) }), 413, "request_too_large"]] as const) {
      const response = await fetch(base + IOS_PROBE_ROUTE, { method: "POST", headers: { "Content-Type": "application/json" }, body });
      assert.equal(response.status, status);
      assert.deepEqual(await response.json(), { error, version: 1 });
      assert.equal(response.headers.get("set-cookie"), null);
    }
    const response = await fetch(base + IOS_PROBE_ROUTE, { method: "POST", headers: {
      "Content-Type": "application/json", "Content-Encoding": "unsupported",
    }, body: "{}" });
    assert.equal(response.status, 415);
    assert.deepEqual(await response.json(), { error: "unsupported_encoding", version: 1 });
  } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
});

test("entry starts without service credentials, SIGTERM/SIGINT stop and restart", async () => {
  const port = await freePort();
  for (const signal of ["SIGTERM", "SIGINT"] as const) {
    const run = launch("./server-ios", { IOS_PORT: String(port) });
    try { await ready(run.child, port); await stop(run, signal); assert.match(run.output(), /"event":"stopped"/); }
    finally { if (run.child.exitCode === null) run.child.kill("SIGKILL"); }
  }
});

test("invalid config and missing explicit env file fail without secret/path logging", async () => {
  for (const env of [{ IOS_PORT: "bad-sensitive-marker" }, { IOS_PUBLIC_BASE_URL: "http://user:synthetic-marker@example.com/backend/" }, { IOS_ENV_FILE: "/missing/synthetic-sensitive-marker" }]) {
    const run = launch("./server-ios", env);
    const result = await run.exited;
    assert.equal(result.code, 1);
    assert.match(run.output(), /startup_failed/);
    assert.doesNotMatch(run.output(), /sensitive-marker|synthetic-marker|\/missing/);
  }
});

test("explicit env loading works and baseline .env is ignored", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "lis-ios-env-"));
  const port = await freePort();
  try {
    await writeFile(path.join(directory, ".env"), "IOS_PORT=invalid-baseline-marker\n");
    await writeFile(path.join(directory, "ios.env"), `IOS_PORT=${port}\nIOS_HOST=127.0.0.1\n`);
    for (const env of [{ IOS_PORT: String(port) }, { IOS_ENV_FILE: path.join(directory, "ios.env") }]) {
      const run = launch("./server-ios", env, directory);
      try { await ready(run.child, port); await stop(run); }
      finally { if (run.child.exitCode === null) run.child.kill("SIGKILL"); }
    }
  } finally { await rm(directory, { recursive: true }); }
});

test("occupied listener fails without displacing the running iOS process", async () => {
  const port = await freePort();
  const original = launch("./server-ios", { IOS_PORT: String(port) });
  try {
    await ready(original.child, port);
    const conflict = launch("./server-ios", { IOS_PORT: String(port) });
    assert.equal((await conflict.exited).code, 1);
    assert.match(conflict.output(), /EADDRINUSE/);
    assert.equal((await fetch(`http://127.0.0.1:${port}${IOS_PROBE_ROUTE}`)).status, 200);
    await stop(original);
  } finally { if (original.child.exitCode === null) original.child.kill("SIGKILL"); }
});

test("shutdown bounds an incomplete request and reports forced closure", async () => {
  const port = await freePort();
  const run = launch("./server-ios", { IOS_PORT: String(port) });
  let socket: net.Socket | undefined;
  try {
    await ready(run.child, port);
    socket = net.createConnection(port, "127.0.0.1");
    socket.on("error", () => {});
    await once(socket, "connect");
    socket.write("GET /api/ios/bootstrap/probe HTTP/1.1\r\nHost: localhost\r\n");
    await new Promise(resolve => setTimeout(resolve, 100));
    run.child.kill("SIGTERM");
    const result = await run.exited;
    assert.equal(result.code, 1);
    assert.match(run.output(), /"event":"stopped"/);
  } finally { socket?.destroy(); if (run.child.exitCode === null) run.child.kill("SIGKILL"); }
});

test("baseline startup and website/Desktop auth guards are unchanged while iOS starts/stops", async () => {
  const port = await freePort();
  const nativePort = await freePort();
  // Disposable baseline process. No real .env, sessions, DB, OIDC, ArcGIS or accounts.
  const legacy = launch("./server", {
    PORT: String(port), SESSION_SECRET: "synthetic-test-only-session-secret", SESSION_STORE: "memory",
    PGUSER: "test", PGHOST: "127.0.0.1", PGPORT: "1", PGDATABASE: "test", PGPASSWORD: "test",
    ARCGIS_TOKEN_ENDPOINT: "http://127.0.0.1:1", ARCGIS_CLIENT_ID: "test", ARCGIS_CLIENT_SECRET: "test", ARCGIS_SERVER_URL: "http://127.0.0.1:1",
    AUTH2_REQUIRE_CLIENT_HEADER: "true", AUTH2_RATE_LIMIT_STORE: "memory",
  });
  let native: ReturnType<typeof launch> | undefined;
  async function snapshot() {
    const results: unknown[] = [];
    for (const [route, headers] of [
      ["/", {}], ["/api/flightPlans/preparedFlighPlans", {}], ["/api/arcgis/token", {}],
      ["/auth2/me", { "x-lis-client": "desktop" }], ["/auth2/me", { "x-lis-client": "ios" }],
    ] as [string, Record<string, string>][]) {
      const response = await fetch(`http://127.0.0.1:${port}${route}`, { headers });
      results.push({ route, status: response.status, body: await response.text(), cookie: response.headers.get("set-cookie") });
    }
    return results;
  }
  try {
    await ready(legacy.child, port, "/");
    const before = await snapshot();
    assert.deepEqual(before.map((value: any) => value.status), [200, 401, 401, 401, 403]);
    assert.equal((before[0] as any).body, "LIS Backend is running!");
    assert.equal((before[1] as any).body, JSON.stringify({ message: "Authentication required" }));
    native = launch("./server-ios", { IOS_PORT: String(nativePort) });
    await ready(native.child, nativePort);
    assert.deepEqual(await snapshot(), before);
    await stop(native);
    assert.deepEqual(await snapshot(), before);
  } finally {
    if (native?.child.exitCode === null) native.child.kill("SIGKILL");
    legacy.child.kill("SIGTERM");
    await legacy.exited;
  }
});

test("local stop/restart leaves disposable committed-result and receipt bytes intact", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "lis-ios-rollback-"));
  const { readFile } = await import("node:fs/promises");
  const result = Buffer.from('{"planId":42,"committed":true}\n');
  const receipt = Buffer.from('{"operationId":"synthetic-operation","confirmed":true}\n');
  const port = await freePort();
  try {
    await writeFile(path.join(directory, "committed-result.json"), result);
    await writeFile(path.join(directory, "receipt.json"), receipt);
    for (let attempt = 0; attempt < 2; attempt++) {
      const run = launch("./server-ios", { IOS_PORT: String(port) }, directory);
      try { await ready(run.child, port); await stop(run); }
      finally { if (run.child.exitCode === null) run.child.kill("SIGKILL"); }
      assert.deepEqual(await readFile(path.join(directory, "committed-result.json")), result);
      assert.deepEqual(await readFile(path.join(directory, "receipt.json")), receipt);
    }
  } finally { await rm(directory, { recursive: true }); }
});


test("terminal error middleware hides unexpected exception contents", async () => {
  const app = express();
  configureRequestMiddlewareIos(app);
  app.get("/test-only-fault", () => { throw new Error("synthetic-sensitive-exception"); });
  registerApplicationRoutesIos(app);
  const server = http.createServer(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const response = await fetch(`http://127.0.0.1:${(server.address() as net.AddressInfo).port}/test-only-fault`);
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: "internal_error", version: 1 });
  } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
});
