import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { mkdir, mkdtemp, rename, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import express from "express";
import session from "express-session";
import { TokenSet } from "openid-client";
import layersRouter from "./layers";

function fixture(name: string, region: string, content: string) {
  const bytes = Buffer.from(content);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  return {
    bytes,
    entry: { name, sha256, url: `packages/${sha256}/${name}`, regio: [region], last_update_date: "2026-11-25T11:00:00Z" },
  };
}

const nn = fixture("Artikel20_2017.tpkx", "NN", "NN package");
const mn = fixture("Natura2000_MN.tpkx", "MN", "MN package");
const catalog = JSON.stringify({ layers: [nn.entry, mn.entry] });

async function assertLayerError(response: Response, status: number, code: string, message: string) {
  assert.equal(response.status, status);
  const requestId = response.headers.get("x-lis-request-id");
  assert(requestId);
  assert.match(requestId, /^[0-9a-f-]{36}$/);
  assert.deepEqual(await response.json(), { message, code, request_id: requestId });
  return requestId;
}

test("layers catalog API", async (t) => {
  const logger = t.mock.method(console, "error", () => {});
  function assertLogged(requestId: string, operation: string, code: string, cause?: string) {
    const log = logger.mock.calls.find(({ arguments: [prefix, fields] }) =>
      prefix === "[layers]" && fields?.request_id === requestId
    );
    assert(log);
    assert.deepEqual(log.arguments[1], { request_id: requestId, operation, code, cause_code: cause });
  }

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
  for (const { entry, bytes } of [nn, mn]) {
    const versionPath = path.join(layersPath, "layers_tpkx", entry.sha256);
    await mkdir(versionPath, { recursive: true });
    await writeFile(path.join(versionPath, entry.name), bytes);
  }

  const app = express();
  app.use(session({ secret: "layers-test-secret", resave: false, saveUninitialized: false }));
  app.post("/fixture-login/:role", (req, res) => {
    const roles = { nn: ["RWS NN"], mn: ["EXT MN"], admin: ["admin"], other: ["other"] }[req.params.role] ?? [];
    const claims = Buffer.from(JSON.stringify({ realm_access: { roles } })).toString("base64url");
    req.session.auth = {
      tokenSet: new TokenSet({ access_token: `e30.${claims}.fixture`, expires_in: 3600 }),
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

  async function signIn(role: string) {
    const login = await fetch(`${baseUrl}/fixture-login/${role}`, { method: "POST" });
    assert.equal(login.status, 204);
    const cookie = login.headers.get("set-cookie")?.split(";")[0];
    assert(cookie);
    return cookie;
  }
  const [cookie, mnCookie, adminCookie, otherCookie] = await Promise.all(
    ["nn", "mn", "admin", "other"].map(signIn)
  );
  const getCatalog = (as = cookie) => fetch(catalogUrl, { headers: { cookie: as } });
  const getPackage = (url: string, as?: string) =>
    fetch(`${baseUrl}/api/layers/${url}`, { headers: as ? { cookie: as } : {} });

  await t.test("requires a LIS session", async () => {
    const response = await fetch(catalogUrl, { headers: { "x-lis-request-id": "caller-supplied" } });
    const catalogRequestId = await assertLayerError(response, 401, "LAYER_AUTH_REQUIRED", "Authentication required");
    const download = await getPackage(nn.entry.url);
    const downloadRequestId = await assertLayerError(download, 401, "LAYER_AUTH_REQUIRED", "Authentication required");
    assert.notEqual(catalogRequestId, downloadRequestId);
  });

  await t.test("filters the catalog by the session region and gives admins every region", async () => {
    const response = await getCatalog();
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^application\/json(?:;|$)/);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.match(response.headers.get("x-lis-request-id") ?? "", /^[0-9a-f-]{36}$/);
    assert.deepEqual(await response.json(), { layers: [nn.entry] });
    assert.deepEqual(await (await getCatalog(mnCookie)).json(), { layers: [mn.entry] });
    assert.deepEqual(await (await getCatalog(adminCookie)).json(), { layers: [nn.entry, mn.entry] });
    const denied = await getCatalog(otherCookie);
    await assertLayerError(denied, 403, "LAYER_ACCESS_DENIED", "A LIS region or admin role is required.");
  });

  await t.test("streams the authorized package version and denies out-of-region direct requests", async () => {
    for (const [pkg, account] of [[nn, cookie], [mn, mnCookie], [mn, adminCookie], [nn, adminCookie]] as const) {
      const response = await getPackage(pkg.entry.url, account);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-type"), "application/octet-stream");
      assert.equal(response.headers.get("cache-control"), "private, no-store");
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), pkg.bytes);
    }
    const denied = await getPackage(mn.entry.url, cookie);
    await assertLayerError(denied, 404, "LAYER_PACKAGE_NOT_FOUND", "Layer package not found.");
    const noRole = await getPackage(nn.entry.url, otherCookie);
    await assertLayerError(noRole, 403, "LAYER_ACCESS_DENIED", "A LIS region or admin role is required.");
  });

  await t.test("rejects unlisted versions, symlinked package paths, and an incompatible catalog", async () => {
    const retained = fixture(nn.entry.name, "NN", "older package");
    const retainedPath = path.join(layersPath, "layers_tpkx", retained.entry.sha256);
    await mkdir(retainedPath);
    await writeFile(path.join(retainedPath, retained.entry.name), retained.bytes);
    const old = await getPackage(retained.entry.url, adminCookie);
    await assertLayerError(old, 404, "LAYER_PACKAGE_NOT_FOUND", "Layer package not found.");

    const versionPath = path.join(layersPath, "layers_tpkx", nn.entry.sha256);
    const movedPath = `${versionPath}-moved`;
    await rename(versionPath, movedPath);
    await symlink(movedPath, versionPath, process.platform === "win32" ? "junction" : "dir");
    const linked = await getPackage(nn.entry.url, cookie);
    const missingId = await assertLayerError(linked, 404, "LAYER_PACKAGE_MISSING", "A published layer package is missing.");
    assertLogged(missingId, "open_package", "LAYER_PACKAGE_MISSING");

    await writeFile(catalogPath, JSON.stringify([nn.entry]));
    const invalid = await getCatalog(adminCookie);
    const invalidId = await assertLayerError(invalid, 503, "LAYER_CATALOG_INVALID", "Layer catalog is invalid.");
    assertLogged(invalidId, "validate_catalog", "LAYER_CATALOG_INVALID");
    const invalidPackage = await getPackage(mn.entry.url, adminCookie);
    await assertLayerError(invalidPackage, 503, "LAYER_CATALOG_INVALID", "Layer catalog is invalid.");
    await writeFile(catalogPath, catalog);
  });

  await t.test("exposes only the fixed catalog path", async () => {
    const response = await fetch(`${baseUrl}/api/layers/other.json`, { headers: { cookie } });
    assert.equal(response.status, 404);
    await response.text();
  });

  await t.test("returns 404 for a missing catalog or symbolic link", async () => {
    await rm(catalogPath);
    const missing = await getCatalog();
    const missingId = await assertLayerError(missing, 404, "LAYER_CATALOG_NOT_FOUND", "Layer catalog not found.");
    assertLogged(missingId, "read_catalog", "LAYER_CATALOG_NOT_FOUND");

    await symlink(sharePath, catalogPath, process.platform === "win32" ? "junction" : "dir");
    const linked = await getCatalog();
    await assertLayerError(linked, 404, "LAYER_CATALOG_NOT_FOUND", "Layer catalog not found.");
    await rm(catalogPath, { recursive: true });
  });

  await t.test("returns 503 if the Layers directory is unavailable or a symbolic link", async () => {
    const movedLayersPath = path.join(sharePath, "MovedLayers");
    await writeFile(catalogPath, catalog);
    await rename(layersPath, movedLayersPath);
    const missing = await getCatalog();
    const unavailableId = await assertLayerError(missing, 503, "LAYER_STORAGE_UNAVAILABLE", "Layer storage is unavailable.");
    assertLogged(unavailableId, "check_directory", "LAYER_STORAGE_UNAVAILABLE", "ENOENT");

    await symlink(movedLayersPath, layersPath, process.platform === "win32" ? "junction" : "dir");
    const linked = await getCatalog();
    await assertLayerError(linked, 503, "LAYER_STORAGE_UNAVAILABLE", "Layer storage is unavailable.");
  });
});
