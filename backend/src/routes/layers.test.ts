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
    const response = await fetch(catalogUrl);
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { message: "Authentication required" });
    const download = await getPackage(nn.entry.url);
    assert.equal(download.status, 401);
    await download.json();
  });

  await t.test("filters the catalog by the session region and gives admins every region", async () => {
    const response = await getCatalog();
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^application\/json(?:;|$)/);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.deepEqual(await response.json(), { layers: [nn.entry] });
    assert.deepEqual(await (await getCatalog(mnCookie)).json(), { layers: [mn.entry] });
    assert.deepEqual(await (await getCatalog(adminCookie)).json(), { layers: [nn.entry, mn.entry] });
    const denied = await getCatalog(otherCookie);
    assert.equal(denied.status, 403);
    await denied.json();
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
    assert.equal(denied.status, 404);
    await denied.json();
    const noRole = await getPackage(nn.entry.url, otherCookie);
    assert.equal(noRole.status, 403);
    await noRole.json();
  });

  await t.test("rejects unlisted versions, symlinked package paths, and an incompatible catalog", async () => {
    const retained = fixture(nn.entry.name, "NN", "older package");
    const retainedPath = path.join(layersPath, "layers_tpkx", retained.entry.sha256);
    await mkdir(retainedPath);
    await writeFile(path.join(retainedPath, retained.entry.name), retained.bytes);
    const old = await getPackage(retained.entry.url, adminCookie);
    assert.equal(old.status, 404);
    await old.json();

    const versionPath = path.join(layersPath, "layers_tpkx", nn.entry.sha256);
    const movedPath = `${versionPath}-moved`;
    await rename(versionPath, movedPath);
    await symlink(movedPath, versionPath, process.platform === "win32" ? "junction" : "dir");
    const linked = await getPackage(nn.entry.url, cookie);
    assert.equal(linked.status, 404);
    await linked.json();

    await writeFile(catalogPath, JSON.stringify([nn.entry]));
    const invalid = await getCatalog(adminCookie);
    assert.equal(invalid.status, 503);
    await invalid.json();
    const invalidPackage = await getPackage(mn.entry.url, adminCookie);
    assert.equal(invalidPackage.status, 503);
    await invalidPackage.json();
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
