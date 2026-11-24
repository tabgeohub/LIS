import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdir, mkdtemp, rename, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import express from "express";
import session from "express-session";
import { TokenSet } from "openid-client";
import layersRouter from "./layers";

const catalog = '[\r\n  {"layer_name": "Artikel20_2017.tpkx", "regio": ["NN"], "last_update": "2026-11-24"}\r\n]\r\n';

test("layers catalog API", async (t) => {
  const originalSharePath = process.env.LIS_SHARE_PATH;
  const sharePath = await mkdtemp(path.join(os.tmpdir(), "lis-layers-"));
  t.after(async () => {
    if (originalSharePath === undefined) delete process.env.LIS_SHARE_PATH;
    else process.env.LIS_SHARE_PATH = originalSharePath;
    await rm(sharePath, { recursive: true, force: true });
  });
  process.env.LIS_SHARE_PATH = sharePath;

  const layersPath = path.join(sharePath, "Layers");
  const catalogPath = path.join(layersPath, "layers.json");
  await mkdir(layersPath);
  await writeFile(catalogPath, catalog);
  await writeFile(path.join(layersPath, "other.json"), "{}");

  const app = express();
  app.use(session({ secret: "layers-test-secret", resave: false, saveUninitialized: false }));
  app.post("/fixture-login", (req, res) => {
    req.session.auth = {
      tokenSet: new TokenSet({ access_token: "fixture-access", expires_in: 3600 }),
      userInfo: { sub: "fixture-user" },
    };
    res.sendStatus(204);
  });
  app.use("/api/layers", layersRouter);

  const server = app.listen(0, "127.0.0.1");
  t.after(() => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  await once(server, "listening");
  const address = server.address();
  assert(address && typeof address !== "string");
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const catalogUrl = `${baseUrl}/api/layers/layers.json`;

  const login = await fetch(`${baseUrl}/fixture-login`, { method: "POST" });
  assert.equal(login.status, 204);
  const cookie = login.headers.get("set-cookie")?.split(";")[0];
  assert(cookie);
  const getCatalog = () => fetch(catalogUrl, { headers: { cookie } });

  await t.test("requires a LIS session", async () => {
    const response = await fetch(catalogUrl);
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { message: "Authentication required" });
  });

  await t.test("serves the catalog exactly as stored with private caching headers", async () => {
    const response = await getCatalog();
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^application\/json(?:;|$)/);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(await response.text(), catalog);
  });

  await t.test("exposes only the fixed catalog path", async () => {
    const response = await fetch(`${baseUrl}/api/layers/other.json`, { headers: { cookie } });
    assert.equal(response.status, 404);
    await response.text();
  });

  await t.test("returns 404 for a missing catalog or symbolic link", async () => {
    await rm(catalogPath);
    const missing = await getCatalog();
    assert.equal(missing.status, 404);
    assert.deepEqual(await missing.json(), { message: "Layer catalog not found." });

    await symlink(sharePath, catalogPath, process.platform === "win32" ? "junction" : "dir");
    const linked = await getCatalog();
    assert.equal(linked.status, 404);
    assert.deepEqual(await linked.json(), { message: "Layer catalog not found." });
    await rm(catalogPath, { recursive: true });
  });

  await t.test("returns 503 if the Layers directory is unavailable or a symbolic link", async () => {
    const movedLayersPath = path.join(sharePath, "MovedLayers");
    await writeFile(catalogPath, catalog);
    await rename(layersPath, movedLayersPath);
    const missing = await getCatalog();
    assert.equal(missing.status, 503);
    assert.deepEqual(await missing.json(), { message: "Layer storage is unavailable." });

    await symlink(movedLayersPath, layersPath, process.platform === "win32" ? "junction" : "dir");
    const linked = await getCatalog();
    assert.equal(linked.status, 503);
    assert.deepEqual(await linked.json(), { message: "Layer storage is unavailable." });
  });
});
